import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, User, LogOut, Heart, Gift, Percent, Trophy, Menu, X, Dog, Cat, Bird, Rabbit } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { debounce, throttle } from '../../utils/performance';

interface Category {
  name: string;
  link: string;
  icon?: React.ReactNode;
}

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.95 },
  show:   { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.15, ease: 'easeOut' as const } },
  exit:   { opacity: 0, y: -8, scale: 0.95, transition: { duration: 0.1  } },
};

const navItemVariants = {
  hidden: { opacity: 0, y: -10 },
  show:   (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.3, ease: 'easeOut' as const },
  }),
};

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery]           = useState('');
  const [showUserMenu, setShowUserMenu]         = useState(false);
  const [showMobileMenu, setShowMobileMenu]     = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isScrolled, setIsScrolled]             = useState(false);
  const [isMobile, setIsMobile]                 = useState(() => window.innerWidth < 768);

  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const categories = useMemo<Category[]>(() => [
    { name: 'Daily Deals',   link: '/deals',         icon: <Percent className="w-5 h-5" /> },
    { name: 'Gift Boxes',    link: '/gifts',          icon: <Gift    className="w-5 h-5" /> },
    { name: 'Rewards',       link: '/loyalty-cards',  icon: <Trophy  className="w-5 h-5" /> },
    { name: 'Subscriptions', link: '/subscriptions',  icon: <Heart   className="w-5 h-5" /> },
  ], []);

  const petCategories = useMemo(() => [
    { name: 'Dogs',       link: '/dogs',          icon: <Dog    className="w-5 h-5" /> },
    { name: 'Cats',       link: '/cats',           icon: <Cat    className="w-5 h-5" /> },
    { name: 'Birds',      link: '/birds',          icon: <Bird   className="w-5 h-5" /> },
    { name: 'Other Pets', link: '/other-animals',  icon: <Rabbit className="w-5 h-5" /> },
  ], []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowMobileSearch(false);
    }
  }, [searchQuery, navigate]);

  const handleLogout = useCallback(async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  }, [logout, navigate]);

  const handleScroll = useMemo(
    () => debounce(() => { setIsScrolled(window.scrollY > 10); }, 50),
    []
  );

  const checkMobile = useMemo(
    () => throttle(() => { setIsMobile(window.innerWidth < 768); }, 200),
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [checkMobile]);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!showMobileMenu) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.mobile-menu')) setShowMobileMenu(false);
    };
    const id = setTimeout(() => document.addEventListener('click', handler), 0);
    return () => { clearTimeout(id); document.removeEventListener('click', handler); };
  }, [showMobileMenu]);

  // Close user dropdown on outside click
  useEffect(() => {
    if (!showUserMenu) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.user-menu-container')) setShowUserMenu(false);
    };
    const id = setTimeout(() => document.addEventListener('click', handler), 0);
    return () => { clearTimeout(id); document.removeEventListener('click', handler); };
  }, [showUserMenu]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`w-full sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : ''}`}
    >
      {/* ── Top bar (contact only, tablet + desktop) ───────────────── */}
      {!isMobile && (
        <div className="w-full bg-warm-orange py-2 px-4">
          <div className="container mx-auto flex justify-end items-center">
            <Link to="/contact" className="text-charcoal hover:text-charcoal/70 transition-colors font-nunito text-sm">
              📞 Contact Us
            </Link>
          </div>
        </div>
      )}

      {/* ── Main bar ────────────────────────────────────────────────── */}
      <div className="bg-warm-white border-b border-light-gray">
        <div className="container mx-auto py-3 lg:py-4 px-4">

          {isMobile ? (
            /* ── Mobile layout (< 768px) ───────────────────────── */
            <>
              <div className="flex items-center justify-between">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMobileMenu(!showMobileMenu); }}
                  className="mobile-menu p-2 rounded-lg hover:bg-soft-gray transition-colors"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {showMobileMenu
                      ? <motion.span key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90,  opacity: 0 }} transition={{ duration: 0.18 }}><X    className="h-6 w-6 text-charcoal" /></motion.span>
                      : <motion.span key="menu" initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Menu className="h-6 w-6 text-charcoal" /></motion.span>
                    }
                  </AnimatePresence>
                </button>

                <Link to="/" className="flex items-center">
                  <img src="/logo/logo.png" alt="Pawsome Logo" className="h-10 w-auto object-contain" />
                </Link>

                <div className="flex items-center gap-2">
                  <button onClick={() => setShowMobileSearch(!showMobileSearch)} className="p-2 rounded-lg hover:bg-soft-gray transition-colors">
                    <Search className="h-5 w-5 text-charcoal" />
                  </button>
                  <Link to="/cart" className="relative p-2 rounded-lg hover:bg-soft-gray transition-colors">
                    <ShoppingCart className="h-5 w-5 text-charcoal" />
                    <AnimatePresence>
                      {totalItems > 0 && (
                        <motion.span key="badge" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1 bg-vibrant-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                          {totalItems}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </div>
              </div>

              {/* Mobile search expand */}
              <AnimatePresence>
                {showMobileSearch && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-3"
                  >
                    <form onSubmit={handleSearch} className="relative">
                      <input
                        type="text" autoFocus
                        placeholder="Search treats, toys, food..."
                        className="w-full pl-4 pr-12 py-3 rounded-full bg-soft-gray border-2 border-transparent focus:outline-none focus:border-primary-blue focus:bg-white transition-all duration-300 font-nunito text-base"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                      <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div className="bg-primary-blue text-white p-2 rounded-full"><Search className="h-4 w-4" /></div>
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            /* ── Tablet + Desktop layout (≥ 768px) ─────────────── */
            <div className="flex justify-between items-center gap-3 lg:gap-4">

              {/* Logo */}
              <Link to="/" className="flex items-center flex-shrink-0 group">
                <img
                  src="/logo/logo.png" alt="Pawsome Logo"
                  className="h-11 lg:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <span className="text-primary-blue ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-wiggle">🐾</span>
              </Link>

              {/* Search */}
              <div className="flex-1 max-w-xs lg:max-w-xl">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search treats, toys, food..."
                    className="w-full pl-5 lg:pl-6 pr-12 py-2.5 lg:py-4 rounded-full bg-soft-gray border-2 border-transparent focus:outline-none focus:border-primary-blue focus:bg-white transition-all duration-300 font-nunito shadow-sm text-sm lg:text-lg"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button type="submit" className="absolute inset-y-0 right-0 pr-3 lg:pr-4 flex items-center">
                    <div className="bg-primary-blue text-white p-1.5 lg:p-2 rounded-full hover:bg-vibrant-orange transition-colors duration-300">
                      <Search className="h-4 w-4 lg:h-5 lg:w-5" />
                    </div>
                  </button>
                </form>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">

                {/* Wishlist — hidden */}

                {/* User profile */}
                <div className="relative user-menu-container">
                  {isAuthenticated ? (
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary-blue/10 hover:bg-primary-blue/20 transition-all duration-300"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-blue flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="hidden lg:block font-fredoka font-semibold text-charcoal text-sm max-w-[80px] truncate">
                        {user?.name?.split(' ')[0] || 'Account'}
                      </span>
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary-blue/10 hover:bg-primary-blue/20 transition-all duration-300"
                    >
                      <User className="h-5 w-5 text-primary-blue" />
                      <span className="hidden lg:block font-fredoka font-semibold text-charcoal text-sm">Sign In</span>
                    </Link>
                  )}

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        variants={dropdownVariants} initial="hidden" animate="show" exit="exit"
                        className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl py-2 z-50 border border-light-gray origin-top-right"
                      >
                        <Link to="/account"  className="block px-4 py-3 text-sm text-charcoal hover:bg-primary-blue/10 transition-colors rounded-xl mx-2" onClick={() => setShowUserMenu(false)}>👤 {user?.name || 'My Account'}</Link>
                        <Link to="/orders"   className="block px-4 py-3 text-sm text-charcoal hover:bg-primary-blue/10 transition-colors rounded-xl mx-2" onClick={() => setShowUserMenu(false)}>📦 My Orders</Link>
                        {/* <Link to="/wishlist" className="block px-4 py-3 text-sm text-charcoal hover:bg-primary-blue/10 transition-colors rounded-xl mx-2" onClick={() => setShowUserMenu(false)}>❤️ Wishlist</Link> */}
                        <hr className="my-2 mx-4 border-light-gray" />
                        <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm text-charcoal hover:bg-crimson/10 transition-colors rounded-xl mx-2">
                          <LogOut className="h-4 w-4" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="flex items-center gap-1.5 lg:gap-2 bg-vibrant-orange hover:bg-sunny-yellow transition-all duration-300 px-4 lg:px-6 py-2.5 lg:py-3 rounded-full text-white relative shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6" />
                  <span className="font-fredoka font-semibold text-base lg:text-lg">My Cart</span>
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span key="badge" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 bg-primary-blue text-white text-xs rounded-full h-6 w-6 lg:h-7 lg:w-7 flex items-center justify-center font-bold">
                        {totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Nav bar (tablet + desktop only) ────────────────────────── */}
      {!isMobile && <nav className="w-full bg-primary-blue">
        <div className="container mx-auto">
          <motion.div
            className="flex flex-wrap items-center justify-center py-1"
            initial="hidden"
            animate="show"
          >
            {categories.map((category, i) => (
              <motion.div key={i} custom={i} variants={navItemVariants}>
                <Link
                  to={category.link}
                  className="group px-4 lg:px-6 py-2.5 lg:py-3 text-white font-fredoka font-medium whitespace-nowrap hover:bg-white/20 transition-all duration-300 rounded-full mx-1 my-1 flex items-center gap-2 text-base lg:text-lg"
                >
                  {category.icon}
                  <span>{category.name}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </nav>}

      {/* ── Mobile drawer ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowMobileMenu(false)}
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="mobile-menu fixed left-0 top-0 h-full w-[290px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Gradient header ───────────────────────────── */}
              <div
                className="relative px-5 pt-10 pb-7 flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #1BBBFF 0%, #0088CC 100%)' }}
              >
                {/* Paw watermark */}
                <span className="absolute bottom-2 right-4 text-white/10 text-7xl select-none pointer-events-none">🐾</span>

                {/* Close */}
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Logo */}
                <div className="flex justify-center mb-6">
                  <img
                    src="/logo/logo.png"
                    alt="Pawsome"
                    className="h-16 w-auto object-contain brightness-0 invert"
                  />
                </div>

                {/* User */}
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/25 border-2 border-white/50 flex items-center justify-center flex-shrink-0">
                      <span className="font-fredoka font-bold text-white text-xl">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-fredoka font-bold text-white text-base leading-tight truncate">{user?.name || 'My Account'}</p>
                      <p className="text-white/65 text-xs font-nunito truncate">{user?.email}</p>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-3"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/25 border-2 border-white/50 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-fredoka font-bold text-white text-base">Sign In</p>
                      <p className="text-white/65 text-xs font-nunito">or create an account →</p>
                    </div>
                  </Link>
                )}
              </div>

              {/* ── Scrollable body ───────────────────────────── */}
              <div className="flex-1 overflow-y-auto">

                {/* Quick-action grid (authenticated only) */}
                {isAuthenticated && (
                  <div className="px-4 pt-4 pb-2">
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { to: '/account',  emoji: '👤', label: 'Account' },
                        { to: '/orders',   emoji: '📦', label: 'Orders'  },
                        // { to: '/wishlist', emoji: '❤️', label: 'Wishlist' }, // hidden
                      ].map(({ to, emoji, label }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setShowMobileMenu(false)}
                          className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-soft-gray hover:bg-primary-blue/10 transition-colors"
                        >
                          <span className="text-2xl">{emoji}</span>
                          <span className="text-xs font-fredoka font-semibold text-charcoal">{label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Features */}
                <div className="px-4 pt-4 pb-2">
                  <p className="text-[10px] font-fredoka font-bold text-medium-gray uppercase tracking-widest mb-2 px-1">
                    Special Features
                  </p>
                  <div className="space-y-1.5">
                    {[
                      { name: 'Daily Deals',   link: '/deals',        icon: <Percent className="w-4 h-4" />, bg: '#FFF0EA', color: '#C44A00' },
                      { name: 'Gift Boxes',    link: '/gifts',         icon: <Gift    className="w-4 h-4" />, bg: '#FFF0F3', color: '#A00040' },
                      { name: 'Rewards',       link: '/loyalty-cards', icon: <Trophy  className="w-4 h-4" />, bg: '#E8FFFD', color: '#006660' },
                      { name: 'Subscriptions', link: '/subscriptions', icon: <Heart   className="w-4 h-4" />, bg: '#F3EEFF', color: '#4A007A' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.link}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.06, duration: 0.25 }}
                      >
                        <Link
                          to={item.link}
                          onClick={() => setShowMobileMenu(false)}
                          className="flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
                          style={{ backgroundColor: item.bg }}
                        >
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color + '22', color: item.color }}>
                            {item.icon}
                          </div>
                          <span className="font-fredoka font-semibold text-sm" style={{ color: item.color }}>{item.name}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Shop by Pet */}
                <div className="px-4 pt-4 pb-4">
                  <p className="text-[10px] font-fredoka font-bold text-medium-gray uppercase tracking-widest mb-2 px-1">
                    Shop by Pet
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Dogs',       link: '/dogs',         emoji: '🐕', bg: '#FFF4ED' },
                      { name: 'Cats',       link: '/cats',          emoji: '🐱', bg: '#EDF7FF' },
                      { name: 'Birds',      link: '/birds',         emoji: '🦜', bg: '#EDFFF9' },
                      { name: 'Other Pets', link: '/other-animals', emoji: '🐹', bg: '#F5EDFF' },
                    ].map((pet, i) => (
                      <motion.div
                        key={pet.link}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22 + i * 0.07, duration: 0.25 }}
                      >
                        <Link
                          to={pet.link}
                          onClick={() => setShowMobileMenu(false)}
                          className="flex items-center gap-2 px-3 py-3 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
                          style={{ backgroundColor: pet.bg }}
                        >
                          <span className="text-2xl">{pet.emoji}</span>
                          <span className="font-fredoka font-semibold text-charcoal text-sm">{pet.name}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Footer ────────────────────────────────────── */}
              <div className="flex-shrink-0 px-4 py-4 border-t border-light-gray bg-soft-gray/40">
                <Link
                  to="/contact"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-charcoal hover:bg-white transition-colors mb-2"
                >
                  <span className="text-lg">📞</span>
                  <span className="font-fredoka font-semibold text-sm">Contact Us</span>
                </Link>
                {isAuthenticated && (
                  <button
                    onClick={() => { handleLogout(); setShowMobileMenu(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-crimson hover:bg-crimson/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="font-fredoka font-semibold text-sm">Logout</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.header>
  );
};

export default Header;
