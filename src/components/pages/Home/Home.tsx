import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Pawsome
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your one-stop destination for all your pet's needs. From food to toys, 
            we have everything to keep your furry friends happy and healthy.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🐕</div>
            <h3 className="text-xl font-semibold mb-2">Dogs</h3>
            <p className="text-gray-600">Everything your canine companion needs</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🐱</div>
            <h3 className="text-xl font-semibold mb-2">Cats</h3>
            <p className="text-gray-600">Premium products for your feline friends</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🐦</div>
            <h3 className="text-xl font-semibold mb-2">Birds</h3>
            <p className="text-gray-600">Special care for your feathered pets</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Free Shipping Available
          </h2>
          <p className="text-gray-600 mb-6">
            Get free shipping on orders above Rs. 20,000
          </p>
          <button className="bg-amber-400 hover:bg-amber-500 text-gray-800 font-medium px-8 py-3 rounded-full transition-colors">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;