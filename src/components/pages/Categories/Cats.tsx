import React from 'react';

const Cats: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Cats</h1>
          <p className="text-lg text-gray-600">
            Premium products for your feline friends
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold mb-2">Cat Food</h3>
            <p className="text-gray-600 mb-4">Nutritious meals for cats of all ages</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              Shop Now
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🧶</div>
            <h3 className="text-xl font-semibold mb-2">Toys & Scratchers</h3>
            <p className="text-gray-600 mb-4">Interactive toys and scratching posts</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              Shop Now
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-2">Litter & Hygiene</h3>
            <p className="text-gray-600 mb-4">Litter boxes and hygiene products</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cats;