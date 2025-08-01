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
      {/* Credit Card Style Loyalty Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md mx-auto"
      >
        {/* Main Credit Card */}
        <div className={`relative w-full h-56 rounded-2xl shadow-2xl overflow-hidden ${getTierGradient(loyaltyCard.tier)}`}>
          {/* Card Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full border border-white/30"></div>
            <div className="absolute top-8 right-8 w-8 h-8 rounded-full border border-white/20"></div>
            <div className="absolute bottom-6 left-6 w-20 h-20 rounded-full border border-white/20"></div>
          </div>
          
          {/* Card Content */}
          <div className="relative h-full p-6 flex flex-col justify-between text-white">
            {/* Top Row - Pawsome Logo & Tier */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-fredoka font-bold">Pawsome</h3>
                <p className="text-xs font-fredoka opacity-80">Loyalty Card</p>
              </div>
              <div className="text-right">
                <div className="text-2xl mb-1">{getTierIcon(loyaltyCard.tier)}</div>
                <p className="text-xs font-fredoka font-semibold uppercase tracking-wider">
                  {loyaltyCard.tier}
                </p>
              </div>
            </div>

            {/* Middle Row - Points Balance */}
            <div className="text-center">
              <p className="text-3xl font-fredoka font-bold tracking-wider">
                {loyaltyCard.points.toLocaleString()}
              </p>
              <p className="text-sm font-fredoka opacity-90">POINTS AVAILABLE</p>
            </div>

            {/* Bottom Row - Card Number & Member Since */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-lg font-fredoka font-semibold tracking-widest">
                  {formatCardNumber(loyaltyCard.cardNumber)}
                </p>
                <p className="text-xs font-fredoka opacity-70">
                  MEMBER SINCE {new Date(loyaltyCard.joinDate).getFullYear()}
                </p>
              </div>
              <div className="text-right">
                <div className="w-8 h-5 bg-white/20 rounded border border-white/30 mb-1"></div>
                <div className="w-10 h-3 bg-white/15 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Shadow/Depth Effect */}
        <div className="absolute -bottom-2 left-2 right-2 h-56 bg-black/20 rounded-2xl -z-10"></div>
      </motion.div>

      {/* Tier Progress Card */}
      {nextTier && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-fredoka font-bold text-charcoal">
              Progress to {nextTier.tier}
            </h3>
            <span className="text-lg font-fredoka font-bold text-lavender">
              {progressToNextTier}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextTier}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${getTierProgressColor(nextTier.tier)}`}
            />
          </div>
          <p className="text-sm text-medium-gray font-fredoka">
            {(nextTier.minPoints - loyaltyCard.totalEarned).toLocaleString()} points to unlock {nextTier.tier} benefits
          </p>
        </motion.div>
      )}

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="bg-white rounded-xl p-4 shadow-lg text-center">
          <TrendingUp className="h-8 w-8 mx-auto mb-2 text-mint-green" />
          <p className="text-xl font-fredoka font-bold text-charcoal">{loyaltyCard.totalEarned.toLocaleString()}</p>
          <p className="text-xs text-medium-gray font-fredoka">Total Earned</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg text-center">
          <Gift className="h-8 w-8 mx-auto mb-2 text-vibrant-orange" />
          <p className="text-xl font-fredoka font-bold text-charcoal">{loyaltyCard.totalRedeemed.toLocaleString()}</p>
          <p className="text-xs text-medium-gray font-fredoka">Redeemed</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg text-center">
          <Trophy className="h-8 w-8 mx-auto mb-2 text-sunny-yellow" />
          <p className="text-xl font-fredoka font-bold text-charcoal">{earnedBadgesCount}</p>
          <p className="text-xs text-medium-gray font-fredoka">Badges</p>
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

function getTierGradient(tier: LoyaltyTier): string {
  switch (tier) {
    case LoyaltyTier.BRONZE:
      return 'bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700';
    case LoyaltyTier.SILVER:
      return 'bg-gradient-to-br from-gray-400 via-gray-300 to-gray-500';
    case LoyaltyTier.GOLD:
      return 'bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-600';
    case LoyaltyTier.PLATINUM:
      return 'bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700';
    default:
      return 'bg-gradient-to-br from-lavender to-primary-blue';
  }
}

function getTierProgressColor(tier: LoyaltyTier): string {
  switch (tier) {
    case LoyaltyTier.SILVER:
      return 'bg-gray-400';
    case LoyaltyTier.GOLD:
      return 'bg-yellow-500';
    case LoyaltyTier.PLATINUM:
      return 'bg-purple-600';
    default:
      return 'bg-lavender';
  }
}

function formatCardNumber(cardNumber: string): string {
  // Format like a credit card: PAW1 2345 6789
  if (cardNumber.startsWith('PAW')) {
    const numbers = cardNumber.substring(3);
    return `PAW${numbers.substring(0, 1)} ${numbers.substring(1, 5)} ${numbers.substring(5)}`;
  }
  return cardNumber;
}

export default LoyaltyDashboard;