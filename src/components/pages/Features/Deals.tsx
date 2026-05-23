import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Percent, Zap, Tag, TruckIcon, Gift, Star, Clock, Flame, ArrowRight } from 'lucide-react';
import { api } from '../../../services/api';
import DealSection from '../../deals/DealSection';

// ── Marquee items ──────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  '⚡ Flash Sales', 'Up to 70% Off 🔥', '🎁 Buy 1 Get 1 Free',
  '🏷️ Brand Deals', 'Free Shipping 🚚', '🌟 Member Exclusives',
  '📦 Bundle Deals', 'Daily Drops 🐾', '⚡ Flash Sales', 'Up to 70% Off 🔥',
  '🎁 Buy 1 Get 1 Free', '🏷️ Brand Deals', 'Free Shipping 🚚', '🌟 Member Exclusives',
  '📦 Bundle Deals', 'Daily Drops 🐾',
];

// ── Floating % badge positions (replaces leaf layer) ───────────────
const FLOAT_BADGES = [
  { label: '70%', top: '8%', left: '3%', size: 'text-5xl', dur: 6, delay: 0, opacity: 0.06 },
  { label: '🏷️', top: '15%', left: '90%', size: 'text-4xl', dur: 8, delay: 1.3, opacity: 0.10 },
  { label: '50%', top: '35%', left: '94%', size: 'text-6xl', dur: 7, delay: 0.5, opacity: 0.05 },
  { label: '🔥', top: '55%', left: '1%', size: 'text-5xl', dur: 9, delay: 1.8, opacity: 0.09 },
  { label: '30%', top: '65%', left: '88%', size: 'text-4xl', dur: 6, delay: 0.9, opacity: 0.06 },
  { label: '🎁', top: '78%', left: '5%', size: 'text-5xl', dur: 8, delay: 2.1, opacity: 0.08 },
  { label: '20%', top: '88%', left: '60%', size: 'text-6xl', dur: 7, delay: 0.4, opacity: 0.05 },
];

// ── Deal type filter pills ─────────────────────────────────────────
const DEAL_FILTERS = [
  { value: 'all', label: 'All Deals', emoji: '🛍️' },
  { value: 'flash_sale', label: 'Flash Sales', emoji: '⚡' },
  { value: 'bogo', label: 'BOGO', emoji: '🎁' },
  { value: 'brand_deal', label: 'Brand Deals', emoji: '🏷️' },
  { value: 'category_sale', label: 'Category', emoji: '📦' },
  { value: 'new_customer', label: 'New Members', emoji: '🌟' },
  { value: 'bulk_buy', label: 'Bulk Deals', emoji: '🛒' },
];

// ── Deal type groupings ────────────────────────────────────────────
const FLASH_TYPES = ['flash_sale', 'clearance', 'weekend_sale'];
const BOGO_TYPES = ['bogo'];
const BRAND_TYPES = ['brand_deal'];
const CATEGORY_TYPES = ['category_sale'];
const SPECIAL_TYPES = ['new_customer', 'bulk_buy', 'product_deal'];
const KNOWN_TYPES = [...FLASH_TYPES, ...BOGO_TYPES, ...BRAND_TYPES, ...CATEGORY_TYPES, ...SPECIAL_TYPES];

