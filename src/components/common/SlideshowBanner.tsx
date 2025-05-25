import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  discount: string;
  description: string;
  backgroundImage: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
}

const SlideshowBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides: BannerSlide[] = [
    {
      id: 1,
      title: "PET DAY",
      subtitle: "SALE",
      discount: "UP TO 50%",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non odio congue tortor lacoreet auctor vitae vel turpis.",
      backgroundImage: "🐕🐱🐦", // Using emojis as placeholders for the pet images
      backgroundColor: "from-cyan-100 via-blue-100 to-sky-200",
      textColor: "text-gray-800",
      buttonColor: "from-orange-400 to-amber-500"
    },
    {
      id: 2,
      title: "PREMIUM",
      subtitle: "CARE",
      discount: "UP TO 30%",
      description: "Give your pets the premium care they deserve with our exclusive subscription plans and professional services.",
      backgroundImage: "🦮👑💎",
      backgroundColor: "from-purple-100 via-pink-100 to-rose-200",
      textColor: "text-gray-800",
      buttonColor: "from-purple-400 to-pink-500"
    },
    {
      id: 3,
      title: "VET",
      subtitle: "SPECIAL",
      discount: "UP TO 40%",
      description: "Professional veterinary services and health checkups for your beloved pets at amazing discounted rates.",
      backgroundImage: "🏥🩺💊",
      backgroundColor: "from-green-100 via-emerald-100 to-teal-200",
      textColor: "text-gray-800",
      buttonColor: "from-green-400 to-emerald-500"
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 3000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 3000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 3000);
  };

  return (
    <div className="relative w-full h-80 md:h-96 lg:h-[500px] overflow-hidden rounded-3xl shadow-2xl mx-4 md:mx-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].backgroundColor}`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 text-6xl opacity-30">🐾</div>
            <div className="absolute top-8 right-8 text-4xl opacity-30">🦴</div>
            <div className="absolute bottom-8 left-8 text-5xl opacity-30">🏠</div>
            <div className="absolute bottom-4 right-4 text-3xl opacity-30">❤️</div>
          </div>

          {/* Main Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left Content */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="space-y-6"
                >
                  <div>
                    <motion.h1
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className={`text-4xl md:text-6xl lg:text-7xl font-black ${slides[currentSlide].textColor} leading-none`}
                    >
                      {slides[currentSlide].title}
                    </motion.h1>
                    <motion.h2
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className={`text-4xl md:text-6xl lg:text-7xl font-black ${slides[currentSlide].textColor} leading-none`}
                    >
                      {slides[currentSlide].subtitle}
                    </motion.h2>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className={`inline-block bg-gradient-to-r ${slides[currentSlide].buttonColor} text-white px-8 py-4 rounded-2xl font-bold text-xl md:text-2xl shadow-lg`}
                  >
                    {slides[currentSlide].discount}
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className={`${slides[currentSlide].textColor} text-sm md:text-base lg:text-lg leading-relaxed max-w-md`}
                  >
                    {slides[currentSlide].description}
                  </motion.p>
                </motion.div>

                {/* Right Content - Pet Illustrations */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: "backOut" }}
                  className="flex justify-center items-center lg:justify-end"
                >
                  <div className="relative">
                    {/* Main Pet Illustration */}
                    <div className="text-8xl md:text-9xl lg:text-[12rem] animate-bounce">
                      {slides[currentSlide].backgroundImage.split('')[0]}
                    </div>
                    
                    {/* Floating Pet Icons */}
                    <motion.div
                      animate={{ 
                        y: [0, -20, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute -top-4 -right-4 text-4xl md:text-5xl"
                    >
                      {slides[currentSlide].backgroundImage.split('')[1]}
                    </motion.div>
                    
                    <motion.div
                      animate={{ 
                        y: [0, 15, 0],
                        rotate: [0, -3, 3, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                      className="absolute -bottom-2 -left-6 text-3xl md:text-4xl"
                    >
                      {slides[currentSlide].backgroundImage.split('')[2]}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125 shadow-lg'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-4 right-4 bg-white/20 backdrop-blur-lg rounded-full p-3 text-white hover:bg-white/30 transition-all duration-300"
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Arrow Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-lg rounded-full p-3 text-white hover:bg-white/30 transition-all duration-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-lg rounded-full p-3 text-white hover:bg-white/30 transition-all duration-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <motion.div
          key={currentSlide}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: "linear" }}
          className={`h-full bg-gradient-to-r ${slides[currentSlide].buttonColor}`}
          style={{ display: isPlaying ? 'block' : 'none' }}
        />
      </div>
    </div>
  );
};

export default SlideshowBanner;