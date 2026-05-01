import React, { useState, useEffect, type JSX } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  CreditCard, Award, Trophy, Gift, Users, History,
  Star, Crown, TrendingUp, Sparkles, Heart, Zap,
} from 'lucide-react';
import { useLoyalty } from '../../../hooks/useLoyalty';
import { useAuth } from '../../../hooks/useAuth';
import { LoyaltyTier } from '../../../types/loyalty';
import LoyaltyDashboard from '../../loyalty/LoyaltyDashboard';
import PointsHistory from '../../loyalty/PointsHistory';
import BadgesGrid from '../../loyalty/BadgesGrid';
import ExclusiveDeals from '../../loyalty/ExclusiveDeals';
import ReferralCard from '../../loyalty/ReferralCard';
import RewardsGrid from '../../loyalty/RewardsGrid';

// ── Paw prints ─────────────────────────────────────────────────────────
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

// ── Illustrations ─────────────────────────────────────────────────────
const ILLUST_POSITIONS = [
  { src: 'heart-illustrations.png',     left: '5%',  top: '15%', size:  90, rotate: -18, dur: 7,  delay: 0.3, opacity: 0.18, section: 'tabs' },
  { src: 'dog-illustrations.png',       left: '88%', top: '8%',  size: 110, rotate:  20, dur: 8,  delay: 0.9, opacity: 0.15, section: 'tabs' },
  { src: 'scribble-illustrations.png',  left: '92%', top: '60%', size:  85, rotate: -30, dur: 6,  delay: 1.4, opacity: 0.14, section: 'tabs' },
  { src: 'hypnotize-illustrations.png', left: '2%',  top: '65%', size:  95, rotate:  12, dur: 9,  delay: 0.6, opacity: 0.13, section: 'tabs' },
  { src: 'small-hear-illustrations.png',left: '50%', top: '92%', size:  65, rotate:  25, dur: 5,  delay: 2.0, opacity: 0.16, section: 'tabs' },
  { src: 'cat-illustrations.png',       left: '40%', top: '3%',  size: 100, rotate:  -5, dur: 7,  delay: 1.2, opacity: 0.13, section: 'tabs' },
];

// ── Leaves ────────────────────────────────────────────────────────────
const LEAVES = [
  { top:  '2%', left:  '-2%', size: 260, rotate:   15, dur: 7,  delay: 0   },
  { top:  '5%', left:  '78%', size: 280, rotate:  -55, dur: 9,  delay: 1.2 },
  { top: '55%', left:  '88%', size: 260, rotate: -110, dur: 7,  delay: 2.1 },
  { top: '62%', left:   '8%', size: 280, rotate:  300, dur: 9,  delay: 0.8 },
  { top: '30%', left:   '3%', size: 270, rotate:  170, dur: 8,  delay: 1.8 },
  { top: '74%', left:  '65%', size: 250, rotate:  130, dur: 6,  delay: 1.5 },
];

// ── Card color palette ────────────────────────────────────────────────
const CARD_COLORS = [
  { bg: '#FF8B61', text: '#7A2800' },
  { bg: '#1BBBFF', text: '#004D6B' },
  { bg: '#48FFF2', text: '#004D50' },
  { bg: '#FFDB4D', text: '#7A5500' },
  { bg: '#FC6884', text: '#7A0030' },
  { bg: '#B791FF', text: '#2D0066' },
];

// ── Benefits strip data ───────────────────────────────────────────────
const BENEFITS = [
  { icon: <TrendingUp className="w-7 h-7" />, title: 'Earn Points',    desc: '1 point per Rs. 100 spent'          },
  { icon: <Crown      className="w-7 h-7" />, title: 'Unlock Tiers',   desc: 'Bronze → Silver → Gold → Platinum'  },
  { icon: <Gift       className="w-7 h-7" />, title: 'Redeem Rewards', desc: 'Discounts, free shipping & more'    },
  { icon: <Users      className="w-7 h-7" />, title: 'Refer & Earn',   desc: '500 points per successful referral' },
];

// ── Tier helpers (mirrors LoyaltyDashboard) ───────────────────────────
const TIER_META: Record<string, { emoji: string; label: string }> = {
  [LoyaltyTier.BRONZE]:   { emoji: '🥉', label: 'Bronze'   },
  [LoyaltyTier.SILVER]:   { emoji: '🥈', label: 'Silver'   },
  [LoyaltyTier.GOLD]:     { emoji: '🥇', label: 'Gold'     },
  [LoyaltyTier.PLATINUM]: { emoji: '💎', label: 'Platinum' },
};

function getTierGradient(tier: LoyaltyTier): string {
  switch (tier) {
    case LoyaltyTier.SILVER:   return 'bg-gradient-to-br from-slate-500 via-gray-400 to-blue-gray-600';
    case LoyaltyTier.GOLD:     return 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500';
    case LoyaltyTier.PLATINUM: return 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600';
    default:                   return 'bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-600';
  }
}

function getTierOverlay(tier: LoyaltyTier): string {
  switch (tier) {
    case LoyaltyTier.SILVER:   return 'bg-gradient-to-br from-white/5 via-transparent to-slate-800/20';
    case LoyaltyTier.GOLD:     return 'bg-gradient-to-br from-yellow-200/10 via-transparent to-amber-800/20';
    case LoyaltyTier.PLATINUM: return 'bg-gradient-to-br from-indigo-200/10 via-purple-400/10 to-pink-800/20';
    default:                   return 'bg-gradient-to-br from-transparent via-orange-600/15 to-amber-700/20';
  }
}

function getTierPattern(tier: LoyaltyTier): JSX.Element {
  switch (tier) {
    case LoyaltyTier.SILVER:
      return (
        <div className="opacity-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
          <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-white/30 rounded-lg rotate-45 -translate-x-8 -translate-y-8" />
        </div>
      );
    case LoyaltyTier.GOLD:
      return (
        <div className="opacity-25">
          <div className="absolute top-2 right-2 w-6 h-6 bg-white/30 rounded-full" />
          <div className="absolute top-6 right-8 w-4 h-4 bg-white/20 rounded-full" />
          <div className="absolute bottom-4 left-4 w-28 h-28 border-2 border-white/30 rounded-full" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border border-white/20 rounded-full" />
        </div>
      );
    case LoyaltyTier.PLATINUM:
      return (
        <div className="opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10" />
          <div className="absolute top-4 right-6 w-12 h-1 bg-white/40 rounded-full" />
          <div className="absolute top-8 right-6 w-16 h-1 bg-white/30 rounded-full" />
          <div className="absolute top-12 right-6 w-8 h-1 bg-white/35 rounded-full" />
          <div className="absolute bottom-6 left-6 w-20 h-20 border border-white/25 rounded-lg rotate-12" />
        </div>
      );
    default:
      return (
        <div className="opacity-15">
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full border-2 border-white/40" />
          <div className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/30" />
          <div className="absolute bottom-6 left-6 w-24 h-24 rounded-full border border-white/25" />
          <div className="absolute bottom-10 left-10 w-8 h-8 rounded-full bg-white/20" />
        </div>
      );
  }
}

function formatCardNumber(cardNumber: string): string {
  if (cardNumber?.startsWith('PAW')) {
    const nums = cardNumber.substring(3);
    return `PAW${nums.substring(0, 1)} ${nums.substring(1, 5)} ${nums.substring(5)}`;
  }
  return cardNumber ?? '';
}

