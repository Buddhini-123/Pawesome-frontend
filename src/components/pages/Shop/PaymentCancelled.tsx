import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ShoppingCart, RefreshCw } from 'lucide-react';

const PaymentCancelled: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md mx-auto px-4"
      >
        <XCircle className="h-24 w-24 text-coral-red mx-auto mb-6" />
        <h2 className="text-3xl font-fredoka font-bold text-charcoal mb-2">
          Payment Cancelled
        </h2>
        <p className="text-medium-gray mb-8">
          You cancelled the payment. Your order has been saved — you can retry payment from your orders page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/orders')}
            className="bg-lavender text-white px-6 py-3 rounded-xl font-fredoka font-semibold hover:bg-lavender/90 transition-colors flex items-center gap-2 justify-center"
          >
            <RefreshCw className="h-5 w-5" />
            My Orders
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="bg-soft-gray text-charcoal px-6 py-3 rounded-xl font-fredoka font-semibold hover:bg-light-gray transition-colors flex items-center gap-2 justify-center"
          >
            <ShoppingCart className="h-5 w-5" />
            Back to Cart
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentCancelled;
