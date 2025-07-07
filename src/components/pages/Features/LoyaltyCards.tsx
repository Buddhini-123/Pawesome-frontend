import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Award, Trophy, Gift } from 'lucide-react';

const LoyaltyCards: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender/20 to-primary-blue/20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center mb-6">
            <CreditCard className="text-lavender mr-3 h-12 w-12" />
            <h1 className="text-4xl font-fredoka font-bold text-charcoal">Loyalty Cards</h1>
          </div>
          <p className="text-xl text-medium-gray max-w-2xl mx-auto">
            Earn rewards with every purchase and unlock exclusive benefits
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Award className="h-8 w-8 text-lavender mb-4" />
            <h3 className="text-xl font-fredoka font-semibold mb-3">Points System</h3>
            <p className="text-medium-gray mb-4">Earn points with every purchase and redeem for rewards</p>
            <button className="bg-lavender text-white px-6 py-2 rounded-lg font-fredoka hover:bg-lavender/80 transition-colors">
              Join Now
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Trophy className="h-8 w-8 text-lavender mb-4" />
            <h3 className="text-xl font-fredoka font-semibold mb-3">VIP Status</h3>
            <p className="text-medium-gray mb-4">Unlock exclusive benefits and early access to sales</p>
            <button className="bg-lavender text-white px-6 py-2 rounded-lg font-fredoka hover:bg-lavender/80 transition-colors">
              Learn More
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Gift className="h-8 w-8 text-lavender mb-4" />
            <h3 className="text-xl font-fredoka font-semibold mb-3">Exclusive Rewards</h3>
            <p className="text-medium-gray mb-4">Special gifts and discounts for loyal customers</p>
            <button className="bg-lavender text-white px-6 py-2 rounded-lg font-fredoka hover:bg-lavender/80 transition-colors">
              View Rewards
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyCards;