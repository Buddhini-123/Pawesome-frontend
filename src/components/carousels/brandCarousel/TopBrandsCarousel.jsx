import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * TopBrandsCarousel.jsx
 * "Top Brands we collaborate with" horizontal logo carousel
 */
const brands = [
  { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDYcdtf-UkHe5BLHCs1zkNk6IS2o_IImonfA&s',    alt: 'Dogs Supply',   link: '#' },
  { image: 'https://images-platform.99static.com//_r1ST2F89Q03J1x03XvhHEnFax4=/0x0:1000x1000/fit-in/500x500/99designs-contests-attachments/115/115076/attachment_115076893',alt: 'Brisbane Bakery', link: '#' },
  { image: 'https://img.freepik.com/free-vector/healthy-pets-food-graphic-design_24908-54877.jpg?semt=ais_hybrid&w=740',    alt: 'Organic Pet',   link: '#' },
  { image: '/logos/pet-care.png',       alt: 'Pet Care',      link: '#' },
  { image: '/logos/ouse.png',           alt: 'Ouse',          link: '#' },
  { image: '/logos/brisbane-bakery.png',alt: 'Brisbane Bakery', link: '#' },
  { image: '/logos/organic-pet.png',    alt: 'Organic Pet',   link: '#' },
  { image: '/logos/pet-care.png',       alt: 'Pet Care',      link: '#' },
  { image: '/logos/ouse.png',           alt: 'Ouse',          link: '#' },
  { image: '/logos/brisbane-bakery.png',alt: 'Brisbane Bakery', link: '#' },
//   { image: '/logos/organic-pet.png',    alt: 'Organic Pet',   link: '#' },
//   { image: '/logos/pet-care.png',       alt: 'Pet Care',      link: '#' },
//   { image: '/logos/ouse.png',           alt: 'Ouse',          link: '#' },
//   { image: '/logos/brisbane-bakery.png',alt: 'Brisbane Bakery', link: '#' },
//   { image: '/logos/organic-pet.png',    alt: 'Organic Pet',   link: '#' },
//   { image: '/logos/pet-care.png',       alt: 'Pet Care',      link: '#' },
//   { image: '/logos/ouse.png',           alt: 'Ouse',          link: '#' },
  // repeat or add more
];

const TopBrandsCarousel = () => {
  const carouselRef = useRef(null);
  const scroll = offset => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-natural-sage rounded-2xl p-6 md:p-8">
      <h2 className="text-lg md:text-xl font-semibold text-white mb-6" style={{ textAlign: 'left' }}>
        Top Brands we collaborate with:
      </h2>
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll(-200)}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow z-10"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* Logo Track */}
        <div
          ref={carouselRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide py-4"
          style={{ scrollSnapType: 'x mandatory', paddingLeft: '4rem', paddingRight: '4rem' }}
        >
          {brands.map((brand, idx) => (
            <a
              key={idx}
              href={brand.link}
              className="flex-shrink-0 scroll-snap-start bg-white  rounded-md flex items-center justify-center"
              style={{ width: '6rem', height: '6rem' }}
              aria-label={brand.alt}
            >
              <img
                src={brand.image}
                alt={brand.alt}
                className="max-w-full max-h-full object-contain"
              />
            </a>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll(200)}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow z-10"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </section>
  );
};

export default TopBrandsCarousel;
