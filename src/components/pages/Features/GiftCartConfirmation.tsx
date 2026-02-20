import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, ShoppingBag } from 'lucide-react';

const GiftCartConfirmation: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { itemsAdded, productsCount, recipientName } = state || {};

  console.log('GiftCartConfirmation state:', state);

  // Redirect if no state data
  React.useEffect(() => {
    if (!state || (itemsAdded === undefined && productsCount === undefined)) {
      console.log('No state data, redirecting to customize');
      navigate('/gifts/customize', { replace: true });
    }
  }, [state, itemsAdded, productsCount, navigate]);

  if (!state || (itemsAdded === undefined && productsCount === undefined)) {
    return null;
  }

  const displayCount = itemsAdded || productsCount || 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-amber-50 p-4">
      <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl">
        <div className="text-7xl mb-4">🎁</div>
        <h1 className="text-3xl font-bold text-charcoal mb-2">Added to Cart!</h1>
        {recipientName && (
          <p className="text-gray-500 mb-4">
            Gift for <strong>{recipientName}</strong>
          </p>
        )}
        <div className="bg-amber-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center space-x-2 text-lg text-charcoal">
            <ShoppingCart className="h-5 w-5 text-vibrant-orange" />
            <span className="font-semibold">
              {displayCount} {displayCount === 1 ? 'item' : 'items'} added to your cart
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/cart')}
            className="w-full py-3 bg-gradient-to-r from-vibrant-orange to-sunny-yellow text-white rounded-xl font-bold flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>View Cart & Checkout</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-gray-100 text-charcoal rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftCartConfirmation;
