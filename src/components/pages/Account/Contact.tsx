import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, easeInOut } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle, 
  Headphones,
  CheckCircle,
  AlertCircle,
  Star,
  Users,
  Package,
  Heart,
  Sparkles,
  Globe,
  Shield,
  Zap,
  Award,
  Coffee,
  Smile
} from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    petType: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeMethod, setActiveMethod] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          petType: ''
        });
      }, 3000);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      primary: '+91 12345 67890',
      secondary: 'Mon-Sat, 9AM-7PM',
      color: 'from-primary-blue to-primary-blue',
      shadowColor: 'shadow-primary-blue/30',
      bgPattern: 'bg-gradient-to-br'
    },
    {
      icon: Mail,
      title: 'Email Us',
      primary: 'support@pawsome.com',
      secondary: '24 hour response time',
      color: 'from-emerald-green to-emerald-green',
      shadowColor: 'shadow-emerald-green/30',
      bgPattern: 'bg-gradient-to-tr'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      primary: 'Chat with us',
      secondary: 'Available 9AM-7PM',
      color: 'from-vibrant-orange to-vibrant-orange',
      shadowColor: 'shadow-vibrant-orange/30',
      bgPattern: 'bg-gradient-to-bl'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      primary: '+91 98765 43210',
      secondary: 'Emergency pet care line',
      color: 'from-coral-red to-coral-red',
      shadowColor: 'shadow-coral-red/30',
      bgPattern: 'bg-gradient-to-tl'
    }
  ];

  const stats = [
    { icon: Users, value: '50,000+', label: 'Happy Customers', color: 'text-primary-blue' },
    { icon: Package, value: '100,000+', label: 'Orders Delivered', color: 'text-emerald-green' },
    { icon: Star, value: '4.9/5', label: 'Average Rating', color: 'text-sunny-yellow' },
    { icon: Heart, value: '24/7', label: 'Pet Care Support', color: 'text-coral-red' }
  ];

  const features = [
    { icon: Zap, text: 'Lightning Fast Response' },
    { icon: Shield, text: 'Secure & Confidential' },
    { icon: Globe, text: 'Multi-language Support' },
    { icon: Award, text: 'Expert Pet Advisors' }
  ];

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: easeInOut
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sunny-yellow/10 via-white to-primary-blue/10 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-sunny-yellow rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-vibrant-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-coral-red/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Parallax Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sunny-yellow via-vibrant-orange to-coral-red py-32">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <motion.div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 20 0 L 0 0 0 20" fill="none" stroke="white" stroke-width="0.5" opacity="0.2"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23grid)" /%3E%3C/svg%3E")',
              transform: `translateX(${mousePosition.x * 0.02}px) translateY(${mousePosition.y * 0.02}px)`
            }}
          />
        </div>

        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-6"
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>
            
            <motion.h1 
              className="text-6xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Get in Touch
            </motion.h1>
            
            <motion.p 
              className="text-2xl opacity-90 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              We're here to help you and your furry friends. Reach out to our expert team for any questions or concerns.
            </motion.p>

            <motion.div 
              className="flex flex-wrap justify-center gap-4 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <feature.icon className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Animated Decorative Elements */}
        <motion.div 
          className="absolute top-20 left-10 w-20 h-20 bg-white rounded-full opacity-10"
          animate={floatingAnimation}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-32 h-32 bg-white rounded-full opacity-10"
          animate={floatingAnimation}
          transition={{ delay: 1 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full opacity-10"
          animate={floatingAnimation}
          transition={{ delay: 2 }}
        />
      </div>

      {/* 3D Contact Methods Cards */}
      <div className="container mx-auto px-4 -mt-24 relative z-20 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onHoverStart={() => setActiveMethod(index)}
              onHoverEnd={() => setActiveMethod(null)}
            >
              <div className={`absolute inset-0 ${method.bgPattern} ${method.color} rounded-2xl blur-xl ${method.shadowColor} shadow-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <motion.div
                className="relative bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-300"
                whileHover={{ 
                  y: -10,
                  rotateX: 5,
                  rotateY: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <motion.div 
                  className={`${method.bgPattern} ${method.color} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${method.shadowColor} shadow-lg`}
                  animate={activeMethod === index ? { rotate: 360 } : {}}
                  transition={{ duration: 0.8 }}
                >
                  <method.icon className="h-10 w-10 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-charcoal mb-3">{method.title}</h3>
                <p className="text-charcoal font-semibold text-lg">{method.primary}</p>
                <p className="text-sm text-charcoal/50 mt-1">{method.secondary}</p>
                
                <motion.div 
                  className="absolute top-4 right-4"
                  animate={{ opacity: activeMethod === index ? 1 : 0 }}
                >
                  <Sparkles className="w-6 h-6 text-sunny-yellow" />
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content with Glass Morphism */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Enhanced Contact Form */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/50">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-r from-sunny-yellow to-vibrant-orange rounded-2xl p-4 mr-4">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-charcoal">Send us a Message</h2>
                  <p className="text-charcoal/60 mt-1">We typically respond within 2 hours</p>
                </div>
              </div>
              
              <AnimatePresence>
                {submitStatus === 'success' && (
                  <motion.div 
                    className="mb-8 p-6 bg-gradient-to-r from-emerald-green to-emerald-green text-white rounded-2xl flex items-center shadow-xl"
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-4">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">Success! Message Sent</h3>
                      <p className="opacity-90">We'll get back to you within 24 hours.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <label className="block text-sm font-bold text-charcoal mb-3 flex items-center">
                      <Smile className="w-4 h-4 mr-2 text-sunny-yellow" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border-2 border-soft-gray rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-vibrant-orange/20 focus:border-vibrant-orange transition-all duration-300 bg-soft-gray/50"
                      placeholder="John Doe"
                      required
                    />
                  </motion.div>
                  
                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <label className="block text-sm font-bold text-charcoal mb-3 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-sunny-yellow" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border-2 border-soft-gray rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-vibrant-orange/20 focus:border-vibrant-orange transition-all duration-300 bg-soft-gray/50"
                      placeholder="john@example.com"
                      required
                    />
                  </motion.div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <label className="block text-sm font-bold text-charcoal mb-3 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-sunny-yellow" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border-2 border-soft-gray rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-vibrant-orange/20 focus:border-vibrant-orange transition-all duration-300 bg-soft-gray/50"
                      placeholder="+91 98765 43210"
                    />
                  </motion.div>
                  
                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <label className="block text-sm font-bold text-charcoal mb-3 flex items-center">
                      <Heart className="w-4 h-4 mr-2 text-sunny-yellow" />
                      Pet Type
                    </label>
                    <select
                      name="petType"
                      value={formData.petType}
                      onChange={handleChange}
                      className="w-full border-2 border-soft-gray rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-vibrant-orange/20 focus:border-vibrant-orange transition-all duration-300 bg-soft-gray/50"
                    >
                      <option value="">Select your pet</option>
                      <option value="dog">🐕 Dog</option>
                      <option value="cat">🐈 Cat</option>
                      <option value="bird">🦜 Bird</option>
                      <option value="fish">🐠 Fish</option>
                      <option value="rabbit">🐰 Rabbit</option>
                      <option value="other">🐾 Other</option>
                    </select>
                  </motion.div>
                </div>

                <motion.div whileFocus={{ scale: 1.02 }}>
                  <label className="block text-sm font-bold text-charcoal mb-3 flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2 text-sunny-yellow" />
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border-2 border-soft-gray rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-vibrant-orange/20 focus:border-vibrant-orange transition-all duration-300 bg-soft-gray/50"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="order">📦 Order Inquiry</option>
                    <option value="product">🛍️ Product Question</option>
                    <option value="shipping">🚚 Shipping & Delivery</option>
                    <option value="return">↩️ Returns & Refunds</option>
                    <option value="subscription">🔄 Subscription Help</option>
                    <option value="petcare">🩺 Pet Care Advice</option>
                    <option value="complaint">⚠️ Complaint</option>
                    <option value="feedback">💝 Feedback</option>
                    <option value="other">💬 Other</option>
                  </select>
                </motion.div>
                
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <label className="block text-sm font-bold text-charcoal mb-3">
                    Message *
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full border-2 border-soft-gray rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-vibrant-orange/20 focus:border-vibrant-orange transition-all duration-300 resize-none bg-soft-gray/50"
                      placeholder="Tell us how we can help you..."
                      required
                    />
                    <div className="absolute bottom-4 right-4 text-sm text-charcoal/40">
                      {formData.message.length}/500
                    </div>
                  </div>
                </motion.div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full group overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-sunny-yellow via-vibrant-orange to-coral-red rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-sunny-yellow/80 via-vibrant-orange/80 to-coral-red/80 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-sunny-yellow to-vibrant-orange text-white font-bold px-8 py-5 rounded-2xl flex items-center justify-center space-x-3 shadow-xl">
                    {isSubmitting ? (
                      <>
                        <motion.div 
                          className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-6 w-6" />
                        <span className="text-lg">Send Message</span>
                        <motion.div
                          className="absolute right-4"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.div>
                      </>
                    )}
                  </div>
                </motion.button>
              </form>
            </div>
          </motion.div>
          
          {/* Enhanced Sidebar */}
          <motion.div 
            className="lg:col-span-1 space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* 3D Office Location Card */}
            <motion.div 
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 overflow-hidden"
              whileHover={{ rotateY: 5, rotateX: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-primary-blue to-vibrant-orange rounded-2xl p-3 mr-3">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-charcoal">Visit Our Store</h3>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden mb-6 group">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.9503533795865!2d72.82347021490177!3d19.021748187117847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cee5e9b3b7d7%3A0x2c70a15a4d8b4624!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1634567890123!5m2!1sen!2sin"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="rounded-2xl group-hover:scale-105 transition-transform duration-500"
                ></iframe>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>
              
              <div className="space-y-4">
                <motion.div 
                  className="bg-gradient-to-r from-sunny-yellow/10 to-vibrant-orange/10 rounded-2xl p-4"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="font-bold text-charcoal mb-2">📍 Pawsome Pet Store</p>
                  <p className="text-charcoal/60 text-sm">
                    123 Pet Care Street,<br />
                    Animal District, Mumbai,<br />
                    Maharashtra 400001
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-r from-primary-blue/10 to-vibrant-orange/10 rounded-2xl p-4"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="font-bold text-charcoal mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-vibrant-orange" />
                    Store Hours
                  </p>
                  <div className="text-sm text-charcoal/60 space-y-1">
                    <div className="flex justify-between">
                      <span>Mon - Fri:</span>
                      <span className="font-semibold">9:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span className="font-semibold">9:00 AM - 7:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span className="font-semibold">10:00 AM - 6:00 PM</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Interactive Quick Help Card */}
            <motion.div 
              className="bg-gradient-to-br from-sunny-yellow to-vibrant-orange rounded-3xl shadow-2xl p-8 text-white overflow-hidden relative"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Coffee className="w-8 h-8 mr-3" />
                  Need Quick Help?
                </h3>
                
                <div className="space-y-3">
                  {['Track Your Order', 'Return Policy', 'Shipping Info', 'FAQs', 'Pet Care Guide'].map((item, index) => (
                    <motion.a 
                      key={index}
                      href="#" 
                      className="block group"
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 group-hover:bg-white/30 transition-all duration-300">
                        <span className="font-medium">{item}</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Animated Emergency Card */}
            <motion.div 
              className="relative overflow-hidden"
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(239, 68, 68, 0)",
                  "0 0 0 10px rgba(239, 68, 68, 0.1)",
                  "0 0 0 20px rgba(239, 68, 68, 0)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="bg-gradient-to-r from-coral-red to-coral-red rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-white/10"
                  animate={{ 
                    background: [
                      "radial-gradient(circle at 20% 80%, transparent 0%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 100%)",
                      "radial-gradient(circle at 80% 20%, transparent 0%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 100%)",
                      "radial-gradient(circle at 20% 80%, transparent 0%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 100%)",
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <AlertCircle className="h-10 w-10 mr-3" />
                    </motion.div>
                    <h3 className="text-2xl font-bold">Emergency Pet Care</h3>
                  </div>
                  <p className="mb-4 text-white/90">
                    For urgent pet health emergencies or critical order issues:
                  </p>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <p className="text-3xl font-bold mb-1">+91 98765 43210</p>
                    <p className="text-sm opacity-90 flex items-center">
                      <Zap className="w-4 h-4 mr-1" />
                      Available 24/7 - Immediate Response
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Animated Stats Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sunny-yellow/10 via-vibrant-orange/10 to-coral-red/10"></div>
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="80" height="80" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"%3E%3Ccircle cx="2" cy="2" r="1" fill="%23fbbf24" opacity="0.3"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="80" height="80" fill="url(%23dots)" /%3E%3C/svg%3E")',
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2 
            className="text-4xl font-bold text-center text-charcoal mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Pet Parents Love Us
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center group"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-xl mb-6 group-hover:shadow-2xl transition-shadow"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <stat.icon className={`h-12 w-12 ${stat.color}`} />
                </motion.div>
                <motion.h3 
                  className="text-4xl font-bold text-charcoal mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.h3>
                <p className="text-charcoal/60 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Add custom styles for animations */}
      <style>{`
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
      `}</style>
    </div>
  );
};

export default Contact;