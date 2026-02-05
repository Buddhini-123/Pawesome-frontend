import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, Truck, Eye } from 'lucide-react';
import { ordersService } from '../../../services/orders.service';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const userOrders = await ordersService.getUserOrders();
      setOrders(userOrders);
    } catch (error: any) {
      console.error('Failed to load orders:', error);
      toast.error(error.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
      case 'processing':
        return Package;
      case 'shipped':
        return Truck;
      case 'delivered':
        return Package;
      default:
        return Package;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibrant-orange mx-auto mb-4"></div>
          <p className="text-medium-gray">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-gray">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-fredoka font-bold text-charcoal mb-2">
              My Orders
            </h1>
            <p className="text-medium-gray">
              View and manage your order history
            </p>
          </motion.div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-md p-12 text-center"
            >
              <Package className="h-16 w-16 text-light-gray mx-auto mb-4" />
              <h2 className="text-xl font-fredoka font-bold text-charcoal mb-2">
                No Orders Yet
              </h2>
              <p className="text-medium-gray mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here!
              </p>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-vibrant-orange text-white rounded-lg hover:bg-sunny-yellow transition-colors font-fredoka font-medium"
              >
                Start Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => {
                const StatusIcon = getStatusIcon(order.orderStatus || order.status);

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      {/* Order Header */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-soft-gray rounded-lg flex items-center justify-center">
                            <StatusIcon className="h-6 w-6 text-vibrant-orange" />
                          </div>
                          <div>
                            <h3 className="font-fredoka font-bold text-lg text-charcoal">
                              Order #{order.id}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className={`px-3 py-1 rounded-full text-xs font-fredoka font-semibold border ${getStatusColor(order.orderStatus || order.status)}`}>
                                {order.statusLabel || order.status}
                              </span>
                              <span className="text-sm text-medium-gray flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/orders/${order.id}`}
                            className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-fredoka font-medium"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Link>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="border-t border-light-gray pt-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm text-medium-gray mb-2">
                              {order.items?.length || 0} item(s)
                            </p>
                            {order.items && order.items.slice(0, 3).map((item: any, idx: number) => (
                              <p key={idx} className="text-sm text-charcoal">
                                {item.productName || item.product?.name} × {item.quantity}
                              </p>
                            ))}
                            {order.items && order.items.length > 3 && (
                              <p className="text-sm text-medium-gray italic">
                                +{order.items.length - 3} more items
                              </p>
                            )}
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-medium-gray mb-1">Order Total</p>
                            <p className="text-2xl font-fredoka font-bold text-vibrant-orange">
                              Rs. {parseFloat(order.totalAmount || order.total || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Actions Footer */}
                      {order.trackingNumber && (
                        <div className="border-t border-light-gray mt-4 pt-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Truck className="h-4 w-4 text-primary-blue" />
                            <span className="text-medium-gray">Tracking:</span>
                            <span className="font-mono font-medium text-charcoal">
                              {order.trackingNumber}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Summary Card */}
          {orders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 bg-gradient-to-br from-vibrant-orange to-sunny-yellow rounded-lg shadow-lg p-6 text-white"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-white/80 text-sm mb-1">Total Orders</p>
                  <p className="text-3xl font-fredoka font-bold">{orders.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-white/80 text-sm mb-1">Total Spent</p>
                  <p className="text-3xl font-fredoka font-bold">
                    Rs. {orders.reduce((sum, order) => sum + parseFloat(order.totalAmount || order.total || 0), 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-white/80 text-sm mb-1">Average Order</p>
                  <p className="text-3xl font-fredoka font-bold">
                    Rs. {(orders.reduce((sum, order) => sum + parseFloat(order.totalAmount || order.total || 0), 0) / orders.length).toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
