import React, { useState } from 'react';
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

  // If user is authenticated but doesn't have a loyalty card, show registration
  if (isAuthenticated && !loyaltyCard && !isLoading) {
    return (
      <div className="min-h-screen bg-off-white">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="bg-gradient-to-br from-lavender to-primary-blue rounded-3xl p-12 text-white mb-8">
              <CreditCard className="h-20 w-20 mx-auto mb-6" />
              <h1 className="text-4xl font-fredoka font-bold mb-4">
                Welcome to Pawsome Loyalty!
              </h1>
              <p className="text-xl mb-6 opacity-90">
                Ready to start earning points and unlocking exclusive rewards?
              </p>
              <button 
                onClick={registerLoyaltyCard}
                disabled={isLoading}
                className="bg-white text-lavender px-8 py-4 rounded-2xl font-fredoka font-bold text-lg hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creating Your Card...' : 'Get My Loyalty Card'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl mb-3">🥉</div>
                <h3 className="font-fredoka font-bold text-charcoal mb-2">Bronze Tier</h3>
                <p className="text-sm text-medium-gray">Start earning 1 point per Rs. 10</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl mb-3">🥈</div>
                <h3 className="font-fredoka font-bold text-charcoal mb-2">Silver Tier</h3>
                <p className="text-sm text-medium-gray">1.5x points + 5% extra discount</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl mb-3">🥇</div>
                <h3 className="font-fredoka font-bold text-charcoal mb-2">Gold Tier</h3>
                <p className="text-sm text-medium-gray">2x points + free shipping</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl mb-3">💎</div>
                <h3 className="font-fredoka font-bold text-charcoal mb-2">Platinum Tier</h3>
                <p className="text-sm text-medium-gray">3x points + VIP perks</p>
              </div>
            </div>
          </motion.div>
        </div>
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