import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, ShoppingBag } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { api } from '../../../services/api';

const MAX_POLLS = 12;
const POLL_INTERVAL_MS = 3000;

const PaymentReturn: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const orderId = searchParams.get('order_id');

  const [status, setStatus] = useState<'loading' | 'success' | 'pending' | 'failed'>('loading');
  const [orderNumber, setOrderNumber] = useState('');
  const pollCount = useRef(0);

  useEffect(() => {
    if (!orderId) {
      setStatus('failed');
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        // api.get() wraps the response: { success, data: <backend json> }
        // The backend returns: { success, data: <OrderResource> }
        // So the actual order object is at res.data.data
        const order = (res.data as any)?.data as { order_number?: string; payment_status?: string };
        setOrderNumber(order?.order_number ?? '');

        if (order.payment_status === 'completed') {
          setStatus('success');
          await clearCart();
          return true; // stop polling
        }

        if (order.payment_status === 'failed') {
          setStatus('failed');
          return true;
        }

        return false; // still pending
      } catch {
        return false;
      }
    };

    const poll = async () => {
      const done = await checkStatus();
      if (done) return;

      pollCount.current += 1;
      if (pollCount.current >= MAX_POLLS) {
        setStatus('pending');
        return;
      }

      setTimeout(poll, POLL_INTERVAL_MS);
    };

    poll();
  }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative mb-6">
            <Clock className="h-20 w-20 text-lavender mx-auto animate-pulse" />
          </div>
          <h2 className="text-2xl font-fredoka font-bold text-charcoal mb-2">
            Confirming Your Payment
          </h2>
          <p className="text-medium-gray mb-6">
            Please wait while we verify your payment with PayHere...
          </p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-lavender rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-lavender rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-lavender rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </motion.div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <CheckCircle className="h-24 w-24 text-mint-green mx-auto mb-6" />
          <h2 className="text-3xl font-fredoka font-bold text-charcoal mb-2">
            Payment Successful!
          </h2>
          {orderNumber && (
            <p className="text-medium-gray mb-6">
              Order <span className="font-semibold text-charcoal">{orderNumber}</span> has been confirmed.
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(`/order-confirmation/${orderId}`)}
              className="bg-lavender text-white px-6 py-3 rounded-xl font-fredoka font-semibold hover:bg-lavender/90 transition-colors"
            >
              View Order
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="bg-soft-gray text-charcoal px-6 py-3 rounded-xl font-fredoka font-semibold hover:bg-light-gray transition-colors"
            >
              My Orders
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <Clock className="h-24 w-24 text-sunny-yellow mx-auto mb-6" />
          <h2 className="text-3xl font-fredoka font-bold text-charcoal mb-2">
            Payment Pending
          </h2>
          <p className="text-medium-gray mb-6">
            Your payment is being processed. Check your orders for the latest status.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/orders')}
              className="bg-lavender text-white px-6 py-3 rounded-xl font-fredoka font-semibold hover:bg-lavender/90 transition-colors flex items-center gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              My Orders
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // failed
  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md mx-auto px-4"
      >
        <XCircle className="h-24 w-24 text-coral-red mx-auto mb-6" />
        <h2 className="text-3xl font-fredoka font-bold text-charcoal mb-2">
          Payment Failed
        </h2>
        <p className="text-medium-gray mb-6">
          Your payment could not be completed. Please try again or contact support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/checkout')}
            className="bg-vibrant-orange text-white px-6 py-3 rounded-xl font-fredoka font-semibold hover:bg-vibrant-orange/90 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="bg-soft-gray text-charcoal px-6 py-3 rounded-xl font-fredoka font-semibold hover:bg-light-gray transition-colors"
          >
            Back to Cart
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentReturn;
