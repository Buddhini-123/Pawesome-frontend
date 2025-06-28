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
  
  // Mock active subscriptions data
  const [activeSubscriptions] = useState([
    {
      id: 1,
      name: 'Premium Dog Food Bundle',
      products: 3,
      frequency: 'Monthly',
      nextDelivery: '2024-01-15',
      total: 2500
    },
    {
      id: 2,
      name: 'Cat Essentials Pack',
      products: 2,
      frequency: 'Weekly',
      nextDelivery: '2024-01-08',
      total: 1200
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
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-charcoal-gray mb-8 text-center">
              How to Add a Subscription
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-energetic-orange rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-charcoal-gray mb-2">
                    Choose Your Products
                  </h3>
                  <p className="text-gray-600">
                    Browse our extensive catalog of pet products and select the items your furry friend needs regularly. From food and treats to toys and grooming supplies, we have everything covered.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-calm-blue rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-charcoal-gray mb-2">
                    Set Your Delivery Schedule
                  </h3>
                  <p className="text-gray-600">
                    Choose how often you want your products delivered - weekly, bi-weekly, monthly, or create a custom schedule that works for you. We'll make sure your pet never runs out of their favorites.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-natural-sage rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-charcoal-gray mb-2">
                    Enjoy Exclusive Benefits
                  </h3>
                  <p className="text-gray-600">
                    Save 10% on all subscription orders, get free shipping on orders over ₹2,000, and enjoy priority customer support. Plus, you can modify or cancel your subscription anytime.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-warm-orange rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-charcoal-gray mb-2">
                    Relax and Let Us Handle the Rest
                  </h3>
                  <p className="text-gray-600">
                    We'll automatically deliver your pet's essentials right to your doorstep. Track your deliveries, manage your subscriptions, and earn rewards through your account dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-soft-yellow rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <PercentIcon className="h-8 w-8 text-energetic-orange" />
                </div>
                <h4 className="font-semibold text-charcoal-gray mb-2">Save 10%</h4>
                <p className="text-sm text-gray-600">On every subscription order</p>
              </div>
              
              <div className="text-center">
                <div className="bg-periwinkle rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-calm-blue" />
                </div>
                <h4 className="font-semibold text-charcoal-gray mb-2">Free Shipping</h4>
                <p className="text-sm text-gray-600">On orders above ₹2,000</p>
              </div>
              
              <div className="text-center">
                <div className="bg-mint/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <HeadphonesIcon className="h-8 w-8 text-mint" />
                </div>
                <h4 className="font-semibold text-charcoal-gray mb-2">Priority Support</h4>
                <p className="text-sm text-gray-600">24/7 dedicated assistance</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-12 text-center">
              <button
                onClick={handleOpenModal}
                className="bg-energetic-orange hover:bg-warm-orange text-white font-bold text-lg px-12 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Browse Products & Start Subscription
              </button>
              <p className="mt-4 text-sm text-gray-600">
                No commitment required • Cancel anytime • Modify as needed
              </p>
            </div>
          </div>
        </div>

        {/* Selected Products Section */}
        {confirmedProducts.length > 0 && (
          <div className="max-w-6xl mx-auto mt-16">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-charcoal-gray mb-6">
                Your Subscription Details
              </h2>

              {/* Subscription Period and Frequency */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 rounded-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-energetic-orange focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-energetic-orange focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Package className="inline h-4 w-4 mr-1" />
                    Delivery Frequency
                  </label>
                  <select
                    value={deliveryFrequency}
                    onChange={(e) => setDeliveryFrequency(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-energetic-orange focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-charcoal-gray mb-4">
                Selected Products ({confirmedProducts.length})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {confirmedProducts.map((product) => (
                  <div key={product.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold text-sm text-charcoal-gray mb-1 line-clamp-2">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-energetic-orange">
                        ₹{Math.floor(product.price * 0.9)}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ₹{product.price}
                      </span>
                    </div>
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-200">
                      <span className="text-xs text-gray-600">Qty:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(product.id, -1)}
                          className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">
                          {productQuantities[product.id] || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(product.id, 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-gray-600">
                      {deliveryFrequency.charAt(0).toUpperCase() + deliveryFrequency.slice(1)} Subscription Total:
                    </p>
                    <p className="text-2xl font-bold text-charcoal-gray">
                      ₹{confirmedProducts.reduce((total, product) => {
                        const qty = productQuantities[product.id] || 1
                        return total + Math.floor(product.price * 0.9 * qty)
                      }, 0)}
                    </p>
                    <p className="text-sm text-natural-sage">
                      You save ₹{confirmedProducts.reduce((total, product) => {
                        const qty = productQuantities[product.id] || 1
                        return total + Math.floor(product.price * 0.1 * qty)
                      }, 0)} every {deliveryFrequency === 'daily' ? 'day' : deliveryFrequency === 'weekly' ? 'week' : 'month'}!
                    </p>
                  </div>
                  <button
                    onClick={handleOpenModal}
                    className="bg-calm-blue hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full transition-colors"
                  >
                    Modify Selection
                  </button>
                </div>
                
                <button 
                  disabled={!startDate || !endDate}
                  className={`w-full font-bold text-lg py-4 rounded-full transition-all duration-300 shadow-lg ${
                    startDate && endDate
                      ? 'bg-natural-sage hover:bg-green-600 text-white transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {startDate && endDate 
                    ? 'Proceed to Checkout' 
                    : 'Please select subscription dates'
                  }
                </button>
              </div>
            </div>
          </div>
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
                  {(selectedCategory === 'all' || selectedCategory === 'dogs') &&
                    dogProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        isSelected={selectedProducts.some(p => p.id === product.id)}
                        onToggle={handleProductToggle}
                      />
                    ))}
                  
                  {(selectedCategory === 'all' || selectedCategory === 'cats') &&
                    catProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        isSelected={selectedProducts.some(p => p.id === product.id)}
                        onToggle={handleProductToggle}
                      />
                    ))}
                  
                  {(selectedCategory === 'all' || selectedCategory === 'birds') &&
                    birdProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        isSelected={selectedProducts.some(p => p.id === product.id)}
                        onToggle={handleProductToggle}
                      />
                    ))}
                  
                  {(selectedCategory === 'all' || selectedCategory === 'other') &&
                    otherAnimalsProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        isSelected={selectedProducts.some(p => p.id === product.id)}
                        onToggle={handleProductToggle}
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
                      <button className="w-full mt-3 text-sm text-calm-blue hover:text-blue-700 font-medium">
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
    </div>
  )
}

// Product Card Component for Modal
const ProductCard = ({ product, isSelected, onToggle }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative bg-white rounded-lg border-2 transition-all cursor-pointer ${
        isSelected ? 'border-energetic-orange shadow-lg' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onToggle(product)}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-energetic-orange text-white rounded-full p-1 z-10">
          <Plus className="h-4 w-4 rotate-45" />
        </div>
      )}

      {/* Product Image */}
      <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-charcoal-gray text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
        
        {/* Price */}
        <div className="flex items-center justify-between">
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

        {/* Subscription Price */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-natural-sage font-medium">
            Subscription: ₹{Math.floor(product.price * 0.9)} (Save 10%)
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default Subscriptions