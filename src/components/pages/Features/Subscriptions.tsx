// src/pages/Subscriptions.jsx
import React, { useState } from 'react'
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
  Percent as PercentIcon,
  Eye,
  Check,
  TruckIcon,
  ShieldCheck,
  Heart,
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
import { dogProducts, catProducts, birdProducts, otherAnimalsProducts } from '../../../data/mockProducts.ts'

const Subscriptions = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null)

  const subscriptionSlides = [
    {
      image:
        'https://cdn.create.vista.com/downloads/8182b741-5b10-465f-8a06-5dd2f17e23aa_1024.jpeg',
      title: 'Banner 1',
      subtitle: 'Up to 50% off on all subscriptions',
      cta: 'Subscribe Now',
      onClick: () => console.log('Slide 1 CTA clicked'),
    },
    {
      image: 'https://petpoints.co.uk/assets/purepet.jpg',
      title: 'Banner 2',
      subtitle: 'Up to 50% off on all subscriptions',
      cta: 'Subscribe Now',
      onClick: () => console.log('Slide 2 CTA clicked'),
    },
    {
      image:
        'https://cdnpublic.budgetpetproducts.com.au/contents/2025/05/21/24044014-2d7d-4f5a-938c-ed2fb11588a3.jpg',
      title: 'Banner 3',
      subtitle: 'Up to 50% off on all subscriptions',
      cta: 'Subscribe Now',
      onClick: () => console.log('Slide 3 CTA clicked'),
    },
    // ...other slides
  ]

  const faqs = [
    {
      question: 'Want to know who we are?',
      answer: 'Discover our story, mission, and love for pets.',
    },
    {
      question: 'What brands does Pawsome offer?',
      answer:
        'We offer premium brands like Pedigree, Royal Canin, Whiskas, and many more.',
    },
    // ...more FAQ items
  ]

  const petCategories = [
    {
      bgClass: 'bg-soft-yellow',
      image: dogImg,
      alt: 'Dog',
      route: '/dogs',
    },
    {
      bgClass: 'bg-calm-blue',
      image: catImg,
      alt: 'Cat',
      route: '/cats',
    },
    {
      bgClass: 'bg-soft-yellow',
      image: birdImg,
      alt: 'Bird',
      route: '/birds',
    },
    {
      bgClass: 'bg-energetic-orange',
      image: rodentImg,
      alt: 'Small Pet',
      route: '/other-animals',
    },
    // ...more categories
  ]

  const slides = [
    { image: 'https://cdn.create.vista.com/downloads/8182b741-5b10-465f-8a06-5dd2f17e23aa_1024.jpeg' },
    { image: 'https://cdn.create.vista.com/downloads/8182b741-5b10-465f-8a06-5dd2f17e23aa_1024.jpeg' },
    // add more banners as needed
  ]

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProducts, setSelectedProducts] = useState([])
  const [confirmedProducts, setConfirmedProducts] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [deliveryFrequency, setDeliveryFrequency] = useState('monthly')
  const [productQuantities, setProductQuantities] = useState({})
  const [showSidebar, setShowSidebar] = useState(true)
  const [selectedSubscription, setSelectedSubscription] = useState(null)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showProductModal, setShowProductModal] = useState(false)
  
  // Mock active subscriptions data with more details
  const [activeSubscriptions] = useState([
    {
      id: 1,
      name: 'Premium Dog Food Bundle',
      products: 3,
      frequency: 'Monthly',
      nextDelivery: '2024-01-15',
      total: 2500,
      startDate: '2023-10-15',
      status: 'Active',
      items: [
        { name: 'Royal Canin Adult Dog Food', quantity: 2, price: 900 },
        { name: 'Pedigree Dental Sticks', quantity: 1, price: 400 },
        { name: 'Dog Chew Toys Set', quantity: 1, price: 300 }
      ],
      deliveryAddress: '123 Main Street, Mumbai, Maharashtra 400001',
      savedAmount: 250
    },
    {
      id: 2,
      name: 'Cat Essentials Pack',
      products: 2,
      frequency: 'Weekly',
      nextDelivery: '2024-01-08',
      total: 1200,
      startDate: '2023-11-01',
      status: 'Active',
      items: [
        { name: 'Whiskas Cat Food - Tuna', quantity: 4, price: 200 },
        { name: 'Cat Litter Premium', quantity: 1, price: 400 }
      ],
      deliveryAddress: '123 Main Street, Mumbai, Maharashtra 400001',
      savedAmount: 120
    }
  ])

  const handleProductToggle = (product) => {
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

  const handleQuantityChange = (productId, change) => {
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

  const handleSubscriptionClick = (subscription) => {
    setSelectedSubscription(subscription)
    setShowSubscriptionModal(true)
  }

  const handleManageSubscription = (e, subscription) => {
    e.stopPropagation() // Prevent card click
    setSelectedSubscription(subscription)
    setShowSubscriptionModal(true)
  }

  const handleRemoveProduct = (productId) => {
    setConfirmedProducts(prev => prev.filter(p => p.id !== productId))
    const newQuantities = { ...productQuantities }
    delete newQuantities[productId]
    setProductQuantities(newQuantities)
  }

  const handleViewProductDetails = (product) => {
    setSelectedProduct(product)
    setShowProductModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <Package className="text-energetic-orange mr-3 h-12 w-12" />
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal-gray">
              Pawsome Subscriptions
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Never run out of your pet's essentials with our convenient subscription service
          </p>
        </div>

        {/* How to Subscribe Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Section Header */}
            <div className="bg-gradient-to-r from-energetic-orange to-warm-orange p-8 text-center">
              <h2 className="text-4xl font-bold text-white mb-2">
                How to Start Your Subscription
              </h2>
              <p className="text-white/90 text-lg">
                Four simple steps to never run out of pet essentials
              </p>
            </div>
            
            {/* Steps Grid */}
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Step 1 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-energetic-orange"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-energetic-orange rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    1
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center mb-3">
                      <ShoppingCart className="h-6 w-6 text-energetic-orange mr-2" />
                      <h3 className="font-bold text-xl text-charcoal-gray">
                        Choose Your Products
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Browse our extensive catalog of premium pet products. Select food, treats, toys, and grooming essentials your pet loves.
                    </p>
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-calm-blue"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-calm-blue rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    2
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center mb-3">
                      <Calendar className="h-6 w-6 text-calm-blue mr-2" />
                      <h3 className="font-bold text-xl text-charcoal-gray">
                        Set Your Schedule
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Choose delivery frequency - daily, weekly, or monthly. Set start and end dates that work for your lifestyle.
                    </p>
                  </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-natural-sage"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-natural-sage rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    3
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center mb-3">
                      <Award className="h-6 w-6 text-natural-sage mr-2" />
                      <h3 className="font-bold text-xl text-charcoal-gray">
                        Unlock Benefits
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Enjoy 10% off every order, free shipping on orders over ₹2,000, and exclusive member perks.
                    </p>
                  </div>
                </motion.div>

                {/* Step 4 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-warm-orange"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-warm-orange rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    4
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center mb-3">
                      <Package className="h-6 w-6 text-warm-orange mr-2" />
                      <h3 className="font-bold text-xl text-charcoal-gray">
                        Sit Back & Relax
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      We'll handle the rest! Track deliveries, manage subscriptions, and earn rewards automatically.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Benefits Cards */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-center text-charcoal-gray mb-8">
                  Subscription Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <PercentIcon className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="font-bold text-lg text-charcoal-gray mb-2">Save 10%</h4>
                    <p className="text-gray-600">On every subscription order</p>
                    <p className="text-2xl font-bold text-energetic-orange mt-2">₹250+</p>
                    <p className="text-xs text-gray-500">Average monthly savings</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="bg-gradient-to-br from-sky-400 to-blue-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Package className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="font-bold text-lg text-charcoal-gray mb-2">Free Shipping</h4>
                    <p className="text-gray-600">On orders above ₹2,000</p>
                    <p className="text-2xl font-bold text-calm-blue mt-2">Always</p>
                    <p className="text-xs text-gray-500">No delivery charges</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="bg-gradient-to-br from-emerald-400 to-green-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <HeadphonesIcon className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="font-bold text-lg text-charcoal-gray mb-2">Priority Support</h4>
                    <p className="text-gray-600">24/7 dedicated assistance</p>
                    <p className="text-2xl font-bold text-natural-sage mt-2">24/7</p>
                    <p className="text-xs text-gray-500">Always here to help</p>
                  </motion.div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="text-center">
                <motion.button
                  onClick={handleOpenModal}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-energetic-orange to-warm-orange hover:from-warm-orange hover:to-energetic-orange text-white font-bold text-xl px-16 py-5 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  Browse Products & Start Subscription
                </motion.button>
                <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-600">
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
            <div className="relative bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-2xl overflow-hidden">
              {/* Decorative Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-energetic-orange to-warm-orange rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-calm-blue to-sky-300 rounded-full blur-3xl" />
              </div>

              {/* Header Section */}
              <div className="relative bg-gradient-to-r from-energetic-orange to-warm-orange p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
                      <Package className="mr-3 h-8 w-8" />
                      Your Subscription Plan
                    </h2>
                    <p className="text-white/90">Customize your delivery preferences and manage products</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-sm">Total Products</p>
                    <p className="text-3xl font-bold text-white">{confirmedProducts.length}</p>
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
                  <h3 className="text-xl font-bold text-charcoal-gray mb-6 flex items-center">
                    <Calendar className="mr-2 h-6 w-6 text-energetic-orange" />
                    Delivery Preferences
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Start Date Card */}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-energetic-orange transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-semibold text-gray-700">Start Date</label>
                        <Calendar className="h-5 w-5 text-energetic-orange" />
                      </div>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-energetic-orange focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-2">When should we start delivering?</p>
                    </motion.div>
                    
                    {/* End Date Card */}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-calm-blue transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-semibold text-gray-700">End Date</label>
                        <Calendar className="h-5 w-5 text-calm-blue" />
                      </div>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-calm-blue focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-2">Optional end date for subscription</p>
                    </motion.div>
                    
                    {/* Frequency Card */}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-natural-sage transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-semibold text-gray-700">Frequency</label>
                        <Package className="h-5 w-5 text-natural-sage" />
                      </div>
                      <select
                        value={deliveryFrequency}
                        onChange={(e) => setDeliveryFrequency(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-natural-sage focus:border-transparent transition-all appearance-none bg-white"
                      >
                        <option value="daily">Daily Delivery</option>
                        <option value="weekly">Weekly Delivery</option>
                        <option value="monthly">Monthly Delivery</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-2">How often should we deliver?</p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Selected Products Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xl font-bold text-charcoal-gray mb-6 flex items-center">
                    <ShoppingCart className="mr-2 h-6 w-6 text-energetic-orange" />
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
                        className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent hover:border-energetic-orange transition-all"
                      >
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-energetic-orange text-white text-xs px-2 py-1 rounded-full">
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
                          <h4 className="font-bold text-charcoal-gray mb-1 line-clamp-2">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-500 mb-3">{product.brand}</p>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="text-lg font-bold text-energetic-orange">
                                ₹{Math.floor(product.price * 0.9)}
                              </span>
                              <span className="text-sm text-gray-400 line-through ml-2">
                                ₹{product.price}
                              </span>
                            </div>
                            <div className="text-xs text-green-600 font-medium">
                              -10%
                            </div>
                          </div>
                          
                          {/* Enhanced Quantity Selector */}
                          <div className="bg-gray-50 rounded-xl p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">Quantity</span>
                              <div className="flex items-center gap-3 bg-white rounded-lg px-3 py-1 shadow-sm">
                                <button
                                  onClick={() => handleQuantityChange(product.id, -1)}
                                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-energetic-orange hover:text-white flex items-center justify-center transition-all"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="text-base font-bold w-8 text-center">
                                  {productQuantities[product.id] || 1}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(product.id, 1)}
                                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-energetic-orange hover:text-white flex items-center justify-center transition-all"
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
                  className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Pricing Summary */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-4">Order Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Products Total</span>
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
                        <div className="pt-3 border-t-2 border-amber-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-lg font-semibold text-gray-700">
                                {deliveryFrequency.charAt(0).toUpperCase() + deliveryFrequency.slice(1)} Total
                              </p>
                              <p className="text-sm text-gray-500">
                                Delivered {deliveryFrequency === 'daily' ? 'every day' : deliveryFrequency === 'weekly' ? 'every week' : 'every month'}
                              </p>
                            </div>
                            <p className="text-3xl font-bold text-energetic-orange">
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
                            ? 'bg-gradient-to-r from-natural-sage to-green-600 hover:from-green-600 hover:to-natural-sage text-white transform hover:scale-105'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {startDate && endDate 
                          ? 'Proceed to Checkout' 
                          : 'Please select subscription dates'
                        }
                      </button>
                      
                      <button
                        onClick={handleOpenModal}
                        className="w-full bg-white hover:bg-gray-50 text-calm-blue font-medium py-3 rounded-2xl border-2 border-calm-blue transition-all"
                      >
                        Modify Product Selection
                      </button>
                      
                      <p className="text-center text-sm text-gray-600">
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
              <div className="bg-gradient-to-r from-energetic-orange to-warm-orange text-white p-6 flex justify-between items-center">
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
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex space-x-4 overflow-x-auto">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                      selectedCategory === 'all'
                        ? 'bg-energetic-orange text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    All Products
                  </button>
                  <button
                    onClick={() => setSelectedCategory('dogs')}
                    className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                      selectedCategory === 'dogs'
                        ? 'bg-energetic-orange text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Dogs
                  </button>
                  <button
                    onClick={() => setSelectedCategory('cats')}
                    className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                      selectedCategory === 'cats'
                        ? 'bg-energetic-orange text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Cats
                  </button>
                  <button
                    onClick={() => setSelectedCategory('birds')}
                    className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                      selectedCategory === 'birds'
                        ? 'bg-energetic-orange text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Birds
                  </button>
                  <button
                    onClick={() => setSelectedCategory('other')}
                    className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                      selectedCategory === 'other'
                        ? 'bg-energetic-orange text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Other Animals
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* Filter products based on selected category */}
                  {selectedCategory === 'all' && (
                    <>
                      {dogProducts.map((product) => (
                        <ProductCard 
                          key={product.id} 
                          product={product} 
                          isSelected={selectedProducts.some(p => p.id === product.id)}
                          onToggle={handleProductToggle}
                          onViewDetails={handleViewProductDetails}
                        />
                      ))}
                      {catProducts.map((product) => (
                        <ProductCard 
                          key={product.id} 
                          product={product} 
                          isSelected={selectedProducts.some(p => p.id === product.id)}
                          onToggle={handleProductToggle}
                          onViewDetails={handleViewProductDetails}
                        />
                      ))}
                      {birdProducts.map((product) => (
                        <ProductCard 
                          key={product.id} 
                          product={product} 
                          isSelected={selectedProducts.some(p => p.id === product.id)}
                          onToggle={handleProductToggle}
                          onViewDetails={handleViewProductDetails}
                        />
                      ))}
                      {otherAnimalsProducts.map((product) => (
                        <ProductCard 
                          key={product.id} 
                          product={product} 
                          isSelected={selectedProducts.some(p => p.id === product.id)}
                          onToggle={handleProductToggle}
                          onViewDetails={handleViewProductDetails}
                        />
                      ))}
                    </>
                  )}
                  
                  {selectedCategory === 'dogs' && dogProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      isSelected={selectedProducts.some(p => p.id === product.id)}
                      onToggle={handleProductToggle}
                      onViewDetails={handleViewProductDetails}
                    />
                  ))}
                  
                  {selectedCategory === 'cats' && catProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      isSelected={selectedProducts.some(p => p.id === product.id)}
                      onToggle={handleProductToggle}
                      onViewDetails={handleViewProductDetails}
                    />
                  ))}
                  
                  {selectedCategory === 'birds' && birdProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      isSelected={selectedProducts.some(p => p.id === product.id)}
                      onToggle={handleProductToggle}
                      onViewDetails={handleViewProductDetails}
                    />
                  ))}
                  
                  {selectedCategory === 'other' && otherAnimalsProducts.map((product) => (
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
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">
                      {selectedProducts.length > 0 
                        ? `${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''} selected`
                        : 'Select products to add to your subscription'
                      }
                    </p>
                    {selectedProducts.length > 0 && (
                      <p className="text-sm text-natural-sage font-medium">
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
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-2 rounded-full transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmSelection}
                      disabled={selectedProducts.length === 0}
                      className={`font-medium px-6 py-2 rounded-full transition-colors ${
                        selectedProducts.length > 0
                          ? 'bg-energetic-orange hover:bg-warm-orange text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
                <div className="bg-gradient-to-r from-calm-blue to-energetic-orange text-white p-6">
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
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="font-semibold text-green-700">{selectedSubscription.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Since</p>
                        <p className="font-medium">{new Date(selectedSubscription.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg text-charcoal-gray mb-3">Delivery Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Frequency</p>
                        <p className="font-medium">{selectedSubscription.frequency}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Next Delivery</p>
                        <p className="font-medium text-natural-sage">
                          {new Date(selectedSubscription.nextDelivery).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                        <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                        <p className="font-medium">{selectedSubscription.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>

                  {/* Products in Subscription */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg text-charcoal-gray mb-3">Products ({selectedSubscription.items.length})</h3>
                    <div className="space-y-3">
                      {selectedSubscription.items.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-medium text-charcoal-gray">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-energetic-orange">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>₹{selectedSubscription.total + selectedSubscription.savedAmount}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Subscription Discount (10%)</span>
                        <span>-₹{selectedSubscription.savedAmount}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-amber-300">
                        <span className="font-semibold">Total per {selectedSubscription.frequency}</span>
                        <span className="font-bold text-lg text-energetic-orange">₹{selectedSubscription.total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowSubscriptionModal(false)}
                      className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-full transition-colors"
                    >
                      Close
                    </button>
                    <button className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-full transition-colors">
                      Cancel Subscription
                    </button>
                    <button className="px-6 py-2 bg-calm-blue hover:bg-blue-700 text-white font-medium rounded-full transition-colors">
                      Edit Subscription
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Sidebar for Active Subscriptions */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-24 bottom-24 w-80 bg-white rounded-l-2xl shadow-2xl z-40 overflow-hidden"
          >
            {/* Sidebar Header */}
            <div className="bg-gradient-to-r from-calm-blue to-energetic-orange p-4 text-white">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">My Active Subscriptions</h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-white/90 mt-1">
                {activeSubscriptions.length} active subscription{activeSubscriptions.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Subscriptions List */}
            <div className="p-4 overflow-y-auto h-full pb-20">
              {activeSubscriptions.length > 0 ? (
                <div className="space-y-4">
                  {activeSubscriptions.map((subscription) => (
                    <motion.div
                      key={subscription.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-energetic-orange transition-colors cursor-pointer"
                      onClick={() => handleSubscriptionClick(subscription)}
                    >
                      <h4 className="font-semibold text-charcoal-gray mb-2">
                        {subscription.name}
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Products:</span>
                          <span className="font-medium">{subscription.products} items</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frequency:</span>
                          <span className="font-medium">{subscription.frequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Next Delivery:</span>
                          <span className="font-medium text-natural-sage">
                            {new Date(subscription.nextDelivery).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-bold text-energetic-orange">
                            ₹{subscription.total}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => handleManageSubscription(e, subscription)}
                        className="w-full mt-3 text-sm text-calm-blue hover:text-blue-700 font-medium transition-colors"
                      >
                        Manage Subscription →
                      </button>
                    </motion.div>
                  ))}
                  
                  {/* Total Monthly Spend */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                    <p className="text-sm text-gray-600 mb-1">Total Monthly Spend</p>
                    <p className="text-2xl font-bold text-charcoal-gray">
                      ₹{activeSubscriptions.reduce((sum, sub) => sum + sub.total, 0)}
                    </p>
                    <p className="text-xs text-natural-sage mt-1">
                      Saving ₹{Math.floor(activeSubscriptions.reduce((sum, sub) => sum + sub.total, 0) * 0.1)} with subscriptions
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No active subscriptions</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Start by selecting products above
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Sidebar Button */}
      {!showSidebar && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setShowSidebar(true)}
          className="fixed right-4 top-24 bg-energetic-orange text-white p-3 rounded-full shadow-lg hover:bg-warm-orange transition-colors z-40"
        >
          <ChevronLeft className="h-6 w-6" />
        </motion.button>
      )}

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
                <div className="relative h-80 bg-gradient-to-br from-calm-blue via-energetic-orange to-warm-orange">
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
                        <h2 className="text-3xl font-bold text-charcoal-gray mb-2">
                          {selectedProduct.name}
                        </h2>
                        <p className="text-lg text-gray-600 flex items-center gap-2">
                          by <span className="font-semibold text-energetic-orange">{selectedProduct.brand}</span>
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
                          <span className="ml-2 font-semibold text-charcoal-gray">
                            {selectedProduct.rating}
                          </span>
                        </div>
                        <span className="text-gray-500">
                          ({selectedProduct.reviews} reviews)
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedProduct.inStock 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      {/* Description */}
                      <div className="mb-6">
                        <h3 className="font-semibold text-lg text-charcoal-gray mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed">
                          {selectedProduct.description || `Premium ${selectedProduct.subcategory} for your beloved pet. This high-quality product from ${selectedProduct.brand} is designed to provide the best care and comfort for your furry friend. Made with carefully selected ingredients and materials to ensure safety and effectiveness.`}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="mb-6">
                        <h3 className="font-semibold text-lg text-charcoal-gray mb-3">Key Features</h3>
                        <div className="space-y-2">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <Check className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="text-gray-600">High-quality ingredients and materials</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <Check className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="text-gray-600">Veterinarian recommended</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <Check className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="text-gray-600">Suitable for all life stages</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <Check className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="text-gray-600">100% satisfaction guarantee</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Pricing and Actions */}
                    <div>
                      {/* Pricing Card */}
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-6">
                        <h3 className="font-semibold text-lg text-charcoal-gray mb-4">Pricing Options</h3>
                        
                        {/* One-time Purchase */}
                        <div className="mb-4 p-4 bg-white rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-700 font-medium">One-time Purchase</span>
                            {selectedProduct.discount && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {selectedProduct.discount}% OFF
                              </span>
                            )}
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-charcoal-gray">
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
                        <div className="p-4 bg-gradient-to-r from-natural-sage/20 to-green-100 rounded-xl border-2 border-natural-sage">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-700 font-medium">Subscribe & Save</span>
                            <span className="bg-natural-sage text-white text-xs px-2 py-1 rounded-full">
                              Save 10%
                            </span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-natural-sage">
                              ₹{Math.floor(selectedProduct.price * 0.9)}
                            </span>
                            <span className="text-sm text-gray-600">per delivery</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            + Free shipping on all subscription orders
                          </p>
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                        <h3 className="font-semibold text-lg text-charcoal-gray mb-3">Why Choose Subscription?</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <PercentIcon className="h-5 w-5 text-energetic-orange" />
                            <span className="text-gray-700">Save 10% on every order</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <TruckIcon className="h-5 w-5 text-energetic-orange" />
                            <span className="text-gray-700">Free delivery on all orders</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-energetic-orange" />
                            <span className="text-gray-700">Flexible delivery schedule</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-energetic-orange" />
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
                          className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 ${
                            selectedProducts.some(p => p.id === selectedProduct.id)
                              ? 'bg-gray-200 text-gray-600'
                              : 'bg-gradient-to-r from-energetic-orange to-warm-orange text-white shadow-lg'
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
                          className="w-full py-3 px-6 bg-white border-2 border-gray-300 rounded-2xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Close
                        </button>
                      </div>

                      {/* Trust Badges */}
                      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
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
const ProductCard = ({ product, isSelected, onToggle, onViewDetails }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative bg-white rounded-lg border-2 transition-all ${
        isSelected ? 'border-energetic-orange shadow-lg' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-energetic-orange text-white rounded-full p-1 z-10">
          <Plus className="h-4 w-4 rotate-45" />
        </div>
      )}

      {/* Product Image */}
      <div 
        className="aspect-square overflow-hidden rounded-t-lg bg-gray-50 cursor-pointer"
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
          className="font-semibold text-charcoal-gray text-sm mb-1 line-clamp-2 cursor-pointer hover:text-energetic-orange transition-colors"
          onClick={() => onToggle(product)}
        >
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through mr-2">
                ₹{product.originalPrice}
              </span>
            )}
            <span className="font-bold text-energetic-orange">
              ₹{product.price}
            </span>
          </div>
          
          {/* Rating */}
          <div className="flex items-center">
            <Star className="h-3 w-3 fill-current text-yellow-400" />
            <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="flex-1 bg-calm-blue hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <Eye className="h-3 w-3" />
            View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(product);
            }}
            className={`flex-1 text-xs font-medium py-2 px-3 rounded-lg transition-colors ${
              isSelected 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-energetic-orange hover:bg-warm-orange text-white'
            }`}
          >
            {isSelected ? 'Remove' : 'Add'}
          </button>
        </div>

        {/* Subscription Price */}
        <div className="mt-3 pt-2 border-t border-gray-100">
          <p className="text-xs text-natural-sage font-medium text-center">
            Subscription: ₹{Math.floor(product.price * 0.9)} (Save 10%)
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default Subscriptions