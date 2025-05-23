import React, { useState } from 'react';
import { User, Package, Heart, Settings, LogOut } from 'lucide-react';

const Account: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'orders', name: 'My Orders', icon: Package },
    { id: 'wishlist', name: 'Wishlist', icon: Heart },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  defaultValue="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  defaultValue="Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  defaultValue="john.doe@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  defaultValue="+91 98765 43210"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                rows={3}
                defaultValue="123 Pet Street, Animal Colony, Mumbai, Maharashtra, 400001"
              />
            </div>
            <button className="mt-6 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg transition-colors">
              Update Profile
            </button>
          </div>
        );
      case 'orders':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">Order #PW123456789</h3>
                    <p className="text-sm text-gray-600">Placed on March 15, 2024</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Delivered</span>
                </div>
                <div className="flex items-center space-x-4">
                  <img src="/api/placeholder/60/60" alt="Product" className="w-15 h-15 object-cover rounded" />
                  <div>
                    <p className="font-medium">Royal Canin Adult Dog Food</p>
                    <p className="text-sm text-gray-600">Quantity: 2</p>
                    <p className="text-sm font-semibold text-green-600">₹4,998</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">Order #PW123456788</h3>
                    <p className="text-sm text-gray-600">Placed on March 10, 2024</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">Shipped</span>
                </div>
                <div className="flex items-center space-x-4">
                  <img src="/api/placeholder/60/60" alt="Product" className="w-15 h-15 object-cover rounded" />
                  <div>
                    <p className="font-medium">Cat Litter - Premium Clumping</p>
                    <p className="text-sm text-gray-600">Quantity: 1</p>
                    <p className="text-sm font-semibold text-green-600">₹899</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'wishlist':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <img src="/api/placeholder/200/200" alt="Product" className="w-full h-40 object-cover rounded-lg mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2">Premium Bird Seed Mix</h3>
                <p className="text-sm text-gray-600 mb-2">Vitakraft</p>
                <p className="text-lg font-bold text-green-600 mb-3">₹599</p>
                <button className="w-full bg-amber-400 hover:bg-amber-500 text-gray-800 font-medium py-2 rounded-lg transition-colors">
                  Add to Cart
                </button>
              </div>
              
              <div className="border rounded-lg p-4">
                <img src="/api/placeholder/200/200" alt="Product" className="w-full h-40 object-cover rounded-lg mb-4" />
                <h3 className="font-semibold text-gray-800 mb-2">Interactive Cat Toy</h3>
                <p className="text-sm text-gray-600 mb-2">Petstages</p>
                <p className="text-lg font-bold text-green-600 mb-3">₹1,299</p>
                <button className="w-full bg-amber-400 hover:bg-amber-500 text-gray-800 font-medium py-2 rounded-lg transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span>Email notifications for orders</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span>SMS notifications for delivery updates</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" />
                    <span>Marketing emails and offers</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Password</h3>
                <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Change Password
                </button>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Account</h3>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">My Pawsome Account</h1>
          <p className="text-lg text-gray-600">Manage your account and preferences</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">John Doe</h3>
                  <p className="text-sm text-gray-600">john.doe@example.com</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-sky-50 text-sky-600 border-l-4 border-sky-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
                
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;