import React from 'react';

const Brands: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Top Brands</h1>
          <p className="text-lg text-gray-600">
            Discover premium pet products from the world's most trusted brands
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-blue-600">Royal Canin</span>
            </div>
            <h3 className="font-semibold text-gray-800">Royal Canin</h3>
            <p className="text-sm text-gray-600">Premium Pet Nutrition</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="h-16 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-red-600">Hill's</span>
            </div>
            <h3 className="font-semibold text-gray-800">Hill's</h3>
            <p className="text-sm text-gray-600">Science Diet</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-green-600">Pedigree</span>
            </div>
            <h3 className="font-semibold text-gray-800">Pedigree</h3>
            <p className="text-sm text-gray-600">Dog Food</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-purple-600">Whiskas</span>
            </div>
            <h3 className="font-semibold text-gray-800">Whiskas</h3>
            <p className="text-sm text-gray-600">Cat Food</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-orange-600">Purina</span>
            </div>
            <h3 className="font-semibold text-gray-800">Purina</h3>
            <p className="text-sm text-gray-600">Pet Care</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-yellow-600">Orijen</span>
            </div>
            <h3 className="font-semibold text-gray-800">Orijen</h3>
            <p className="text-sm text-gray-600">Biologically Appropriate</p>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Brand Collections</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <h3 className="text-xl font-bold text-white">Royal Canin Collection</h3>
                <p className="text-blue-100">Breed-specific nutrition</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Tailored nutrition for specific breeds, sizes, and life stages
                </p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
                  Shop Royal Canin
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-4">
                <h3 className="text-xl font-bold text-white">Hill's Science Diet</h3>
                <p className="text-red-100">Clinically proven nutrition</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Veterinarian-recommended nutrition backed by science
                </p>
                <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors">
                  Shop Hill's
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
                <h3 className="text-xl font-bold text-white">Natural & Organic</h3>
                <p className="text-green-100">Premium natural brands</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Organic and natural pet food options from trusted brands
                </p>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors">
                  Shop Natural
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Can't Find Your Brand?</h3>
          <p className="text-gray-600 mb-6">
            We're always adding new brands. Contact us to request your favorite pet food brand.
          </p>
          <button className="bg-amber-400 hover:bg-amber-500 text-gray-800 font-medium px-8 py-3 rounded-full transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Brands;