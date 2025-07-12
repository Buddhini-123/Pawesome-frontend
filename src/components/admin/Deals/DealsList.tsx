import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Calendar,
  Tag,
  MoreVertical
} from 'lucide-react';
import { Deal } from '../../../types/deals';
import { adminDealsService, DealFilters, DealStats } from '../../../services/adminDeals.service';
import { formatters } from '../../../utils/formatters';
import { Badge } from '../ui/Badge';
import DataTable from '../ui/DataTable';
import DealDetail from './DealDetail';
import DealForm from './DealForm';

const DealsList: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [stats, setStats] = useState<DealStats | null>(null);
  const [filters, setFilters] = useState<DealFilters>({
    search: '',
    status: 'all',
    offerType: 'all',
    targetAudience: 'all'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    loadDeals();
    loadStats();
  }, [filters, pagination.page, pagination.pageSize]);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const response = await adminDealsService.getAllDeals(
        pagination.page,
        pagination.pageSize,
        filters
      );
      setDeals(response.items);
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages
      }));
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const dealStats = await adminDealsService.getDealStats();
      setStats(dealStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleFilterChange = (key: keyof DealFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDealView = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsDetailOpen(true);
  };

  const handleDealUpdate = () => {
    loadDeals();
    loadStats();
  };

  const handleCreateDeal = () => {
    setEditingDeal(null);
    setIsFormOpen(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setIsFormOpen(true);
  };

  const handleDeleteDeal = async (deal: Deal) => {
    if (window.confirm('Are you sure you want to delete this deal? This action cannot be undone.')) {
      try {
        await adminDealsService.deleteDeal(deal.id);
        handleDealUpdate();
      } catch (error) {
        console.error('Error deleting deal:', error);
      }
    }
  };

  const handleExportDeals = async () => {
    try {
      const csv = await adminDealsService.exportDeals(filters);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `deals-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting deals:', error);
    }
  };

  const getDealStatus = (deal: Deal): 'active' | 'inactive' | 'expired' | 'scheduled' => {
    const now = new Date();
    
    if (deal.validFrom > now) {
      return 'scheduled';
    } else if (deal.validUntil && deal.validUntil < now) {
      return 'expired';
    } else if (deal.isActive) {
      return 'active';
    } else {
      return 'inactive';
    }
  };

  const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'scheduled':
        return 'info';
      case 'expired':
        return 'danger';
      case 'inactive':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getOfferTypeColor = (offerType: string): string => {
    const colors: Record<string, string> = {
      'discount': 'bg-blue-100 text-blue-800',
      'buy-get-free': 'bg-green-100 text-green-800',
      'free-shipping': 'bg-purple-100 text-purple-800',
      'bundle': 'bg-orange-100 text-orange-800',
      'flash-sale': 'bg-red-100 text-red-800',
      'bulk-discount': 'bg-yellow-100 text-yellow-800'
    };
    return colors[offerType] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    {
      key: 'title',
      label: 'Deal Title',
      render: (deal: Deal) => (
        <div className="flex items-center gap-3">
          <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={deal.image} 
              alt={deal.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/api/placeholder/64/48';
              }}
            />
          </div>
          <div>
            <p className="font-fredoka font-medium text-charcoal">{deal.title}</p>
            <p className="text-sm text-gray-500 font-fredoka">{deal.subtitle}</p>
            <p className="text-xs text-gray-400 font-fredoka">Product: {deal.product_id}</p>
          </div>
        </div>
      )
    },
    {
      key: 'offerType',
      label: 'Type',
      render: (deal: Deal) => (
        <span className={`px-2 py-1 rounded-full text-xs font-fredoka font-medium ${getOfferTypeColor(deal.offerType)}`}>
          {deal.offerType.replace('-', ' ')}
        </span>
      )
    },
    {
      key: 'discount',
      label: 'Discount',
      render: (deal: Deal) => (
        <div className="text-center">
          {deal.discount ? (
            <p className="font-fredoka font-semibold text-green-600">
              {deal.discountType === 'percentage' ? `${deal.discount}%` : formatters.currency(deal.discount)}
            </p>
          ) : (
            <span className="text-gray-400 font-fredoka">N/A</span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (deal: Deal) => {
        const status = getDealStatus(deal);
        return (
          <Badge variant={getStatusVariant(status)}>
            {status}
          </Badge>
        );
      }
    },
    {
      key: 'performance',
      label: 'Performance',
      render: (deal: Deal) => {
        const conversionRate = deal.clicks > 0 ? (deal.conversions / deal.clicks) * 100 : 0;
        return (
          <div className="text-center">
            <p className="font-fredoka font-medium text-charcoal">
              {conversionRate.toFixed(1)}%
            </p>
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
              <Eye className="w-3 h-3" />
              <span>{deal.views}</span>
              <ShoppingCart className="w-3 h-3 ml-1" />
              <span>{deal.conversions}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'usage',
      label: 'Usage',
      render: (deal: Deal) => (
        <div className="text-center">
          <p className="font-fredoka font-medium text-charcoal">
            {deal.currentUses}{deal.maxUses ? `/${deal.maxUses}` : ''}
          </p>
          <p className="text-xs text-gray-500 font-fredoka">
            {formatters.currency(deal.revenue)}
          </p>
        </div>
      )
    },
    {
      key: 'validity',
      label: 'Validity',
      render: (deal: Deal) => (
        <div className="text-sm font-fredoka">
          <p className="text-gray-700">{formatters.date(deal.validFrom)}</p>
          {deal.validUntil && (
            <p className="text-gray-500">to {formatters.date(deal.validUntil)}</p>
          )}
        </div>
      )
    }
  ];

  const actions = (deal: Deal) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleDealView(deal)}
        className="p-2 text-primary-blue hover:bg-primary-blue/10 rounded-lg transition-colors"
        title="View Details"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleEditDeal(deal)}
        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
        title="Edit Deal"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteDeal(deal)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete Deal"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-fredoka font-bold text-charcoal">Deals Management</h1>
          <p className="text-gray-600 font-fredoka">Manage promotional deals and offers</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportDeals}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-fredoka hover:bg-gray-200 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={loadDeals}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-fredoka hover:bg-gray-200 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleCreateDeal}
            className="px-4 py-2 bg-primary-blue text-white rounded-lg font-fredoka hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Deal
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-fredoka text-gray-600">Total Deals</p>
                <p className="text-2xl font-fredoka font-bold text-charcoal">{stats.totalDeals}</p>
              </div>
              <div className="w-12 h-12 bg-primary-blue/10 rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-primary-blue" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-green-600 font-fredoka text-sm">{stats.activeDeals} active</span>
              <span className="text-gray-400">•</span>
              <span className="text-red-600 font-fredoka text-sm">{stats.expiredDeals} expired</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-fredoka text-gray-600">Total Revenue</p>
                <p className="text-2xl font-fredoka font-bold text-charcoal">
                  {formatters.currency(stats.totalRevenue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-fredoka text-sm">
                {stats.totalConversions} conversions
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-fredoka text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-fredoka font-bold text-charcoal">
                  {stats.averageConversionRate}%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 font-fredoka text-sm">
                {stats.totalClicks} clicks
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-fredoka text-gray-600">Top Deal</p>
                <p className="text-lg font-fredoka font-bold text-charcoal">
                  {stats.topPerformingDeal?.title.substring(0, 20) || 'None'}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            {stats.topPerformingDeal && (
              <div className="mt-2">
                <span className="text-green-600 font-fredoka text-sm">
                  {((stats.topPerformingDeal.conversions / Math.max(stats.topPerformingDeal.clicks, 1)) * 100).toFixed(1)}% rate
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-fredoka text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search deals..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-fredoka text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-fredoka text-gray-700 mb-2">Offer Type</label>
            <select
              value={filters.offerType}
              onChange={(e) => handleFilterChange('offerType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
            >
              <option value="all">All Types</option>
              <option value="discount">Discount</option>
              <option value="buy-get-free">Buy Get Free</option>
              <option value="free-shipping">Free Shipping</option>
              <option value="bundle">Bundle</option>
              <option value="flash-sale">Flash Sale</option>
              <option value="bulk-discount">Bulk Discount</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-fredoka text-gray-700 mb-2">Target Audience</label>
            <select
              value={filters.targetAudience}
              onChange={(e) => handleFilterChange('targetAudience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-fredoka focus:outline-none focus:ring-2 focus:ring-primary-blue"
            >
              <option value="all">All Audiences</option>
              <option value="new-customers">New Customers</option>
              <option value="existing-customers">Existing Customers</option>
              <option value="vip">VIP Customers</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({
                  search: '',
                  status: 'all',
                  offerType: 'all',
                  targetAudience: 'all'
                });
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-fredoka hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-fredoka text-lg mb-2">No deals found</p>
            <p className="text-gray-400 font-fredoka">Try adjusting your filters or create a new deal</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={deals}
            actions={actions}
            searchable={false}
            pageSize={pagination.pageSize}
          />
        )}
      </div>

      {/* Deal Detail Modal */}
      {selectedDeal && (
        <DealDetail
          deal={selectedDeal}
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedDeal(null);
          }}
          onDealUpdate={handleDealUpdate}
        />
      )}

      {/* Deal Form Modal */}
      <DealForm
        deal={editingDeal}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDeal(null);
        }}
        onDealSaved={handleDealUpdate}
      />
    </div>
  );
};

export default DealsList;