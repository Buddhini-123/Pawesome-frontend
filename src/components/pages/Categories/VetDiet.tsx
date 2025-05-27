import React from 'react';

const VetDiet: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Vet Diet</h1>
          <p className="text-lg text-gray-600">
            Specialized veterinary diets for pets with specific health needs
          </p>
        </div>
        
        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
          <div className="flex items-center mb-2">
            <div className="text-2xl mr-3">⚕️</div>
            <h3 className="text-lg font-semibold text-amber-800">Important Notice</h3>
          </div>
          <p className="text-amber-700">
            Veterinary diets should only be used under the supervision of a qualified veterinarian. 
            Please consult your vet before switching to any specialized diet.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🦴</div>
            <h3 className="text-xl font-semibold mb-2">Joint Care</h3>
            <p className="text-gray-600 mb-4">Specialized diets for joint health and mobility</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              View Products
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold mb-2">Heart Health</h3>
            <p className="text-gray-600 mb-4">Cardiac support diets for heart conditions</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              View Products
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🍃</div>
            <h3 className="text-xl font-semibold mb-2">Digestive Care</h3>
            <p className="text-gray-600 mb-4">Gentle diets for sensitive stomachs</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              View Products
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🏥</div>
            <h3 className="text-xl font-semibold mb-2">Kidney Support</h3>
            <p className="text-gray-600 mb-4">Renal diets for kidney health management</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              View Products
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">⚖️</div>
            <h3 className="text-xl font-semibold mb-2">Weight Management</h3>
            <p className="text-gray-600 mb-4">Low-calorie diets for weight control</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              View Products
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🦷</div>
            <h3 className="text-xl font-semibold mb-2">Dental Care</h3>
            <p className="text-gray-600 mb-4">Special diets for dental health</p>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
              View Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VetDiet;