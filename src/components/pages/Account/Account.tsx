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
  Award,
  PawPrint,
  Plus,
  Trash2,
  Save,
  Upload,
  Weight,
  Ruler,
  Stethoscope,
  AlertTriangle,
  Pill,
  Activity,
  FileText,
  Filter,
  Search,
  ArrowLeft,
  Eye,
  Syringe,
  Scissors,
  GraduationCap,
  Brain,
  Heart as HeartIcon,
  Utensils,
  AlertCircle,
  TrendingUp,
  Paperclip
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useLoyalty } from '../../../hooks/useLoyalty';
import { useNavigate } from 'react-router-dom';
import { Pet, PetForm, PetTimelineEntry, TimelineEntryType, TimelineCategory } from '../../../types';
import { v4 as uuidv4 } from 'uuid';

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

  // Pet Management State
  const [pets, setPets] = useState<Pet[]>(user?.pets || []);
  const [showAddPet, setShowAddPet] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showPetProfile, setShowPetProfile] = useState(false);
  const [showAddTimelineEntry, setShowAddTimelineEntry] = useState(false);
  const [timelineFilter, setTimelineFilter] = useState<TimelineCategory | 'all'>('all');
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
  const [timelineFormData, setTimelineFormData] = useState({
    type: 'general' as TimelineEntryType,
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    importance: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    // Vet Visit Fields
    vetName: '',
    clinic: '',
    reason: '',
    diagnosis: '',
    treatment: '',
    cost: '',
    // Medication Fields
    medicationName: '',
    dosage: '',
    frequency: '',
    prescribedBy: '',
    // Weight Fields
    weight: '',
    bodyCondition: 'ideal' as 'underweight' | 'ideal' | 'overweight' | 'obese',
    // Vaccination Fields
    vaccine: '',
    veterinarian: '',
    nextDue: '',
    // Training Fields
    trainer: '',
    skill: '',
    progress: 'started' as 'started' | 'in_progress' | 'mastered',
    duration: '',
    // Behavior Fields
    behavior: '',
    severity: 'mild' as 'mild' | 'moderate' | 'severe',
    triggers: '',
    interventions: '',
    // Grooming Fields
    service: '',
    groomer: '',
    groomingCost: '',
    nextAppointment: '',
    // Nutrition Fields
    food: '',
    brand: '',
    amount: '',
    calories: '',
    nutritionReason: '',
    supplements: ''
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User, color: 'text-primary-blue' },
    { id: 'pets', name: 'My Pets', icon: PawPrint, color: 'text-sunny-yellow' },
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

  // Pet Management Functions
  const handleAddPet = () => {
    setEditingPet(null);
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

  const handleSavePet = () => {
    const petData: Pet = {
      id: editingPet?.id || uuidv4(),
      name: petFormData.name,
      type: petFormData.type,
      breed: petFormData.breed || undefined,
      age: petFormData.age ? parseInt(petFormData.age) : undefined,
      ageUnit: petFormData.ageUnit,
      weight: petFormData.weight ? parseFloat(petFormData.weight) : undefined,
      weightUnit: petFormData.weightUnit,
      gender: petFormData.gender,
      color: petFormData.color || undefined,
      dateOfBirth: petFormData.dateOfBirth ? new Date(petFormData.dateOfBirth) : undefined,
      isNeutered: petFormData.isNeutered,
      microchipId: petFormData.microchipId || undefined,
      medicalNotes: petFormData.medicalNotes || undefined,
      allergies: petFormData.allergies ? petFormData.allergies.split(',').map(a => a.trim()).filter(a => a) : undefined,
      medications: petFormData.medications ? petFormData.medications.split(',').map(m => m.trim()).filter(m => m) : undefined,
      createdAt: editingPet?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (editingPet) {
      setPets(pets.map(pet => pet.id === editingPet.id ? petData : pet));
    } else {
      setPets([...pets, petData]);
    }
    
    setShowAddPet(false);
    setEditingPet(null);
  };

  const handleDeletePet = (petId: string) => {
    setPets(pets.filter(pet => pet.id !== petId));
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

  // Timeline Management Functions
  const handleViewPetProfile = (pet: Pet) => {
    setSelectedPet(pet);
    setShowPetProfile(true);
  };

  const handleAddTimelineEntry = () => {
    setTimelineFormData({
      type: 'general',
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      importance: 'medium',
      vetName: '', clinic: '', reason: '', diagnosis: '', treatment: '', cost: '',
      medicationName: '', dosage: '', frequency: '', prescribedBy: '',
      weight: '', bodyCondition: 'ideal',
      vaccine: '', veterinarian: '', nextDue: '',
      trainer: '', skill: '', progress: 'started', duration: '',
      behavior: '', severity: 'mild', triggers: '', interventions: '',
      service: '', groomer: '', groomingCost: '', nextAppointment: '',
      food: '', brand: '', amount: '', calories: '', nutritionReason: '', supplements: ''
    });
    setShowAddTimelineEntry(true);
  };

  const handleSaveTimelineEntry = () => {
    if (!selectedPet) return;

    const newEntry: PetTimelineEntry = {
      id: uuidv4(),
      petId: selectedPet.id,
      date: new Date(timelineFormData.date),
      type: timelineFormData.type,
      title: timelineFormData.title,
      description: timelineFormData.description || undefined,
      category: getCategoryFromType(timelineFormData.type),
      importance: timelineFormData.importance,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(timelineFormData.type === 'vet_visit' && {
        vetVisit: {
          vetName: timelineFormData.vetName,
          clinic: timelineFormData.clinic,
          reason: timelineFormData.reason,
          diagnosis: timelineFormData.diagnosis || undefined,
          treatment: timelineFormData.treatment || undefined,
          cost: timelineFormData.cost ? parseFloat(timelineFormData.cost) : undefined,
        }
      }),
      ...(timelineFormData.type === 'medication' && {
        medication: {
          name: timelineFormData.medicationName,
          dosage: timelineFormData.dosage,
          frequency: timelineFormData.frequency,
          startDate: new Date(timelineFormData.date),
          prescribedBy: timelineFormData.prescribedBy || undefined,
        }
      }),
      ...(timelineFormData.type === 'weight_check' && {
        weight: {
          weight: parseFloat(timelineFormData.weight),
          unit: 'kg',
          bodyCondition: timelineFormData.bodyCondition,
        }
      }),
      ...(timelineFormData.type === 'vaccination' && {
        vaccination: {
          vaccine: timelineFormData.vaccine,
          veterinarian: timelineFormData.veterinarian,
          clinic: timelineFormData.clinic,
          nextDue: timelineFormData.nextDue ? new Date(timelineFormData.nextDue) : undefined,
        }
      }),
      ...(timelineFormData.type === 'training' && {
        training: {
          skill: timelineFormData.skill,
          progress: timelineFormData.progress,
          trainer: timelineFormData.trainer || undefined,
          duration: timelineFormData.duration ? parseInt(timelineFormData.duration) : undefined,
        }
      }),
      ...(timelineFormData.type === 'behavior' && {
        behavior: {
          behavior: timelineFormData.behavior,
          severity: timelineFormData.severity,
          triggers: timelineFormData.triggers ? timelineFormData.triggers.split(',').map(t => t.trim()) : undefined,
          interventions: timelineFormData.interventions ? timelineFormData.interventions.split(',').map(i => i.trim()) : undefined,
        }
      }),
      ...(timelineFormData.type === 'grooming' && {
        grooming: {
          service: timelineFormData.service,
          groomer: timelineFormData.groomer || undefined,
          cost: timelineFormData.groomingCost ? parseFloat(timelineFormData.groomingCost) : undefined,
          nextAppointment: timelineFormData.nextAppointment ? new Date(timelineFormData.nextAppointment) : undefined,
        }
      }),
      ...(timelineFormData.type === 'nutrition' && {
        nutrition: {
          food: timelineFormData.food,
          brand: timelineFormData.brand || undefined,
          amount: timelineFormData.amount,
          calories: timelineFormData.calories ? parseInt(timelineFormData.calories) : undefined,
          reason: timelineFormData.nutritionReason || undefined,
          supplements: timelineFormData.supplements ? timelineFormData.supplements.split(',').map(s => s.trim()) : undefined,
        }
      })
    };

    const updatedPets = pets.map(pet => 
      pet.id === selectedPet.id 
        ? { ...pet, timeline: [...(pet.timeline || []), newEntry] }
        : pet
    );

    setPets(updatedPets);
    setSelectedPet(prev => prev ? { ...prev, timeline: [...(prev.timeline || []), newEntry] } : null);
    setShowAddTimelineEntry(false);
  };

  const getCategoryFromType = (type: TimelineEntryType): TimelineCategory => {
    const categoryMap: Record<TimelineEntryType, TimelineCategory> = {
      'vet_visit': 'medical',
      'vaccination': 'health',
      'medication': 'medical',
      'weight_check': 'wellness',
      'grooming': 'grooming',
      'training': 'training',
      'behavior': 'behavior',
      'nutrition': 'nutrition',
      'milestone': 'milestone',
      'emergency': 'emergency',
      'general': 'lifestyle',
      'surgery': 'medical',
      'dental': 'health',
      'boarding': 'lifestyle',
      'travel': 'lifestyle'
    };
    return categoryMap[type];
  };

  const getTimelineIcon = (type: TimelineEntryType) => {
    const iconMap: Record<TimelineEntryType, any> = {
      'vet_visit': Stethoscope,
      'vaccination': Syringe,
      'medication': Pill,
      'weight_check': Weight,
      'grooming': Scissors,
      'training': GraduationCap,
      'behavior': Brain,
      'nutrition': Utensils,
      'milestone': Award,
      'emergency': AlertCircle,
      'general': FileText,
      'surgery': Stethoscope,
      'dental': HeartIcon,
      'boarding': MapPin,
      'travel': MapPin
    };
    return iconMap[type] || FileText;
  };

  const getImportanceColor = (importance: string) => {
    const colorMap = {
      'low': 'text-mint-green bg-mint-green/10',
      'medium': 'text-primary-blue bg-primary-blue/10',
      'high': 'text-vibrant-orange bg-vibrant-orange/10',
      'critical': 'text-coral-red bg-coral-red/10'
    };
    return colorMap[importance as keyof typeof colorMap] || colorMap.medium;
  };

  const handleTimelineFormChange = (field: string, value: any) => {
    setTimelineFormData(prev => ({ ...prev, [field]: value }));
  };

  const getFilteredTimeline = (timeline: PetTimelineEntry[]) => {
    if (timelineFilter === 'all') return timeline;
    return timeline.filter(entry => entry.category === timelineFilter);
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

              {/* Pets Grid */}
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
                        <div className="w-12 h-12 bg-sunny-yellow/20 rounded-full flex items-center justify-center text-2xl">
                          {getPetTypeEmoji(pet.type)}
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
                        <Activity className="h-4 w-4" />
                        <span>View Timeline</span>
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
                          disabled={!petFormData.name.trim()}
                          className="flex-1 px-6 py-3 bg-sunny-yellow hover:bg-sunny-yellow/90 disabled:bg-light-gray disabled:text-medium-gray text-charcoal rounded-xl font-fredoka font-medium transition-all flex items-center justify-center space-x-2"
                        >
                          <Save className="h-5 w-5" />
                          <span>{editingPet ? 'Update Pet' : 'Add Pet'}</span>
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
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-charcoal/10 rounded-full flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-2 sm:mb-4">
                            {getPetTypeEmoji(selectedPet.type)}
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-fredoka font-bold truncate">{selectedPet.name}</h2>
                          <p className="text-sm sm:text-lg opacity-80 capitalize">{selectedPet.type} • {getPetAge(selectedPet)}</p>
                        </div>
                        <button
                          onClick={handleAddTimelineEntry}
                          className="p-2 hover:bg-charcoal/10 rounded-lg transition-colors"
                        >
                          <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                      </div>
                      
                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                        <div className="bg-charcoal/10 rounded-xl p-3 sm:p-4 text-center">
                          <p className="text-lg sm:text-2xl font-fredoka font-bold">{selectedPet.timeline?.length || 0}</p>
                          <p className="text-xs sm:text-sm opacity-80">Timeline Entries</p>
                        </div>
                        <div className="bg-charcoal/10 rounded-xl p-3 sm:p-4 text-center">
                          <p className="text-lg sm:text-2xl font-fredoka font-bold">{selectedPet.weight || 'N/A'}</p>
                          <p className="text-xs sm:text-sm opacity-80">Weight ({selectedPet.weightUnit || 'kg'})</p>
                        </div>
                        <div className="bg-charcoal/10 rounded-xl p-3 sm:p-4 text-center">
                          <p className="text-lg sm:text-2xl font-fredoka font-bold">{selectedPet.timeline?.filter(e => e.type === 'vet_visit').length || 0}</p>
                          <p className="text-xs sm:text-sm opacity-80">Vet Visits</p>
                        </div>
                        <div className="bg-charcoal/10 rounded-xl p-3 sm:p-4 text-center">
                          <p className="text-lg sm:text-2xl font-fredoka font-bold">{selectedPet.timeline?.filter(e => e.type === 'vaccination').length || 0}</p>
                          <p className="text-xs sm:text-sm opacity-80">Vaccinations</p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Content */}
                    <div className="p-4 sm:p-6 lg:p-8 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                      {/* Timeline Filters */}
                      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                        <button
                          onClick={() => setTimelineFilter('all')}
                          className={`px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm font-fredoka font-medium transition-all ${
                            timelineFilter === 'all' 
                              ? 'bg-sunny-yellow text-charcoal' 
                              : 'bg-soft-gray text-medium-gray hover:bg-light-gray'
                          }`}
                        >
                          All Events
                        </button>
                        {(['health', 'medical', 'wellness', 'behavior', 'training', 'grooming', 'nutrition'] as const).map(category => (
                          <button
                            key={category}
                            onClick={() => setTimelineFilter(category)}
                            className={`px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm font-fredoka font-medium transition-all capitalize ${
                              timelineFilter === category 
                                ? 'bg-sunny-yellow text-charcoal' 
                                : 'bg-soft-gray text-medium-gray hover:bg-light-gray'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>

                      {/* Timeline */}
                      <div className="space-y-4">
                        {selectedPet.timeline && getFilteredTimeline(selectedPet.timeline)
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((entry) => {
                            const Icon = getTimelineIcon(entry.type);
                            return (
                              <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-soft-gray rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all"
                              >
                                <div className="flex items-start space-x-3 sm:space-x-4">
                                  <div className={`p-2 sm:p-3 rounded-xl ${getImportanceColor(entry.importance)} shrink-0`}>
                                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2 flex-col sm:flex-row sm:items-center gap-2">
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-fredoka font-bold text-base sm:text-lg text-charcoal truncate">{entry.title}</h4>
                                        <p className="text-xs sm:text-sm text-medium-gray">
                                          {new Date(entry.date).toLocaleDateString()} • {entry.type.replace('_', ' ')}
                                        </p>
                                      </div>
                                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-fredoka font-medium ${getImportanceColor(entry.importance)} shrink-0 self-start sm:self-center`}>
                                        {entry.importance}
                                      </span>
                                    </div>
                                    
                                    {entry.description && (
                                      <p className="text-charcoal mb-4">{entry.description}</p>
                                    )}

                                    {/* Type-specific details */}
                                    {entry.vetVisit && (
                                      <div className="bg-white rounded-xl p-3 sm:p-4 space-y-2">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                          <div>
                                            <p className="text-xs sm:text-sm font-fredoka font-medium text-charcoal">Veterinarian</p>
                                            <p className="text-xs sm:text-sm text-medium-gray">{entry.vetVisit.vetName} at {entry.vetVisit.clinic}</p>
                                          </div>
                                          <div>
                                            <p className="text-xs sm:text-sm font-fredoka font-medium text-charcoal">Reason</p>
                                            <p className="text-xs sm:text-sm text-medium-gray">{entry.vetVisit.reason}</p>
                                          </div>
                                          {entry.vetVisit.diagnosis && (
                                            <div className="sm:col-span-2">
                                              <p className="text-xs sm:text-sm font-fredoka font-medium text-charcoal">Diagnosis</p>
                                              <p className="text-xs sm:text-sm text-medium-gray">{entry.vetVisit.diagnosis}</p>
                                            </div>
                                          )}
                                          {entry.vetVisit.treatment && (
                                            <div className="sm:col-span-2">
                                              <p className="text-xs sm:text-sm font-fredoka font-medium text-charcoal">Treatment</p>
                                              <p className="text-xs sm:text-sm text-medium-gray">{entry.vetVisit.treatment}</p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {entry.medication && (
                                      <div className="bg-white rounded-xl p-3 sm:p-4 space-y-2">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                          <div>
                                            <p className="text-xs sm:text-sm font-fredoka font-medium text-charcoal">Medication</p>
                                            <p className="text-xs sm:text-sm text-medium-gray">{entry.medication.name}</p>
                                          </div>
                                          <div>
                                            <p className="text-xs sm:text-sm font-fredoka font-medium text-charcoal">Dosage & Frequency</p>
                                            <p className="text-xs sm:text-sm text-medium-gray">{entry.medication.dosage} - {entry.medication.frequency}</p>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {entry.weight && (
                                      <div className="bg-white rounded-xl p-3 sm:p-4">
                                        <div className="flex items-center justify-between flex-col sm:flex-row gap-3 sm:gap-0">
                                          <div>
                                            <p className="text-xs sm:text-sm font-fredoka font-medium text-charcoal">Weight</p>
                                            <p className="text-xs sm:text-sm text-medium-gray">{entry.weight.weight} {entry.weight.unit}</p>
                                          </div>
                                          <div className="text-center sm:text-right">
                                            <p className="text-xs sm:text-sm font-fredoka font-medium text-charcoal mb-1">Body Condition</p>
                                            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-fredoka font-medium ${
                                              entry.weight.bodyCondition === 'ideal' ? 'bg-mint-green/20 text-mint-green' :
                                              entry.weight.bodyCondition === 'overweight' ? 'bg-vibrant-orange/20 text-vibrant-orange' :
                                              'bg-coral-red/20 text-coral-red'
                                            }`}>
                                              {entry.weight.bodyCondition}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {entry.vaccination && (
                                      <div className="bg-white rounded-xl p-3 sm:p-4 space-y-2">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                          <div>
                                            <p className="text-xs sm:text-sm font-fredoka font-medium text-charcoal">Vaccine</p>
                                            <p className="text-xs sm:text-sm text-medium-gray">{entry.vaccination.vaccine}</p>
                                          </div>
                                          <div>
                                            <p className="text-xs sm:text-sm font-fredoka font-medium text-charcoal">Veterinarian</p>
                                            <p className="text-xs sm:text-sm text-medium-gray">{entry.vaccination.veterinarian}</p>
                                          </div>
                                          {entry.vaccination.nextDue && (
                                            <div className="sm:col-span-2">
                                              <p className="text-xs sm:text-sm font-fredoka font-medium text-charcoal">Next Due</p>
                                              <p className="text-xs sm:text-sm text-medium-gray">{new Date(entry.vaccination.nextDue).toLocaleDateString()}</p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {entry.training && (
                                      <div className="bg-white rounded-xl p-3 sm:p-4 space-y-2">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                          <div>
                                            <p className="text-xs sm:text-sm font-fredoka font-medium text-charcoal">Skill</p>
                                            <p className="text-xs sm:text-sm text-medium-gray">{entry.training.skill}</p>
                                          </div>
                                          <div>
                                            <p className="text-xs sm:text-sm font-fredoka font-medium text-charcoal">Progress</p>
                                            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-fredoka font-medium ${
                                              entry.training.progress === 'mastered' ? 'bg-mint-green/20 text-mint-green' :
                                              entry.training.progress === 'in_progress' ? 'bg-vibrant-orange/20 text-vibrant-orange' :
                                              'bg-primary-blue/20 text-primary-blue'
                                            }`}>
                                              {entry.training.progress.replace('_', ' ')}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        
                        {/* Empty Timeline State */}
                        {(!selectedPet.timeline || getFilteredTimeline(selectedPet.timeline).length === 0) && (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-soft-gray rounded-full flex items-center justify-center mx-auto mb-4">
                              <Activity className="h-8 w-8 text-medium-gray" />
                            </div>
                            <h3 className="text-lg font-fredoka font-bold text-charcoal mb-2">No timeline entries yet</h3>
                            <p className="text-medium-gray mb-4">Start tracking {selectedPet.name}'s journey</p>
                            <button
                              onClick={handleAddTimelineEntry}
                              className="px-6 py-3 bg-sunny-yellow hover:bg-sunny-yellow/90 text-charcoal rounded-xl font-fredoka font-medium transition-all"
                            >
                              Add First Entry
                            </button>
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

      {/* Timeline Entry Form Modal */}
      <AnimatePresence>
        {showAddTimelineEntry && selectedPet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddTimelineEntry(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-primary-blue p-6 text-white flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-fredoka font-bold">Add Timeline Entry</h2>
                    <p className="opacity-90">for {selectedPet.name}</p>
                  </div>
                  <button
                    onClick={() => setShowAddTimelineEntry(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                        Entry Type *
                      </label>
                      <select
                        value={timelineFormData.type}
                        onChange={(e) => handleTimelineFormChange('type', e.target.value)}
                        className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                      >
                        <option value="general">General</option>
                        <option value="vet_visit">Vet Visit</option>
                        <option value="vaccination">Vaccination</option>
                        <option value="medication">Medication</option>
                        <option value="weight_check">Weight Check</option>
                        <option value="grooming">Grooming</option>
                        <option value="training">Training</option>
                        <option value="behavior">Behavior</option>
                        <option value="nutrition">Nutrition</option>
                        <option value="milestone">Milestone</option>
                        <option value="emergency">Emergency</option>
                        <option value="surgery">Surgery</option>
                        <option value="dental">Dental</option>
                        <option value="boarding">Boarding</option>
                        <option value="travel">Travel</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={timelineFormData.date}
                        onChange={(e) => handleTimelineFormChange('date', e.target.value)}
                        className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={timelineFormData.title}
                      onChange={(e) => handleTimelineFormChange('title', e.target.value)}
                      className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                      placeholder="Enter a title for this entry"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                        Importance
                      </label>
                      <select
                        value={timelineFormData.importance}
                        onChange={(e) => handleTimelineFormChange('importance', e.target.value)}
                        className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                      Description
                    </label>
                    <textarea
                      value={timelineFormData.description}
                      onChange={(e) => handleTimelineFormChange('description', e.target.value)}
                      rows={3}
                      className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all resize-none"
                      placeholder="Add any additional details..."
                    />
                  </div>

                  {/* Type-specific fields */}
                  {timelineFormData.type === 'vet_visit' && (
                    <div className="space-y-4 p-4 bg-soft-gray rounded-xl">
                      <h4 className="font-fredoka font-semibold text-charcoal">Vet Visit Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Veterinarian</label>
                          <input
                            type="text"
                            value={timelineFormData.vetName}
                            onChange={(e) => handleTimelineFormChange('vetName', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="Dr. Smith"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Clinic</label>
                          <input
                            type="text"
                            value={timelineFormData.clinic}
                            onChange={(e) => handleTimelineFormChange('clinic', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="Pet Care Clinic"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Reason</label>
                          <input
                            type="text"
                            value={timelineFormData.reason}
                            onChange={(e) => handleTimelineFormChange('reason', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="Annual checkup"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Cost</label>
                          <input
                            type="number"
                            value={timelineFormData.cost}
                            onChange={(e) => handleTimelineFormChange('cost', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="150"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Diagnosis</label>
                          <input
                            type="text"
                            value={timelineFormData.diagnosis}
                            onChange={(e) => handleTimelineFormChange('diagnosis', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="Healthy overall"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Treatment</label>
                          <input
                            type="text"
                            value={timelineFormData.treatment}
                            onChange={(e) => handleTimelineFormChange('treatment', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="Vaccination booster"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {timelineFormData.type === 'medication' && (
                    <div className="space-y-4 p-4 bg-soft-gray rounded-xl">
                      <h4 className="font-fredoka font-semibold text-charcoal">Medication Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Medication Name</label>
                          <input
                            type="text"
                            value={timelineFormData.medicationName}
                            onChange={(e) => handleTimelineFormChange('medicationName', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="Heartgard Plus"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Dosage</label>
                          <input
                            type="text"
                            value={timelineFormData.dosage}
                            onChange={(e) => handleTimelineFormChange('dosage', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="1 tablet"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Frequency</label>
                          <input
                            type="text"
                            value={timelineFormData.frequency}
                            onChange={(e) => handleTimelineFormChange('frequency', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="Once monthly"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Prescribed By</label>
                          <input
                            type="text"
                            value={timelineFormData.prescribedBy}
                            onChange={(e) => handleTimelineFormChange('prescribedBy', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="Dr. Johnson"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {timelineFormData.type === 'weight_check' && (
                    <div className="space-y-4 p-4 bg-soft-gray rounded-xl">
                      <h4 className="font-fredoka font-semibold text-charcoal">Weight Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Weight</label>
                          <input
                            type="number"
                            step="0.1"
                            value={timelineFormData.weight}
                            onChange={(e) => handleTimelineFormChange('weight', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="32.5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Body Condition</label>
                          <select
                            value={timelineFormData.bodyCondition}
                            onChange={(e) => handleTimelineFormChange('bodyCondition', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                          >
                            <option value="underweight">Underweight</option>
                            <option value="ideal">Ideal</option>
                            <option value="overweight">Overweight</option>
                            <option value="obese">Obese</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {timelineFormData.type === 'vaccination' && (
                    <div className="space-y-4 p-4 bg-soft-gray rounded-xl">
                      <h4 className="font-fredoka font-semibold text-charcoal">Vaccination Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Vaccine</label>
                          <input
                            type="text"
                            value={timelineFormData.vaccine}
                            onChange={(e) => handleTimelineFormChange('vaccine', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="DHPP"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Veterinarian</label>
                          <input
                            type="text"
                            value={timelineFormData.veterinarian}
                            onChange={(e) => handleTimelineFormChange('veterinarian', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="Dr. Smith"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Next Due Date</label>
                          <input
                            type="date"
                            value={timelineFormData.nextDue}
                            onChange={(e) => handleTimelineFormChange('nextDue', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {timelineFormData.type === 'training' && (
                    <div className="space-y-4 p-4 bg-soft-gray rounded-xl">
                      <h4 className="font-fredoka font-semibold text-charcoal">Training Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Skill</label>
                          <input
                            type="text"
                            value={timelineFormData.skill}
                            onChange={(e) => handleTimelineFormChange('skill', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="Sit command"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Progress</label>
                          <select
                            value={timelineFormData.progress}
                            onChange={(e) => handleTimelineFormChange('progress', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                          >
                            <option value="started">Started</option>
                            <option value="in_progress">In Progress</option>
                            <option value="mastered">Mastered</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Trainer</label>
                          <input
                            type="text"
                            value={timelineFormData.trainer}
                            onChange={(e) => handleTimelineFormChange('trainer', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="John Smith"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Duration (minutes)</label>
                          <input
                            type="number"
                            value={timelineFormData.duration}
                            onChange={(e) => handleTimelineFormChange('duration', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="30"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {timelineFormData.type === 'behavior' && (
                    <div className="space-y-4 p-4 bg-soft-gray rounded-xl">
                      <h4 className="font-fredoka font-semibold text-charcoal">Behavior Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Behavior</label>
                          <input
                            type="text"
                            value={timelineFormData.behavior}
                            onChange={(e) => handleTimelineFormChange('behavior', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="Excessive barking"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Severity</label>
                          <select
                            value={timelineFormData.severity}
                            onChange={(e) => handleTimelineFormChange('severity', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                          >
                            <option value="mild">Mild</option>
                            <option value="moderate">Moderate</option>
                            <option value="severe">Severe</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Triggers (comma-separated)</label>
                          <input
                            type="text"
                            value={timelineFormData.triggers}
                            onChange={(e) => handleTimelineFormChange('triggers', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="loud noises, strangers"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Interventions (comma-separated)</label>
                          <input
                            type="text"
                            value={timelineFormData.interventions}
                            onChange={(e) => handleTimelineFormChange('interventions', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="positive reinforcement, treats"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {timelineFormData.type === 'grooming' && (
                    <div className="space-y-4 p-4 bg-soft-gray rounded-xl">
                      <h4 className="font-fredoka font-semibold text-charcoal">Grooming Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Service</label>
                          <input
                            type="text"
                            value={timelineFormData.service}
                            onChange={(e) => handleTimelineFormChange('service', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="Full grooming package"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Groomer</label>
                          <input
                            type="text"
                            value={timelineFormData.groomer}
                            onChange={(e) => handleTimelineFormChange('groomer', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="Sarah Johnson"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Cost</label>
                          <input
                            type="number"
                            value={timelineFormData.groomingCost}
                            onChange={(e) => handleTimelineFormChange('groomingCost', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="75"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Next Appointment</label>
                          <input
                            type="date"
                            value={timelineFormData.nextAppointment}
                            onChange={(e) => handleTimelineFormChange('nextAppointment', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {timelineFormData.type === 'nutrition' && (
                    <div className="space-y-4 p-4 bg-soft-gray rounded-xl">
                      <h4 className="font-fredoka font-semibold text-charcoal">Nutrition Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Food</label>
                          <input
                            type="text"
                            value={timelineFormData.food}
                            onChange={(e) => handleTimelineFormChange('food', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="Premium Adult Dog Food"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Brand</label>
                          <input
                            type="text"
                            value={timelineFormData.brand}
                            onChange={(e) => handleTimelineFormChange('brand', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="Royal Canin"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Amount</label>
                          <input
                            type="text"
                            value={timelineFormData.amount}
                            onChange={(e) => handleTimelineFormChange('amount', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="2 cups daily"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Calories</label>
                          <input
                            type="number"
                            value={timelineFormData.calories}
                            onChange={(e) => handleTimelineFormChange('calories', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="380"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Reason</label>
                          <input
                            type="text"
                            value={timelineFormData.nutritionReason}
                            onChange={(e) => handleTimelineFormChange('nutritionReason', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="Weight management"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">Supplements (comma-separated)</label>
                          <input
                            type="text"
                            value={timelineFormData.supplements}
                            onChange={(e) => handleTimelineFormChange('supplements', e.target.value)}
                            className="w-full border-2 border-light-gray rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-all"
                            placeholder="omega-3, glucosamine"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex space-x-4 p-6 border-t border-light-gray bg-soft-gray flex-shrink-0">
                <button
                  onClick={() => setShowAddTimelineEntry(false)}
                  className="flex-1 px-6 py-3 border-2 border-light-gray text-medium-gray rounded-xl font-fredoka font-medium hover:bg-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTimelineEntry}
                  disabled={!timelineFormData.title.trim()}
                  className="flex-1 px-6 py-3 bg-primary-blue hover:bg-primary-blue/90 disabled:bg-light-gray disabled:text-medium-gray text-white rounded-xl font-fredoka font-medium transition-all flex items-center justify-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>Add Entry</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Account;