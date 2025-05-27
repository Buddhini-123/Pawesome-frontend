import React from 'react';

const Birds: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Birds</h1>
          <p className="text-lg text-gray-600">
            Special care products for your feathered companions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🌾</div>
            <h3 className="text-xl font-semibold mb-2">Bird Food & Seeds</h3>
            <p className="text-gray-600 mb-4">Premium seed mixes and pelleted diets</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              Shop Now
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-2">Cages & Aviaries</h3>
            <p className="text-gray-600 mb-4">Spacious and comfortable homes for birds</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              Shop Now
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🎪</div>
            <h3 className="text-xl font-semibold mb-2">Toys & Perches</h3>
            <p className="text-gray-600 mb-4">Interactive toys and natural perches</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              Shop Now
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">💧</div>
            <h3 className="text-xl font-semibold mb-2">Feeding Accessories</h3>
            <p className="text-gray-600 mb-4">Water bottles, feeders, and dishes</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              Shop Now
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🏥</div>
            <h3 className="text-xl font-semibold mb-2">Health & Supplements</h3>
            <p className="text-gray-600 mb-4">Vitamins and health supplements</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              Shop Now
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🧼</div>
            <h3 className="text-xl font-semibold mb-2">Cleaning & Hygiene</h3>
            <p className="text-gray-600 mb-4">Cage cleaners and hygiene products</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Birds;