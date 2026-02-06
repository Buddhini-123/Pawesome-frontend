import React, { useState, useEffect } from 'react';
import { 
  X, 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  ShoppingBag,
  Edit2,
  Save,
  Shield,
  Activity,
  CreditCard,
  Package,
  Clock,
  CheckCircle,
  FileText,
  Trash2
} from 'lucide-react';
import { User, Address } from '../../../types';
import { formatters } from '../../../utils/formatters';
import { adminUserService, UserActivity } from '../../../services/adminUser.service';
import { Badge } from '../ui/Badge';

interface UserDetailProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({ user, isOpen, onClose, onUserUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [orderSummary, setOrderSummary] = useState<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: Date;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadUserActivity();
      loadOrderSummary();
    }
  }, [isOpen, user.id]);

  const loadUserActivity = async () => {
    try {
      const userActivities = await adminUserService.getUserActivity(user.id);
      setActivities(userActivities);
    } catch (error) {
      console.error('Error loading user activity:', error);
    }
  };

  const loadOrderSummary = async () => {
    try {
      const summary = await adminUserService.getUserOrderSummary(user.id);
      setOrderSummary(summary);
    } catch (error) {
      console.error('Error loading order summary:', error);
    }
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      await adminUserService.updateUser(user.id, editedUser);
      setIsEditing(false);
      onUserUpdate();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddressUpdate = (index: number, updatedAddress: Address) => {
    const newAddresses = [...(editedUser.addresses || [])];
    newAddresses[index] = updatedAddress;
    setEditedUser({ ...editedUser, addresses: newAddresses });
  };

  const handleRemoveAddress = (index: number) => {
    const newAddresses = [...(editedUser.addresses || [])];
    newAddresses.splice(index, 1);
    setEditedUser({ ...editedUser, addresses: newAddresses });
  };

  const getActivityIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return <Activity className="w-4 h-4 text-green-500" />;
      case 'order placed':
        return <ShoppingBag className="w-4 h-4 text-blue-500" />;
      case 'profile updated':
        return <UserIcon className="w-4 h-4 text-orange-500" />;
      case 'account created':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary-blue flex items-center justify-center text-white font-fredoka font-bold text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-fredoka font-bold text-charcoal">{user.name}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant={user.role === 'admin' ? 'danger' : 'success'} 
                             icon={user.role === 'admin' ? <Shield className="w-3 h-3" /> : undefined}>
                        {user.role}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Joined {formatters.date(user.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-primary-blue hover:text-blue-700 flex items-center gap-1 text-sm font-fredoka"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit User
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={isUpdating}
                        className="px-4 py-2 bg-primary-blue text-white rounded-lg font-fredoka hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {isUpdating ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedUser(user);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg font-fredoka hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* User Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-fredoka font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-fredoka text-gray-700 mb-1">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedUser.name}
                          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-gray-400" />
                          <span className="font-fredoka">{user.name}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-fredoka text-gray-700 mb-1">Email Address</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedUser.email}
                          onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="font-fredoka">{user.email}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-fredoka text-gray-700 mb-1">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedUser.phone || ''}
                          onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                          placeholder="Enter phone number"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="font-fredoka">{user.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div>
                        <label className="block text-sm font-fredoka text-gray-700 mb-1">Role</label>
                        <select
                          value={editedUser.role}
                          onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value as 'user' | 'admin' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Statistics */}
                {orderSummary && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-fredoka font-semibold mb-4">Order Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-fredoka">Total Orders</span>
                        <span className="font-fredoka font-semibold">{orderSummary.totalOrders}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-fredoka">Total Spent</span>
                        <span className="font-fredoka font-semibold">{formatters.currency(orderSummary.totalSpent)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-fredoka">Average Order</span>
                        <span className="font-fredoka font-semibold">{formatters.currency(orderSummary.averageOrderValue)}</span>
                      </div>
                      {orderSummary.lastOrderDate && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-fredoka">Last Order</span>
                          <span className="font-fredoka font-semibold">{formatters.date(orderSummary.lastOrderDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Addresses */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-fredoka font-semibold mb-4">Addresses ({user.addresses?.length || 0})</h3>
                {user.addresses && user.addresses.length > 0 ? (
                  <div className="space-y-4">
                    {(isEditing ? editedUser.addresses : user.addresses)?.map((address, index) => (
                      <div key={address.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="info">{address.type}</Badge>
                              {address.isDefault && <Badge variant="success">Default</Badge>}
                            </div>
                            {isEditing ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={address.fullName}
                                  onChange={(e) => handleAddressUpdate(index, { ...address, fullName: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka text-sm"
                                  placeholder="Full Name"
                                />
                                <input
                                  type="text"
                                  value={address.address}
                                  onChange={(e) => handleAddressUpdate(index, { ...address, address: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka text-sm"
                                  placeholder="Address"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={address.city}
                                    onChange={(e) => handleAddressUpdate(index, { ...address, city: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg font-fredoka text-sm"
                                    placeholder="City"
                                  />
                                  <input
                                    type="text"
                                    value={address.pincode}
                                    onChange={(e) => handleAddressUpdate(index, { ...address, pincode: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg font-fredoka text-sm"
                                    placeholder="Pincode"
                                  />
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="font-fredoka font-medium">{address.fullName}</p>
                                <p className="text-sm text-gray-600 font-fredoka">{address.address}</p>
                                <p className="text-sm text-gray-600 font-fredoka">
                                  {address.city}, {address.state} - {address.pincode}
                                </p>
                                <p className="text-sm text-gray-600 font-fredoka">{address.country}</p>
                              </>
                            )}
                          </div>
                          {isEditing && (
                            <button
                              onClick={() => handleRemoveAddress(index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="font-fredoka text-gray-500">No addresses added</p>
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-fredoka font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          {getActivityIcon(activity.action)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-fredoka font-medium">{activity.action}</p>
                        {activity.details && (
                          <p className="text-sm text-gray-600 font-fredoka">{activity.details}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {formatters.date(activity.timestamp)} at {formatters.time(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => adminUserService.resetUserPassword(user.id)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-fredoka hover:bg-gray-50 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Reset Password
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-fredoka hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;