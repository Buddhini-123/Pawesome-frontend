import { Deal } from '../types/deals';
import { PaginatedResponse } from '../types';
import { formatters } from '../utils/formatters';
import { v4 as uuidv4 } from 'uuid';

export interface DealFilters {
  search?: string;
  status?: 'all' | 'active' | 'inactive' | 'expired' | 'scheduled';
  offerType?: 'all' | 'discount' | 'buy-get-free' | 'free-shipping' | 'bundle' | 'flash-sale' | 'bulk-discount';
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  targetAudience?: 'all' | 'new-customers' | 'existing-customers' | 'vip';
  minDiscount?: number;
  maxDiscount?: number;
}

export interface DealStats {
  totalDeals: number;
  activeDeals: number;
  expiredDeals: number;
  scheduledDeals: number;
  totalViews: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  averageConversionRate: number;
  topPerformingDeal: Deal | null;
}

export interface CouponCode {
  id: string;
  code: string;
  dealId: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minOrderAmount?: number;
  maxUses?: number;
  currentUses: number;
  validFrom: Date;
  validUntil?: Date;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
}

class AdminDealsService {
  private deals: Deal[] = [];
  private coupons: CouponCode[] = [];

  constructor() {
    this.loadFromLocalStorage();
    this.seedDeals();
  }

  private loadFromLocalStorage() {
    try {
      const storedDeals = localStorage.getItem('admin_deals');
      const storedCoupons = localStorage.getItem('admin_coupons');
      
      if (storedDeals) {
        this.deals = JSON.parse(storedDeals).map((deal: any) => ({
          ...deal,
          validFrom: new Date(deal.validFrom),
          validUntil: deal.validUntil ? new Date(deal.validUntil) : undefined,
          createdAt: new Date(deal.createdAt),
          updatedAt: new Date(deal.updatedAt)
        }));
      }
      
      if (storedCoupons) {
        this.coupons = JSON.parse(storedCoupons).map((coupon: any) => ({
          ...coupon,
          validFrom: new Date(coupon.validFrom),
          validUntil: coupon.validUntil ? new Date(coupon.validUntil) : undefined,
          createdAt: new Date(coupon.createdAt)
        }));
      }
    } catch (error) {
      console.error('Error loading deals from localStorage:', error);
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem('admin_deals', JSON.stringify(this.deals));
      localStorage.setItem('admin_coupons', JSON.stringify(this.coupons));
    } catch (error) {
      console.error('Error saving deals to localStorage:', error);
    }
  }

  private seedDeals() {
    if (this.deals.length === 0) {
      const sampleDeals: Deal[] = [
        {
          id: uuidv4(),
          title: 'Flash Sale - 50% Off Premium Dog Food',
          subtitle: 'Limited Time Offer',
          description: 'Get 50% off on all premium dog food brands. Stock up now and save big on your furry friend\'s favorite meals!',
          offerType: 'flash-sale',
          discount: 50,
          discountType: 'percentage',
          image: 'https://images.unsplash.com/photo-1565166078782-59bf5c623b9e?w=400&h=300&fit=crop',
          isActive: true,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          slug: 'flash-sale-dog-food-50-off',
          category: ['dogs', 'food'],
          product_id: 'prod-1',
          products: ['prod-1', 'prod-2'],
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
          createdBy: 'admin-user-1',
          priority: 1,
          maxUses: 100,
          currentUses: 23,
          minOrderAmount: 1000,
          maxDiscountAmount: 2500,
          tags: ['flash-sale', 'dog-food', 'premium'],
          targetAudience: 'all',
          views: 1250,
          clicks: 340,
          conversions: 23,
          revenue: 48500,
          couponCode: 'DOGFLASH50',
          couponRequired: true
        },
        {
          id: uuidv4(),
          title: 'Buy 2 Get 1 Free - Cat Toys',
          subtitle: 'Perfect for playful kitties',
          description: 'Buy any 2 cat toys and get the 3rd one absolutely free! Mix and match from our wide selection.',
          offerType: 'buy-get-free',
          image: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=300&fit=crop',
          isActive: true,
          validFrom: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          slug: 'cat-toys-buy-2-get-1-free',
          category: ['cats', 'toys'],
          product_id: 'prod-3',
          products: ['prod-3', 'prod-4', 'prod-5'],
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
          createdBy: 'admin-user-1',
          priority: 2,
          currentUses: 15,
          minOrderAmount: 500,
          tags: ['buy-get-free', 'cat-toys', 'bundle'],
          targetAudience: 'all',
          views: 890,
          clicks: 187,
          conversions: 15,
          revenue: 12750,
          couponRequired: false
        },
        {
          id: uuidv4(),
          title: 'Free Shipping on Orders Above ₹2000',
          subtitle: 'Save on delivery costs',
          description: 'Get free shipping on all orders above ₹2000. No coupon needed, discount applied automatically at checkout.',
          offerType: 'free-shipping',
          discount: 150,
          discountType: 'fixed',
          image: 'https://images.unsplash.com/photo-1608628969743-fbfa33d2e3a9?w=400&h=300&fit=crop',
          isActive: true,
          validFrom: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          slug: 'free-shipping-above-2000',
          category: ['all'],
          product_id: 'all-products',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
          createdBy: 'admin-user-1',
          priority: 5,
          currentUses: 156,
          minOrderAmount: 2000,
          tags: ['free-shipping', 'automatic'],
          targetAudience: 'all',
          views: 2340,
          clicks: 890,
          conversions: 156,
          revenue: 312000,
          couponRequired: false
        },
        {
          id: uuidv4(),
          title: 'New Customer Special - 20% Off',
          subtitle: 'Welcome to Pawsome!',
          description: 'First-time customers get 20% off their entire first order. Start your pet care journey with us!',
          offerType: 'discount',
          discount: 20,
          discountType: 'percentage',
          image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop',
          isActive: true,
          validFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          slug: 'new-customer-20-off',
          category: ['all'],
          product_id: 'starter-pack',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
          createdBy: 'admin-user-1',
          priority: 3,
          currentUses: 67,
          minOrderAmount: 500,
          maxDiscountAmount: 1000,
          tags: ['new-customer', 'welcome'],
          targetAudience: 'new-customers',
          views: 1567,
          clicks: 234,
          conversions: 67,
          revenue: 89500,
          couponCode: 'WELCOME20',
          couponRequired: true
        },
        {
          id: uuidv4(),
          title: 'Bird Care Bundle - 30% Off',
          subtitle: 'Complete bird care solution',
          description: 'Get everything your feathered friend needs with our special bird care bundle at 30% off the regular price.',
          offerType: 'bundle',
          discount: 30,
          discountType: 'percentage',
          originalPrice: 2500,
          salePrice: 1750,
          image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop',
          isActive: false,
          validFrom: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          validUntil: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // Expired
          slug: 'bird-care-bundle-30-off',
          category: ['birds', 'bundles'],
          product_id: 'prod-6',
          products: ['prod-6', 'prod-7', 'prod-8'],
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          createdBy: 'admin-user-1',
          priority: 4,
          maxUses: 50,
          currentUses: 32,
          tags: ['bundle', 'bird-care', 'complete-solution'],
          targetAudience: 'all',
          views: 678,
          clicks: 123,
          conversions: 32,
          revenue: 56000,
          couponRequired: false
        }
      ];

      this.deals = sampleDeals;
      this.saveToLocalStorage();
    }
  }

  async getAllDeals(
    page: number = 1,
    pageSize: number = 10,
    filters?: DealFilters
  ): Promise<PaginatedResponse<Deal>> {
    let deals = [...this.deals];

    // Apply filters
    if (filters) {
      deals = this.applyFilters(deals, filters);
    }

    // Sort by priority, then by creation date
    deals.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Paginate
    const total = deals.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedDeals = deals.slice(start, end);

    return {
      items: paginatedDeals,
      total,
      page,
      pageSize,
      totalPages
    };
  }

  async getDealById(dealId: string): Promise<Deal | null> {
    const deal = this.deals.find(d => d.id === dealId);
    return deal || null;
  }

  async createDeal(dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'currentUses' | 'views' | 'clicks' | 'conversions' | 'revenue'>): Promise<Deal> {
    const newDeal: Deal = {
      ...dealData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      currentUses: 0,
      views: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0
    };

    this.deals.push(newDeal);
    this.saveToLocalStorage();
    return newDeal;
  }

  async updateDeal(dealId: string, updates: Partial<Deal>): Promise<Deal> {
    const index = this.deals.findIndex(d => d.id === dealId);
    if (index === -1) {
      throw new Error('Deal not found');
    }

    this.deals[index] = {
      ...this.deals[index],
      ...updates,
      updatedAt: new Date()
    };

    this.saveToLocalStorage();
    return this.deals[index];
  }

  async deleteDeal(dealId: string): Promise<void> {
    const index = this.deals.findIndex(d => d.id === dealId);
    if (index === -1) {
      throw new Error('Deal not found');
    }

    this.deals.splice(index, 1);
    this.saveToLocalStorage();
  }

  async getDealStats(): Promise<DealStats> {
    const now = new Date();
    const totalDeals = this.deals.length;
    const activeDeals = this.deals.filter(d => d.isActive && (!d.validUntil || d.validUntil > now)).length;
    const expiredDeals = this.deals.filter(d => d.validUntil && d.validUntil < now).length;
    const scheduledDeals = this.deals.filter(d => d.validFrom > now).length;

    const totalViews = this.deals.reduce((sum, d) => sum + d.views, 0);
    const totalClicks = this.deals.reduce((sum, d) => sum + d.clicks, 0);
    const totalConversions = this.deals.reduce((sum, d) => sum + d.conversions, 0);
    const totalRevenue = this.deals.reduce((sum, d) => sum + d.revenue, 0);

    const averageConversionRate = totalClicks > 0 ? Math.round((totalConversions / totalClicks) * 100 * 100) / 100 : 0;

    // Find top performing deal by conversion rate
    const topPerformingDeal = this.deals.reduce((best, current) => {
      const currentRate = current.clicks > 0 ? (current.conversions / current.clicks) : 0;
      const bestRate = best && best.clicks > 0 ? (best.conversions / best.clicks) : 0;
      return currentRate > bestRate ? current : best;
    }, null as Deal | null);

    return {
      totalDeals,
      activeDeals,
      expiredDeals,
      scheduledDeals,
      totalViews,
      totalClicks,
      totalConversions,
      totalRevenue,
      averageConversionRate,
      topPerformingDeal
    };
  }

  async exportDeals(filters?: DealFilters): Promise<string> {
    let deals = this.deals;
    
    if (filters) {
      deals = this.applyFilters(deals, filters);
    }

    // Convert to CSV
    const headers = [
      'Deal ID',
      'Title',
      'Offer Type',
      'Discount',
      'Discount Type',
      'Status',
      'Valid From',
      'Valid Until',
      'Category',
      'Product ID',
      'Target Audience',
      'Current Uses',
      'Max Uses',
      'Views',
      'Clicks',
      'Conversions',
      'Revenue',
      'Conversion Rate',
      'Coupon Code',
      'Created Date'
    ];

    const rows = deals.map(deal => {
      const conversionRate = deal.clicks > 0 ? ((deal.conversions / deal.clicks) * 100).toFixed(2) + '%' : '0%';
      const status = this.getDealStatus(deal);

      return [
        deal.id,
        deal.title,
        deal.offerType,
        deal.discount || 'N/A',
        deal.discountType || 'N/A',
        status,
        formatters.date(deal.validFrom),
        deal.validUntil ? formatters.date(deal.validUntil) : 'No expiry',
        deal.category.join(', '),
        deal.product_id,
        deal.targetAudience || 'all',
        deal.currentUses,
        deal.maxUses || 'Unlimited',
        deal.views,
        deal.clicks,
        deal.conversions,
        formatters.currency(deal.revenue),
        conversionRate,
        deal.couponCode || 'N/A',
        formatters.date(deal.createdAt)
      ];
    });

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
  }

  private applyFilters(deals: Deal[], filters: DealFilters): Deal[] {
    let filtered = [...deals];

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(deal => 
        deal.title.toLowerCase().includes(search) ||
        deal.description.toLowerCase().includes(search) ||
        deal.tags.some(tag => tag.toLowerCase().includes(search)) ||
        (deal.couponCode && deal.couponCode.toLowerCase().includes(search))
      );
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      const now = new Date();
      filtered = filtered.filter(deal => {
        const status = this.getDealStatus(deal);
        return status === filters.status;
      });
    }

    // Offer type filter
    if (filters.offerType && filters.offerType !== 'all') {
      filtered = filtered.filter(deal => deal.offerType === filters.offerType);
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(deal => 
        deal.category.includes(filters.category!)
      );
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(deal => 
        new Date(deal.createdAt) >= filters.dateFrom!
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(deal => 
        new Date(deal.createdAt) <= filters.dateTo!
      );
    }

    // Target audience filter
    if (filters.targetAudience && filters.targetAudience !== 'all') {
      filtered = filtered.filter(deal => deal.targetAudience === filters.targetAudience);
    }

    // Discount range filter
    if (filters.minDiscount !== undefined) {
      filtered = filtered.filter(deal => (deal.discount || 0) >= filters.minDiscount!);
    }
    if (filters.maxDiscount !== undefined) {
      filtered = filtered.filter(deal => (deal.discount || 0) <= filters.maxDiscount!);
    }

    return filtered;
  }

  private getDealStatus(deal: Deal): 'active' | 'inactive' | 'expired' | 'scheduled' {
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
  }

  // Coupon management methods
  async createCoupon(couponData: Omit<CouponCode, 'id' | 'createdAt' | 'currentUses'>): Promise<CouponCode> {
    const newCoupon: CouponCode = {
      ...couponData,
      id: uuidv4(),
      createdAt: new Date(),
      currentUses: 0
    };

    this.coupons.push(newCoupon);
    this.saveToLocalStorage();
    return newCoupon;
  }

  async getCoupons(): Promise<CouponCode[]> {
    return this.coupons;
  }

  async updateCoupon(couponId: string, updates: Partial<CouponCode>): Promise<CouponCode> {
    const index = this.coupons.findIndex(c => c.id === couponId);
    if (index === -1) {
      throw new Error('Coupon not found');
    }

    this.coupons[index] = {
      ...this.coupons[index],
      ...updates
    };

    this.saveToLocalStorage();
    return this.coupons[index];
  }

  async deleteCoupon(couponId: string): Promise<void> {
    const index = this.coupons.findIndex(c => c.id === couponId);
    if (index === -1) {
      throw new Error('Coupon not found');
    }

    this.coupons.splice(index, 1);
    this.saveToLocalStorage();
  }
}

export const adminDealsService = new AdminDealsService();