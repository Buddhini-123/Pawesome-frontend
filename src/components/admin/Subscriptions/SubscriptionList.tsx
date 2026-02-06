import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  Package,
  Play,
  Pause,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  MoreVertical,
  User,
  Clock,
  DollarSign,
  Repeat,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Subscription } from '../../../types';
import { adminSubscriptionService, SubscriptionFilters, SubscriptionStats } from '../../../services/adminSubscription.service';
import { formatters } from '../../../utils/formatters';
import { Badge } from '../ui/Badge';
import DataTable from '../ui/DataTable';
import SubscriptionDetail from './SubscriptionDetail';

const SubscriptionList: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Array<Subscription & { customerName: string; customerEmail: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [showSubscriptionDetail, setShowSubscriptionDetail] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  
  // Filters
  const [filters, setFilters] = useState<SubscriptionFilters>({
    search: '',
    status: 'all',
    frequency: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadSubscriptions();
    loadStats();
  }, [currentPage, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await adminSubscriptionService.getAllSubscriptions(currentPage, pageSize, filters);
      setSubscriptions(response.items);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const subscriptionStats = await adminSubscriptionService.getSubscriptionStats();
      setStats(subscriptionStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleStatusUpdate = async (subscriptionId: string, newStatus: 'active' | 'paused' | 'cancelled') => {
    try {
      await adminSubscriptionService.updateSubscriptionStatus(subscriptionId, newStatus);
      loadSubscriptions();
      loadStats();
    } catch (error) {
      console.error('Error updating subscription status:', error);
    }
  };

  const handleExport = async () => {
    try {
      const csv = await adminSubscriptionService.exportSubscriptions(filters);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscriptions-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Error exporting subscriptions:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'paused':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'text-green-600 bg-green-100';
      case 'weekly':
        return 'text-blue-600 bg-blue-100';
      case 'monthly':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const columns = [
    {
      key: 'customer',
      label: 'Customer',
      render: (subscription: any) => (
        <div>
          <p className="font-fredoka font-medium">{subscription.customerName}</p>
          <p className="text-sm text-gray-500">{subscription.customerEmail}</p>
        </div>
      )
    },
    {
      key: 'name',
      label: 'Subscription',
      render: (subscription: any) => (
        <div>
          <p className="font-fredoka font-medium">{subscription.name}</p>
          <p className="text-sm text-gray-500">{subscription.products.length} products</p>
        </div>
      )
    },
    {
      key: 'frequency',
      label: 'Frequency',
      render: (subscription: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-fredoka font-medium ${getFrequencyColor(subscription.frequency)}`}>
          {subscription.frequency}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (subscription: any) => (
        <Badge variant={getStatusVariant(subscription.status)} icon={getStatusIcon(subscription.status)}>
          {subscription.status}
        </Badge>
      )
    },
    {
      key: 'total',
      label: 'Value',
      render: (subscription: any) => (
        <div>
          <p className="font-fredoka font-semibold">{formatters.currency(subscription.total)}</p>
          <p className="text-xs text-gray-500">per {subscription.frequency.slice(0, -2)}</p>
        </div>
      )
    },
    {
      key: 'nextDelivery',
      label: 'Next Delivery',
      render: (subscription: any) => (
        <div>
          <p className="font-fredoka text-sm">{formatters.date(subscription.nextDelivery)}</p>
          <p className="text-xs text-gray-500">{formatters.timeAgo(subscription.nextDelivery)}</p>
        </div>
      )
    },
    {
      key: 'startDate',
      label: 'Started',
      render: (subscription: any) => (
        <div>
          <p className="font-fredoka text-sm">{formatters.date(subscription.startDate)}</p>
          <p className="text-xs text-gray-500">{formatters.timeAgo(subscription.startDate)}</p>
        </div>
      )
    }
  ];

  const renderActions = (subscription: any) => (
    <div className="flex gap-2">
      <button
        onClick={() => {
          setSelectedSubscription(subscription);
          setShowSubscriptionDetail(true);
        }}
        className="text-primary-blue hover:text-blue-700 p-1"
        title="View Details"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          setSelectedSubscription(subscription);
          setShowSubscriptionDetail(true);
        }}
        className="text-gray-600 hover:text-gray-800 p-1"
        title="Edit Subscription"
      >
        <Edit className="w-4 h-4" />
      </button>
      <div className="relative group">
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <MoreVertical className="w-4 h-4" />
        </button>
        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
          {subscription.status !== 'active' && (
            <button
              onClick={() => handleStatusUpdate(subscription.id, 'active')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Play className="w-3 h-3" />
              Activate
            </button>
          )}
          {subscription.status === 'active' && (
            <button
              onClick={() => handleStatusUpdate(subscription.id, 'paused')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Pause className="w-3 h-3" />
              Pause
            </button>
          )}
          <button
            onClick={() => handleStatusUpdate(subscription.id, 'cancelled')}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <X className="w-3 h-3" />
            Cancel
          </button>
        </div>
      </div>
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
                <p className="text-sm text-gray-600 font-fredoka">Total Subscriptions</p>
                <p className="text-2xl font-fredoka font-bold text-charcoal">{stats.totalSubscriptions}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {stats.activeSubscriptions} active
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-primary-blue/10 rounded-xl flex items-center justify-center">
                <Repeat className="w-6 h-6 text-primary-blue" />
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
                <p className="text-sm text-gray-600 font-fredoka">Monthly Revenue</p>
                <p className="text-2xl font-fredoka font-bold text-charcoal">
                  {formatters.currency(stats.monthlyRevenue)}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+12.5%</span>
                </div>
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
                <p className="text-sm text-gray-600 font-fredoka">Average Value</p>
                <p className="text-2xl font-fredoka font-bold text-charcoal">
                  {formatters.currency(stats.averageSubscriptionValue)}
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500">per subscription</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-sunny-yellow/10 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-vibrant-orange" />
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
                <p className="text-sm text-gray-600 font-fredoka">Churn Rate</p>
                <p className="text-2xl font-fredoka font-bold text-charcoal">{stats.churnRate}%</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                  <span className="text-xs text-red-600">-2.1%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-lavender/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-lavender" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Subscriptions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-fredoka font-bold text-charcoal">Subscription Management</h2>
            
            <div className="flex flex-wrap gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search subscriptions..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                className="px-4 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Frequency Filter */}
              <select
                value={filters.frequency}
                onChange={(e) => setFilters({ ...filters, frequency: e.target.value as any })}
                className="px-4 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
              >
                <option value="all">All Frequencies</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
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

              {/* Add Subscription Button */}
              <button className="px-4 py-2 bg-mint-green text-white rounded-lg font-fredoka hover:bg-green-600 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Plan
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

                <div>
                  <label className="block text-sm font-fredoka text-gray-700 mb-1">Value Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      onChange={(e) => setFilters({ ...filters, minValue: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-fredoka"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      onChange={(e) => setFilters({ ...filters, maxValue: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-fredoka"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ search: '', status: 'all', frequency: 'all' })}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-fredoka hover:bg-gray-50"
                  >
                    Clear Filters
                  </button>
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
        ) : subscriptions.length === 0 ? (
          <div className="p-12 text-center">
            <Repeat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="font-fredoka text-gray-500">No subscriptions found</p>
          </div>
        ) : (
          <>
            <DataTable
              data={subscriptions}
              columns={columns}
              actions={renderActions}
            />

            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-600 font-fredoka">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, subscriptions.length)} of {subscriptions.length} subscriptions
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

      {/* Subscription Detail Modal */}
      {selectedSubscription && (
        <SubscriptionDetail
          subscription={selectedSubscription}
          isOpen={showSubscriptionDetail}
          onClose={() => {
            setShowSubscriptionDetail(false);
            setSelectedSubscription(null);
          }}
          onSubscriptionUpdate={() => {
            loadSubscriptions();
            loadStats();
          }}
        />
      )}
    </div>
  );
};

export default SubscriptionList;