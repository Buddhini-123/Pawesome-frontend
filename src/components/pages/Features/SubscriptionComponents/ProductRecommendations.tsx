import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import ProductCard from './ProductCard';
import productsData from '../../../../data/productsData.json';

const ProductRecommendations: React.FC = () => {
  const { recommendations } = productsData;

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="bg-orange-400 rounded-2xl p-6 md:p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-8">
            <Flame className="w-6 h-6 text-white mr-2" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Top Recommendations
            </h2>
            <Flame className="w-6 h-6 text-white ml-2" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {recommendations.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductRecommendations;