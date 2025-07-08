import React from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Clock, 
  TrendingUp, 
  Truck, 
  Percent,
  Star,
  ChevronRight
} from 'lucide-react';
import { useLoyalty } from '../../hooks/useLoyalty';
import { LoyaltyTier } from '../../types/loyalty';

interface ExclusiveDeal {
  id: string;
  title: string;
  description: string;
  discount?: number;
  tier: LoyaltyTier;
  validUntil: Date;
  isLimited?: boolean;
  category?: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

const ExclusiveDeals: React.FC = () => {
  const { loyaltyCard, tierBenefits } = useLoyalty();

  if (!loyaltyCard) {
    return null;
  }

  const exclusiveDeals: ExclusiveDeal[] = [
    {
      id: 'deal-1',
      title: 'Double Points Weekend',
      description: 'Earn 2x points on all purchases this weekend only!',
      tier: LoyaltyTier.BRONZE,
      validUntil: new Date('2025-01-12'),
      isLimited: true,
      icon: <TrendingUp className="h-6 w-6" />,
      bgColor: 'bg-sunny-yellow/10',
      textColor: 'text-sunny-yellow'
    },
    {
      id: 'deal-2',
      title: 'Silver Member Exclusive',
      description: 'Extra 5% off on all dog food products',
      discount: 5,
      tier: LoyaltyTier.SILVER,
      validUntil: new Date('2025-02-28'),
      category: 'Dog Food',
      icon: <Percent className="h-6 w-6" />,
      bgColor: 'bg-lavender/10',
      textColor: 'text-lavender'
    },
    {
      id: 'deal-3',
      title: 'Free Shipping Always',
      description: 'No minimum order value for Gold & Platinum members',
      tier: LoyaltyTier.GOLD,
      validUntil: new Date('2025-12-31'),
      icon: <Truck className="h-6 w-6" />,
      bgColor: 'bg-mint-green/10',
      textColor: 'text-mint-green'
    },
    {
      id: 'deal-4',
      title: 'VIP Early Access',
      description: 'Shop new arrivals 24 hours before everyone else',
      tier: LoyaltyTier.PLATINUM,
      validUntil: new Date('2025-12-31'),
      icon: <Crown className="h-6 w-6" />,
      bgColor: 'bg-vibrant-orange/10',
      textColor: 'text-vibrant-orange'
    },
    {
      id: 'deal-5',
      title: 'Birthday Month Bonus',
      description: 'Triple points on all purchases during your birthday month',
      tier: LoyaltyTier.BRONZE,
      validUntil: new Date('2025-12-31'),
      icon: <Star className="h-6 w-6" />,
      bgColor: 'bg-primary-blue/10',
      textColor: 'text-primary-blue'
    }
  ];

  // Filter deals based on user's tier
  const availableDeals = exclusiveDeals.filter(deal => {
    const tierOrder = [LoyaltyTier.BRONZE, LoyaltyTier.SILVER, LoyaltyTier.GOLD, LoyaltyTier.PLATINUM];
    const userTierIndex = tierOrder.indexOf(loyaltyCard.tier);
    const dealTierIndex = tierOrder.indexOf(deal.tier);
    return userTierIndex >= dealTierIndex;
  });

  const upcomingDeals = exclusiveDeals.filter(deal => {
    const tierOrder = [LoyaltyTier.BRONZE, LoyaltyTier.SILVER, LoyaltyTier.GOLD, LoyaltyTier.PLATINUM];
    const userTierIndex = tierOrder.indexOf(loyaltyCard.tier);
    const dealTierIndex = tierOrder.indexOf(deal.tier);
    return userTierIndex < dealTierIndex;
  });

  const isExpiringSoon = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  return (
    <div className="space-y-6">
      {/* Current Tier Benefits */}
      {tierBenefits && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-lavender to-primary-blue rounded-2xl p-6 text-white"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Crown className="h-8 w-8" />
            <h2 className="text-2xl font-fredoka font-bold">
              {loyaltyCard.tier} Member Benefits
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tierBenefits.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="mt-1">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <p className="text-white/90 font-fredoka">{benefit}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Available Exclusive Deals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-xl font-fredoka font-bold text-charcoal mb-4">
          Your Exclusive Deals ({availableDeals.length})
        </h3>
        <div className="space-y-4">
          {availableDeals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-3 rounded-xl ${deal.bgColor}`}>
                    <div className={deal.textColor}>
                      {deal.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-fredoka font-bold text-lg text-charcoal">
                        {deal.title}
                      </h4>
                      {deal.isLimited && (
                        <span className="px-2 py-1 bg-coral-red/10 text-coral-red text-xs font-fredoka font-semibold rounded-full">
                          LIMITED
                        </span>
                      )}
                      {isExpiringSoon(deal.validUntil) && (
                        <span className="px-2 py-1 bg-vibrant-orange/10 text-vibrant-orange text-xs font-fredoka font-semibold rounded-full">
                          ENDING SOON
                        </span>
                      )}
                    </div>
                    <p className="text-medium-gray font-fredoka mb-3">
                      {deal.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      {deal.discount && (
                        <div className="flex items-center space-x-1">
                          <Percent className="h-4 w-4 text-vibrant-orange" />
                          <span className="font-fredoka font-semibold text-vibrant-orange">
                            {deal.discount}% OFF
                          </span>
                        </div>
                      )}
                      {deal.category && (
                        <span className="px-2 py-1 bg-soft-gray rounded-full text-medium-gray font-fredoka">
                          {deal.category}
                        </span>
                      )}
                      <div className="flex items-center space-x-1 text-medium-gray">
                        <Clock className="h-4 w-4" />
                        <span className="font-fredoka">
                          Until {deal.validUntil.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-medium-gray group-hover:text-charcoal transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Upcoming Deals (Higher Tiers) */}
      {upcomingDeals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-fredoka font-bold text-charcoal mb-4">
            Unlock More Deals
          </h3>
          <div className="space-y-4">
            {upcomingDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-100/50" />
                <div className="relative z-10 flex items-start justify-between opacity-60">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-xl bg-gray-200`}>
                      <div className="text-gray-400">
                        {deal.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-fredoka font-bold text-lg text-charcoal">
                          {deal.title}
                        </h4>
                        <span className="px-2 py-1 bg-lavender/20 text-lavender text-xs font-fredoka font-semibold rounded-full">
                          {deal.tier} ONLY
                        </span>
                      </div>
                      <p className="text-medium-gray font-fredoka mb-3">
                        {deal.description}
                      </p>
                      <p className="text-sm text-coral-red font-fredoka font-semibold">
                        Upgrade to {deal.tier} tier to unlock this deal
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* How to Get More Deals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-sunny-yellow/10 rounded-2xl p-6"
      >
        <h3 className="text-lg font-fredoka font-bold text-charcoal mb-4">
          💡 How to Unlock More Exclusive Deals
        </h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="mt-1">
              <TrendingUp className="h-5 w-5 text-sunny-yellow" />
            </div>
            <div>
              <p className="font-fredoka font-semibold text-charcoal">Keep Shopping</p>
              <p className="text-sm text-medium-gray">
                Earn more points to reach the next tier and unlock better deals
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="mt-1">
              <Star className="h-5 w-5 text-sunny-yellow" />
            </div>
            <div>
              <p className="font-fredoka font-semibold text-charcoal">Refer Friends</p>
              <p className="text-sm text-medium-gray">
                Get bonus points for every friend you refer to Pawsome
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="mt-1">
              <Crown className="h-5 w-5 text-sunny-yellow" />
            </div>
            <div>
              <p className="font-fredoka font-semibold text-charcoal">Subscribe & Save</p>
              <p className="text-sm text-medium-gray">
                Set up subscriptions to earn points consistently
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExclusiveDeals;