import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart } from 'lucide-react';
import cartIcon from './cart-icon.png'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const categories = [
    { name: 'Dogs', link: '/dogs' },
    { name: 'Cats', link: '/cats' },
    { name: 'Vet Diet', link: '/vet-diet' },
    { name: 'Birds', link: '/birds' },
    { name: 'Other Animals', link: '/other-animals' },
    { name: '% Offers', link: '/offers' },
    { name: 'Top Brands', link: '/brands' },
  ];

  return (
    <header className="w-full">
      {/* Top notification bar */}
      <div className="w-full bg-amber-400 py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">

          <div className="text-sm font-medium">FREE SHIPPING from Rs. 20,000 onwards</div>
          <div className="flex space-x-4 text-sm">
            <Link to="/contact" className="hover:underline">Contact Us</Link>
            <div className="flex items-center">
              <span className="mx-2">|</span>
              <Link to="/account" className="hover:underline flex items-center">
                My Pawsome
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header with logo, search and cart */}
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
            <div className="relative">
              <input
                type="text"
                placeholder="Search among more than 10,000 products"
                className="custom-input w-full pl-4 pr-10 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-calmblue"
                value={searchQuery}
                onChange={handleSearchChange}
              />

              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div>
            <Link 
              to="/cart" 
              className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 transition-colors px-6 py-2 rounded-full text-gray-800"
            >
              <img src={cartIcon} alt="Cart Icon" className="h-6 w-6" />
              <span className="font-medium">My Cart</span>
            </Link>
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