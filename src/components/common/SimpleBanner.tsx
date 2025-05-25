import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SimpleBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "PET DAY SALE",
      discount: "UP TO 50%",
      bgColor: "bg-gradient-to-r from-cyan-400 to-blue-500"
    },
    {
      title: "PREMIUM CARE", 
      discount: "UP TO 30%",
      bgColor: "bg-gradient-to-r from-purple-400 to-pink-500"
    },
    {
      title: "VET SPECIAL",
      discount: "UP TO 40%", 
      bgColor: "bg-gradient-to-r from-green-400 to-emerald-500"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-2xl shadow-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 ${slides[currentSlide].bgColor} flex items-center justify-center`}
        >
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              {slides[currentSlide].title}
            </h2>
            <div className="bg-orange-500 px-6 py-3 rounded-full text-xl font-bold">
              {slides[currentSlide].discount}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SimpleBanner;