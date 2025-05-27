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
        <div className={`relative bg-gradient-to-br ${button.color} rounded-3xl p-8 text-white shadow-2xl overflow-hidden transform-gpu perspective-1000`}>
          {/* Animated Pet Paw Prints Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white text-xl"
                style={{
                  left: `${10 + (i % 4) * 25}%`,
                  top: `${10 + Math.floor(i / 4) * 25}%`,
                }}
                animate={{
                  opacity: [0.05, 0.3, 0.05],
                  scale: [0.8, 1.3, 0.8],
                  rotate: [0, 15, -15, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut"
                }}
              >
                🐾
              </motion.div>
            ))}
          </div>
          
          {/* Floating Pet Friend */}
          <div className="absolute top-4 right-4 opacity-25 pointer-events-none">
            <motion.div
              className="text-5xl"
              animate={{
                rotate: [0, 20, -20, 0],
                scale: [1, 1.2, 1],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {button.petEmoji}
            </motion.div>
          </div>
          
          {/* Enhanced Content */}
          <div className="relative z-20">
            {/* Icon with Advanced Glow Effect */}
            <motion.div
              className="flex justify-center mb-8"
              whileHover={{ 
                rotate: [0, -10, 10, 0],
                scale: [1, 1.25, 1.2, 1.25],
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <div className="relative">
                {/* Multi-layered glow effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-yellow-300/60 to-orange-300/60 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ transform: 'scale(250%)' }}
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-white/40 to-yellow-200/40 rounded-full blur-xl"
                  animate={{
                    scale: [1.2, 1.6, 1.2],
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  style={{ transform: 'scale(180%)' }}
                />
                
                <div className="relative bg-white/30 p-8 rounded-3xl backdrop-blur-md border border-white/40 shadow-2xl">
                  <IconComponent className="h-20 w-20 relative z-10" />
                  
                  {/* Interactive sparkles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                        style={{
                          left: `${15 + Math.random() * 70}%`,
                          top: `${15 + Math.random() * 70}%`,
                        }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.25,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Enhanced Text Content */}
            <div className="text-center relative z-10">
              <motion.h3 
                className="text-4xl font-bold mb-6 leading-tight"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {button.title}
              </motion.h3>
              <motion.p 
                className="text-white/95 mb-10 text-lg leading-relaxed"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {button.description}
              </motion.p>
              
              {/* Enhanced CTA Button */}
              <motion.div
                className="flex justify-center"
                whileHover={{ 
                  x: 12,
                  scale: 1.08 
                }}
                transition={{ type: "spring", stiffness: 600, damping: 20 }}
              >
                <div className="flex items-center space-x-4 bg-white/35 px-10 py-5 rounded-3xl backdrop-blur-lg border border-white/50 shadow-xl">
                  <motion.span 
                    className="font-bold text-xl"
                    animate={{
                      color: ['#ffffff', '#fef3c7', '#ffffff']
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  >
                    Explore
                  </motion.span>
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="h-6 w-6" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10 pointer-events-none" />
        </div>
      </Link>
    </div>
  );
};

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  
  // Refs for scroll animations
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const featuresRef = useRef(null);
  
  // In View Detection
  const heroInView = useInView(heroRef, { once: true });
  const cardsInView = useInView(cardsRef, { once: true, threshold: 0.1 });
  const featuresInView = useInView(featuresRef, { once: true, threshold: 0.1 });

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

  // Loading sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Hero section animations
  useEffect(() => {
    if (heroInView) {
      gsap.timeline()
        .fromTo('.hero-title', 
          { y: 120, opacity: 0, scale: 0.7, rotationY: 45 },
          { y: 0, opacity: 1, scale: 1, rotationY: 0, duration: 1.5, ease: "power4.out" }
        )
        .fromTo('.hero-subtitle', 
          { y: 80, opacity: 0, scale: 0.8 },
          { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
          "-=0.8"
        )
        .fromTo('.hero-paws', 
          { scale: 0, rotation: -360, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: "back.out(2)" },
          "-=0.6"
        );
    }
  }, [heroInView]);

  return (
    <>
      {isLoading && <Loading3D />}
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-sky-50 to-amber-50 relative overflow-hidden">
        {/* Enhanced Particle Effects */}
        <EnhancedParticleSystem intensity={1.5} mouseInteractive={true} />
        <MouseTrailEffect />
        
        {/* Advanced 3D Background */}
        <div className="fixed inset-0 -z-10 opacity-90">
          <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
            <Suspense fallback={null}>
              <Advanced3DBackground />
              <Environment preset="sunset" />
              <OrbitControls 
                enableZoom={false} 
                enablePan={false} 
                autoRotate 
                autoRotateSpeed={0.3}
                maxPolarAngle={Math.PI / 2.2}
                minPolarAngle={Math.PI / 2.8}
              />
            </Suspense>
          </Canvas>
        </div>

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
                    initial={{ opacity: 0, y: 100, scale: 0.8 }}
                    animate={featuresInView ? { 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: { 
                        duration: 1.2, 
                        delay: index * 0.3,
                        ease: "back.out(1.7)"
                      }
                    } : {}}
                  >
                    <div className="bg-white rounded-3xl p-10 text-center shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-110 hover:-translate-y-6 border border-gray-100 relative overflow-hidden">
                      {/* Enhanced Background Effect */}
                      <div 
                        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 rounded-3xl bg-gradient-to-r ${feature.color} pointer-events-none`}
                      ></div>
                      
                      {/* Benefit Badge */}
                      <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                        {feature.benefit}
                      </div>
                      
                      {/* Enhanced Icon with Multi-layer Glow */}
                      <motion.div 
                        className="text-7xl mb-8 relative z-10"
                        whileHover={{ 
                          scale: 1.4,
                          rotate: [0, -20, 20, 0],
                        }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      >
                        <div className="relative">
                          {/* Triple-layer glow effect */}
                          <motion.div
                            className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-full blur-3xl opacity-20`}
                            animate={{
                              scale: [1, 1.4, 1],
                              opacity: [0.2, 0.5, 0.2],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                          <motion.div
                            className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-full blur-xl opacity-30`}
                            animate={{
                              scale: [1.2, 1.6, 1.2],
                              opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.5
                            }}
                          />
                          <span className="relative z-10">{feature.emoji}</span>
                        </div>
                      </motion.div>
                      
                      <h3 className="text-3xl font-bold text-gray-800 mb-6 relative z-10">{feature.title}</h3>
                      <p className="text-gray-600 text-lg leading-relaxed relative z-10">{feature.desc}</p>
                      
                      {/* Interactive hover sparkles */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                            style={{
                              left: `${15 + Math.random() * 70}%`,
                              top: `${15 + Math.random() * 70}%`,
                            }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0, 1.5, 0],
                              rotate: [0, 180, 360],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: i * 0.15,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Enhanced Call to Action */}
          <section className="py-24 px-4 relative z-30">
            <div className="container mx-auto max-w-6xl text-center">
              <motion.div
                className="relative"
                whileInView={{ 
                  scale: [0.9, 1.03, 1],
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 rounded-3xl p-16 shadow-3xl relative overflow-hidden">
                  {/* Enhanced Pet elements decoration with 3D effect */}
                  {[
                    { emoji: '🐕', position: 'top-8 left-8', delay: 0 },
                    { emoji: '🐱', position: 'top-8 right-8', delay: 0.5 },
                    { emoji: '🐦', position: 'bottom-8 left-8', delay: 1 },
                    { emoji: '🐰', position: 'bottom-8 right-8', delay: 1.5 },
                  ].map((pet, index) => (
                    <motion.div 
                      key={index}
                      className={`absolute ${pet.position} text-6xl opacity-15 pointer-events-none`}
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.3, 1],
                        y: [0, -20, 0],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        delay: pet.delay,
                        ease: "linear"
                      }}
                    >
                      {pet.emoji}
                    </motion.div>
                  ))}
                  
                  <motion.h2 
                    className="text-5xl md:text-6xl font-bold text-white mb-8 relative z-10"
                    whileHover={{ scale: 1.05 }}
                  >
                    Ready to Spoil Your Furry Family?
                  </motion.h2>
                  <motion.p 
                    className="text-white/95 text-2xl mb-12 max-w-4xl mx-auto relative z-10 leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Join thousands of happy pet parents who trust Pawsome for premium care. 
                    Start your journey today and give your pets the love they deserve!
                  </motion.p>
                  
                  <motion.div
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/brands"
                        className="inline-flex items-center bg-white text-amber-600 font-bold px-12 py-6 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-2xl text-xl"
                      >
                        <motion.span
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                          className="mr-4 text-3xl"
                        >
                          🐾
                        </motion.span>
                        <span>Start Shopping</span>
                        <motion.div
                          className="ml-4"
                          animate={{ x: [0, 10, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="h-7 w-7" />
                        </motion.div>
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