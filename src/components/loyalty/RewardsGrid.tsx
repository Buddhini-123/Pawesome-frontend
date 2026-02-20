import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  Tag,
  Truck,
  Package,
  Star,
  Loader,
  AlertCircle,
  Check,
  Crown,
  Sparkles
} from 'lucide-react';
import { loyaltyService } from '../../services/loyalty.service';
import { useLoyalty } from '../../hooks/useLoyalty';
import { toast } from 'react-toastify';

interface LoyaltyReward {
  id: number;
  name: string;
  description: string;
  reward_type: 'discount_percentage' | 'discount_fixed' | 'free_shipping' | 'product';
  reward_value: string;
  points_required: number;
  tier_requirement: string;
  is_active: boolean;
  usage_limit?: number;
  usage_count?: number;
  can_redeem?: boolean;
}

interface RewardsData {
  rewards: LoyaltyReward[];
  grouped_by_type?: Record<string, LoyaltyReward[]>;
  summary?: {
    total_rewards: number;
    affordable_rewards: number;
    user_points: number;
    user_tier: string;
  };
}

const RewardsGrid: React.FC = () => {
  const { loyaltyCard } = useLoyalty();
  const [rewardsData, setRewardsData] = useState<RewardsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'affordable'>('all');
  const [redeeming, setRedeeming] = useState<number | null>(null);

  useEffect(() => {
    fetchRewards();
  }, [activeFilter]);

  const fetchRewards = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters = activeFilter === 'affordable' ? { affordable_only: true } : {};
      const data = await loyaltyService.getRewards(filters);
      setRewardsData(data);
    } catch (err: any) {
      console.error('Failed to fetch rewards:', err);
      setError(err.message || 'Failed to load rewards. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeem = async (reward: LoyaltyReward) => {
    if (redeeming) return;

    // Check if user has enough points
    if ((loyaltyCard?.points ?? 0) < reward.points_required) {
      toast.error('Insufficient points to redeem this reward');
      return;
    }

    // Confirm redemption
    const confirmed = window.confirm(
      `Redeem "${reward.name}" for ${reward.points_required.toLocaleString()} points?`
    );

    if (!confirmed) return;

    setRedeeming(reward.id);
    try {
      const result = await loyaltyService.redeemReward(reward.id);

      toast.success(
        <div>
          <p className="font-bold">Reward Redeemed! 🎉</p>
          <p className="text-sm">{result.message}</p>
          {result.data?.redemption?.reward_code && (
            <p className="text-xs mt-1">Code: {result.data.redemption.reward_code}</p>
          )}
        </div>,
        { autoClose: 5000 }
      );

      // Refresh rewards list
      await fetchRewards();

      // Reload page to update points balance
      window.location.reload();
    } catch (err: any) {
      console.error('Redemption failed:', err);
      toast.error(err.message || 'Failed to redeem reward. Please try again.');
    } finally {
      setRedeeming(null);
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'discount_percentage':
      case 'discount_fixed':
        return <Tag className="w-8 h-8" />;
      case 'free_shipping':
        return <Truck className="w-8 h-8" />;
      case 'product':
        return <Package className="w-8 h-8" />;
      default:
        return <Gift className="w-8 h-8" />;
    }
  };

  const getRewardColor = (type: string) => {
    switch (type) {
      case 'discount_percentage':
      case 'discount_fixed':
        return 'from-vibrant-orange to-sunny-yellow';
      case 'free_shipping':
        return 'from-primary-blue to-mint-green';
      case 'product':
        return 'from-lavender to-soft-pink';
      default:
        return 'from-medium-gray to-charcoal';
    }
  };

  const formatRewardValue = (reward: LoyaltyReward) => {
    switch (reward.reward_type) {
      case 'discount_percentage':
        return `${reward.reward_value}% OFF`;
      case 'discount_fixed':
        return `Rs. ${parseFloat(reward.reward_value).toLocaleString()} OFF`;
      case 'free_shipping':
        return 'FREE SHIPPING';
      case 'product':
        return 'FREE ITEM';
      default:
        return reward.reward_value;
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze':
        return 'bg-orange-600 text-white';
      case 'silver':
        return 'bg-gray-400 text-white';
      case 'gold':
        return 'bg-yellow-500 text-white';
      case 'platinum':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-medium-gray text-white';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader className="w-12 h-12 text-primary-blue" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-coral-red/10 border border-coral-red/30 rounded-2xl p-6 flex items-start space-x-4">
        <AlertCircle className="w-6 h-6 text-coral-red flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-fredoka font-bold text-charcoal mb-2">Error Loading Rewards</h3>
          <p className="text-sm text-medium-gray mb-4">{error}</p>
          <button
            onClick={fetchRewards}
            className="bg-coral-red text-white px-4 py-2 rounded-lg font-fredoka font-semibold hover:bg-coral-red/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!rewardsData || rewardsData.rewards.length === 0) {
    return (
      <div className="bg-soft-gray rounded-2xl p-12 text-center">
        <Gift className="w-16 h-16 text-medium-gray mx-auto mb-4" />
        <h3 className="text-xl font-fredoka font-bold text-charcoal mb-2">
          No Rewards Available
        </h3>
        <p className="text-medium-gray">
          Check back later for exciting rewards!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      {rewardsData.summary && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-blue to-lavender rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-fredoka font-bold mb-1">
                {rewardsData.summary.user_points.toLocaleString()} Points
              </h3>
              <p className="text-sm opacity-90">
                {rewardsData.summary.affordable_rewards} of {rewardsData.summary.total_rewards} rewards available
              </p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getTierBadgeColor(rewardsData.summary.user_tier)}`}>
                <Crown className="w-4 h-4" />
                <span className="font-fredoka font-bold capitalize">{rewardsData.summary.user_tier}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-6 py-3 rounded-xl font-fredoka font-semibold transition-all ${
            activeFilter === 'all'
              ? 'bg-primary-blue text-white shadow-lg'
              : 'bg-white text-charcoal hover:bg-soft-gray'
          }`}
        >
          All Rewards ({rewardsData.summary?.total_rewards || rewardsData.rewards.length})
        </button>
        <button
          onClick={() => setActiveFilter('affordable')}
          className={`px-6 py-3 rounded-xl font-fredoka font-semibold transition-all ${
            activeFilter === 'affordable'
              ? 'bg-mint-green text-white shadow-lg'
              : 'bg-white text-charcoal hover:bg-soft-gray'
          }`}
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Affordable ({rewardsData.summary?.affordable_rewards || 0})
          </span>
        </button>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {rewardsData.rewards.map((reward, index) => {
            const canAfford = (loyaltyCard?.points ?? 0) >= reward.points_required;
            const isRedeeming = redeeming === reward.id;

            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                  !canAfford ? 'opacity-60' : ''
                }`}
              >
                {/* Reward Header */}
                <div className={`bg-gradient-to-r ${getRewardColor(reward.reward_type)} p-6 text-white`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                      {getRewardIcon(reward.reward_type)}
                    </div>
                    <span className={`text-xs font-fredoka font-bold px-3 py-1 rounded-full ${getTierBadgeColor(reward.tier_requirement)}`}>
                      {reward.tier_requirement.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-fredoka font-bold mb-2">
                    {formatRewardValue(reward)}
                  </h3>
                  <p className="text-sm opacity-90 font-fredoka">
                    {reward.name}
                  </p>
                </div>

                {/* Reward Body */}
                <div className="p-6">
                  <p className="text-sm text-medium-gray mb-4 line-clamp-2">
                    {reward.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-medium-gray font-fredoka">Points Required</p>
                      <p className="text-2xl font-fredoka font-bold text-charcoal">
                        {reward.points_required.toLocaleString()}
                      </p>
                    </div>
                    {canAfford && (
                      <div className="bg-mint-green/10 rounded-full p-2">
                        <Check className="w-6 h-6 text-mint-green" />
                      </div>
                    )}
                  </div>

                  {/* Redeem Button */}
                  <motion.button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || isRedeeming}
                    whileHover={canAfford ? { scale: 1.02 } : {}}
                    whileTap={canAfford ? { scale: 0.98 } : {}}
                    className={`w-full py-3 rounded-xl font-fredoka font-bold transition-all ${
                      canAfford
                        ? 'bg-gradient-to-r from-vibrant-orange to-sunny-yellow text-white hover:shadow-lg'
                        : 'bg-soft-gray text-medium-gray cursor-not-allowed'
                    }`}
                  >
                    {isRedeeming ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Loader className="w-5 h-5" />
                        </motion.div>
                        Redeeming...
                      </span>
                    ) : canAfford ? (
                      'Redeem Now'
                    ) : (
                      `Need ${(reward.points_required - (loyaltyCard?.points ?? 0)).toLocaleString()} more points`
                    )}
                  </motion.button>

                  {/* Usage Info */}
                  {reward.usage_limit && (
                    <p className="text-xs text-medium-gray text-center mt-2">
                      {reward.usage_count || 0} / {reward.usage_limit} redeemed
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State for Filtered Results */}
      {activeFilter === 'affordable' && rewardsData.rewards.length === 0 && (
        <div className="bg-soft-gray rounded-2xl p-12 text-center">
          <Sparkles className="w-16 h-16 text-medium-gray mx-auto mb-4" />
          <h3 className="text-xl font-fredoka font-bold text-charcoal mb-2">
            No Affordable Rewards Yet
          </h3>
          <p className="text-medium-gray mb-4">
            Keep earning points to unlock amazing rewards!
          </p>
          <button
            onClick={() => setActiveFilter('all')}
            className="bg-primary-blue text-white px-6 py-3 rounded-xl font-fredoka font-semibold hover:bg-primary-blue/90 transition-colors"
          >
            View All Rewards
          </button>
        </div>
      )}
    </div>
  );
};

export default RewardsGrid;
