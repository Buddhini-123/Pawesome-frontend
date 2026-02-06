import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import { orderService } from '../../../services/order.service';
import { Order } from '../../../types';
import { formatters } from '../../../utils/formatters';

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        navigate('/');
        return;
      }

      try {
        const orderData = await orderService.getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Failed to load order:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sunny-yellow"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const expectedDelivery = new Date();
  expectedDelivery.setDate(expectedDelivery.getDate() + 3); // 3 days delivery

  return (
    <div className="min-h-screen bg-soft-gray">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-mint-green bg-opacity-20 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-mint-green" />
            </div>
            
            <h1 className="text-3xl font-fredoka font-bold text-charcoal mb-4">
              Order Placed Successfully!
            </h1>
            
            <p className="text-lg text-charcoal mb-2">
              Thank you for your order
            </p>
            
            <p className="text-sm text-medium-gray mb-6">
              Order ID: <span className="font-mono font-fredoka font-bold">{order.id}</span>
            </p>

            <div className="bg-amber-50 border border-sunny-yellow rounded-lg p-4 mb-6">
              <p className="text-vibrant-orange">
                We've sent a confirmation email to <strong>{order.userEmail}</strong>
              </p>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-xl font-fredoka font-bold mb-6">Order Timeline</h2>
            
            <div className="relative">
              <div className="absolute left-5 top-8 bottom-0 w-0.5 bg-light-gray"></div>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="relative z-10 w-10 h-10 bg-mint-green rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-6">
                    <h3 className="font-fredoka font-semibold text-mint-green">Order Confirmed</h3>
                    <p className="text-sm text-medium-gray">
                      {formatters.date(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="relative z-10 w-10 h-10 bg-light-gray rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-6">
                    <h3 className="font-fredoka font-semibold text-medium-gray">Out for Delivery</h3>
                    <p className="text-sm text-medium-gray">Pending</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="relative z-10 w-10 h-10 bg-light-gray rounded-full flex items-center justify-center">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-6">
                    <h3 className="font-fredoka font-semibold text-medium-gray">Delivered</h3>
                    <p className="text-sm text-medium-gray">
                      Expected by {formatters.date(expectedDelivery)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-xl font-fredoka font-bold mb-6">Order Details</h2>
            
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex justify-between py-3 border-b">
                  <div>
                    <p className="font-fredoka font-medium">{item.productName}</p>
                    <p className="text-sm text-medium-gray">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-fredoka font-medium">
                    {formatters.currency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
              
              <div className="pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatters.currency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {order.shippingCost === 0 ? (
                      <span className="text-mint-green">FREE</span>
                    ) : (
                      formatters.currency(order.shippingCost)
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-fredoka font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatters.currency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-xl font-fredoka font-bold mb-4">Shipping Address</h2>
            <div className="text-charcoal">
              <p className="font-fredoka font-medium text-charcoal">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/orders"
              className="px-6 py-3 bg-vibrant-orange text-white rounded-lg hover:bg-vibrant-orange text-center"
            >
              View All Orders
            </Link>
            <Link
              to="/"
              className="px-6 py-3 border border-light-gray rounded-lg text-charcoal hover:bg-soft-gray text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;