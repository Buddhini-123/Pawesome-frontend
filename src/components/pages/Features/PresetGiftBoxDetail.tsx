import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Package,
  ShoppingCart,
  Tag,
  Sparkles,
  CheckCircle,
  Gift,
} from 'lucide-react';
import { giftService, PresetGiftBox } from '../../../services/gift.service';
import { useAuth } from '../../../hooks/useAuth';
import { toast } from 'react-toastify';

const PresetGiftBoxDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [box, setBox] = useState<PresetGiftBox | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchBoxDetails = async () => {
      if (!slug) return;

      setIsLoading(true);
      try {
        const response = await giftService.getPresetBox(slug);
        setBox(response.data);
      } catch (error) {
        console.error('Failed to fetch preset box:', error);
        toast.error('Failed to load gift box details');
        navigate('/gifts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoxDetails();
  }, [slug, navigate]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!box) return;

    setIsAdding(true);
    try {
      await giftService.addPresetBoxToCart(box.id);
      toast.success(`${box.name} added to cart! 🎉`);
      navigate('/cart');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add to cart';
      toast.error(errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  const occasionColors: Record<string, string> = {
    birthday: 'from-vibrant-orange to-sunny-yellow',
    anniversary: 'from-soft-pink to-lavender',
    holiday: 'from-mint-green to-primary-blue',
    congratulations: 'from-sunny-yellow to-vibrant-orange',
    thank_you: 'from-mint-green to-primary-blue',
    get_well: 'from-lavender to-soft-pink',
    sympathy: 'from-medium-gray to-charcoal',
    other: 'from-primary-blue to-mint-green',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-white via-soft-gray to-primary-blue/5 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!box) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-white via-soft-gray to-primary-blue/5 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-20 h-20 text-medium-gray mx-auto mb-4" />
          <p className="text-xl text-charcoal font-fredoka">Gift box not found</p>
        </div>
      </div>
    );
  }

  const occasionGradient = occasionColors[box.occasion] || occasionColors.other;

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-white via-soft-gray to-primary-blue/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/gifts')}
          className="flex items-center gap-2 text-primary-blue hover:text-vibrant-orange transition-colors mb-8 font-fredoka font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Gifts
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image and Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="relative h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-soft-gray to-primary-blue/10 mb-6 shadow-2xl">
              {box.image_url ? (
                <img
                  src={box.image_url}
                  alt={box.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Gift className="w-32 h-32 text-primary-blue opacity-30" />
                </div>
              )}

              {/* Occasion Badge */}
              <div className="absolute top-6 left-6">
                <span
                  className={`bg-gradient-to-r ${occasionGradient} text-white text-sm font-fredoka font-bold px-4 py-2 rounded-full shadow-lg capitalize`}
                >
                  {box.occasion.replace('_', ' ')}
                </span>
              </div>

              {/* Discount Badge */}
              {parseFloat(box.discount_percentage) > 0 && (
                <div className="absolute top-6 right-6">
                  <motion.div
                    initial={{ rotate: -10 }}
                    animate={{ rotate: 0 }}
                    className="bg-gradient-to-r from-vibrant-orange to-sunny-yellow text-white font-fredoka font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
                  >
                    <Tag className="w-5 h-5" />
                    {box.discount_percentage}% OFF
                  </motion.div>
                </div>
              )}
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-4 shadow-lg border-2 border-primary-blue/10"
              >
                <Package className="w-8 h-8 text-primary-blue mb-2" />
                <p className="text-sm text-medium-gray font-fredoka">Total Items</p>
                <p className="text-2xl font-fredoka font-bold text-charcoal">
                  {box.total_items}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-4 shadow-lg border-2 border-mint-green/10"
              >
                <Sparkles className="w-8 h-8 text-mint-green mb-2" />
                <p className="text-sm text-medium-gray font-fredoka">You Save</p>
                <p className="text-2xl font-fredoka font-bold text-mint-green">
                  {box.formatted_savings}
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Title and Description */}
            <div>
              <h1 className="text-4xl md:text-5xl font-fredoka font-bold text-charcoal mb-4">
                {box.name}
              </h1>
              <p className="text-lg text-medium-gray leading-relaxed">
                {box.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-vibrant-orange/5 to-sunny-yellow/5 rounded-2xl p-6 border-2 border-vibrant-orange/20">
              <div className="flex items-baseline gap-4 mb-2">
                {parseFloat(box.discount_percentage) > 0 && (
                  <span className="text-2xl text-medium-gray line-through">
                    {box.formatted_base_price}
                  </span>
                )}
                <span className="text-5xl font-fredoka font-bold bg-gradient-to-r from-vibrant-orange to-sunny-yellow bg-clip-text text-transparent">
                  {box.formatted_final_price}
                </span>
              </div>
              {box.savings_amount > 0 && (
                <p className="text-mint-green font-fredoka font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Save {box.formatted_savings} ({box.discount_percentage}% off)
                </p>
              )}
            </div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              disabled={isAdding}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-vibrant-orange to-sunny-yellow text-white font-fredoka font-bold py-5 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-xl"
            >
              {isAdding ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <ShoppingCart className="w-6 h-6" />
                  </motion.div>
                  Adding to Cart...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart
                </>
              )}
            </motion.button>

            {/* What's Included Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-fredoka font-bold text-charcoal mb-4 flex items-center gap-2">
                <Package className="w-6 h-6 text-primary-blue" />
                What's Included
              </h2>

              <div className="space-y-4 mb-6">
                {box.products && box.products.length > 0 ? (
                  box.products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-soft-gray rounded-xl hover:bg-primary-blue/5 transition-colors"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-white shadow flex-shrink-0">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-primary-blue opacity-30" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-fredoka font-semibold text-charcoal">
                          {product.name}
                        </h3>
                        <p className="text-sm text-medium-gray">
                          Quantity: {product.pivot?.quantity || 1}
                        </p>
                      </div>

                      {/* Product Price */}
                      <div className="text-right">
                        <p className="font-fredoka font-bold text-primary-blue">
                          Rs. {parseFloat(product.price || '0').toLocaleString()}
                        </p>
                        <p className="text-xs text-medium-gray">per item</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-medium-gray text-center py-4">
                    No products available
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              {box.products && box.products.length > 0 && (
                <div className="border-t-2 border-soft-gray pt-4 space-y-2">
                  <div className="flex justify-between items-center text-charcoal">
                    <span className="font-fredoka">Subtotal:</span>
                    <span className="font-fredoka font-semibold">
                      {box.formatted_base_price}
                    </span>
                  </div>
                  {parseFloat(box.discount_percentage) > 0 && (
                    <div className="flex justify-between items-center text-mint-green">
                      <span className="font-fredoka">
                        Discount ({box.discount_percentage}%):
                      </span>
                      <span className="font-fredoka font-semibold">
                        - {box.formatted_savings}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xl font-fredoka font-bold text-vibrant-orange pt-2 border-t-2 border-vibrant-orange/20">
                    <span>Total:</span>
                    <span>{box.formatted_final_price}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Info (if available) */}
            {box.theme && (
              <div className="bg-gradient-to-r from-lavender/10 to-soft-pink/10 rounded-2xl p-6 border-2 border-lavender/20">
                <h3 className="text-lg font-fredoka font-bold text-charcoal mb-2">
                  Theme: {box.theme.name}
                </h3>
                <p className="text-medium-gray">{box.theme.description}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PresetGiftBoxDetail;
