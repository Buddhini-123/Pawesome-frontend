import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      {/* Discount Badge */}
      {product.discount && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          -{product.discount}%
        </div>
      )}

      {/* Product Image */}
      <div className="relative bg-gray-50 p-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-32 md:h-40 object-contain mx-auto group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Quick Add Button */}
        <motion.button
          className="absolute bottom-4 right-4 bg-orange-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ShoppingCart className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex">
            {renderStars(product.rating)}
          </div>
          <span className="text-gray-500 text-xs">({product.reviews})</span>
        </div>
        
        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="font-bold text-gray-800 text-lg">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-gray-500 text-sm line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;