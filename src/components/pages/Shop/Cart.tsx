import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Package,
  Zap,
  CheckCircle,
  Lock,
  Weight,
  Ruler,
  RefreshCw,
  Tag
} from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../hooks/useAuth';
import { formatters } from '../../../utils/formatters';
import { normalizeCartItem } from '../../../utils/cartNormalizer';
import { groupCartItems } from '../../../utils/cartGrouping';
import ShippingTierIndicator from '../../common/ShippingTierIndicator';
import GiftBoxCartGroup from '../../cart/GiftBoxCartGroup';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, removeItem, updateQuantity, totalItems, totalPrice, totalWeight, weightUnit, shippingCost, shippingBreakdown, clearCart, refreshCart } = useCart();
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showPromo, setShowPromo] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debug: Log cart data
  React.useEffect(() => {
    console.log('[Cart] Current cart:', cart);
    console.log('[Cart] Is authenticated:', isAuthenticated);
    console.log('[Cart] Cart items with weight:', cart.map(item => ({
      id: item.id,
      name: item.product.name,
      weight: item.product.weight,
      dimensions: item.product.dimensions
    })));
  }, [cart, isAuthenticated]);

  const handleRefreshCart = async () => {
    if (isAuthenticated && refreshCart) {
      setIsRefreshing(true);
      try {
        await refreshCart();
        console.log('[Cart] Cart refreshed from backend');
      } catch (error) {
        console.error('[Cart] Failed to refresh cart:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowPromo(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const getShippingCost = (): number => {
    // Backend is authoritative — always display what it returns
    return shippingCost;
  };

  const getTotalDiscount = (): number => {
    return normalizedCart.reduce((total, item) => {
      const originalPrice = (item.product as any).originalPrice || item.product.price;
      const discount = (originalPrice - item.product.price) * item.quantity;
      return total + discount;
    }, 0);
  };

  const getFinalTotal = (): number => {
    return totalPrice + getShippingCost();
  };

  const formatDimensions = (dimensions?: { length: number; width: number; height: number }): string => {
    if (!dimensions) return '';
    return `${dimensions.length} × ${dimensions.width} × ${dimensions.height} cm`;
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
    { icon: Truck, text: 'Free Shipping on Rs. 2,000+', color: 'bg-primary-blue' },
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

  // Debug: Log cart items to check metadata
  React.useEffect(() => {
    console.log('[Cart Debug] Normalized cart items:', normalizedCart);
    console.log('[Cart Debug] Cart items with metadata:', normalizedCart.map(item => ({
      id: item.id,
      name: item.product?.name,
      metadata: item.metadata,
      has_metadata: !!item.metadata,
      gift_box_group: item.metadata?.gift_box_group,
      is_gift_item: item.metadata?.is_gift_item
    })));
  }, [normalizedCart]);

  const { giftBoxes, regularItems } = groupCartItems(normalizedCart);

  // Debug: Log grouped results
  React.useEffect(() => {
    console.log('[Cart Debug] Gift boxes:', giftBoxes);
    console.log('[Cart Debug] Regular items:', regularItems);
    console.log('[Cart Debug] Number of gift box groups:', Object.keys(giftBoxes).length);
  }, [giftBoxes, regularItems]);

  // Function to remove entire gift box group
  const handleRemoveGiftBox = async (groupId: string) => {
    const itemsToRemove = giftBoxes[groupId]?.items || [];
    for (const item of itemsToRemove) {
      await removeItem(item.id);
    }
  };

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
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
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

          {/* Total Weight Card */}
          {shippingBreakdown?.weight && (
            <motion.div
              className="bg-white rounded-2xl p-4 shadow-lg border-2 border-primary-blue"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-primary-blue w-12 h-12 rounded-xl flex items-center justify-center mb-2">
                <Weight className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-fredoka font-medium text-charcoal mb-1">Total Weight</p>
              <p className="text-lg font-fredoka font-bold text-primary-blue">
                {parseFloat(shippingBreakdown.weight).toFixed(2)} {shippingBreakdown.weight_unit ?? weightUnit}
              </p>
            </motion.div>
          )}
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
                <div className="flex items-center gap-3">
                  {isAuthenticated && (
                    <motion.button
                      onClick={handleRefreshCart}
                      disabled={isRefreshing}
                      className="text-sm text-primary-blue hover:text-primary-blue/80 font-fredoka font-medium transition-colors flex items-center disabled:opacity-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                      {isRefreshing ? 'Refreshing...' : 'Refresh'}
                    </motion.button>
                  )}
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
              </div>
              
              <div className="divide-y divide-light-gray">
                <AnimatePresence>
                  {/* Gift Box Groups */}
                  {Object.values(giftBoxes).map((giftBox) => (
                    <div key={giftBox.groupId} className="p-6">
                      <GiftBoxCartGroup
                        groupId={giftBox.groupId}
                        items={giftBox.items}
                        recipientName={giftBox.recipientName}
                        giftMessage={giftBox.giftMessage}
                        onRemoveGroup={() => handleRemoveGiftBox(giftBox.groupId)}
                      />
                    </div>
                  ))}

                  {/* Regular Cart Items */}
                  {regularItems.map((item, index) => (
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
                      {/* ── Deal item card ── */}
                      {(item as any).is_deal_item ? (
                        <div className="flex items-center space-x-4">
                          <div className="w-24 h-24 bg-vibrant-orange/10 border-2 border-vibrant-orange/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Tag className="w-10 h-10 text-vibrant-orange" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-fredoka font-bold text-charcoal text-lg">
                                {(item as any).deal?.title ?? item.product.name}
                              </h3>
                              {(item as any).deal?.badge_text && (
                                <span className="bg-vibrant-orange text-white text-xs font-fredoka font-bold px-2 py-0.5 rounded-full">
                                  {(item as any).deal.badge_text}
                                </span>
                              )}
                            </div>

                            {(item as any).deal && (
                              <p className="text-sm text-medium-gray font-fredoka mt-1">
                                {(item as any).deal.discount_type === 'percentage'
                                  ? `${(item as any).deal.discount_value}% off qualifying products`
                                  : `Rs. ${(item as any).deal.discount_value} off qualifying products`}
                              </p>
                            )}
                            {(item as any).deal?.minimum_purchase_amount && (
                              <p className="text-xs text-medium-gray mt-0.5">
                                Min. purchase: {formatters.currency((item as any).deal.minimum_purchase_amount)}
                              </p>
                            )}
                            <p className="text-xs text-primary-blue font-fredoka mt-1">
                              Discount applied at checkout
                            </p>
                          </div>

                          {/* Remove only — no quantity controls, no price */}
                          <motion.button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-coral-red hover:text-coral-red/80 transition-colors"
                            title="Remove deal"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="h-5 w-5" />
                          </motion.button>
                        </div>
                      ) : (
                      /* ── Regular product card ── */
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

                          {/* Weight and Dimensions */}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.product.weight && (
                              <motion.div
                                className="flex items-center bg-primary-blue/10 border border-primary-blue/30 rounded-lg px-3 py-1.5"
                                whileHover={{ scale: 1.05 }}
                              >
                                <Weight className="w-4 h-4 mr-1.5 text-primary-blue" />
                                <div className="flex flex-col">
                                  <span className="text-xs font-fredoka font-semibold text-charcoal">
                                    Weight: {item.product.weight} kg
                                  </span>
                                  {item.quantity > 1 && (
                                    <span className="text-xs text-medium-gray font-fredoka">
                                      Total: {(parseFloat(item.product.weight) * item.quantity).toFixed(2)} kg
                                    </span>
                                  )}
                                </div>
                              </motion.div>
                            )}
                            {item.product.dimensions && (
                              <motion.div
                                className="flex items-center bg-lavender/10 border border-lavender/30 rounded-lg px-3 py-1.5"
                                whileHover={{ scale: 1.05 }}
                              >
                                <Ruler className="w-4 h-4 mr-1.5 text-lavender" />
                                <div className="flex flex-col">
                                  <span className="text-xs font-fredoka font-semibold text-charcoal">
                                    Dimensions (L×W×H)
                                  </span>
                                  <span className="text-xs text-medium-gray font-fredoka">
                                    {formatDimensions(item.product.dimensions)}
                                  </span>
                                </div>
                              </motion.div>
                            )}
                          </div>

                          <div className="mt-2">
                            {(item.product as any).originalPrice && (item.product as any).originalPrice > item.product.price ? (
                              <>
                                <div className="flex items-center gap-2">
                                  <motion.p
                                    className="text-xl font-fredoka font-bold text-vibrant-orange"
                                    animate={{ scale: hoveredItem === item.id ? 1.05 : 1 }}
                                  >
                                    {formatters.currency(item.product.price)}
                                  </motion.p>
                                  <span className="text-sm line-through text-gray-400 font-fredoka">
                                    {formatters.currency((item.product as any).originalPrice)}
                                  </span>
                                </div>
                                <span className="text-xs text-mint-green font-fredoka font-bold">
                                  Save {formatters.currency(((item.product as any).originalPrice - item.product.price) * item.quantity)}
                                </span>
                              </>
                            ) : (
                              <motion.p
                                className="text-xl font-fredoka font-bold text-mint-green"
                                animate={{ scale: hoveredItem === item.id ? 1.05 : 1 }}
                              >
                                {formatters.currency(item.product.price)}
                              </motion.p>
                            )}
                          </div>
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
                      )}
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
            {/* Shipping Tier Indicator */}
            {cart.length > 0 && (
              <div className="mb-6">
                <ShippingTierIndicator
                  currentWeight={parseFloat(shippingBreakdown?.weight ?? '0') || totalWeight}
                  shippingCost={getShippingCost()}
                  weightUnit={shippingBreakdown?.weight_unit ?? weightUnit}
                />
              </div>
            )}

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

                {/* Total Discount */}
                {getTotalDiscount() > 0 && (
                  <motion.div
                    className="flex justify-between items-center p-3 rounded-xl bg-mint-green/10 border border-mint-green/30"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-charcoal font-fredoka font-medium flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-mint-green" />
                      Deal Discount
                    </span>
                    <motion.span
                      className="font-fredoka font-bold text-lg text-mint-green"
                      key={getTotalDiscount()}
                      animate={{ scale: [1, 1.1, 1] }}
                    >
                      -{formatters.currency(getTotalDiscount())}
                    </motion.span>
                  </motion.div>
                )}

                {/* Total Weight */}
                {shippingBreakdown?.weight && (
                  <motion.div
                    className="flex justify-between items-center p-3 rounded-xl bg-soft-gray/50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span className="text-charcoal font-fredoka font-medium flex items-center">
                      <Weight className="w-4 h-4 mr-2 text-primary-blue" />
                      Total Weight
                    </span>
                    <span className="font-fredoka font-bold text-primary-blue">
                      {parseFloat(shippingBreakdown.weight).toFixed(2)} {shippingBreakdown.weight_unit ?? weightUnit}
                    </span>
                  </motion.div>
                )}
                
                <motion.div
                  className="flex justify-between items-center p-3 rounded-xl hover:bg-soft-gray transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <span className="text-charcoal font-fredoka font-medium flex items-center">
                    <Truck className="w-4 h-4 mr-2 text-primary-blue" />
                    Shipping
                    {shippingBreakdown && (
                      <span className="ml-2 text-xs text-medium-gray">
                        ({shippingBreakdown.description})
                      </span>
                    )}
                  </span>
                  <span className="font-fredoka font-bold text-vibrant-orange">
                    {formatters.currency(getShippingCost())}
                  </span>
                </motion.div>

                {/* Shipping Info Banner */}
                {shippingBreakdown && (
                  <motion.div
                    className="bg-primary-blue/10 border border-primary-blue/30 rounded-2xl p-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-start">
                      <Truck className="w-5 h-5 text-primary-blue mr-2 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-fredoka font-bold text-charcoal mb-2">
                          Weight-Based Shipping
                        </p>
                        <div className="space-y-1 text-xs text-medium-gray">
                          {shippingBreakdown.pricing_tiers.map((tier, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span>{tier.range}:</span>
                              <span className={`font-fredoka font-medium ${
                                shippingBreakdown.description === tier.range
                                  ? 'text-primary-blue font-bold'
                                  : ''
                              }`}>
                                Rs. {tier.cost}
                                {shippingBreakdown.description === tier.range && ' ✓'}
                              </span>
                            </div>
                          ))}
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