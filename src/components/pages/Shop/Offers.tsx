import React from 'react';

const Offers: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Special Offers & Deals</h1>
          <p className="text-lg text-gray-600">
            Save big on your pet's favorite products with our exclusive offers
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg p-8 mb-8 text-white">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">🎉 Free Shipping Alert!</h2>
            <p className="text-xl mb-6">Get FREE shipping on orders above Rs. 20,000</p>
            <button className="bg-white text-orange-600 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-red-500 text-white px-4 py-2">
              <span className="font-bold">50% OFF</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Premium Dog Food</h3>
              <p className="text-gray-600 mb-4">Stock up on your dog's favorite premium food</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">Rs.1,999</span>
                <span className="text-lg text-gray-500 line-through">Rs.3,999</span>
              </div>
              <button className="w-full mt-4 bg-amber-400 hover:bg-amber-500 text-gray-800 font-medium py-2 rounded-lg transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-500 text-white px-4 py-2">
              <span className="font-bold">30% OFF</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Cat Litter Bundle</h3>
              <p className="text-gray-600 mb-4">Premium clumping litter - 3 month supply</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">Rs.2,099</span>
                <span className="text-lg text-gray-500 line-through">Rs.2,999</span>
              </div>
              <button className="w-full mt-4 bg-amber-400 hover:bg-amber-500 text-gray-800 font-medium py-2 rounded-lg transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-500 text-white px-4 py-2">
              <span className="font-bold">25% OFF</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Bird Seed Mix</h3>
              <p className="text-gray-600 mb-4">Nutritious seed blend for all bird types</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">Rs.899</span>
                <span className="text-lg text-gray-500 line-through">Rs.1,199</span>
              </div>
              <button className="w-full mt-4 bg-amber-400 hover:bg-amber-500 text-gray-800 font-medium py-2 rounded-lg transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-purple-500 text-white px-4 py-2">
              <span className="font-bold">Buy 2 Get 1 FREE</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Pet Toys Combo</h3>
              <p className="text-gray-600 mb-4">Interactive toys for dogs and cats</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">Rs.1,599</span>
                <span className="text-sm text-gray-500">for 3 toys</span>
              </div>
              <button className="w-full mt-4 bg-amber-400 hover:bg-amber-500 text-gray-800 font-medium py-2 rounded-lg transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-orange-500 text-white px-4 py-2">
              <span className="font-bold">40% OFF</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Aquarium Starter Kit</h3>
              <p className="text-gray-600 mb-4">Complete setup for new fish owners</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">Rs.4,499</span>
                <span className="text-lg text-gray-500 line-through">Rs.7,499</span>
              </div>
              <button className="w-full mt-4 bg-amber-400 hover:bg-amber-500 text-gray-800 font-medium py-2 rounded-lg transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-pink-500 text-white px-4 py-2">
              <span className="font-bold">35% OFF</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Small Animal Care Kit</h3>
              <p className="text-gray-600 mb-4">Essential supplies for rabbits & hamsters</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">Rs.1,949</span>
                <span className="text-lg text-gray-500 line-through">Rs.2,999</span>
              </div>
              <button className="w-full mt-4 bg-amber-400 hover:bg-amber-500 text-gray-800 font-medium py-2 rounded-lg transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;