// ── Illustration BG layer ─────────────────────────────────────────────
const IllustBg: React.FC<{ section: string }> = ({ section }) => (
  <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
    {ILLUST_POSITIONS.filter(il => il.section === section).map((il, i) => (
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

// ── Interactive hero illustration (matches Gifts page) ────────────────
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
    if (state === 'hovered') return { x: hoverX, y: hoverY, scale: 1.14, rotate: baseRotate + 6 };
    if (state === 'clicked') {
      if (clickEffect === 'bounce') return { y: [0, -55, 14, -28, 5, 0], scale: [1, 1.28, 0.88, 1.16, 0.96, 1], rotate: baseRotate };
      if (clickEffect === 'spin')   return { rotate: [baseRotate, baseRotate + 360], scale: [1, 1.18, 1] };
      if (clickEffect === 'wiggle') return { x: [0, -18, 18, -12, 12, -6, 6, 0], rotate: [baseRotate, baseRotate - 14, baseRotate + 14, baseRotate] };
      if (clickEffect === 'pulse')  return { scale: [1, 1.55, 0.82, 1.28, 0.94, 1], rotate: baseRotate };
    }
    if (state === 'returning') return { x: 0, y: 0, scale: 1, rotate: baseRotate };
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

// ─────────────────────────────────────────────────────────────────────
const LoyaltyCards: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { loyaltyCard, registerLoyaltyCard, isLoading } = useLoyalty();
  const [activeTab, setActiveTab]       = useState('dashboard');
  const [autoRegistering, setAutoRegistering] = useState(false);

  // Window scroll — avoids the "ref not hydrated" error from early-return paths
  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, { stiffness: 55, damping: 22, restDelta: 0.001 });

  const heroIllustY = useTransform(smoothY, [0, 700],  [0,  -150]);
  const heroPawY    = useTransform(smoothY, [0, 700],  [0,   -70]);
  const heroTextY   = useTransform(smoothY, [0, 700],  [0,   -45]);
  const tabsLeafY   = useTransform(smoothY, [600, 1800], [50,  -60]);

  // Auto-register loyalty card for logged-in users without one
  useEffect(() => {
    if (isAuthenticated && !loyaltyCard && !isLoading && !autoRegistering) {
      setAutoRegistering(true);
      registerLoyaltyCard().finally(() => setAutoRegistering(false));
    }
  }, [isAuthenticated, loyaltyCard, isLoading, registerLoyaltyCard, autoRegistering]);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard',      icon: TrendingUp },
    { id: 'rewards',   name: 'Rewards',         icon: Gift       },
    { id: 'history',   name: 'History',         icon: History    },
    // { id: 'badges',    name: 'Badges',          icon: Star       }, // hidden — feature ready, not yet launched
    // { id: 'deals',     name: 'Exclusive Deals', icon: Crown      }, // hidden — feature ready, not yet launched
    { id: 'referral',  name: 'Refer Friends',   icon: Users      },
  ];

  const tier     = loyaltyCard?.tier ?? LoyaltyTier.BRONZE;
  const tierMeta = TIER_META[tier] ?? { emoji: '🥉', label: 'Bronze' };
  const points   = loyaltyCard?.points ?? 0;

  // ── Loading state ──────────────────────────────────────────────────
  if (isAuthenticated && !loyaltyCard && (isLoading || autoRegistering)) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-8 py-12 bg-white rounded-3xl shadow-xl max-w-sm w-full mx-4"
        >
          <div className="relative w-24 h-24 mx-auto mb-6">
            <img
              src="/icons/illustrations/hypnotize-illustrations.png"
              alt="" aria-hidden="true"
              className="w-24 h-24 object-contain animate-spin"
              style={{ animationDuration: '3s' }}
            />
          </div>
          <h2 className="text-2xl font-fredoka font-bold text-charcoal mb-2">
            Setting Up Your Rewards
          </h2>
          <p className="font-nunito text-medium-gray text-sm mb-6">
            Creating your loyalty card and preparing rewards...
          </p>
          <div className="flex items-center justify-center gap-2">
            {[0, 150, 300].map(d => (
              <div
                key={d}
                className="w-2.5 h-2.5 rounded-full bg-primary-blue animate-bounce"
                style={{ animationDelay: `${d}ms` }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Unauthenticated state ──────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-warm-white">

        {/* Hero */}
        <section className="relative overflow-hidden bg-primary-blue min-h-[580px] md:min-h-[640px] flex items-center">

          {/* Illustrations layer */}
          <motion.div style={{ y: heroIllustY }} className="absolute inset-0">
            <HeroIllust
              src="/icons/illustrations/dog-illustrations.png"
              className="hidden md:block"
              style={{ width: 420, height: 420, bottom: -20, right: -20, objectFit: 'contain' }}
              floatY={[0, -16, 0]} dur={5} hoverX={-20} hoverY={-28} clickEffect="bounce"
            />
            <HeroIllust
              src="/icons/illustrations/cat-illustrations.png"
              className="hidden md:block"
              style={{ width: 400, height: 400, bottom: -16, left: -24, objectFit: 'contain', opacity: 0.85 }}
              floatY={[0, -12, 0]} floatRotate={[0, 4, 0]} dur={4.5} delay={0.6}
              hoverX={20} hoverY={-24} clickEffect="wiggle"
            />
            <HeroIllust
              src="/icons/illustrations/heart-illustrations.png"
              style={{ width: 100, height: 100, top: '8%', right: '16%', opacity: 0.9 }}
              floatY={[0, -12, 0]} floatRotate={[-6, 6, -6]} dur={3.8} delay={0.4}
              hoverY={-30} clickEffect="pulse"
            />
            <HeroIllust
              src="/icons/illustrations/small-hear-illustrations.png"
              style={{ width: 68, height: 68, top: '14%', left: '24%', opacity: 0.85 }}
              floatY={[0, -10, 0]} dur={3.2} delay={1.0} hoverY={-22} clickEffect="pulse"
            />
            <HeroIllust
              src="/icons/illustrations/scribble-illustrations.png"
              style={{ width: 180, height: 180, top: '-18px', left: '40%', opacity: 0.20 }}
              floatY={[0, -8, 0]} floatRotate={[15, 22, 15]} dur={9} delay={0}
              hoverY={-18} clickEffect="spin" baseRotate={15}
            />
            <HeroIllust
              src="/icons/illustrations/hypnotize-illustrations.png"
              style={{ width: 120, height: 120, bottom: '10%', left: '46%', opacity: 0.28 }}
              floatY={[0, -6, 0]} floatRotate={[0, 360, 360]} dur={14} delay={0}
              hoverY={-20} clickEffect="spin"
            />
          </motion.div>

          {/* Paw prints layer */}
          <motion.div style={{ y: heroPawY }} className="absolute inset-0 pointer-events-none select-none">
            {PAW_POSITIONS.map((p, i) => (
              <motion.img
                key={i} src={`/icons/${p.img}.png`} alt="" aria-hidden="true"
                className="absolute"
                style={{ left: p.left, top: p.top, width: p.size, height: p.size, opacity: 0.10, filter: 'brightness(0) invert(1)' }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
              />
            ))}
          </motion.div>

          {/* Text content */}
          <motion.div style={{ y: heroTextY }} className="relative z-10 w-full">
            <div className="container mx-auto px-6 lg:px-12 py-20 md:py-24 flex justify-center">
              <motion.div
                className="text-center max-w-2xl"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 mb-6"
                >
                  <span className="w-2 h-2 bg-sunny-yellow rounded-full animate-pulse" />
                  <span className="font-fredoka font-semibold text-white text-sm">Pawsome Rewards Program</span>
                </motion.div>

                <motion.h1
                  className="font-fredoka font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-5"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.7 }}
                >
                  Earn Points,
                  <br />
                  <span className="text-sunny-yellow">Unlock Perks</span>
                </motion.h1>

                <motion.p
                  className="font-nunito text-white/80 text-lg md:text-xl mb-10 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.6 }}
                >
                  Shop, earn points on every order, climb the tier ladder and unlock exclusive deals, free shipping, and premium rewards — all for your furry family.
                </motion.p>

                {/* Feature cards */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38, duration: 0.6 }}
                >
                  {[
                    { icon: <Award className="w-6 h-6" />, title: 'Earn Points', desc: '1 point per Rs. 100 spent', color: CARD_COLORS[0] },
                    { icon: <Trophy className="w-6 h-6" />, title: 'Unlock Tiers', desc: 'Bronze to Platinum', color: CARD_COLORS[3] },
                    { icon: <Gift className="w-6 h-6" />, title: 'Get Rewards', desc: 'Deals & discounts', color: CARD_COLORS[4] },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 + i * 0.08, duration: 0.5 }}
                      className="rounded-2xl p-5 text-center"
                      style={{ background: item.color.bg }}
                    >
                      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/30 mx-auto mb-3"
                        style={{ color: item.color.text }}>
                        {item.icon}
                      </div>
                      <p className="font-fredoka font-bold text-base" style={{ color: item.color.text }}>{item.title}</p>
                      <p className="font-nunito text-xs mt-0.5 opacity-80" style={{ color: item.color.text }}>{item.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.button
                  onClick={() => window.location.href = '/login'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.5 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-sunny-yellow text-charcoal font-fredoka font-bold px-10 py-4 rounded-2xl shadow-lg text-lg hover:brightness-105 transition-all"
                >
                  Sign In to Start Earning 🐾
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Benefits strip */}
        <section className="bg-primary-blue py-8 px-4" style={{ borderTop: '2px solid rgba(255,255,255,0.12)' }}>
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
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl text-white" style={{ background: 'rgba(255,255,255,0.18)' }}>
                    {b.icon}
                  </div>
                  <p className="font-fredoka font-bold text-white text-sm">{b.title}</p>
                  <p className="font-nunito text-white/65 text-xs">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </div>
    );
  }

  // ── Authenticated main view ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-warm-white">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary-blue min-h-[520px] md:min-h-[580px] flex items-center">

        {/* Illustrations layer */}
        <motion.div style={{ y: heroIllustY }} className="absolute inset-0">
          <HeroIllust
            src="/icons/illustrations/dog-illustrations.png"
            className="hidden md:block"
            style={{ width: 400, height: 400, bottom: -16, right: -20, objectFit: 'contain' }}
            floatY={[0, -16, 0]} dur={5} hoverX={-20} hoverY={-28} clickEffect="bounce"
          />
          <HeroIllust
            src="/icons/illustrations/cat-illustrations.png"
            className="hidden md:block"
            style={{ width: 380, height: 380, bottom: -12, left: -24, objectFit: 'contain', opacity: 0.85 }}
            floatY={[0, -12, 0]} floatRotate={[0, 4, 0]} dur={4.5} delay={0.6}
            hoverX={20} hoverY={-24} clickEffect="wiggle"
          />
          <HeroIllust
            src="/icons/illustrations/heart-illustrations.png"
            style={{ width: 90, height: 90, top: '8%', right: '18%', opacity: 0.9 }}
            floatY={[0, -12, 0]} floatRotate={[-6, 6, -6]} dur={3.8} delay={0.4}
            hoverY={-30} clickEffect="pulse"
          />
          <HeroIllust
            src="/icons/illustrations/small-hear-illustrations.png"
            style={{ width: 64, height: 64, top: '14%', left: '24%', opacity: 0.85 }}
            floatY={[0, -10, 0]} dur={3.2} delay={1.0} hoverY={-22} clickEffect="pulse"
          />
          <HeroIllust
            src="/icons/illustrations/scribble-illustrations.png"
            style={{ width: 170, height: 170, top: '-16px', left: '40%', opacity: 0.18 }}
            floatY={[0, -8, 0]} floatRotate={[15, 22, 15]} dur={9} delay={0}
            hoverY={-18} clickEffect="spin" baseRotate={15}
          />
          <HeroIllust
            src="/icons/illustrations/hypnotize-illustrations.png"
            style={{ width: 110, height: 110, bottom: '10%', left: '46%', opacity: 0.26 }}
            floatY={[0, -6, 0]} floatRotate={[0, 360, 360]} dur={14} delay={0}
            hoverY={-20} clickEffect="spin"
          />
        </motion.div>

        {/* Paw prints layer */}
        <motion.div style={{ y: heroPawY }} className="absolute inset-0 pointer-events-none select-none">
          {PAW_POSITIONS.map((p, i) => (
            <motion.img
              key={i} src={`/icons/${p.img}.png`} alt="" aria-hidden="true"
              className="absolute"
              style={{ left: p.left, top: p.top, width: p.size, height: p.size, opacity: 0.10, filter: 'brightness(0) invert(1)' }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>

        {/* Text content */}
        <motion.div style={{ y: heroTextY }} className="relative z-10 w-full">
          <div className="container mx-auto px-6 lg:px-12 py-16 md:py-20 flex justify-center">
            <motion.div
              className="text-center max-w-2xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              {/* Welcome greeting */}
              <motion.p
                className="font-nunito text-white/70 text-base mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Welcome back, <span className="text-white font-semibold">{user?.name || 'Loyal Member'}</span> 🐾
              </motion.p>

              {/* Title */}
              <motion.h1
                className="font-fredoka font-bold text-5xl md:text-6xl text-white leading-tight mb-4"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7 }}
              >
                Your <span className="text-sunny-yellow">Rewards</span>
              </motion.h1>

              {/* Loyalty Card Visual */}
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.28, duration: 0.6, ease: 'easeOut' }}
                className="relative w-full max-w-sm mx-auto mb-8"
              >
                {/* Card */}
                <div className={`relative w-full h-52 rounded-2xl shadow-2xl overflow-hidden ${getTierGradient(tier)}`}>
                  <div className="absolute inset-0">{getTierPattern(tier)}</div>
                  <div className={`absolute inset-0 ${getTierOverlay(tier)}`} />
                  <div className="relative h-full p-6 flex flex-col justify-between text-white">
                    {/* Top row */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-fredoka font-bold">Pawsome</h3>
                        <p className="text-xs font-fredoka opacity-80">Loyalty Card</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl mb-0.5">{tierMeta.emoji}</div>
                        <p className="text-xs font-fredoka font-semibold uppercase tracking-wider">{tierMeta.label}</p>
                      </div>
                    </div>
                    {/* Middle — points */}
                    <div className="text-center">
                      <p className="text-3xl font-fredoka font-bold tracking-wider text-sunny-yellow">
                        {points.toLocaleString()}
                      </p>
                      <p className="text-xs font-fredoka opacity-80 mt-0.5">POINTS AVAILABLE</p>
                    </div>
                    {/* Bottom row */}
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm font-fredoka font-semibold tracking-widest">
                          {loyaltyCard ? formatCardNumber(loyaltyCard.cardNumber) : ''}
                        </p>
                        <p className="text-xs font-fredoka opacity-70">
                          MEMBER SINCE {loyaltyCard ? new Date(loyaltyCard.joinDate).getFullYear() : '—'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="w-7 h-4 bg-white/20 rounded border border-white/30 mb-1" />
                        <div className="w-9 h-2.5 bg-white/15 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Depth shadow */}
                <div className="absolute -bottom-2 left-2 right-2 h-52 bg-black/20 rounded-2xl -z-10" />
              </motion.div>

              {/* Expiry note */}
              <p className="font-nunito text-white/55 text-xs text-center -mt-4 mb-4">
                🕐 Points expire on <span className="text-white/80 font-semibold">31st December 2026</span>
              </p>

              {/* CTAs */}
              <motion.div
                className="flex flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.6 }}
              >
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab('rewards')}
                  className="flex items-center gap-2 bg-sunny-yellow text-charcoal font-fredoka font-bold px-7 py-3.5 rounded-2xl shadow-lg hover:brightness-105 transition-all"
                >
                  <Gift className="w-5 h-5" />
                  Redeem Rewards
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab('history')}
                  className="flex items-center gap-2 bg-white/15 border-2 border-white/40 text-white font-fredoka font-bold px-7 py-3.5 rounded-2xl hover:bg-white/25 transition-all"
                >
                  <History className="w-5 h-5" />
                  View History
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Benefits strip ─────────────────────────────────────────────── */}
      <section className="bg-primary-blue py-7 px-4" style={{ borderTop: '2px solid rgba(255,255,255,0.12)' }}>
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
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl text-white" style={{ background: 'rgba(255,255,255,0.18)' }}>
                  {b.icon}
                </div>
                <p className="font-fredoka font-bold text-white text-sm">{b.title}</p>
                <p className="font-nunito text-white/65 text-xs">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tabs + Content ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-warm-white py-10 px-4 min-h-[600px]">

        {/* Leaf parallax layer */}
        <motion.div style={{ y: tabsLeafY }} className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {LEAVES.map((l, i) => (
            <motion.img
              key={i}
              src="/icons/leaf-layer.png"
              alt="" aria-hidden="true"
              className="absolute"
              style={{ top: l.top, left: l.left, width: l.size, height: l.size, rotate: `${l.rotate}deg`, mixBlendMode: 'multiply', opacity: 0.22 }}
              animate={{ rotate: [l.rotate, l.rotate + 6, l.rotate - 3, l.rotate] }}
              transition={{ duration: l.dur, repeat: Infinity, delay: l.delay, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>

        {/* Scattered illustration BG */}
        <IllustBg section="tabs" />

        <div className="container mx-auto relative z-10">

          {/* Tab navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-2 mb-8 overflow-x-auto"
          >
            <div className="flex space-x-2 min-w-max">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={activeTab !== tab.id ? { scale: 1.03 } : {}}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-fredoka font-medium transition-all whitespace-nowrap text-sm ${
                    activeTab === tab.id
                      ? 'bg-primary-blue text-white shadow-md'
                      : 'text-charcoal hover:bg-soft-gray'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Tab content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {activeTab === 'dashboard' && <LoyaltyDashboard onNavigateToRewards={() => setActiveTab('rewards')} />}
            {activeTab === 'rewards'   && <RewardsGrid />}
            {activeTab === 'history'   && <PointsHistory />}
            {activeTab === 'badges'    && <BadgesGrid />}
            {activeTab === 'deals'     && <ExclusiveDeals />}
            {activeTab === 'referral'  && <ReferralCard />}
          </motion.div>

        </div>
      </section>

    </div>
  );
};

export default LoyaltyCards;