const Deals: React.FC = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  // ── Parallax refs ──────────────────────────────────────────────────
  const heroRef = useRef<HTMLElement>(null);
  const dealsRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const { scrollYProgress: dealsP } = useScroll({ target: dealsRef, offset: ['start end', 'end start'] });

  const heroS = useSpring(heroP, { stiffness: 55, damping: 22, restDelta: 0.001 });
  const dealsS = useSpring(dealsP, { stiffness: 55, damping: 22, restDelta: 0.001 });

  const heroTextY = useTransform(heroS, [0, 1], [0, -60]);
  const dealsBadgeY = useTransform(dealsS, [0, 1], [40, -40]);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const response = await api.get('/deals/active');
        const raw = (response.data as any)?.data ?? response.data ?? [];
        const data = Array.isArray(raw) ? raw : [];
        const now = new Date();
        const active = data.filter((d: any) => {
          const start = d.start_date ? new Date(d.start_date) : null;
          const end = d.end_date ? new Date(d.end_date) : null;
          return (!start || start <= now) && (!end || end >= now);
        });
        setDeals(active);
      } catch {
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const handleDealClick = (deal: any) => navigate(`/deals/${deal.slug}`);

  // ── Group deals by type ────────────────────────────────────────────
  const grouped = {
    flash: deals.filter(d => FLASH_TYPES.includes(d.deal_type)),
    bogo: deals.filter(d => BOGO_TYPES.includes(d.deal_type)),
    brand: deals.filter(d => BRAND_TYPES.includes(d.deal_type)),
    category: deals.filter(d => CATEGORY_TYPES.includes(d.deal_type)),
    special: deals.filter(d => SPECIAL_TYPES.includes(d.deal_type)),
    other: deals.filter(d => !KNOWN_TYPES.includes(d.deal_type)),
  };

  const hasGroups = Object.values(grouped).some(arr => arr.length > 0);

  const bogoStart = grouped.flash.length;
  const brandStart = bogoStart + grouped.bogo.length;
  const categoryStart = brandStart + grouped.brand.length;
  const specialStart = categoryStart + grouped.category.length;
  const otherStart = specialStart + grouped.special.length;

  const filteredDeals = activeFilter === 'all'
    ? deals
    : deals.filter(d =>
      activeFilter === 'flash_sale'
        ? FLASH_TYPES.includes(d.deal_type)
        : d.deal_type === activeFilter
    );

  return (
    <div className="min-h-screen bg-warm-white">

      {/* ── Hero — sky blue + grass ────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden flex flex-col items-center"
        style={{ background: 'linear-gradient(180deg, #78EEFF 0%, #A4F7FF 60%, #C6FCFF 100%)', minHeight: 680 }}
      >
        {/* Sun ☀️ — top left */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 100, height: 100,
            background: 'radial-gradient(circle, #FFE566 30%, #FFD000 100%)',
            top: '6%', left: '8%',
            boxShadow: '0 0 55px 18px rgba(255,219,0,0.28)',
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Sun rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <div
            key={i}
            className="absolute pointer-events-none rounded-full"
            style={{
              width: 3, height: 22,
              background: '#FFD000',
              opacity: 0.30,
              top: 'calc(6% + 50px)',
              left: 'calc(8% + 49px)',
              transformOrigin: '1.5px -36px',
              transform: `rotate(${deg}deg) translateY(-60px)`,
            }}
          />
        ))}

        {/* Clouds */}
        {[
          { w: 140, h: 48, top: '10%', left: '22%', delay: 0, dur: 9 },
          { w: 100, h: 36, top: '6%', left: '58%', delay: 1.2, dur: 11 },
          { w: 80, h: 30, top: '20%', left: '75%', delay: 0.6, dur: 8 },
          { w: 60, h: 22, top: '14%', left: '42%', delay: 2.0, dur: 10 },
        ].map((c, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none select-none"
            style={{ top: c.top, left: c.left }}
            animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
            transition={{ duration: c.dur, repeat: Infinity, delay: c.delay, ease: 'easeInOut' }}
          >
            <div style={{ position: 'relative', width: c.w, height: c.h }}>
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '55%', background: 'white', borderRadius: 999, opacity: 0.88 }} />
              <div style={{ position: 'absolute', bottom: '28%', left: '14%', width: '44%', height: '80%', background: 'white', borderRadius: 999, opacity: 0.88 }} />
              <div style={{ position: 'absolute', bottom: '28%', left: '42%', width: '38%', height: '65%', background: 'white', borderRadius: 999, opacity: 0.88 }} />
            </div>
          </motion.div>
        ))}

        {/* Floating ball illustration */}
        <motion.img
          src="/icons/illustrations/deals-page/ball1.png"
          alt=""
          aria-hidden
          className="absolute pointer-events-none select-none"
          style={{ width: 70, height: 70, top: '18%', right: '14%', objectFit: 'contain' }}
          animate={{ y: [0, -16, 8, -12, 0], rotate: [0, 15, -8, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ── Centered hero text ───────────────────────────────────── */}
        <motion.div
          style={{ y: heroTextY }}
          className="relative z-10 w-full flex flex-col items-center text-center pt-20 pb-52 px-6"
        >

          {/* Main heading */}
          <motion.h1
            className="font-fredoka font-bold text-6xl md:text-7xl lg:text-8xl leading-[0.95] mb-5"
            style={{ color: '#004D6B' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            Today's <span style={{ color: '#FF6B35' }}>Best</span> Deals
          </motion.h1>

          <motion.p
            className="font-nunito text-lg md:text-xl mb-8 max-w-xl leading-relaxed"
            style={{ color: '#004D6B', opacity: 0.68 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            Exclusive discounts on top-rated pet products - new deals added every single day.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-row items-center justify-center gap-4 flex-wrap mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <a
              href="#deals-content"
              className="flex items-center gap-2 font-fredoka font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:scale-[1.04] hover:shadow-xl transition-all duration-300"
              style={{ background: '#FF6B35', color: 'white' }}
            >
              <Flame className="w-5 h-5" />
              Browse Deals
            </a>
            <a
              href="#deals-content"
              onClick={() => setActiveFilter('flash_sale')}
              className="flex items-center gap-2 font-fredoka font-bold px-8 py-3.5 rounded-2xl transition-all duration-300 bg-white/60 hover:bg-white"
              style={{ color: '#004D6B', border: '2px solid rgba(0,77,107,0.25)' }}
            >
              <Zap className="w-5 h-5" />
              Flash Sales
            </a>
          </motion.div>

          {/* Inline stat pills */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            {[
              { val: '70%', label: 'Max Savings', color: '#FF6B35' },
              { val: '100+', label: 'Active Deals', color: '#004D6B' },
              { val: '24h', label: 'Deal Refresh', color: '#5BC44A' },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-2xl px-5 py-2"
                style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.9)' }}
              >
                <span className="font-fredoka font-bold text-xl" style={{ color: s.color }}>{s.val}</span>
                <span className="font-nunito text-xs" style={{ color: '#004D6B', opacity: 0.65 }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Pet illustrations + grass strip ──────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none">
          {/* grass1.png as the full-width ground */}
          <img
            src="/icons/illustrations/deals-page/grass1.png"
            alt=""
            aria-hidden
            className="w-full"
            style={{ display: 'block', objectFit: 'cover', objectPosition: 'top', height: 120 }}
          />

          {/* Dog — bottom left, sitting on grass */}
          <motion.img
            src="/icons/illustrations/deals-page/dog1.png"
            alt=""
            aria-hidden
            className="absolute pointer-events-none"
            style={{ width: 180, height: 180, bottom: 60, left: '6%', objectFit: 'contain' }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
            transition={{
              opacity: { duration: 0.6, delay: 0.3 },
              x: { duration: 0.6, delay: 0.3 },
              y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
            }}
          />

          {/* Cat — bottom right, sitting on grass */}
          <motion.img
            src="/icons/illustrations/deals-page/cat1.png"
            alt=""
            aria-hidden
            className="absolute pointer-events-none"
            style={{ width: 160, height: 160, bottom: 64, right: '6%', objectFit: 'contain' }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
            transition={{
              opacity: { duration: 0.6, delay: 0.45 },
              x: { duration: 0.6, delay: 0.45 },
              y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 },
            }}
          />
        </div>
      </section>

      {/* ── Scrolling marquee ticker ────────────────────────────────── */}
      <div
        className="overflow-hidden py-3.5"
        style={{ background: '#FFDB4D', borderTop: '2px solid #7BE266', borderBottom: '2px solid rgba(0,0,0,0.06)' }}
      >
        <motion.div
          className="flex gap-10 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          style={{ width: 'max-content' }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="font-fredoka font-semibold text-charcoal text-sm">
              {item}
              <span className="mx-5 opacity-40">•</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Stats / benefits strip — grass green ───────────────────── */}
      <section style={{ background: '#7BE266' }} className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { Icon: Zap, title: 'Flash Deals', desc: 'New deals added daily' },
              { Icon: Tag, title: 'Verified Savings', desc: 'Authentic discounts always' },
              { Icon: TruckIcon, title: 'Free Delivery', desc: 'On orders above Rs. 2,000' },
              { Icon: Star, title: 'Member Exclusives', desc: 'Extra savings for members' },
            ].map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <motion.div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-1"
                  style={{ background: 'rgba(255,255,255,0.50)', color: '#004D6B' }}
                  initial={{ scale: 0.6, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.1, type: 'spring', stiffness: 200, damping: 14 }}
                >
                  <b.Icon className="w-6 h-6" />
                </motion.div>
                <h4 className="font-fredoka font-bold text-sm md:text-base" style={{ color: '#004D6B' }}>{b.title}</h4>
                <p className="font-nunito text-xs hidden md:block" style={{ color: '#004D6B', opacity: 0.65 }}>{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Deals content — warm-white, no leaves ──────────────────── */}
      <section ref={dealsRef} id="deals-content" className="relative overflow-hidden bg-warm-white py-20 px-4">

        {/* Floating % / emoji background badges */}
        <motion.div style={{ y: dealsBadgeY }} className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {FLOAT_BADGES.map((b, i) => (
            <motion.span
              key={i}
              className={`absolute font-fredoka font-bold ${b.size}`}
              style={{ top: b.top, left: b.left, opacity: b.opacity, color: '#FF8B61' }}
              animate={{ y: [0, -18, 8, -12, 0] }}
              transition={{ duration: b.dur, repeat: Infinity, delay: b.delay, ease: 'easeInOut' }}
            >
              {b.label}
            </motion.span>
          ))}
        </motion.div>

        <div className="relative z-10 container mx-auto max-w-7xl">

          {/* ── Filter pills — rectangular tag style, not rounded-full ── */}
          <motion.div
            className="flex flex-wrap justify-center gap-2.5 mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {DEAL_FILTERS.map(f => (
              <motion.button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-xl font-fredoka font-semibold text-sm transition-all duration-250 ${activeFilter === f.value
                  ? 'text-charcoal shadow-md'
                  : 'bg-white text-charcoal hover:bg-white shadow-sm border border-gray-100'
                  }`}
                style={activeFilter === f.value ? { background: '#FFDB4D' } : {}}
              >
                <span>{f.emoji}</span>
                {f.label}
              </motion.button>
            ))}
          </motion.div>

          {/* ── Loading ─────────────────────────────────────────────────── */}
          {loading && (
            <div className="flex justify-center items-center py-28">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-14 h-14 border-4 border-t-transparent rounded-full"
                style={{ borderColor: '#FF8B61', borderTopColor: 'transparent' }}
              />
            </div>
          )}

          {/* ── Empty state ──────────────────────────────────────────────── */}
          {!loading && filteredDeals.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-28"
            >
              <div className="inline-block p-6 bg-white rounded-3xl mb-5 shadow-md">
                <Tag className="w-14 h-14" style={{ color: '#FF8B61' }} />
              </div>
              <p className="text-xl font-fredoka font-semibold mb-2 text-charcoal">
                No deals available right now.
              </p>
              <p className="font-nunito text-medium-gray">
                Check back soon — new deals drop daily!
              </p>
            </motion.div>
          )}

          {/* ── Filtered single-section view ─────────────────────────────── */}
          {!loading && activeFilter !== 'all' && filteredDeals.length > 0 && (
            <DealSection
              title={DEAL_FILTERS.find(f => f.value === activeFilter)?.label ?? 'Deals'}
              subtitle="Hand-picked deals just for you"
              deals={filteredDeals}
              onDealClick={handleDealClick}
              startIndex={0}
            />
          )}

          {/* ── Grouped all-deals view ────────────────────────────────────── */}
          {!loading && activeFilter === 'all' && (hasGroups || deals.length > 0) && (
            <>
              {grouped.flash.length > 0 && (
                <DealSection title="⚡ Flash Sales" subtitle="Limited time — grab them before they're gone!" deals={grouped.flash} onDealClick={handleDealClick} startIndex={0} />
              )}
              {grouped.bogo.length > 0 && (
                <DealSection title="🎁 Buy One Get One Free" subtitle="Double the fun for your furry friend" deals={grouped.bogo} onDealClick={handleDealClick} startIndex={bogoStart} />
              )}
              {grouped.brand.length > 0 && (
                <DealSection title="🏷️ Brand Exclusive Deals" subtitle="Special prices from your favourite brands" deals={grouped.brand} onDealClick={handleDealClick} startIndex={brandStart} />
              )}
              {grouped.category.length > 0 && (
                <DealSection title="📦 Category Special Deals" subtitle="Shop by what your pet needs most" deals={grouped.category} onDealClick={handleDealClick} startIndex={categoryStart} />
              )}
              {grouped.special.length > 0 && (
                <DealSection title="🌟 Special Offers & Promotions" subtitle="Hand-picked deals for our valued customers" deals={grouped.special} onDealClick={handleDealClick} startIndex={specialStart} />
              )}
              {grouped.other.length > 0 && (
                <DealSection title="🎉 More Great Deals" subtitle="Don't miss these amazing offers" deals={grouped.other} onDealClick={handleDealClick} startIndex={otherStart} />
              )}
              {!hasGroups && deals.length > 0 && (
                <DealSection title="🛍️ All Deals" subtitle="Amazing offers waiting for you" deals={deals} onDealClick={handleDealClick} startIndex={0} />
              )}
            </>
          )}

          {/* ── Features bar — sky + grass themed ─────────────────────── */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative overflow-hidden rounded-3xl px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 mt-6"
              style={{ background: 'linear-gradient(135deg, #A4F7FF 0%, #C6FCFF 50%, #CBFAB5 100%)' }}
            >
              {/* Grass accent line at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1.5 rounded-b-3xl"
                style={{ background: 'linear-gradient(90deg, #7BE266, #5BC44A, #7BE266)' }}
              />
              {/* Sun accent top-right */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255,219,0,0.20) 0%, transparent 70%)',
                  transform: 'translate(30%, -30%)',
                }}
              />

              {[
                { Icon: Flame, title: 'Daily Deals', desc: 'Fresh offers every day' },
                { Icon: Percent, title: 'Up to 70% Off', desc: 'Real discounts guaranteed' },
                { Icon: Clock, title: 'Limited Stock', desc: "Act fast before they're gone" },
                { Icon: Gift, title: 'Member Perks', desc: 'Extra savings with loyalty' },
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
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'rgba(255,255,255,0.70)', color: '#FF6B35' }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.18 + i * 0.10, type: 'spring', stiffness: 220, damping: 14 }}
                    whileHover={{ scale: 1.12, rotate: -5 }}
                  >
                    <f.Icon className="w-6 h-6" />
                  </motion.div>
                  <h3 className="font-fredoka font-bold mb-0.5" style={{ color: '#004D6B' }}>{f.title}</h3>
                  <p className="text-sm font-nunito" style={{ color: '#004D6B', opacity: 0.60 }}>{f.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

        </div>
      </section>
    </div>
  );
};

export default Deals;
