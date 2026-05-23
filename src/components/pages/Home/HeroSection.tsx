import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';

const PAW_POSITIONS = [
  { left: '5%', top: '10%', size: 50, dur: 8, delay: 0, img: 'paw-left', layer: 1 },
  { left: '20%', top: '80%', size: 44, dur: 10, delay: 1.2, img: 'paw-right', layer: 3 },
  { left: '35%', top: '18%', size: 40, dur: 7, delay: 0.4, img: 'paw-left', layer: 2 },
  { left: '60%', top: '8%', size: 46, dur: 9, delay: 0.9, img: 'paw-right', layer: 1 },
  { left: '72%', top: '75%', size: 48, dur: 8, delay: 1.8, img: 'paw-left', layer: 2 },
  { left: '85%', top: '25%', size: 54, dur: 11, delay: 0.2, img: 'paw-right', layer: 3 },
  { left: '10%', top: '50%', size: 42, dur: 9, delay: 0.6, img: 'paw-left', layer: 1 },
  { left: '50%', top: '88%', size: 38, dur: 7, delay: 1.5, img: 'paw-right', layer: 2 },
  { left: '28%', top: '45%', size: 44, dur: 8, delay: 0.3, img: 'paw-left', layer: 3 },
  { left: '45%', top: '60%', size: 50, dur: 9, delay: 1.0, img: 'paw-right', layer: 1 },
  { left: '65%', top: '40%', size: 42, dur: 7, delay: 0.7, img: 'paw-left', layer: 2 },
  { left: '78%', top: '55%', size: 46, dur: 10, delay: 1.4, img: 'paw-right', layer: 3 },
  { left: '92%', top: '70%', size: 40, dur: 8, delay: 0.5, img: 'paw-left', layer: 1 },
  { left: '15%', top: '30%', size: 48, dur: 11, delay: 1.7, img: 'paw-right', layer: 2 },
  { left: '55%', top: '72%', size: 44, dur: 9, delay: 0.9, img: 'paw-left', layer: 3 },
  { left: '40%', top: '5%', size: 36, dur: 7, delay: 1.1, img: 'paw-right', layer: 1 },
];

const PETS = [
  { icon: '/icons/dog.png', name: 'Dogs' },
  { icon: '/icons/cat.png', name: 'Cats' },
  { icon: '/icons/bird.png', name: 'Birds' },
  { icon: '/icons/rabbit.png', name: 'Rabbits' },
];

