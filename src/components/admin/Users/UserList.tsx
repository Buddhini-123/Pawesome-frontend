import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Users,
  UserCheck,
  UserX,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Shield,
  ShoppingBag,
  MoreVertical,
  Mail,
  Phone,
  CreditCard,
  Award
} from 'lucide-react';
import { AdminCustomer, User } from '../../../types';
import { adminUserService, UserFilters, UserStats } from '../../../services/adminUser.service';
import { formatters } from '../../../utils/formatters';
import { Badge } from '../ui/Badge';
import DataTable from '../ui/DataTable';
import UserDetail from './UserDetail';
import axios from 'axios';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  // Filters
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'points' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadUsers();
    loadStats();
  }, [currentPage, filters, sortBy, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch customers with loyalty data from backend API
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/admin/customers?include=loyalty', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      let customersData: AdminCustomer[] = response.data;

      // Apply sorting if needed
      if (sortBy === 'points') {
        customersData = [...customersData].sort((a, b) => {
          const aPoints = a.loyalty_balance?.balance || 0;
          const bPoints = b.loyalty_balance?.balance || 0;
          return sortOrder === 'asc' ? aPoints - bPoints : bPoints - aPoints;
        });
      }

      setUsers(customersData);
      setTotalPages(Math.ceil(customersData.length / pageSize));
    } catch (error) {
      console.error('Error loading customers:', error);
      setError('Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const userStats = await adminUserService.getUserStats();
      setStats(userStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleExport = async () => {
    try {
      const csv = await adminUserService.exportUsers(filters);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Error exporting users:', error);
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await adminUserService.toggleUserStatus(userId, isActive);
      loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const getRoleVariant = (role: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'user':
        return 'success';
      default:
        return 'default';
    }
  };

  const getTierBadgeColor = (tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'): string => {
    switch (tier) {
      case 'BRONZE':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'SILVER':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'GOLD':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'PLATINUM':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const handleSortByPoints = () => {
    if (sortBy === 'points') {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy('points');
      setSortOrder('desc');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (user: AdminCustomer) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-blue flex items-center justify-center text-white font-fredoka font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-fredoka font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Contact',
      render: (user: AdminCustomer) => (
        <div>
          <div className="flex items-center gap-1 text-sm">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="font-fredoka">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-1 text-sm mt-1">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="font-fredoka">{user.phone}</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (user: AdminCustomer) => (
        <Badge variant={getRoleVariant(user.role)} icon={user.role === 'admin' ? <Shield className="w-3 h-3" /> : undefined}>
          {user.role}
        </Badge>
      )
    },
    {
      key: 'loyalty_card',
      label: 'Loyalty Card',
      render: (user: AdminCustomer) => (
        <div className="font-fredoka text-sm">
          {user.loyalty_balance?.card_number ? (
            <span className="text-primary-blue font-medium">{user.loyalty_balance.card_number}</span>
          ) : (
            <span className="text-gray-400">No Card</span>
          )}
        </div>
      )
    },
    {
      key: 'points',
      label: 'Points',
      render: (user: AdminCustomer) => (
        <button
          onClick={handleSortByPoints}
          className="font-fredoka text-sm hover:text-primary-blue transition-colors cursor-pointer text-left w-full"
        >
          {user.loyalty_balance ? (
            <span className="text-mint-green font-semibold">
              {user.loyalty_balance.balance.toLocaleString()}
              {sortBy === 'points' && (
                <span className="ml-1 text-xs text-gray-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </span>
          ) : (
            <span className="text-gray-400">0</span>
          )}
        </button>
      )
    },
    {
      key: 'tier',
      label: 'Tier',
      render: (user: AdminCustomer) => (
        <div>
          {user.loyalty_balance?.tier ? (
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-fredoka font-semibold border ${getTierBadgeColor(user.loyalty_balance.tier)}`}>
              <Award className="w-3 h-3" />
              {user.loyalty_balance.tier}
            </div>
          ) : (
            <span className="text-gray-400 text-sm font-fredoka">No Tier</span>
          )}
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (user: AdminCustomer) => (
        <div>
          <p className="font-fredoka text-sm">{formatters.date(new Date(user.created_at))}</p>
          <p className="text-xs text-gray-500">{formatters.timeAgo(new Date(user.created_at))}</p>
        </div>
      )
    }
  ];

  // Convert AdminCustomer to User for detail modal
  const convertToUser = (customer: AdminCustomer): User => {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      role: customer.role,
      createdAt: new Date(customer.created_at),
      addresses: []
    };
  };

  const renderActions = (user: AdminCustomer) => (
    <div className="flex gap-2">
      <button
        onClick={() => {
          setSelectedUser(convertToUser(user));
          setShowUserDetail(true);
        }}
        className="text-primary-blue hover:text-blue-700 p-1"
        title="View Details"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          setSelectedUser(convertToUser(user));
          setShowUserDetail(true);
        }}
        className="text-gray-600 hover:text-gray-800 p-1"
        title="Edit User"
      >
        <Edit className="w-4 h-4" />
      </button>
      <div className="relative group">
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <MoreVertical className="w-4 h-4" />
        </button>
        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
          <button
            onClick={() => handleToggleUserStatus(user.id, true)}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <UserCheck className="w-3 h-3" />
            Activate
          </button>
          <button
            onClick={() => handleToggleUserStatus(user.id, false)}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <UserX className="w-3 h-3" />
            Deactivate
          </button>
          <button
            onClick={() => adminUserService.resetUserPassword(user.id)}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <Mail className="w-3 h-3" />
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-fredoka">Total Users</p>
                <p className="text-2xl font-fredoka font-bold text-charcoal">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-primary-blue/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-blue" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-fredoka">Users with Orders</p>
                <p className="text-2xl font-fredoka font-bold text-charcoal">{stats.usersWithOrders}</p>
              </div>
              <div className="w-12 h-12 bg-mint-green/10 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-mint-green" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-fredoka">Total Revenue</p>
                <p className="text-2xl font-fredoka font-bold text-charcoal">
                  {formatters.currency(stats.totalOrdersValue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-sunny-yellow/10 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-vibrant-orange" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-fredoka">New This Month</p>
                <p className="text-2xl font-fredoka font-bold text-charcoal">{stats.newUsersThisMonth}</p>
              </div>
              <div className="w-12 h-12 bg-lavender/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-lavender" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-fredoka font-bold text-charcoal">User Management</h2>
            
            <div className="flex flex-wrap gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
              </div>

              {/* Role Filter */}
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value as any })}
                className="px-4 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </select>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg font-fredoka hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-primary-blue text-white rounded-lg font-fredoka hover:bg-blue-600 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-fredoka text-gray-700 mb-1">Date Range</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value ? new Date(e.target.value) : undefined })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-fredoka"
                    />
                    <input
                      type="date"
                      onChange={(e) => setFilters({ ...filters, dateTo: e.target.value ? new Date(e.target.value) : undefined })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-fredoka"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-fredoka text-gray-700 mb-1">Has Orders</label>
                  <select
                    value={filters.hasOrders === undefined ? 'all' : filters.hasOrders ? 'yes' : 'no'}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilters({ 
                        ...filters, 
                        hasOrders: value === 'all' ? undefined : value === 'yes'
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka"
                  >
                    <option value="all">All Users</option>
                    <option value="yes">Has Orders</option>
                    <option value="no">No Orders</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-fredoka text-gray-700 mb-1">User Status</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka">
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <p className="text-red-600 font-fredoka text-sm">{error}</p>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
            <p className="mt-4 font-fredoka text-gray-500">Loading customers...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="font-fredoka text-gray-700 mb-2">Failed to load customers</p>
            <button
              onClick={loadUsers}
              className="px-4 py-2 bg-primary-blue text-white rounded-lg font-fredoka hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="font-fredoka text-gray-500">No customers found</p>
          </div>
        ) : (
          <>
            <DataTable
              data={users}
              columns={columns}
              actions={renderActions}
            />

            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-600 font-fredoka">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, users.length)} of {users.length} users
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg font-fredoka disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-lg font-fredoka ${
                      currentPage === i + 1
                        ? 'bg-primary-blue text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg font-fredoka disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetail
          user={selectedUser}
          isOpen={showUserDetail}
          onClose={() => {
            setShowUserDetail(false);
            setSelectedUser(null);
          }}
          onUserUpdate={() => {
            loadUsers();
            loadStats();
          }}
        />
      )}
    </div>
  );
};

export default UserList;