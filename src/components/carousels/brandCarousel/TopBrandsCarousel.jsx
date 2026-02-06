import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { api, host } from '../../../services/api';


const TopBrandsCarousel = () => {
  const carouselRef = useRef(null);
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await api.get('/brands');
        const data = res.data.data.map((b) => ({
          id: b.id,
          name: b.name,
          logo: b.logo ? `${host}/storage/${b.logo}` : '/placeholder.png',
          link: '#', // You can replace with actual brand link if exists
        }));
        setBrands(data);
      } catch (err) {
        console.error('Failed to fetch brands:', err);
      }
    };

    fetchBrands();
  }, []);
  const scroll = offset => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-mint-green rounded-2xl p-6 md:p-8">
      <h2 className="text-lg md:text-xl font-fredoka font-semibold text-white mb-6" style={{ textAlign: 'left' }}>
        Top Brands we collaborate with:
      </h2>
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll(-200)}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow z-10"
        >
          <ChevronLeft className="w-5 h-5 text-charcoal" />
        </button>

        {/* Logo Track */}
        <div
          ref={carouselRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide py-4"
          style={{ scrollSnapType: 'x mandatory', paddingLeft: '4rem', paddingRight: '4rem' }}
        >
          {brands.map((brand) => (
            <a
              key={brand.id}
              href={brand.link}
              className="flex-shrink-0 scroll-snap-start bg-white rounded-md flex items-center justify-center"
              style={{ width: '6rem', height: '6rem' }}
              aria-label={brand.name}
            >
              <img
                src={brand.logo}
                alt={brand.name}
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
          <ChevronRight className="w-5 h-5 text-charcoal" />
        </button>
      </div>
    </section>
  );
};

export default TopBrandsCarousel;
