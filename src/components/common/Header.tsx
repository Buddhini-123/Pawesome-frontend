import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import cartIcon from './cart-icon.png';

interface Category {
  name: string;
  link: string;
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

  const categories: Category[] = [
    { name: 'Subscription', link: '/subscriptions' },
    { name: 'Gift Box', link: '/gifts' },
    { name: 'Daily Deals', link: '/deals' },
    { name: 'Paw Rewards', link: '/loyalty-cards' },
  ];

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top notification bar */}
      <div className="w-full bg-amber-400 py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-sm font-medium">FREE SHIPPING from Rs. 20,000 onwards</div>
          <div className="flex space-x-4 text-sm">
            <Link to="/contact" className="hover:underline">Contact Us</Link>
            <div className="flex items-center">
              <span className="mx-2">|</span>
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="hover:underline flex items-center"
                  >
                    <User className="h-4 w-4 mr-1" />
                    {user?.name || 'My Account'}
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Account
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 inline mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="hover:underline flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main header with logo, search and cart */}
      <div className="bg-white">
        <div className="container mx-auto py-4 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo/logo.png"
                alt="Pawsome Logo" 
                className="h-14 w-auto object-contain"
              />
            </Link>
          </div>
          
          <div className="w-full md:w-1/2 lg:w-2/5 relative">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search among more than 10,000 products"
                className="custom-input w-full pl-4 pr-10 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-calm-blue"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Search className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </form>
          </div>
          
          <div>
            <Link 
              to="/cart" 
              className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 transition-colors px-6 py-2 rounded-full text-gray-800 relative"
            >
              <img src={cartIcon} alt="Cart Icon" className="h-6 w-6" />
              <span className="font-medium">My Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      </div>

      {/* Navigation menu */}
      <div className="w-full" style={{backgroundColor: '#6CA6CD'}}>
        <div className="container mx-auto py-3">
          <nav className="inline-flex items-center justify-center flex-wrap w-full">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="px-6 py-3 text-white font-medium whitespace-nowrap hover:bg-sky-600 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;