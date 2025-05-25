import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import categoriesData from '../../../../data/categoriesData.json';

const PetCategories: React.FC = () => {
  const { categories } = categoriesData;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Buy for your pet
        </motion.h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={category.link}>
                <div className={`${category.backgroundColor} rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300`}>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-32 md:h-40 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PetCategories;