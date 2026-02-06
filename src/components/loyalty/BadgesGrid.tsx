import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Star, X, Trophy, TrendingUp, Users } from 'lucide-react';
import { useLoyalty } from '../../hooks/useLoyalty';
import { Badge } from '../../types/loyalty';

const BadgesGrid: React.FC = () => {
  const { badges, loyaltyCard } = useLoyalty();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const earnedBadges = badges.filter(b => !b.isLocked);
  const lockedBadges = badges.filter(b => b.isLocked);

  const getProgressDescription = (badge: Badge): string => {
    if (!loyaltyCard) return '';

    if (badge.requiredPoints) {
      const progress = ((loyaltyCard.totalEarned ?? 0) / badge.requiredPoints) * 100;
      return `${Math.min(100, Math.round(progress))}% complete (${(loyaltyCard.totalEarned ?? 0).toLocaleString()}/${badge.requiredPoints.toLocaleString()} points)`;
    }
    
    if (badge.requiredOrders) {
      // This would need order count from transactions
      return `Complete ${badge.requiredOrders} orders to unlock`;
    }
    
    if (badge.tier) {
      return `Reach ${badge.tier} tier to unlock`;
    }

    return 'Keep shopping to unlock!';
  };

  return (
    <>
      <div className="space-y-8">
        {/* Earned Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-fredoka font-bold text-charcoal mb-4">
            Earned Badges ({earnedBadges.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnedBadges.map((badge, index) => (
              <motion.button
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedBadge(badge)}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-sunny-yellow/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Badge Content */}
                <div className="relative z-10">
                  <div className="text-5xl mb-3">{badge.icon}</div>
                  <h4 className="font-fredoka font-semibold text-charcoal text-sm">
                    {badge.name}
                  </h4>
                  <div className="mt-2 flex justify-center">
                    <Star className="h-4 w-4 text-sunny-yellow fill-current" />
                  </div>
                  {badge.unlockedAt && (
                    <p className="text-xs text-medium-gray mt-2">
                      {new Date(badge.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Locked Badges */}
        {lockedBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-fredoka font-bold text-charcoal mb-4">
              Badges to Unlock ({lockedBadges.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {lockedBadges.map((badge, index) => (
                <motion.button
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedBadge(badge)}
                  className="bg-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all relative overflow-hidden group"
                >
                  {/* Lock Overlay */}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
                  
                  {/* Badge Content */}
                  <div className="relative z-10 opacity-60 group-hover:opacity-80 transition-opacity">
                    <div className="text-5xl mb-3 grayscale">{badge.icon}</div>
                    <h4 className="font-fredoka font-semibold text-charcoal text-sm">
                      {badge.name}
                    </h4>
                    <div className="mt-2 flex justify-center">
                      <Lock className="h-4 w-4 text-medium-gray" />
                    </div>
                  </div>
                  
                  {/* Progress Indicator */}
                  {badge.requiredPoints && loyaltyCard && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                      <motion.div
                        className="h-full bg-lavender"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${Math.min(100, (loyaltyCard.totalEarned / badge.requiredPoints) * 100)}%` 
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-lavender/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-fredoka font-bold text-charcoal mb-4">
            Your Achievement Stats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Trophy className="h-6 w-6 text-sunny-yellow" />
              <div>
                <p className="font-fredoka font-semibold text-charcoal">
                  {earnedBadges.length} / {badges.length}
                </p>
                <p className="text-sm text-medium-gray">Badges Earned</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-mint-green" />
              <div>
                <p className="font-fredoka font-semibold text-charcoal">
                  {Math.round((earnedBadges.length / badges.length) * 100)}%
                </p>
                <p className="text-sm text-medium-gray">Completion</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="h-6 w-6 text-vibrant-orange" />
              <div>
                <p className="font-fredoka font-semibold text-charcoal">
                  Level {Math.floor(earnedBadges.length / 2) + 1}
                </p>
                <p className="text-sm text-medium-gray">Collector</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setSelectedBadge(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className={`p-6 ${
                  selectedBadge.isLocked ? 'bg-gray-100' : 'bg-gradient-to-br from-sunny-yellow to-vibrant-orange'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="text-center flex-1">
                      <div className="text-7xl mb-3 inline-block">
                        {selectedBadge.icon}
                      </div>
                      <h3 className={`text-2xl font-fredoka font-bold ${
                        selectedBadge.isLocked ? 'text-charcoal' : 'text-white'
                      }`}>
                        {selectedBadge.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedBadge(null)}
                      className={`p-2 rounded-full transition-colors ${
                        selectedBadge.isLocked 
                          ? 'hover:bg-gray-200' 
                          : 'hover:bg-white/20'
                      }`}
                    >
                      <X className={`h-5 w-5 ${
                        selectedBadge.isLocked ? 'text-charcoal' : 'text-white'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-medium-gray text-center mb-6">
                    {selectedBadge.description}
                  </p>

                  {selectedBadge.isLocked ? (
                    <div className="space-y-4">
                      <div className="bg-soft-gray rounded-xl p-4">
                        <p className="text-sm font-fredoka font-semibold text-charcoal mb-2">
                          How to unlock:
                        </p>
                        <p className="text-sm text-medium-gray">
                          {getProgressDescription(selectedBadge)}
                        </p>
                      </div>
                      
                      {selectedBadge.requiredPoints && loyaltyCard && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-medium-gray">Progress</span>
                            <span className="font-fredoka font-semibold text-charcoal">
                              {Math.min(100, Math.round((loyaltyCard.totalEarned / selectedBadge.requiredPoints) * 100))}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-lavender rounded-full h-full transition-all"
                              style={{ 
                                width: `${Math.min(100, (loyaltyCard.totalEarned / selectedBadge.requiredPoints) * 100)}%` 
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-mint-green/10 text-mint-green rounded-full">
                        <Star className="h-5 w-5 fill-current" />
                        <span className="font-fredoka font-semibold">Unlocked!</span>
                      </div>
                      {selectedBadge.unlockedAt && (
                        <p className="text-sm text-medium-gray">
                          Earned on {new Date(selectedBadge.unlockedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default BadgesGrid;