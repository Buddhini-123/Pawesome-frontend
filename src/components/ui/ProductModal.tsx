import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart, Star, Minus, Plus } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  description?: string;
  features?: string[];
  inStock?: boolean;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: number, quantity: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  if (!product) return null;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    onAddToCart(product.id, quantity);
    setIsAddingToCart(false);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-fredoka font-bold text-charcoal">Product Details</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-off-white rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-charcoal" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="space-y-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-80 object-cover rounded-xl shadow-lg"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-fredoka font-bold text-charcoal mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(product.rating)
                                ? 'text-sunny-yellow fill-current'
                                : 'text-light-gray'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-charcoal ml-2">({product.rating})</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      {product.originalPrice && (
                        <span className="text-xl text-charcoal line-through">
                          Rs. {product.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-3xl font-fredoka font-bold text-charcoal">
                        Rs. {product.price.toFixed(2)}
                      </span>
                    </div>
                    {product.originalPrice && (
                      <span className="inline-block bg-vibrant-orange/10 text-vibrant-orange px-3 py-1 rounded-full text-sm font-fredoka font-medium">
                        Save Rs. {(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {product.description && (
                    <div>
                      <h4 className="font-fredoka font-semibold text-charcoal mb-2">Description</h4>
                      <p className="text-charcoal leading-relaxed">{product.description}</p>
                    </div>
                  )}

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div>
                      <h4 className="font-fredoka font-semibold text-charcoal mb-2">Features</h4>
                      <ul className="space-y-1">
                        {product.features.map((feature, index) => (
                          <li key={index} className="text-charcoal flex items-center">
                            <span className="w-2 h-2 bg-vibrant-orange rounded-full mr-3"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div>
                    <h4 className="font-fredoka font-semibold text-charcoal mb-3">Quantity</h4>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={decrementQuantity}
                        className="p-2 border border-light-gray rounded-lg hover:bg-off-white transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-xl font-fredoka font-semibold min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={incrementQuantity}
                        className="p-2 border border-light-gray rounded-lg hover:bg-off-white transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      disabled={isAddingToCart || !product.inStock}
                      className="w-full bg-vibrant-orange hover:bg-vibrant-orange/90 disabled:bg-light-gray text-white font-fredoka font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition-colors"
                    >
                      {isAddingToCart ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <ShoppingCart className="h-5 w-5" />
                          <span>
                            {product.inStock !== false ? 'Add to Cart' : 'Out of Stock'}
                          </span>
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full border-2 border-vibrant-orange text-vibrant-orange hover:bg-vibrant-orange/10 font-fredoka font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                      <span>Add to Wishlist</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;