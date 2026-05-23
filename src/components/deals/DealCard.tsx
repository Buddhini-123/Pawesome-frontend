import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Tag } from 'lucide-react';

export interface DealCardNewProps {
  deal: any;
  onClick: () => void;
  index: number;
  className?: string;
}

const CARD_COLORS = [
  { bg: '#FF8B61', text: '#7A2800' },
  { bg: '#FC6884', text: '#7A0030' },
  { bg: '#48FFF2', text: '#004D50' },
  { bg: '#FFDB4D', text: '#7A5500' },
  { bg: '#B791FF', text: '#2D0066' },
  { bg: '#1BBBFF', text: '#003050' },
];

const ILLUSTRATIONS = [
  'dog-illustrations.png',
  'cat-illustrations.png',
  'heart-illustrations.png',
  'scribble-illustrations.png',
  'hypnotize-illustrations.png',
  'small-hear-illustrations.png',
];

const OFFER_LABELS: Record<string, string> = {
  'buy-get-free':  'Buy 2 Get 1 Free',
  'free-shipping': 'Free Shipping',
  'referral':      'Refer & Save',
  'upgrade':       'Upgrade Deal',
  'discount':      'Special Discount',
  'bundle':        'Bundle Deal',
  'flash-sale':    'Flash Sale',
  'bulk-discount': 'Bulk Discount',
  'flash_sale':    'Flash Sale',
  'clearance':     'Clearance',
  'weekend_sale':  'Weekend Sale',
  'brand_deal':    'Brand Deal',
  'category_sale': 'Category Deal',
  'bogo':          'Buy 1 Get 1 Free',
  'new_customer':  'New Member Deal',
  'bulk_buy':      'Bulk Buy',
  'product_deal':  'Product Deal',
};

const DealCard: React.FC<DealCardNewProps> = ({ deal, onClick, index, className = '' }) => {
  const col    = CARD_COLORS[index % CARD_COLORS.length];
  const illust = ILLUSTRATIONS[index % ILLUSTRATIONS.length];

  const typeLabel =
    OFFER_LABELS[deal.offerType as string] ||
    OFFER_LABELS[deal.deal_type as string] ||
    'Special Offer';

  const discountRaw   = deal.discount_value ?? deal.discount;
  const discountNum   = discountRaw ? Number(discountRaw) : null;
  const isPercentage  = (deal.discount_type ?? deal.discountType) === 'percentage';
  const discountLabel = discountNum
    ? `${discountNum}${isPercentage ? '%' : ' Rs'} OFF`
    : typeLabel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.93 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group ${className}`}
      style={{ backgroundColor: col.bg, minHeight: 220 }}
    >
      {/* Decorative large discount number */}
      {discountNum && isPercentage && (
        <span
          className="absolute -bottom-3 -right-2 font-fredoka font-bold leading-none select-none pointer-events-none"
          style={{ fontSize: 96, color: col.text, opacity: 0.09, lineHeight: 1 }}
        >
          {discountNum}%
        </span>
      )}

      {/* Background illustration */}
      <img
        src={`/icons/illustrations/${illust}`}
        alt="" aria-hidden
        className="absolute bottom-0 right-0 w-28 h-28 object-contain pointer-events-none select-none transition-opacity duration-300"
        style={{ opacity: 0.15, transform: 'rotate(8deg)' }}
      />

      {/* Background pattern dots */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="absolute font-bold"
            style={{
              fontSize: 28,
              color: col.text,
              opacity: 0.06,
              top:  `${[15, 55, 25, 70][i]}%`,
              left: `${[60, 75, 85, 65][i]}%`,
            }}
          >🐾</span>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-5 pt-6">
        {/* Deal type badge */}
        <div
          className="inline-flex items-center gap-1.5 self-start bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full mb-4"
          style={{ color: col.text }}
        >
          <Tag className="w-3 h-3 flex-shrink-0" />
          <span className="font-fredoka font-semibold text-xs">{typeLabel}</span>
        </div>

        {/* Title */}
        <h3
          className="font-fredoka font-bold text-xl leading-tight mb-2"
          style={{ color: col.text }}
        >
          {deal.title}
        </h3>

        {/* Subtitle */}
        <p
          className="font-nunito text-sm leading-relaxed mb-auto line-clamp-2"
          style={{ color: col.text, opacity: 0.72 }}
        >
          {deal.subtitle || deal.display_description || deal.description?.slice(0, 70)}
        </p>

        {/* Bottom row */}
        <div
          className="flex items-center justify-between mt-4 pt-3"
          style={{ borderTop: `1.5px solid ${col.text}22` }}
        >
          <span
            className="font-fredoka font-bold text-base bg-white/35 rounded-xl px-3 py-1"
            style={{ color: col.text }}
          >
            {discountLabel}
          </span>

          <div
            className="w-9 h-9 bg-white/30 rounded-xl flex items-center justify-center group-hover:bg-white/50 transition-colors duration-300 flex-shrink-0"
            style={{ color: col.text }}
          >
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DealCard;
