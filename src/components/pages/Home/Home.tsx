import React, { useEffect, useRef, Suspense, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Link } from 'react-router-dom';
import { Calendar, Gift, Percent, CreditCard, ArrowRight } from 'lucide-react';
import gsap from 'gsap';

// Enhanced Effects
import EnhancedParticleSystem from '../../effects/EnhancedParticleSystem.tsx';
import MouseTrailEffect from '../../effects/MouseTrailEffect.tsx';
import Loading3D from '../../effects/Loading3D.tsx';
import Advanced3DBackground from '../../effects/Advanced3DBackground.tsx';

// Enhanced Interactive Card Component
const InteractiveCard = ({ button, index, inView }) => {
  const cardRef = useRef();
  const IconComponent = button.icon;
  
  useEffect(() => {
    if (inView && cardRef.current) {
      gsap.fromTo(cardRef.current, 
        { 
          y: 100, 
          opacity: 0, 
          scale: 0.8,
          rotationY: 30
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          rotationY: 0,
          duration: 1,
          delay: index * 0.2,
          ease: "back.out(1.7)"
        }
      );
    }
  }, [inView, index]);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      scale: 1.08,
      y: -25,
      rotationY: 8,
      duration: 0.5,
      ease: "power3.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      y: 0,
      rotationY: 0,
      duration: 0.5,
      ease: "power3.out"
    });
  };

  return (
    <div
      ref={cardRef}
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={button.link} className="block">
        <div className={`relative bg-gradient-to-br ${button.color} rounded-3xl p-8 text-white shadow-xl overflow-hidden`}>
          
          {/* Simplified floating pet */}
          <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
            <motion.div
              className="text-4xl"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {button.petEmoji}
            </motion.div>
          </div>
          
          {/* Simplified content */}
          <div className="relative z-20">
            {/* Icon with reduced glow effect */}
            <motion.div
              className="flex justify-center mb-8"
              whileHover={{ 
                scale: 1.1,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative bg-white/25 p-6 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg">
                <IconComponent className="h-16 w-16 relative z-10" />
              </div>
            </motion.div>
            
            {/* Simplified text content */}
            <div className="text-center relative z-10">
              <h3 className="text-3xl font-bold mb-4 leading-tight">
                {button.title}
              </h3>
              <p className="text-white/90 mb-8 text-base leading-relaxed">
                {button.description}
              </p>
              
              {/* Simplified CTA Button */}
              <motion.div
                className="flex justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="flex items-center space-x-3 bg-white/25 px-8 py-4 rounded-2xl backdrop-blur-sm border border-white/40 shadow-lg">
                  <span className="font-bold text-lg">Explore</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [performanceMode, setPerformanceMode] = useState('auto');
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']); // Reduced parallax intensity
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  
  // Refs for scroll animations
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const featuresRef = useRef(null);
  
  // In View Detection
  const heroInView = useInView(heroRef, { once: true });
  const cardsInView = useInView(cardsRef, { once: true, threshold: 0.1 });
  const featuresInView = useInView(featuresRef, { once: true, threshold: 0.1 });

  // Detect device performance and adjust settings
  useEffect(() => {
    const detectPerformance = () => {
      const isMobile = window.innerWidth < 768;
      const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
      const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
      
      if (isMobile || isLowEnd || hasLowMemory) {
        setPerformanceMode('low');
      } else if (navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 8) {
        setPerformanceMode('high');
      } else {
        setPerformanceMode('medium');
      }
    };

    detectPerformance();
  }, []);

  // Pet-themed main service buttons
  const mainButtons = [
    {
      title: 'Pet Subscriptions',
      description: 'Never run out of your pet\'s favorites with smart, personalized deliveries tailored to your pet\'s unique needs and preferences.',
      icon: Calendar,
      color: 'from-amber-400 via-amber-500 to-yellow-600',
      link: '/subscriptions',
      petEmoji: '🐕'
    },
    {
      title: 'Surprise Gift Boxes',
      description: 'Curated monthly surprise boxes filled with premium toys, treats, and accessories that will make your pet\'s tail wag with joy.',
      icon: Gift,
      color: 'from-sky-400 via-sky-500 to-blue-600',
      link: '/gifts',
      petEmoji: '🐱'
    },
    {
      title: 'Daily Deals',
      description: 'Exclusive discounts on top-rated pet products, premium food, and veterinary care services for smart pet parents.',
      icon: Percent,
      color: 'from-emerald-400 via-emerald-500 to-green-600',
      link: '/deals',
      petEmoji: '🐦'
    },
    {
      title: 'Paw Rewards',
      description: 'Earn points with every purchase, unlock exclusive benefits, and get VIP access to new products before anyone else.',
      icon: CreditCard,
      color: 'from-purple-400 via-purple-500 to-indigo-600',
      link: '/loyalty-cards',
      petEmoji: '🐰'
    }
  ];

  // Loading sequence - reduced time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Reduced from 3000 to 1500ms
    return () => clearTimeout(timer);
  }, []);

  // Simplified hero section animations
  useEffect(() => {
    if (heroInView && performanceMode !== 'low') {
      gsap.timeline()
        .fromTo('.hero-title', 
          { y: 60, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
        )
        .fromTo('.hero-subtitle', 
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.5"
        )
        .fromTo('.hero-paws', 
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.2)" },
          "-=0.4"
        );
    }
  }, [heroInView, performanceMode]);

  return (
    <>
      {isLoading && <Loading3D />}
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-sky-50 to-amber-50 relative overflow-hidden">
        {/* Performance-adjusted effects */}
        {performanceMode !== 'low' && (
          <>
            <EnhancedParticleSystem 
              intensity={performanceMode === 'high' ? 0.8 : 0.3} 
              mouseInteractive={performanceMode === 'high'} 
            />
            {performanceMode === 'high' && <MouseTrailEffect />}
          </>
        )}
        
        {/* 3D Background - conditionally rendered */}
        {performanceMode !== 'low' && (
          <div className="fixed inset-0 -z-10 opacity-70">
            <Canvas 
              camera={{ position: [0, 0, 12], fov: 50 }} // Reduced FOV and distance
              performance={{ min: 0.5 }} // Add performance management
            >
              <Suspense fallback={null}>
                <Advanced3DBackground />
                <Environment preset="sunset" />
                <OrbitControls 
                  enableZoom={false} 
                  enablePan={false} 
                  autoRotate={performanceMode === 'high'} 
                  autoRotateSpeed={0.2} // Slower rotation
                  maxPolarAngle={Math.PI / 2.2}
                  minPolarAngle={Math.PI / 2.8}
                />
              </Suspense>
            </Canvas>
          </div>
        )}

        {/* Animated Background Layers */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-amber-100/40 via-sky-100/30 to-yellow-100/40 pointer-events-none -z-20"
          style={{ y, opacity }}
        />

        {/* Content Sections */}
        <div className="relative z-20">
          {/* Enhanced Hero Section */}
          <motion.section 
            ref={heroRef}
            className="min-h-screen flex items-center justify-center px-4 relative z-30"
          >
            <div className="text-center max-w-7xl mx-auto">
              {/* Enhanced Pet Paws with Advanced Effects */}
              <div className="hero-paws flex justify-center items-center mb-10">
                <motion.div
                  animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-amber-500 mr-8 text-8xl relative"
                  style={{
                    filter: 'drop-shadow(0 0 30px rgba(245, 158, 11, 0.6))',
                  }}
                >
                  🐾
                </motion.div>
                
                <motion.h1 
                  className="hero-title text-8xl md:text-9xl lg:text-[12rem] font-bold bg-gradient-to-r from-amber-600 via-sky-600 to-amber-600 bg-clip-text text-transparent relative"
                  whileHover={{ 
                    scale: 1.05,
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                  style={{
                    textShadow: '0 0 60px rgba(14, 165, 233, 0.4)',
                  }}
                >
                  Pawsome
                </motion.h1>
                
                <motion.div
                  animate={{
                    rotate: [0, -15, 15, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    delay: 2.5,
                    ease: "easeInOut"
                  }}
                  className="text-sky-500 ml-8 text-8xl relative"
                  style={{
                    filter: 'drop-shadow(0 0 30px rgba(14, 165, 233, 0.6))',
                  }}
                >
                  🐾
                </motion.div>
              </div>
              
              <motion.p
                className="hero-subtitle text-3xl md:text-4xl text-gray-700 max-w-6xl mx-auto leading-relaxed mb-16"
                style={{
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                }}
              >
                Your trusted partner in pet care excellence. 
                <span className="bg-gradient-to-r from-amber-600 to-sky-600 bg-clip-text text-transparent font-bold">
                  {" "}Every tail deserves the best{" "}
                </span>
                – from premium nutrition to endless love and care.
              </motion.p>

              {/* Floating Pet Companions */}
              <motion.div
                className="absolute bottom-16 left-1/2 transform -translate-x-1/2 pointer-events-none"
                animate={{ 
                  y: [0, 25, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="text-6xl">🐕‍🦺</div>
              </motion.div>
            </div>
          </motion.section>

          {/* Enhanced Main Service Cards */}
          <section ref={cardsRef} className="py-24 px-4 relative bg-white/95 backdrop-blur-lg z-30">
            <div className="container mx-auto max-w-7xl">
              <motion.div
                className="text-center mb-20"
                initial={{ opacity: 0, y: 50 }}
                animate={cardsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1 }}
              >
                <h2 className="text-6xl font-bold text-gray-800 mb-8">
                  Choose Your Pet Care Adventure
                </h2>
                <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Discover tailored solutions for every pet's unique needs and personality. 
                  Experience the joy of premium pet care made simple.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {mainButtons.map((button, index) => (
                  <InteractiveCard
                    key={button.title}
                    button={button}
                    index={index}
                    inView={cardsInView}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Enhanced Pet Care Features */}
          <section ref={featuresRef} className="py-24 px-4 relative z-30">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                className="text-center mb-20"
                initial={{ opacity: 0, y: 50 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1 }}
              >
                <h2 className="text-5xl font-bold text-gray-800 mb-6">
                  Why Pet Parents Choose Pawsome
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Experience the difference that premium care and genuine love makes for your furry family members
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  { 
                    emoji: '🚚', 
                    title: 'Lightning Fast Delivery', 
                    desc: 'Free same-day delivery on orders above Rs. 2,000. Your pets never have to wait for their favorites!',
                    color: 'from-amber-400 to-yellow-500',
                    benefit: 'Save Time'
                  },
                  { 
                    emoji: '⭐', 
                    title: 'Premium Quality Guaranteed', 
                    desc: 'Hand-picked products from trusted brands worldwide. 100% satisfaction or your money back, always.',
                    color: 'from-sky-400 to-blue-500',
                    benefit: 'Best Quality'
                  },
                  { 
                    emoji: '🏥', 
                    title: '24/7 Pet Care Support', 
                    desc: 'Expert veterinary advice, emergency care guidance, and personalized nutrition consultations anytime.',
                    color: 'from-emerald-400 to-green-500',
                    benefit: 'Expert Care'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="relative group"
                    initial={{ opacity: 0, y: 50 }}
                    animate={featuresInView ? { 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        duration: 0.8, 
                        delay: index * 0.2
                      }
                    } : {}}
                  >
                    <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                      
                      {/* Benefit Badge */}
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                        {feature.benefit}
                      </div>
                      
                      {/* Simplified Icon */}
                      <motion.div 
                        className="text-5xl mb-6 relative z-10"
                        whileHover={{ 
                          scale: 1.2,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {feature.emoji}
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold text-gray-800 mb-4 relative z-10">{feature.title}</h3>
                      <p className="text-gray-600 text-base leading-relaxed relative z-10">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Simplified Call to Action */}
          <section className="py-20 px-4 relative z-30">
            <div className="container mx-auto max-w-5xl text-center">
              <motion.div
                className="relative"
                whileInView={{ 
                  scale: [0.95, 1],
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 rounded-2xl p-12 shadow-2xl relative overflow-hidden">
                  
                  {/* Simplified pet elements decoration */}
                  {[
                    { emoji: '🐕', position: 'top-6 left-6' },
                    { emoji: '🐱', position: 'top-6 right-6' },
                    { emoji: '🐦', position: 'bottom-6 left-6' },
                    { emoji: '🐰', position: 'bottom-6 right-6' },
                  ].map((pet, index) => (
                    <motion.div 
                      key={index}
                      className={`absolute ${pet.position} text-4xl opacity-10 pointer-events-none`}
                      animate={{
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: index * 0.5,
                        ease: "easeInOut"
                      }}
                    >
                      {pet.emoji}
                    </motion.div>
                  ))}
                  
                  <motion.h2 
                    className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10"
                    whileHover={{ scale: 1.02 }}
                  >
                    Ready to Spoil Your Furry Family?
                  </motion.h2>
                  <motion.p 
                    className="text-white/95 text-xl mb-10 max-w-3xl mx-auto relative z-10 leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Join thousands of happy pet parents who trust Pawsome for premium care.
                  </motion.p>
                  
                  <motion.div
                    className="flex justify-center relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/brands"
                        className="inline-flex items-center bg-white text-amber-600 font-bold px-10 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-xl text-lg"
                      >
                        <span className="mr-3 text-2xl">🐾</span>
                        <span>Start Shopping</span>
                        <ArrowRight className="ml-3 h-6 w-6" />
                      </Link>
                    </motion.div>
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