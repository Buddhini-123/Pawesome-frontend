import React, { useState } from 'react';
import { Plus, Star, Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../hooks/useCart';
import { Product } from '../../types';
import { formatters } from '../../utils/formatters';
import LazyImage from './LazyImage';

interface OptimizedProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageWebp?: string; // WebP version of the image
  imageSrcSet?: string; // Responsive image srcset
  rating: number;
  reviews: number;
  category: string;
  inStock?: boolean;
  discount?: number;
  priority?: boolean; // For above-the-fold products
}

const OptimizedProductCard: React.FC<OptimizedProductCardProps> = ({
  id,
  name,
  brand,
  price,
  originalPrice,
  image,
  imageWebp,
  imageSrcSet,
  rating,
  reviews,
  category,
  inStock = true,
  discount,
  priority = false,
}) => {
  const { addItem } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    const product: Product = {
      id,
      name,
      price,
      image,
      brand,
      category: category || '',
      subcategory: '',
      inStock: true,
      rating: rating || 0,
      reviews: 0
    };
    addItem(product);
    setIsAdded(true);
    
    // Reset after animation
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  // Generate responsive image sources
  const imageSources = imageWebp ? [
    {
      srcSet: imageSrcSet || imageWebp,
      type: 'image/webp',
    }
  ] : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group pet-card"
    >
      <div className="relative overflow-hidden">
        {/* Optimized Image Container */}
        <div className="relative h-56 bg-soft-gray">
          <LazyImage
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            width={224} // Specify dimensions to prevent layout shift
            height={224}
            srcSet={imageSrcSet}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            objectFit="cover"
          />
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Badges */}
        {discount && (
          <div className="pet-badge absolute top-3 left-3 bg-crimson text-white px-3 py-1.5 rounded-full text-sm font-fredoka font-bold shadow-lg transform -rotate-12">
            -{discount}% OFF!
          </div>
        )}
        
        {/* Wishlist Button */}
        <motion.button
          onClick={handleLike}
          whileTap={{ scale: 0.9 }}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
            isLiked 
              ? 'bg-soft-pink text-white' 
              : 'bg-white/90 backdrop-blur-sm text-medium-gray hover:text-soft-pink'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </motion.button>
        
        {/* Pet Category Indicator */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <span className="text-primary-blue">🐾</span>
          <span className="text-xs font-nunito font-semibold text-charcoal capitalize">{category}</span>
        </div>
        
        {!inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-2xl px-6 py-3">
              <span className="text-charcoal font-fredoka font-bold">Out of Stock 😔</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-5">
        {/* Brand */}
        <p className="text-sm text-primary-blue font-nunito font-semibold mb-1">{brand}</p>
        
        {/* Product Name */}
        <h3 className="font-fredoka font-bold text-charcoal text-lg mb-3 line-clamp-2 leading-tight">
          {name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-sunny-yellow text-sunny-yellow' : 'text-light-gray'}`}
              />
            ))}
          </div>
          <span className="text-sm text-medium-gray font-nunito">({reviews} reviews)</span>
        </div>
        
        {/* Price */}
        <div className="flex items-end gap-2 mb-4">
          <span className="text-2xl font-fredoka font-bold text-vibrant-orange">
            {formatters.currency(price)}
          </span>
          {originalPrice && (
            <span className="text-sm text-medium-gray line-through font-nunito mb-1">
              {formatters.currency(originalPrice)}
            </span>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <motion.button 
          onClick={handleAddToCart}
          disabled={!inStock}
          whileTap={{ scale: 0.95 }}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full font-fredoka font-semibold transition-all duration-300 ${
            inStock 
              ? isAdded
                ? 'bg-mint-green text-white'
                : 'bg-warm-orange text-white hover:bg-sunny-yellow hover:shadow-lg hover:scale-105 btn-bounce transition-colors'
              : 'bg-light-gray text-medium-gray cursor-not-allowed'
          }`}
          aria-label={`Add ${name} to cart`}
        >
          {isAdded ? (
            <>
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="text-xl"
              >
                ✓
              </motion.span>
              Added to Cart!
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </>
          )}
        </motion.button>
        
        {/* Quick Actions */}
        <div className="flex items-center justify-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="text-sm text-medium-gray hover:text-primary-blue transition-colors font-nunito">
            Quick View
          </button>
          <span className="text-light-gray">•</span>
          <button className="text-sm text-medium-gray hover:text-primary-blue transition-colors font-nunito">
            Compare
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OptimizedProductCard;