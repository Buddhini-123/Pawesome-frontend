import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import dealsData from '../../../../data/dealsData.json';

const FeaturedDeals: React.FC = () => {
  const { deals } = dealsData;

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-gray-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Featured Deals of the week
          </motion.h2>
          
          <motion.button
            className="text-orange-500 hover:text-orange-600 font-semibold flex items-center space-x-1 transition-colors duration-300"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ x: 5 }}
          >
            <span>View all Deals</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deals.map((deal, index) => (
            <motion.div
              key={deal.id}
              className={`${deal.backgroundColor} rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Discount Badge */}
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-sm font-bold">{deal.discount}</span>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  {deal.title}
                </h3>
                <p className="text-white/90 mb-6">
                  {deal.subtitle}
                </p>
                
                <motion.button
                  className="bg-white text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{deal.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Background Image */}
              <div className="absolute right-0 bottom-0 w-32 h-32 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                <img
                  src={deal.image}
                  alt="Deal"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDeals;