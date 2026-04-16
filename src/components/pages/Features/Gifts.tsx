import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { giftService, PresetGiftBox } from '../../../services/gift.service';
import PresetBoxCard from '../../common/PresetBoxCard';
import { Package, Sparkles, Gift, Star, Heart, ArrowRight, Wand2, Palette, Gamepad2, Plus, Cookie, Tag, Mail, Zap, CheckCircle } from 'lucide-react';

// ── Paw prints for hero background ────────────────────────────────
const PAW_POSITIONS = [
  { left:  '4%', top: '12%', size: 44, dur: 7,  delay: 0,   img: 'paw-left'  },
  { left: '12%', top: '72%', size: 36, dur: 9,  delay: 1.2, img: 'paw-right' },
  { left: '80%', top: '18%', size: 48, dur: 8,  delay: 0.5, img: 'paw-right' },
  { left: '88%', top: '68%', size: 38, dur: 7,  delay: 1.8, img: 'paw-left'  },
  { left: '50%', top: '82%', size: 32, dur: 10, delay: 0.3, img: 'paw-right' },
  { left: '38%', top:  '6%', size: 40, dur: 8,  delay: 0.9, img: 'paw-left'  },
  { left: '65%', top: '78%', size: 34, dur: 9,  delay: 1.5, img: 'paw-right' },
  { left: '25%', top: '35%', size: 38, dur: 7,  delay: 0.6, img: 'paw-left'  },
];

// ── Hand-drawn illustrations ──────────────────────────────────────
const ILLUSTRATIONS = [
  // Hero section
  { src: 'dog-illustrations.png',      left: '2%',  top: '5%',  size: 110, rotate:  -12, dur: 6,  delay: 0,   opacity: 0.18, section: 'hero'    },
  { src: 'heart-illustrations.png',    left: '82%', top: '10%', size:  80, rotate:   15, dur: 5,  delay: 0.7, opacity: 0.22, section: 'hero'    },
  { src: 'scribble-illustrations.png', left: '70%', top: '70%', size: 100, rotate:   30, dur: 7,  delay: 1.1, opacity: 0.15, section: 'hero'    },
  { src: 'small-hear-illustrations.png', left: '18%', top: '78%', size: 70, rotate: -20, dur: 5, delay: 1.5, opacity: 0.20, section: 'hero'    },
  { src: 'hypnotize-illustrations.png', left: '55%', top: '5%', size:  90, rotate:   8,  dur: 8, delay: 0.4, opacity: 0.14, section: 'hero'    },
  { src: 'cat-illustrations.png',      left: '90%', top: '55%', size: 100, rotate:  -8,  dur: 6, delay: 1.8, opacity: 0.16, section: 'hero'    },

  // Preset boxes section
  { src: 'heart-illustrations.png',    left: '5%',  top: '15%', size:  90, rotate: -18, dur: 7,  delay: 0.3, opacity: 0.18, section: 'preset'  },
  { src: 'dog-illustrations.png',      left: '88%', top: '8%',  size: 110, rotate:  20, dur: 8,  delay: 0.9, opacity: 0.15, section: 'preset'  },
  { src: 'scribble-illustrations.png', left: '92%', top: '60%', size:  85, rotate: -30, dur: 6,  delay: 1.4, opacity: 0.14, section: 'preset'  },
  { src: 'hypnotize-illustrations.png', left: '2%', top: '65%', size:  95, rotate:  12, dur: 9,  delay: 0.6, opacity: 0.13, section: 'preset'  },
  { src: 'small-hear-illustrations.png', left: '50%', top: '92%', size: 65, rotate: 25, dur: 5, delay: 2.0, opacity: 0.16, section: 'preset'  },
  { src: 'cat-illustrations.png',      left: '40%', top: '3%',  size: 100, rotate:  -5, dur: 7,  delay: 1.2, opacity: 0.13, section: 'preset'  },

  // Build your own section
  { src: 'scribble-illustrations.png', left: '1%',  top: '10%', size:  95, rotate:  18, dur: 8,  delay: 0.5, opacity: 0.14, section: 'build'   },
  { src: 'heart-illustrations.png',    left: '90%', top: '5%',  size:  80, rotate: -22, dur: 6,  delay: 1.0, opacity: 0.18, section: 'build'   },
  { src: 'dog-illustrations.png',      left: '85%', top: '70%', size: 105, rotate:  10, dur: 7,  delay: 0.2, opacity: 0.14, section: 'build'   },
  { src: 'hypnotize-illustrations.png', left: '3%', top: '75%', size:  90, rotate: -15, dur: 9,  delay: 1.6, opacity: 0.13, section: 'build'   },
  { src: 'small-hear-illustrations.png', left: '55%', top: '95%', size: 70, rotate: 30, dur: 5, delay: 0.8, opacity: 0.16, section: 'build'   },

  // Pet types section
  { src: 'cat-illustrations.png',      left: '2%',  top: '10%', size: 110, rotate: -10, dur: 7,  delay: 0.4, opacity: 0.18, section: 'pets'    },
  { src: 'heart-illustrations.png',    left: '88%', top: '15%', size:  85, rotate:  20, dur: 6,  delay: 1.1, opacity: 0.20, section: 'pets'    },
  { src: 'scribble-illustrations.png', left: '80%', top: '68%', size:  90, rotate: -25, dur: 8,  delay: 0.6, opacity: 0.15, section: 'pets'    },
  { src: 'dog-illustrations.png',      left: '4%',  top: '65%', size: 100, rotate:  15, dur: 7,  delay: 1.8, opacity: 0.15, section: 'pets'    },
];

// ── Leaf configs (matching homepage) ──────────────────────────────
const LEAVES = [
  { top:  '2%', left:  '-2%', size: 260, rotate:   15, dur: 7,  delay: 0   },
  { top:  '5%', left:  '78%', size: 280, rotate:  -55, dur: 9,  delay: 1.2 },
  { top: '55%', left:  '88%', size: 260, rotate: -110, dur: 7,  delay: 2.1 },
  { top: '62%', left:   '8%', size: 280, rotate:  300, dur: 9,  delay: 0.8 },
  { top: '30%', left:   '3%', size: 270, rotate:  170, dur: 8,  delay: 1.8 },
  { top: '74%', left:  '65%', size: 250, rotate:  130, dur: 6,  delay: 1.5 },
];

// ── Step card color palette (matches homepage service cards) ───────
const STEP_COLORS = [
  { bg: '#FF8B61', text: '#7A2800' },
  { bg: '#1BBBFF', text: '#004D6B' },
  { bg: '#48FFF2', text: '#004D50' },
  { bg: '#FFDB4D', text: '#7A5500' },
  { bg: '#FC6884', text: '#7A0030' },
  { bg: '#B791FF', text: '#2D0066' },
  { bg: '#FF8B61', text: '#7A2800' },
];

const OCCASIONS = [
  { value: 'all',             label: 'All Occasions', emoji: '🎁' },
  { value: 'birthday',        label: 'Birthday',      emoji: '🎂' },
  { value: 'anniversary',     label: 'Anniversary',   emoji: '💕' },
  { value: 'holiday',         label: 'Holiday',       emoji: '✨' },
  { value: 'congratulations', label: 'Congrats',      emoji: '🎉' },
  { value: 'thank_you',       label: 'Thank You',     emoji: '💝' },
  { value: 'get_well',        label: 'Get Well',      emoji: '🌸' },
];

const STEPS = [
  { id: 1, title: 'Theme Card',          emoji: '🎨', desc: 'Set the perfect theme'   },
  { id: 2, title: 'Main Pet Toy',        emoji: '🎾', desc: 'The star of the box'      },
  { id: 3, title: 'More Toys',           emoji: '🐾', desc: 'Add extra fun'            },
  { id: 4, title: 'Pet Treats',          emoji: '🦴', desc: 'Delicious rewards'        },
  { id: 5, title: 'Care Products',       emoji: '✨', desc: 'Grooming & wellness'      },
  { id: 6, title: 'Accessories',         emoji: '👗', desc: 'Style your pet'           },
  { id: 7, title: 'Greeting Card',       emoji: '💌', desc: 'A personal touch'         },
];

