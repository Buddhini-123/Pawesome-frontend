import React from 'react';

const Offers: React.FC = () => {
  return (
    <div className="min-h-screen bg-soft-gray">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-fredoka font-bold text-charcoal mb-4">Special Offers & Deals</h1>
          <p className="text-lg text-charcoal">
            Save big on your pet's favorite products with our exclusive offers
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-sunny-yellow to-vibrant-orange rounded-lg p-8 mb-8 text-white">
          <div className="text-center">
            <h2 className="text-4xl font-fredoka font-bold mb-4">🎉 Free Shipping Alert!</h2>
            <p className="text-xl mb-6">Get FREE shipping on orders above Rs. 20,000</p>
            <button className="bg-white text-vibrant-orange font-fredoka font-bold px-8 py-3 rounded-full hover:bg-soft-gray transition-colors">
              Shop Now
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-red-500 text-white px-4 py-2">
              <span className="font-fredoka font-bold">50% OFF</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-fredoka font-semibold mb-2">Premium Dog Food</h3>
              <p className="text-charcoal mb-4">Stock up on your dog's favorite premium food</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-fredoka font-bold text-mint-green">Rs.1,999</span>
                <span className="text-lg text-medium-gray line-through">Rs.3,999</span>
              </div>
              <button className="w-full mt-4 bg-sunny-yellow hover:bg-sunny-yellow text-charcoal font-fredoka font-medium py-2 rounded-lg transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-mint-green text-white px-4 py-2">
              <span className="font-fredoka font-bold">30% OFF</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-fredoka font-semibold mb-2">Cat Litter Bundle</h3>
              <p className="text-charcoal mb-4">Premium clumping litter - 3 month supply</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-fredoka font-bold text-mint-green">Rs.2,099</span>
                <span className="text-lg text-medium-gray line-through">Rs.2,999</span>
              </div>
              <button className="w-full mt-4 bg-sunny-yellow hover:bg-sunny-yellow text-charcoal font-fredoka font-medium py-2 rounded-lg transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary-blue text-white px-4 py-2">
              <span className="font-fredoka font-bold">25% OFF</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-fredoka font-semibold mb-2">Bird Seed Mix</h3>
              <p className="text-charcoal mb-4">Nutritious seed blend for all bird types</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-fredoka font-bold text-mint-green">Rs.899</span>
                <span className="text-lg text-medium-gray line-through">Rs.1,199</span>
              </div>
              <button className="w-full mt-4 bg-sunny-yellow hover:bg-sunny-yellow text-charcoal font-fredoka font-medium py-2 rounded-lg transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-purple-500 text-white px-4 py-2">
              <span className="font-fredoka font-bold">Buy 2 Get 1 FREE</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-fredoka font-semibold mb-2">Pet Toys Combo</h3>
              <p className="text-charcoal mb-4">Interactive toys for dogs and cats</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-fredoka font-bold text-mint-green">Rs.1,599</span>
                <span className="text-sm text-medium-gray">for 3 toys</span>
              </div>
              <button className="w-full mt-4 bg-sunny-yellow hover:bg-sunny-yellow text-charcoal font-fredoka font-medium py-2 rounded-lg transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-vibrant-orange text-white px-4 py-2">
              <span className="font-fredoka font-bold">40% OFF</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-fredoka font-semibold mb-2">Aquarium Starter Kit</h3>
              <p className="text-charcoal mb-4">Complete setup for new fish owners</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-fredoka font-bold text-mint-green">Rs.4,499</span>
                <span className="text-lg text-medium-gray line-through">Rs.7,499</span>
              </div>
              <button className="w-full mt-4 bg-sunny-yellow hover:bg-sunny-yellow text-charcoal font-fredoka font-medium py-2 rounded-lg transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-pink-500 text-white px-4 py-2">
              <span className="font-fredoka font-bold">35% OFF</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-fredoka font-semibold mb-2">Small Animal Care Kit</h3>
              <p className="text-charcoal mb-4">Essential supplies for rabbits & hamsters</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-fredoka font-bold text-mint-green">Rs.1,949</span>
                <span className="text-lg text-medium-gray line-through">Rs.2,999</span>
              </div>
              <button className="w-full mt-4 bg-sunny-yellow hover:bg-sunny-yellow text-charcoal font-fredoka font-medium py-2 rounded-lg transition-colors">
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