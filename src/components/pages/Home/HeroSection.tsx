import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Star } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [currentPet, setCurrentPet] = useState(0);
  
  const pets = [
    { emoji: '🐕', name: 'Dogs' },
    { emoji: '🐱', name: 'Cats' },
    { emoji: '🐦', name: 'Birds' },
    { emoji: '🐰', name: 'Rabbits' },
    { emoji: '🐹', name: 'Hamsters' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPet((prev) => (prev + 1) % pets.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-primary-blue">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        {/* Floating Paws */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 40 + 20}px`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          >
            <span>🐾</span>
          </motion.div>
        ))}

        {/* Animated Shapes */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-sunny-yellow/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary-blue/20 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Pet Category Switcher */}
            <motion.div 
              className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-white font-nunito">Shop for</span>
              <motion.span
                key={currentPet}
                className="text-2xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                {pets[currentPet].emoji}
              </motion.span>
              <span className="text-white font-fredoka font-semibold">
                {pets[currentPet].name}
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              className="text-5xl md:text-7xl font-fredoka font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Everything Your
              <span className="block text-sunny-yellow drop-shadow-lg">
                Pet Needs
              </span>
              Delivered With 
              <span className="text-warm-white"> Love </span>
              <Heart className="inline-block w-12 h-12 text-soft-pink animate-pulse ml-2" />
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-xl text-white/90 mb-8 font-nunito leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              From premium food to exciting toys, discover 10,000+ products 
              for your furry, feathered, and scaly friends. 
              <span className="block mt-2">
                🎉 <strong>New customers get 20% off!</strong>
              </span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 bg-white text-primary-blue px-8 py-4 rounded-full font-fredoka font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Shop Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              
              <Link
                to="/subscriptions"
                className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md text-white border-2 border-white/50 px-8 py-4 rounded-full font-fredoka font-semibold text-lg hover:bg-white/30 transition-all duration-300"
              >
                <span className="text-xl">🐾</span>
                Start Subscription
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="flex items-center gap-6 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/40?img=${i}`}
                      alt="Customer"
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-white/90 font-nunito">
                  <strong>50,000+</strong> Happy Pets
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-sunny-yellow text-sunny-yellow" />
                ))}
                <span className="text-white/90 font-nunito ml-2">
                  <strong>4.9</strong> Rating
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Animated Pet Showcase */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Main Pet Image Container */}
            <div className="relative">
              {/* Blob Background */}
              <motion.div
                className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-full"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  filter: 'blur(40px)',
                }}
              />
              
              {/* Pet Image */}
              <motion.div
                className="relative z-10 text-center"
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="text-[300px] md:text-[400px] select-none filter drop-shadow-2xl">
                  {pets[currentPet].emoji}
                </span>
              </motion.div>

              {/* Floating Product Cards */}
              <motion.div
                className="absolute top-10 -left-10 bg-white rounded-2xl p-4 shadow-xl"
                animate={{
                  y: [0, -10, 0],
                  rotate: [-5, 5, -5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-soft-pink/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🦴</span>
                  </div>
                  <div>
                    <p className="font-fredoka font-semibold text-charcoal">Premium Treats</p>
                    <p className="text-sm text-medium-gray">Starting ₹299</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-10 -right-10 bg-white rounded-2xl p-4 shadow-xl"
                animate={{
                  y: [0, 10, 0],
                  rotate: [5, -5, 5],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-blue/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎾</span>
                  </div>
                  <div>
                    <p className="font-fredoka font-semibold text-charcoal">Fun Toys</p>
                    <p className="text-sm text-medium-gray">50% Off Today!</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#FFFAF0"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;