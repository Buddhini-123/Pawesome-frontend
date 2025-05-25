import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Gift } from 'lucide-react';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="bg-green-400 rounded-2xl p-6 md:p-12 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 text-white/20">
            <Gift className="w-16 h-16" />
          </div>
          <div className="absolute bottom-4 left-4 text-white/20">
            <Mail className="w-12 h-12" />
          </div>
          
          {/* Cute pet illustration */}
          <motion.div 
            className="absolute top-4 left-4 text-4xl"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            🐕
          </motion.div>

          <div className="relative z-10">
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Don't miss out on our personalized discounts, special offers and our new arrivals.
            </motion.h2>
            
            <motion.form 
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-4 max-w-md mx-auto mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border-none outline-none text-gray-800 placeholder-gray-500"
                required
              />
              <motion.button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSignup;