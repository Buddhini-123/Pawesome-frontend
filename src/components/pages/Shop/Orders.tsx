import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, Calendar, Truck, Eye, ChevronRight, Search,
  Filter, CheckCircle, Clock, XCircle, AlertCircle, ShoppingBag,
  RotateCcw, Pause, Play, SkipForward, Ban
} from 'lucide-react';
import { ordersService } from '../../../services/orders.service';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { api } from '../../../services/api';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<'all' | 'regular' | 'subscription'>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter, orderTypeFilter]);

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

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by order type
    if (orderTypeFilter === 'subscription') {
      filtered = filtered.filter(order => order.is_subscription_order);
    } else if (orderTypeFilter === 'regular') {
      filtered = filtered.filter(order => !order.is_subscription_order);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order =>
        (order.orderStatus || order.status)?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.id?.toString().includes(searchQuery) ||
        order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.order_number?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  // Subscription action handlers
  const handlePauseSubscription = async (subscriptionId: number) => {
    if (!window.confirm('Pause this subscription?')) return;

    try {
      const response = await api.put(`/subscriptions/${subscriptionId}/pause`, {
        reason: 'User requested pause'
      });
      if (response.success) {
        toast.success('Subscription paused successfully');
        loadOrders();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to pause subscription');
    }
  };

  const handleResumeSubscription = async (subscriptionId: number) => {
    try {
      const response = await api.put(`/subscriptions/${subscriptionId}/resume`, {});
      if (response.success) {
        toast.success('Subscription resumed successfully');
        loadOrders();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to resume subscription');
    }
  };

  const handleSkipDelivery = async (subscriptionId: number) => {
    if (!window.confirm('Skip the next delivery?')) return;

    try {
      const response = await api.put(`/subscriptions/${subscriptionId}/skip-delivery`, {
        reason: 'User requested skip'
      });
      if (response.success) {
        toast.success('Next delivery skipped successfully');
        loadOrders();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to skip delivery');
    }
  };

  const handleCancelSubscription = async (subscriptionId: number) => {
    if (!window.confirm('Are you sure you want to cancel this subscription? This action cannot be undone.')) return;

    try {
      const response = await api.delete(`/subscriptions/${subscriptionId}/cancel`);
      if (response.success) {
        toast.success('Subscription cancelled successfully');
        loadOrders();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel subscription');
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bgColor: string; icon: any; label: string }> = {
      pending: {
        color: 'text-charcoal',
        bgColor: 'bg-sunny-yellow/20 border-sunny-yellow',
        icon: Clock,
        label: 'Pending'
      },
      confirmed: {
        color: 'text-primary-blue',
        bgColor: 'bg-primary-blue/10 border-primary-blue',
        icon: CheckCircle,
        label: 'Confirmed'
      },
      processing: {
        color: 'text-lavender',
        bgColor: 'bg-lavender/20 border-lavender',
        icon: Package,
        label: 'Processing'
      },
      shipped: {
        color: 'text-calm-blue',
        bgColor: 'bg-calm-blue/20 border-calm-blue',
        icon: Truck,
        label: 'Shipped'
      },
      delivered: {
        color: 'text-mint-green',
        bgColor: 'bg-mint-green/20 border-mint-green',
        icon: CheckCircle,
        label: 'Delivered'
      },
      cancelled: {
        color: 'text-crimson',
        bgColor: 'bg-crimson/10 border-crimson',
        icon: XCircle,
        label: 'Cancelled'
      },
      failed: {
        color: 'text-crimson',
        bgColor: 'bg-crimson/10 border-crimson',
        icon: AlertCircle,
        label: 'Failed'
      },
    };
    return configs[status] || configs.pending;
  };

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => (o.orderStatus || o.status) === 'pending').length,
    confirmed: orders.filter(o => (o.orderStatus || o.status) === 'confirmed').length,
    processing: orders.filter(o => (o.orderStatus || o.status) === 'processing').length,
    shipped: orders.filter(o => (o.orderStatus || o.status) === 'shipped').length,
    delivered: orders.filter(o => (o.orderStatus || o.status) === 'delivered').length,
    cancelled: orders.filter(o => (o.orderStatus || o.status) === 'cancelled').length,
  };

  const orderTypeCounts = {
    all: orders.length,
    regular: orders.filter(o => !o.is_subscription_order).length,
    subscription: orders.filter(o => o.is_subscription_order).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-gray via-white to-soft-gray flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-vibrant-orange border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-medium-gray font-fredoka">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-gray via-white to-soft-gray">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-vibrant-orange to-sunny-yellow rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-fredoka font-bold text-charcoal">
                My Orders
              </h1>
              <p className="text-medium-gray">
                Track and manage all your purchases
              </p>
            </div>
          </div>
        </motion.div>

        {/* Order Type Filter Tabs */}
        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex gap-3 bg-white rounded-2xl p-2 shadow-md border border-light-gray">
              <button
                onClick={() => setOrderTypeFilter('all')}
                className={`flex-1 px-6 py-3 rounded-xl font-fredoka font-bold transition-all ${
                  orderTypeFilter === 'all'
                    ? 'bg-gradient-to-r from-vibrant-orange to-sunny-yellow text-white shadow-lg'
                    : 'text-medium-gray hover:bg-soft-gray'
                }`}
              >
                📦 All Orders ({orderTypeCounts.all})
              </button>
              <button
                onClick={() => setOrderTypeFilter('regular')}
                className={`flex-1 px-6 py-3 rounded-xl font-fredoka font-bold transition-all ${
                  orderTypeFilter === 'regular'
                    ? 'bg-primary-blue text-white shadow-lg'
                    : 'text-medium-gray hover:bg-soft-gray'
                }`}
              >
                🛍️ Regular ({orderTypeCounts.regular})
              </button>
              <button
                onClick={() => setOrderTypeFilter('subscription')}
                className={`flex-1 px-6 py-3 rounded-xl font-fredoka font-bold transition-all ${
                  orderTypeFilter === 'subscription'
                    ? 'bg-mint-green text-white shadow-lg'
                    : 'text-medium-gray hover:bg-soft-gray'
                }`}
              >
                🔄 Subscriptions ({orderTypeCounts.subscription})
              </button>
            </div>
          </motion.div>
        )}

        {/* Stats Overview */}
        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          >
            <div className="bg-white rounded-2xl p-4 shadow-md border border-light-gray">
              <p className="text-sm text-medium-gray mb-1">Total Orders</p>
              <p className="text-2xl font-fredoka font-bold text-charcoal">{orders.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md border border-light-gray">
              <p className="text-sm text-medium-gray mb-1">Total Spent</p>
              <p className="text-2xl font-fredoka font-bold text-vibrant-orange">
                Rs. {orders.reduce((sum, o) => sum + parseFloat(o.total_amount || o.totalAmount || o.total || 0), 0).toFixed(0)}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md border border-light-gray">
              <p className="text-sm text-medium-gray mb-1">Active Subscriptions</p>
              <p className="text-2xl font-fredoka font-bold text-mint-green">
                {orders.filter(o => o.is_subscription_order && o.subscription?.status === 'active').length}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md border border-light-gray">
              <p className="text-sm text-medium-gray mb-1">Delivered</p>
              <p className="text-2xl font-fredoka font-bold text-primary-blue">{statusCounts.delivered}</p>
            </div>
          </motion.div>
        )}

        {/* Filters Section */}
        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-light-gray"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-medium-gray" />
                  <input
                    type="text"
                    placeholder="Search by order number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-light-gray rounded-2xl focus:border-vibrant-orange focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="md:w-64">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-medium-gray" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-light-gray rounded-2xl focus:border-vibrant-orange focus:outline-none appearance-none bg-white transition-colors"
                  >
                    <option value="all">All Orders ({statusCounts.all})</option>
                    {statusCounts.pending > 0 && <option value="pending">Pending ({statusCounts.pending})</option>}
                    {statusCounts.confirmed > 0 && <option value="confirmed">Confirmed ({statusCounts.confirmed})</option>}
                    {statusCounts.processing > 0 && <option value="processing">Processing ({statusCounts.processing})</option>}
                    {statusCounts.shipped > 0 && <option value="shipped">Shipped ({statusCounts.shipped})</option>}
                    {statusCounts.delivered > 0 && <option value="delivered">Delivered ({statusCounts.delivered})</option>}
                    {statusCounts.cancelled > 0 && <option value="cancelled">Cancelled ({statusCounts.cancelled})</option>}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders List */}
        <AnimatePresence mode="wait">
          {filteredOrders.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-lg p-12 text-center border border-light-gray"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-soft-gray to-light-gray rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-medium-gray" />
              </div>
              <h2 className="text-2xl font-fredoka font-bold text-charcoal mb-3">
                {searchQuery || statusFilter !== 'all' ? 'No Orders Found' : 'No Orders Yet'}
              </h2>
              <p className="text-medium-gray mb-8 max-w-md mx-auto">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : "You haven't placed any orders yet. Start shopping to see your orders here!"
                }
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-vibrant-orange to-sunny-yellow text-white rounded-2xl hover:shadow-xl transition-all font-fredoka font-bold text-lg"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Start Shopping
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order, index) => {
                const statusConfig = getStatusConfig(order.orderStatus || order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.05 * index }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-light-gray overflow-hidden group"
                  >
                    {/* Order Header with Status Band */}
                    <div className={`${statusConfig.bgColor} border-b px-6 py-4`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${statusConfig.bgColor} rounded-2xl flex items-center justify-center border-2 ${statusConfig.color.replace('text-', 'border-')}`}>
                            <StatusIcon className={`h-6 w-6 ${statusConfig.color}`} />
                          </div>
                          <div>
                            <h3 className="font-fredoka font-bold text-lg text-charcoal flex items-center gap-2">
                              Order #{order.order_number || order.id}
                              {order.is_subscription_order && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-fredoka font-bold bg-mint-green text-white">
                                  <RotateCcw className="h-3 w-3" />
                                  Subscription
                                </span>
                              )}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 mt-1">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-fredoka font-bold ${statusConfig.bgColor} ${statusConfig.color} border`}>
                                <StatusIcon className="h-3 w-3" />
                                {statusConfig.label}
                              </span>
                              <span className="text-sm text-medium-gray flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(order.createdAt || order.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Link
                          to={`/orders/${order.id}`}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-blue text-white rounded-2xl hover:shadow-lg transition-all font-fredoka font-bold group-hover:gap-3"
                        >
                          <span>View Details</span>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>

                    {/* Order Content */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Items Preview */}
                        <div className="md:col-span-2">
                          <p className="text-sm font-fredoka font-semibold text-medium-gray mb-3">
                            Order Items ({order.items?.length || 0})
                          </p>
                          <div className="space-y-2">
                            {order.items && order.items.slice(0, 3).map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-3 text-sm">
                                <div className="w-12 h-12 bg-soft-gray rounded-2xl flex items-center justify-center flex-shrink-0">
                                  {item.product?.primary_image?.url ? (
                                    <img
                                      src={item.product.primary_image.url}
                                      alt={item.product_name_snapshot || item.productName || item.product?.name}
                                      className="w-full h-full object-cover rounded-2xl"
                                    />
                                  ) : (
                                    <Package className="h-6 w-6 text-medium-gray" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-charcoal truncate">
                                    {item.product_name_snapshot || item.productName || item.product?.name}
                                  </p>
                                  <p className="text-xs text-medium-gray">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-fredoka font-semibold text-charcoal whitespace-nowrap">
                                  Rs. {(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                            {order.items && order.items.length > 3 && (
                              <p className="text-sm text-medium-gray italic pl-15">
                                +{order.items.length - 3} more items
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gradient-to-br from-soft-gray to-white rounded-2xl p-4 border border-light-gray">
                          <p className="text-sm font-fredoka font-semibold text-medium-gray mb-3">
                            Order Summary
                          </p>
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-medium-gray">Items Total</span>
                              <span className="font-medium">
                                Rs. {parseFloat(order.subtotal || order.sub_total || order.totalAmount || order.total_amount || order.total || 0).toFixed(2)}
                              </span>
                            </div>
                            {(order.shipping_cost || order.shippingCost) && parseFloat(order.shipping_cost || order.shippingCost || 0) > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-medium-gray">Shipping</span>
                                <span className="font-medium">Rs. {parseFloat(order.shipping_cost || order.shippingCost || 0).toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                          <div className="pt-3 border-t-2 border-light-gray">
                            <div className="flex justify-between items-center">
                              <span className="font-fredoka font-semibold text-charcoal">Total</span>
                              <span className="text-2xl font-fredoka font-bold text-vibrant-orange">
                                Rs. {parseFloat(order.total_amount || order.totalAmount || order.total || 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tracking Number */}
                      {order.trackingNumber && (
                        <div className="mt-4 pt-4 border-t border-light-gray">
                          <div className="flex items-center gap-2 text-sm bg-primary-blue/10 px-4 py-2 rounded-2xl border border-primary-blue">
                            <Truck className="h-4 w-4 text-primary-blue" />
                            <span className="text-medium-gray">Tracking:</span>
                            <span className="font-mono font-bold text-primary-blue">
                              {order.trackingNumber}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Subscription Information */}
                      {order.is_subscription_order && order.subscription && (
                        <div className="mt-4 pt-4 border-t border-light-gray">
                          <div className="bg-gradient-to-br from-mint-green/10 to-primary-blue/10 rounded-2xl p-6 border-2 border-mint-green/30">
                            <div className="flex items-center gap-2 mb-4">
                              <RotateCcw className="h-5 w-5 text-mint-green" />
                              <h4 className="font-fredoka font-bold text-lg text-charcoal">
                                Subscription Details
                              </h4>
                              <span className={`ml-auto px-3 py-1 rounded-full text-xs font-fredoka font-bold ${
                                order.subscription.status === 'active' ? 'bg-mint-green text-white' :
                                order.subscription.status === 'paused' ? 'bg-vibrant-orange text-white' :
                                'bg-crimson text-white'
                              }`}>
                                {order.subscription.status?.toUpperCase()}
                              </span>
                            </div>

                            {/* Delivery Schedule */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="bg-white rounded-xl p-3 border border-light-gray">
                                <p className="text-xs text-medium-gray mb-1">Delivery Frequency</p>
                                <p className="font-fredoka font-semibold text-charcoal">
                                  Every {order.subscription.interval_value} {order.subscription.interval_type}
                                </p>
                              </div>
                              {order.subscription.next_delivery_date && (
                                <div className="bg-white rounded-xl p-3 border border-light-gray">
                                  <p className="text-xs text-medium-gray mb-1">Next Delivery</p>
                                  <p className="font-fredoka font-semibold text-mint-green">
                                    {new Date(order.subscription.next_delivery_date).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Delivery Progress */}
                            {order.subscription.total_deliveries > 0 && (
                              <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                  <p className="text-sm font-fredoka font-semibold text-charcoal">
                                    Delivery Progress
                                  </p>
                                  <p className="text-sm font-fredoka font-bold text-mint-green">
                                    {order.subscription.completed_deliveries} / {order.subscription.total_deliveries}
                                    {order.subscription.remaining_deliveries > 0 && (
                                      <span className="text-medium-gray ml-2">
                                        ({order.subscription.remaining_deliveries} remaining)
                                      </span>
                                    )}
                                  </p>
                                </div>
                                {/* Progress Bar */}
                                <div className="w-full h-3 bg-soft-gray rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${(order.subscription.completed_deliveries / order.subscription.total_deliveries) * 100}%`
                                    }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-mint-green to-primary-blue rounded-full"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Subscription Actions */}
                            {/* {order.subscription.status === 'active' && (
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => handlePauseSubscription(order.subscription.id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-vibrant-orange text-white rounded-xl hover:shadow-lg transition-all font-fredoka font-medium text-sm"
                                >
                                  <Pause className="h-4 w-4" />
                                  Pause
                                </button>
                                <button
                                  onClick={() => handleSkipDelivery(order.subscription.id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-sunny-yellow text-charcoal rounded-xl hover:shadow-lg transition-all font-fredoka font-medium text-sm"
                                >
                                  <SkipForward className="h-4 w-4" />
                                  Skip Next
                                </button>
                                <button
                                  onClick={() => handleCancelSubscription(order.subscription.id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-crimson text-crimson rounded-xl hover:bg-crimson hover:text-white transition-all font-fredoka font-medium text-sm"
                                >
                                  <Ban className="h-4 w-4" />
                                  Cancel
                                </button>
                              </div>
                            )} */}

                            {order.subscription.status === 'paused' && (
                              <button
                                onClick={() => handleResumeSubscription(order.subscription.id)}
                                className="flex items-center gap-2 px-6 py-3 bg-mint-green text-white rounded-xl hover:shadow-lg transition-all font-fredoka font-bold"
                              >
                                <Play className="h-4 w-4" />
                                Resume Subscription
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Orders;
