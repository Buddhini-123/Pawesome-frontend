import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {api, host} from "../../services/api"

const CategoryCarousel = () => {
  const [categories, setCategories] = useState([]);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categories")
      .then(res => {
        setCategories(res.data.data); 
      })
      .catch(err => {
        console.error('Failed to load categories', err);
      });
  }, []);

  const scroll = (offset) => {
    carouselRef.current?.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <div className="relative mt-5 mb-5">
      <div className="pl-8">
        <h1 className="text-2xl font-fredoka font-bold mb-4 text-left">
          Buy for your pet
        </h1>
      </div>

      <div
        ref={carouselRef}
        className="flex space-x-4 overflow-x-auto overflow-y-hidden scrollbar-hide px-8 py-6"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {categories.map((cat) => (
          <div key={cat.id}>
            <div
              onClick={() => navigate(`/products/category/${cat.id}/${cat.slug}`)}
              className="relative flex-shrink-0 w-48 h-32 rounded-lg cursor-pointer bg-gradient-to-br from-periwinkle to-off-white"
              style={{ scrollSnapAlign: 'start', borderRadius: '0.5rem', minWidth: 298, minHeight: 158, }}
            >
              <img
                src={
                              cat.image
                                ? `${host}/storage/${cat.image}`
                                : '/placeholder.png'
                            }
                alt={cat.name}
                className="absolute left-1/2 transform -translate-x-1/2 object-contain w-40 h-40"
                style={{ position: 'absolute', top: `${cat.top}` }}
              />
            </div>
            <h3 className="text-center text-lg font-fredoka font-semibold text-charcoal mt-4">
              {cat.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCarousel;