const STEP_ICONS   = [Palette, Gamepad2, Plus, Cookie, Sparkles, Tag, Mail];
const STEP_ILLUSTS = [
  'scribble-illustrations.png',
  'dog-illustrations.png',
  'cat-illustrations.png',
  'heart-illustrations.png',
  'hypnotize-illustrations.png',
  'small-hear-illustrations.png',
  'scribble-illustrations.png',
];

const BENEFITS = [
  { icon: <Gift    className="w-7 h-7" />, title: 'Curated with Love',    desc: 'Hand-picked by pet experts'    },
  { icon: <Star    className="w-7 h-7" />, title: 'Free Gift Wrapping',   desc: 'Every box beautifully wrapped' },
  { icon: <Heart   className="w-7 h-7" />, title: 'Personal Message',     desc: 'Custom greeting card included' },
  { icon: <Sparkles className="w-7 h-7" />, title: 'Save Up to 10%',     desc: 'Bundle discounts on custom'    },
];

// ── Reusable illustration background layer ────────────────────────
const IllustrationBg: React.FC<{ section: string }> = ({ section }) => (
  <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
    {ILLUSTRATIONS.filter(il => il.section === section).map((il, i) => (
      <motion.img
        key={i}
        src={`/icons/illustrations/${il.src}`}
        alt="" aria-hidden="true"
        className="absolute"
        style={{ left: il.left, top: il.top, width: il.size, height: il.size, opacity: il.opacity, rotate: `${il.rotate}deg` }}
        animate={{ y: [0, -14, 6, -10, 0], rotate: [il.rotate, il.rotate + 8, il.rotate - 5, il.rotate + 3, il.rotate] }}
        transition={{ duration: il.dur, repeat: Infinity, delay: il.delay, ease: 'easeInOut' }}
      />
    ))}
  </div>
);

// ── Interactive hero illustration ─────────────────────────────────
type IllustState = 'floating' | 'hovered' | 'clicked' | 'returning';

type ClickEffect = 'bounce' | 'spin' | 'wiggle' | 'pulse';

