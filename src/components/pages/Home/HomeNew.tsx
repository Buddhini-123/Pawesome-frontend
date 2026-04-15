import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Gift, Percent, Trophy, ArrowRight, Star, Heart, TruckIcon } from 'lucide-react';
import HeroSection from './HeroSection';
import { formatters } from '../../../utils/formatters';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
  link: string;
  delay: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, color, textColor, link, delay }) => {
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
        <div className="relative overflow-hidden rounded-3xl p-8 h-full shadow-xl hover:shadow-2xl transition-all duration-300 pet-card flex flex-col items-center text-center" style={{ backgroundColor: color }}>
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
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ color: textColor }}>
              {icon}
            </div>
          </div>

          {/* Content */}
          <h3 className="text-2xl font-fredoka font-bold mb-3" style={{ color: textColor }}>{title}</h3>
          <p className="font-nunito mb-6" style={{ color: textColor, opacity: 0.85 }}>{description}</p>

          {/* CTA */}
          <div className="flex items-center justify-center font-semibold group-hover:gap-3 gap-2 transition-all duration-300" style={{ color: textColor }}>
            <span>Learn More</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

interface LeafConfig {
  top: string; left: string; size: number; rotate: number;
  dur: number; delay: number; hx: number; hy: number;
}

type LeafState = 'floating' | 'pushed' | 'returning';

const LEAVES: LeafConfig[] = [
  { top:  '2%', left:  '-2%', size: 260, rotate:   15, dur: 7,  delay: 0,   hx:  -80, hy:  -80 },
  { top:  '5%', left:  '78%', size: 280, rotate:  -55, dur: 9,  delay: 1.2, hx:   80, hy:  -80 },
  { top: '18%', left:  '90%', size: 250, rotate:   80, dur: 6,  delay: 0.5, hx:  100, hy:  -60 },
  { top: '30%', left:   '3%', size: 270, rotate:  170, dur: 8,  delay: 1.8, hx:  -90, hy:   40 },
  { top: '42%', left:  '52%', size: 240, rotate:   45, dur: 10, delay: 0.3, hx:   60, hy:  -90 },
  { top: '55%', left:  '88%', size: 260, rotate: -110, dur: 7,  delay: 2.1, hx:  100, hy:   60 },
  { top: '62%', left:   '8%', size: 280, rotate:  300, dur: 9,  delay: 0.8, hx:  -90, hy:   70 },
  { top: '74%', left:  '65%', size: 250, rotate:  130, dur: 6,  delay: 1.5, hx:   70, hy:   80 },
  { top: '82%', left:  '-1%', size: 270, rotate:  -20, dur: 8,  delay: 0.4, hx:  -80, hy:   90 },
  { top: '91%', left:  '42%', size: 260, rotate:  250, dur: 7,  delay: 1.0, hx:   40, hy:  100 },
];

const LeafItem: React.FC<{ l: LeafConfig }> = ({ l }) => {
  const [leafState, setLeafState] = useState<LeafState>('floating');

  const animateProps = (() => {
    if (leafState === 'pushed') {
      return { x: l.hx, y: l.hy, opacity: 0.08, scale: 1.12, rotate: l.rotate + 25 };
    }
    if (leafState === 'returning') {
      return { x: 0, y: 0, opacity: 0.29, scale: 1, rotate: l.rotate };
    }
    return {
      y: [0, -20, 10, -15, 0],
      x: [0, 10, -8, 5, 0],
      rotate: [l.rotate, l.rotate + 12, l.rotate - 8, l.rotate + 5, l.rotate],
      opacity: 0.29,
      scale: 1,
    };
  })();

  const transitionProps = (() => {
    if (leafState === 'pushed') {
      return { duration: 0.3, ease: 'easeOut' as const };
    }
    if (leafState === 'returning') {
      return { type: 'spring' as const, stiffness: 35, damping: 10 };
    }
    return { duration: l.dur, repeat: Infinity, delay: l.delay, ease: 'easeInOut' as const };
  })();

  return (
    <motion.img
      src="/icons/leaf-layer.png"
      alt=""
      aria-hidden="true"
      className="absolute select-none"
      style={{
        top: l.top,
        left: l.left,
        width: l.size,
        height: l.size,
        mixBlendMode: 'multiply',
        cursor: 'default',
      }}
      animate={animateProps}
      transition={transitionProps}
      onHoverStart={() => {
        if (leafState !== 'pushed') setLeafState('pushed');
      }}
      onHoverEnd={() => {
        setLeafState('returning');
      }}
      onAnimationComplete={() => {
        if (leafState === 'returning') setLeafState('floating');
      }}
    />
  );
};

