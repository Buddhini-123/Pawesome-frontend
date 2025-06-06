import React, { useState } from 'react';
import { Trash2, Plus, Minus, Star, ArrowLeft } from 'lucide-react';
import { useCart } from '../../ui/CartContext.tsx';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Sample product data to match Figma design
const sampleCartItems = [
  {
    id: 46700,
    name: "Pedigree Chicken & Liver CIS Pouch 70g",
    price: 290,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1589985701653-d9643bc790de?w=200&h=200&fit=crop&crop=center",
    sku: "46700"
  },
  {
    id: 46701,
    name: "Pedigree Chicken & Liver CIS Pouch 70g",
    price: 290,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1589985701653-d9643bc790de?w=200&h=200&fit=crop&crop=center",
    sku: "46700"
  }
];

const similarItems = [
  {
    id: 1,
    name: "Pedigree Dog biscuit",
    price: 2000,
    image: "https://images.unsplash.com/photo-1589985701653-d9643bc790de?w=150&h=150&fit=crop&crop=center",
    rating: 4
  },
  {
    id: 2,
    name: "Pedigree Dog biscuit",
    price: 2000,
    image: "https://images.unsplash.com/photo-1589985701653-d9643bc790de?w=150&h=150&fit=crop&crop=center",
    rating: 4
  },
  {
    id: 3,
    name: "Pedigree Dog biscuit",
    price: 2000,
    image: "https://images.unsplash.com/photo-1589985701653-d9643bc790de?w=150&h=150&fit=crop&crop=center",
    rating: 4
  }
];

const topRecommendations = [
  {
    id: 1,
    name: "Pedigree Dog biscuit",
    price: 2000,
    image: "https://images.unsplash.com/photo-1589985701653-d9643bc790de?w=150&h=150&fit=crop&crop=center",
    rating: 4
  },
  {
    id: 2,
    name: "Pedigree Dog biscuit",
    price: 2000,
    image: "https://images.unsplash.com/photo-1589985701653-d9643bc790de?w=150&h=150&fit=crop&crop=center",
    rating: 4
  },
  {
    id: 3,
    name: "Pedigree Dog biscuit",
    price: 2000,
    image: "https://images.unsplash.com/photo-1589985701653-d9643bc790de?w=150&h=150&fit=crop&crop=center",
    rating: 4
  },
  {
    id: 4,
    name: "Pedigree Dog biscuit",
    price: 2000,
    image: "https://images.unsplash.com/photo-1589985701653-d9643bc790de?w=150&h=150&fit=crop&crop=center",
    rating: 4
  },
  {
    id: 5,
    name: "Pedigree Dog biscuit",
    price: 2000,
    image: "https://images.unsplash.com/photo-1589985701653-d9643bc790de?w=150&h=150&fit=crop&crop=center",
    rating: 4
  }
];

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState(sampleCartItems);
  const [email, setEmail] = useState('');

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getShippingCost = () => {
    return 200; // Fixed shipping as shown in design
  };

  const getTotal = () => {
    return getSubtotal() + getShippingCost();
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content - Left Side */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              {/* Cart Header */}
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-charcoal-gray mr-3">Your Cart</h1>
                <span className="text-3xl">🐾</span>
              </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-4 mb-8">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-r from-amber-300 to-amber-400 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    {/* Product Image */}
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-20 h-20 object-cover rounded-lg bg-white p-1"
                        />
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="absolute -top-2 -right-2 bg-amber-600 text-white rounded-full p-1 hover:bg-amber-700 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      
                      {/* Product Details */}
                      <div>
                        <h3 className="font-bold text-white text-lg">{item.name}</h3>
                        <p className="text-white/80 text-sm">SKU: {item.sku}</p>
                      </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-white rounded-lg">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      
                      <span className="px-4 py-2 font-semibold text-gray-800 min-w-[50px] text-center">
                        {item.quantity}
                      </span>
                      
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    
                    {/* Price */}
                    <div className="text-right">
                      <p className="text-white font-bold text-xl">
                        Rs. {(item.price * item.quantity).toLocaleString()}.00
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Section with Rewards and Cart Total */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Rewards Section */}
              <div>
                <h3 className="font-bold text-lg mb-2 text-natural-sage">Earn points with every purchase !</h3>
                <p className="text-gray-600 mb-1">Join our Pawsome Rewards Club.</p>
                <Link to="/loyalty-cards" className="text-natural-sage hover:underline font-medium">
                  Click Below
                </Link>
                
                {/* Cat Illustration */}
                <div className="mt-6 flex justify-center">
                  <div className="text-8xl">😸</div>
                </div>
              </div>
              
              {/* Cart Total */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-charcoal-gray mb-6">Cart Total</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">SUBTOTAL</span>
                    <span className="font-bold">Rs. {getSubtotal().toLocaleString()}.00</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">SHIPPING</span>
                    <span className="font-bold">Rs. {getShippingCost().toLocaleString()}.00</span>
                  </div>
                  
                  <hr className="border-gray-200 my-4" />
                  
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold">TOTAL</span>
                    <span className="font-bold">Rs. {getTotal().toLocaleString()}.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/brands"
                className="flex items-center justify-center space-x-2 bg-purple-200 hover:bg-purple-300 text-charcoal-gray font-semibold px-8 py-4 rounded-xl transition-colors"
              >
                <span>Continue Shopping</span>
              </Link>
              
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors flex-1">
                Checkout
              </button>
            </div>
            {/* Top Recommendations */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-charcoal-gray mb-8">Top Recommendations</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {topRecommendations.map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center"
                  >
                    <div className="relative mb-4">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button className="absolute top-2 right-2 bg-amber-500 text-white rounded-full p-1 hover:bg-amber-600 transition-colors">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    
                    <h3 className="font-semibold text-sm text-charcoal-gray mb-2">{product.name}</h3>
                    
                    <div className="flex justify-center items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < product.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    
                    <p className="text-amber-500 font-bold text-sm">Rs. {product.price.toLocaleString()}.00</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Similar Items */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-6">
              <h3 className="text-lg font-bold text-gray-400 mb-6">Similar items</h3>
              
              <div className="space-y-6">
                {similarItems.map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.02 }}
                    className="text-center"
                  >
                    <div className="relative mb-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button className="absolute top-1 right-1 bg-amber-500 text-white rounded-full p-1 hover:bg-amber-600 transition-colors">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    
                    <h4 className="font-medium text-sm text-charcoal-gray mb-2">{product.name}</h4>
                    
                    <div className="flex justify-center items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < product.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    
                    <p className="text-amber-500 font-bold text-sm">Rs. {product.price.toLocaleString()}.00</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Newsletter Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-natural-sage to-calm-blue rounded-3xl mt-12">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center text-white relative"
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                Don't miss out on our personalized discounts, special offers and our new arrivals
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-6 py-4 rounded-xl text-charcoal-gray border-none outline-none text-lg"
                />
                <button className="bg-gradient-to-r from-amber-400 to-amber-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Subscribe
                </button>
              </div>

              {/* Decorative Pet with Percentage Badge */}
              <div className="absolute bottom-8 right-8 hidden lg:block">
                <div className="relative">
                  <div className="text-6xl">🐕</div>
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-lg">
                    %
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer Info Section */}
        <section className="py-12 px-4 bg-white mt-8 rounded-2xl">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h4 className="text-xl font-bold text-charcoal-gray mb-6">Services</h4>
                <ul className="space-y-3 text-gray-600">
                  <li>Service 1</li>
                  <li>Service 1</li>
                  <li>Service 1</li>
                  <li>Service 1</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-bold text-charcoal-gray mb-6">Advantages</h4>
                <ul className="space-y-3 text-gray-600">
                  <li>Advantage 1</li>
                  <li>Advantage 1</li>
                  <li>Advantage 1</li>
                  <li>Advantage 1</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-bold text-charcoal-gray mb-6">Shipping</h4>
                <ul className="space-y-3 text-gray-600">
                  <li>Shipping Info 1</li>
                  <li>Shipping Info 1</li>
                  <li>Shipping Info 1</li>
                  <li>Shipping Info 1</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Cart;