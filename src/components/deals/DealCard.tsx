import React from 'react';
import { motion } from 'framer-motion';
import { DealCardProps } from '../../types/deals';

const DealCard: React.FC<DealCardProps> = ({ deal, onClick, className = '' }) => {
  const handleClick = () => {
    onClick(deal);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={`relative bg-sunny-yellow rounded-2xl overflow-hidden h-64 cursor-pointer group ${className}`}
      onClick={handleClick}
    >
      {/* Dog Image - Keep original positioning */}
      <div className="absolute right-0 top-0 h-full w-1/2 z-20">
        <img
          src={deal.image || '/api/placeholder/200/300'}
          alt={deal.title}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-sunny-yellow via-sunny-yellow to-sunny-yellow/60"></div>

      {/* Content - Left Side Only */}
      <div className="relative z-20 h-full w-1/2 p-4 flex flex-col">
        {/* Top Row - Offer Badge */}
        <div className="mb-3">
          {deal.offerType && (
            <div className="bg-black/10 backdrop-blur-sm text-black text-xs px-3 py-1 rounded-full font-fredoka font-medium inline-block">
              {deal.offerType === 'buy-get-free' && 'Buy 2, Get 1 Free'}
              {deal.offerType === 'free-shipping' && 'Free Shipping'}
              {deal.offerType === 'referral' && 'Refer & Save'}
              {deal.offerType === 'upgrade' && 'Upgrade Deal'}
              {deal.offerType === 'discount' && `${deal.discount}% Off`}
              {deal.offerType === 'bundle' && 'Bundle Deal'}
              {deal.offerType === 'flash-sale' && 'Flash Sale'}
              {deal.offerType === 'bulk-discount' && 'Bulk Discount'}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Deal Title */}
          <h3 className="text-black font-fredoka font-bold text-lg leading-tight mb-2">
            {deal.title}
          </h3>
          
          {/* Deal Subtitle */}
          <p className="text-black text-sm opacity-90 font-fredoka mb-3 leading-relaxed">
            {deal.subtitle}
          </p>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex text-black text-xs mr-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3 h-3 fill-current mr-0.5" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-black text-xs font-fredoka opacity-80">(5.0)</span>
          </div>
        </div>

        {/* Bottom Row - Action Button */}
        <div>
          <button className="bg-primary-blue text-white px-4 py-2 rounded-full text-sm font-fredoka font-medium hover:bg-primary-blue/90 transition-colors group-hover:scale-105 transform duration-200">
            See More
          </button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-40"></div>
    </motion.div>
  );
};

export default DealCard;