const Home: React.FC = () => {
  const services = [
    {
      title: 'Daily Deals',
      description: 'Exclusive discounts on top-rated products every single day.',
      icon: <Percent className="w-10 h-10" />,
      color: '#FF8B61',
      textColor: '#7A2800',
      link: '/deals',
    },
    {
      title: 'Gift Boxes',
      description: 'Monthly surprise boxes filled with toys, treats, and accessories.',
      icon: <Gift className="w-10 h-10" />,
      color: '#FC6884',
      textColor: '#7A0030',
      link: '/gifts',
    },
    {
      title: 'Paw Rewards',
      description: 'Earn points, unlock benefits, and get VIP access to new products.',
      icon: <Trophy className="w-10 h-10" />,
      color: '#48FFF2',
      textColor: '#004D50',
      link: '/loyalty-cards',
    },
    {
      title: 'Subscriptions',
      description: 'Never run out of essentials with automated deliveries tailored to your pet.',
      icon: <Calendar className="w-10 h-10" />,
      color: '#B791FF',
      textColor: '#2D0066',
      link: '/subscriptions',
    },

  ];

  const features = [
    { icon: <TruckIcon className="w-8 h-8" />, title: 'Free Shipping', description: `On orders above ${formatters.currency(2000)}` },
    { icon: <Heart className="w-8 h-8" />, title: '100% Safe', description: 'Vet approved products' },
    { icon: <Star className="w-8 h-8" />, title: 'Top Rated', description: '50,000+ happy customers' },
    { icon: <span className="text-3xl">🐾</span>, title: 'Pet Experts', description: '24/7 customer support' },
  ];

  const categories = [
    { name: 'Dogs', icon: <span className="text-5xl">🐕</span>, count: '500+ Products', color: 'bg-vibrant-orange' },
    { name: 'Cats', icon: <span className="text-5xl">🐱</span>, count: '450+ Products', color: 'bg-primary-blue' },
    { name: 'Birds', icon: <span className="text-5xl">🦜</span>, count: '200+ Products', color: 'bg-mint-green' },
    { name: 'Other Pets', icon: <span className="text-5xl">🐹</span>, count: '300+ Products', color: 'bg-lavender' },
  ];

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Features + Services — merged section */}
      <section className="relative overflow-hidden bg-sky-light py-20">

        {/* Leaf decorations */}
        {LEAVES.map((l, i) => (
          <LeafItem key={i} l={l} />
        ))}

        <div className="relative z-10 container mx-auto px-4">

          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl md:text-5xl font-fredoka font-bold text-charcoal mb-3">
              What Makes Us <span className="text-primary-blue">Special</span> 🌟
            </h2>
            <p className="text-lg text-charcoal/60 font-nunito max-w-2xl mx-auto">
              Discover our unique services designed to make pet parenting easier and more fun!
            </p>
          </motion.div>

          {/* Service cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} delay={index * 0.1} />
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-white/40 mb-14" />

          {/* Features bar */}
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
                <div className="w-16 h-16 bg-white/40 rounded-full flex items-center justify-center mx-auto mb-3 text-charcoal">
                  {feature.icon}
                </div>
                <h3 className="font-fredoka font-semibold text-charcoal mb-1">{feature.title}</h3>
                <p className="text-charcoal/60 text-sm font-nunito">{feature.description}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Shop by Pet Category */}
      {/* <section className="py-20 bg-warm-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-fredoka font-bold text-charcoal mb-4">
              Shop by Your <span className="text-warm-orange">Pet Type</span> 🐾
            </h2>
            <p className="text-xl text-medium-gray font-fredoka font-nunito">
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
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-20 bg-primary-blue relative overflow-hidden">
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
      </section> */}
    </div>
  );
};

export default Home;