import React from 'react';
import { motion } from 'framer-motion';
import featuresData from '../../../../data/featuresData.json';

const WhyPawsome: React.FC = () => {
  const { features } = featuresData;

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Why Pawsome ?
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="flex items-center space-x-4 p-6 rounded-lg hover:bg-gray-50 transition-colors duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Icon */}
              <div className={`${feature.iconBg} ${feature.iconColor} w-16 h-16 rounded-full flex items-center justify-center text-2xl flex-shrink-0`}>
                {feature.icon}
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyPawsome;