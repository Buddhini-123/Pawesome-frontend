import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const PAW_POSITIONS = [
  { left: '5%',  top: '10%', size: 50, dur: 8,  delay: 0,   img: 'paw-left'  },
  { left: '20%', top: '80%', size: 44, dur: 10, delay: 1.2, img: 'paw-right' },
  { left: '35%', top: '18%', size: 40, dur: 7,  delay: 0.4, img: 'paw-left'  },
  { left: '60%', top: '8%',  size: 46, dur: 9,  delay: 0.9, img: 'paw-right' },
  { left: '72%', top: '75%', size: 48, dur: 8,  delay: 1.8, img: 'paw-left'  },
  { left: '85%', top: '25%', size: 54, dur: 11, delay: 0.2, img: 'paw-right' },
  { left: '10%', top: '50%', size: 42, dur: 9,  delay: 0.6, img: 'paw-left'  },
  { left: '50%', top: '88%', size: 38, dur: 7,  delay: 1.5, img: 'paw-right' },
  { left: '28%', top: '45%', size: 44, dur: 8,  delay: 0.3, img: 'paw-left'  },
  { left: '45%', top: '60%', size: 50, dur: 9,  delay: 1.0, img: 'paw-right' },
  { left: '65%', top: '40%', size: 42, dur: 7,  delay: 0.7, img: 'paw-left'  },
  { left: '78%', top: '55%', size: 46, dur: 10, delay: 1.4, img: 'paw-right' },
  { left: '92%', top: '70%', size: 40, dur: 8,  delay: 0.5, img: 'paw-left'  },
  { left: '15%', top: '30%', size: 48, dur: 11, delay: 1.7, img: 'paw-right' },
  { left: '55%', top: '72%', size: 44, dur: 9,  delay: 0.9, img: 'paw-left'  },
  { left: '40%', top: '5%',  size: 36, dur: 7,  delay: 1.1, img: 'paw-right' },
];

const PETS = [
  { icon: '/icons/dog.png',    name: 'dogs'    },
  { icon: '/icons/cat.png',    name: 'cats'    },
  { icon: '/icons/bird.png',   name: 'birds'   },
  { icon: '/icons/rabbit.png', name: 'rabbits' },
];

const HeroSection: React.FC = () => {
  const [currentPet, setCurrentPet] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCurrentPet(p => (p + 1) % PETS.length), 2500);
    return () => clearInterval(id);
  }, []);

  const pet = PETS[currentPet] ?? PETS[0];

  return (
    <section className="relative overflow-hidden bg-sunny-yellow min-h-[520px] md:h-[80vh] flex items-center md:items-stretch">
      {/* Paw prints */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {PAW_POSITIONS.map((p, i) => (
          <motion.img
            key={i}
            src={`/icons/${p.img}.png`}
            alt=""
            aria-hidden="true"
            className="absolute"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size, opacity: 1 }}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Card */}
      <div className="relative z-10 flex items-center justify-center w-full px-4 py-10 md:py-0">
        <div className="relative">

          {/* Hamster — peeks from upper-left */}
          <motion.img
            src="/icons/hamster-hero.png"
            alt=""
            aria-hidden="true"
            className="hidden md:block absolute select-none pointer-events-none"
            style={{ bottom: '-6%', left: '-160px', width: '160px', zIndex: 30 }}
            // initial={{ opacity: 0, x: -20 }}
            // animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: 0.6 },
              x: { duration: 0.5, delay: 0.6 },
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 },
            }}
          />

          {/* Rabbit — peeks from lower-left */}
          <motion.img
            src="/icons/rabbit-hero.png"
            alt=""
            aria-hidden="true"
            className="hidden md:block absolute select-none pointer-events-none"
            style={{ bottom: '0%', left: '-350px', right:'0px', width: '350px', zIndex: 10 }}
            // initial={{ opacity: 0, x: -20 }}
            // animate={{ opacity: 1, x: 0, y: [0, -7, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: 0.8 },
              x: { duration: 0.5, delay: 0.8 },
              y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 },
            }}
          />

        <motion.div
          className="hero-card bg-primary-blue rounded-3xl flex flex-col gap-6 px-8 py-8 md:px-14 md:py-12 items-center justify-center text-center w-full max-w-sm"
          style={{ boxShadow: '0 20px 60px rgba(27,187,255,0.28)' }}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center w-full"
          >
            <p className="font-nunito text-white/60 text-sm md:text-2xl mb-2">The one-stop shop for</p>
            <h1 className="font-fredoka font-bold text-white leading-tight text-3xl md:text-[4rem]">
              Everything your
            </h1>
            <div className="flex items-center justify-center gap-3">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentPet}
                  className="font-fredoka font-bold text-sunny-yellow text-3xl md:text-[4.2rem]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {pet.name}
                </motion.span>
              </AnimatePresence>
              {/* <AnimatePresence mode="wait">
                <motion.img
                  key={currentPet}
                  src={pet.icon}
                  alt=""
                  className="w-8 h-8 md:w-12 md:h-12 object-contain"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence> */}
            </div>
            <h1 className="font-fredoka font-bold text-white leading-tight text-3xl md:text-[4rem]">
              needs
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.p
            className="font-nunito text-white/65 text-sm md:text-2xl leading-relaxed flex-shrink-0"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            Premium food, toys & care products — delivered straight to your door across Sri Lanka.
          </motion.p>


          {/* CTAs */}
          <motion.div
            className="flex flex-col items-center w-full"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
              <Link
                to="/shop"
                className="flex items-center justify-center bg-sunny-yellow text-charcoal font-fredoka font-bold px-8 py-3.5 rounded-2xl text-lg hover:scale-[1.02] transition-all duration-300 shadow-md"
              >
                Shop now
              </Link>
              <Link
                to="/subscriptions"
                className="flex items-center justify-center bg-white/10 text-white font-fredoka font-semibold px-8 py-3.5 rounded-2xl text-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Subscription plans
              </Link>
            </div>
          </motion.div>
        </motion.div>
        </div>
      </div>

      {/* Animals */}
      <motion.img
        src="/icons/catanddog.png"
        alt="Cat and Dog"
        className="hidden md:block absolute bottom-0 z-10 select-none pointer-events-none"
        style={{ width: '520px', right: -128 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: [0, -10, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 0.3 },
          y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 },
        }}
      />
    </section>
  );
};

export default HeroSection;
