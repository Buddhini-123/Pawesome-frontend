import React, { useRef, Suspense } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { 
  Truck, 
  Award, 
  Phone, 
  ArrowRight, 
  Heart, 
  Shield, 
  Globe,
  Check,
  Mail,
  MapPin
} from 'lucide-react';

// 3D Components
import Advanced3DBackground from '../../effects/Advanced3DBackground';
import EnhancedParticleSystem from '../../effects/EnhancedParticleSystem';
import Loading3D from '../../effects/Loading3D';

// Component imports removed - using inline JSX instead

// Data arrays (you may need to import these from separate files)
const additionalServices = [
  { title: 'Veterinary Consultation', description: '24/7 expert vet advice' },
  { title: 'Pet Grooming', description: 'Professional grooming services' },
  { title: 'Training Programs', description: 'Behavioral training for pets' },
  { title: 'Emergency Care', description: 'Round-the-clock emergency support' }
];

const testimonials = [
  { name: 'Sarah Johnson', text: 'Amazing service and quality products!' },
  { name: 'Mike Chen', text: 'My pets love everything from Pawsome!' }
];

const topBrands = [
  'Royal Canin',
  'Hill\'s',
  'Purina',
  'KONG'
];

const Home: React.FC = () => {
  // Refs for intersection observer
  const featuresRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const brandsRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);

  // InView hooks
  const featuresInView = useInView(featuresRef);
  const servicesInView = useInView(servicesRef);
  const testimonialsInView = useInView(testimonialsRef);
  const brandsInView = useInView(brandsRef);
  const aboutInView = useInView(aboutRef);

  return (
    <>
    {/* <Header /> */}
      {/* Advanced 3D Background Canvas */}
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          style={{ background: 'transparent' }}
          gl={{ antialias: false, alpha: true }}
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={<Loading3D />}>
            <Advanced3DBackground />
          </Suspense>
        </Canvas>
      </div>

      {/* Enhanced Particle System */}
      <EnhancedParticleSystem intensity={0.3} mouseInteractive={true} />

      <div className="min-h-screen bg-gradient-to-br from-sky-50/90 to-amber-50/90 relative z-10">
        <div className="relative overflow-hidden">
          
          {/* Hero Section with 3D Interactive Elements */}
          <section className="min-h-screen flex items-center justify-center px-4 relative z-30">
            <div className="container mx-auto max-w-6xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative"
              >
                <motion.h1 
                  className="text-6xl md:text-7xl lg:text-8xl font-black text-gray-800 mb-6 relative z-20"
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(108, 166, 205, 0.3)",
                      "0 0 40px rgba(245, 158, 11, 0.4)",
                      "0 0 20px rgba(108, 166, 205, 0.3)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  Welcome to
                  <motion.span 
                    className="block bg-gradient-to-r from-sky-500 via-amber-500 to-stone-500 bg-clip-text text-transparent"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotateX: [0, 5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    Pawsome
                  </motion.span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed relative z-20"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  Experience premium pet care with our advanced 3D interactive platform. 
                  Where technology meets love for your furry, feathered, and scaled family members.
                </motion.p>

                {/* Interactive 3D CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.1, 
                      rotateY: 10,
                      rotateX: 5,
                      y: -10
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <Link
                      to="/dogs"
                      className="inline-flex items-center bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg group"
                    >
                      <motion.span 
                        className="mr-4 text-2xl"
                        animate={{ 
                          rotate: [0, 15, -15, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        🐕
                      </motion.span>
                      <span>Explore for Dogs</span>
                      <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ 
                      scale: 1.1, 
                      rotateY: -10,
                      rotateX: 5,
                      y: -10
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <Link
                      to="/cats"
                      className="inline-flex items-center bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg group"
                    >
                      <motion.span 
                        className="mr-4 text-2xl"
                        animate={{ 
                          rotate: [0, -15, 15, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      >
                        🐱
                      </motion.span>
                      <span>Explore for Cats</span>
                      <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Floating Pet Stats */}
                <motion.div
                  className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  {[
                    { number: '50K+', label: 'Happy Pets', emoji: '🐾' },
                    { number: '24/7', label: 'Expert Care', emoji: '❤️' },
                    { number: '500+', label: 'Cities Served', emoji: '🚚' },
                    { number: '99%', label: 'Satisfaction', emoji: '⭐' }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
                      whileHover={{ 
                        scale: 1.05, 
                        y: -5,
                        rotateY: 5 * (index % 2 === 0 ? 1 : -1)
                      }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <motion.div 
                        className="text-3xl mb-2"
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      >
                        {stat.emoji}
                      </motion.div>
                      <div className="text-2xl font-bold text-gray-800 group-hover:text-sky-600 transition-colors">
                        {stat.number}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </section>
          
          {/* Features Section */}
          <section ref={featuresRef} className="py-16 px-4 relative z-30 bg-white">
            <div className="container mx-auto max-w-7xl">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
                  Why Choose Pawsome?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Experience the difference with our premium services designed specifically for your beloved pets
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { 
                    icon: Truck, 
                    title: 'Lightning Fast Delivery', 
                    desc: 'Same-day delivery on orders above Rs. 2,000. Your pets never wait! Our logistics network covers over 500 cities across the country.',
                    benefit: 'Fast & Free',
                    borderColor: 'border-sky-200'
                  },
                  { 
                    icon: Award, 
                    title: 'Premium Quality Promise', 
                    desc: 'Hand-picked products from trusted brands worldwide. 100% satisfaction guaranteed with our quality assurance team testing every product.',
                    benefit: 'Top Quality',
                    borderColor: 'border-amber-200'
                  },
                  { 
                    icon: Phone, 
                    title: '24/7 Expert Care', 
                    desc: 'Veterinary advice, emergency support, and nutrition consultations anytime. Our team of certified vets is always ready to help.',
                    benefit: 'Always There',
                    borderColor: 'border-stone-200'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="relative group"
                    initial={{ opacity: 0, y: 40 }}
                    animate={featuresInView ? { 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        duration: 0.6, 
                        delay: index * 0.15
                      }
                    } : {}}
                    whileHover={{ 
                      scale: 1.03, 
                      y: -8,
                      rotateX: 5,
                      rotateY: index % 2 === 0 ? 3 : -3,
                      transition: { duration: 0.3 }
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className={`bg-white rounded-xl p-8 text-center shadow-xl border-2 ${feature.borderColor} relative overflow-hidden h-full transform-gpu transition-all duration-300 group-hover:shadow-2xl group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-gray-50`}>
                      
                      {/* Advanced glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 via-amber-400/10 to-stone-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                      
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {feature.benefit}
                      </div>
                      
                      <motion.div 
                        className="flex justify-center mb-6 relative z-10"
                        whileHover={{ 
                          scale: 1.15,
                          rotate: 8,
                          y: -5
                        }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                      >
                        <div className="bg-gradient-to-br from-sky-100 to-sky-200 p-4 rounded-full shadow-lg group-hover:shadow-xl group-hover:from-sky-200 group-hover:to-amber-100 transition-all duration-300">
                          <feature.icon className="h-8 w-8 text-sky-600 group-hover:text-amber-600 transition-colors duration-300" />
                        </div>
                        
                        {/* Sparkle effect around icon on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          {[...Array(3)].map((_, sparkleIndex) => (
                            <motion.div
                              key={sparkleIndex}
                              className="absolute w-1 h-1 bg-amber-400 rounded-full"
                              style={{
                                left: `${30 + sparkleIndex * 20}%`,
                                top: `${20 + sparkleIndex * 15}%`
                              }}
                              animate={{
                                scale: [0, 1, 0],
                                opacity: [0, 1, 0],
                                rotate: [0, 180, 360]
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: sparkleIndex * 0.3 + index * 0.1
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                      
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-amber-400 opacity-20"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Additional Services Section */}
          <section ref={servicesRef} className="py-16 px-4 relative z-30 bg-gradient-to-br from-amber-50 to-stone-50">
            <div className="container mx-auto max-w-7xl">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
                  Complete Pet Care Services
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Beyond products - we offer comprehensive care solutions for your pet's health and happiness
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {additionalServices.map((service, index) => (
                  <div key={service.title} className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                ))}
              </div>

              <motion.div
                className="text-center mt-12"
                initial={{ opacity: 0 }}
                animate={servicesInView ? { opacity: 1 } : {}}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center bg-gradient-to-r from-sky-500 to-amber-500 text-white font-bold px-8 py-4 rounded-xl hover:from-sky-600 hover:to-amber-600 transition-all duration-300 shadow-xl"
                >
                  <Phone className="mr-3 h-6 w-6" />
                  <span>Book a Service Today</span>
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </motion.div>
            </div>
          </section>

          {/* Customer Testimonials */}
          <section ref={testimonialsRef} className="py-16 px-4 relative z-30 bg-white">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
                  What Pet Parents Say
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Real stories from our happy customers and their beloved pets
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                    <h4 className="text-lg font-bold mb-2">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.text}</p>
                  </div>
                ))}
              </div>

              <motion.div
                className="text-center mt-12"
                initial={{ opacity: 0 }}
                animate={testimonialsInView ? { opacity: 1 } : {}}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <div className="bg-gradient-to-r from-sky-50 to-amber-50 rounded-xl p-8 border-2 border-sky-100">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Join Our Happy Pet Family!</h3>
                  <p className="text-gray-600 mb-6">Over 50,000 pet parents trust Pawsome for their furry friends' needs</p>
                  <div className="flex justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-sky-600">4.9/5</div>
                      <div className="text-gray-600 text-sm">Customer Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-600">98%</div>
                      <div className="text-gray-600 text-sm">Repeat Customers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-stone-600">24h</div>
                      <div className="text-gray-600 text-sm">Avg Response Time</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Partner Brands Section */}
          <section ref={brandsRef} className="py-16 px-4 relative z-30 bg-gradient-to-br from-gray-50 to-sky-50">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={brandsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
                  Trusted Partner Brands
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  We work with the world's leading pet care brands to bring you the best products
                </p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {topBrands.map((brand, index) => (
                  <div key={brand} className="bg-white rounded-xl p-6 shadow-lg text-center">
                    <h4 className="text-lg font-bold">{brand}</h4>
                  </div>
                ))}
              </div>

              <motion.div
                className="text-center mt-12"
                initial={{ opacity: 0 }}
                animate={brandsInView ? { opacity: 1 } : {}}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <Link
                  to="/brands"
                  className="inline-flex items-center bg-white text-sky-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg border-2 border-sky-200"
                >
                  <Globe className="mr-3 h-6 w-6" />
                  <span>Explore All Brands</span>
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </motion.div>
            </div>
          </section>

          {/* About Us Section */}
          <section ref={aboutRef} className="py-16 px-4 relative z-30 bg-white">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                initial={{ opacity: 0 }}
                animate={aboutInView ? { opacity: 1 } : {}}
                transition={{ duration: 1 }}
              >
                <div>
                  <motion.h2 
                    className="text-4xl md:text-5xl font-black text-gray-800 mb-6"
                    initial={{ x: -50, opacity: 0 }}
                    animate={aboutInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    About Pawsome
                  </motion.h2>
                  <motion.div
                    className="space-y-4 text-gray-600 text-lg leading-relaxed"
                    initial={{ x: -50, opacity: 0 }}
                    animate={aboutInView ? { x: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <p>
                      Founded with a simple mission: to make premium pet care accessible to every pet parent. 
                      Since 2020, we've been Sri Lanka's most trusted online pet store, serving over 50,000 
                      happy customers across the island.
                    </p>
                    <p>
                      Our team of pet lovers, veterinarians, and nutrition experts work tirelessly to curate 
                      the best products and services for your furry, feathered, and scaled family members.
                    </p>
                    <p>
                      From our automated subscription services to emergency veterinary consultations, 
                      everything we do is designed with one goal: keeping your pets healthy, happy, and loved.
                    </p>
                  </motion.div>
                  
                  <motion.div
                    className="mt-8 grid grid-cols-2 gap-6"
                    initial={{ y: 50, opacity: 0 }}
                    animate={aboutInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <div className="text-center">
                      <div className="text-3xl font-bold text-sky-600">2020</div>
                      <div className="text-gray-600">Founded</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-600">500+</div>
                      <div className="text-gray-600">Cities Served</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-stone-600">50k+</div>
                      <div className="text-gray-600">Happy Customers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-sky-600">24/7</div>
                      <div className="text-gray-600">Support Available</div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  className="relative"
                  initial={{ x: 50, opacity: 0 }}
                  animate={aboutInView ? { x: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <div className="bg-gradient-to-br from-sky-100 to-amber-100 rounded-2xl p-8 text-center">
                    <div className="text-6xl mb-6">🏆</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Award Winning Service</h3>
                    <p className="text-gray-600 mb-6">
                      Recognized as "Best Online Pet Store" by Sri Lanka E-commerce Association 2023
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2 text-sky-600">
                        <Check className="h-5 w-5" />
                        <span className="font-semibold">ISO 9001:2015 Certified</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-amber-600">
                        <Check className="h-5 w-5" />
                        <span className="font-semibold">Veterinary Approved Products</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-stone-600">
                        <Check className="h-5 w-5" />
                        <span className="font-semibold">100% Authentic Guarantee</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating pet emojis around the about section */}
                  <div className="absolute -top-4 -left-4 text-4xl">
                    🐕
                  </div>
                  <div className="absolute -top-4 -right-4 text-4xl">
                    🐱
                  </div>
                  <div className="absolute -bottom-4 -left-4 text-4xl">
                    🐦
                  </div>
                  <div className="absolute -bottom-4 -right-4 text-4xl">
                    🐰
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Contact Information Section */}
          <section className="py-16 px-4 relative z-30 bg-gradient-to-r from-sky-100 to-amber-100">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
                  Get in Touch
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Have questions? Our pet care experts are here to help you and your furry friends
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="bg-sky-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Phone className="h-8 w-8 text-sky-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Call Us</h3>
                  <p className="text-gray-600 mb-2">24/7 Customer Support</p>
                  <p className="text-sky-600 font-semibold">+94 11 234 5678</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="bg-amber-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Email Us</h3>
                  <p className="text-gray-600 mb-2">Quick Response Guaranteed</p>
                  <p className="text-amber-600 font-semibold">help@pawsome.lk</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <div className="bg-stone-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-stone-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Visit Us</h3>
                  <p className="text-gray-600 mb-2">Main Distribution Center</p>
                  <p className="text-stone-600 font-semibold">Colombo 03, Sri Lanka</p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action - Enhanced */}
          <section className="py-16 px-4 relative z-30">
            <div className="container mx-auto max-w-5xl text-center">
              <motion.div
                className="relative"
                whileInView={{ 
                  scale: [0.95, 1],
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-r from-sky-500 via-amber-500 to-stone-500 rounded-2xl p-12 shadow-2xl relative overflow-hidden" style={{background: 'linear-gradient(135deg, #6CA6CD 0%, #F59E0B 50%, #A8A29E 100%)'}}>
                  
                  {/* Animated pet decorations */}
                  {[
                    { emoji: '🐕', position: 'top-6 left-6', delay: 0 },
                    { emoji: '🐱', position: 'top-6 right-6', delay: 0.5 },
                    { emoji: '🐦', position: 'bottom-6 left-6', delay: 1 },
                    { emoji: '🐰', position: 'bottom-6 right-6', delay: 1.5 },
                  ].map((pet, index) => (
                    <motion.div 
                      key={index}
                      className={`absolute ${pet.position} text-4xl opacity-20 pointer-events-none`}
                      animate={{
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.2, 1],
                        y: [0, -10, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: pet.delay,
                        ease: "easeInOut"
                      }}
                    >
                      {pet.emoji}
                    </motion.div>
                  ))}
                  
                  <motion.h2 
                    className="text-4xl md:text-5xl font-black text-white mb-6 relative z-10"
                    whileHover={{ scale: 1.02 }}
                  >
                    Ready to Spoil Your Furry Family?
                  </motion.h2>
                  <motion.p 
                    className="text-white/95 text-xl mb-8 max-w-3xl mx-auto relative z-10 leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Join thousands of happy pet parents who trust Pawsome for premium care, fast delivery, 
                    and expert advice. Your pet deserves the best - let us help you provide it.
                  </motion.p>
                  
                  <motion.div
                    className="flex flex-col sm:flex-row justify-center gap-4 relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/brands"
                        className="inline-flex items-center bg-white text-sky-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-xl text-lg"
                      >
                        <Shield className="mr-3 h-6 w-6" />
                        <span>Start Shopping Now</span>
                        <ArrowRight className="ml-3 h-6 w-6" />
                      </Link>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/contact"
                        className="inline-flex items-center bg-white/20 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/30 transition-all duration-300 shadow-xl text-lg border border-white/30"
                      >
                        <Heart className="mr-3 h-6 w-6" />
                        <span>Get Expert Advice</span>
                      </Link>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="mt-8 text-white/90 text-sm relative z-10"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    ✨ Free shipping on orders over Rs. 2,000 | 24/7 customer support | 100% satisfaction guarantee
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Home;