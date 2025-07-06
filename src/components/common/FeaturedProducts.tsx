import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';
import ProductCard from './ProductCard';
import { products } from '../../data/mockProducts';

const FeaturedProducts: React.FC = () => {
  // Get a sample of featured products
  const featuredProducts = products.slice(0, 8);

  return (
    <section className="py-20 bg-warm-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-sunny-yellow" />
            <h2 className="text-4xl md:text-5xl font-fredoka font-bold text-charcoal">
              Featured Products
            </h2>
            <Sparkles className="w-8 h-8 text-sunny-yellow" />
          </div>
          <p className="text-xl text-medium-gray font-nunito max-w-2xl mx-auto">
            Handpicked favorites that your pets will absolutely love! 
            <span className="text-vibrant-orange font-semibold"> Updated daily.</span>
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <a
            href="/shop"
            className="inline-flex items-center gap-3 bg-primary-blue hover:bg-vibrant-orange text-white px-8 py-4 rounded-full font-fredoka font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
          >
            <TrendingUp className="w-5 h-5" />
            View All Products
            <span className="text-xl group-hover:translate-x-2 transition-transform duration-300">
              →
            </span>
          </a>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute -z-10 top-20 left-10 w-32 h-32 bg-primary-blue/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -z-10 bottom-20 right-10 w-40 h-40 bg-vibrant-orange/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
    </section>
  );
};

export default FeaturedProducts;