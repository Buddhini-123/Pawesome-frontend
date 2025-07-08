import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Package, 
  Heart, 
  Settings, 
  LogOut, 
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  CreditCard,
  ChevronRight,
  Edit3,
  Check,
  X,
  Truck,
  Clock,
  Star,
  Gift,
  Award
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useLoyalty } from '../../../hooks/useLoyalty';
import { useNavigate } from 'react-router-dom';

const Account: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('/api/placeholder/150/150');
  const { user, logout } = useAuth();
  const { loyaltyCard } = useLoyalty();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || 'John',
    lastName: user?.name?.split(' ')[1] || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '+94 77 123 4567',
    address: user?.addresses?.[0]?.address || '123 Pet Street, Animal Colony, Colombo, Western Province, 00100'
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User, color: 'text-primary-blue' },
    { id: 'orders', name: 'My Orders', icon: Package, color: 'text-vibrant-orange' },
    { id: 'wishlist', name: 'Wishlist', icon: Heart, color: 'text-coral-red' },
    { id: 'loyalty', name: 'Loyalty', icon: Award, color: 'text-lavender' },
    { id: 'settings', name: 'Settings', icon: Settings, color: 'text-mint-green' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // Save profile logic here
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-fredoka font-bold text-charcoal">My Profile</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-blue text-white rounded-xl hover:bg-primary-blue/90 transition-all"
                >
                  <Edit3 className="h-4 w-4" />
                  <span className="font-fredoka">Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center space-x-2 px-4 py-2 bg-mint-green text-white rounded-xl hover:bg-mint-green/90 transition-all"
                  >
                    <Check className="h-4 w-4" />
                    <span className="font-fredoka">Save</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center space-x-2 px-4 py-2 bg-coral-red text-white rounded-xl hover:bg-coral-red/90 transition-all"
                  >
                    <X className="h-4 w-4" />
                    <span className="font-fredoka">Cancel</span>
                  </button>
                </div>
              )}
            </div>

            {/* Profile Picture Section */}
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary-blue/20">
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary-blue text-white p-2 rounded-full cursor-pointer hover:bg-primary-blue/90 transition-colors">
                    <Camera className="h-5 w-5" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-fredoka font-bold text-charcoal mb-2">
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-medium-gray mb-4">{formData.email}</p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <div className="px-4 py-2 bg-sunny-yellow/20 rounded-xl">
                    <p className="text-sm font-fredoka text-charcoal">Member Since</p>
                    <p className="font-fredoka font-semibold">March 2024</p>
                  </div>
                  <div className="px-4 py-2 bg-mint-green/20 rounded-xl">
                    <p className="text-sm font-fredoka text-charcoal">Total Orders</p>
                    <p className="font-fredoka font-semibold">12</p>
                  </div>
                  {loyaltyCard && (
                    <div className="px-4 py-2 bg-lavender/20 rounded-xl">
                      <p className="text-sm font-fredoka text-charcoal">Loyalty Tier</p>
                      <p className="font-fredoka font-semibold">{loyaltyCard.tier}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                  <User className="inline h-4 w-4 mr-2" />
                  First Name
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className={`w-full border ${isEditing ? 'border-primary-blue' : 'border-light-gray'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all`}
                />
              </div>
              <div>
                <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                  <User className="inline h-4 w-4 mr-2" />
                  Last Name
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className={`w-full border ${isEditing ? 'border-primary-blue' : 'border-light-gray'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all`}
                />
              </div>
              <div>
                <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full border ${isEditing ? 'border-primary-blue' : 'border-light-gray'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all`}
                />
              </div>
              <div>
                <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                  <Phone className="inline h-4 w-4 mr-2" />
                  Phone
                </label>
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={`w-full border ${isEditing ? 'border-primary-blue' : 'border-light-gray'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all`}
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                <MapPin className="inline h-4 w-4 mr-2" />
                Address
              </label>
              <textarea
                disabled={!isEditing}
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className={`w-full border ${isEditing ? 'border-primary-blue' : 'border-light-gray'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all`}
                rows={3}
              />
            </div>
          </motion.div>
        );

      case 'orders':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-fredoka font-bold text-charcoal mb-8">My Orders</h2>
              
              {/* Order Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-primary-blue to-primary-blue/80 text-white rounded-xl p-4">
                  <Package className="h-8 w-8 mb-2" />
                  <p className="text-2xl font-fredoka font-bold">12</p>
                  <p className="text-sm opacity-90">Total Orders</p>
                </div>
                <div className="bg-gradient-to-br from-mint-green to-mint-green/80 text-white rounded-xl p-4">
                  <Truck className="h-8 w-8 mb-2" />
                  <p className="text-2xl font-fredoka font-bold">2</p>
                  <p className="text-sm opacity-90">In Transit</p>
                </div>
                <div className="bg-gradient-to-br from-sunny-yellow to-sunny-yellow/80 text-charcoal rounded-xl p-4">
                  <Clock className="h-8 w-8 mb-2" />
                  <p className="text-2xl font-fredoka font-bold">1</p>
                  <p className="text-sm">Processing</p>
                </div>
                <div className="bg-gradient-to-br from-lavender to-lavender/80 text-white rounded-xl p-4">
                  <Check className="h-8 w-8 mb-2" />
                  <p className="text-2xl font-fredoka font-bold">9</p>
                  <p className="text-sm opacity-90">Delivered</p>
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="border-2 border-light-gray hover:border-primary-blue rounded-xl p-6 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-fredoka font-semibold text-lg text-charcoal">Order #PW123456789</h3>
                      <p className="text-sm text-medium-gray flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Placed on March 15, 2024
                      </p>
                    </div>
                    <span className="bg-mint-green/20 text-mint-green px-4 py-2 rounded-full text-sm font-fredoka font-semibold">
                      Delivered
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img src="/api/placeholder/80/80" alt="Product" className="w-20 h-20 object-cover rounded-xl" />
                      <div>
                        <p className="font-fredoka font-medium text-charcoal">Royal Canin Adult Dog Food</p>
                        <p className="text-sm text-medium-gray">Quantity: 2 × 15kg</p>
                        <p className="text-lg font-fredoka font-bold text-mint-green mt-1">₹4,998</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-medium-gray" />
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="border-2 border-light-gray hover:border-primary-blue rounded-xl p-6 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-fredoka font-semibold text-lg text-charcoal">Order #PW123456788</h3>
                      <p className="text-sm text-medium-gray flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Placed on March 10, 2024
                      </p>
                    </div>
                    <span className="bg-primary-blue/20 text-primary-blue px-4 py-2 rounded-full text-sm font-fredoka font-semibold">
                      In Transit
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img src="/api/placeholder/80/80" alt="Product" className="w-20 h-20 object-cover rounded-xl" />
                      <div>
                        <p className="font-fredoka font-medium text-charcoal">Cat Litter - Premium Clumping</p>
                        <p className="text-sm text-medium-gray">Quantity: 1 × 10kg</p>
                        <p className="text-lg font-fredoka font-bold text-mint-green mt-1">₹899</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-medium-gray" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        );

      case 'wishlist':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-3xl font-fredoka font-bold text-charcoal mb-8">My Wishlist</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div 
                whileHover={{ y: -5 }}
                className="border-2 border-light-gray hover:border-coral-red rounded-xl p-5 transition-all"
              >
                <div className="relative mb-4">
                  <img src="/api/placeholder/200/200" alt="Product" className="w-full h-48 object-cover rounded-xl" />
                  <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-coral-red hover:text-white transition-colors">
                    <Heart className="h-5 w-5 fill-current" />
                  </button>
                </div>
                <h3 className="font-fredoka font-semibold text-charcoal mb-2">Premium Bird Seed Mix</h3>
                <p className="text-sm text-medium-gray mb-1">Vitakraft</p>
                <div className="flex items-center mb-3">
                  <div className="flex text-sunny-yellow">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-medium-gray ml-2">(4.8)</span>
                </div>
                <p className="text-xl font-fredoka font-bold text-mint-green mb-4">₹599</p>
                <button className="w-full bg-sunny-yellow hover:bg-sunny-yellow/90 text-charcoal font-fredoka font-medium py-3 rounded-xl transition-colors">
                  Add to Cart
                </button>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="border-2 border-light-gray hover:border-coral-red rounded-xl p-5 transition-all"
              >
                <div className="relative mb-4">
                  <img src="/api/placeholder/200/200" alt="Product" className="w-full h-48 object-cover rounded-xl" />
                  <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-coral-red hover:text-white transition-colors">
                    <Heart className="h-5 w-5 fill-current" />
                  </button>
                </div>
                <h3 className="font-fredoka font-semibold text-charcoal mb-2">Interactive Cat Toy</h3>
                <p className="text-sm text-medium-gray mb-1">Petstages</p>
                <div className="flex items-center mb-3">
                  <div className="flex text-sunny-yellow">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-medium-gray ml-2">(4.9)</span>
                </div>
                <p className="text-xl font-fredoka font-bold text-mint-green mb-4">₹1,299</p>
                <button className="w-full bg-sunny-yellow hover:bg-sunny-yellow/90 text-charcoal font-fredoka font-medium py-3 rounded-xl transition-colors">
                  Add to Cart
                </button>
              </motion.div>
            </div>
          </motion.div>
        );

      case 'loyalty':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-3xl font-fredoka font-bold text-charcoal mb-8">Loyalty Program</h2>
            {loyaltyCard ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-lavender to-primary-blue rounded-2xl p-6 text-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm opacity-90">Loyalty Card</p>
                      <p className="text-2xl font-fredoka font-bold">{loyaltyCard.cardNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-90">Current Tier</p>
                      <p className="text-2xl font-fredoka font-bold">{loyaltyCard.tier}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-sm opacity-90 mb-2">Available Points</p>
                    <p className="text-4xl font-fredoka font-bold">{loyaltyCard.points.toLocaleString()}</p>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/loyalty-cards')}
                  className="w-full bg-lavender hover:bg-lavender/90 text-white font-fredoka font-medium py-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
                >
                  <Gift className="h-5 w-5" />
                  <span>View Full Loyalty Dashboard</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="h-16 w-16 text-lavender mx-auto mb-4" />
                <h3 className="text-xl font-fredoka font-bold text-charcoal mb-2">Join Our Loyalty Program!</h3>
                <p className="text-medium-gray mb-6">Earn points on every purchase and unlock exclusive rewards</p>
                <button 
                  onClick={() => navigate('/loyalty-cards')}
                  className="bg-lavender hover:bg-lavender/90 text-white px-6 py-3 rounded-xl font-fredoka font-medium transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-3xl font-fredoka font-bold text-charcoal mb-8">Account Settings</h2>
            
            <div className="space-y-8">
              {/* Notification Settings */}
              <div>
                <h3 className="text-xl font-fredoka font-semibold text-charcoal mb-4 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-primary-blue" />
                  Notifications
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-soft-gray rounded-xl cursor-pointer hover:bg-light-gray transition-colors">
                    <div className="flex items-center">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-blue"></div>
                      <span className="ml-4 font-fredoka">Email notifications for orders</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center justify-between p-4 bg-soft-gray rounded-xl cursor-pointer hover:bg-light-gray transition-colors">
                    <div className="flex items-center">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-blue"></div>
                      <span className="ml-4 font-fredoka">SMS notifications for delivery</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center justify-between p-4 bg-soft-gray rounded-xl cursor-pointer hover:bg-light-gray transition-colors">
                    <div className="flex items-center">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-blue"></div>
                      <span className="ml-4 font-fredoka">Marketing emails and offers</span>
                    </div>
                  </label>
                </div>
              </div>
              
              {/* Security Settings */}
              <div>
                <h3 className="text-xl font-fredoka font-semibold text-charcoal mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-mint-green" />
                  Security
                </h3>
                <div className="space-y-4">
                  <button className="w-full p-4 bg-soft-gray hover:bg-light-gray rounded-xl text-left transition-colors group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-fredoka font-semibold text-charcoal">Change Password</p>
                        <p className="text-sm text-medium-gray">Last changed 3 months ago</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-medium-gray group-hover:text-charcoal transition-colors" />
                    </div>
                  </button>
                  
                  <button className="w-full p-4 bg-soft-gray hover:bg-light-gray rounded-xl text-left transition-colors group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-fredoka font-semibold text-charcoal">Two-Factor Authentication</p>
                        <p className="text-sm text-medium-gray">Add an extra layer of security</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-medium-gray group-hover:text-charcoal transition-colors" />
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Payment Methods */}
              <div>
                <h3 className="text-xl font-fredoka font-semibold text-charcoal mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-vibrant-orange" />
                  Payment Methods
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-soft-gray rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-8 bg-primary-blue rounded flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-fredoka font-semibold text-charcoal">•••• •••• •••• 4242</p>
                          <p className="text-sm text-medium-gray">Expires 12/25</p>
                        </div>
                      </div>
                      <button className="text-coral-red hover:text-coral-red/80 transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <button className="w-full p-4 border-2 border-dashed border-light-gray hover:border-primary-blue rounded-xl transition-colors text-primary-blue font-fredoka font-medium">
                    + Add New Payment Method
                  </button>
                </div>
              </div>
              
              {/* Danger Zone */}
              <div>
                <h3 className="text-xl font-fredoka font-semibold text-coral-red mb-4">Danger Zone</h3>
                <button className="bg-coral-red hover:bg-coral-red/90 text-white px-6 py-3 rounded-xl font-fredoka font-medium transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-gray to-off-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-fredoka font-bold text-charcoal mb-2">My Pawsome Account</h1>
          <p className="text-lg text-medium-gray">Manage your account and preferences</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              {/* User Info */}
              <div className="flex items-center space-x-4 mb-8 p-4 bg-gradient-to-br from-primary-blue/10 to-primary-blue/5 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-blue to-primary-blue/80 rounded-full flex items-center justify-center text-white font-fredoka font-bold text-xl">
                  {formData.firstName[0]}{formData.lastName[0]}
                </div>
                <div className="flex-1">
                  <h3 className="font-fredoka font-semibold text-charcoal">
                    {formData.firstName} {formData.lastName}
                  </h3>
                  <p className="text-sm text-medium-gray truncate">{formData.email}</p>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-primary-blue/10 to-primary-blue/5 text-primary-blue border-l-4 border-primary-blue font-semibold'
                        : 'text-charcoal hover:bg-soft-gray'
                    }`}
                  >
                    <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? tab.color : ''}`} />
                    <span className="font-fredoka">{tab.name}</span>
                  </motion.button>
                ))}
                
                <motion.button 
                  onClick={handleLogout}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-coral-red hover:bg-coral-red/10 transition-all mt-4"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-fredoka font-semibold">Logout</span>
                </motion.button>
              </nav>
            </div>
          </motion.div>
          
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Account;