import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, easeInOut } from 'framer-motion';
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
import { normalizeCartItem } from '../../../utils/cartNormalizer';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPromo(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const getShippingCost = (): number => {
    return totalPrice >= 2000 ? 0 : 150;
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
    { icon: Truck, text: 'Free Shipping on ₹2000+', color: 'bg-primary-blue' },
    { icon: Shield, text: 'Secure Checkout', color: 'bg-mint-green' },
    { icon: Clock, text: '24/7 Support', color: 'bg-lavender' },
    { icon: Gift, text: 'Gift Wrapping Available', color: 'bg-coral-red' }
  ];

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: easeInOut
    }
  };
  const normalizedCart = cart.map(normalizeCartItem);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-soft-gray">
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-fredoka font-bold text-charcoal mb-4">My Cart</h1>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <motion.div
              animate={floatingAnimation}
              className="inline-block mb-6"
            >
              <div className="bg-sunny-yellow rounded-full p-8">
                <ShoppingBag className="h-24 w-24 text-white" />
              </div>
            </motion.div>
            <h2 className="text-3xl font-fredoka font-bold text-charcoal mb-4">Your cart is empty</h2>
            <p className="text-medium-gray mb-8 text-lg">Let's fill it with amazing products for your furry friends!</p>
            <motion.button 
              onClick={handleContinueShopping}
              className="bg-vibrant-orange hover:bg-vibrant-orange/90 text-white font-fredoka font-bold px-10 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl"
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
    <div className="min-h-screen bg-off-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-5xl font-fredoka font-bold text-charcoal mb-2">My Cart</h1>
              <p className="text-xl text-medium-gray flex items-center">
                <Package className="w-5 h-5 mr-2 text-sunny-yellow" />
                {formatters.pluralize(totalItems, 'item')} ready for checkout
              </p>
            </div>
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
              className="bg-white rounded-2xl p-4 shadow-lg"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`${benefit.color} w-12 h-12 rounded-xl flex items-center justify-center mb-2`}>
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
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="p-8 bg-soft-gray flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-vibrant-orange rounded-2xl p-3 mr-4">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-fredoka font-bold text-charcoal">Shopping Cart</h2>
                    <p className="text-sm text-medium-gray">{totalItems} items selected</p>
                  </div>
                </div>
                <motion.button
                  onClick={clearCart}
                  className="text-sm text-coral-red hover:text-coral-red/80 font-fredoka font-medium transition-colors flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear All
                </motion.button>
              </div>
              
              <div className="divide-y divide-light-gray">
                <AnimatePresence>
                  {normalizedCart.map((item, index) => (
                    <motion.div 
                      key={item.id} 
                      className="p-6 hover:bg-soft-gray/30 transition-colors"
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
                                <Heart className="w-4 h-4 text-coral-red" />
                              </motion.span>
                            )}
                          </h3>
                          <p className="text-sm text-medium-gray flex items-center mt-1">
                            <Star className="w-3 h-3 text-sunny-yellow mr-1 fill-current" />
                            {/* {item.product?.brand} */}
                          </p>
                          <motion.p 
                            className="text-xl font-fredoka font-bold text-mint-green mt-2"
                            animate={{ scale: hoveredItem === item.id ? 1.05 : 1 }}
                          >
                            {formatters.currency(item.product.price)}
                          </motion.p>
                        </div>
                        
                        <div className="flex items-center bg-soft-gray rounded-full p-1">
                          <motion.button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-white hover:bg-light-gray p-2 rounded-full transition-all shadow-sm hover:shadow-md"
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
                            className="bg-white hover:bg-light-gray p-2 rounded-full transition-all shadow-sm hover:shadow-md"
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
                            className="text-coral-red hover:text-coral-red/80 mt-2 transition-colors inline-flex items-center"
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
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-6">
              <div className="flex items-center mb-8">
                <div className="bg-lavender rounded-2xl p-3 mr-3">
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
                    <Truck className="w-4 h-4 mr-2 text-primary-blue" />
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
                
                {totalPrice < 2000 && (
                  <motion.div 
                    className="bg-sunny-yellow/20 border border-sunny-yellow rounded-2xl p-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-start">
                      <Zap className="w-5 h-5 text-vibrant-orange mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-fredoka font-bold text-charcoal">
                          You're {formatters.currency(2000 - totalPrice)} away from FREE shipping!
                        </p>
                        <div className="mt-2 bg-light-gray rounded-full h-2 overflow-hidden">
                          <motion.div 
                            className="h-full bg-vibrant-orange"
                            initial={{ width: 0 }}
                            animate={{ width: `${(totalPrice / 2000) * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div className="border-t-2 border-light-gray pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-fredoka font-bold text-charcoal">Total</span>
                    <motion.span 
                      className="text-3xl font-fredoka font-bold text-charcoal"
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
                className="w-full bg-vibrant-orange hover:bg-vibrant-orange/90 text-white font-fredoka font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl transition-all mb-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-lg">Proceed to Checkout</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </motion.button>
              
              <motion.button 
                onClick={handleContinueShopping}
                className="w-full bg-white border-2 border-light-gray hover:border-sunny-yellow hover:bg-sunny-yellow/10 text-charcoal font-fredoka font-medium py-4 rounded-2xl transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue Shopping
              </motion.button>
              
              {/* Security Features */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center justify-center space-x-6 text-sm text-medium-gray">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1 text-mint-green" />
                    Secure
                  </div>
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-1 text-primary-blue" />
                    Encrypted
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-lavender" />
                    Verified
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Card */}
            <AnimatePresence>
              {showPromo && (
                <motion.div 
                  className="mt-6 bg-lavender rounded-3xl shadow-xl p-6 text-white"
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
                    className="bg-white text-lavender font-fredoka font-bold py-2 px-6 rounded-full text-sm"
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
    </div>
  );
};

export default Cart;