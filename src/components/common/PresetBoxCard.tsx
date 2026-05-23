import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { PresetGiftBox } from '../../services/gift.service';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { giftService } from '../../services/gift.service';
import { toast } from 'react-toastify';

interface PresetBoxCardProps {
  box: PresetGiftBox;
  index?: number;
}

const OCCASION_CONFIG: Record<string, { bg: string; text: string; cardBg: string; label: string }> = {
  birthday:        { bg: '#FF8B61', text: '#7A2800', cardBg: '#FFF0EA', label: 'Birthday'        },
  anniversary:     { bg: '#FC6884', text: '#7A0030', cardBg: '#FFF0F3', label: 'Anniversary'     },
  holiday:         { bg: '#48FFF2', text: '#004D50', cardBg: '#E8FFFD', label: 'Holiday'         },
  congratulations: { bg: '#FFDB4D', text: '#7A5500', cardBg: '#FFFAE0', label: 'Congrats'        },
  thank_you:       { bg: '#B791FF', text: '#2D0066', cardBg: '#F3EEFF', label: 'Thank You'       },
  get_well:        { bg: '#48FFF2', text: '#004D50', cardBg: '#E8FFFD', label: 'Get Well'        },
  other:           { bg: '#1BBBFF', text: '#004D6B', cardBg: '#E8F7FF', label: 'Gift'            },
};

const PresetBoxCard: React.FC<PresetBoxCardProps> = ({ box, index = 0 }) => {
  const navigate  = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const occ        = OCCASION_CONFIG[box.occasion ?? 'other'] ?? OCCASION_CONFIG.other;
  const hasDiscount = parseFloat(box.discount_percentage) > 0;

  const handleViewDetails = () => navigate(`/gifts/preset-boxes/${box.slug}`);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    setIsAdding(true);
    try {
      await giftService.addPresetBoxToCart(box.id);
      toast.success(`${box.name} added to cart!`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
      onClick={handleViewDetails}
    >
      {/* ── Image ────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: 148, backgroundColor: occ.cardBg }}>
        {box.image_url ? (
          <img
            src={box.image_url}
            alt={box.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/icons/illustrations/dog-illustrations.png"
              alt="" aria-hidden="true"
              className="w-20 h-20 object-contain opacity-20"
            />
          </div>
        )}

        {/* Occasion badge */}
        <span
          className="absolute top-2 left-2 font-fredoka font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm"
          style={{ backgroundColor: occ.bg, color: occ.text }}
        >
          {occ.label}
        </span>

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-2 right-2 bg-vibrant-orange text-white font-fredoka font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
            {box.discount_percentage}% OFF
          </span>
        )}
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="px-3 pt-2.5 pb-3 flex flex-col gap-2 flex-1">

        {/* Name */}
        <h3 className="font-fredoka font-bold text-sm text-charcoal leading-snug line-clamp-2 group-hover:text-primary-blue transition-colors duration-200">
          {box.name}
        </h3>

        {/* Price row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-fredoka font-bold text-base text-primary-blue leading-none">
            {box.formatted_final_price}
          </span>
          {hasDiscount && (
            <span className="font-nunito text-[11px] text-medium-gray line-through leading-none">
              {box.formatted_base_price}
            </span>
          )}
          {box.savings_amount > 0 && (
            <span className="font-fredoka font-bold text-[10px] px-1.5 py-0.5 bg-sunny-yellow text-charcoal rounded-full ml-auto">
              -{box.discount_percentage}%
            </span>
          )}
        </div>

        {/* Add to cart */}
        <motion.button
          onClick={handleAddToCart}
          disabled={isAdding}
          whileTap={{ scale: 0.96 }}
          className="mt-auto w-full flex items-center justify-center gap-1.5 bg-primary-blue hover:bg-vibrant-orange text-white font-fredoka font-semibold py-2 rounded-xl text-xs shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <ShoppingCart className="w-3.5 h-3.5" />
            </motion.div>
          ) : (
            <ShoppingCart className="w-3.5 h-3.5" />
          )}
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </motion.button>

      </div>
    </motion.div>
  );
};

export default PresetBoxCard;
