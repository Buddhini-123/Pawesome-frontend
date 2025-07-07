import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  TrendingUp,
  Gift,
  Truck,
  Shield,
  Clock,
  Heart,
  Star,
  Package,
  Zap,
  CheckCircle,
  Lock
} from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { formatters } from '../../../utils/formatters';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowPromo(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const getShippingCost = (): number => {
    return totalPrice >= 20000 ? 0 : 150;
  };

  const getFinalTotal = (): number => {
    return totalPrice + getShippingCost();
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItem(itemId);
    setTimeout(() => {
      removeItem(itemId);
      setRemovingItem(null);
    }, 300);
  };

  const benefits = [
    { icon: Truck, text: 'Free Shipping on ₹200+', color: 'from-primary-blue to-primary-blue' },
    { icon: Shield, text: 'Secure Checkout', color: 'from-mint-green to-mint-green' },
    { icon: Clock, text: '24/7 Support', color: 'from-purple-400 to-purple-600' },
    { icon: Gift, text: 'Gift Wrapping Available', color: 'from-pink-400 to-pink-600' }
  ];

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-pink-50 overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-fredoka font-bold bg-gradient-to-r from-vibrant-orange to-pink-600 bg-clip-text text-transparent mb-4">My Cart</h1>
          </motion.div>
          
          <motion.div 
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center max-w-2xl mx-auto border border-white/50"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <motion.div
              animate={floatingAnimation}
              className="inline-block mb-6"
            >
              <div className="bg-gradient-to-br from-amber-100 to-pink-100 rounded-full p-8">
                <ShoppingBag className="h-24 w-24 text-vibrant-orange" />
              </div>
            </motion.div>
            <h2 className="text-3xl font-fredoka font-bold text-charcoal mb-4">Your cart is empty</h2>
            <p className="text-charcoal mb-8 text-lg">Let's fill it with amazing products for your furry friends!</p>
            <motion.button 
              onClick={handleContinueShopping}
              className="bg-gradient-to-r from-sunny-yellow to-vibrant-orange hover:from-sunny-yellow hover:to-vibrant-orange text-white font-fredoka font-bold px-10 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Shopping
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Parallax Grid Pattern */}
      <motion.div 
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 20 0 L 0 0 0 20" fill="none" stroke="black" stroke-width="0.5"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23grid)" /%3E%3C/svg%3E")',
          transform: `translateX(${mousePosition.x * 0.02}px) translateY(${mousePosition.y * 0.02}px)`
        }}
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-5xl font-fredoka font-bold bg-gradient-to-r from-vibrant-orange to-vibrant-orange bg-clip-text text-transparent mb-2">My Cart</h1>
              <p className="text-xl text-charcoal flex items-center">
                <Package className="w-5 h-5 mr-2 text-sunny-yellow" />
                {formatters.pluralize(totalItems, 'item')} ready for checkout
              </p>
            </div>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="hidden md:block"
            >
              <Sparkles className="w-12 h-12 text-sunny-yellow" />
            </motion.div>
          </div>
        </motion.div>

        {/* Benefits Banner */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`bg-gradient-to-r ${benefit.color} w-12 h-12 rounded-xl flex items-center justify-center mb-2`}>
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-fredoka font-medium text-charcoal">{benefit.text}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              <div className="p-8 bg-gradient-to-r from-amber-50 to-orange-50 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-sunny-yellow to-vibrant-orange rounded-2xl p-3 mr-4">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-fredoka font-bold text-charcoal">Shopping Cart</h2>
                    <p className="text-sm text-charcoal">{totalItems} items selected</p>
                  </div>
                </div>
                <motion.button
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:text-red-700 font-fredoka font-medium transition-colors flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear All
                </motion.button>
              </div>
              
              <div className="divide-y divide-soft-gray">
                <AnimatePresence>
                  {cart.map((item, index) => (
                    <motion.div 
                      key={item.id} 
                      className="p-6 hover:bg-soft-gray/50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: removingItem === item.id ? 0 : 1, 
                        x: removingItem === item.id ? -100 : 0,
                        scale: removingItem === item.id ? 0.8 : 1
                      }}
                      exit={{ opacity: 0, x: -100, scale: 0.8 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onHoverStart={() => setHoveredItem(item.id)}
                      onHoverEnd={() => setHoveredItem(null)}
                    >
                      <div className="flex items-center space-x-4">
                        <motion.div 
                          className="relative"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-24 h-24 object-cover rounded-2xl shadow-lg"
                          />
                          {hoveredItem === item.id && (
                            <motion.div
                              className="absolute inset-0 bg-black/10 rounded-2xl"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            />
                          )}
                        </motion.div>
                        
                        <div className="flex-1">
                          <h3 className="font-fredoka font-bold text-charcoal text-lg flex items-center">
                            {item.product.name}
                            {hoveredItem === item.id && (
                              <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="ml-2"
                              >
                                <Heart className="w-4 h-4 text-pink-500" />
                              </motion.span>
                            )}
                          </h3>
                          <p className="text-sm text-charcoal flex items-center mt-1">
                            <Star className="w-3 h-3 text-sunny-yellow mr-1" />
                            {item.product.brand}
                          </p>
                          <motion.p 
                            className="text-xl font-fredoka font-bold bg-gradient-to-r from-mint-green to-mint-green bg-clip-text text-transparent mt-2"
                            animate={{ scale: hoveredItem === item.id ? 1.05 : 1 }}
                          >
                            {formatters.currency(item.product.price)}
                          </motion.p>
                        </div>
                        
                        <div className="flex items-center bg-soft-gray rounded-full p-1">
                          <motion.button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-white hover:bg-soft-gray p-2 rounded-full transition-all shadow-sm hover:shadow-md"
                            disabled={item.quantity <= 1}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Minus className="h-4 w-4 text-charcoal" />
                          </motion.button>
                          
                          <motion.span 
                            className="w-12 text-center font-fredoka font-bold text-charcoal text-lg"
                            key={item.quantity}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.3 }}
                          >
                            {item.quantity}
                          </motion.span>
                          
                          <motion.button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-white hover:bg-soft-gray p-2 rounded-full transition-all shadow-sm hover:shadow-md"
                            disabled={item.quantity >= 99}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Plus className="h-4 w-4 text-charcoal" />
                          </motion.button>
                        </div>
                        
                        <div className="text-right">
                          <motion.p 
                            className="font-fredoka font-bold text-2xl text-charcoal"
                            animate={{ scale: hoveredItem === item.id ? 1.05 : 1 }}
                          >
                            {formatters.currency(item.product.price * item.quantity)}
                          </motion.p>
                          <motion.button 
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 mt-2 transition-colors inline-flex items-center"
                            title="Remove item"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sticky top-6 border border-white/50 overflow-hidden">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-sunny-yellow to-vibrant-orange"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl p-3 mr-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-fredoka font-bold text-charcoal">Order Summary</h2>
                </div>
              
                <div className="space-y-4 mb-8">
                  <motion.div 
                    className="flex justify-between items-center p-3 rounded-xl hover:bg-soft-gray transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-charcoal font-fredoka font-medium">Subtotal</span>
                    <motion.span 
                      className="font-fredoka font-bold text-lg"
                      key={totalPrice}
                      animate={{ scale: [1, 1.1, 1] }}
                    >
                      {formatters.currency(totalPrice)}
                    </motion.span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex justify-between items-center p-3 rounded-xl hover:bg-soft-gray transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-charcoal font-fredoka font-medium flex items-center">
                      <Truck className="w-4 h-4 mr-2" />
                      Shipping
                    </span>
                    <span className="font-fredoka font-bold">
                      {getShippingCost() === 0 ? (
                        <motion.span 
                          className="text-mint-green flex items-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          FREE
                        </motion.span>
                      ) : (
                        formatters.currency(getShippingCost())
                      )}
                    </span>
                  </motion.div>
                  
                  {totalPrice < 20000 && (
                    <motion.div 
                      className="bg-gradient-to-r from-amber-50 to-orange-50 border border-sunny-yellow rounded-2xl p-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-start">
                        <Zap className="w-5 h-5 text-vibrant-orange mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-fredoka font-bold text-vibrant-orange">
                            You're {formatters.currency(20000 - totalPrice)} away from FREE shipping!
                          </p>
                          <div className="mt-2 bg-light-gray rounded-full h-2 overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-sunny-yellow to-vibrant-orange"
                              initial={{ width: 0 }}
                              animate={{ width: `${(totalPrice / 20000) * 100}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="border-t-2 border-soft-gray pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-fredoka font-bold text-charcoal">Total</span>
                      <motion.span 
                        className="text-3xl font-fredoka font-bold bg-gradient-to-r from-vibrant-orange to-vibrant-orange bg-clip-text text-transparent"
                        key={getFinalTotal()}
                        animate={{ scale: [1, 1.05, 1] }}
                      >
                        {formatters.currency(getFinalTotal())}
                      </motion.span>
                    </div>
                  </div>
                </div>
              
                <motion.button 
                  onClick={handleCheckout}
                  className="relative w-full group overflow-hidden mb-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-vibrant-orange via-vibrant-orange to-pink-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-sunny-yellow to-vibrant-orange text-white font-fredoka font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 shadow-xl">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-lg">Proceed to Checkout</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </div>
                </motion.button>
                
                <motion.button 
                  onClick={handleContinueShopping}
                  className="w-full bg-white border-2 border-light-gray hover:border-sunny-yellow hover:bg-amber-50 text-charcoal font-fredoka font-medium py-4 rounded-2xl transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue Shopping
                </motion.button>
                
                {/* Security Features */}
                <div className="mt-8 space-y-3">
                  <div className="flex items-center justify-center space-x-6 text-sm text-charcoal">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-1 text-mint-green" />
                      Secure
                    </div>
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 mr-1 text-primary-blue" />
                      Encrypted
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1 text-purple-500" />
                      Verified
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Card */}
            <AnimatePresence>
              {showPromo && (
                <motion.div 
                  className="mt-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl shadow-2xl p-6 text-white"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <button
                    className="absolute top-2 right-2 text-white/80 hover:text-white"
                    onClick={() => setShowPromo(false)}
                  >
                    ×
                  </button>
                  <div className="flex items-center mb-3">
                    <Gift className="w-8 h-8 mr-3" />
                    <h3 className="text-xl font-fredoka font-bold">Special Offer!</h3>
                  </div>
                  <p className="text-white/90 mb-4">Get 10% off your next order with code PAWSOME10</p>
                  <motion.button 
                    className="bg-white text-purple-600 font-fredoka font-bold py-2 px-6 rounded-full text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Copy Code
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Add custom styles for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}} />
    </div>
  );
};

export default Cart;