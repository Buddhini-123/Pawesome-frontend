import React from 'react';
import { motion } from 'framer-motion';
import brandsData from '../../../../data/brandsData.json';

const BrandPartners: React.FC = () => {
  const { brands } = brandsData;

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="bg-green-400 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
            Top Brands we collaborate with:
          </h2>
          
          <div className="grid grid-cols-5 md:grid-cols-10 gap-4 items-center">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.id}
                className="bg-white rounded-lg p-3 flex items-center justify-center h-16"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandPartners;