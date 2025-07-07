import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut, Heart, Gift, Percent, Trophy, Menu, X } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

interface Category {
  name: string;
  link: string;
  icon?: React.ReactNode;
}

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMobileMenu && !(event.target as Element).closest('.mobile-menu')) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMobileMenu]);

  const categories: Category[] = [
    { name: '📝 Subscription', link: '/subscriptions', icon: <Heart className="w-4 h-4" /> },
    { name: '🎁 Gift Box', link: '/gifts', icon: <Gift className="w-4 h-4" /> },
    { name: '🔥 Daily Deals', link: '/deals', icon: <Percent className="w-4 h-4" /> },
    { name: '🏆 Paw Rewards', link: '/loyalty-cards', icon: <Trophy className="w-4 h-4" /> },
  ];

  const petCategories = [
    { name: 'Dogs', link: '/dogs', icon: '🐕' },
    { name: 'Cats', link: '/cats', icon: '🐱' },
    { name: 'Birds', link: '/birds', icon: '🦜' },
    { name: 'Fish', link: '/fish', icon: '🐠' },
    { name: 'Small Pets', link: '/other-animals', icon: '🐰' },
  ];

  return (
    <header className={`w-full sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
      {/* Top notification bar - Hidden on mobile */}
      <div className="hidden md:block w-full bg-warm-orange py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-sm font-fredoka font-medium text-charcoal flex items-center">
            <span className="mr-2 animate-bounce-slow">🐾</span>
            FREE1 SHIPPING on orders above ₹20,000 🚚
          </div>
          <div className="flex space-x-4 text-sm">
            <Link to="/contact" className="text-charcoal hover:text-warm-white transition-colors font-nunito">
              📞 Contact Us
            </Link>
            <div className="flex items-center">
              <span className="mx-2 text-white/50">|</span>
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="text-white hover:text-warm-white transition-colors flex items-center font-nunito"
                  >
                    <User className="h-4 w-4 mr-1" />
                    {user?.name || 'My Account'}
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl py-2 z-50 border border-light-gray">
                      <Link
                        to="/account"
                        className="block px-4 py-3 text-sm text-charcoal hover:bg-primary-blue/10 transition-colors rounded-xl mx-2"
                        onClick={() => setShowUserMenu(false)}
                      >
                        👤 My Account
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-3 text-sm text-charcoal hover:bg-primary-blue/10 transition-colors rounded-xl mx-2"
                        onClick={() => setShowUserMenu(false)}
                      >
                        📦 My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        className="block px-4 py-3 text-sm text-charcoal hover:bg-primary-blue/10 transition-colors rounded-xl mx-2"
                        onClick={() => setShowUserMenu(false)}
                      >
                        ❤️ Wishlist
                      </Link>
                      <hr className="my-2 mx-4 border-light-gray" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm text-charcoal hover:bg-crimson/10 transition-colors rounded-xl mx-2"
                      >
                        <LogOut className="h-4 w-4 inline mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-charcoal hover:text-warm-white transition-colors flex items-center font-nunito">
                  <User className="h-4 w-4 mr-1" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main header with logo, search and cart */}
      <div className="bg-warm-white border-b border-light-gray">
        <div className="container mx-auto py-3 md:py-4 px-4">
          {/* Mobile Header - Only visible on screens smaller than md (768px) */}
          {isMobile ? (
          <>
            <div className="flex items-center justify-between">
              {/* Hamburger Menu */}
              <button
                onClick={(e) => { e.stopPropagation(); setShowMobileMenu(!showMobileMenu); }}
                className="mobile-menu p-2 rounded-lg hover:bg-soft-gray transition-colors"
              >
                {showMobileMenu ? <X className="h-6 w-6 text-charcoal" /> : <Menu className="h-6 w-6 text-charcoal" />}
              </button>
              
              {/* Mobile Logo */}
              <Link to="/" className="flex items-center">
                <img 
                  src="/logo/logo.png"
                  alt="Pawsome Logo" 
                  className="h-10 w-auto object-contain"
                />
              </Link>
              
              {/* Mobile Actions */}
              <div className="flex items-center gap-2">
                {/* Search Toggle */}
                <button
                  onClick={() => setShowMobileSearch(!showMobileSearch)}
                  className="p-2 rounded-lg hover:bg-soft-gray transition-colors"
                >
                  <Search className="h-5 w-5 text-charcoal" />
                </button>
                
                {/* Cart */}
                <Link 
                  to="/cart" 
                  className="relative p-2 rounded-lg hover:bg-soft-gray transition-colors"
                >
                  <ShoppingCart className="h-5 w-5 text-charcoal" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-vibrant-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </div>
            
            {/* Mobile Search Bar */}
            {showMobileSearch && (
              <div className="mt-3">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search treats, toys, food..."
                    className="w-full pl-4 pr-12 py-3 rounded-full bg-soft-gray border-2 border-transparent focus:outline-none focus:border-primary-blue focus:bg-white transition-all duration-300 font-nunito text-sm"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <div className="bg-primary-blue text-white p-2 rounded-full">
                      <Search className="h-4 w-4" />
                    </div>
                  </button>
                </form>
              </div>
            )}
          </>
          ) : (
          /* Desktop Header - Only visible on screens md (768px) and larger */
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center group">
                <img 
                  src="/logo/logo.png"
                  alt="Pawsome Logo" 
                  className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <span className="text-primary-blue ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-wiggle">🐾</span>
              </Link>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  placeholder="🔍 Search treats, toys, food and more..."
                  className="w-full pl-6 pr-12 py-3 rounded-full bg-soft-gray border-2 border-transparent focus:outline-none focus:border-primary-blue focus:bg-white transition-all duration-300 font-nunito shadow-sm"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <div className="bg-primary-blue text-white p-2 rounded-full hover:bg-vibrant-orange transition-colors duration-300">
                    <Search className="h-5 w-5" />
                  </div>
                </button>
              </form>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Wishlist */}
              <Link 
                to="/wishlist" 
                className="relative p-3 rounded-full bg-soft-pink/20 hover:bg-soft-pink/30 transition-all duration-300 group"
              >
                <Heart className="h-6 w-6 text-soft-pink group-hover:scale-110 transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 bg-crimson text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  3
                </span>
              </Link>
              
              {/* Cart */}
              <Link 
                to="/cart" 
                className="flex items-center space-x-2 bg-vibrant-orange hover:bg-sunny-yellow transition-all duration-300 px-6 py-3 rounded-full text-white relative shadow-lg hover:shadow-xl transform hover:scale-105 btn-bounce"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="font-fredoka font-semibold">My Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-blue text-white text-xs rounded-full h-7 w-7 flex items-center justify-center font-bold animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Desktop Navigation menu */}
      <div className="hidden md:block w-full bg-primary-blue">
        <div className="container mx-auto">
          <nav className="flex flex-wrap items-center justify-center py-1">
            {/* Main Categories */}
            <div className="flex items-center justify-center flex-wrap">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  to={category.link}
                  className="group px-6 py-3 text-white font-fredoka font-medium whitespace-nowrap hover:bg-white/20 transition-all duration-300 rounded-full mx-1 my-1 flex items-center gap-2 paw-hover"
                >
                  {category.name}
                </Link>
              ))}
              
              {/* Divider */}
              <span className="text-white/50 mx-4 hidden lg:inline">|</span>
              
              {/* Pet Categories */}
              {petCategories.map((pet, index) => (
                <Link
                  key={index}
                  to={pet.link}
                  className="group px-4 py-3 text-white font-nunito whitespace-nowrap hover:bg-white/20 transition-all duration-300 rounded-full mx-1 my-1 flex items-center gap-2 pet-icon-bounce"
                >
                  <span className="pet-icon-bounce text-xl">{pet.icon}</span>
                  <span className="hidden md:inline">{pet.name}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileMenu(false)}>
          <div 
            className="mobile-menu absolute left-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="bg-primary-blue p-4 flex items-center justify-between">
              <h2 className="text-white font-fredoka font-bold text-lg">Menu</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="text-white p-1 rounded hover:bg-white/20 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* User Section */}
            <div className="p-4 border-b border-light-gray">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-blue/10 p-2 rounded-full">
                      <User className="h-5 w-5 text-primary-blue" />
                    </div>
                    <div>
                      <p className="font-fredoka font-semibold text-charcoal">{user?.name || 'My Account'}</p>
                      <p className="text-sm text-medium-gray">{user?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-charcoal hover:bg-soft-gray rounded-lg transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      👤 My Account
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-charcoal hover:bg-soft-gray rounded-lg transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      📦 My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 text-charcoal hover:bg-soft-gray rounded-lg transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      ❤️ Wishlist
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setShowMobileMenu(false); }}
                      className="w-full text-left px-4 py-2 text-crimson hover:bg-crimson/10 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-3 p-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <User className="h-5 w-5" />
                  <span className="font-fredoka font-medium">Sign In / Register</span>
                </Link>
              )}
            </div>

            {/* Special Categories */}
            <div className="p-4 space-y-2">
              <h3 className="font-fredoka font-semibold text-charcoal mb-3">Special Features</h3>
              {categories.map((category, index) => (
                <Link
                  key={index}
                  to={category.link}
                  className="block px-4 py-3 text-charcoal hover:bg-soft-gray rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {/* Pet Categories */}
            <div className="p-4 space-y-2 border-t border-light-gray">
              <h3 className="font-fredoka font-semibold text-charcoal mb-3">Shop by Pet</h3>
              {petCategories.map((pet, index) => (
                <Link
                  key={index}
                  to={pet.link}
                  className="block px-4 py-3 text-charcoal hover:bg-soft-gray rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <span className="text-xl mr-3">{pet.icon}</span>
                  {pet.name}
                </Link>
              ))}
            </div>

            {/* Additional Links */}
            <div className="p-4 space-y-2 border-t border-light-gray">
              <Link
                to="/offers"
                className="block px-4 py-3 text-charcoal hover:bg-soft-gray rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                🏷️ Offers
              </Link>
              <Link
                to="/brands"
                className="block px-4 py-3 text-charcoal hover:bg-soft-gray rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                🏪 Brands
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-3 text-charcoal hover:bg-soft-gray rounded-lg transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                📞 Contact Us
              </Link>
            </div>

            {/* Notification Banner */}
            <div className="absolute bottom-0 left-0 right-0 bg-vibrant-orange p-3 text-center">
              <p className="text-white text-sm font-fredoka">
                🐾 FREE SHIPPING on orders above ₹20,000
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;