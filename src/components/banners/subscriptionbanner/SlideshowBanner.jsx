import React, { useState, useEffect, useCallback } from 'react';

/**
 * Dynamic Slideshow Banner Component
 * Props:
 * - slides: Array of slide objects { image, title, subtitle, cta, onClick }
 * - autoPlay: boolean (default: true)
 * - interval: number in ms between slides (default: 5000)
 */

const SlideshowBanner = ({ slides, autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, nextSlide, interval]);

  return (
    <div className="relative w-full overflow-hidden" style={{ borderRadius: '20px' }}>
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0 relative">
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            {/* Overlay Content */}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-start p-6 md:p-12 text-white">
              <h2 className="text-2xl md:text-4xl font-bold mb-2">{slide.title}</h2>
              <p className="text-sm md:text-lg mb-4">{slide.subtitle}</p>
              {slide.cta && (
                <button
                  onClick={slide.onClick}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded"
                >
                  {slide.cta}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full focus:outline-none"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full focus:outline-none"
      >
        ›
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={
              `w-3 h-3 rounded-full focus:outline-none transition-colors ` +
              (idx === currentIndex
                ? 'bg-orange-500'
                : 'bg-white bg-opacity-50 hover:bg-opacity-75')
            }
          />
        ))}
      </div>
    </div>
  );
};

export default SlideshowBanner;

// Usage Example in SubscriptionPage:
// import SlideshowBanner from './SlideshowBanner';
//
// const subscriptionSlides = [
//   {
//     image: '/images/pet-day-sale.jpg',
//     title: 'PET DAY SALE',
//     subtitle: 'Up to 50% off on all subscriptions',
//     cta: 'Subscribe Now',
//     onClick: () => console.log('Slide 1 CTA clicked'),
//   },
//   // ...other slides
// ];
//
// const SubscriptionPage = () => (
//   <div className="container mx-auto px-4 py-8">
//     <SlideshowBanner slides={subscriptionSlides} autoPlay interval={6000} />
//     {/* Other subscription page content */}
//   </div>
// );
