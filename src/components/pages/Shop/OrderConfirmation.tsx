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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const expectedDelivery = new Date();
  expectedDelivery.setDate(expectedDelivery.getDate() + 3); // 3 days delivery

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Order Placed Successfully!
            </h1>
            
            <p className="text-lg text-gray-600 mb-2">
              Thank you for your order
            </p>
            
            <p className="text-sm text-gray-500 mb-6">
              Order ID: <span className="font-mono font-bold">{order.id}</span>
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-800">
                We've sent a confirmation email to <strong>{order.userEmail}</strong>
              </p>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-xl font-bold mb-6">Order Timeline</h2>
            
            <div className="relative">
              <div className="absolute left-5 top-8 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="relative z-10 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-6">
                    <h3 className="font-semibold text-green-600">Order Confirmed</h3>
                    <p className="text-sm text-gray-500">
                      {formatters.date(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="relative z-10 w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-6">
                    <h3 className="font-semibold text-gray-400">Out for Delivery</h3>
                    <p className="text-sm text-gray-400">Pending</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="relative z-10 w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-6">
                    <h3 className="font-semibold text-gray-400">Delivered</h3>
                    <p className="text-sm text-gray-400">
                      Expected by {formatters.date(expectedDelivery)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-xl font-bold mb-6">Order Details</h2>
            
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
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
                      <span className="text-green-600">FREE</span>
                    ) : (
                      formatters.currency(order.shippingCost)
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatters.currency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <div className="text-gray-600">
              <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/orders"
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-center"
            >
              View All Orders
            </Link>
            <Link
              to="/"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-center"
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