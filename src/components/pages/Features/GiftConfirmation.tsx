import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GiftConfirmation: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { giftBox, pointsAwarded } = state || {};

  if (!giftBox) {
    navigate('/gifts/customize');
    return null;
  }

  // Extract nested data from GiftBoxResource structure
  const recipientName = giftBox.recipient?.name || giftBox.recipient_name || 'Guest';
  const totalAmount = giftBox.pricing?.total_amount ?? giftBox.total_amount ?? 0;
  const discountAmount = giftBox.pricing?.discount_amount ?? giftBox.discount_amount ?? 0;
  const finalAmount = giftBox.pricing?.final_amount ?? giftBox.final_amount ?? 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-amber-50 p-4">
      <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl">
        <div className="text-7xl mb-4">🎁</div>
        <h1 className="text-3xl font-bold text-charcoal mb-2">Gift Box Created!</h1>
        <p className="text-gray-500 mb-4">For <strong>{recipientName}</strong></p>
        <div className="bg-amber-50 rounded-xl p-4 mb-6 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>Rs.{Number(totalAmount).toFixed(2)}</span>
          </div>
          {Number(discountAmount) > 0 && (
            <div className="flex justify-between text-sm text-green-600 font-semibold">
              <span>Bundle Discount</span>
              <span>- Rs.{Number(discountAmount).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-charcoal">
            <span>You Pay</span>
            <span>Rs.{Number(finalAmount).toFixed(2)}</span>
          </div>
          {pointsAwarded > 0 && (
            <div className="text-xs text-vibrant-orange font-semibold pt-1">
              +{pointsAwarded} loyalty points earned!
            </div>
          )}
        </div>
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 bg-gradient-to-r from-vibrant-orange to-sunny-yellow text-white rounded-xl font-bold"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default GiftConfirmation;
