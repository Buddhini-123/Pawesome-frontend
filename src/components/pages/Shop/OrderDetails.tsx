import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Package, Truck, X,
  MapPin, CreditCard, Gift, Tag, Award, Calendar,
  Download, Printer, RefreshCw, ChevronLeft, CheckCircle,
  Clock, AlertCircle, Copy, Phone, Mail
} from 'lucide-react';
import { ordersService } from '../../../services/orders.service';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        navigate('/');
        return;
      }

      try {
        const orderData = await ordersService.getOrderById(orderId);
        setOrder(orderData);
      } catch (error: any) {
        console.error('Failed to load order:', error);
        toast.error(error.message || 'Failed to load order details');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, navigate]);

  const handleCancelOrder = async () => {
    if (!orderId || !order) return;

    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancelling(true);
    try {
      await ordersService.cancelOrder(orderId);
      toast.success('Order cancelled successfully');

      const orderData = await ordersService.getOrderById(orderId);
      setOrder(orderData);
    } catch (error: any) {
      console.error('Failed to cancel order:', error);
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const handleReorder = async () => {
    if (!orderId) return;

    setReordering(true);
    try {
      await ordersService.reorderItems(orderId);
      toast.success('Items added to cart!');
      navigate('/cart');
    } catch (error: any) {
      console.error('Failed to reorder:', error);
      toast.error(error.message || 'Failed to add items to cart');
    } finally {
      setReordering(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bgColor: string; icon: any; label: string }> = {
      pending: { color: 'text-charcoal', bgColor: 'bg-sunny-yellow/20 border-sunny-yellow', icon: Clock, label: 'Pending' },
      confirmed: { color: 'text-primary-blue', bgColor: 'bg-primary-blue/10 border-primary-blue', icon: CheckCircle, label: 'Confirmed' },
      processing: { color: 'text-lavender', bgColor: 'bg-lavender/20 border-lavender', icon: Package, label: 'Processing' },
      shipped: { color: 'text-calm-blue', bgColor: 'bg-calm-blue/20 border-calm-blue', icon: Truck, label: 'Shipped' },
      delivered: { color: 'text-mint-green', bgColor: 'bg-mint-green/20 border-mint-green', icon: CheckCircle, label: 'Delivered' },
      cancelled: { color: 'text-crimson', bgColor: 'bg-crimson/10 border-crimson', icon: X, label: 'Cancelled' },
      failed: { color: 'text-crimson', bgColor: 'bg-crimson/10 border-crimson', icon: AlertCircle, label: 'Failed' },
    };
    return configs[status] || configs.pending;
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
          <p className="text-medium-gray font-fredoka">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const statusConfig = getStatusConfig(order.order_status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-gray via-white to-soft-gray">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 text-medium-gray hover:text-vibrant-orange transition-colors font-fredoka"
            >
              <ChevronLeft className="h-5 w-5" />
              Back to Orders
            </Link>
          </motion.div>

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 border border-light-gray"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-16 h-16 ${statusConfig.bgColor} rounded-2xl flex items-center justify-center border-2`}>
                    <StatusIcon className={`h-8 w-8 ${statusConfig.color}`} />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-fredoka font-bold text-charcoal mb-2">
                      Order {order.order_number || `#${order.id}`}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-fredoka font-bold ${statusConfig.bgColor} ${statusConfig.color} border-2`}>
                        <StatusIcon className="h-4 w-4" />
                        {order.status_label || statusConfig.label}
                      </span>
                      {order.created_at && (
                        <span className="flex items-center gap-2 text-sm text-medium-gray bg-soft-gray px-3 py-2 rounded-full">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-soft-gray text-charcoal rounded-2xl hover:bg-light-gray transition-all flex items-center gap-2 font-fredoka font-medium border border-light-gray"
                >
                  <Printer className="h-4 w-4" />
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  onClick={() => toast.info('Invoice download coming soon')}
                  className="px-4 py-2 bg-soft-gray text-charcoal rounded-2xl hover:bg-light-gray transition-all flex items-center gap-2 font-fredoka font-medium border border-light-gray"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Invoice</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 border border-light-gray"
          >
            <h2 className="text-xl font-fredoka font-bold text-charcoal mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-vibrant-orange to-sunny-yellow rounded-2xl flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              Order Items ({order.items?.length || 0})
            </h2>

            <div className="space-y-4">
              {order.items?.map((item: any, index: number) => (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="flex gap-4 p-4 bg-gradient-to-r from-soft-gray to-white rounded-2xl border border-light-gray hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 w-24 h-24 bg-white rounded-2xl overflow-hidden border-2 border-light-gray shadow-sm">
                    {item.product?.primary_image?.url ? (
                      <img
                        src={item.product.primary_image.url}
                        alt={item.product_name_snapshot || item.product?.name || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-soft-gray">
                        <Package className="h-10 w-10 text-medium-gray" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-fredoka font-bold text-lg text-charcoal mb-2">
                      {item.product_name_snapshot || item.product?.name || item.product_name || 'Product'}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.product?.brand?.name && (
                        <span className="px-3 py-1 bg-primary-blue/10 text-primary-blue rounded-full text-xs font-fredoka font-semibold border border-primary-blue">
                          {item.product.brand.name}
                        </span>
                      )}
                      {item.product?.category?.name && (
                        <span className="px-3 py-1 bg-lavender/20 text-lavender rounded-full text-xs font-fredoka font-semibold border border-lavender">
                          {item.product.category.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-medium-gray">Quantity: <span className="font-bold text-charcoal">{item.quantity}</span></span>
                      <span className="text-medium-gray">×</span>
                      <span className="font-fredoka font-bold text-charcoal">
                        {order.currency || 'Rs.'} {parseFloat(item.price || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <p className="font-fredoka font-bold text-2xl text-vibrant-orange">
                      {order.currency || 'Rs.'} {(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-light-gray"
            >
              <h2 className="text-xl font-fredoka font-bold text-charcoal mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-mint-green rounded-2xl flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                Delivery Address
              </h2>
              {order.shipping_address ? (
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-soft-gray to-white rounded-2xl border border-light-gray">
                    <p className="font-fredoka font-bold text-lg text-charcoal mb-2">
                      {order.shipping_address.full_name || order.shipping_address.name}
                    </p>
                    <p className="text-charcoal">{order.shipping_address.address_line_1}</p>
                    {order.shipping_address.address_line_2 && (
                      <p className="text-charcoal">{order.shipping_address.address_line_2}</p>
                    )}
                    <p className="text-charcoal">
                      {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postal_code}
                    </p>
                  </div>
                  {order.shipping_address.phone && (
                    <div className="flex items-center gap-2 text-sm text-medium-gray bg-primary-blue/10 px-4 py-3 rounded-2xl border border-primary-blue">
                      <Phone className="h-4 w-4 text-primary-blue" />
                      <span className="font-medium text-charcoal">{order.shipping_address.phone}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-medium-gray">No shipping address available</p>
              )}
            </motion.div>

            {/* Pricing Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-light-gray"
            >
              <h2 className="text-xl font-fredoka font-bold text-charcoal mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-blue rounded-2xl flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                Payment Details
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-charcoal p-3 bg-soft-gray rounded-2xl">
                  <span>Subtotal</span>
                  <span className="font-fredoka font-bold">
                    {order.currency || 'Rs.'} {parseFloat(order.subtotal || 0).toFixed(2)}
                  </span>
                </div>

                {order.shipping_cost && parseFloat(order.shipping_cost) > 0 && (
                  <div className="flex justify-between text-charcoal p-3 bg-soft-gray rounded-2xl">
                    <span>Shipping</span>
                    <span className="font-fredoka font-bold">
                      {order.currency || 'Rs.'} {parseFloat(order.shipping_cost).toFixed(2)}
                    </span>
                  </div>
                )}

                {order.tax_amount && parseFloat(order.tax_amount) > 0 && (
                  <div className="flex justify-between text-charcoal p-3 bg-soft-gray rounded-2xl">
                    <span>Tax</span>
                    <span className="font-fredoka font-bold">
                      {order.currency || 'Rs.'} {parseFloat(order.tax_amount).toFixed(2)}
                    </span>
                  </div>
                )}

                {order.loyalty_points_discount && parseFloat(order.loyalty_points_discount) > 0 && (
                  <div className="flex justify-between text-mint-green p-3 bg-mint-green/20 rounded-2xl border border-mint-green">
                    <span className="flex items-center gap-2 font-medium">
                      <Award className="h-4 w-4" />
                      Loyalty Discount
                    </span>
                    <span className="font-fredoka font-bold">
                      -{order.currency || 'Rs.'} {parseFloat(order.loyalty_points_discount).toFixed(2)}
                    </span>
                  </div>
                )}

                {order.coupon_discount && parseFloat(order.coupon_discount) > 0 && (
                  <div className="flex justify-between text-vibrant-orange p-3 bg-vibrant-orange/20 rounded-2xl border border-vibrant-orange">
                    <span className="flex items-center gap-2 font-medium">
                      <Tag className="h-4 w-4" />
                      Coupon {order.coupon_code && `(${order.coupon_code})`}
                    </span>
                    <span className="font-fredoka font-bold">
                      -{order.currency || 'Rs.'} {parseFloat(order.coupon_discount).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="pt-4 border-t-2 border-light-gray">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-vibrant-orange to-sunny-yellow rounded-2xl text-white">
                    <span className="text-lg font-fredoka font-bold">Total Amount</span>
                    <span className="text-3xl font-fredoka font-bold">
                      {order.currency || 'Rs.'} {parseFloat(order.total_amount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {order.payment_method && (
                  <div className="text-sm text-medium-gray bg-soft-gray px-4 py-3 rounded-2xl">
                    <span className="font-medium">Payment Method:</span>{' '}
                    <span className="font-bold text-charcoal">{order.payment_method}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Gift Message */}
          {order.is_gift && order.gift_message && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 border border-light-gray"
            >
              <h2 className="text-xl font-fredoka font-bold text-charcoal mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-soft-pink rounded-2xl flex items-center justify-center">
                  <Gift className="h-5 w-5 text-white" />
                </div>
                Gift Message
              </h2>
              <div className="bg-soft-pink/20 p-6 rounded-2xl border-2 border-soft-pink">
                <p className="text-charcoal italic text-lg leading-relaxed">{order.gift_message}</p>
              </div>
            </motion.div>
          )}

          {/* Tracking Information */}
          {order.tracking_number && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 border border-light-gray"
            >
              <h2 className="text-xl font-fredoka font-bold text-charcoal mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-lavender rounded-2xl flex items-center justify-center">
                  <Truck className="h-5 w-5 text-white" />
                </div>
                Tracking Information
              </h2>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-lavender/20 rounded-2xl border-2 border-lavender">
                <div className="flex-1">
                  <p className="text-sm text-medium-gray mb-1">Tracking Number</p>
                  <p className="font-mono font-bold text-charcoal text-xl">{order.tracking_number}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(order.tracking_number, 'Tracking number')}
                  className="px-6 py-3 bg-lavender text-white rounded-2xl hover:shadow-lg transition-all font-fredoka font-bold flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </button>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center"
          >
            {order.can_cancel && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="px-8 py-4 bg-crimson text-white rounded-2xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-fredoka font-bold"
              >
                {cancelling ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Cancelling...
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5" />
                    Cancel Order
                  </>
                )}
              </button>
            )}

            {order.can_reorder && (
              <button
                onClick={handleReorder}
                disabled={reordering}
                className="px-8 py-4 bg-mint-green text-white rounded-2xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-fredoka font-bold"
              >
                {reordering ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Adding to cart...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-5 w-5" />
                    Reorder Items
                  </>
                )}
              </button>
            )}

            <Link
              to="/orders"
              className="px-8 py-4 bg-gradient-to-r from-vibrant-orange to-sunny-yellow text-white rounded-2xl hover:shadow-lg transition-all text-center font-fredoka font-bold"
            >
              View All Orders
            </Link>

            <Link
              to="/"
              className="px-8 py-4 border-2 border-light-gray bg-white text-charcoal rounded-2xl hover:bg-soft-gray hover:shadow-lg transition-all text-center font-fredoka font-bold"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
