import React, { useState, useEffect } from 'react';
import {
  X,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  Shield,
  Award,
  Star,
  Home,
  Briefcase,
  Navigation
} from 'lucide-react';
import { User, Address } from '../../../types';
import { formatters } from '../../../utils/formatters';
import { adminUserService, AdminUserDetail, AdminUserStats, BackendAddress } from '../../../services/adminUser.service';
import { api } from '../../../services/api';
import { Badge } from '../ui/Badge';

interface UserDetailProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate: () => void;
}

const tierColors: Record<string, string> = {
  bronze: 'bg-orange-100 text-orange-700 border-orange-200',
  silver: 'bg-gray-100 text-gray-700 border-gray-300',
  gold: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  platinum: 'bg-purple-100 text-purple-700 border-purple-300',
};

const addressTypeIcon = (type: string) => {
  switch (type) {
    case 'home': return <Home className="w-4 h-4" />;
    case 'work': return <Briefcase className="w-4 h-4" />;
    default: return <Navigation className="w-4 h-4" />;
  }
};

// Map backend address fields → frontend Address interface
const mapAddress = (a: BackendAddress): Address => ({
  id: String(a.id),
  type: a.type,
  fullName: a.full_name,
  phone: a.phone,
  address: [a.address_line1, a.address_line2].filter(Boolean).join(', '),
  city: a.city,
  state: a.district,
  pincode: a.postal_code,
  country: a.country,
  isDefault: a.is_default,
});

const UserDetail: React.FC<UserDetailProps> = ({ user, isOpen, onClose, onUserUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [fullUser, setFullUser] = useState<AdminUserDetail | null>(null);
  const [userStats, setUserStats] = useState<AdminUserStats | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedRole, setEditedRole] = useState<'user' | 'admin'>('user');

  useEffect(() => {
    if (isOpen && user.id) {
      setIsLoading(true);
      setLoadError(null);
      setFullUser(null);
      setUserStats(null);
      loadFullUser();
    }
    if (!isOpen) {
      setIsEditing(false);
      setFullUser(null);
      setUserStats(null);
      setLoadError(null);
    }
  }, [isOpen, user.id]);

  const loadFullUser = async () => {
    setLoadError(null);
    try {
      const result = await adminUserService.getUserById(user.id);
      if (result) {
        setFullUser(result.user);
        setUserStats(result.stats ?? null);
        setEditedName(result.user.name || `${result.user.first_name ?? ''} ${result.user.last_name ?? ''}`.trim());
        setEditedEmail(result.user.email);
        setEditedPhone(result.user.phone ?? '');
        setEditedRole(result.user.role);
      } else {
        setLoadError('Failed to load user details. Please check that you are logged in as an admin.');
      }
    } catch (error: any) {
      console.error('Error loading user details:', error);
      setLoadError(error?.message || 'Failed to load user details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!fullUser) return;
    try {
      setIsUpdating(true);
      const parts = editedName.trim().split(' ');
      await api.patch(`/admin/users/${fullUser.id}`, {
        first_name: parts[0] ?? '',
        last_name: parts.slice(1).join(' ') ?? '',
        email: editedEmail,
        phone: editedPhone || null,
        role: editedRole,
      });
      setIsEditing(false);
      await loadFullUser();
      onUserUpdate();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  const displayUser = fullUser;
  const displayName = displayUser
    ? (displayUser.name || `${displayUser.first_name ?? ''} ${displayUser.last_name ?? ''}`.trim())
    : user.name;
  const addresses: Address[] = (displayUser?.addresses ?? []).map(mapAddress);
  const tier = displayUser?.loyalty_tier?.toLowerCase() ?? 'bronze';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  {displayUser?.avatar_url ? (
                    <img src={displayUser.avatar_url} alt={displayName} className="w-16 h-16 rounded-full object-cover ring-2 ring-primary-blue/20" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary-blue flex items-center justify-center text-white font-fredoka font-bold text-xl">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-fredoka font-bold text-charcoal">{displayName}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge
                        variant={user.role === 'admin' ? 'danger' : 'success'}
                        icon={user.role === 'admin' ? <Shield className="w-3 h-3" /> : undefined}
                      >
                        {displayUser?.role ?? user.role}
                      </Badge>
                      {displayUser && (
                        <span className="text-sm text-gray-500">
                          Joined {formatters.date(new Date(displayUser.created_at))}
                        </span>
                      )}
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
                          if (displayUser) {
                            setEditedName(displayUser.name || `${displayUser.first_name ?? ''} ${displayUser.last_name ?? ''}`.trim());
                            setEditedEmail(displayUser.email);
                            setEditedPhone(displayUser.phone ?? '');
                            setEditedRole(displayUser.role);
                          }
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg font-fredoka hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Body */}
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mb-4"></div>
                <p className="font-fredoka text-gray-500">Loading user details...</p>
              </div>
            ) : loadError ? (
              <div className="p-12 text-center">
                <p className="font-fredoka text-red-500 mb-4">{loadError}</p>
                <button
                  onClick={() => { setLoadError(null); setIsLoading(true); loadFullUser(); }}
                  className="px-4 py-2 bg-primary-blue text-white rounded-lg font-fredoka hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-6">

                {/* Contact + Loyalty */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-fredoka font-semibold mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-fredoka text-gray-500 mb-1">Full Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-gray-400" />
                            <span className="font-fredoka">{displayName}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-fredoka text-gray-500 mb-1">Email Address</label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="font-fredoka">{displayUser?.email ?? user.email}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-fredoka text-gray-500 mb-1">Phone Number</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editedPhone}
                            onChange={(e) => setEditedPhone(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                            placeholder="Enter phone number"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="font-fredoka">{displayUser?.phone || user.phone || 'Not provided'}</span>
                          </div>
                        )}
                      </div>

                      {isEditing && (
                        <div>
                          <label className="block text-sm font-fredoka text-gray-500 mb-1">Role</label>
                          <select
                            value={editedRole}
                            onChange={(e) => setEditedRole(e.target.value as 'user' | 'admin')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Loyalty & Stats */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-fredoka font-semibold mb-4">Loyalty & Account</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-fredoka flex items-center gap-1">
                          <Award className="w-4 h-4" /> Loyalty Tier
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-fredoka font-semibold border capitalize ${tierColors[tier] ?? tierColors.bronze}`}>
                          {displayUser?.loyalty_tier ?? 'Bronze'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-fredoka flex items-center gap-1">
                          <Star className="w-4 h-4" /> Points Balance
                        </span>
                        <span className="font-fredoka font-semibold text-mint-green">
                          {(userStats?.loyalty_balance ?? displayUser?.loyalty_points ?? 0).toLocaleString()}
                        </span>
                      </div>

                      {userStats && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-fredoka">Lifetime Earned</span>
                            <span className="font-fredoka font-semibold">{userStats.lifetime_earned.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-fredoka">Lifetime Redeemed</span>
                            <span className="font-fredoka font-semibold">{userStats.lifetime_redeemed.toLocaleString()}</span>
                          </div>
                          {userStats.points_to_next_tier !== null && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 font-fredoka">To Next Tier</span>
                              <span className="font-fredoka font-semibold text-vibrant-orange">
                                {userStats.points_to_next_tier.toLocaleString()} pts
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-fredoka">Subscriptions</span>
                            <span className="font-fredoka font-semibold">
                              {userStats.active_subscriptions} active / {userStats.total_subscriptions} total
                            </span>
                          </div>
                        </>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-fredoka flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> Member Since
                        </span>
                        <span className="font-fredoka font-semibold">
                          {displayUser ? formatters.date(new Date(displayUser.created_at)) : '—'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-fredoka">Account Status</span>
                        <Badge variant={displayUser?.is_active ? 'success' : 'danger'}>
                          {displayUser?.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-fredoka font-semibold mb-4">
                    Addresses ({addresses.length})
                  </h3>
                  {addresses.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-primary-blue">{addressTypeIcon(address.type)}</span>
                            <Badge variant="info">{address.type}</Badge>
                            {address.isDefault && <Badge variant="success">Default</Badge>}
                          </div>
                          <p className="font-fredoka font-medium">{address.fullName}</p>
                          <p className="text-sm text-gray-600 font-fredoka mt-1">{address.address}</p>
                          <p className="text-sm text-gray-600 font-fredoka">
                            {address.city}, {address.state} {address.pincode}
                          </p>
                          <p className="text-sm text-gray-600 font-fredoka">{address.country}</p>
                          {address.phone && (
                            <p className="text-sm text-gray-500 font-fredoka mt-1 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {address.phone}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="font-fredoka text-gray-500">No addresses added</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2 border-t">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
