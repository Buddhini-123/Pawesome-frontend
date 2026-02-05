import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Package, Truck, X,
  MapPin, CreditCard, Gift, Tag, Award, Calendar,
  Download, Printer, RefreshCw
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

      // Reload order data
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-gray">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibrant-orange mx-auto mb-4"></div>
          <p className="text-medium-gray">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-soft-gray">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-fredoka font-bold text-charcoal mb-2">
                  Order Details
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-medium-gray">
                  <span className="font-mono font-bold text-charcoal">
                    {order.order_number || `#${order.id}`}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-fredoka font-semibold ${getStatusColor(order.order_status)}`}>
                    {order.status_label || order.order_status}
                  </span>
                  {order.created_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-soft-gray text-charcoal rounded-lg hover:bg-light-gray transition-colors flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </button>
                <button
                  onClick={() => toast.info('Invoice download feature coming soon')}
                  className="px-4 py-2 bg-soft-gray text-charcoal rounded-lg hover:bg-light-gray transition-colors flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Invoice
                </button>
              </div>
            </div>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
          >
            <h2 className="text-xl font-fredoka font-bold text-charcoal mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-vibrant-orange" />
              Order Items ({order.items?.length || 0})
            </h2>

            <div className="space-y-4">
              {order.items?.map((item: any, index: number) => (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex gap-4 p-4 border border-light-gray rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-20 h-20 bg-soft-gray rounded-lg overflow-hidden">
                    {item.product?.primary_image?.url ? (
                      <img
                        src={item.product.primary_image.url}
                        alt={item.product?.name || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-medium-gray" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-fredoka font-semibold text-charcoal mb-1">
                      {item.product?.name || item.product_name || 'Product'}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-medium-gray mb-2">
                      {item.product?.brand?.name && (
                        <span className="px-2 py-1 bg-soft-gray rounded">
                          {item.product.brand.name}
                        </span>
                      )}
                      {item.product?.category?.name && (
                        <span className="px-2 py-1 bg-soft-gray rounded">
                          {item.product.category.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-medium-gray">Qty: {item.quantity}</span>
                      <span className="text-medium-gray">×</span>
                      <span className="font-fredoka font-semibold text-charcoal">
                        {order.currency || 'Rs.'} {parseFloat(item.price || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="flex-shrink-0 text-right">
                    <p className="font-fredoka font-bold text-lg text-vibrant-orange">
                      {order.currency || 'Rs.'} {(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-fredoka font-bold text-charcoal mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-vibrant-orange" />
                Shipping Address
              </h2>
              {order.shipping_address ? (
                <div className="text-charcoal space-y-1">
                  <p className="font-fredoka font-semibold">{order.shipping_address.full_name || order.shipping_address.name}</p>
                  <p className="text-sm">{order.shipping_address.address_line_1}</p>
                  {order.shipping_address.address_line_2 && (
                    <p className="text-sm">{order.shipping_address.address_line_2}</p>
                  )}
                  <p className="text-sm">
                    {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postal_code}
                  </p>
                  {order.shipping_address.phone && (
                    <p className="text-sm flex items-center gap-1 pt-2">
                      <span className="text-medium-gray">Phone:</span>
                      <span className="font-medium">{order.shipping_address.phone}</span>
                    </p>
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
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-fredoka font-bold text-charcoal mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-vibrant-orange" />
                Pricing Breakdown
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-charcoal">
                  <span>Subtotal</span>
                  <span className="font-fredoka font-semibold">
                    {order.currency || 'Rs.'} {parseFloat(order.subtotal || 0).toFixed(2)}
                  </span>
                </div>

                {order.shipping_cost && parseFloat(order.shipping_cost) > 0 && (
                  <div className="flex justify-between text-charcoal">
                    <span>Shipping</span>
                    <span className="font-fredoka font-semibold">
                      {order.currency || 'Rs.'} {parseFloat(order.shipping_cost).toFixed(2)}
                    </span>
                  </div>
                )}

                {order.tax_amount && parseFloat(order.tax_amount) > 0 && (
                  <div className="flex justify-between text-charcoal">
                    <span>Tax</span>
                    <span className="font-fredoka font-semibold">
                      {order.currency || 'Rs.'} {parseFloat(order.tax_amount).toFixed(2)}
                    </span>
                  </div>
                )}

                {order.loyalty_points_discount && parseFloat(order.loyalty_points_discount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      Loyalty Points Discount
                    </span>
                    <span className="font-fredoka font-semibold">
                      -{order.currency || 'Rs.'} {parseFloat(order.loyalty_points_discount).toFixed(2)}
                    </span>
                  </div>
                )}

                {order.coupon_discount && parseFloat(order.coupon_discount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      Coupon Discount
                      {order.coupon_code && (
                        <span className="text-xs">({order.coupon_code})</span>
                      )}
                    </span>
                    <span className="font-fredoka font-semibold">
                      -{order.currency || 'Rs.'} {parseFloat(order.coupon_discount).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t-2 border-light-gray">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-fredoka font-bold text-charcoal">Total</span>
                    <span className="text-2xl font-fredoka font-bold text-vibrant-orange">
                      {order.currency || 'Rs.'} {parseFloat(order.total_amount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {order.payment_method && (
                  <div className="pt-2 border-t border-light-gray text-sm text-medium-gray">
                    Payment Method: <span className="font-medium text-charcoal">{order.payment_method}</span>
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
              className="bg-white rounded-lg shadow-md p-6 mt-6"
            >
              <h2 className="text-xl font-fredoka font-bold text-charcoal mb-4 flex items-center gap-2">
                <Gift className="h-5 w-5 text-vibrant-orange" />
                Gift Message
              </h2>
              <div className="bg-soft-pink p-4 rounded-lg">
                <p className="text-charcoal italic">{order.gift_message}</p>
              </div>
            </motion.div>
          )}

          {/* Tracking Information */}
          {order.tracking_number && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6 mt-6"
            >
              <h2 className="text-xl font-fredoka font-bold text-charcoal mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-vibrant-orange" />
                Tracking Information
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-medium-gray mb-1">Tracking Number</p>
                  <p className="font-mono font-bold text-charcoal text-lg">{order.tracking_number}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(order.tracking_number);
                    toast.success('Tracking number copied!');
                  }}
                  className="px-4 py-2 bg-vibrant-orange text-white rounded-lg hover:bg-sunny-yellow transition-colors"
                >
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
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            {order.can_cancel && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {cancelling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Cancelling...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4" />
                    Cancel Order
                  </>
                )}
              </button>
            )}

            {order.can_reorder && (
              <button
                onClick={handleReorder}
                disabled={reordering}
                className="px-6 py-3 bg-mint-green text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {reordering ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding to cart...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Reorder
                  </>
                )}
              </button>
            )}

            <Link
              to="/orders"
              className="px-6 py-3 bg-vibrant-orange text-white rounded-lg hover:bg-sunny-yellow transition-colors text-center"
            >
              View All Orders
            </Link>

            <Link
              to="/"
              className="px-6 py-3 border-2 border-light-gray rounded-lg text-charcoal hover:bg-soft-gray transition-colors text-center"
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
