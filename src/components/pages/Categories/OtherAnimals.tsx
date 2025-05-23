import React from 'react';

const OtherAnimals: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Other Animals</h1>
          <p className="text-lg text-gray-600">
            Products for rabbits, hamsters, fish, reptiles, and other beloved pets
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">🐰</div>
            <h3 className="text-lg font-semibold mb-2">Rabbits</h3>
            <p className="text-gray-600 text-sm">Food, hay, and accessories</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">🐹</div>
            <h3 className="text-lg font-semibold mb-2">Small Animals</h3>
            <p className="text-gray-600 text-sm">Hamsters, guinea pigs, ferrets</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">🐠</div>
            <h3 className="text-lg font-semibold mb-2">Fish</h3>
            <p className="text-gray-600 text-sm">Aquarium supplies and food</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">🦎</div>
            <h3 className="text-lg font-semibold mb-2">Reptiles</h3>
            <p className="text-gray-600 text-sm">Terrariums and specialized food</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🥬</div>
            <h3 className="text-xl font-semibold mb-2">Food & Treats</h3>
            <p className="text-gray-600 mb-4">Specialized nutrition for all small animals</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              Shop Now
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-2">Habitats & Cages</h3>
            <p className="text-gray-600 mb-4">Safe and comfortable living spaces</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              Shop Now
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🎡</div>
            <h3 className="text-xl font-semibold mb-2">Exercise & Play</h3>
            <p className="text-gray-600 mb-4">Wheels, tunnels, and play equipment</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              Shop Now
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🌡️</div>
            <h3 className="text-xl font-semibold mb-2">Heating & Lighting</h3>
            <p className="text-gray-600 mb-4">Heat lamps and UV lighting for reptiles</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              Shop Now
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🧽</div>
            <h3 className="text-xl font-semibold mb-2">Cleaning & Maintenance</h3>
            <p className="text-gray-600 mb-4">Cleaning supplies for all pet habitats</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              Shop Now
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🏥</div>
            <h3 className="text-xl font-semibold mb-2">Health & Care</h3>
            <p className="text-gray-600 mb-4">Health supplements and care products</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherAnimals;