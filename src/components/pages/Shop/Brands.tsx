import React from 'react';

const Brands: React.FC = () => {
  return (
    <div className="min-h-screen bg-soft-gray">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-fredoka font-bold text-charcoal mb-4">Top Brands</h1>
          <p className="text-lg text-charcoal">
            Discover premium pet products from the world's most trusted brands
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="h-16 bg-primary-blue bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl font-fredoka font-bold text-primary-blue">Royal Canin</span>
            </div>
            <h3 className="font-fredoka font-semibold text-charcoal">Royal Canin</h3>
            <p className="text-sm text-charcoal">Premium Pet Nutrition</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="h-16 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl font-fredoka font-bold text-red-600">Hill's</span>
            </div>
            <h3 className="font-fredoka font-semibold text-charcoal">Hill's</h3>
            <p className="text-sm text-charcoal">Science Diet</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="h-16 bg-mint-green bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl font-fredoka font-bold text-mint-green">Pedigree</span>
            </div>
            <h3 className="font-fredoka font-semibold text-charcoal">Pedigree</h3>
            <p className="text-sm text-charcoal">Dog Food</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl font-fredoka font-bold text-purple-600">Whiskas</span>
            </div>
            <h3 className="font-fredoka font-semibold text-charcoal">Whiskas</h3>
            <p className="text-sm text-charcoal">Cat Food</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="h-16 bg-vibrant-orange bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl font-fredoka font-bold text-vibrant-orange">Purina</span>
            </div>
            <h3 className="font-fredoka font-semibold text-charcoal">Purina</h3>
            <p className="text-sm text-charcoal">Pet Care</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="h-16 bg-sunny-yellow bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl font-fredoka font-bold text-sunny-yellow">Orijen</span>
            </div>
            <h3 className="font-fredoka font-semibold text-charcoal">Orijen</h3>
            <p className="text-sm text-charcoal">Biologically Appropriate</p>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-fredoka font-bold text-charcoal mb-6">Featured Brand Collections</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-primary-blue to-primary-blue p-4">
                <h3 className="text-xl font-fredoka font-bold text-white">Royal Canin Collection</h3>
                <p className="text-primary-blue text-opacity-20">Breed-specific nutrition</p>
              </div>
              <div className="p-6">
                <p className="text-charcoal mb-4">
                  Tailored nutrition for specific breeds, sizes, and life stages
                </p>
                <button className="bg-primary-blue hover:bg-primary-blue text-white px-6 py-2 rounded-lg font-fredoka transition-colors">
                  Shop Royal Canin
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-4">
                <h3 className="text-xl font-fredoka font-bold text-white">Hill's Science Diet</h3>
                <p className="text-red-100">Clinically proven nutrition</p>
              </div>
              <div className="p-6">
                <p className="text-charcoal mb-4">
                  Veterinarian-recommended nutrition backed by science
                </p>
                <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-fredoka transition-colors">
                  Shop Hill's
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-mint-green to-mint-green p-4">
                <h3 className="text-xl font-fredoka font-bold text-white">Natural & Organic</h3>
                <p className="text-mint-green text-opacity-20">Premium natural brands</p>
              </div>
              <div className="p-6">
                <p className="text-charcoal mb-4">
                  Organic and natural pet food options from trusted brands
                </p>
                <button className="bg-mint-green hover:bg-mint-green text-white px-6 py-2 rounded-lg font-fredoka transition-colors">
                  Shop Natural
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-2xl font-fredoka font-bold text-charcoal mb-4">Can't Find Your Brand?</h3>
          <p className="text-charcoal mb-6">
            We're always adding new brands. Contact us to request your favorite pet food brand.
          </p>
          <button className="bg-sunny-yellow hover:bg-sunny-yellow text-charcoal font-fredoka font-medium px-8 py-3 rounded-full transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Brands;