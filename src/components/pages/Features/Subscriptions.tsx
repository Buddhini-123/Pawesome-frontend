// src/pages/Subscriptions.tsx
import React, { useState, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingCart,
  Award,
  HeadphonesIcon,
  ChevronDown,
  ChevronUp,
  Package,
  X,
  Plus,
  Minus,
  Calendar,
  Calendar as CalendarIcon,
  Percent as PercentIcon,
  Eye,
  Check,
  TruckIcon,
  ShieldCheck,
  Heart,
  Settings,
  MoreHorizontal,
  TrendingUp,
  Trophy,
  ShoppingBag,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SlideshowBanner from '../../banners/subscriptionbanner/SlideshowBanner'
import WhyPawsomeSection from '../../banners/whypawsome/WhyPawsomeSection'
import CategoryCarousel from '../../carousels/CategoryCarousel'
import dogImg from '../../carousels/images/dog.png'
import catImg from '../../carousels/images/cat.png'
import birdImg from '../../carousels/images/bird.png'
import rodentImg from '../../carousels/images/rodent.png'
import TopBrandsCarousel from '../../carousels/brandCarousel/TopBrandsCarousel'
import FAQAccordion from '../../FAQ/FaqAccordions/FAQAccordion'
import { dogProducts, catProducts, birdProducts, otherAnimalsProducts, Product } from '../../../data/mockProducts'
import ActiveSubscriptionsSidebar from '../../subscriptions/ActiveSubscriptionsSidebar'
import {api} from "../../../services/api"

interface SubscriptionItem {
  name: string;
  quantity: number;
  price: number;
}

interface Subscription {
  id: number;
  name: string;
  products: number;
  frequency: string;
  nextDelivery: string;
  total: number;
  startDate: string;
  status: string;
  items: SubscriptionItem[];
  deliveryAddress: string;
  savedAmount: number;
}

interface Category {
  id: number
  name: string
  slug: string
}

interface Product {
  id: number
  name: string
  slug: string
  price: string
  stock_quantity: number
  category: Category
  primary_image: string | null
}

const Subscriptions = () => {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [confirmedProducts, setConfirmedProducts] = useState<Product[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [deliveryFrequency, setDeliveryFrequency] = useState('monthly')
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({})
  const [showSidebar, setShowSidebar] = useState(true)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showProductModal, setShowProductModal] = useState(false)

  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);

  const fetchSubscriptions = async () => {
    try {

      const response = await api.get("/cart/subscription-preview");

      const data = response.data?.data;
      if (data) {
        const mappedSubscriptions = data.items.map((item: any) => ({
          id: item.cart_item_id,
          name: item.product_name,
          products: 1,
          frequency: "Monthly",
          nextDelivery: new Date().toISOString(),
          total: item.subscription_total,
          startDate: new Date().toISOString(),
          status: "Active",
          deliveryAddress: "Default Address",
          savedAmount: data.totals.total_savings,
          items: [
            {
              name: item.product_name,
              quantity: item.quantity,
              price: item.subscription_price,
            },
          ],
        }));
        setActiveSubscriptions(mappedSubscriptions);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn("User is unauthenticated. Redirecting to login...");
      } else {
        console.error("Error fetching subscriptions:", error);
      }
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    api.get("/categories").then(res => {
      setCategories(res.data.data)
    })
    api.get("/products").then(res => {
      setProducts(res.data.data)
    })
  }, [])


  const handleProductToggle = (product: Product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id)
      if (isSelected) {
        // Remove product and its quantity
        const newQuantities = { ...productQuantities }
        delete newQuantities[product.id]
        setProductQuantities(newQuantities)
        return prev.filter(p => p.id !== product.id)
      } else {
        // Add product with default quantity of 1
        setProductQuantities(prev => ({ ...prev, [product.id]: 1 }))
        return [...prev, product]
      }
    })
  }

  const handleQuantityChange = (productId: string, change: number) => {
    setProductQuantities(prev => {
      const currentQty = prev[productId] || 1
      const newQty = Math.max(1, currentQty + change)
      return { ...prev, [productId]: newQty }
    })
  }

  const handleConfirmSelection = () => {
    setConfirmedProducts(selectedProducts)
    setIsModalOpen(false)
  }

  const handleOpenModal = () => {
    setSelectedProducts(confirmedProducts)
    setIsModalOpen(true)
  }

  const handleSubscriptionClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setShowSubscriptionModal(true)
  }

  const handleManageSubscription = (e: React.MouseEvent, subscription: Subscription) => {
    e.stopPropagation() // Prevent card click
    setSelectedSubscription(subscription)
    setShowSubscriptionModal(true)
  }

  const handleRemoveProduct = (productId: string) => {
    setConfirmedProducts(prev => prev.filter(p => p.id !== productId))
    const newQuantities = { ...productQuantities }
    delete newQuantities[productId]
    setProductQuantities(newQuantities)
  }

  const handleViewProductDetails = (product: Product) => {
    setSelectedProduct(product)
    setShowProductModal(true)
  }

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(p => p.category?.slug === selectedCategory)

  return (
    <div className="min-h-screen bg-soft-gray">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <Package className="text-vibrant-orange mr-3 h-12 w-12" />
            <h1 className="text-4xl md:text-5xl font-fredoka font-bold text-calm-blue">
              Pawsome Subscriptions
            </h1>
          </div>
          <p className="text-xl text-calm-blue max-w-3xl mx-auto">
            Never run out of your pet's essentials with our convenient subscription service
          </p>
        </div>

        {/* How to Subscribe Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Section Header */}
            <div className="bg-warm-orange p-8 text-center">
              <h2 className="text-4xl font-fredoka font-bold text-charcoal mb-2">
                How to Start Your Subscription
              </h2>
              <p className="text-charcoal/90 text-lg">
                Four simple steps to never run out of pet essentials
              </p>
            </div>
            
            {/* Steps Grid */}
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Step 1 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-vibrant-orange"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-vibrant-orange rounded-full flex items-center justify-center text-white font-fredoka font-bold text-xl shadow-lg">
                    1
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center mb-3">
                      <ShoppingCart className="h-6 w-6 text-vibrant-orange mr-2" />
                      <h3 className="font-fredoka font-bold text-xl text-charcoal">
                        Choose Your Products
                      </h3>
                    </div>
                    <p className="text-medium-gray leading-relaxed">
                      Browse our extensive catalog of premium pet products. Select food, treats, toys, and grooming essentials your pet loves.
                    </p>
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary-blue"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center text-white font-fredoka font-bold text-xl shadow-lg">
                    2
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center mb-3">
                      <Calendar className="h-6 w-6 text-primary-blue mr-2" />
                      <h3 className="font-fredoka font-bold text-xl text-charcoal">
                        Set Your Schedule
                      </h3>
                    </div>
                    <p className="text-medium-gray leading-relaxed">
                      Choose delivery frequency - daily, weekly, or monthly. Set start and end dates that work for your lifestyle.
                    </p>
                  </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-mint-green"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-mint-green rounded-full flex items-center justify-center text-white font-fredoka font-bold text-xl shadow-lg">
                    3
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center mb-3">
                      <Award className="h-6 w-6 text-mint-green mr-2" />
                      <h3 className="font-fredoka font-bold text-xl text-charcoal">
                        Unlock Benefits
                      </h3>
                    </div>
                    <p className="text-medium-gray leading-relaxed">
                      Enjoy 10% off every order, free shipping on orders over ₹2,000, and exclusive member perks.
                    </p>
                  </div>
                </motion.div>

                {/* Step 4 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-sunny-yellow"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-sunny-yellow rounded-full flex items-center justify-center text-white font-fredoka font-bold text-xl shadow-lg">
                    4
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center mb-3">
                      <Package className="h-6 w-6 text-sunny-yellow mr-2" />
                      <h3 className="font-fredoka font-bold text-xl text-charcoal">
                        Sit Back & Relax
                      </h3>
                    </div>
                    <p className="text-medium-gray leading-relaxed">
                      We'll handle the rest! Track deliveries, manage subscriptions, and earn rewards automatically.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Benefits Cards */}
              <div className="bg-yellow-50 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-fredoka font-bold text-center text-charcoal mb-8">
                  Subscription Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="bg-sunny-yellow rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <PercentIcon className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="font-fredoka font-bold text-lg text-charcoal mb-2">Save 10%</h4>
                    <p className="text-medium-gray">On every subscription order</p>
                    <p className="text-2xl font-fredoka font-bold text-vibrant-orange mt-2">₹250+</p>
                    <p className="text-xs text-medium-gray">Average monthly savings</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="bg-primary-blue rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Package className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="font-fredoka font-bold text-lg text-charcoal mb-2">Free Shipping</h4>
                    <p className="text-medium-gray">On orders above ₹2,000</p>
                    <p className="text-2xl font-fredoka font-bold text-primary-blue mt-2">Always</p>
                    <p className="text-xs text-medium-gray">No delivery charges</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="bg-mint-green rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <HeadphonesIcon className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="font-fredoka font-bold text-lg text-charcoal mb-2">Priority Support</h4>
                    <p className="text-medium-gray">24/7 dedicated assistance</p>
                    <p className="text-2xl font-fredoka font-bold text-mint-green mt-2">24/7</p>
                    <p className="text-xs text-medium-gray">Always here to help</p>
                  </motion.div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="text-center">
                <motion.button
                  onClick={handleOpenModal}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-warm-orange hover:bg-sunny-yellow text-white font-fredoka font-bold text-xl px-16 py-5 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  Browse Products & Start Subscription
                </motion.button>
                <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-medium-gray">
                  <div className="flex items-center">
                    <Plus className="h-4 w-4 rotate-45 text-green-500 mr-1" />
                    <span>No commitment</span>
                  </div>
                  <div className="flex items-center">
                    <Plus className="h-4 w-4 rotate-45 text-green-500 mr-1" />
                    <span>Cancel anytime</span>
                  </div>
                  <div className="flex items-center">
                    <Plus className="h-4 w-4 rotate-45 text-green-500 mr-1" />
                    <span>Modify as needed</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Selected Products Section - Enhanced Design */}
        {confirmedProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto mt-16"
          >
            {/* Main Container with Gradient Border */}
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Decorative Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-vibrant-orange rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-blue rounded-full blur-3xl" />
              </div>

              {/* Header Section */}
              <div className="relative bg-vibrant-orange p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-fredoka font-bold text-white mb-2 flex items-center">
                      <Package className="mr-3 h-8 w-8" />
                      Your Subscription Plan
                    </h2>
                    <p className="text-white/90">Customize your delivery preferences and manage products</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-sm">Total Products</p>
                    <p className="text-3xl font-fredoka font-bold text-white">{confirmedProducts.length}</p>
                  </div>
                </div>
              </div>

              <div className="relative p-8">
                {/* Subscription Settings Section */}
                <motion.div 
                  className="mb-10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-fredoka font-bold text-charcoal mb-6 flex items-center">
                    <Calendar className="mr-2 h-6 w-6 text-vibrant-orange" />
                    Delivery Preferences
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Start Date Card */}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-vibrant-orange transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-fredoka font-semibold text-charcoal">Start Date</label>
                        <Calendar className="h-5 w-5 text-vibrant-orange" />
                      </div>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-vibrant-orange focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-medium-gray mt-2">When should we start delivering?</p>
                    </motion.div>
                    
                    {/* End Date Card */}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-primary-blue transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-fredoka font-semibold text-charcoal">End Date</label>
                        <Calendar className="h-5 w-5 text-primary-blue" />
                      </div>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-medium-gray mt-2">Optional end date for subscription</p>
                    </motion.div>
                    
                    {/* Frequency Card */}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-mint-green transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-fredoka font-semibold text-charcoal">Frequency</label>
                        <Package className="h-5 w-5 text-mint-green" />
                      </div>
                      <select
                        value={deliveryFrequency}
                        onChange={(e) => setDeliveryFrequency(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-mint-green focus:border-transparent transition-all appearance-none bg-white"
                      >
                        <option value="daily">Daily Delivery</option>
                        <option value="weekly">Weekly Delivery</option>
                        <option value="monthly">Monthly Delivery</option>
                      </select>
                      <p className="text-xs text-medium-gray mt-2">How often should we deliver?</p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Selected Products Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xl font-fredoka font-bold text-charcoal mb-6 flex items-center">
                    <ShoppingCart className="mr-2 h-6 w-6 text-vibrant-orange" />
                    Selected Products
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
                    {confirmedProducts.map((product, index) => (
                      <motion.div 
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent hover:border-vibrant-orange transition-all"
                      >
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-vibrant-orange text-white text-xs px-2 py-1 rounded-full">
                            Save 10%
                          </div>
                          {/* Remove Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveProduct(product.id);
                            }}
                            className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all transform hover:scale-110"
                            title="Remove product"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="p-4">
                          <h4 className="font-fredoka font-bold text-charcoal mb-1 line-clamp-2">
                            {product.name}
                          </h4>
                          <p className="text-sm text-medium-gray mb-3">{product.brand}</p>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="text-lg font-fredoka font-bold text-vibrant-orange">
                                ₹{Math.floor(product.price * 0.9)}
                              </span>
                              <span className="text-sm text-light-gray line-through ml-2">
                                ₹{product.price}
                              </span>
                            </div>
                            <div className="text-xs text-green-600 font-fredoka font-medium">
                              -10%
                            </div>
                          </div>
                          
                          {/* Enhanced Quantity Selector */}
                          <div className="bg-soft-gray rounded-xl p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-fredoka font-medium text-charcoal">Quantity</span>
                              <div className="flex items-center gap-3 bg-white rounded-lg px-3 py-1 shadow-sm">
                                <button
                                  onClick={() => handleQuantityChange(product.id, -1)}
                                  className="w-8 h-8 rounded-full bg-light-gray hover:bg-vibrant-orange hover:text-white flex items-center justify-center transition-all"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="text-base font-fredoka font-bold w-8 text-center">
                                  {productQuantities[product.id] || 1}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(product.id, 1)}
                                  className="w-8 h-8 rounded-full bg-light-gray hover:bg-vibrant-orange hover:text-white flex items-center justify-center transition-all"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Summary and Actions Section */}
                <motion.div 
                  className="bg-yellow-50 rounded-2xl p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Pricing Summary */}
                    <div>
                      <h4 className="text-lg font-semibold text-charcoal mb-4">Order Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-medium-gray">Products Total</span>
                          <span className="font-medium">
                            ₹{confirmedProducts.reduce((total, product) => {
                              const qty = productQuantities[product.id] || 1
                              return total + (product.price * qty)
                            }, 0)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-green-600">
                          <span>Subscription Discount (10%)</span>
                          <span className="font-medium">
                            -₹{confirmedProducts.reduce((total, product) => {
                              const qty = productQuantities[product.id] || 1
                              return total + Math.floor(product.price * 0.1 * qty)
                            }, 0)}
                          </span>
                        </div>
                        <div className="pt-3 border-t-2 border-yellow-300">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-lg font-semibold text-charcoal">
                                {deliveryFrequency.charAt(0).toUpperCase() + deliveryFrequency.slice(1)} Total
                              </p>
                              <p className="text-sm text-medium-gray">
                                Delivered {deliveryFrequency === 'daily' ? 'every day' : deliveryFrequency === 'weekly' ? 'every week' : 'every month'}
                              </p>
                            </div>
                            <p className="text-3xl font-bold text-vibrant-orange">
                              ₹{confirmedProducts.reduce((total, product) => {
                                const qty = productQuantities[product.id] || 1
                                return total + Math.floor(product.price * 0.9 * qty)
                              }, 0)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                      <button 
                        disabled={!startDate || !endDate}
                        className={`w-full font-bold text-lg py-4 rounded-2xl transition-all duration-300 shadow-lg ${
                          startDate && endDate
                            ? 'bg-mint-green hover:bg-green-600 text-white transform hover:scale-105'
                            : 'bg-light-gray text-medium-gray cursor-not-allowed'
                        }`}
                      >
                        {startDate && endDate 
                          ? 'Proceed to Checkout' 
                          : 'Please select subscription dates'
                        }
                      </button>
                      
                      <button
                        onClick={handleOpenModal}
                        className="w-full bg-white hover:bg-soft-gray text-primary-blue font-medium py-3 rounded-2xl border-2 border-primary-blue transition-all"
                      >
                        Modify Product Selection
                      </button>
                      
                      <p className="text-center text-sm text-medium-gray">
                        <Plus className="inline h-4 w-4 rotate-45 text-green-500 mr-1" />
                        Free cancellation • Flexible scheduling • No hidden fees
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Product Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="bg-vibrant-orange text-white p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Select Products for Your Subscription</h2>
                  <p className="text-white/90 mt-1">Choose from our complete catalog of pet products</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Category Tabs */}
              <div className="bg-soft-gray px-6 py-4 border-b border-light-gray">
                <div className="flex space-x-4 overflow-x-auto">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                      selectedCategory === 'all'
                        ? 'bg-warm-orange text-white'
                        : 'bg-white text-medium-gray hover:bg-light-gray'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap
                      ${selectedCategory === cat.slug
                        ? 'bg-warm-orange text-white'
                        : 'bg-white text-medium-gray hover:bg-light-gray' }
                    }`}
                      onClick={() => setSelectedCategory(cat.slug)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isSelected={selectedProducts.some(p => p.id === product.id)}
                      onToggle={handleProductToggle}
                      onViewDetails={handleViewProductDetails}
                    />
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-soft-gray px-6 py-4 border-t border-light-gray">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-medium-gray">
                      {selectedProducts.length > 0 
                        ? `${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''} selected`
                        : 'Select products to add to your subscription'
                      }
                    </p>
                    {selectedProducts.length > 0 && (
                      <p className="text-sm text-mint-green font-medium">
                        Monthly Total: ₹{selectedProducts.reduce((total, product) => {
                          const qty = productQuantities[product.id] || 1
                          return total + Math.floor(product.price * 0.9 * qty)
                        }, 0)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="bg-light-gray hover:bg-medium-gray text-gray-700 font-medium px-6 py-2 rounded-full transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmSelection}
                      disabled={selectedProducts.length === 0}
                      className={`font-medium px-6 py-2 rounded-full transition-colors ${
                        selectedProducts.length > 0
                          ? 'bg-vibrant-orange hover:bg-sunny-yellow text-white'
                          : 'bg-light-gray text-medium-gray cursor-not-allowed'
                      }`}
                    >
                      Confirm Selection
                    </button>
                  </div>
                </div>
              </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Subscription Details Modal */}
      <AnimatePresence>
        {showSubscriptionModal && selectedSubscription && (
          <>
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowSubscriptionModal(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="bg-primary-blue text-white p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedSubscription.name}</h2>
                      <p className="text-white/90 mt-1">Subscription ID: #{selectedSubscription.id}</p>
                    </div>
                    <button
                      onClick={() => setShowSubscriptionModal(false)}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                  {/* Subscription Status */}
                  <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-medium-gray">Status</p>
                        <p className="font-semibold text-green-700">{selectedSubscription.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-medium-gray">Since</p>
                        <p className="font-medium">{new Date(selectedSubscription.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg text-charcoal mb-3">Delivery Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-soft-gray p-4 rounded-lg">
                        <p className="text-sm text-medium-gray mb-1">Frequency</p>
                        <p className="font-medium">{selectedSubscription.frequency}</p>
                      </div>
                      <div className="bg-soft-gray p-4 rounded-lg">
                        <p className="text-sm text-medium-gray mb-1">Next Delivery</p>
                        <p className="font-medium text-mint-green">
                          {new Date(selectedSubscription.nextDelivery).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-soft-gray p-4 rounded-lg md:col-span-2">
                        <p className="text-sm text-medium-gray mb-1">Delivery Address</p>
                        <p className="font-medium">{selectedSubscription.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>

                  {/* Products in Subscription */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg text-charcoal mb-3">Products ({selectedSubscription.items.length})</h3>
                    <div className="space-y-3">
                      {selectedSubscription.items.map((item, index) => (
                        <div key={index} className="bg-soft-gray p-4 rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-medium text-charcoal">{item.name}</p>
                            <p className="text-sm text-medium-gray">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-vibrant-orange">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-300">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-medium-gray">Subtotal</span>
                        <span>₹{selectedSubscription.total + selectedSubscription.savedAmount}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Subscription Discount (10%)</span>
                        <span>-₹{selectedSubscription.savedAmount}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-yellow-400">
                        <span className="font-semibold">Total per {selectedSubscription.frequency}</span>
                        <span className="font-bold text-lg text-vibrant-orange">₹{selectedSubscription.total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-soft-gray px-6 py-4 border-t border-light-gray">
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowSubscriptionModal(false)}
                      className="px-6 py-2 bg-light-gray hover:bg-medium-gray text-gray-700 font-fredoka font-medium rounded-full transition-colors"
                    >
                      Close
                    </button>
                    <button className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-fredoka font-medium rounded-full transition-colors">
                      Cancel Subscription
                    </button>
                    <button className="px-6 py-2 bg-primary-blue hover:bg-blue-700 text-white font-fredoka font-medium rounded-full transition-colors">
                      Edit Subscription
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Active Subscriptions Sidebar */}
      <ActiveSubscriptionsSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(!showSidebar)}
        subscriptions={activeSubscriptions}
        onSubscriptionClick={handleSubscriptionClick}
        onManageSubscription={handleManageSubscription}
      />

      {/* Product Details Modal */}
      <AnimatePresence>
        {showProductModal && selectedProduct && (
          <>
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowProductModal(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="relative h-80 bg-primary-blue">
                  <div className="absolute inset-0 bg-black/20" />
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors z-10"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                  <div className="relative h-full flex items-center justify-center">
                    <motion.img
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="max-h-64 max-w-sm object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-320px)]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Product Info */}
                    <div>
                      <div className="mb-6">
                        <h2 className="text-3xl font-fredoka font-bold text-charcoal mb-2">
                          {selectedProduct.name}
                        </h2>
                        <p className="text-lg text-medium-gray flex items-center gap-2">
                          by <span className="font-fredoka font-semibold text-vibrant-orange">{selectedProduct.brand}</span>
                        </p>
                      </div>

                      {/* Rating and Reviews */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(selectedProduct.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'fill-gray-200 text-gray-200'
                              }`}
                            />
                          ))}
                          <span className="ml-2 font-fredoka font-semibold text-charcoal">
                            {selectedProduct.rating}
                          </span>
                        </div>
                        <span className="text-medium-gray">
                          ({selectedProduct.reviews} reviews)
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-fredoka font-medium ${
                          selectedProduct.inStock 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      {/* Description */}
                      <div className="mb-6">
                        <h3 className="font-fredoka font-semibold text-lg text-charcoal mb-2">Description</h3>
                        <p className="text-medium-gray leading-relaxed">
                          {selectedProduct.description || `Premium ${selectedProduct.subcategory} for your beloved pet. This high-quality product from ${selectedProduct.brand} is designed to provide the best care and comfort for your furry friend. Made with carefully selected ingredients and materials to ensure safety and effectiveness.`}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="mb-6">
                        <h3 className="font-fredoka font-semibold text-lg text-charcoal mb-3">Key Features</h3>
                        <div className="space-y-2">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <Check className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="text-medium-gray">High-quality ingredients and materials</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <Check className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="text-medium-gray">Veterinarian recommended</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <Check className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="text-medium-gray">Suitable for all life stages</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <Check className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="text-medium-gray">100% satisfaction guarantee</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Pricing and Actions */}
                    <div>
                      {/* Pricing Card */}
                      <div className="bg-yellow-50 rounded-2xl p-6 mb-6">
                        <h3 className="font-fredoka font-semibold text-lg text-charcoal mb-4">Pricing Options</h3>
                        
                        {/* One-time Purchase */}
                        <div className="mb-4 p-4 bg-white rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-700 font-fredoka font-medium">One-time Purchase</span>
                            {selectedProduct.discount && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {selectedProduct.discount}% OFF
                              </span>
                            )}
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-fredoka font-bold text-charcoal">
                              ₹{selectedProduct.price}
                            </span>
                            {selectedProduct.originalPrice && (
                              <span className="text-lg text-gray-400 line-through">
                                ₹{selectedProduct.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Subscription Option */}
                        <div className="p-4 bg-mint-green/20 rounded-xl border-2 border-mint-green">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-700 font-fredoka font-medium">Subscribe & Save</span>
                            <span className="bg-mint-green text-white text-xs px-2 py-1 rounded-full">
                              Save 10%
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-fredoka font-bold text-mint-green">
                              ₹{Math.floor(selectedProduct.price * 0.9)}
                            </span>
                            <span className="text-sm text-medium-gray">per delivery</span>
                          </div>
                          <p className="text-xs text-medium-gray mt-2">
                            + Free shipping on all subscription orders
                          </p>
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                        <h3 className="font-fredoka font-semibold text-lg text-charcoal mb-3">Why Choose Subscription?</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <PercentIcon className="h-5 w-5 text-vibrant-orange" />
                            <span className="text-gray-700">Save 10% on every order</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <TruckIcon className="h-5 w-5 text-vibrant-orange" />
                            <span className="text-gray-700">Free delivery on all orders</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-vibrant-orange" />
                            <span className="text-gray-700">Flexible delivery schedule</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-vibrant-orange" />
                            <span className="text-gray-700">Cancel or pause anytime</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            handleProductToggle(selectedProduct);
                            setShowProductModal(false);
                          }}
                          className={`w-full py-4 px-6 rounded-2xl font-fredoka font-bold text-lg transition-all transform hover:scale-105 ${
                            selectedProducts.some(p => p.id === selectedProduct.id)
                              ? 'bg-light-gray text-medium-gray'
                              : 'bg-vibrant-orange hover:bg-sunny-yellow text-white shadow-lg'
                          }`}
                          disabled={selectedProducts.some(p => p.id === selectedProduct.id)}
                        >
                          {selectedProducts.some(p => p.id === selectedProduct.id)
                            ? 'Already Added to Subscription'
                            : 'Add to Subscription'
                          }
                        </button>
                        <button
                          onClick={() => setShowProductModal(false)}
                          className="w-full py-3 px-6 bg-white border-2 border-light-gray rounded-2xl font-fredoka font-medium text-charcoal hover:bg-soft-gray transition-colors"
                        >
                          Close
                        </button>
                      </div>

                      {/* Trust Badges */}
                      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-medium-gray">
                        <div className="flex items-center gap-1">
                          <ShieldCheck className="h-4 w-4" />
                          <span>Secure</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>Pet Safe</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          <span>Quality Assured</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Product Card Component for Modal
interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onToggle: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isSelected, onToggle, onViewDetails }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative bg-white rounded-lg border-2 transition-all ${
        isSelected ? 'border-vibrant-orange shadow-lg' : 'border-light-gray hover:border-medium-gray'
      }`}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-vibrant-orange text-white rounded-full p-1 z-10">
          <Plus className="h-4 w-4 rotate-45" />
        </div>
      )}

      {/* Product Image */}
      <div 
        className="aspect-square overflow-hidden rounded-t-lg bg-soft-gray cursor-pointer"
        onClick={() => onToggle(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 
          className="font-fredoka font-semibold text-charcoal text-sm mb-1 line-clamp-2 cursor-pointer hover:text-vibrant-orange transition-colors"
          onClick={() => onToggle(product)}
        >
          {product.name}
        </h3>
        <p className="text-xs text-medium-gray mb-2">{product.brand?.name}</p>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through mr-2">
                ₹{product.originalPrice}
              </span>
            )}
            <span className="font-fredoka font-bold text-vibrant-orange">
              ₹{product.price}
            </span>
          </div>
          
          {/* Rating */}
          <div className="flex items-center">
            <Star className="h-3 w-3 fill-current text-yellow-400" />
            <span className="text-xs text-medium-gray ml-1">{product.rating}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product?.slug);
            }}
            className="flex-1 bg-primary-blue hover:bg-blue-700 text-white text-xs font-fredoka font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <Eye className="h-3 w-3" />
            View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(product);
            }}
            className={`flex-1 text-xs font-fredoka font-medium py-2 px-3 rounded-lg transition-colors ${
              isSelected 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-warm-orange hover:bg-vibrant-yellow text-white'
            }`}
          >
            {isSelected ? 'Remove' : 'Add'}
          </button>
        </div>

        {/* Subscription Price */}
        <div className="mt-3 pt-2 border-t border-light-gray">
          <p className="text-xs text-mint-green font-fredoka font-medium text-center">
            Subscription: ₹{Math.floor(product.price * 0.9)} (Save 10%)
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default Subscriptions