import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Heart, Sparkles, Star } from 'lucide-react';

const Gifts: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center mb-6">
            <Gift className="text-pink-600 mr-3 h-12 w-12" />
            <h1 className="text-4xl font-bold text-gray-800">Pet Gifts</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Special treats and surprises to show your pets how much you care
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Heart className="h-8 w-8 text-pink-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Birthday Boxes</h3>
            <p className="text-gray-600 mb-4">Celebrate your pet's special day with curated gifts</p>
            <button className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors">
              Order Now
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Sparkles className="h-8 w-8 text-pink-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Surprise Bundles</h3>
            <p className="text-gray-600 mb-4">Monthly surprise boxes with toys and treats</p>
            <button className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors">
              Subscribe
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Star className="h-8 w-8 text-pink-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Premium Gifts</h3>
            <p className="text-gray-600 mb-4">Luxury items for the most pampered pets</p>
            <button className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors">
              Explore
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Gifts;