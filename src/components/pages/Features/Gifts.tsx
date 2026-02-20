import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { giftService, PresetGiftBox } from '../../../services/gift.service';
import PresetBoxCard from '../../common/PresetBoxCard';
import { Package, Sparkles } from 'lucide-react';

const Gifts: React.FC = () => {
  const [email, setEmail] = useState('');
  const [presetBoxes, setPresetBoxes] = useState<PresetGiftBox[]>([]);
  const [isLoadingPresets, setIsLoadingPresets] = useState(true);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');

  const heroRef = useRef(null);
  const presetBoxesRef = useRef(null);
  const stepsRef = useRef(null);
  const ctaRef = useRef(null);
  const newsletterRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const presetBoxesInView = useInView(presetBoxesRef, { once: true });
  const stepsInView = useInView(stepsRef, { once: true });
  const ctaInView = useInView(ctaRef, { once: true });
  const newsletterInView = useInView(newsletterRef, { once: true });

  // Fetch preset gift boxes
  useEffect(() => {
    const fetchPresetBoxes = async () => {
      setIsLoadingPresets(true);
      try {
        const params = selectedOccasion !== 'all' ? { occasion: selectedOccasion } : {};
        const response = await giftService.getPresetBoxes(params);
        setPresetBoxes(response.data || []);
      } catch (error) {
        console.error('Failed to fetch preset boxes:', error);
        setPresetBoxes([]);
      } finally {
        setIsLoadingPresets(false);
      }
    };

    fetchPresetBoxes();
  }, [selectedOccasion]);

  const occasions = [
    { value: 'all', label: 'All Occasions' },
    { value: 'birthday', label: 'Birthday' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'congratulations', label: 'Congratulations' },
    { value: 'thank_you', label: 'Thank You' },
    { value: 'get_well', label: 'Get Well' },
  ];

  const steps = [
    { id: 1, title: "Choose a Theme Card", color: "from-vibrant-orange to-sunny-yellow" },
    { id: 2, title: "Select Your Main Theme Pet Toy", color: "from-primary-blue to-primary-blue" },
    { id: 3, title: "Select Your Complementary Pet Toys", color: "from-mint-green to-mint-green" },
    { id: 4, title: "Select Your Pet Treats", color: "from-sunny-yellow to-vibrant-orange" },
    { id: 5, title: "Select Pet Care Products", color: "from-lavender to-lavender" },
    { id: 6, title: "Select Pet Accessories & Clothings", color: "from-mint-green to-mint-green" },
    { id: 7, title: "Add A Greeting Card", color: "from-sunny-yellow to-sunny-yellow" }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-gray via-blue-50 to-yellow-50">
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
              className="text-5xl md:text-6xl lg:text-7xl font-fredoka font-bold text-vibrant-orange mb-8"
              initial={{ scale: 0.9 }}
              animate={heroInView ? { scale: 1 } : {}}
              transition={{ duration: 1, ease: "backOut" }}
            >
              Perfect Pet Gift Boxes !
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-4xl mx-auto space-y-4"
            >
              <p className="text-xl md:text-2xl text-charcoal font-fredoka font-medium">
                Choose from our curated preset boxes or create your own masterpiece!
              </p>
              <p className="text-lg md:text-xl text-charcoal">
                Browse our ready-to-go gift boxes or mix and match toys, treats, grooming products, outfits, accessories, and a greeting card to build your very own
                <span className="font-fredoka font-bold text-vibrant-orange"> Pawsome Customized Box!</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Preset Gift Boxes Section */}
      <section ref={presetBoxesRef} className="py-16 px-4 bg-gradient-to-br from-warm-white via-soft-gray to-primary-blue/5">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={presetBoxesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package className="w-10 h-10 text-primary-blue" />
              <h2 className="text-4xl md:text-5xl font-fredoka font-bold bg-gradient-to-r from-primary-blue to-vibrant-orange bg-clip-text text-transparent">
                Quick & Easy Gift Boxes
              </h2>
              <Sparkles className="w-10 h-10 text-vibrant-orange" />
            </div>
            <p className="text-lg md:text-xl text-charcoal max-w-3xl mx-auto">
              Short on time? Choose from our curated preset gift boxes - perfectly packaged and ready to go!
            </p>
          </motion.div>

          {/* Occasion Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={presetBoxesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {occasions.map((occasion) => (
              <motion.button
                key={occasion.value}
                onClick={() => setSelectedOccasion(occasion.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full font-fredoka font-semibold transition-all duration-300 ${
                  selectedOccasion === occasion.value
                    ? 'bg-gradient-to-r from-vibrant-orange to-sunny-yellow text-white shadow-lg'
                    : 'bg-white text-charcoal hover:bg-soft-gray shadow'
                }`}
              >
                {occasion.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Preset Boxes Grid */}
          {isLoadingPresets ? (
            <div className="flex justify-center items-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full"
              />
            </div>
          ) : presetBoxes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {presetBoxes.map((box, index) => (
                <PresetBoxCard key={box.id} box={box} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="inline-block p-6 bg-soft-gray rounded-full mb-4">
                <Package className="w-16 h-16 text-primary-blue" />
              </div>
              <p className="text-xl text-charcoal font-fredoka font-semibold mb-2">
                No preset boxes available for this occasion yet.
              </p>
              <p className="text-medium-gray">
                Try a different occasion or create your own custom box below!
              </p>
            </motion.div>
          )}

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={presetBoxesInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 mb-8"
          >
            <div className="flex items-center justify-center gap-4">
              <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary-blue to-transparent rounded-full"></div>
              <span className="text-2xl font-fredoka font-bold bg-gradient-to-r from-vibrant-orange to-sunny-yellow bg-clip-text text-transparent">OR</span>
              <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary-blue to-transparent rounded-full"></div>
            </div>
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
            className="text-4xl md:text-5xl font-fredoka font-bold text-sunny-yellow mb-16 text-center"
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
                    <div className="absolute -left-3 -top-3 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-vibrant-orange">
                      <span className="text-vibrant-orange font-fredoka font-bold text-lg">{step.id}</span>
                    </div>

                    <div className="ml-8">
                      <h3 className="text-lg md:text-xl font-fredoka font-semibold text-white">
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
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(26, 180, 135, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/gifts/customize"
                className="inline-block bg-gradient-to-r from-mint-green to-mint-green text-white font-fredoka font-bold text-xl md:text-2xl px-12 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Let's Start !
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      {/* <section ref={ctaRef} className="py-16 px-4">
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
                className="inline-block bg-gradient-to-r from-mint-green to-mint-green text-white font-fredoka font-bold text-xl md:text-2xl px-12 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Let's Start !
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section> */}

      {/* Pet Showcase Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-mint-green/20 to-primary-blue/20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
          >
            <div className="flex justify-center items-center space-x-8 md:space-x-12">
              {['🐕', '🐈', '🕊️', '🐇', '🐹', '🐢'].map((pet, index) => (
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
      {/* <section ref={newsletterRef} className="py-16 px-4 bg-gradient-to-r from-mint-green to-primary-blue">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={newsletterInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <motion.h3
              className="text-2xl md:text-3xl font-fredoka font-bold mb-6"
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
                className="flex-1 px-6 py-4 rounded-xl text-charcoal border-none outline-none text-lg"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-vibrant-orange to-sunny-yellow text-white font-fredoka font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Subscribe
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section> */}

      {/* Footer Info Section */}
      {/* <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-fredoka font-bold text-charcoal mb-6">Services</h4>
              <ul className="space-y-3 text-medium-gray">
                <li>Custom Gift Boxes</li>
                <li>Pet Toy Selection</li>
                <li>Treat Curation</li>
                <li>Greeting Cards</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Gifts;