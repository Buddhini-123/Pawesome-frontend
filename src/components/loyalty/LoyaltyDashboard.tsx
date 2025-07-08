import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  TrendingUp, 
  Gift, 
  Users, 
  Calendar,
  Star,
  ChevronRight
} from 'lucide-react';
import { useLoyalty } from '../../hooks/useLoyalty';
import { TIER_BENEFITS, LoyaltyTier } from '../../types/loyalty';

const LoyaltyDashboard: React.FC = () => {
  const { loyaltyCard, tierBenefits, badges } = useLoyalty();

  if (!loyaltyCard) {
    return null;
  }

  const nextTier = getNextTier(loyaltyCard.tier);
  const progressToNextTier = nextTier 
    ? calculateTierProgress(loyaltyCard.totalEarned, loyaltyCard.tier, nextTier.tier)
    : 100;

  const earnedBadgesCount = badges.filter(b => !b.isLocked).length;
  const recentBadges = badges
    .filter(b => !b.isLocked)
    .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-lavender to-primary-blue rounded-3xl p-8 text-white shadow-2xl"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-fredoka font-bold mb-2">
              {loyaltyCard.points.toLocaleString()} Points
            </h2>
            <p className="text-white/80 font-fredoka">
              Card: {loyaltyCard.cardNumber}
            </p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-4 py-2 rounded-full font-fredoka font-semibold ${getTierStyles(loyaltyCard.tier)}`}>
              {getTierIcon(loyaltyCard.tier)} {loyaltyCard.tier}
            </div>
          </div>
        </div>

        {/* Tier Progress */}
        {nextTier && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-fredoka">Progress to {nextTier.tier}</span>
              <span className="font-fredoka">{progressToNextTier}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNextTier}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-white rounded-full h-full"
              />
            </div>
            <p className="text-xs text-white/70 mt-1 font-fredoka">
              {nextTier.minPoints - loyaltyCard.totalEarned} points to next tier
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2" />
            <p className="text-2xl font-fredoka font-bold">{loyaltyCard.totalEarned.toLocaleString()}</p>
            <p className="text-xs text-white/70 font-fredoka">Total Earned</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <Gift className="h-6 w-6 mx-auto mb-2" />
            <p className="text-2xl font-fredoka font-bold">{loyaltyCard.totalRedeemed.toLocaleString()}</p>
            <p className="text-xs text-white/70 font-fredoka">Redeemed</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <Trophy className="h-6 w-6 mx-auto mb-2" />
            <p className="text-2xl font-fredoka font-bold">{earnedBadgesCount}</p>
            <p className="text-xs text-white/70 font-fredoka">Badges</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <button className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-vibrant-orange/10 p-3 rounded-xl">
                <Gift className="h-6 w-6 text-vibrant-orange" />
              </div>
              <div className="text-left">
                <h3 className="font-fredoka font-semibold text-charcoal">Redeem Points</h3>
                <p className="text-sm text-medium-gray">Use your points</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-medium-gray group-hover:text-vibrant-orange transition-colors" />
          </div>
        </button>

        <button className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-blue/10 p-3 rounded-xl">
                <Users className="h-6 w-6 text-primary-blue" />
              </div>
              <div className="text-left">
                <h3 className="font-fredoka font-semibold text-charcoal">Refer Friends</h3>
                <p className="text-sm text-medium-gray">Earn 500 points</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-medium-gray group-hover:text-primary-blue transition-colors" />
          </div>
        </button>

        <button className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-mint-green/10 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-mint-green" />
              </div>
              <div className="text-left">
                <h3 className="font-fredoka font-semibold text-charcoal">View History</h3>
                <p className="text-sm text-medium-gray">All transactions</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-medium-gray group-hover:text-mint-green transition-colors" />
          </div>
        </button>
      </motion.div>

      {/* Recent Badges */}
      {recentBadges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-fredoka font-bold text-charcoal mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {recentBadges.map((badge) => (
              <div key={badge.id} className="flex items-center space-x-4 p-3 bg-soft-gray rounded-xl">
                <div className="text-3xl">{badge.icon}</div>
                <div className="flex-1">
                  <h4 className="font-fredoka font-semibold text-charcoal">{badge.name}</h4>
                  <p className="text-sm text-medium-gray">{badge.description}</p>
                </div>
                <Star className="h-5 w-5 text-sunny-yellow" />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tier Benefits */}
      {tierBenefits && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-fredoka font-bold text-charcoal mb-4">Your {loyaltyCard.tier} Benefits</h3>
          <ul className="space-y-2">
            {tierBenefits.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="mt-1">
                  <div className="w-2 h-2 bg-vibrant-orange rounded-full" />
                </div>
                <p className="text-charcoal font-fredoka">{benefit}</p>
              </li>
            ))}
          </ul>
          {tierBenefits.additionalDiscount > 0 && (
            <div className="mt-4 p-4 bg-sunny-yellow/10 rounded-xl">
              <p className="font-fredoka font-semibold text-charcoal">
                You get {tierBenefits.additionalDiscount}% extra discount on all deals!
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

// Helper functions
function getNextTier(currentTier: LoyaltyTier) {
  const tierOrder = [LoyaltyTier.BRONZE, LoyaltyTier.SILVER, LoyaltyTier.GOLD, LoyaltyTier.PLATINUM];
  const currentIndex = tierOrder.indexOf(currentTier);
  
  if (currentIndex < tierOrder.length - 1) {
    const nextTierName = tierOrder[currentIndex + 1];
    return TIER_BENEFITS.find(b => b.tier === nextTierName);
  }
  
  return null;
}

function calculateTierProgress(totalEarned: number, currentTier: LoyaltyTier, nextTier: LoyaltyTier): number {
  const currentTierBenefit = TIER_BENEFITS.find(b => b.tier === currentTier);
  const nextTierBenefit = TIER_BENEFITS.find(b => b.tier === nextTier);
  
  if (!currentTierBenefit || !nextTierBenefit) return 0;
  
  const currentMin = currentTierBenefit.minPoints;
  const nextMin = nextTierBenefit.minPoints;
  const progress = ((totalEarned - currentMin) / (nextMin - currentMin)) * 100;
  
  return Math.min(Math.max(progress, 0), 100);
}

function getTierStyles(tier: LoyaltyTier): string {
  switch (tier) {
    case LoyaltyTier.BRONZE:
      return 'bg-orange-600 text-white';
    case LoyaltyTier.SILVER:
      return 'bg-gray-400 text-white';
    case LoyaltyTier.GOLD:
      return 'bg-yellow-500 text-white';
    case LoyaltyTier.PLATINUM:
      return 'bg-purple-600 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

function getTierIcon(tier: LoyaltyTier): string {
  switch (tier) {
    case LoyaltyTier.BRONZE:
      return '🥉';
    case LoyaltyTier.SILVER:
      return '🥈';
    case LoyaltyTier.GOLD:
      return '🥇';
    case LoyaltyTier.PLATINUM:
      return '💎';
    default:
      return '⭐';
  }
}

export default LoyaltyDashboard;