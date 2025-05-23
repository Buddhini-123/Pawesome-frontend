import React from 'react';

const Dogs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Dogs</h1>
          <p className="text-lg text-gray-600">
            Everything your canine companion needs for a happy and healthy life
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🦴</div>
            <h3 className="text-xl font-semibold mb-2">Dog Food</h3>
            <p className="text-gray-600 mb-4">Premium nutrition for all dog breeds and ages</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              Shop Now
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🎾</div>
            <h3 className="text-xl font-semibold mb-2">Toys & Accessories</h3>
            <p className="text-gray-600 mb-4">Fun toys and essential accessories for your dog</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              Shop Now
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🏥</div>
            <h3 className="text-xl font-semibold mb-2">Health & Care</h3>
            <p className="text-gray-600 mb-4">Supplements and healthcare products</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dogs;