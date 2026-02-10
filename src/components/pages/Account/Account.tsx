import React, { useState, useEffect } from 'react';
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
  Home,
  Building,
  Navigation,
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
  Award,
  PawPrint,
  Plus,
  Trash2,
  Save,
  Upload,
  Weight,
  Activity,
  ArrowLeft,
  Eye
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useLoyalty } from '../../../hooks/useLoyalty';
import { useNavigate } from 'react-router-dom';
import { Pet, PetForm } from '../../../types';
import {api} from "../../../services/api"
import AddressManagement from './AddressManagement';
import { petService, BackendPet } from '../../../services/pet.service';
import { toast } from 'react-toastify';

const Account: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('/api/placeholder/150/150');
  const { user, logout } = useAuth();
  const { loyaltyCard } = useLoyalty();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: ""
  });

  // Default Address State
  const [defaultAddress, setDefaultAddress] = useState<any>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Pet Management State
  const [pets, setPets] = useState<Pet[]>(user?.pets || []);
  const [loadingPets, setLoadingPets] = useState(false);
  const [savingPet, setSavingPet] = useState(false);
  const [showAddPet, setShowAddPet] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showPetProfile, setShowPetProfile] = useState(false);
  const [petImage, setPetImage] = useState<File | null>(null);
  const [petImagePreview, setPetImagePreview] = useState<string>('');
  const [petFormData, setPetFormData] = useState<PetForm>({
    name: '',
    type: 'dog',
    breed: '',
    age: '',
    ageUnit: 'years',
    weight: '',
    weightUnit: 'kg',
    gender: 'male',
    color: '',
    dateOfBirth: '',
    isNeutered: false,
    microchipId: '',
    medicalNotes: '',
    allergies: '',
    medications: ''
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User, color: 'text-primary-blue' },
    { id: 'addresses', name: 'Addresses', icon: MapPin, color: 'text-mint-green' },
    { id: 'pets', name: 'My Pets', icon: PawPrint, color: 'text-sunny-yellow' },
    { id: 'orders', name: 'My Orders', icon: Package, color: 'text-vibrant-orange' },
    { id: 'wishlist', name: 'Wishlist', icon: Heart, color: 'text-coral-red' },
    { id: 'loyalty', name: 'Loyalty', icon: Award, color: 'text-lavender' },
    { id: 'settings', name: 'Settings', icon: Settings, color: 'text-mint-green' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/profile") as {
          data: {
            success: boolean;
            data: { user: any };
          };
        };

        if (response.data.success) {
          const user = response.data.data.user;
          setFormData({
            firstName: user.first_name || "",
            lastName: user.last_name || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Fetch default address
  const fetchDefaultAddress = async () => {
    try {
      setLoadingAddress(true);
      const response = await api.get('/users/addresses');
      if (response.success && response.data) {
        const addresses = (response.data as any).data || [];
        const defaultAddr = addresses.find((addr: any) => addr.is_default);
        setDefaultAddress(defaultAddr || addresses[0] || null);
      }
    } catch (error) {
      console.error('[Account] Failed to fetch default address:', error);
    } finally {
      setLoadingAddress(false);
    }
  };

  // Fetch default address when on profile tab
  useEffect(() => {
    if (activeTab === 'profile') {
      fetchDefaultAddress();
    }
  }, [activeTab]);

  const handleSaveProfile = async () => {
    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      };

      const response = await api.put("/users/profile", payload) as {
          data: {
            success: boolean;
            data: { user: any };
          };
        };

      if (response.data.success) {
        alert("✅ Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("❌ Failed to update profile");
    }
  };


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

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Fetch pets from API
  const fetchPets = async () => {
    try {
      setLoadingPets(true);
      console.log('[Account] Fetching pets from API...');
      const backendPets = await petService.getPets();
      console.log('[Account] Fetched pets:', backendPets);

      // Convert backend pets to frontend format
      const frontendPets = backendPets.map(bp => petService.convertToFrontendPet(bp));
      setPets(frontendPets);
    } catch (error: any) {
      console.error('[Account] Failed to fetch pets:', error);
      toast.error('Failed to load pets');
    } finally {
      setLoadingPets(false);
    }
  };

  // Fetch pets when pets tab is active
  useEffect(() => {
    if (activeTab === 'pets') {
      fetchPets();
    }
  }, [activeTab]);

  // Pet Management Functions
  const handleAddPet = () => {
    setEditingPet(null);
    setPetImage(null);
    setPetImagePreview('');
    setPetFormData({
      name: '',
      type: 'dog',
      breed: '',
      age: '',
      ageUnit: 'years',
      weight: '',
      weightUnit: 'kg',
      gender: 'male',
      color: '',
      dateOfBirth: '',
      isNeutered: false,
      microchipId: '',
      medicalNotes: '',
      allergies: '',
      medications: ''
    });
    setShowAddPet(true);
  };

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setPetImage(null);
    setPetImagePreview(pet.image || '');
    setPetFormData({
      name: pet.name,
      type: pet.type,
      breed: pet.breed || '',
      age: pet.age?.toString() || '',
      ageUnit: pet.ageUnit || 'years',
      weight: pet.weight?.toString() || '',
      weightUnit: pet.weightUnit || 'kg',
      gender: pet.gender || 'male',
      color: pet.color || '',
      dateOfBirth: pet.dateOfBirth ? pet.dateOfBirth.toISOString().split('T')[0] : '',
      isNeutered: pet.isNeutered || false,
      microchipId: pet.microchipId || '',
      medicalNotes: pet.medicalNotes || '',
      allergies: pet.allergies?.join(', ') || '',
      medications: pet.medications?.join(', ') || ''
    });
    setShowAddPet(true);
  };

  const handlePetImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPetImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPetImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePet = async () => {
    try {
      setSavingPet(true);

      // Validate required fields
      if (!petFormData.name || !petFormData.type) {
        toast.error('Please fill in required fields (Name and Species)');
        return;
      }

      // Prepare backend data
      const backendData = {
        name: petFormData.name,
        species: petFormData.type,
        breed: petFormData.breed || undefined,
        date_of_birth: petFormData.dateOfBirth || undefined,
        gender: petFormData.gender || undefined,
        weight: petFormData.weight ? parseFloat(petFormData.weight) : undefined,
        weight_unit: petFormData.weightUnit || undefined,
        color: petFormData.color || undefined,
        is_neutered: petFormData.isNeutered,
        microchip_id: petFormData.microchipId || undefined,
        medical_notes: petFormData.medicalNotes || undefined,
        allergies: petFormData.allergies ? petFormData.allergies.split(',').map(a => a.trim()).filter(a => a) : undefined,
        medications: petFormData.medications ? petFormData.medications.split(',').map(m => m.trim()).filter(m => m) : undefined,
        image: petImage || undefined,
      };

      console.log('[Account] Saving pet:', backendData);

      let savedPet: BackendPet;

      if (editingPet) {
        // Update existing pet
        savedPet = await petService.updatePet(editingPet.id, backendData);
        toast.success('Pet updated successfully!');
      } else {
        // Add new pet
        savedPet = await petService.addPet(backendData);
        toast.success('Pet added successfully!');
      }

      console.log('[Account] Pet saved:', savedPet);

      // Refresh pets list
      await fetchPets();

      setShowAddPet(false);
      setEditingPet(null);
      setPetImage(null);
      setPetImagePreview('');
    } catch (error: any) {
      console.error('[Account] Failed to save pet:', error);
      toast.error(error.message || 'Failed to save pet');
    } finally {
      setSavingPet(false);
    }
  };

  const handleDeletePet = async (petId: string) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) {
      return;
    }

    try {
      console.log('[Account] Deleting pet:', petId);
      await petService.deletePet(petId);
      toast.success('Pet deleted successfully');

      // Refresh pets list
      await fetchPets();
    } catch (error: any) {
      console.error('[Account] Failed to delete pet:', error);
      toast.error(error.message || 'Failed to delete pet');
    }
  };

  const handlePetFormChange = (field: keyof PetForm, value: any) => {
    setPetFormData(prev => ({ ...prev, [field]: value }));
  };

  const getPetTypeEmoji = (type: Pet['type']) => {
    const emojis = {
      dog: '🐕',
      cat: '🐈',
      bird: '🦜',
      fish: '🐠',
      rabbit: '🐰',
      hamster: '🐹',
      other: '🐾'
    };
    return emojis[type];
  };

  const getPetAge = (pet: Pet) => {
    if (pet.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(pet.dateOfBirth);
      const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
      if (ageInMonths < 12) {
        return `${ageInMonths} months`;
      } else {
        const years = Math.floor(ageInMonths / 12);
        return `${years} year${years > 1 ? 's' : ''}`;
      }
    } else if (pet.age) {
      return `${pet.age} ${pet.ageUnit || 'years'}`;
    }
    return 'Age unknown';
  };

  // Pet Profile Functions
  const handleViewPetProfile = (pet: Pet) => {
    setSelectedPet(pet);
    setShowPetProfile(true);
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

            {/* Default Address Section */}
            <div className="mt-8 pt-8 border-t-2 border-light-gray">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-fredoka font-bold text-charcoal flex items-center">
                  <MapPin className="inline h-5 w-5 mr-2 text-mint-green" />
                  Default Delivery Address
                </h3>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className="text-primary-blue hover:text-primary-blue/80 font-fredoka font-medium text-sm flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  Manage Addresses
                </button>
              </div>

              {loadingAddress ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
                </div>
              ) : defaultAddress ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-mint-green/10 to-primary-blue/5 rounded-2xl p-6 border-2 border-mint-green/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-mint-green/20 rounded-xl">
                      {defaultAddress.type === 'home' ? (
                        <Home className="h-6 w-6 text-mint-green" />
                      ) : defaultAddress.type === 'work' ? (
                        <Building className="h-6 w-6 text-mint-green" />
                      ) : (
                        <MapPin className="h-6 w-6 text-mint-green" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-fredoka font-bold text-charcoal text-lg">
                          {defaultAddress.type.charAt(0).toUpperCase() + defaultAddress.type.slice(1)} Address
                        </h4>
                        <span className="px-2 py-1 bg-mint-green/20 text-mint-green text-xs rounded-full font-fredoka font-medium flex items-center gap-1">
                          <Star className="h-3 w-3 fill-mint-green" />
                          Default
                        </span>
                      </div>
                      <p className="font-fredoka font-semibold text-charcoal mb-1">
                        {defaultAddress.full_name}
                      </p>
                      <p className="text-medium-gray font-fredoka text-sm">
                        {defaultAddress.address_line1}
                        {defaultAddress.address_line2 && `, ${defaultAddress.address_line2}`}
                      </p>
                      <p className="text-medium-gray font-fredoka text-sm">
                        {defaultAddress.city}, {defaultAddress.district} - {defaultAddress.postal_code}
                      </p>
                      {defaultAddress.landmark && (
                        <p className="text-medium-gray font-fredoka text-xs mt-1 flex items-center gap-1">
                          <Navigation className="h-3 w-3" />
                          Near {defaultAddress.landmark}
                        </p>
                      )}
                      <p className="text-medium-gray font-fredoka text-sm mt-2 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {defaultAddress.phone}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-soft-gray/50 rounded-2xl p-8 text-center">
                  <MapPin className="h-12 w-12 text-medium-gray mx-auto mb-3" />
                  <p className="text-medium-gray font-fredoka mb-4">
                    No default address added yet
                  </p>
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className="inline-flex items-center gap-2 bg-primary-blue text-white px-6 py-3 rounded-2xl font-fredoka font-medium hover:bg-primary-blue/90 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    Add Address
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 'addresses':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <AddressManagement />
          </motion.div>
        );

      case 'pets':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Pet Management Header */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-fredoka font-bold text-charcoal mb-2">My Pets</h2>
                  <p className="text-medium-gray">Manage your furry family members</p>
                </div>
                <button
                  onClick={handleAddPet}
                  className="flex items-center space-x-2 px-6 py-3 bg-sunny-yellow hover:bg-sunny-yellow/90 text-charcoal rounded-xl transition-all font-fredoka font-medium"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Pet</span>
                </button>
              </div>

              {/* Loading State */}
              {loadingPets && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sunny-yellow"></div>
                  <p className="text-medium-gray font-fredoka">Loading pets...</p>
                </div>
              )}

              {/* Pets Grid */}
              {!loadingPets && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pets.map((pet) => (
                  <motion.div
                    key={pet.id}
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-soft-gray to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-light-gray"
                  >
                    {/* Pet Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-sunny-yellow/20 rounded-full flex items-center justify-center text-2xl overflow-hidden">
                          {pet.image ? (
                            <img
                              src={pet.image}
                              alt={pet.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{getPetTypeEmoji(pet.type)}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-fredoka font-bold text-lg text-charcoal">{pet.name}</h3>
                          <p className="text-sm text-medium-gray capitalize">{pet.type} • {getPetAge(pet)}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditPet(pet)}
                          className="p-2 hover:bg-primary-blue/10 rounded-lg transition-colors"
                        >
                          <Edit3 className="h-4 w-4 text-primary-blue" />
                        </button>
                        <button 
                          onClick={() => handleDeletePet(pet.id)}
                          className="p-2 hover:bg-coral-red/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-coral-red" />
                        </button>
                      </div>
                    </div>

                    {/* Pet Details */}
                    <div className="space-y-3">
                      {pet.breed && (
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-sunny-yellow" />
                          <span className="text-sm text-charcoal">Breed: {pet.breed}</span>
                        </div>
                      )}
                      {pet.weight && (
                        <div className="flex items-center space-x-2">
                          <Weight className="h-4 w-4 text-mint-green" />
                          <span className="text-sm text-charcoal">Weight: {pet.weight} {pet.weightUnit}</span>
                        </div>
                      )}
                      {pet.gender && (
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-primary-blue" />
                          <span className="text-sm text-charcoal capitalize">Gender: {pet.gender}</span>
                        </div>
                      )}
                      {pet.microchipId && (
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-lavender" />
                          <span className="text-sm text-charcoal">Chip: {pet.microchipId}</span>
                        </div>
                      )}
                    </div>

                    {/* Health Indicators */}
                    <div className="mt-4 pt-4 border-t border-light-gray">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {pet.isNeutered && (
                          <span className="px-3 py-1 bg-mint-green/20 text-mint-green rounded-full text-xs font-fredoka font-medium">
                            Neutered
                          </span>
                        )}
                        {pet.allergies && pet.allergies.length > 0 && (
                          <span className="px-3 py-1 bg-coral-red/20 text-coral-red rounded-full text-xs font-fredoka font-medium">
                            Has Allergies
                          </span>
                        )}
                        {pet.medications && pet.medications.length > 0 && (
                          <span className="px-3 py-1 bg-primary-blue/20 text-primary-blue rounded-full text-xs font-fredoka font-medium">
                            On Medication
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleViewPetProfile(pet)}
                        className="w-full bg-sunny-yellow/20 hover:bg-sunny-yellow/30 text-sunny-yellow border border-sunny-yellow/30 rounded-xl py-2 px-4 font-fredoka font-medium transition-all flex items-center justify-center space-x-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </motion.div>
                ))}

                {/* Empty State */}
                {pets.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <div className="w-24 h-24 bg-sunny-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <PawPrint className="h-12 w-12 text-sunny-yellow" />
                    </div>
                    <h3 className="text-xl font-fredoka font-bold text-charcoal mb-2">No pets added yet</h3>
                    <p className="text-medium-gray mb-6">Add your first pet to get personalized recommendations</p>
                    <button
                      onClick={handleAddPet}
                      className="px-6 py-3 bg-sunny-yellow hover:bg-sunny-yellow/90 text-charcoal rounded-xl font-fredoka font-medium transition-all"
                    >
                      Add Your First Pet
                    </button>
                  </div>
                )}
              </div>
              )}
            </div>

            {/* Add/Edit Pet Modal */}
            <AnimatePresence>
              {showAddPet && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={() => setShowAddPet(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-fredoka font-bold text-charcoal">
                        {editingPet ? 'Edit Pet' : 'Add New Pet'}
                      </h3>
                      <button
                        onClick={() => setShowAddPet(false)}
                        className="p-2 hover:bg-soft-gray rounded-lg transition-colors"
                      >
                        <X className="h-6 w-6 text-medium-gray" />
                      </button>
                    </div>

                    {/* Pet Form */}
                    <div className="space-y-6">
                      {/* Basic Information */}
                      <div>
                        <h4 className="text-lg font-fredoka font-semibold text-charcoal mb-4">Basic Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                              Pet Name *
                            </label>
                            <input
                              type="text"
                              value={petFormData.name}
                              onChange={(e) => handlePetFormChange('name', e.target.value)}
                              className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-sunny-yellow transition-all"
                              placeholder="e.g., Buddy"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                              Pet Type *
                            </label>
                            <select
                              value={petFormData.type}
                              onChange={(e) => handlePetFormChange('type', e.target.value)}
                              className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-sunny-yellow transition-all"
                            >
                              <option value="dog">🐕 Dog</option>
                              <option value="cat">🐈 Cat</option>
                              <option value="bird">🦜 Bird</option>
                              <option value="fish">🐠 Fish</option>
                              <option value="rabbit">🐰 Rabbit</option>
                              <option value="hamster">🐹 Hamster</option>
                              <option value="other">🐾 Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                              Breed
                            </label>
                            <input
                              type="text"
                              value={petFormData.breed}
                              onChange={(e) => handlePetFormChange('breed', e.target.value)}
                              className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-sunny-yellow transition-all"
                              placeholder="e.g., Golden Retriever"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                              Gender
                            </label>
                            <select
                              value={petFormData.gender}
                              onChange={(e) => handlePetFormChange('gender', e.target.value)}
                              className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-sunny-yellow transition-all"
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Pet Image */}
                      <div>
                        <h4 className="text-lg font-fredoka font-semibold text-charcoal mb-4">Pet Photo</h4>
                        <div className="flex flex-col items-center space-y-4">
                          {petImagePreview && (
                            <div className="relative">
                              <img
                                src={petImagePreview}
                                alt="Pet preview"
                                className="w-32 h-32 rounded-full object-cover border-4 border-sunny-yellow shadow-lg"
                              />
                            </div>
                          )}
                          <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-light-gray rounded-xl p-6 cursor-pointer hover:border-sunny-yellow hover:bg-soft-gray/30 transition-all">
                            <Upload className="h-8 w-8 text-medium-gray mb-2" />
                            <span className="text-sm font-fredoka text-medium-gray">
                              {petImagePreview ? 'Change photo' : 'Upload pet photo'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePetImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Physical Details */}
                      <div>
                        <h4 className="text-lg font-fredoka font-semibold text-charcoal mb-4">Physical Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                              Date of Birth
                            </label>
                            <input
                              type="date"
                              value={petFormData.dateOfBirth}
                              onChange={(e) => handlePetFormChange('dateOfBirth', e.target.value)}
                              className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-sunny-yellow transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                              Color
                            </label>
                            <input
                              type="text"
                              value={petFormData.color}
                              onChange={(e) => handlePetFormChange('color', e.target.value)}
                              className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-sunny-yellow transition-all"
                              placeholder="e.g., Brown and White"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <div className="flex-1">
                              <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                                Weight
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={petFormData.weight}
                                onChange={(e) => handlePetFormChange('weight', e.target.value)}
                                className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-sunny-yellow transition-all"
                                placeholder="0"
                              />
                            </div>
                            <div className="w-24">
                              <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                                Unit
                              </label>
                              <select
                                value={petFormData.weightUnit}
                                onChange={(e) => handlePetFormChange('weightUnit', e.target.value)}
                                className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-sunny-yellow transition-all"
                              >
                                <option value="kg">kg</option>
                                <option value="lbs">lbs</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                              Microchip ID
                            </label>
                            <input
                              type="text"
                              value={petFormData.microchipId}
                              onChange={(e) => handlePetFormChange('microchipId', e.target.value)}
                              className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-sunny-yellow transition-all"
                              placeholder="e.g., 123456789012345"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Health Information */}
                      <div>
                        <h4 className="text-lg font-fredoka font-semibold text-charcoal mb-4">Health Information</h4>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id="isNeutered"
                              checked={petFormData.isNeutered}
                              onChange={(e) => handlePetFormChange('isNeutered', e.target.checked)}
                              className="w-5 h-5 text-mint-green border-2 border-light-gray rounded focus:ring-mint-green"
                            />
                            <label htmlFor="isNeutered" className="text-sm font-fredoka font-medium text-charcoal">
                              Pet is spayed/neutered
                            </label>
                          </div>
                          <div>
                            <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                              Allergies (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={petFormData.allergies}
                              onChange={(e) => handlePetFormChange('allergies', e.target.value)}
                              className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-sunny-yellow transition-all"
                              placeholder="e.g., chicken, beef, pollen"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                              Current Medications (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={petFormData.medications}
                              onChange={(e) => handlePetFormChange('medications', e.target.value)}
                              className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-sunny-yellow transition-all"
                              placeholder="e.g., heartworm prevention, joint supplements"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                              Medical Notes
                            </label>
                            <textarea
                              value={petFormData.medicalNotes}
                              onChange={(e) => handlePetFormChange('medicalNotes', e.target.value)}
                              rows={3}
                              className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-sunny-yellow transition-all resize-none"
                              placeholder="Any additional medical information..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Form Actions */}
                      <div className="flex space-x-4 pt-6 border-t border-light-gray">
                        <button
                          onClick={() => setShowAddPet(false)}
                          className="flex-1 px-6 py-3 border-2 border-light-gray text-medium-gray rounded-xl font-fredoka font-medium hover:bg-soft-gray transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSavePet}
                          disabled={!petFormData.name.trim() || savingPet}
                          className="flex-1 px-6 py-3 bg-sunny-yellow hover:bg-sunny-yellow/90 disabled:bg-light-gray disabled:text-medium-gray text-charcoal rounded-xl font-fredoka font-medium transition-all flex items-center justify-center space-x-2"
                        >
                          {savingPet ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-charcoal"></div>
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save className="h-5 w-5" />
                              <span>{editingPet ? 'Update Pet' : 'Add Pet'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pet Profile Modal with Timeline */}
            <AnimatePresence>
              {showPetProfile && selectedPet && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={() => setShowPetProfile(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden mx-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Pet Profile Header */}
                    <div className="bg-sunny-yellow p-4 sm:p-6 lg:p-8 text-charcoal">
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={() => setShowPetProfile(false)}
                          className="p-2 hover:bg-charcoal/10 rounded-lg transition-colors"
                        >
                          <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                        <div className="text-center flex-1 px-2">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-charcoal/10 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-2 sm:mb-4 overflow-hidden">
                            {selectedPet.image ? (
                              <img
                                src={selectedPet.image}
                                alt={selectedPet.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{getPetTypeEmoji(selectedPet.type)}</span>
                            )}
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-fredoka font-bold truncate">{selectedPet.name}</h2>
                          <p className="text-sm sm:text-lg opacity-80 capitalize">{selectedPet.type} • {getPetAge(selectedPet)}</p>
                        </div>
                        <button
                          onClick={() => handleEditPet(selectedPet)}
                          className="p-2 hover:bg-charcoal/10 rounded-lg transition-colors"
                        >
                          <Edit3 className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                      </div>
                      
                      {/* Pet Details */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-4">
                        {selectedPet.breed && (
                          <div className="bg-charcoal/10 rounded-xl p-3 text-center">
                            <p className="text-sm font-fredoka font-bold">{selectedPet.breed}</p>
                            <p className="text-xs opacity-80">Breed</p>
                          </div>
                        )}
                        {selectedPet.weight && (
                          <div className="bg-charcoal/10 rounded-xl p-3 text-center">
                            <p className="text-sm font-fredoka font-bold">{selectedPet.weight} {selectedPet.weightUnit || 'kg'}</p>
                            <p className="text-xs opacity-80">Weight</p>
                          </div>
                        )}
                        {selectedPet.gender && (
                          <div className="bg-charcoal/10 rounded-xl p-3 text-center">
                            <p className="text-sm font-fredoka font-bold capitalize">{selectedPet.gender}</p>
                            <p className="text-xs opacity-80">Gender</p>
                          </div>
                        )}
                        {selectedPet.color && (
                          <div className="bg-charcoal/10 rounded-xl p-3 text-center">
                            <p className="text-sm font-fredoka font-bold">{selectedPet.color}</p>
                            <p className="text-xs opacity-80">Color</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pet Information */}
                    <div className="p-4 sm:p-6 lg:p-8 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto bg-soft-gray">
                      <h3 className="text-lg font-fredoka font-bold text-charcoal mb-4">Pet Details</h3>

                      <div className="space-y-4">
                        {/* Date of Birth */}
                        {selectedPet.dateOfBirth && (
                          <div className="bg-white rounded-xl p-4">
                            <p className="text-sm font-fredoka font-medium text-charcoal mb-1">Date of Birth</p>
                            <p className="text-base text-medium-gray">
                              {new Date(selectedPet.dateOfBirth).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        {/* Neutered Status */}
                        {selectedPet.isNeutered !== undefined && (
                          <div className="bg-white rounded-xl p-4">
                            <p className="text-sm font-fredoka font-medium text-charcoal mb-1">Neutered/Spayed</p>
                            <p className="text-base text-medium-gray">
                              {selectedPet.isNeutered ? 'Yes' : 'No'}
                            </p>
                          </div>
                        )}

                        {/* Microchip ID */}
                        {selectedPet.microchipId && (
                          <div className="bg-white rounded-xl p-4">
                            <p className="text-sm font-fredoka font-medium text-charcoal mb-1">Microchip ID</p>
                            <p className="text-base text-medium-gray font-mono">
                              {selectedPet.microchipId}
                            </p>
                          </div>
                        )}

                        {/* Medical Notes */}
                        {selectedPet.medicalNotes && (
                          <div className="bg-white rounded-xl p-4">
                            <p className="text-sm font-fredoka font-medium text-charcoal mb-1">Medical Notes</p>
                            <p className="text-base text-medium-gray whitespace-pre-wrap">
                              {selectedPet.medicalNotes}
                            </p>
                          </div>
                        )}

                        {/* Allergies */}
                        {selectedPet.allergies && selectedPet.allergies.length > 0 && (
                          <div className="bg-white rounded-xl p-4">
                            <p className="text-sm font-fredoka font-medium text-charcoal mb-2">Allergies</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedPet.allergies.map((allergy, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-coral-red/10 text-coral-red rounded-full text-sm font-fredoka"
                                >
                                  {allergy}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Medications */}
                        {selectedPet.medications && selectedPet.medications.length > 0 && (
                          <div className="bg-white rounded-xl p-4">
                            <p className="text-sm font-fredoka font-medium text-charcoal mb-2">Current Medications</p>
                            <div className="space-y-2">
                              {selectedPet.medications.map((medication, index) => (
                                <div
                                  key={index}
                                  className="px-3 py-2 bg-soft-gray rounded-lg text-sm text-medium-gray"
                                >
                                  {medication}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Empty State */}
                        {!selectedPet.dateOfBirth &&
                         !selectedPet.microchipId &&
                         !selectedPet.medicalNotes &&
                         (!selectedPet.allergies || selectedPet.allergies.length === 0) &&
                         (!selectedPet.medications || selectedPet.medications.length === 0) && (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-soft-gray rounded-full flex items-center justify-center mx-auto mb-4">
                              <Activity className="h-8 w-8 text-medium-gray" />
                            </div>
                            <h3 className="text-lg font-fredoka font-bold text-charcoal mb-2">No additional details</h3>
                            <p className="text-medium-gray">Edit {selectedPet.name}'s profile to add more information</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
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
                        <p className="text-lg font-fredoka font-bold text-mint-green mt-1">Rs. 4,998</p>
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
                        <p className="text-lg font-fredoka font-bold text-mint-green mt-1">Rs. 899</p>
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
                <p className="text-xl font-fredoka font-bold text-mint-green mb-4">Rs. 599</p>
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
                <p className="text-xl font-fredoka font-bold text-mint-green mb-4">Rs. 1,299</p>
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
