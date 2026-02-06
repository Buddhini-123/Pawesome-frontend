import React, { useState } from 'react';
import {
  X,
  Calendar,
  Tag,
  Eye,
  MousePointer,
  ShoppingCart,
  DollarSign,
  Users,
  Copy,
  Edit2,
  Save,
  Trash2,
  Play,
  Pause,
  Clock,
  Target,
  TrendingUp,
  Package,
  Percent,
  MapPin,
  CheckCircle,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { Deal } from '../../../types/deals';
import { formatters } from '../../../utils/formatters';
import { adminDealsService } from '../../../services/adminDeals.service';
import { Badge } from '../ui/Badge';

interface DealDetailProps {
  deal: Deal;
  isOpen: boolean;
  onClose: () => void;
  onDealUpdate: () => void;
}

const DealDetail: React.FC<DealDetailProps> = ({
  deal,
  isOpen,
  onClose,
  onDealUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDeal, setEditedDeal] = useState<Deal>(deal);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      await adminDealsService.updateDeal(deal.id, editedDeal);
      setIsEditing(false);
      onDealUpdate();
    } catch (error) {
      console.error('Error updating deal:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      await adminDealsService.updateDeal(deal.id, {
        isActive: !deal.isActive
      });
      onDealUpdate();
    } catch (error) {
      console.error('Error toggling deal status:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this deal? This action cannot be undone.')) {
      try {
        await adminDealsService.deleteDeal(deal.id);
        onDealUpdate();
        onClose();
      } catch (error) {
        console.error('Error deleting deal:', error);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getDealStatus = (): { text: string; color: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' } => {
    const now = new Date();
    
    if (deal.validFrom > now) {
      return { text: 'Scheduled', color: 'text-blue-600', variant: 'info' };
    } else if (deal.validUntil && deal.validUntil < now) {
      return { text: 'Expired', color: 'text-red-600', variant: 'danger' };
    } else if (deal.isActive) {
      return { text: 'Active', color: 'text-green-600', variant: 'success' };
    } else {
      return { text: 'Inactive', color: 'text-yellow-600', variant: 'warning' };
    }
  };

  const getConversionRate = () => {
    return deal.clicks > 0 ? ((deal.conversions / deal.clicks) * 100).toFixed(2) : '0.00';
  };

  const getClickThroughRate = () => {
    return deal.views > 0 ? ((deal.clicks / deal.views) * 100).toFixed(2) : '0.00';
  };

  const getRevenuePerConversion = () => {
    return deal.conversions > 0 ? deal.revenue / deal.conversions : 0;
  };

  const getUsagePercentage = () => {
    if (!deal.maxUses) return 0;
    return Math.min((deal.currentUses / deal.maxUses) * 100, 100);
  };

  if (!isOpen) return null;

  const status = getDealStatus();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <div className="max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h2 className="text-2xl font-fredoka font-bold text-charcoal">
                      {deal.title}
                    </h2>
                    <Badge variant={status.variant}>
                      {status.text}
                    </Badge>
                  </div>
                  <p className="text-gray-600 font-fredoka mb-3">{deal.subtitle}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>ID: {deal.id.slice(0, 8).toUpperCase()}</span>
                    <span>•</span>
                    <span>Created: {formatters.date(deal.createdAt)}</span>
                    <span>•</span>
                    <span>Updated: {formatters.timeAgo(deal.updatedAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={handleToggleStatus}
                        className={`px-4 py-2 rounded-lg font-fredoka flex items-center gap-2 ${
                          deal.isActive 
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {deal.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {deal.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-primary-blue text-white rounded-lg font-fredoka hover:bg-blue-600 flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg font-fredoka hover:bg-red-600 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={isUpdating}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-fredoka hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {isUpdating ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedDeal(deal);
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

            <div className="p-6 space-y-8">
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Eye className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600 font-fredoka">Views</p>
                      <p className="text-2xl font-fredoka font-bold text-charcoal">{deal.views.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-blue-600 font-fredoka">
                    {getClickThroughRate()}% click rate
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <MousePointer className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600 font-fredoka">Clicks</p>
                      <p className="text-2xl font-fredoka font-bold text-charcoal">{deal.clicks.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-green-600 font-fredoka">
                    {getConversionRate()}% convert
                  </p>
                </div>

                <div className="bg-orange-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <ShoppingCart className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600 font-fredoka">Conversions</p>
                      <p className="text-2xl font-fredoka font-bold text-charcoal">{deal.conversions.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-orange-600 font-fredoka">
                    {formatters.currency(getRevenuePerConversion())} avg value
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <DollarSign className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600 font-fredoka">Revenue</p>
                      <p className="text-2xl font-fredoka font-bold text-charcoal">
                        {formatters.currency(deal.revenue)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-purple-600 font-fredoka">
                    {deal.currentUses} uses
                  </p>
                </div>
              </div>

              {/* Deal Information */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-fredoka font-semibold mb-6 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Deal Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-fredoka text-gray-700 mb-1">Title</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedDeal.title}
                          onChange={(e) => setEditedDeal({ ...editedDeal, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        />
                      ) : (
                        <p className="font-fredoka">{deal.title}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-fredoka text-gray-700 mb-1">Description</label>
                      {isEditing ? (
                        <textarea
                          value={editedDeal.description}
                          onChange={(e) => setEditedDeal({ ...editedDeal, description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        />
                      ) : (
                        <p className="font-fredoka text-gray-600">{deal.description}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-fredoka text-gray-700 mb-1">Offer Type</label>
                        <p className="font-fredoka capitalize">{deal.offerType.replace('-', ' ')}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-fredoka text-gray-700 mb-1">Priority</label>
                        <p className="font-fredoka">{deal.priority}</p>
                      </div>
                    </div>

                    {deal.discount && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-fredoka text-gray-700 mb-1">Discount</label>
                          <p className="font-fredoka text-green-600 font-semibold">
                            {deal.discountType === 'percentage' ? `${deal.discount}%` : formatters.currency(deal.discount)}
                          </p>
                        </div>
                        {deal.maxDiscountAmount && (
                          <div>
                            <label className="block text-sm font-fredoka text-gray-700 mb-1">Max Discount</label>
                            <p className="font-fredoka">{formatters.currency(deal.maxDiscountAmount)}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-fredoka text-gray-700 mb-1">Target Audience</label>
                      <Badge variant="info">{deal.targetAudience || 'All'}</Badge>
                    </div>

                    <div>
                      <label className="block text-sm font-fredoka text-gray-700 mb-1">Categories</label>
                      <div className="flex flex-wrap gap-2">
                        {deal.category.map((cat, index) => (
                          <Badge key={index} variant="default">{cat}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-fredoka text-gray-700 mb-1">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {deal.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-fredoka">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Validity & Usage */}
                <div className="space-y-6">
                  {/* Validity Period */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-fredoka font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Validity Period
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-fredoka text-gray-700 mb-1">Valid From</label>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="font-fredoka">{formatters.date(deal.validFrom, 'long')}</span>
                        </div>
                      </div>
                      {deal.validUntil && (
                        <div>
                          <label className="block text-sm font-fredoka text-gray-700 mb-1">Valid Until</label>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="font-fredoka">{formatters.date(deal.validUntil, 'long')}</span>
                          </div>
                        </div>
                      )}
                      {deal.minOrderAmount && (
                        <div>
                          <label className="block text-sm font-fredoka text-gray-700 mb-1">Minimum Order</label>
                          <span className="font-fredoka">{formatters.currency(deal.minOrderAmount)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Usage Statistics */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-fredoka font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Usage Statistics
                    </h3>
                    <div className="space-y-4">
                      {deal.maxUses && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-fredoka text-gray-700">Usage Limit</span>
                            <span className="font-fredoka">{deal.currentUses} / {deal.maxUses}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-blue h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getUsagePercentage()}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 font-fredoka">
                            {(100 - getUsagePercentage()).toFixed(1)}% remaining
                          </p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-2xl font-fredoka font-bold text-charcoal">{getConversionRate()}%</p>
                          <p className="text-sm text-gray-600 font-fredoka">Conversion Rate</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-2xl font-fredoka font-bold text-charcoal">{getClickThroughRate()}%</p>
                          <p className="text-sm text-gray-600 font-fredoka">Click Rate</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon Code */}
              {deal.couponCode && (
                <div className="bg-gradient-to-r from-primary-blue/5 to-mint-green/5 rounded-xl p-6">
                  <h3 className="text-lg font-fredoka font-semibold mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Coupon Code
                  </h3>
                  <div className="flex items-center justify-between bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-blue/10 rounded-lg flex items-center justify-center">
                        <Percent className="w-6 h-6 text-primary-blue" />
                      </div>
                      <div>
                        <p className="font-fredoka font-bold text-xl text-charcoal">{deal.couponCode}</p>
                        <p className="text-sm text-gray-600 font-fredoka">
                          {deal.couponRequired ? 'Required for discount' : 'Optional code'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(deal.couponCode || '')}
                      className="p-2 text-primary-blue hover:bg-primary-blue/10 rounded-lg transition-colors"
                      title="Copy code"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Associated Products */}
              {deal.products && deal.products.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-fredoka font-semibold mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Associated Products ({deal.products.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {deal.products.map((productId, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-blue/10 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-primary-blue" />
                          </div>
                          <div>
                            <p className="font-fredoka font-medium">Product {productId.slice(0, 8)}</p>
                            <p className="text-sm text-gray-500 font-fredoka">ID: {productId}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-fredoka hover:bg-gray-300"
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

export default DealDetail;