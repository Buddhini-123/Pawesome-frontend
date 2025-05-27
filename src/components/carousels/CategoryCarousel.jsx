import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dog from './images/dog.png'
import cat from './images/cat.png'
import bird from './images/bird.png'
import rodent from './images/rodent.png'

/**
 * CategoryCarousel.jsx
 * A fixed four-category carousel with exact layout and correct background colors.
 */
const categories = [
  { bgClass: 'bg-soft-yellow', image: dog, alt: 'Dog', route: '/dogs', top: '7px' },
  { bgClass: 'bg-periwinkle', image: cat, alt: 'Cat', route: '/cats', top: '-68px' },
  { bgClass: 'bg-calm-blue', image: bird, alt: 'Bird', route: '/birds', top: '-10px' },
  { bgClass: 'bg-light-gray', image: rodent, alt: 'Small Pet', route: '/other-animals', top: '-55px' },

];

const CategoryCarousel = () => {
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (offset) => {
    carouselRef.current?.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <div className="relative" style={{ marginTop: '20px', marginBottom: '20px' }}>
      {/* Left arrow */}
      {/* <button
        onClick={() => scroll(-300)}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 p-2 rounded-full shadow z-10"
        >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button> */}

      {/* Carousel track */}
      {/* <h2 className=''>Buy for your pet</h2> */}
      <div style={{ paddingLeft:30 }}>
        <h1 className='text-2xl font-bold mb-4' style={{ textAlign: 'left' }}>Buy for your pet</h1>
      </div>
      <div
        ref={carouselRef}
        className="flex space-x-4 overflow-x-auto overflow-y-hidden scrollbar-hide px-8 py-6"
        style={{ scrollSnapType: 'x mandatory', }}
      >

        {categories.map((cat, idx) => (
          <div>

          <div
            key={idx}
            onClick={() => navigate(cat.route)}
            className={`relative flex-shrink-0 w-48 h-32 rounded-lg cursor-pointer ${cat.bgClass}`}
            style={{ scrollSnapAlign: 'start', borderRadius: '0.5rem', minWidth: 298, minHeight: 158 }}
          >
            {/* Pet image overlapping the colored background */}
            <img
              src={cat.image}
              alt={cat.alt}
              className="absolute left-1/2 transform -translate-x-1/2"
              style={{ position: 'absolute', top: `${cat.top}` }}
            />
          </div>
           <div>
            <h3 className="text-center text-lg font-semibold text-gray-800 mt-4">
              {cat.alt}
            </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Right arrow */}
      {/* <button
        onClick={() => scroll(300)}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 p-2 rounded-full shadow z-10"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button> */}
    </div>
  );
};

export default CategoryCarousel;
