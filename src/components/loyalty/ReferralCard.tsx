import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Copy, 
  Share, 
  Mail, 
  MessageCircle, 
  CheckCircle,
  Gift,
  TrendingUp
} from 'lucide-react';
import { useLoyalty } from '../../hooks/useLoyalty';
import { LOYALTY_CONSTANTS } from '../../types/loyalty';
import { formatters } from '../../utils/formatters';

const ReferralCard: React.FC = () => {
  const { loyaltyCard } = useLoyalty();
  const [copied, setCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState<'email' | 'sms' | 'social' | null>(null);

  if (!loyaltyCard) {
    return null;
  }

  // Generate referral code based on card number
  const referralCode = `PAW${loyaltyCard.cardNumber.slice(-4)}`;
  const referralLink = `https://pawsome.com/join?ref=${referralCode}`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (method: 'email' | 'sms' | 'social') => {
    const message = `Join me on Pawsome and get ${formatters.currency(50)} off your first order! Use my referral code: ${referralCode} or click: ${referralLink}`;
    
    switch (method) {
      case 'email':
        window.open(`mailto:?subject=Join Pawsome with my referral!&body=${encodeURIComponent(message)}`);
        break;
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(message)}`);
        break;
      case 'social':
        // For demo purposes - in real app, would integrate with social sharing APIs
        navigator.share?.({
          title: 'Join Pawsome!',
          text: message,
          url: referralLink
        });
        break;
    }
    setShareMethod(method);
  };

  // Mock referral stats
  const referralStats = {
    totalReferred: 3,
    successfulReferrals: 2,
    pendingReferrals: 1,
    totalPointsEarned: 1000,
    thisMonthReferrals: 1
  };

  return (
    <div className="space-y-6">
      {/* Main Referral Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-mint-green to-primary-blue rounded-3xl p-8 text-white shadow-2xl"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
            <Users className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-fredoka font-bold mb-2">
            Refer & Earn
          </h2>
          <p className="text-white/80 font-fredoka">
            Give {formatters.currency(50)}, Get {LOYALTY_CONSTANTS.REFERRAL_BONUS_POINTS} Points
          </p>
        </div>

        {/* Referral Code */}
        <div className="bg-white/10 rounded-2xl p-6 mb-6">
          <p className="text-white/70 text-sm font-fredoka mb-2">Your Referral Code</p>
          <div className="flex items-center justify-between bg-white/20 rounded-xl p-4">
            <span className="text-2xl font-fredoka font-bold tracking-wider">
              {referralCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              {copied ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* How it Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-fredoka font-bold">1</span>
            </div>
            <p className="text-sm font-fredoka">Share your code</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-fredoka font-bold">2</span>
            </div>
            <p className="text-sm font-fredoka">Friend gets {formatters.currency(50)} off</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-fredoka font-bold">3</span>
            </div>
            <p className="text-sm font-fredoka">You earn 500 points</p>
          </div>
        </div>
      </motion.div>

      {/* Sharing Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-fredoka font-bold text-charcoal mb-4">
          Share Your Code
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleShare('email')}
            className="flex items-center space-x-3 p-4 bg-soft-gray rounded-xl hover:bg-light-gray transition-colors group"
          >
            <Mail className="h-6 w-6 text-primary-blue group-hover:text-primary-blue/80" />
            <div className="text-left">
              <p className="font-fredoka font-semibold text-charcoal">Email</p>
              <p className="text-sm text-medium-gray">Send via email</p>
            </div>
          </button>

          <button
            onClick={() => handleShare('sms')}
            className="flex items-center space-x-3 p-4 bg-soft-gray rounded-xl hover:bg-light-gray transition-colors group"
          >
            <MessageCircle className="h-6 w-6 text-mint-green group-hover:text-mint-green/80" />
            <div className="text-left">
              <p className="font-fredoka font-semibold text-charcoal">SMS</p>
              <p className="text-sm text-medium-gray">Send via text</p>
            </div>
          </button>

          <button
            onClick={() => handleShare('social')}
            className="flex items-center space-x-3 p-4 bg-soft-gray rounded-xl hover:bg-light-gray transition-colors group"
          >
            <Share className="h-6 w-6 text-vibrant-orange group-hover:text-vibrant-orange/80" />
            <div className="text-left">
              <p className="font-fredoka font-semibold text-charcoal">Social</p>
              <p className="text-sm text-medium-gray">Share anywhere</p>
            </div>
          </button>
        </div>

        {/* Copy Link */}
        <div className="mt-6 p-4 bg-sunny-yellow/10 rounded-xl">
          <p className="text-sm font-fredoka font-semibold text-charcoal mb-2">
            Or share this link:
          </p>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-light-gray rounded-lg text-sm font-fredoka"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-sunny-yellow text-charcoal rounded-lg hover:bg-sunny-yellow/80 transition-colors font-fredoka font-semibold"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Referral Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-fredoka font-bold text-charcoal mb-6">
          Your Referral Stats
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-mint-green/10 rounded-xl">
            <p className="text-2xl font-fredoka font-bold text-mint-green">
              {referralStats.totalReferred}
            </p>
            <p className="text-sm text-medium-gray font-fredoka">Total Referred</p>
          </div>
          <div className="text-center p-4 bg-sunny-yellow/10 rounded-xl">
            <p className="text-2xl font-fredoka font-bold text-sunny-yellow">
              {referralStats.successfulReferrals}
            </p>
            <p className="text-sm text-medium-gray font-fredoka">Successful</p>
          </div>
          <div className="text-center p-4 bg-vibrant-orange/10 rounded-xl">
            <p className="text-2xl font-fredoka font-bold text-vibrant-orange">
              {referralStats.pendingReferrals}
            </p>
            <p className="text-sm text-medium-gray font-fredoka">Pending</p>
          </div>
          <div className="text-center p-4 bg-lavender/10 rounded-xl">
            <p className="text-2xl font-fredoka font-bold text-lavender">
              {referralStats.totalPointsEarned}
            </p>
            <p className="text-sm text-medium-gray font-fredoka">Points Earned</p>
          </div>
        </div>

        {/* Recent Referrals */}
        <div>
          <h4 className="font-fredoka font-semibold text-charcoal mb-4">Recent Referrals</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-soft-gray rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-mint-green rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-fredoka font-semibold text-charcoal">Sarah M.</p>
                  <p className="text-sm text-medium-gray">Completed first order</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-fredoka font-bold text-mint-green">+500 pts</p>
                <p className="text-xs text-medium-gray">2 days ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-soft-gray rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-sunny-yellow rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-fredoka font-semibold text-charcoal">Mike D.</p>
                  <p className="text-sm text-medium-gray">Signed up, pending order</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-fredoka font-bold text-sunny-yellow">Pending</p>
                <p className="text-xs text-medium-gray">1 week ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-soft-gray rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-mint-green rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-fredoka font-semibold text-charcoal">Alex R.</p>
                  <p className="text-sm text-medium-gray">Completed first order</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-fredoka font-bold text-mint-green">+500 pts</p>
                <p className="text-xs text-medium-gray">2 weeks ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bonus Info */}
        <div className="mt-6 p-4 bg-lavender/10 rounded-xl">
          <div className="flex items-start space-x-3">
            <Gift className="h-6 w-6 text-lavender mt-1" />
            <div>
              <p className="font-fredoka font-semibold text-charcoal mb-1">
                Bonus Opportunity!
              </p>
              <p className="text-sm text-medium-gray">
                Refer 5 friends this month and get an extra 1000 bonus points! 
                You're {5 - referralStats.thisMonthReferrals} referrals away.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReferralCard;