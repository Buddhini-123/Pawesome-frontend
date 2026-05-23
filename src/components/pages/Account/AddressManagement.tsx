import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Home,
  Building,
  Star,
  Check,
  X,
  Phone,
  User,
  Navigation,
  Hash,
  Loader2,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../../../services/api';
import { toast } from 'react-toastify';

// All 25 valid Sri Lankan districts (must match backend Address::SRI_LANKAN_DISTRICTS)
const SRI_LANKAN_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya',
];

interface Address {
  id: string | number;
  type: 'home' | 'work' | 'other';
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  district: string;
  postal_code: string;
  landmark?: string;
  is_default: boolean;
  formatted_address: string;
  display_name: string;
}

interface AddressFormData {
  type: 'home' | 'work' | 'other';
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  district: string;
  postal_code: string;
  landmark: string;
  is_default: boolean;
}

const EMPTY_FORM: AddressFormData = {
  type: 'home',
  full_name: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  city: '',
  district: '',
  postal_code: '',
  landmark: '',
  is_default: false,
};

const AddressManagement: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | number | null>(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/addresses');
      if (response.success && response.data) {
        setAddresses((response.data as any).data || []);
      } else {
        setAddresses([]);
      }
    } catch {
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setFieldErrors({});
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Client-side validation matching backend rules
  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      errors.full_name = 'Full name is required';
    } else if (formData.full_name.trim().length < 2) {
      errors.full_name = 'Name must be at least 2 characters';
    }

    const rawPhone = formData.phone.replace(/\s/g, '');
    if (!rawPhone) {
      errors.phone = 'Phone number is required';
    } else if (!/^(\+94|0)[0-9]{9}$/.test(rawPhone)) {
      errors.phone = 'Enter a valid Sri Lankan number (e.g. 0712345678 or +94712345678)';
    }

    if (!formData.address_line1.trim()) {
      errors.address_line1 = 'Address line 1 is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.district) {
      errors.district = 'Please select a district';
    }

    if (!formData.postal_code.trim()) {
      errors.postal_code = 'Postal code is required';
    } else if (!/^[0-9]{5}$/.test(formData.postal_code.trim())) {
      errors.postal_code = 'Enter a valid 5-digit postal code';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        address_line2: formData.address_line2 || null,
        landmark: formData.landmark || null,
      };

      let response;
      if (editingAddress) {
        response = await api.put(`/users/addresses/${editingAddress.id}`, payload);
      } else {
        response = await api.post('/users/addresses', payload);
      }

      if (response.success) {
        toast.success(editingAddress ? 'Address updated' : 'Address added');
        await fetchAddresses();
        resetForm();
      } else {
        // Handle backend 422 validation errors inline
        const backendErrors = (response as any)?.response?.data?.errors as Record<string, string[]> | undefined;
        if (backendErrors) {
          const mapped: Record<string, string> = {};
          for (const [field, messages] of Object.entries(backendErrors)) {
            mapped[field] = Array.isArray(messages) ? messages[0] : String(messages);
          }
          setFieldErrors(mapped);
        } else {
          toast.error((response as any)?.response?.data?.message || 'Failed to save address');
        }
      }
    } catch (error: any) {
      const backendErrors = error?.response?.data?.errors as Record<string, string[]> | undefined;
      if (backendErrors) {
        const mapped: Record<string, string> = {};
        for (const [field, messages] of Object.entries(backendErrors)) {
          mapped[field] = Array.isArray(messages) ? messages[0] : String(messages);
        }
        setFieldErrors(mapped);
      } else {
        toast.error(error?.response?.data?.message || error?.message || 'Failed to save address');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (addressId: string | number) => {
    try {
      setDeletingId(addressId);
      const response = await api.delete(`/users/addresses/${addressId}`);
      if (response.success) {
        toast.success('Address deleted');
        setAddresses(prev => prev.filter(a => a.id !== addressId));
      } else {
        toast.error((response as any)?.data?.message || 'Failed to delete address');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete address');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleSetDefault = async (addressId: string | number) => {
    try {
      const response = await api.patch(`/users/addresses/${addressId}/set-default`);
      if (response.success) {
        toast.success('Default address updated');
        await fetchAddresses();
      }
    } catch {
      toast.error('Failed to set default address');
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      full_name: address.full_name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      district: address.district,
      postal_code: address.postal_code,
      landmark: address.landmark || '',
      is_default: address.is_default,
    });
    setFieldErrors({});
    setShowForm(true);
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-5 w-5" />;
      case 'work': return <Building className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

  const typeAccent = (type: string) => {
    switch (type) {
      case 'home': return { bar: 'bg-primary-blue', icon: 'bg-primary-blue/10 text-primary-blue', active: 'bg-primary-blue text-white' };
      case 'work': return { bar: 'bg-vibrant-orange', icon: 'bg-vibrant-orange/10 text-vibrant-orange', active: 'bg-vibrant-orange text-white' };
      default:     return { bar: 'bg-lavender',      icon: 'bg-lavender/10 text-lavender',           active: 'bg-lavender text-white' };
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:border-transparent transition-all font-fredoka ${
      fieldErrors[field]
        ? 'border-red-400 focus:ring-red-300'
        : 'border-light-gray focus:ring-primary-blue'
    }`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-fredoka font-bold text-charcoal">My Addresses</h2>
          <p className="text-medium-gray font-fredoka">Manage your delivery addresses</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary-blue text-white px-6 py-3 rounded-2xl font-fredoka font-medium hover:bg-primary-blue/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add New Address
        </button>
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => !submitting && resetForm()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-fredoka font-bold text-charcoal">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button
                  onClick={resetForm}
                  disabled={submitting}
                  className="p-2 hover:bg-soft-gray rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Address Type */}
                <div>
                  <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                    Address Type *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['home', 'work', 'other'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleChange('type', type)}
                        className={`px-4 py-3 rounded-xl font-fredoka font-medium transition-all flex items-center justify-center gap-2 ${
                          formData.type === type
                            ? 'bg-primary-blue text-white'
                            : 'bg-soft-gray text-charcoal hover:bg-light-gray'
                        }`}
                      >
                        {getAddressIcon(type)}
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    className={inputClass('full_name')}
                    placeholder="Recipient's full name"
                  />
                  {fieldErrors.full_name && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />{fieldErrors.full_name}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={inputClass('phone')}
                    placeholder="0712345678 or +94712345678"
                  />
                  {fieldErrors.phone && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />{fieldErrors.phone}
                    </p>
                  )}
                </div>

                {/* Address Line 1 */}
                <div>
                  <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={formData.address_line1}
                    onChange={(e) => handleChange('address_line1', e.target.value)}
                    className={inputClass('address_line1')}
                    placeholder="House no., Building, Street"
                  />
                  {fieldErrors.address_line1 && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />{fieldErrors.address_line1}
                    </p>
                  )}
                </div>

                {/* Address Line 2 */}
                <div>
                  <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                    Address Line 2
                    <span className="text-medium-gray font-normal ml-1">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address_line2}
                    onChange={(e) => handleChange('address_line2', e.target.value)}
                    className={inputClass('address_line2')}
                    placeholder="Area, Colony, Apartment no."
                  />
                </div>

                {/* City & District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className={inputClass('city')}
                      placeholder="e.g. Colombo"
                    />
                    {fieldErrors.city && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />{fieldErrors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                      District *
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => handleChange('district', e.target.value)}
                      className={inputClass('district')}
                    >
                      <option value="">— Select District —</option>
                      {SRI_LANKAN_DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    {fieldErrors.district && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />{fieldErrors.district}
                      </p>
                    )}
                  </div>
                </div>

                {/* Postal Code & Landmark */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                      <Hash className="inline h-4 w-4 mr-1" />
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      value={formData.postal_code}
                      onChange={(e) => handleChange('postal_code', e.target.value.replace(/\D/g, ''))}
                      className={inputClass('postal_code')}
                      placeholder="5-digit code"
                      maxLength={5}
                    />
                    {fieldErrors.postal_code && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />{fieldErrors.postal_code}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                      <Navigation className="inline h-4 w-4 mr-1" />
                      Landmark
                      <span className="text-medium-gray font-normal ml-1">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => handleChange('landmark', e.target.value)}
                      className={inputClass('landmark')}
                      placeholder="Near landmark"
                    />
                  </div>
                </div>

                {/* Set as Default */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.is_default}
                    onChange={(e) => handleChange('is_default', e.target.checked)}
                    className="w-4 h-4 text-primary-blue rounded"
                  />
                  <span className="font-fredoka text-charcoal">Set as default delivery address</span>
                </label>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={submitting}
                    className="flex-1 px-6 py-3 border-2 border-light-gray text-charcoal rounded-2xl font-fredoka font-medium hover:bg-soft-gray transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 bg-primary-blue text-white rounded-2xl font-fredoka font-medium hover:bg-primary-blue/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <><Loader2 className="h-4 w-4 animate-spin" />Saving...</>
                    ) : (
                      <><Check className="h-4 w-4" />{editingAddress ? 'Update Address' : 'Add Address'}</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address List */}
      {addresses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-white rounded-2xl"
        >
          <MapPin className="h-16 w-16 text-medium-gray mx-auto mb-4" />
          <h3 className="text-xl font-fredoka font-bold text-charcoal mb-2">No Addresses Added</h3>
          <p className="text-medium-gray font-fredoka mb-6">Add your first delivery address to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-primary-blue text-white px-6 py-3 rounded-2xl font-fredoka font-medium hover:bg-primary-blue/90 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Address
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {addresses.map((address, index) => {
            const accent = typeAccent(address.type);
            const isConfirmingDelete = confirmDeleteId === address.id;
            const isDeleting = deletingId === address.id;

            return (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative bg-white rounded-2xl overflow-hidden shadow-sm border transition-all duration-200 ${
                  address.is_default
                    ? 'border-primary-blue/30 shadow-primary-blue/10 shadow-md'
                    : 'border-light-gray hover:shadow-md hover:border-light-gray'
                }`}
              >
                {/* Colored accent bar */}
                <div className={`h-1 w-full ${accent.bar}`} />

                <div className="p-5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${address.is_default ? accent.active : accent.icon}`}>
                        {getAddressIcon(address.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-fredoka font-bold text-charcoal text-base leading-tight">
                            {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                          </h3>
                          {address.is_default && (
                            <span className="px-2 py-0.5 bg-primary-blue text-white text-xs rounded-full font-fredoka font-medium flex items-center gap-1">
                              <Star className="h-2.5 w-2.5 fill-white" />
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-medium-gray font-fredoka mt-0.5">{address.full_name}</p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {!isConfirmingDelete && (
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => handleEdit(address)}
                          className="p-2 hover:bg-soft-gray rounded-lg transition-colors text-medium-gray hover:text-charcoal"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(address.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-medium-gray hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Address Details */}
                  <div className="space-y-2 mb-4">
                    {/* Street lines */}
                    <div className="flex gap-2">
                      <MapPin className="h-4 w-4 text-medium-gray shrink-0 mt-0.5" />
                      <div className="text-sm text-charcoal font-fredoka leading-snug">
                        <p>{address.address_line1}</p>
                        {address.address_line2 && <p className="text-medium-gray">{address.address_line2}</p>}
                      </div>
                    </div>

                    {/* City / District / Postal */}
                    <div className="flex gap-2">
                      <Navigation className="h-4 w-4 text-medium-gray shrink-0 mt-0.5" />
                      <p className="text-sm font-fredoka text-medium-gray">
                        {address.city}, {address.district} &nbsp;·&nbsp; {address.postal_code}
                      </p>
                    </div>

                    {/* Landmark */}
                    {address.landmark && (
                      <div className="flex gap-2">
                        <Hash className="h-4 w-4 text-medium-gray shrink-0 mt-0.5" />
                        <p className="text-sm font-fredoka text-medium-gray">Near {address.landmark}</p>
                      </div>
                    )}

                    {/* Phone */}
                    <div className="flex gap-2">
                      <Phone className="h-4 w-4 text-medium-gray shrink-0 mt-0.5" />
                      <p className="text-sm font-fredoka text-medium-gray">{address.phone}</p>
                    </div>
                  </div>

                  {/* Inline delete confirmation */}
                  <AnimatePresence>
                    {isConfirmingDelete && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl mb-3">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                            <p className="text-sm font-fredoka text-red-700 font-medium">
                              Delete this address?
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              disabled={isDeleting}
                              className="flex-1 py-2 bg-white border border-light-gray text-charcoal rounded-xl font-fredoka text-sm hover:bg-soft-gray transition-colors disabled:opacity-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDelete(address.id)}
                              disabled={isDeleting}
                              className="flex-1 py-2 bg-red-500 text-white rounded-xl font-fredoka text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                            >
                              {isDeleting ? (
                                <><Loader2 className="h-3 w-3 animate-spin" />Deleting...</>
                              ) : (
                                <><Trash2 className="h-3 w-3" />Delete</>
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Footer: Set as Default */}
                  {!address.is_default && !isConfirmingDelete && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="w-full py-2 rounded-xl font-fredoka text-sm font-medium border border-dashed border-light-gray text-medium-gray hover:border-primary-blue hover:text-primary-blue hover:bg-primary-blue/5 transition-all"
                    >
                      Set as Default
                    </button>
                  )}

                  {address.is_default && !isConfirmingDelete && (
                    <div className="w-full py-2 rounded-xl font-fredoka text-sm font-medium bg-primary-blue/5 text-primary-blue text-center flex items-center justify-center gap-1.5">
                      <Check className="h-3.5 w-3.5" />
                      Used for deliveries
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AddressManagement;
