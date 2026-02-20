import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, ShoppingCart, Package, Sparkles, Tag } from 'lucide-react';
import { PresetGiftBox } from '../../services/gift.service';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { giftService } from '../../services/gift.service';
import { toast } from 'react-toastify';

interface PresetBoxCardProps {
  box: PresetGiftBox;
  index?: number;
}

const PresetBoxCard: React.FC<PresetBoxCardProps> = ({ box, index = 0 }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const occasionColors: Record<string, string> = {
    birthday: 'bg-gradient-to-r from-vibrant-orange to-sunny-yellow',
    anniversary: 'bg-gradient-to-r from-soft-pink to-lavender',
    holiday: 'bg-gradient-to-r from-mint-green to-primary-blue',
    congratulations: 'bg-gradient-to-r from-sunny-yellow to-vibrant-orange',
    thank_you: 'bg-gradient-to-r from-mint-green to-primary-blue',
    get_well: 'bg-gradient-to-r from-lavender to-soft-pink',
    sympathy: 'bg-gradient-to-r from-medium-gray to-charcoal',
    other: 'bg-gradient-to-r from-primary-blue to-mint-green',
  };

  const occasionBadgeColor = occasionColors[box.occasion] || occasionColors.other;

  const handleAddToCart = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    setIsAdding(true);
    try {
      await giftService.addPresetBoxToCart(box.id);
      toast.success(`${box.name} added to cart! 🎉`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add to cart';
      toast.error(errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  const handleViewDetails = () => {
    // Navigate to detail page
    navigate(`/gifts/preset-boxes/${box.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      whileHover={{ y: -10 }}
      className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handleViewDetails}
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-soft-gray to-primary-blue/10">
        {box.image_url ? (
          <img
            src={box.image_url}
            alt={box.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Gift className="w-24 h-24 text-vibrant-orange opacity-50" />
          </div>
        )}

        {/* Occasion Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`${occasionBadgeColor} text-white text-xs font-fredoka font-bold px-3 py-1.5 rounded-full shadow-lg capitalize`}
          >
            {box.occasion.replace('_', ' ')}
          </span>
        </div>

        {/* Discount Badge */}
        {parseFloat(box.discount_percentage) > 0 && (
          <div className="absolute top-4 right-4">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-vibrant-orange to-sunny-yellow text-white font-fredoka font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1"
            >
              <Tag className="w-4 h-4" />
              {box.discount_percentage}% OFF
            </motion.div>
          </div>
        )}

        {/* Sparkle Effect on Hover */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Sparkles className="w-12 h-12 text-vibrant-orange opacity-60" />
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div>
          <h3 className="font-fredoka font-bold text-xl text-charcoal mb-2 group-hover:text-vibrant-orange transition-colors">
            {box.name}
          </h3>
          <p className="text-sm text-medium-gray line-clamp-2">{box.description}</p>
        </div>

        {/* Items Count */}
        <div className="flex items-center gap-2 text-charcoal">
          <Package className="w-5 h-5 text-primary-blue" />
          <span className="text-sm font-fredoka font-semibold">
            {box.total_items} {box.total_items === 1 ? 'item' : 'items'} included
          </span>
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {parseFloat(box.discount_percentage) > 0 && (
              <span className="text-medium-gray line-through text-lg">
                {box.formatted_base_price}
              </span>
            )}
            <span className="text-3xl font-fredoka font-bold text-vibrant-orange">
              {box.formatted_final_price}
            </span>
          </div>

          {box.savings_amount > 0 && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-mint-green/10 text-mint-green border-2 border-mint-green/30 rounded-full text-sm font-fredoka font-bold"
            >
              <Sparkles className="w-4 h-4" />
              Save {box.formatted_savings}
            </motion.div>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          onClick={handleAddToCart}
          disabled={isAdding}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-vibrant-orange to-sunny-yellow text-white font-fredoka font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isAdding ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.div>
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PresetBoxCard;
