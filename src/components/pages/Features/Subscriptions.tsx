import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Package, Truck } from 'lucide-react';

const Subscriptions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center mb-6">
            <Calendar className="text-blue-600 mr-3 h-12 w-12" />
            <h1 className="text-4xl font-bold text-gray-800">Pet Subscriptions</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Never run out of your pet's essentials with our convenient subscription service
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Package className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Monthly Essentials</h3>
            <p className="text-gray-600 mb-4">Regular delivery of food, treats, and supplies</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe Now
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Clock className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Flexible Schedule</h3>
            <p className="text-gray-600 mb-4">Choose delivery frequency that suits your needs</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Customize
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Truck className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Free Delivery</h3>
            <p className="text-gray-600 mb-4">No extra charges for subscription deliveries</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Learn More
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;