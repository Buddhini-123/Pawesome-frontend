import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit
} from 'lucide-react';
import { Order, OrderStatus } from '../../../types';
import { adminOrderService, OrderFilters, OrderStats } from '../../../services/adminOrder.service';
import { formatters } from '../../../utils/formatters';
import { Badge } from '../ui/Badge';
import DataTable from '../ui/DataTable';
import OrderDetail from './OrderDetail';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  
  // Filters
  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
    status: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadOrders();
    loadStats();
  }, [currentPage, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await adminOrderService.getAllOrders(currentPage, pageSize, filters);
      setOrders(response.items);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const orderStats = await adminOrderService.getOrderStats();
      setStats(orderStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await adminOrderService.updateOrderStatus(orderId, newStatus);
      loadOrders();
      loadStats();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleExport = async () => {
    try {
      const csv = await adminOrderService.exportOrders(filters);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Error exporting orders:', error);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: OrderStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
      case 'processing':
        return 'info';
      case 'shipped':
        return 'info';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      render: (order: Order) => (
        <span className="font-fredoka font-medium">#{order.id.slice(0, 8)}</span>
      )
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (order: Order) => formatters.date(order.createdAt)
    },
    {
      key: 'userEmail',
      label: 'Customer',
      render: (order: Order) => (
        <div>
          <p className="font-fredoka text-sm">{order.userEmail}</p>
          <p className="text-xs text-gray-500">{order.shippingAddress.fullName}</p>
        </div>
      )
    },
    {
      key: 'items',
      label: 'Items',
      render: (order: Order) => (
        <span className="font-fredoka">{order.items.length} items</span>
      )
    },
    {
      key: 'totalAmount',
      label: 'Total',
      render: (order: Order) => (
        <span className="font-fredoka font-semibold">{formatters.currency(order.totalAmount)}</span>
      )
    },
    {
      key: 'paymentMethod',
      label: 'Payment',
      render: (order: Order) => (
        <div>
          <p className="font-fredoka text-sm uppercase">{order.paymentMethod}</p>
          <Badge variant={order.paymentStatus === 'completed' ? 'success' : 'warning'}>
            {order.paymentStatus}
          </Badge>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (order: Order) => (
        <Badge variant={getStatusVariant(order.status)} icon={getStatusIcon(order.status)}>
          {order.status}
        </Badge>
      )
    }
  ];

  const renderActions = (order: Order) => (
    <div className="flex gap-2">
      <button
        onClick={() => {
          setSelectedOrder(order);
          setShowOrderDetail(true);
        }}
        className="text-primary-blue hover:text-blue-700 p-1"
        title="View Details"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          setSelectedOrder(order);
          setShowOrderDetail(true);
        }}
        className="text-gray-600 hover:text-gray-800 p-1"
        title="Edit Status"
      >
        <Edit className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-fredoka">Total Orders</p>
                <p className="text-2xl font-fredoka font-bold text-charcoal">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-primary-blue/10 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-blue" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-fredoka">Total Revenue</p>
                <p className="text-2xl font-fredoka font-bold text-charcoal">
                  {formatters.currency(stats.totalRevenue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-mint-green/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-mint-green" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-fredoka">Today's Revenue</p>
                <p className="text-2xl font-fredoka font-bold text-charcoal">
                  {formatters.currency(stats.todayRevenue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-sunny-yellow/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-vibrant-orange" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-fredoka">Pending Orders</p>
                <p className="text-2xl font-fredoka font-bold text-charcoal">
                  {stats.pendingOrders + stats.processingOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-lavender/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-lavender" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-fredoka font-bold text-charcoal">Orders Management</h2>
            
            <div className="flex flex-wrap gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as OrderStatus | 'all' })}
                className="px-4 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg font-fredoka hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-primary-blue text-white rounded-lg font-fredoka hover:bg-blue-600 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-fredoka text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={filters.paymentMethod || ''}
                    onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka"
                  >
                    <option value="">All Methods</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="netbanking">Net Banking</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-fredoka text-gray-700 mb-1">Payment Status</label>
                  <select
                    value={filters.paymentStatus || ''}
                    onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-fredoka text-gray-700 mb-1">Date Range</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value ? new Date(e.target.value) : undefined })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-fredoka"
                    />
                    <input
                      type="date"
                      onChange={(e) => setFilters({ ...filters, dateTo: e.target.value ? new Date(e.target.value) : undefined })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-fredoka"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="font-fredoka text-gray-500">No orders found</p>
          </div>
        ) : (
          <>
            <DataTable
              data={orders}
              columns={columns}
              actions={renderActions}
            />

            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-600 font-fredoka">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, orders.length)} of {orders.length} orders
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg font-fredoka disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-lg font-fredoka ${
                      currentPage === i + 1
                        ? 'bg-primary-blue text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg font-fredoka disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          isOpen={showOrderDetail}
          onClose={() => {
            setShowOrderDetail(false);
            setSelectedOrder(null);
          }}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default OrderList;