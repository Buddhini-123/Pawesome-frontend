import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut, Heart, Gift, Percent, Trophy } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import cartIcon from './cart-icon.png';

interface Category {
  name: string;
  link: string;
  icon?: React.ReactNode;
}

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
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
      {/* Top notification bar */}
      <div className="w-full bg-vibrant-orange py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-sm font-fredoka font-medium text-white flex items-center">
            <span className="mr-2 animate-bounce-slow">🐾</span>
            FREE SHIPPING on orders above ₹20,000 🚚
          </div>
          <div className="flex space-x-4 text-sm">
            <Link to="/contact" className="text-white hover:text-warm-white transition-colors font-nunito">
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
                <Link to="/login" className="text-white hover:text-warm-white transition-colors flex items-center font-nunito">
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
        <div className="container mx-auto py-4 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <img 
                src="/logo/logo.png"
                alt="Pawsome Logo" 
                className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-primary-blue ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-wiggle">🐾</span>
            </Link>
          </div>
          
          <div className="w-full md:w-1/2 lg:w-2/5 relative">
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
          
          <div className="flex items-center gap-4">
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
      </div>
      </div>

      {/* Navigation menu */}
      <div className="w-full bg-primary-blue">
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
    </header>
  );
};

export default Header;