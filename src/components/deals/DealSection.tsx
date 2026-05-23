import React from 'react';
import { motion } from 'framer-motion';
import DealCard from './DealCard';

interface DealSectionProps {
  title: string;
  subtitle?: string;
  deals: any[];
  onDealClick: (deal: any) => void;
  startIndex?: number;
  className?: string;
}

const DealSection: React.FC<DealSectionProps> = ({
  title,
  subtitle,
  deals,
  onDealClick,
  startIndex = 0,
  className = '',
}) => {
  if (!deals.length) return null;

  return (
    <div className={`mb-16 ${className}`}>
      {/* Section heading — matches Gifts / Home style */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.h2
          className="font-fredoka font-bold text-3xl md:text-4xl mb-2"
          style={{ color: '#004D6B' }}
          initial={{ opacity: 0, scale: 0.93 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            className="font-nunito text-lg max-w-xl mx-auto"
            style={{ color: '#004D6B', opacity: 0.70 }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {deals.map((deal, i) => (
          <DealCard
            key={deal.id ?? i}
            deal={deal}
            onClick={() => onDealClick(deal)}
            index={startIndex + i}
          />
        ))}
      </div>
    </div>
  );
};

export default DealSection;