const HeroSection: React.FC = () => {
  const [currentPet, setCurrentPet] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // ── Scroll parallax ──────────────────────────────────────────────
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 120, damping: 18 });

  const sL1y = useTransform(smoothScroll, [0, 1], [0, -420]); // front paws — scroll fastest
  const sL2y = useTransform(smoothScroll, [0, 1], [0, -260]); // mid paws
  const sL3y = useTransform(smoothScroll, [0, 1], [0, -140]); // back paws — scroll slowest
  const sCardY = useTransform(smoothScroll, [0, 1], [0, -200]);
  const sHamY = useTransform(smoothScroll, [0, 1], [0, -360]);
  const sRabY = useTransform(smoothScroll, [0, 1], [0, -280]);
  const sCatY = useTransform(smoothScroll, [0, 1], [0, -320]);
  const sCatX = useTransform(smoothScroll, [0, 1], [0, 80]); // drifts right as you scroll

  // ── Mouse parallax ───────────────────────────────────────────────
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const smoothX = useSpring(rawX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(rawY, { stiffness: 50, damping: 20 });

  const mL1x = useTransform(smoothX, [0, 1], [-22, 22]);
  const mL1y = useTransform(smoothY, [0, 1], [-16, 16]);
  const mL2x = useTransform(smoothX, [0, 1], [-12, 12]);
  const mL2y = useTransform(smoothY, [0, 1], [-9, 9]);
  const mL3x = useTransform(smoothX, [0, 1], [-6, 6]);
  const mL3y = useTransform(smoothY, [0, 1], [-4, 4]);
  const mCardX = useTransform(smoothX, [0, 1], [-6, 6]);
  const mCardY = useTransform(smoothY, [0, 1], [-4, 4]);
  const mHamX = useTransform(smoothX, [0, 1], [-18, 18]);
  const mHamY = useTransform(smoothY, [0, 1], [-14, 14]);
  const mRabX = useTransform(smoothX, [0, 1], [-10, 10]);
  const mRabY = useTransform(smoothY, [0, 1], [-8, 8]);
  const mCatX = useTransform(smoothX, [0, 1], [14, -14]);
  const mCatY = useTransform(smoothY, [0, 1], [8, -8]);

  // ── Combined: mouse + scroll ─────────────────────────────────────
  const l1x = useTransform([mL1x], ([m]: number[]) => m);
  const l1y = useTransform([mL1y, sL1y], ([m, s]: number[]) => m + s);
  const l2x = useTransform([mL2x], ([m]: number[]) => m);
  const l2y = useTransform([mL2y, sL2y], ([m, s]: number[]) => m + s);
  const l3x = useTransform([mL3x], ([m]: number[]) => m);
  const l3y = useTransform([mL3y, sL3y], ([m, s]: number[]) => m + s);
  const cardX = useTransform([mCardX], ([m]: number[]) => m);
  const cardY = useTransform([mCardY, sCardY], ([m, s]: number[]) => m + s);
  const hamX = useTransform([mHamX], ([m]: number[]) => m);
  const hamY = useTransform([mHamY, sHamY], ([m, s]: number[]) => m + s);
  const rabX = useTransform([mRabX], ([m]: number[]) => m);
  const rabY = useTransform([mRabY, sRabY], ([m, s]: number[]) => m + s);
  const catX = useTransform([mCatX, sCatX], ([m, s]: number[]) => m + s);
  const catY = useTransform([mCatY, sCatY], ([m, s]: number[]) => m + s);

  const layers = [
    { x: l1x, y: l1y },
    { x: l2x, y: l2y },
    { x: l3x, y: l3y },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width);
    rawY.set((e.clientY - rect.top) / rect.height);
  };

  useEffect(() => {
    const id = setInterval(() => setCurrentPet(p => (p + 1) % PETS.length), 2500);
    return () => clearInterval(id);
  }, []);

  const pet = PETS[currentPet] ?? PETS[0];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-sunny-yellow min-h-[520px] md:h-[80vh] flex items-center md:items-stretch"
      onMouseMove={handleMouseMove}
    >
      {/* ── Paw prints ───────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {PAW_POSITIONS.map((p, i) => {
          const lyr = layers[(p.layer - 1) % 3];
          return (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: p.left, top: p.top, x: lyr.x, y: lyr.y }}
            >
              <motion.img
                src={`/icons/${p.img}.png`}
                alt=""
                aria-hidden="true"
                style={{ width: p.size, height: p.size, opacity: 1 }}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* ── Card area ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-center w-full px-4 py-10 md:py-0">
        <motion.div className="relative" style={{ x: cardX, y: cardY }}>

          {/* Hamster — scales from 120px (laptop) → 200px (4K) */}
          <motion.div
            className="hidden md:block absolute select-none pointer-events-none"
            style={{
              bottom: '-10%',
              left: 'calc(-1 * clamp(100px, 13vw, 170px))',
              width: 'clamp(90px, 13vw, 190px)',
              zIndex: 2, x: hamX, y: hamY,
            }}
          >
            <motion.img
              src="/icons/hamster-hero.png"
              alt=""
              aria-hidden="true"
              style={{ width: '100%' }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            />
          </motion.div>

          {/* Rabbit — scales from 260px (laptop) → 420px (4K) */}
          <motion.div
            className="hidden md:block absolute select-none pointer-events-none"
            style={{
              top: '-28%',
              left: 'calc(-1 * clamp(230px, 23vw, 400px))',
              width: 'clamp(240px, 24vw, 410px)',
              zIndex: 1, x: rabX, y: rabY,
            }}
          >
            <motion.img
              src="/icons/rabbit-hero.png"
              alt=""
              aria-hidden="true"
              style={{ width: '100%' }}
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            />
          </motion.div>

          {/* Blue card */}
          <motion.div
            className="hero-card bg-primary-blue rounded-3xl flex flex-col items-center justify-center text-center gap-5 px-8 py-8 md:px-14 md:py-12 w-full max-w-sm"
            style={{ boxShadow: '0 20px 60px rgba(27,187,255,0.28)', position: 'relative', zIndex: 3 }}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Logo */}
            <motion.img
              src="/logo/logo.png"
              alt="Pawsome Logo"
              className="mx-auto w-30 md:w-60 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            />

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center justify-center w-full gap-0"
            >
              <h1 className="font-fredoka font-bold text-white leading-tight text-3xl md:text-[4rem] text-center w-full" style={{marginBottom:10}}>
                Everything Your
              </h1>
              
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentPet}
                  className="block font-fredoka font-bold text-sunny-yellow text-3xl md:text-[4.2rem] text-center w-full"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {pet.name}
                </motion.span>
              </AnimatePresence>
              <h1 className="font-fredoka font-bold text-white leading-tight text-3xl md:text-[4rem] text-center w-full">
                Needs
              </h1>
            </motion.div>

            {/* CTA */}
            <motion.div
              className="w-full flex justify-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Link
                to="/subscriptions"
                className="flex items-center justify-center bg-sunny-yellow text-charcoal font-fredoka font-bold px-10 py-3.5 rounded-2xl text-lg hover:scale-[1.02] transition-all duration-300 shadow-md w-full max-w-xs"
              >
                Shop Now
              </Link>
            </motion.div>

            {/* Subtext */}
            {/* <motion.p
              className="font-nunito text-white/65 text-sm md:text-2xl leading-relaxed text-center w-full"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              Premium food, toys & care products - delivered straight to your door across Sri Lanka.
            </motion.p> */}
          </motion.div>

        </motion.div>
      </div>

      {/* ── Cat + Dog — scales from 380px (laptop) → 620px (4K) ────── */}
      <motion.div
        className="hidden md:block absolute bottom-0 z-10 select-none pointer-events-none"
        style={{ right: 'clamp(-160px, -9vw, -60px)', x: catX, y: catY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.img
          src="/icons/catanddog.png"
          alt="Cat and Dog"
          style={{ width: 'clamp(280px, 28vw, 540px)' }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
