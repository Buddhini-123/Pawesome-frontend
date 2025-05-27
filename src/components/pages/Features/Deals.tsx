import React from 'react';
import { motion } from 'framer-motion';
import { Percent, Tag, Zap, TrendingDown } from 'lucide-react';

const Deals: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center mb-6">
            <Percent className="text-green-600 mr-3 h-12 w-12" />
            <h1 className="text-4xl font-bold text-gray-800">Amazing Deals</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Incredible discounts and offers on premium pet products
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Tag className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Flash Sales</h3>
            <p className="text-gray-600 mb-4">Limited time offers with huge discounts</p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Shop Now
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Zap className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Daily Deals</h3>
            <p className="text-gray-600 mb-4">New deals every day on popular items</p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              View Today's Deals
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <TrendingDown className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Bulk Discounts</h3>
            <p className="text-gray-600 mb-4">Save more when you buy in larger quantities</p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Calculate Savings
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Deals;