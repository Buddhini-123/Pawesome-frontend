import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
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
  Star,
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
  const [profileImage, setProfileImage] = useState<string>('/api/placeholder/150/150');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const { user, logout } = useAuth();
  const { loyaltyCard } = useLoyalty();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    birthday: ""
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
            birthday: user.birthday || "",
          });
          if (user.avatar_url) {
            setProfileImage(user.avatar_url);
          }
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
      // Save text fields
      const response = await api.put("/users/profile", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        birthday: formData.birthday || null,
      }) as { data: { success: boolean; data: { user: any } } };

      if (!response.data.success) {
        toast.error("Failed to update profile");
        return;
      }

      // Upload avatar separately if a new image was selected
      if (profileImageFile) {
        const fd = new FormData();
        fd.append('avatar', profileImageFile);
        const avatarResponse = await api.uploadForm<{ success: boolean; data: { user: any } }>('/users/avatar', fd);

        if (avatarResponse.success && avatarResponse.data?.data?.user?.avatar_url) {
          setProfileImage(avatarResponse.data.data.user.avatar_url);
        }
        setProfileImageFile(null);
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
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

  // Brand color per species
  const petTypeAccent = (type: Pet['type']) => {
    switch (type) {
      case 'dog':     return { bar: 'bg-primary-blue',    icon: 'bg-primary-blue/10 text-primary-blue',       header: 'from-primary-blue to-blue-600',    badge: 'bg-primary-blue/10 text-primary-blue' };
      case 'cat':     return { bar: 'bg-lavender',        icon: 'bg-lavender/10 text-lavender',               header: 'from-lavender to-purple-500',       badge: 'bg-lavender/10 text-lavender' };
      case 'bird':    return { bar: 'bg-mint-green',      icon: 'bg-mint-green/10 text-mint-green',           header: 'from-mint-green to-teal-600',       badge: 'bg-mint-green/10 text-mint-green' };
      case 'fish':    return { bar: 'bg-primary-blue',    icon: 'bg-primary-blue/10 text-primary-blue',       header: 'from-primary-blue to-cyan-600',     badge: 'bg-primary-blue/10 text-primary-blue' };
      case 'rabbit':  return { bar: 'bg-lavender',        icon: 'bg-lavender/10 text-lavender',               header: 'from-lavender to-pink-400',         badge: 'bg-lavender/10 text-lavender' };
      case 'hamster': return { bar: 'bg-vibrant-orange',  icon: 'bg-vibrant-orange/10 text-vibrant-orange',   header: 'from-vibrant-orange to-orange-600', badge: 'bg-vibrant-orange/10 text-vibrant-orange' };
      default:        return { bar: 'bg-sunny-yellow',    icon: 'bg-sunny-yellow/20 text-charcoal',           header: 'from-sunny-yellow to-amber-500',    badge: 'bg-sunny-yellow/20 text-charcoal' };
    }
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
              <div>
                <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Birthday <span className="text-medium-gray font-normal">(optional)</span>
                </label>
                <input
                  type="date"
                  disabled={!isEditing}
                  value={formData.birthday}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                  className={`w-full border ${isEditing ? 'border-primary-blue' : 'border-light-gray'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all`}
                />
              </div>
            </div>

            {/* Default Delivery Address */}
            <div className="mt-8 pt-6 border-t border-light-gray">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-fredoka font-bold text-charcoal tracking-wide">
                  Default Delivery Address
                </h3>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className="flex items-center gap-1 text-sm font-fredoka font-medium text-primary-blue hover:text-primary-blue/80 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Manage
                </button>
              </div>

              {loadingAddress ? (
                <div className="rounded-lg border border-light-gray overflow-hidden animate-pulse">
                  <div className="h-0.5 bg-light-gray" />
                  <div className="px-3 py-2.5 space-y-1.5">
                    <div className="h-3 w-20 bg-soft-gray rounded" />
                    <div className="h-2.5 w-40 bg-soft-gray rounded" />
                    <div className="h-2.5 w-32 bg-soft-gray rounded" />
                  </div>
                </div>
              ) : defaultAddress ? (
                <div className="rounded-lg border border-light-gray overflow-hidden">
                  <div className="h-0.5 bg-primary-blue" />
                  <div className="px-3 py-2.5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center justify-center w-5 h-5 rounded bg-primary-blue/10">
                          {defaultAddress.type === 'home' ? (
                            <Home className="h-3 w-3 text-primary-blue" />
                          ) : defaultAddress.type === 'work' ? (
                            <Building className="h-3 w-3 text-primary-blue" />
                          ) : (
                            <Navigation className="h-3 w-3 text-primary-blue" />
                          )}
                        </div>
                        <span className="font-fredoka font-bold text-charcoal text-sm capitalize">
                          {defaultAddress.type} Address
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-mint-green/10 border border-mint-green/30 text-mint-green text-xs font-fredoka font-semibold">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        Default
                      </span>
                    </div>

                    {/* Address details */}
                    <div className="space-y-0.5 mb-2">
                      <p className="font-fredoka font-semibold text-charcoal text-sm">
                        {defaultAddress.full_name}
                      </p>
                      <p className="font-fredoka text-sm text-medium-gray leading-snug">
                        {defaultAddress.address_line1}
                        {defaultAddress.address_line2 && `, ${defaultAddress.address_line2}`}
                      </p>
                      <p className="font-fredoka text-sm text-medium-gray">
                        {defaultAddress.city}, {defaultAddress.district} – {defaultAddress.postal_code}
                      </p>
                      {defaultAddress.landmark && (
                        <p className="font-fredoka text-xs text-medium-gray/60">
                          Near {defaultAddress.landmark}
                        </p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-light-gray">
                      <div className="flex items-center gap-1 text-medium-gray">
                        <Phone className="h-3 w-3" />
                        <span className="font-fredoka text-sm">{defaultAddress.phone}</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('addresses')}
                        className="flex items-center gap-0.5 text-sm font-fredoka font-semibold text-primary-blue hover:text-primary-blue/70 transition-colors"
                      >
                        <Edit3 className="h-3 w-3" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-light-gray overflow-hidden">
                  <div className="h-0.5 bg-light-gray" />
                  <div className="flex items-center gap-3 px-3 py-3">
                    <MapPin className="h-4 w-4 text-medium-gray flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-fredoka font-semibold text-charcoal text-sm">No delivery address saved</p>
                      <p className="font-fredoka text-sm text-medium-gray">Add one to speed up checkout</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('addresses')}
                      className="flex-shrink-0 flex items-center gap-1 bg-primary-blue text-white text-sm font-fredoka font-semibold px-3 py-1.5 rounded-lg hover:bg-primary-blue/90 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </button>
                  </div>
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
                  <h2 className="text-3xl font-fredoka font-bold text-charcoal mb-1">My Pets</h2>
                  <p className="text-medium-gray font-fredoka">Manage your furry family members</p>
                </div>
                <button
                  onClick={handleAddPet}
                  className="flex items-center gap-2 px-6 py-3 bg-vibrant-orange hover:bg-vibrant-orange/90 text-white rounded-2xl transition-all font-fredoka font-medium shadow-sm"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Pet</span>
                </button>
              </div>

              {/* Loading State */}
              {loadingPets && (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full border-4 border-light-gray border-t-vibrant-orange animate-spin" />
                    <PawPrint className="absolute inset-0 m-auto h-5 w-5 text-vibrant-orange" />
                  </div>
                  <p className="text-medium-gray font-fredoka">Loading pets...</p>
                </div>
              )}

              {/* Pets Grid */}
              {!loadingPets && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {pets.map((pet, index) => {
                    const accent = petTypeAccent(pet.type);
                    return (
                      <motion.div
                        key={pet.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-light-gray hover:shadow-md transition-all duration-200"
                      >
                        {/* Colored accent bar */}
                        <div className={`h-1 w-full ${accent.bar}`} />

                        <div className="p-5">
                          {/* Pet Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl overflow-hidden ${accent.icon}`}>
                                {pet.image ? (
                                  <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span>{getPetTypeEmoji(pet.type)}</span>
                                )}
                              </div>
                              <div>
                                <h3 className="font-fredoka font-bold text-base text-charcoal leading-tight">{pet.name}</h3>
                                <p className="text-xs text-medium-gray font-fredoka capitalize mt-0.5">{pet.type} · {getPetAge(pet)}</p>
                              </div>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => handleEditPet(pet)}
                                className="p-2 hover:bg-soft-gray rounded-lg transition-colors text-medium-gray hover:text-charcoal"
                                title="Edit"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePet(pet.id)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-medium-gray hover:text-coral-red"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Pet Details */}
                          <div className="space-y-2 mb-4">
                            {pet.breed && (
                              <div className="flex items-center gap-2">
                                <Star className="h-3.5 w-3.5 text-sunny-yellow fill-sunny-yellow shrink-0" />
                                <span className="text-sm font-fredoka text-charcoal">{pet.breed}</span>
                              </div>
                            )}
                            {pet.weight && (
                              <div className="flex items-center gap-2">
                                <Weight className="h-3.5 w-3.5 text-medium-gray shrink-0" />
                                <span className="text-sm font-fredoka text-medium-gray">{pet.weight} {pet.weightUnit || 'kg'}</span>
                              </div>
                            )}
                            {pet.gender && (
                              <div className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5 text-medium-gray shrink-0" />
                                <span className="text-sm font-fredoka text-medium-gray capitalize">{pet.gender}</span>
                              </div>
                            )}
                            {pet.microchipId && (
                              <div className="flex items-center gap-2">
                                <Shield className="h-3.5 w-3.5 text-lavender shrink-0" />
                                <span className="text-sm font-fredoka text-medium-gray truncate">{pet.microchipId}</span>
                              </div>
                            )}
                          </div>

                          {/* Health Badges + CTA */}
                          <div className="pt-4 border-t border-light-gray">
                            {(pet.isNeutered || (pet.allergies && pet.allergies.length > 0) || (pet.medications && pet.medications.length > 0)) && (
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {pet.isNeutered && (
                                  <span className="px-2.5 py-1 bg-mint-green/15 text-mint-green rounded-full text-xs font-fredoka font-medium">
                                    Neutered
                                  </span>
                                )}
                                {pet.allergies && pet.allergies.length > 0 && (
                                  <span className="px-2.5 py-1 bg-coral-red/10 text-coral-red rounded-full text-xs font-fredoka font-medium">
                                    Allergies
                                  </span>
                                )}
                                {pet.medications && pet.medications.length > 0 && (
                                  <span className="px-2.5 py-1 bg-primary-blue/10 text-primary-blue rounded-full text-xs font-fredoka font-medium">
                                    Medication
                                  </span>
                                )}
                              </div>
                            )}
                            <button
                              onClick={() => handleViewPetProfile(pet)}
                              className={`w-full py-2.5 rounded-xl font-fredoka font-medium text-sm transition-all flex items-center justify-center gap-2 ${accent.icon} hover:opacity-80`}
                            >
                              <Eye className="h-4 w-4" />
                              View Profile
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Empty State */}
                  {pets.length === 0 && (
                    <div className="col-span-full text-center py-16">
                      <div className="w-24 h-24 bg-vibrant-orange/10 rounded-full flex items-center justify-center mx-auto mb-5">
                        <PawPrint className="h-12 w-12 text-vibrant-orange" />
                      </div>
                      <h3 className="text-xl font-fredoka font-bold text-charcoal mb-2">No pets added yet</h3>
                      <p className="text-medium-gray font-fredoka mb-6">Add your first pet to get personalized recommendations</p>
                      <button
                        onClick={handleAddPet}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-vibrant-orange hover:bg-vibrant-orange/90 text-white rounded-2xl font-fredoka font-medium transition-all"
                      >
                        <Plus className="h-5 w-5" />
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
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-8 py-5 border-b border-light-gray shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-vibrant-orange/10 rounded-xl">
                          <PawPrint className="h-5 w-5 text-vibrant-orange" />
                        </div>
                        <h3 className="text-xl font-fredoka font-bold text-charcoal">
                          {editingPet ? 'Edit Pet' : 'Add New Pet'}
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowAddPet(false)}
                        className="p-2 hover:bg-soft-gray rounded-xl transition-colors"
                      >
                        <X className="h-5 w-5 text-medium-gray" />
                      </button>
                    </div>

                    {/* Scrollable Form Body */}
                    <div className="overflow-y-auto flex-1 px-8 py-6">
                      <div className="space-y-6">
                        {/* Basic Information */}
                        <div>
                          <h4 className="text-sm font-fredoka font-semibold text-medium-gray uppercase tracking-wide mb-3">Basic Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Pet Name *</label>
                              <input
                                type="text"
                                value={petFormData.name}
                                onChange={(e) => handlePetFormChange('name', e.target.value)}
                                className="w-full border-2 border-light-gray rounded-xl px-4 py-3 font-fredoka focus:outline-none focus:border-vibrant-orange transition-all"
                                placeholder="e.g., Buddy"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Species *</label>
                              <select
                                value={petFormData.type}
                                onChange={(e) => handlePetFormChange('type', e.target.value)}
                                className="w-full border-2 border-light-gray rounded-xl px-4 py-3 font-fredoka focus:outline-none focus:border-vibrant-orange transition-all"
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
                              <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Breed</label>
                              <input
                                type="text"
                                value={petFormData.breed}
                                onChange={(e) => handlePetFormChange('breed', e.target.value)}
                                className="w-full border-2 border-light-gray rounded-xl px-4 py-3 font-fredoka focus:outline-none focus:border-vibrant-orange transition-all"
                                placeholder="e.g., Golden Retriever"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Gender</label>
                              <select
                                value={petFormData.gender}
                                onChange={(e) => handlePetFormChange('gender', e.target.value)}
                                className="w-full border-2 border-light-gray rounded-xl px-4 py-3 font-fredoka focus:outline-none focus:border-vibrant-orange transition-all"
                              >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Pet Photo */}
                        <div>
                          <h4 className="text-sm font-fredoka font-semibold text-medium-gray uppercase tracking-wide mb-3">Pet Photo</h4>
                          <div className="flex items-center gap-5">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-soft-gray flex items-center justify-center text-3xl shrink-0 border-2 border-light-gray">
                              {petImagePreview ? (
                                <img src={petImagePreview} alt="Pet preview" className="w-full h-full object-cover" />
                              ) : (
                                <span>{getPetTypeEmoji(petFormData.type as Pet['type'])}</span>
                              )}
                            </div>
                            <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-light-gray rounded-xl p-4 cursor-pointer hover:border-vibrant-orange hover:bg-vibrant-orange/5 transition-all">
                              <Upload className="h-6 w-6 text-medium-gray mb-1" />
                              <span className="text-sm font-fredoka text-medium-gray">
                                {petImagePreview ? 'Change photo' : 'Upload pet photo'}
                              </span>
                              <input type="file" accept="image/*" onChange={handlePetImageUpload} className="hidden" />
                            </label>
                          </div>
                        </div>

                        {/* Physical Details */}
                        <div>
                          <h4 className="text-sm font-fredoka font-semibold text-medium-gray uppercase tracking-wide mb-3">Physical Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Date of Birth</label>
                              <input
                                type="date"
                                value={petFormData.dateOfBirth}
                                onChange={(e) => handlePetFormChange('dateOfBirth', e.target.value)}
                                className="w-full border-2 border-light-gray rounded-xl px-4 py-3 font-fredoka focus:outline-none focus:border-vibrant-orange transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Color</label>
                              <input
                                type="text"
                                value={petFormData.color}
                                onChange={(e) => handlePetFormChange('color', e.target.value)}
                                className="w-full border-2 border-light-gray rounded-xl px-4 py-3 font-fredoka focus:outline-none focus:border-vibrant-orange transition-all"
                                placeholder="e.g., Brown and White"
                              />
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Weight</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={petFormData.weight}
                                  onChange={(e) => handlePetFormChange('weight', e.target.value)}
                                  className="w-full border-2 border-light-gray rounded-xl px-4 py-3 font-fredoka focus:outline-none focus:border-vibrant-orange transition-all"
                                  placeholder="0"
                                />
                              </div>
                              <div className="w-24">
                                <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Unit</label>
                                <select
                                  value={petFormData.weightUnit}
                                  onChange={(e) => handlePetFormChange('weightUnit', e.target.value)}
                                  className="w-full border-2 border-light-gray rounded-xl px-4 py-3 font-fredoka focus:outline-none focus:border-vibrant-orange transition-all"
                                >
                                  <option value="kg">kg</option>
                                  <option value="lbs">lbs</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Microchip ID</label>
                              <input
                                type="text"
                                value={petFormData.microchipId}
                                onChange={(e) => handlePetFormChange('microchipId', e.target.value)}
                                className="w-full border-2 border-light-gray rounded-xl px-4 py-3 font-fredoka focus:outline-none focus:border-vibrant-orange transition-all"
                                placeholder="e.g., 123456789012345"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Health Information */}
                        <div>
                          <h4 className="text-sm font-fredoka font-semibold text-medium-gray uppercase tracking-wide mb-3">Health Information</h4>
                          <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer select-none p-3 bg-mint-green/5 border border-mint-green/20 rounded-xl hover:bg-mint-green/10 transition-colors">
                              <input
                                type="checkbox"
                                id="isNeutered"
                                checked={petFormData.isNeutered}
                                onChange={(e) => handlePetFormChange('isNeutered', e.target.checked)}
                                className="w-4 h-4 text-mint-green border-2 border-light-gray rounded focus:ring-mint-green"
                              />
                              <span className="text-sm font-fredoka font-medium text-charcoal">Pet is spayed / neutered</span>
                            </label>
                            <div>
                              <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Allergies <span className="text-medium-gray font-normal">(comma-separated)</span></label>
                              <input
                                type="text"
                                value={petFormData.allergies}
                                onChange={(e) => handlePetFormChange('allergies', e.target.value)}
                                className="w-full border-2 border-light-gray rounded-xl px-4 py-3 font-fredoka focus:outline-none focus:border-coral-red transition-all"
                                placeholder="e.g., chicken, beef, pollen"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Current Medications <span className="text-medium-gray font-normal">(comma-separated)</span></label>
                              <input
                                type="text"
                                value={petFormData.medications}
                                onChange={(e) => handlePetFormChange('medications', e.target.value)}
                                className="w-full border-2 border-light-gray rounded-xl px-4 py-3 font-fredoka focus:outline-none focus:border-primary-blue transition-all"
                                placeholder="e.g., heartworm prevention, joint supplements"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Medical Notes</label>
                              <textarea
                                value={petFormData.medicalNotes}
                                onChange={(e) => handlePetFormChange('medicalNotes', e.target.value)}
                                rows={3}
                                className="w-full border-2 border-light-gray rounded-xl px-4 py-3 font-fredoka focus:outline-none focus:border-vibrant-orange transition-all resize-none"
                                placeholder="Any additional medical information..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex gap-3 px-8 py-5 border-t border-light-gray shrink-0">
                      <button
                        onClick={() => setShowAddPet(false)}
                        className="flex-1 px-6 py-3 border-2 border-light-gray text-charcoal rounded-2xl font-fredoka font-medium hover:bg-soft-gray transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSavePet}
                        disabled={!petFormData.name.trim() || savingPet}
                        className="flex-1 px-6 py-3 bg-vibrant-orange hover:bg-vibrant-orange/90 disabled:bg-light-gray disabled:text-medium-gray text-white rounded-2xl font-fredoka font-medium transition-all flex items-center justify-center gap-2"
                      >
                        {savingPet ? (
                          <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /><span>Saving...</span></>
                        ) : (
                          <><Save className="h-4 w-4" /><span>{editingPet ? 'Update Pet' : 'Add Pet'}</span></>
                        )}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pet Profile Modal */}
            <AnimatePresence>
              {showPetProfile && selectedPet && (() => {
                const accent = petTypeAccent(selectedPet.type);
                return (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowPetProfile(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col mx-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Pet Profile Header — species color gradient */}
                      <div className={`bg-gradient-to-br ${accent.header} p-6 text-white shrink-0`}>
                        <div className="flex items-center justify-between mb-5">
                          <button
                            onClick={() => setShowPetProfile(false)}
                            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                          >
                            <ArrowLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => { setShowPetProfile(false); handleEditPet(selectedPet); }}
                            className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors font-fredoka text-sm font-medium"
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </button>
                        </div>

                        <div className="flex items-center gap-5">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/20 flex items-center justify-center text-4xl shrink-0 border-2 border-white/30">
                            {selectedPet.image ? (
                              <img src={selectedPet.image} alt={selectedPet.name} className="w-full h-full object-cover" />
                            ) : (
                              <span>{getPetTypeEmoji(selectedPet.type)}</span>
                            )}
                          </div>
                          <div>
                            <h2 className="text-2xl font-fredoka font-bold">{selectedPet.name}</h2>
                            <p className="opacity-80 font-fredoka capitalize">{selectedPet.type} · {getPetAge(selectedPet)}</p>
                            {selectedPet.breed && <p className="opacity-70 text-sm font-fredoka mt-0.5">{selectedPet.breed}</p>}
                          </div>
                        </div>

                        {/* Stats row */}
                        {(selectedPet.weight || selectedPet.gender || selectedPet.color) && (
                          <div className="grid grid-cols-3 gap-2 mt-5">
                            {selectedPet.weight && (
                              <div className="bg-white/15 rounded-xl p-3 text-center">
                                <p className="font-fredoka font-bold text-sm">{selectedPet.weight} {selectedPet.weightUnit || 'kg'}</p>
                                <p className="text-xs opacity-70 font-fredoka">Weight</p>
                              </div>
                            )}
                            {selectedPet.gender && (
                              <div className="bg-white/15 rounded-xl p-3 text-center">
                                <p className="font-fredoka font-bold text-sm capitalize">{selectedPet.gender}</p>
                                <p className="text-xs opacity-70 font-fredoka">Gender</p>
                              </div>
                            )}
                            {selectedPet.color && (
                              <div className="bg-white/15 rounded-xl p-3 text-center">
                                <p className="font-fredoka font-bold text-sm">{selectedPet.color}</p>
                                <p className="text-xs opacity-70 font-fredoka">Color</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Pet Information Body */}
                      <div className="overflow-y-auto flex-1 p-6 bg-soft-gray/40">
                        <div className="space-y-3">
                          {selectedPet.dateOfBirth && (
                            <div className="bg-white rounded-xl p-4 flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-medium-gray shrink-0" />
                              <div>
                                <p className="text-xs font-fredoka text-medium-gray uppercase tracking-wide">Date of Birth</p>
                                <p className="font-fredoka font-medium text-charcoal">{new Date(selectedPet.dateOfBirth).toLocaleDateString()}</p>
                              </div>
                            </div>
                          )}

                          {selectedPet.isNeutered !== undefined && (
                            <div className="bg-white rounded-xl p-4 flex items-center gap-3">
                              <Shield className="h-5 w-5 text-mint-green shrink-0" />
                              <div>
                                <p className="text-xs font-fredoka text-medium-gray uppercase tracking-wide">Neutered / Spayed</p>
                                <p className="font-fredoka font-medium text-charcoal">{selectedPet.isNeutered ? 'Yes' : 'No'}</p>
                              </div>
                            </div>
                          )}

                          {selectedPet.microchipId && (
                            <div className="bg-white rounded-xl p-4 flex items-center gap-3">
                              <Shield className="h-5 w-5 text-lavender shrink-0" />
                              <div>
                                <p className="text-xs font-fredoka text-medium-gray uppercase tracking-wide">Microchip ID</p>
                                <p className="font-fredoka font-medium text-charcoal font-mono text-sm">{selectedPet.microchipId}</p>
                              </div>
                            </div>
                          )}

                          {selectedPet.medicalNotes && (
                            <div className="bg-white rounded-xl p-4">
                              <p className="text-xs font-fredoka text-medium-gray uppercase tracking-wide mb-2">Medical Notes</p>
                              <p className="font-fredoka text-charcoal whitespace-pre-wrap text-sm">{selectedPet.medicalNotes}</p>
                            </div>
                          )}

                          {selectedPet.allergies && selectedPet.allergies.length > 0 && (
                            <div className="bg-white rounded-xl p-4">
                              <p className="text-xs font-fredoka text-medium-gray uppercase tracking-wide mb-2">Allergies</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedPet.allergies.map((allergy, i) => (
                                  <span key={i} className="px-3 py-1 bg-coral-red/10 text-coral-red rounded-full text-sm font-fredoka font-medium">
                                    {allergy}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedPet.medications && selectedPet.medications.length > 0 && (
                            <div className="bg-white rounded-xl p-4">
                              <p className="text-xs font-fredoka text-medium-gray uppercase tracking-wide mb-2">Current Medications</p>
                              <div className="space-y-1.5">
                                {selectedPet.medications.map((med, i) => (
                                  <div key={i} className="px-3 py-2 bg-primary-blue/5 border border-primary-blue/10 rounded-lg text-sm font-fredoka text-charcoal">
                                    {med}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {!selectedPet.dateOfBirth &&
                           !selectedPet.microchipId &&
                           !selectedPet.medicalNotes &&
                           (!selectedPet.allergies || selectedPet.allergies.length === 0) &&
                           (!selectedPet.medications || selectedPet.medications.length === 0) && (
                            <div className="text-center py-12">
                              <div className="w-16 h-16 bg-soft-gray rounded-full flex items-center justify-center mx-auto mb-4">
                                <Activity className="h-8 w-8 text-medium-gray" />
                              </div>
                              <h3 className="text-base font-fredoka font-bold text-charcoal mb-1">No additional details</h3>
                              <p className="text-medium-gray font-fredoka text-sm">Edit {selectedPet.name}'s profile to add more information</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
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
