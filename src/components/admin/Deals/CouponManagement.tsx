import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Percent,
  Users,
  Search,
  Filter
} from 'lucide-react';
import { adminDealsService, CouponCode } from '../../../services/adminDeals.service';
import { formatters } from '../../../utils/formatters';
import { Badge } from '../ui/Badge';

const CouponManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const couponData = await adminDealsService.getCoupons();
      setCoupons(couponData);
    } catch (error) {
      console.error('Error loading coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCouponStatus = async (coupon: CouponCode) => {
    try {
      await adminDealsService.updateCoupon(coupon.id, {
        isActive: !coupon.isActive
      });
      loadCoupons();
    } catch (error) {
      console.error('Error updating coupon status:', error);
    }
  };

  const handleDeleteCoupon = async (coupon: CouponCode) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await adminDealsService.deleteCoupon(coupon.id);
        loadCoupons();
      } catch (error) {
        console.error('Error deleting coupon:', error);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getCouponStatus = (coupon: CouponCode): { text: string; variant: 'success' | 'danger' | 'warning' } => {
    const now = new Date();
    
    if (!coupon.isActive) {
      return { text: 'Inactive', variant: 'warning' };
    } else if (coupon.validUntil && coupon.validUntil < now) {
      return { text: 'Expired', variant: 'danger' };
    } else if (coupon.validFrom > now) {
      return { text: 'Scheduled', variant: 'warning' };
    } else if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return { text: 'Used Up', variant: 'danger' };
    } else {
      return { text: 'Active', variant: 'success' };
    }
  };

  const getUsagePercentage = (coupon: CouponCode): number => {
    if (!coupon.maxUses) return 0;
    return Math.min((coupon.currentUses / coupon.maxUses) * 100, 100);
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.dealId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && coupon.isActive) ||
                         (statusFilter === 'inactive' && !coupon.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-fredoka font-bold text-charcoal">Coupon Management</h2>
          <p className="text-gray-600 font-fredoka">Manage coupon codes for deals</p>
        </div>
        <button
          onClick={() => {/* TODO: Add create coupon functionality */}}
          className="px-4 py-2 bg-primary-blue text-white rounded-lg font-fredoka hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-fredoka text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-fredoka text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-fredoka hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : filteredCoupons.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-fredoka">No coupons found</p>
          </div>
        ) : (
          filteredCoupons.map((coupon) => {
            const status = getCouponStatus(coupon);
            const usagePercentage = getUsagePercentage(coupon);

            return (
              <div key={coupon.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-blue/10 rounded-lg flex items-center justify-center">
                      {coupon.discountType === 'percentage' ? (
                        <Percent className="w-5 h-5 text-primary-blue" />
                      ) : (
                        <DollarSign className="w-5 h-5 text-primary-blue" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-fredoka font-bold text-lg text-charcoal">
                        {coupon.code}
                      </h3>
                      <Badge variant={status.variant}>{status.text}</Badge>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(coupon.code)}
                    className="p-2 text-gray-400 hover:text-primary-blue hover:bg-primary-blue/10 rounded-lg transition-colors"
                    title="Copy code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* Discount Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-fredoka font-bold text-green-600">
                      {coupon.discountType === 'percentage' 
                        ? `${coupon.discount}%` 
                        : formatters.currency(coupon.discount)
                      }
                    </p>
                    <p className="text-sm text-gray-600 font-fredoka">Discount</p>
                  </div>
                  {coupon.minOrderAmount && (
                    <div className="mt-2 text-center">
                      <p className="text-sm text-gray-600 font-fredoka">
                        Min order: {formatters.currency(coupon.minOrderAmount)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Usage Stats */}
                {coupon.maxUses && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-fredoka text-gray-700">Usage</span>
                      <span className="text-sm font-fredoka text-gray-700">
                        {coupon.currentUses} / {coupon.maxUses}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-blue h-2 rounded-full transition-all duration-300"
                        style={{ width: `${usagePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Validity */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-fredoka text-gray-600">
                      From: {formatters.date(coupon.validFrom)}
                    </span>
                  </div>
                  {coupon.validUntil && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-fredoka text-gray-600">
                        Until: {formatters.date(coupon.validUntil)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Deal Association */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 font-fredoka">
                    Deal ID: {coupon.dealId.slice(0, 8).toUpperCase()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleCouponStatus(coupon)}
                      className={`p-2 rounded-lg transition-colors ${
                        coupon.isActive 
                          ? 'text-yellow-600 hover:bg-yellow-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={coupon.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {coupon.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => {/* TODO: Handle edit */}}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500 font-fredoka">
                    {coupon.currentUses} uses
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      {!loading && coupons.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-fredoka font-semibold mb-4">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-fredoka font-bold text-charcoal">{coupons.length}</p>
              <p className="text-sm text-gray-600 font-fredoka">Total Coupons</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-fredoka font-bold text-green-600">
                {coupons.filter(c => c.isActive).length}
              </p>
              <p className="text-sm text-gray-600 font-fredoka">Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-fredoka font-bold text-orange-600">
                {coupons.reduce((sum, c) => sum + c.currentUses, 0)}
              </p>
              <p className="text-sm text-gray-600 font-fredoka">Total Uses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-fredoka font-bold text-red-600">
                {coupons.filter(c => {
                  const now = new Date();
                  return c.validUntil && c.validUntil < now;
                }).length}
              </p>
              <p className="text-sm text-gray-600 font-fredoka">Expired</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;