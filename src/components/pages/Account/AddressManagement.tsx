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
  Loader2
} from 'lucide-react';
import { api } from '../../../services/api';
import { toast } from 'react-toastify';

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
  address_line2?: string;
  city: string;
  district: string;
  postal_code: string;
  landmark?: string;
  is_default: boolean;
}

const AddressManagement: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    type: 'home',
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    district: '',
    postal_code: '',
    landmark: '',
    is_default: false
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      console.log('[AddressManagement] Fetching addresses...');
      setLoading(true);
      const response = await api.get('/users/addresses');
      console.log('[AddressManagement] Fetch response:', response);

      if (response.success && response.data) {
        const addressList = (response.data as any).data || [];
        console.log('[AddressManagement] Addresses loaded:', addressList.length, addressList);
        setAddresses(addressList);
      } else {
        console.warn('[AddressManagement] Response not successful or no data:', response);
        setAddresses([]);
      }
    } catch (error: any) {
      console.error('[AddressManagement] Failed to fetch addresses:', error);
      console.error('[AddressManagement] Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status
      });
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      type: 'home',
      full_name: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      district: '',
      postal_code: '',
      landmark: '',
      is_default: false
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  // Handle form submit (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name || !formData.phone || !formData.address_line1 ||
        !formData.city || !formData.district || !formData.postal_code) {
      toast.error('Please fill all required fields');
      return;
    }

    console.log('[AddressManagement] Submitting form data:', formData);

    try {
      setSubmitting(true);
      let response;

      if (editingAddress) {
        // Update existing address
        console.log('[AddressManagement] Updating address:', editingAddress.id);
        response = await api.put(`/users/addresses/${editingAddress.id}`, formData);
        console.log('[AddressManagement] Update response:', response);
        toast.success('Address updated successfully');
      } else {
        // Create new address
        console.log('[AddressManagement] Creating new address');
        response = await api.post('/users/addresses', formData);
        console.log('[AddressManagement] Create response:', response);
        toast.success('Address added successfully');
      }

      if (response.success) {
        console.log('[AddressManagement] Fetching updated address list');
        await fetchAddresses();
        resetForm();
      } else {
        console.error('[AddressManagement] Response not successful:', response);
        toast.error(response.error || 'Failed to save address');
      }
    } catch (error: any) {
      console.error('[AddressManagement] Submit error:', error);
      console.error('[AddressManagement] Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });

      // Show more specific error message
      let errorMessage = 'Failed to save address';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : String(firstError);
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (addressId: string | number) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await api.delete(`/users/addresses/${addressId}`);
      if (response.success) {
        toast.success('Address deleted successfully');
        await fetchAddresses();
      }
    } catch (error: any) {
      console.error('[AddressManagement] Delete error:', error);
      toast.error('Failed to delete address');
    }
  };

  // Handle set default
  const handleSetDefault = async (addressId: string | number) => {
    try {
      const response = await api.patch(`/users/addresses/${addressId}/set-default`);
      if (response.success) {
        toast.success('Default address updated');
        await fetchAddresses();
      }
    } catch (error: any) {
      console.error('[AddressManagement] Set default error:', error);
      toast.error('Failed to set default address');
    }
  };

  // Handle edit
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
      is_default: address.is_default
    });
    setShowForm(true);
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-5 w-5" />;
      case 'work': return <Building className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

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

      {/* Address Form Modal */}
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

              <form onSubmit={handleSubmit} className="space-y-6">
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
                        onClick={() => setFormData({ ...formData, type })}
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
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                    required
                  />
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
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                    placeholder="10-digit mobile number"
                    required
                  />
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
                    onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                    placeholder="House no., Building, Street"
                    required
                  />
                </div>

                {/* Address Line 2 */}
                <div>
                  <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.address_line2}
                    onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                    placeholder="Area, Colony"
                  />
                </div>

                {/* City & District */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                      District *
                    </label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Postal Code & Landmark */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                      <Hash className="inline h-4 w-4 mr-1" />
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      value={formData.postal_code}
                      onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                      placeholder="5-digit code"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-fredoka font-medium text-charcoal mb-2">
                      <Navigation className="inline h-4 w-4 mr-1" />
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                      placeholder="Near landmark"
                    />
                  </div>
                </div>

                {/* Set as Default */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    className="mr-3 w-4 h-4 text-primary-blue"
                  />
                  <label htmlFor="is_default" className="font-fredoka text-charcoal">
                    Set as default address
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
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
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        {editingAddress ? 'Update Address' : 'Add Address'}
                      </>
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
          <h3 className="text-xl font-fredoka font-bold text-charcoal mb-2">
            No Addresses Added
          </h3>
          <p className="text-medium-gray font-fredoka mb-6">
            Add your first delivery address to get started
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-primary-blue text-white px-6 py-3 rounded-2xl font-fredoka font-medium hover:bg-primary-blue/90 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Address
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address, index) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border-2 border-light-gray hover:border-primary-blue transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary-blue/10 rounded-xl text-primary-blue">
                    {getAddressIcon(address.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-fredoka font-bold text-charcoal">
                        {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                      </h3>
                      {address.is_default && (
                        <span className="px-2 py-1 bg-mint-green/20 text-mint-green text-xs rounded-full font-fredoka font-medium flex items-center gap-1">
                          <Star className="h-3 w-3 fill-mint-green" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-medium-gray font-fredoka">{address.full_name}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 hover:bg-primary-blue/10 rounded-lg transition-colors text-primary-blue"
                    title="Edit"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 hover:bg-crimson/10 rounded-lg transition-colors text-crimson"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-medium-gray">
                <p className="font-fredoka">{address.address_line1}</p>
                {address.address_line2 && <p className="font-fredoka">{address.address_line2}</p>}
                <p className="font-fredoka">
                  {address.city}, {address.district} - {address.postal_code}
                </p>
                {address.landmark && (
                  <p className="font-fredoka text-xs flex items-center gap-1">
                    <Navigation className="h-3 w-3" />
                    Near {address.landmark}
                  </p>
                )}
                <p className="font-fredoka flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {address.phone}
                </p>
              </div>

              {!address.is_default && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="mt-4 w-full py-2 border border-primary-blue text-primary-blue rounded-xl font-fredoka font-medium hover:bg-primary-blue hover:text-white transition-colors text-sm"
                >
                  Set as Default
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressManagement;
