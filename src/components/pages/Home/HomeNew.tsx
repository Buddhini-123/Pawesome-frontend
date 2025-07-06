import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Gift, Percent, Trophy, ArrowRight, Star, Heart, TruckIcon } from 'lucide-react';
import HeroSection from './HeroSection';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  link: string;
  delay: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, color, link, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group"
    >
      <Link to={link}>
        <div className={`relative overflow-hidden rounded-3xl ${color} p-8 h-full shadow-xl hover:shadow-2xl transition-all duration-300 pet-card`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="absolute text-white"
                style={{
                  fontSize: '40px',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              >🐾</span>
            ))}
          </div>

          {/* Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          </div>

          {/* Content */}
          <h3 className="text-2xl font-fredoka font-bold text-white mb-3">{title}</h3>
          <p className="text-white/90 font-nunito mb-6">{description}</p>

          {/* CTA */}
          <div className="flex items-center text-white font-semibold group-hover:gap-3 gap-2 transition-all duration-300">
            <span>Learn More</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </div>

          {/* Pet Badge */}
          <div className="absolute -top-2 -right-2 bg-sunny-yellow text-charcoal px-4 py-2 rounded-full font-fredoka font-semibold text-sm transform rotate-12 shadow-lg">
            NEW!
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const Home: React.FC = () => {
  const services = [
    {
      title: 'Pet Subscriptions',
      description: 'Never run out of essentials with automated deliveries tailored to your pet.',
      icon: <Calendar className="w-10 h-10 text-white" />,
      color: 'bg-vibrant-orange',
      link: '/subscriptions',
    },
    {
      title: 'Gift Boxes',
      description: 'Monthly surprise boxes filled with toys, treats, and accessories.',
      icon: <Gift className="w-10 h-10 text-white" />,
      color: 'bg-primary-blue',
      link: '/gifts',
    },
    {
      title: 'Daily Deals',
      description: 'Exclusive discounts on top-rated products every single day.',
      icon: <Percent className="w-10 h-10 text-white" />,
      color: 'bg-mint-green',
      link: '/deals',
    },
    {
      title: 'Paw Rewards',
      description: 'Earn points, unlock benefits, and get VIP access to new products.',
      icon: <Trophy className="w-10 h-10 text-white" />,
      color: 'bg-lavender',
      link: '/loyalty-cards',
    },
  ];

  const features = [
    { icon: <TruckIcon className="w-8 h-8" />, title: 'Free Shipping', description: 'On orders above ₹2000' },
    { icon: <Heart className="w-8 h-8" />, title: '100% Safe', description: 'Vet approved products' },
    { icon: <Star className="w-8 h-8" />, title: 'Top Rated', description: '50,000+ happy customers' },
    { icon: <span className="text-3xl">🐾</span>, title: 'Pet Experts', description: '24/7 customer support' },
  ];

  const categories = [
    { name: 'Dogs', icon: <span className="text-5xl">🐕</span>, count: '500+ Products', color: 'bg-vibrant-orange' },
    { name: 'Cats', icon: <span className="text-5xl">🐱</span>, count: '450+ Products', color: 'bg-primary-blue' },
    { name: 'Birds', icon: <span className="text-5xl">🦜</span>, count: '200+ Products', color: 'bg-mint-green' },
    { name: 'Small Pets', icon: <span className="text-5xl">🐹</span>, count: '300+ Products', color: 'bg-lavender' },
  ];

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Bar */}
      <section className="py-12 bg-white border-b border-light-gray">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-blue/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary-blue">
                  {feature.icon}
                </div>
                <h3 className="font-fredoka font-semibold text-charcoal mb-1">{feature.title}</h3>
                <p className="text-medium-gray text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-soft-gray">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-fredoka font-bold text-charcoal mb-4">
              What Makes Us <span className="text-primary-blue">Special</span> 🌟
            </h2>
            <p className="text-xl text-medium-gray font-nunito max-w-2xl mx-auto">
              Discover our unique services designed to make pet parenting easier and more fun!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Pet Category */}
      <section className="py-20 bg-warm-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-fredoka font-bold text-charcoal mb-4">
              Shop by Your <span className="text-vibrant-orange">Pet Type</span> 🐾
            </h2>
            <p className="text-xl text-medium-gray font-nunito">
              Find everything your pet needs in one place
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
              >
                <div className={`${category.color} rounded-3xl p-8 text-white text-center shadow-xl group-hover:shadow-2xl transition-all duration-300`}>
                  <div className="bg-white/20 backdrop-blur-sm w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-fredoka font-bold mb-2">{category.name}</h3>
                  <p className="text-white/90 font-nunito">{category.count}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-blue relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className="absolute text-white/10"
              style={{
                fontSize: `${Math.random() * 60 + 40}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >🐾</span>
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-fredoka font-bold text-white mb-6">
              Ready to Spoil Your Pet? 🎁
            </h2>
            <p className="text-xl text-white/90 font-nunito mb-8 max-w-2xl mx-auto">
              Join thousands of pet parents who trust Pawsome for all their pet needs.
              Start shopping today and see the difference!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 bg-white text-primary-blue px-8 py-4 rounded-full font-fredoka font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;