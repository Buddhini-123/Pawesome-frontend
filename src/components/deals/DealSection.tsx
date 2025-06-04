import React from 'react';
import { motion } from 'framer-motion';
import { DealSectionProps } from '../../types/deals';
import DealCard from './DealCard';

const DealSection: React.FC<DealSectionProps> = ({ 
  section, 
  onDealClick, 
  className = '' 
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${className}`}
    >
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-charcoal-gray mb-2">
          {section.title}
        </h2>
        {section.subtitle && (
          <p className="text-lg text-gray-600 max-w-2xl">
            {section.subtitle}
          </p>
        )}
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {section.deals.map((deal, index) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.4 
            }}
          >
            <DealCard 
              deal={deal} 
              onClick={onDealClick}
              className="h-full"
            />
          </motion.div>
        ))}
      </div>

      {/* Mobile Horizontal Scroll Alternative */}
      <div className="block sm:hidden mt-6">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {section.deals.map((deal, index) => (
            <motion.div
              key={`mobile-${deal.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.4 
              }}
              className="flex-shrink-0 w-80"
            >
              <DealCard 
                deal={deal} 
                onClick={onDealClick}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default DealSection;