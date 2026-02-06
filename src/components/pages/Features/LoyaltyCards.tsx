import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Award,
  Trophy,
  Gift,
  Users,
  History,
  Star,
  Crown,
  TrendingUp,
  Settings
} from 'lucide-react';
import { useLoyalty } from '../../../hooks/useLoyalty';
import { useAuth } from '../../../hooks/useAuth';
import { LoyaltyTier } from '../../../types/loyalty';
import { formatters } from '../../../utils/formatters';
import LoyaltyDashboard from '../../loyalty/LoyaltyDashboard';
import PointsHistory from '../../loyalty/PointsHistory';
import BadgesGrid from '../../loyalty/BadgesGrid';
import ExclusiveDeals from '../../loyalty/ExclusiveDeals';
import ReferralCard from '../../loyalty/ReferralCard';

const LoyaltyCards: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { loyaltyCard, registerLoyaltyCard, isLoading } = useLoyalty();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [autoRegistering, setAutoRegistering] = useState(false);

  // Auto-register loyalty card for logged-in users
  useEffect(() => {
    if (isAuthenticated && !loyaltyCard && !isLoading && !autoRegistering) {
      setAutoRegistering(true);
      registerLoyaltyCard().finally(() => {
        setAutoRegistering(false);
      });
    }
  }, [isAuthenticated, loyaltyCard, isLoading, registerLoyaltyCard, autoRegistering]);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'history', name: 'History', icon: History },
    { id: 'badges', name: 'Badges', icon: Star },
    { id: 'deals', name: 'Exclusive Deals', icon: Crown },
    { id: 'referral', name: 'Refer Friends', icon: Users },
  ];

  // If user is not authenticated, show sign-in prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-off-white">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <CreditCard className="h-20 w-20 text-lavender mx-auto mb-6" />
            <h1 className="text-4xl font-fredoka font-bold text-charcoal mb-4">
              Join Pawsome Loyalty
            </h1>
            <p className="text-xl text-medium-gray mb-8">
              Sign in to access your loyalty account and start earning rewards!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <Award className="h-8 w-8 text-mint-green mx-auto mb-4" />
                <h3 className="font-fredoka font-bold text-charcoal mb-2">Earn Points</h3>
                <p className="text-sm text-medium-gray">1 point per Rs. 10 spent</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <Trophy className="h-8 w-8 text-sunny-yellow mx-auto mb-4" />
                <h3 className="font-fredoka font-bold text-charcoal mb-2">Unlock Tiers</h3>
                <p className="text-sm text-medium-gray">Bronze, Silver, Gold, Platinum</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <Gift className="h-8 w-8 text-vibrant-orange mx-auto mb-4" />
                <h3 className="font-fredoka font-bold text-charcoal mb-2">Get Rewards</h3>
                <p className="text-sm text-medium-gray">Exclusive deals & discounts</p>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-lavender text-white px-8 py-4 rounded-2xl font-fredoka font-bold text-lg hover:bg-lavender/90 transition-colors"
            >
              Sign In to Join
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show loading state while auto-registering loyalty card
  if (isAuthenticated && !loyaltyCard && (isLoading || autoRegistering)) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <CreditCard className="h-20 w-20 text-lavender mx-auto mb-6 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-lavender"></div>
            </div>
          </div>
          <h2 className="text-2xl font-fredoka font-bold text-charcoal mb-2">
            Setting Up Your Loyalty Account
          </h2>
          <p className="text-medium-gray">
            Creating your loyalty card and preparing rewards...
          </p>
          <div className="mt-8 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-lavender rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-lavender rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-lavender rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main loyalty dashboard for authenticated users with loyalty cards
  return (
    <div className="min-h-screen bg-off-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center items-center mb-4">
            <CreditCard className="text-lavender mr-3 h-10 w-10" />
            <h1 className="text-3xl font-fredoka font-bold text-charcoal">
              Pawsome Loyalty
            </h1>
          </div>
          <p className="text-lg text-medium-gray">
            Welcome back, {user?.name || 'Loyal Member'}! 🐾
          </p>
        </motion.div>

        {/* Points Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="bg-gradient-to-br from-lavender to-primary-blue rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-3 mr-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-sm opacity-90 font-fredoka">Available Points</p>
                  <p className="text-4xl font-fredoka font-bold">
                    {(loyaltyCard?.points ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-75 font-fredoka">Tier</p>
                <div className="flex items-center mt-1">
                  {loyaltyCard?.tier === LoyaltyTier.PLATINUM && <span className="text-2xl">💎</span>}
                  {loyaltyCard?.tier === LoyaltyTier.GOLD && <span className="text-2xl">🥇</span>}
                  {loyaltyCard?.tier === LoyaltyTier.SILVER && <span className="text-2xl">🥈</span>}
                  {loyaltyCard?.tier === LoyaltyTier.BRONZE && <span className="text-2xl">🥉</span>}
                  <span className="ml-2 font-fredoka font-bold capitalize">
                    {loyaltyCard?.tier?.toLowerCase() || 'bronze'}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-white/20 pt-4 mt-4">
              <p className="text-xs opacity-75 mb-2 font-fredoka">Points Value</p>
              <p className="text-2xl font-fredoka font-bold">
                Rs. {((loyaltyCard?.points ?? 0) * 0.1).toFixed(2)}
              </p>
              <p className="text-xs opacity-75 mt-1 font-fredoka">
                (1 point = Rs. 0.10)
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-2 mb-8 overflow-x-auto"
        >
          <div className="flex space-x-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-fredoka font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-lavender text-white shadow-md'
                    : 'text-charcoal hover:bg-soft-gray'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && <LoyaltyDashboard />}
          {activeTab === 'history' && <PointsHistory />}
          {activeTab === 'badges' && <BadgesGrid />}
          {activeTab === 'deals' && <ExclusiveDeals />}
          {activeTab === 'referral' && <ReferralCard />}
        </motion.div>
      </div>
    </div>
  );
};

export default LoyaltyCards;