const HeroIllust: React.FC<{
  src: string;
  className?: string;
  style: React.CSSProperties;
  floatY: number[];
  floatRotate?: number[];
  dur: number;
  delay?: number;
  hoverX?: number;
  hoverY?: number;
  clickEffect: ClickEffect;
  baseRotate?: number;
}> = ({ src, className = '', style, floatY, floatRotate, dur, delay = 0, hoverX = 0, hoverY = -24, clickEffect, baseRotate = 0 }) => {
  const [state, setState] = useState<IllustState>('floating');

  const animate = (() => {
    if (state === 'hovered') {
      return { x: hoverX, y: hoverY, scale: 1.14, rotate: baseRotate + 6 };
    }
    if (state === 'clicked') {
      if (clickEffect === 'bounce') return { y: [0, -55, 14, -28, 5, 0], scale: [1, 1.28, 0.88, 1.16, 0.96, 1], rotate: baseRotate };
      if (clickEffect === 'spin')   return { rotate: [baseRotate, baseRotate + 360], scale: [1, 1.18, 1] };
      if (clickEffect === 'wiggle') return { x: [0, -18, 18, -12, 12, -6, 6, 0], rotate: [baseRotate, baseRotate - 14, baseRotate + 14, baseRotate] };
      if (clickEffect === 'pulse')  return { scale: [1, 1.55, 0.82, 1.28, 0.94, 1], rotate: baseRotate };
    }
    if (state === 'returning') {
      return { x: 0, y: 0, scale: 1, rotate: baseRotate };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const a: any = { y: floatY };
    if (floatRotate) a.rotate = floatRotate;
    return a;
  })();

  const transition = (() => {
    if (state === 'hovered')   return { duration: 0.22, ease: 'easeOut' as const };
    if (state === 'clicked')   return { duration: clickEffect === 'spin' ? 0.6 : 0.52, ease: 'easeOut' as const };
    if (state === 'returning') return { type: 'spring' as const, stiffness: 38, damping: 11 };
    return { duration: dur, repeat: Infinity, delay, ease: 'easeInOut' as const };
  })();

  return (
    <motion.img
      src={src}
      alt="" aria-hidden="true"
      className={`absolute select-none cursor-pointer ${className}`}
      style={style}
      animate={animate}
      transition={transition}
      onHoverStart={() => { if (state === 'floating') setState('hovered'); }}
      onHoverEnd={() => { if (state === 'hovered') setState('returning'); }}
      onClick={() => setState('clicked')}
      onAnimationComplete={() => {
        if (state === 'clicked') setState('returning');
        else if (state === 'returning') setState('floating');
      }}
    />
  );
};

const Gifts: React.FC = () => {
  const [presetBoxes, setPresetBoxes]       = useState<PresetGiftBox[]>([]);
  const [isLoadingPresets, setIsLoadingPresets] = useState(true);
  const [selectedOccasion, setSelectedOccasion] = useState('all');

  useEffect(() => {
    const fetchPresetBoxes = async () => {
      setIsLoadingPresets(true);
      try {
        const params = selectedOccasion !== 'all' ? { occasion: selectedOccasion } : {};
        const response = await giftService.getPresetBoxes(params);
        setPresetBoxes(response.data || []);
      } catch {
        setPresetBoxes([]);
      } finally {
        setIsLoadingPresets(false);
      }
    };
    fetchPresetBoxes();
  }, [selectedOccasion]);

  return (
    <div className="min-h-screen bg-warm-white">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary-blue min-h-[580px] md:min-h-[640px] flex items-center">

        {/* ── Scattered illustrations ─────────────────────────────── */}

        {/* Dog — large, right edge bottom */}
        <HeroIllust
          src="/icons/illustrations/dog-illustrations.png"
          className="hidden md:block"
          style={{ width: 480, height: 480, bottom: -30, right: -30, objectFit: 'contain' }}
          floatY={[0, -16, 0]}
          dur={5}
          hoverX={-20} hoverY={-28}
          clickEffect="bounce"
        />

        {/* Cat — large, left edge bottom */}
        <HeroIllust
          src="/icons/illustrations/cat-illustrations.png"
          className="hidden md:block"
          style={{ width: 460, height: 460, bottom: -20, left: -30, objectFit: 'contain', opacity: 0.85 }}
          floatY={[0, -12, 0]}
          floatRotate={[0, 4, 0]}
          dur={4.5} delay={0.6}
          hoverX={20} hoverY={-24}
          clickEffect="wiggle"
          baseRotate={0}
        />

        {/* Heart — top-right */}
        <HeroIllust
          src="/icons/illustrations/heart-illustrations.png"
          style={{ width: 110, height: 110, top: '6%', right: '14%', opacity: 0.9 }}
          floatY={[0, -12, 0]}
          floatRotate={[-6, 6, -6]}
          dur={3.8} delay={0.4}
          hoverY={-30}
          clickEffect="pulse"
        />

        {/* Small heart — upper-left area */}
        <HeroIllust
          src="/icons/illustrations/small-hear-illustrations.png"
          style={{ width: 72, height: 72, top: '12%', left: '22%', opacity: 0.85 }}
          floatY={[0, -10, 0]}
          dur={3.2} delay={1.0}
          hoverY={-22}
          clickEffect="pulse"
        />

        {/* Scribble — top-centre accent */}
        <HeroIllust
          src="/icons/illustrations/scribble-illustrations.png"
          style={{ width: 200, height: 200, top: '-20px', left: '38%', opacity: 0.22 }}
          floatY={[0, -8, 0]}
          floatRotate={[15, 22, 15]}
          dur={9} delay={0}
          hoverX={0} hoverY={-18}
          clickEffect="spin"
          baseRotate={15}
        />

        {/* Hypnotize — bottom-centre */}
        <HeroIllust
          src="/icons/illustrations/hypnotize-illustrations.png"
          style={{ width: 130, height: 130, bottom: '8%', left: '44%', opacity: 0.28 }}
          floatY={[0, -6, 0]}
          floatRotate={[0, 360, 360]}
          dur={14} delay={0}
          hoverY={-20}
          clickEffect="spin"
        />

        {/* Paw prints — subtle white tint */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {PAW_POSITIONS.map((p, i) => (
            <motion.img
              key={i}
              src={`/icons/${p.img}.png`}
              alt="" aria-hidden="true"
              className="absolute"
              style={{ left: p.left, top: p.top, width: p.size, height: p.size, opacity: 0.10, filter: 'brightness(0) invert(1)' }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            />
          ))}
        </div>

        {/* ── Text content — centred over illustrations ────────────── */}
        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-20 md:py-24 flex justify-center">
          <motion.div
            className="text-center max-w-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <motion.h1
              className="font-fredoka font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-5"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
            >
              Make Every
              <br />
              <span className="text-sunny-yellow">Moment</span>
              <br />
              Special
            </motion.h1>

            <motion.p
              className="font-nunito text-white/80 text-lg md:text-xl mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6 }}
            >
              Curated preset boxes or fully custom builds — packed with toys, treats, grooming essentials, and a personalised message.
            </motion.p>

            <motion.div
              className="flex flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.6 }}
            >
              <a
                href="#preset-boxes"
                className="flex items-center gap-2 bg-sunny-yellow text-charcoal font-fredoka font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:scale-[1.04] hover:shadow-xl transition-all duration-300"
              >
                <Package className="w-5 h-5" />
                Browse Gift Boxes
              </a>
              <Link
                to="/gifts/customize"
                className="flex items-center gap-2 bg-white/15 border-2 border-white/40 text-white font-fredoka font-bold px-8 py-3.5 rounded-2xl hover:bg-white/25 hover:scale-[1.04] transition-all duration-300"
              >
                <Wand2 className="w-5 h-5" />
                Build Your Own
              </Link>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ── Benefits strip ─────────────────────────────────────────── */}
      <section className="bg-primary-blue py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <motion.div
                  className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white mb-1"
                  initial={{ scale: 0.6, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.1, type: 'spring', stiffness: 200, damping: 14 }}
                >
                  {b.icon}
                </motion.div>
                <h4 className="font-fredoka font-bold text-white text-sm md:text-base">{b.title}</h4>
                <p className="font-nunito text-white/70 text-xs hidden md:block">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Preset Gift Boxes ──────────────────────────────────────── */}
      <section id="preset-boxes" className="relative overflow-hidden bg-sky-light py-20 px-4">

        {/* Hand-drawn illustrations */}
        <IllustrationBg section="preset" />

        {/* Leaf decorations */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {LEAVES.map((l, i) => (
            <motion.img
              key={i}
              src="/icons/leaf-layer.png"
              alt="" aria-hidden="true"
              className="absolute"
              style={{ top: l.top, left: l.left, width: l.size, height: l.size, opacity: 0.22, mixBlendMode: 'multiply' }}
              animate={{
                y: [0, -20, 10, -15, 0],
                rotate: [l.rotate, l.rotate + 10, l.rotate - 6, l.rotate + 4, l.rotate],
              }}
              transition={{ duration: l.dur, repeat: Infinity, delay: l.delay, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto max-w-7xl">

          {/* Heading */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-fredoka font-bold mb-3"
              style={{ color: '#004D6B' }}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            >
              Ready-to-Go Gift Boxes 📦
            </motion.h2>
            <motion.p
              className="font-nunito text-lg max-w-2xl mx-auto"
              style={{ color: '#004D6B', opacity: 0.82 }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              Short on time? Pick from our expertly curated preset boxes — perfectly packaged and ready to gift!
            </motion.p>
          </motion.div>

          {/* Occasion filters */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {OCCASIONS.map((occ) => (
              <motion.button
                key={occ.value}
                onClick={() => setSelectedOccasion(occ.value)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-full font-fredoka font-semibold text-sm transition-all duration-300 ${
                  selectedOccasion === occ.value
                    ? 'bg-primary-blue text-white shadow-lg scale-105'
                    : 'bg-white text-charcoal hover:bg-white shadow'
                }`}
              >
                <span>{occ.emoji}</span>
                {occ.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Boxes grid */}
          {isLoadingPresets ? (
            <div className="flex justify-center items-center py-24">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-14 h-14 border-4 border-primary-blue border-t-transparent rounded-full"
              />
            </div>
          ) : presetBoxes.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {presetBoxes.map((box, index) => (
                <PresetBoxCard key={box.id} box={box} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24"
            >
              <div className="inline-block p-6 bg-white rounded-3xl mb-5 shadow-md">
                <Package className="w-14 h-14 text-primary-blue" />
              </div>
              <p className="text-xl font-fredoka font-semibold mb-2" style={{ color: '#004D6B' }}>
                No boxes for this occasion yet.
              </p>
              <p className="font-nunito text-medium-gray mb-6">
                Try another occasion or build your own custom box!
              </p>
              <Link
                to="/gifts/customize"
                className="inline-flex items-center gap-2 bg-primary-blue text-white font-fredoka font-bold px-7 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
              >
                <Wand2 className="w-4 h-4" /> Build Your Own
              </Link>
            </motion.div>
          )}

          {/* OR divider */}
          <motion.div
            className="mt-16 flex items-center justify-center gap-6"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="h-0.5 w-28 rounded-full" style={{ background: 'linear-gradient(to right, transparent, #1BBBFF66)' }} />
            <span className="font-fredoka font-bold text-2xl" style={{ color: '#004D6B' }}>OR</span>
            <div className="h-0.5 w-28 rounded-full" style={{ background: 'linear-gradient(to left, transparent, #1BBBFF66)' }} />
          </motion.div>

        </div>
      </section>

      {/* ── Build Your Own ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 px-4" style={{ background: 'linear-gradient(160deg, #E8F7FF 0%, #FFFAF0 55%)' }}>
        <IllustrationBg section="build" />
        <div className="relative z-10 container mx-auto max-w-7xl">

          {/* ── Heading ─────────────────────────────────────────────── */}
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* <motion.div
              className="inline-flex items-center gap-2 bg-primary-blue/10 border border-primary-blue/20 rounded-full px-5 py-1.5 mb-4"
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <Wand2 className="w-3.5 h-3.5 text-primary-blue" />
              <span className="font-fredoka font-semibold text-primary-blue text-sm">Fully Customisable</span>
            </motion.div> */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <img src="/icons/illustrations/scribble-illustrations.png" alt="" aria-hidden className="w-10 h-10 opacity-40" style={{ rotate: '-18deg' }} />
              <h2 className="font-fredoka font-bold text-4xl md:text-5xl" style={{ color: '#004D6B' }}>
                Build Your Own Box
              </h2>
              <img src="/icons/illustrations/heart-illustrations.png" alt="" aria-hidden className="w-9 h-9 opacity-40" style={{ rotate: '12deg' }} />
            </div>
            <p className="font-nunito text-lg max-w-xl mx-auto" style={{ color: '#004D6B', opacity: 0.70 }}>
              Mix and match toys, treats, grooming essentials and more — in 7 fun steps.
            </p>
          </motion.div>

          {/* ── Main layout: CTA (left) + Steps grid (right) ────────── */}
          <div className="flex flex-col md:flex-row gap-6 mb-12 items-stretch">

            {/* ── CTA Showcase card ─────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -40, scale: 0.96 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="relative overflow-hidden rounded-3xl bg-primary-blue lg:w-[36%] flex-shrink-0"
              style={{ minHeight: 520, boxShadow: '0 24px 64px rgba(27,187,255,0.32)' }}
            >
              {/* ── Absolutely positioned dog illustration ── */}
              <motion.img
                src="/icons/illustrations/dog-illustrations.png"
                alt="" aria-hidden
                className="absolute bottom-0 right-0 pointer-events-none select-none"
                style={{ width: '62%', opacity: 0.58 }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* ── Accent illustrations ── */}
              <img
                src="/icons/illustrations/scribble-illustrations.png"
                alt="" aria-hidden
                className="absolute top-5 right-5 w-14 pointer-events-none select-none"
                style={{ opacity: 0.14, rotate: '28deg' }}
              />
              <img
                src="/icons/illustrations/small-hear-illustrations.png"
                alt="" aria-hidden
                className="absolute bottom-36 left-6 w-10 pointer-events-none select-none"
                style={{ opacity: 0.18, rotate: '-18deg' }}
              />

              {/* ── Content (above illustration) ── */}
              <div className="relative z-10 flex flex-col h-full p-8 pt-10">

                {/* Badge */}
                {/* <motion.div
                  className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 mb-5 self-start"
                  animate={{ opacity: [0.75, 1, 0.75] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Wand2 className="w-3.5 h-3.5 text-sunny-yellow" />
                  <span className="font-fredoka font-semibold text-white text-xs">Your box, your rules</span>
                </motion.div> */}

                {/* Heading */}
                <h3 className="font-fredoka font-bold text-white leading-tight mb-3" style={{ fontSize: 'clamp(1.8rem, 2.4vw, 2.5rem)' }}>
                  Craft the perfect<br />
                  <span className="text-sunny-yellow">gift box</span> for<br />
                  your pet.
                </h3>

                <p className="font-nunito text-white/65 text-sm mb-6 leading-relaxed" style={{ maxWidth: 210 }}>
                  Pick exactly what your pet loves across 7 curated categories.
                </p>

                {/* Checklist */}
                <div className="flex flex-col gap-2.5 mb-8">
                  {[
                    '7 fully customisable steps',
                    'Bundle discounts up to 10%',
                    'Add a personal gift note',
                    'Beautifully gift-wrapped',
                  ].map(text => (
                    <div key={text} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-sunny-yellow flex-shrink-0" />
                      <span className="font-nunito text-white/80 text-sm">{text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA button */}
                <Link
                  to="/gifts/customize"
                  className="inline-flex items-center gap-2 bg-sunny-yellow text-charcoal font-fredoka font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 self-start"
                >
                  <Wand2 className="w-4 h-4" /> Start Building
                </Link>
              </div>
            </motion.div>

            {/* ── Steps grid ────────────────────────────────────────── */}
            <div className="flex-1 grid grid-cols-3 gap-3">
              {STEPS.map((step, i) => {
                const col      = STEP_COLORS[i];
                const StepIcon = STEP_ICONS[i];
                const illust   = STEP_ILLUSTS[i];
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 40, scale: 0.93 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' }}
                    whileHover={{ y: -7, scale: 1.03 }}
                    className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-default"
                    style={{ backgroundColor: col.bg }}
                  >
                    {/* Decorative step number — absolute background */}
                    <span
                      className="absolute -top-1 right-1 font-fredoka font-bold leading-none select-none pointer-events-none"
                      style={{ fontSize: 56, color: col.text, opacity: 0.12, lineHeight: 1 }}
                    >
                      {String(step.id).padStart(2, '0')}
                    </span>

                    {/* Illustration — absolute bottom-right */}
                    <img
                      src={`/icons/illustrations/${illust}`}
                      alt="" aria-hidden
                      className="absolute bottom-0 right-0 w-12 h-12 object-contain pointer-events-none select-none"
                      style={{ opacity: 0.14 }}
                    />

                    {/* ── Centered content ── */}
                    <div className="relative z-10 flex flex-col items-center text-center p-3.5">

                      {/* Icon */}
                      <div
                        className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center mb-2"
                        style={{ color: col.text }}
                      >
                        <StepIcon className="w-5 h-5" />
                      </div>

                      {/* Title */}
                      <h3 className="font-fredoka font-bold text-lg leading-tight mb-1" style={{ color: col.text }}>
                        {step.title}
                      </h3>

                      {/* Separator */}
                      <div className="h-px w-8 rounded-full mb-1" style={{ backgroundColor: `${col.text}55` }} />

                      {/* Description */}
                      <p className="font-nunito text-sm leading-snug mb-2" style={{ color: col.text, opacity: 0.74 }}>
                        {step.desc}
                      </p>

                      {/* Progress pill */}
                      <span
                        className="font-fredoka font-semibold text-xs bg-white/30 rounded-full px-2.5 py-0.5"
                        style={{ color: col.text }}
                      >
                        {step.id} / 7
                      </span>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ── Features bar ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-3xl bg-sunny-yellow px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <img src="/icons/illustrations/scribble-illustrations.png" alt="" aria-hidden
              className="absolute -top-5 -left-5 w-24 opacity-10 pointer-events-none select-none" style={{ rotate: '-20deg' }} />
            <img src="/icons/illustrations/heart-illustrations.png" alt="" aria-hidden
              className="absolute -bottom-4 -right-4 w-20 opacity-10 pointer-events-none select-none" style={{ rotate: '15deg' }} />

            {[
              { Icon: Wand2, title: '7-Step Builder', desc: 'Total customization'  },
              { Icon: Tag,   title: 'Save up to 10%', desc: 'Bundle discounts'     },
              { Icon: Mail,  title: 'Gift Message',   desc: 'Personalize for them' },
              { Icon: Zap,   title: 'Fast Dispatch',  desc: 'Order before 2 PM'   },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: 0.12 + i * 0.10, duration: 0.45, ease: 'easeOut' }}
                className="relative z-10 text-center"
              >
                <motion.div
                  className="w-14 h-14 bg-white/55 rounded-2xl flex items-center justify-center mx-auto mb-3 text-charcoal"
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.18 + i * 0.10, type: 'spring', stiffness: 220, damping: 14 }}
                  whileHover={{ scale: 1.12, rotate: -5 }}
                >
                  <f.Icon className="w-6 h-6" />
                </motion.div>
                <h3 className="font-fredoka font-bold text-charcoal mb-0.5">{f.title}</h3>
                <p className="text-sm font-nunito text-charcoal/65">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ── Shop by pet type ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-sky-light py-20 px-4">
        <IllustrationBg section="pets" />
        <div className="relative z-10 container mx-auto max-w-5xl">

          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h2 className="text-4xl md:text-5xl font-fredoka font-bold mb-3" style={{ color: '#004D6B' }}>
              A Box for Every Pet 🐾
            </h2>
            <p className="font-nunito text-lg" style={{ color: '#004D6B', opacity: 0.8 }}>
              From playful pups to curious cats — we've got them all covered.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { emoji: '🐕', name: 'Dogs',       color: '#FF8B61', text: '#7A2800', count: '120+ items' },
              { emoji: '🐱', name: 'Cats',        color: '#1BBBFF', text: '#004D6B', count: '90+ items'  },
              { emoji: '🦜', name: 'Birds',        color: '#48FFF2', text: '#004D50', count: '50+ items'  },
              { emoji: '🐹', name: 'Small Pets',   color: '#B791FF', text: '#2D0066', count: '60+ items'  },
            ].map((pet, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 70, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: 'easeOut' }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="group"
              >
                <Link
                  to="/gifts/customize"
                  className="relative overflow-hidden flex flex-col items-center gap-3 p-7 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 text-center block"
                  style={{ backgroundColor: pet.color }}
                >
                  <span className="absolute bottom-2 right-3 text-white/10 text-5xl select-none pointer-events-none">🐾</span>
                  <div className="w-20 h-20 bg-white/25 rounded-full flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300">
                    {pet.emoji}
                  </div>
                  <h3 className="font-fredoka font-bold text-xl" style={{ color: pet.text }}>{pet.name}</h3>
                  <p className="font-nunito text-xs" style={{ color: pet.text, opacity: 0.8 }}>{pet.count}</p>
                  <div
                    className="flex items-center gap-1 font-fredoka font-semibold text-sm group-hover:gap-2 transition-all duration-300"
                    style={{ color: pet.text }}
                  >
                    <span>Build a box</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};

export default Gifts;
