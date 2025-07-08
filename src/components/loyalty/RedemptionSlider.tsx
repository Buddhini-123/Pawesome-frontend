import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useLoyalty } from '../../hooks/useLoyalty';
import { usePointsCalculator } from '../../hooks/usePointsCalculator';
import { LOYALTY_CONSTANTS } from '../../types/loyalty';
import { formatters } from '../../utils/formatters';

interface RedemptionSliderProps {
  orderTotal: number;
  onRedemptionChange: (points: number, value: number) => void;
  className?: string;
}

const RedemptionSlider: React.FC<RedemptionSliderProps> = ({ 
  orderTotal, 
  onRedemptionChange,
  className = ''
}) => {
  const { loyaltyCard } = useLoyalty();
  const { 
    pointsToEarn, 
    maxRedeemablePoints, 
    maxRedeemableValue,
    valuePerPoint 
  } = usePointsCalculator(orderTotal);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState(0);
  const [inputValue, setInputValue] = useState('0');

  const redemptionValue = selectedPoints * valuePerPoint;
  const finalTotal = orderTotal - redemptionValue;

  useEffect(() => {
    onRedemptionChange(selectedPoints, redemptionValue);
  }, [selectedPoints, redemptionValue, onRedemptionChange]);

  const handleSliderChange = (value: number) => {
    setSelectedPoints(value);
    setInputValue(value.toString());
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const numValue = parseInt(value) || 0;
    const validValue = Math.max(0, Math.min(numValue, maxRedeemablePoints));
    setSelectedPoints(validValue);
  };

  const handlePresetClick = (percentage: number) => {
    const points = Math.floor(maxRedeemablePoints * percentage);
    handleSliderChange(points);
  };

  if (!loyaltyCard || loyaltyCard.points === 0) {
    return null;
  }

  return (
    <motion.div 
      className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-soft-gray transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-lavender/10 p-3 rounded-xl">
              <Gift className="h-6 w-6 text-lavender" />
            </div>
            <div>
              <h3 className="font-fredoka font-bold text-lg text-charcoal">
                Use Loyalty Points
              </h3>
              <p className="text-sm text-medium-gray">
                You have {loyaltyCard.points.toLocaleString()} points available
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {selectedPoints > 0 && (
              <div className="text-right">
                <p className="font-fredoka font-bold text-lavender">
                  -{formatters.currency(redemptionValue)}
                </p>
                <p className="text-xs text-medium-gray">
                  {selectedPoints} points
                </p>
              </div>
            )}
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-medium-gray" />
            ) : (
              <ChevronDown className="h-5 w-5 text-medium-gray" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 pb-6 border-t border-light-gray"
        >
          {/* Info Box */}
          <div className="mt-4 p-4 bg-lavender/5 rounded-xl flex items-start space-x-3">
            <Info className="h-5 w-5 text-lavender mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-fredoka text-charcoal">
                Redeem up to {maxRedeemablePoints.toLocaleString()} points 
                ({formatters.currency(maxRedeemableValue)}) for this order
              </p>
              <p className="text-xs text-medium-gray mt-1">
                {LOYALTY_CONSTANTS.REDEMPTION_RATE * 10} points = {formatters.currency(1)}
              </p>
            </div>
          </div>

          {/* Points Input */}
          <div className="mt-6">
            <label className="block text-sm font-fredoka font-semibold text-charcoal mb-2">
              Points to Redeem
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onBlur={() => setInputValue(selectedPoints.toString())}
                min="0"
                max={maxRedeemablePoints}
                className="flex-1 px-4 py-3 border-2 border-light-gray rounded-xl font-fredoka text-lg focus:outline-none focus:border-lavender transition-colors"
              />
              <div className="text-center">
                <p className="text-sm text-medium-gray font-fredoka">=</p>
              </div>
              <div className="px-4 py-3 bg-lavender/10 rounded-xl min-w-[120px] text-center">
                <p className="font-fredoka font-bold text-lavender text-lg">
                  {formatters.currency(redemptionValue)}
                </p>
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="mt-6">
            <input
              type="range"
              min="0"
              max={maxRedeemablePoints}
              value={selectedPoints}
              onChange={(e) => handleSliderChange(parseInt(e.target.value))}
              className="w-full h-2 bg-light-gray rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${
                  (selectedPoints / maxRedeemablePoints) * 100
                }%, #E5E7EB ${(selectedPoints / maxRedeemablePoints) * 100}%, #E5E7EB 100%)`
              }}
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-medium-gray font-fredoka">0</span>
              <span className="text-xs text-medium-gray font-fredoka">
                {maxRedeemablePoints.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => handlePresetClick(0)}
              className="px-3 py-1 bg-soft-gray rounded-lg text-sm font-fredoka hover:bg-light-gray transition-colors"
            >
              None
            </button>
            <button
              onClick={() => handlePresetClick(0.25)}
              className="px-3 py-1 bg-soft-gray rounded-lg text-sm font-fredoka hover:bg-light-gray transition-colors"
            >
              25%
            </button>
            <button
              onClick={() => handlePresetClick(0.5)}
              className="px-3 py-1 bg-soft-gray rounded-lg text-sm font-fredoka hover:bg-light-gray transition-colors"
            >
              50%
            </button>
            <button
              onClick={() => handlePresetClick(0.75)}
              className="px-3 py-1 bg-soft-gray rounded-lg text-sm font-fredoka hover:bg-light-gray transition-colors"
            >
              75%
            </button>
            <button
              onClick={() => handlePresetClick(1)}
              className="px-3 py-1 bg-lavender text-white rounded-lg text-sm font-fredoka hover:bg-lavender/90 transition-colors"
            >
              Max
            </button>
          </div>

          {/* Summary */}
          <div className="mt-6 space-y-2 p-4 bg-soft-gray rounded-xl">
            <div className="flex justify-between text-sm">
              <span className="text-medium-gray font-fredoka">Order Total</span>
              <span className="font-fredoka font-semibold text-charcoal">
                {formatters.currency(orderTotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-medium-gray font-fredoka">Points Discount</span>
              <span className="font-fredoka font-semibold text-lavender">
                -{formatters.currency(redemptionValue)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-light-gray">
              <span className="font-fredoka font-semibold text-charcoal">Final Total</span>
              <span className="font-fredoka font-bold text-lg text-charcoal">
                {formatters.currency(finalTotal)}
              </span>
            </div>
          </div>

          {/* Points to Earn */}
          <div className="mt-4 p-3 bg-mint-green/10 rounded-lg">
            <p className="text-sm font-fredoka text-mint-green">
              You'll earn {pointsToEarn} points from this order! 🎉
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RedemptionSlider;