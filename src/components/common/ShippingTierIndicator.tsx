import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { cartService, ApiShippingTier } from '../../services/cart.service';

interface ShippingTierIndicatorProps {
  currentWeight: number;
  shippingCost: number;
  weightUnit?: string;
}

interface ShippingTier {
  min_weight: number;
  max_weight: number | null;
  cost: number;
  label: string;
  description: string;
  color: string;
}

const ShippingTierIndicator: React.FC<ShippingTierIndicatorProps> = ({
  currentWeight,
  shippingCost,
  weightUnit = 'kg',
}) => {
  const [tiers, setTiers] = useState<ShippingTier[]>([]);

  useEffect(() => {
    cartService.getShippingTiers().then((apiTiers: ApiShippingTier[]) => {
      const colors = ['primary-blue', 'vibrant-orange', 'coral-red'];
      const mapped: ShippingTier[] = apiTiers.map((t, i) => {
        const maxW = t.max_weight;
        const minW = t.min_weight;
        const description =
          maxW === null
            ? `Over ${minW} kg`
            : minW === 0
            ? `Under ${maxW} kg`
            : `${minW}–${maxW} kg`;
        return {
          min_weight: minW,
          max_weight: maxW,
          cost: parseFloat(t.cost),
          label: t.name,
          description,
          color: colors[i] ?? 'primary-blue',
        };
      });
      setTiers(mapped);
    });
  }, []);

  // Find current tier
  const getCurrentTier = (): ShippingTier | undefined => {
    return tiers.find(
      (tier) =>
        currentWeight >= tier.min_weight &&
        (tier.max_weight === null || currentWeight < tier.max_weight)
    );
  };

  // Calculate weight to next tier
  const getWeightToNextTier = (): { weight: number; nextTier: ShippingTier } | null => {
    const currentTier = getCurrentTier();
    if (!currentTier || currentTier.max_weight === null) {
      return null;
    }

    const currentIndex = tiers.indexOf(currentTier);
    const nextTier = tiers[currentIndex + 1];

    if (!nextTier) return null;

    return {
      weight: currentTier.max_weight - currentWeight,
      nextTier,
    };
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-US')}`;
  };

  const currentTier = getCurrentTier();
  const weightToNextTier = getWeightToNextTier();

  // Calculate progress percentage
  const getProgressPercentage = (): number => {
    if (!currentTier || currentTier.max_weight === null) return 100;

    const tierRange = currentTier.max_weight - currentTier.min_weight;
    const currentProgress = currentWeight - currentTier.min_weight;
    return Math.min((currentProgress / tierRange) * 100, 100);
  };

  const progressPercentage = getProgressPercentage();

  // Get tier color class
  const getTierColorClass = (color: string): string => {
    const colorMap: Record<string, string> = {
      'primary-blue': 'bg-primary-blue',
      'vibrant-orange': 'bg-vibrant-orange',
      'coral-red': 'bg-coral-red',
    };
    return colorMap[color] || 'bg-primary-blue';
  };

  // Get gradient color class
  const getTierGradientClass = (color: string): string => {
    const gradientMap: Record<string, string> = {
      'primary-blue': 'from-primary-blue to-sunny-yellow',
      'vibrant-orange': 'from-vibrant-orange to-sunny-yellow',
      'coral-red': 'from-coral-red to-sunny-yellow',
    };
    return gradientMap[color] || 'from-primary-blue to-sunny-yellow';
  };

  if (tiers.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-soft-gray p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`${getTierColorClass(currentTier?.color || 'primary-blue')} rounded-xl p-2 mr-3`}>
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-fredoka font-bold text-charcoal text-lg">
              {currentTier?.label || 'Shipping'}
            </h3>
            <p className="text-sm text-medium-gray">
              Current weight: {currentWeight.toFixed(2)} {weightUnit}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-fredoka font-bold text-2xl text-vibrant-orange">
            {formatCurrency(shippingCost)}
          </p>
          <p className="text-xs text-medium-gray">Shipping Cost</p>
        </div>
      </div>

      {/* Progress to Next Tier */}
      {weightToNextTier && weightToNextTier.weight > 0 ? (
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between text-sm mb-2">
            <div className="flex items-center text-charcoal">
              <TrendingUp className="w-4 h-4 mr-1 text-sunny-yellow" />
              <span className="font-fredoka font-medium">
                Add {weightToNextTier.weight.toFixed(2)} {weightUnit} more
              </span>
            </div>
            <div className="flex items-center text-medium-gray">
              <span className="text-xs mr-1">Next tier:</span>
              <span className="font-fredoka font-bold text-vibrant-orange">
                {formatCurrency(weightToNextTier.nextTier.cost)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full bg-soft-gray rounded-full h-3 overflow-hidden">
            <motion.div
              className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getTierGradientClass(currentTier?.color || 'primary-blue')} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                background: `linear-gradient(90deg,
                  rgba(255,255,255,0.2) 0%,
                  rgba(255,255,255,0.2) ${progressPercentage}%,
                  transparent ${progressPercentage}%,
                  transparent 100%)`,
              }}
            />
          </div>

          {/* Incentive Message */}
          {weightToNextTier.weight <= 0.5 && (
            <motion.div
              className="mt-3 bg-sunny-yellow/20 border border-sunny-yellow/30 rounded-xl p-3"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-sunny-yellow mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-fredoka text-charcoal">
                  <strong>Almost there!</strong> Add just{' '}
                  <strong>{weightToNextTier.weight.toFixed(2)} {weightUnit}</strong> more to
                  reach the next shipping tier!
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="mb-4 bg-mint-green/20 border border-mint-green/30 rounded-xl p-3"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-mint-green mr-2" />
            <p className="text-sm font-fredoka text-charcoal">
              You're at the highest shipping tier!
            </p>
          </div>
        </motion.div>
      )}

      {/* All Tiers Display */}
      <div className="pt-4 border-t border-light-gray">
        <p className="text-sm font-fredoka font-semibold text-charcoal mb-3">
          Shipping Rate Tiers:
        </p>
        <div className="space-y-2">
          {tiers.map((tier, index) => {
            const isCurrentTier = tier === currentTier;
            return (
              <motion.div
                key={index}
                className={`flex justify-between items-center p-2 rounded-lg transition-all ${
                  isCurrentTier
                    ? 'bg-vibrant-orange/10 border border-vibrant-orange/30'
                    : 'bg-soft-gray/30'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center">
                  {isCurrentTier && (
                    <CheckCircle className="w-4 h-4 text-vibrant-orange mr-2" />
                  )}
                  <div>
                    <span
                      className={`text-sm font-fredoka ${
                        isCurrentTier
                          ? 'font-bold text-vibrant-orange'
                          : 'font-medium text-charcoal'
                      }`}
                    >
                      {tier.description}
                    </span>
                    {isCurrentTier && (
                      <span className="ml-2 text-xs bg-vibrant-orange text-white px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`text-sm font-fredoka ${
                    isCurrentTier ? 'font-bold text-vibrant-orange' : 'text-medium-gray'
                  }`}
                >
                  {formatCurrency(tier.cost)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-4 pt-4 border-t border-light-gray">
        <p className="text-xs text-medium-gray text-center font-fredoka">
          Shipping cost calculated automatically based on total order weight
        </p>
      </div>
    </div>
  );
};

export default ShippingTierIndicator;
