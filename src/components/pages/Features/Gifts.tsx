import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const Gifts: React.FC = () => {
  const [email, setEmail] = useState('');
  const heroRef = useRef(null);
  const stepsRef = useRef(null);
  const ctaRef = useRef(null);
  const newsletterRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true });
  const stepsInView = useInView(stepsRef, { once: true, threshold: 0.2 });
  const ctaInView = useInView(ctaRef, { once: true });
  const newsletterInView = useInView(newsletterRef, { once: true });

  const steps = [
    { id: 1, title: "Choose a Theme Card", color: "from-energetic-orange to-warm-orange" },
    { id: 2, title: "Select Your Main Theme Pet Toy", color: "from-calm-blue to-sky-400" },
    { id: 3, title: "Select Your Complementary Pet Toys", color: "from-natural-sage to-emerald-400" },
    { id: 4, title: "Select Your Pet Treats", color: "from-warm-orange to-amber-400" },
    { id: 5, title: "Select Pet Care Products", color: "from-periwinkle to-purple-400" },
    { id: 6, title: "Select Pet Accessories & Clothings", color: "from-mint to-teal-400" },
    { id: 7, title: "Add A Greeting Card", color: "from-soft-yellow to-yellow-400" }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-amber-50">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-16 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-energetic-orange mb-8"
              initial={{ scale: 0.9 }}
              animate={heroInView ? { scale: 1 } : {}}
              transition={{ duration: 1, ease: "backOut" }}
            >
              Customize Your Box !
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-4xl mx-auto space-y-4"
            >
              <p className="text-xl md:text-2xl text-charcoal-gray font-medium">
                Not into our pre-set pet gift boxes? Create your own masterpiece!
              </p>
              <p className="text-lg md:text-xl text-charcoal-gray">
                Mix and match toys, treats, grooming products, outfits, accessories, and a greeting card to build your very own 
                <span className="font-bold text-energetic-orange"> Pawsome Customized Box!</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* How It Works Section */}
      <section ref={stepsRef} className="py-16 px-4 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={stepsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-warm-orange mb-16 text-center"
          >
            How It Works:
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={stepsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  className="group"
                >
                  <div className={`relative bg-gradient-to-r ${step.color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                    <div className="absolute -left-3 -top-3 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-energetic-orange">
                      <span className="text-energetic-orange font-bold text-lg">{step.id}</span>
                    </div>
                    
                    <div className="ml-8">
                      <h3 className="text-lg md:text-xl font-semibold text-white">
                        Step {step.id}: {step.title}
                      </h3>
                    </div>
                    
                    <div className="absolute top-4 right-4 opacity-20">
                      <div className="text-white text-2xl">
                        {step.id <= 3 ? '🎾' : step.id <= 5 ? '🦴' : '🎁'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={stepsInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
              transition={{ duration: 1, delay: 0.5, ease: "backOut" }}
              className="relative"
            >
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <div className="aspect-square flex items-center justify-center text-9xl">
                  🐕‍🦺
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section ref={ctaRef} className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(26, 180, 135, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/gifts/customize"
                className="inline-block bg-gradient-to-r from-mint to-emerald-500 text-white font-bold text-xl md:text-2xl px-12 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Let's Start !
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pet Showcase Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-natural-sage/20 to-calm-blue/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
          >
            <div className="flex justify-center items-center space-x-8 md:space-x-12">
              {['🐕', '🐱', '🐦', '🐰', '🐹', '🐠', '🦎', '🐢'].map((pet, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "backOut"
                  }}
                  whileHover={{ 
                    scale: 1.3,
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.3 }
                  }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-6xl cursor-pointer"
                >
                  {pet}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      {/* Newsletter Section */}
      <section ref={newsletterRef} className="py-16 px-4 bg-gradient-to-r from-natural-sage to-calm-blue">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={newsletterInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <motion.h3
              className="text-2xl md:text-3xl font-bold mb-6"
              initial={{ scale: 0.9 }}
              animate={newsletterInView ? { scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Don't miss out on our personalized discounts, special offers and our new arrivals
            </motion.h3>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={newsletterInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 rounded-xl text-charcoal-gray border-none outline-none text-lg"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-energetic-orange to-warm-orange text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Subscribe
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer Info Section */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-bold text-charcoal-gray mb-6">Services</h4>
              <ul className="space-y-3 text-gray-600">
                <li>Custom Gift Boxes</li>
                <li>Pet Toy Selection</li>
                <li>Treat Curation</li>
                <li>Greeting Cards</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gifts;