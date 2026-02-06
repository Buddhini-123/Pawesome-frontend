import { Subscription, PaginatedResponse, User } from '../types';
import { mockDb } from './mockDb';
import { formatters } from '../utils/formatters';
import { v4 as uuidv4 } from 'uuid';

export interface SubscriptionFilters {
  search?: string;
  status?: 'all' | 'active' | 'paused' | 'cancelled';
  frequency?: 'all' | 'daily' | 'weekly' | 'monthly';
  dateFrom?: Date;
  dateTo?: Date;
  minValue?: number;
  maxValue?: number;
}

export interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  pausedSubscriptions: number;
  cancelledSubscriptions: number;
  monthlyRevenue: number;
  averageSubscriptionValue: number;
  churnRate: number;
  newSubscriptionsThisMonth: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  price: number;
  products: Array<{
    productId: string;
    productName: string;
    quantity: number;
  }>;
  isActive: boolean;
  category: 'dog' | 'cat' | 'bird' | 'mixed';
}

class AdminSubscriptionService {
  private subscriptions: Subscription[] = [];
  private subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'plan-1',
      name: 'Essential Dog Care',
      description: 'Monthly delivery of essential dog food and treats',
      frequency: 'monthly',
      price: 2500,
      products: [
        { productId: 'prod-1', productName: 'Royal Canin Adult Dog Food', quantity: 1 },
        { productId: 'prod-2', productName: 'Dog Treats Variety Pack', quantity: 2 }
      ],
      isActive: true,
      category: 'dog'
    },
    {
      id: 'plan-2',
      name: 'Cat Comfort Package',
      description: 'Weekly cat food and litter delivery',
      frequency: 'weekly',
      price: 800,
      products: [
        { productId: 'prod-3', productName: 'Whiskas Cat Food', quantity: 2 },
        { productId: 'prod-4', productName: 'Cat Litter Premium', quantity: 1 }
      ],
      isActive: true,
      category: 'cat'
    },
    {
      id: 'plan-3',
      name: 'Bird Paradise',
      description: 'Monthly bird seed and accessory delivery',
      frequency: 'monthly',
      price: 500,
      products: [
        { productId: 'prod-5', productName: 'Premium Bird Seed Mix', quantity: 3 },
        { productId: 'prod-6', productName: 'Bird Toy Assortment', quantity: 1 }
      ],
      isActive: true,
      category: 'bird'
    }
  ];

  constructor() {
    this.loadFromLocalStorage();
    this.seedSubscriptions();
  }

  private loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem('admin_subscriptions');
      if (stored) {
        this.subscriptions = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading subscriptions from localStorage:', error);
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem('admin_subscriptions', JSON.stringify(this.subscriptions));
    } catch (error) {
      console.error('Error saving subscriptions to localStorage:', error);
    }
  }

  private seedSubscriptions() {
    if (this.subscriptions.length === 0) {
      // Create sample subscriptions
      const users = mockDb.getAllUsers();
      const sampleSubscriptions: Subscription[] = [];

      for (let i = 0; i < Math.min(10, users.length); i++) {
        const user = users[i];
        const plan = this.subscriptionPlans[i % this.subscriptionPlans.length];
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 90));

        const nextDelivery = new Date(createdDate);
        switch (plan.frequency) {
          case 'daily':
            nextDelivery.setDate(nextDelivery.getDate() + 1);
            break;
          case 'weekly':
            nextDelivery.setDate(nextDelivery.getDate() + 7);
            break;
          case 'monthly':
            nextDelivery.setMonth(nextDelivery.getMonth() + 1);
            break;
        }

        const statuses: Array<'active' | 'paused' | 'cancelled'> = ['active', 'active', 'active', 'paused', 'cancelled'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        const subscription: Subscription = {
          id: uuidv4(),
          userId: user.id,
          name: plan.name,
          products: plan.products.map(p => ({
            productId: p.productId,
            productName: p.productName,
            quantity: p.quantity,
            price: Math.floor(Math.random() * 500) + 100
          })),
          frequency: plan.frequency,
          startDate: createdDate,
          nextDelivery: status === 'active' ? nextDelivery : createdDate,
          deliveryAddress: user.addresses?.[0] || {
            id: uuidv4(),
            type: 'home',
            fullName: user.name,
            phone: user.phone || '+91 9876543210',
            address: '123 Sample Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            country: 'India'
          },
          status,
          total: plan.price,
          savedAmount: Math.floor(plan.price * 0.15)
        };

        sampleSubscriptions.push(subscription);
      }

      this.subscriptions = sampleSubscriptions;
      this.saveToLocalStorage();
    }
  }

  async getAllSubscriptions(
    page: number = 1,
    pageSize: number = 10,
    filters?: SubscriptionFilters
  ): Promise<PaginatedResponse<Subscription & { customerName: string; customerEmail: string }>> {
    let subscriptions = [...this.subscriptions];
    const users = mockDb.getAllUsers();

    // Add customer info
    const enrichedSubscriptions = subscriptions.map(sub => {
      const user = users.find(u => u.id === sub.userId);
      return {
        ...sub,
        customerName: user?.name || 'Unknown',
        customerEmail: user?.email || 'unknown@email.com'
      };
    });

    // Apply filters
    let filtered = enrichedSubscriptions;
    if (filters) {
      filtered = this.applyFilters(enrichedSubscriptions, filters);
    }

    // Sort by start date (newest first)
    filtered.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    // Paginate
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedSubscriptions = filtered.slice(start, end);

    return {
      items: paginatedSubscriptions,
      total,
      page,
      pageSize,
      totalPages
    };
  }

  async getSubscriptionById(subscriptionId: string): Promise<Subscription | null> {
    const subscription = this.subscriptions.find(s => s.id === subscriptionId);
    return subscription || null;
  }

  async updateSubscriptionStatus(subscriptionId: string, status: 'active' | 'paused' | 'cancelled'): Promise<Subscription> {
    const index = this.subscriptions.findIndex(s => s.id === subscriptionId);
    if (index === -1) {
      throw new Error('Subscription not found');
    }

    this.subscriptions[index] = {
      ...this.subscriptions[index],
      status
    };

    this.saveToLocalStorage();
    return this.subscriptions[index];
  }

  async updateSubscription(subscriptionId: string, updates: Partial<Subscription>): Promise<Subscription> {
    const index = this.subscriptions.findIndex(s => s.id === subscriptionId);
    if (index === -1) {
      throw new Error('Subscription not found');
    }

    this.subscriptions[index] = {
      ...this.subscriptions[index],
      ...updates
    };

    this.saveToLocalStorage();
    return this.subscriptions[index];
  }

  async createSubscription(subscriptionData: Omit<Subscription, 'id'>): Promise<Subscription> {
    const newSubscription: Subscription = {
      ...subscriptionData,
      id: uuidv4()
    };

    this.subscriptions.push(newSubscription);
    this.saveToLocalStorage();
    return newSubscription;
  }

  async getSubscriptionStats(): Promise<SubscriptionStats> {
    const total = this.subscriptions.length;
    const active = this.subscriptions.filter(s => s.status === 'active').length;
    const paused = this.subscriptions.filter(s => s.status === 'paused').length;
    const cancelled = this.subscriptions.filter(s => s.status === 'cancelled').length;

    // Calculate monthly revenue from active subscriptions
    const monthlyRevenue = this.subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, sub) => {
        switch (sub.frequency) {
          case 'daily':
            return sum + (sub.total * 30);
          case 'weekly':
            return sum + (sub.total * 4);
          case 'monthly':
            return sum + sub.total;
          default:
            return sum;
        }
      }, 0);

    const averageValue = total > 0 ? Math.round(this.subscriptions.reduce((sum, s) => sum + s.total, 0) / total) : 0;

    // Calculate churn rate (cancelled in last 30 days / total active 30 days ago)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCancellations = this.subscriptions.filter(s => 
      s.status === 'cancelled' && new Date(s.startDate) >= thirtyDaysAgo
    ).length;
    const churnRate = total > 0 ? Math.round((recentCancellations / total) * 100) : 0;

    const newThisMonth = this.subscriptions.filter(s => 
      new Date(s.startDate) >= thirtyDaysAgo
    ).length;

    return {
      totalSubscriptions: total,
      activeSubscriptions: active,
      pausedSubscriptions: paused,
      cancelledSubscriptions: cancelled,
      monthlyRevenue,
      averageSubscriptionValue: averageValue,
      churnRate,
      newSubscriptionsThisMonth: newThisMonth
    };
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlans;
  }

  async createSubscriptionPlan(planData: Omit<SubscriptionPlan, 'id'>): Promise<SubscriptionPlan> {
    const newPlan: SubscriptionPlan = {
      ...planData,
      id: uuidv4()
    };

    this.subscriptionPlans.push(newPlan);
    return newPlan;
  }

  async updateSubscriptionPlan(planId: string, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const index = this.subscriptionPlans.findIndex(p => p.id === planId);
    if (index === -1) {
      throw new Error('Subscription plan not found');
    }

    this.subscriptionPlans[index] = {
      ...this.subscriptionPlans[index],
      ...updates
    };

    return this.subscriptionPlans[index];
  }

  async exportSubscriptions(filters?: SubscriptionFilters): Promise<string> {
    let subscriptions = this.subscriptions;
    const users = mockDb.getAllUsers();

    if (filters) {
      const enriched = subscriptions.map(sub => {
        const user = users.find(u => u.id === sub.userId);
        return {
          ...sub,
          customerName: user?.name || 'Unknown',
          customerEmail: user?.email || 'unknown@email.com'
        };
      });
      subscriptions = this.applyFilters(enriched, filters);
    }

    // Convert to CSV
    const headers = [
      'Subscription ID',
      'Customer Name',
      'Customer Email',
      'Plan Name',
      'Frequency',
      'Status',
      'Start Date',
      'Next Delivery',
      'Monthly Value',
      'Total Products',
      'Saved Amount'
    ];

    const rows = subscriptions.map(sub => {
      const user = users.find(u => u.id === sub.userId);
      const monthlyValue = sub.frequency === 'daily' ? sub.total * 30 :
                          sub.frequency === 'weekly' ? sub.total * 4 :
                          sub.total;

      return [
        sub.id,
        user?.name || 'Unknown',
        user?.email || 'unknown@email.com',
        sub.name,
        sub.frequency,
        sub.status,
        formatters.date(sub.startDate),
        formatters.date(sub.nextDelivery),
        formatters.currency(monthlyValue),
        sub.products.length,
        formatters.currency(sub.savedAmount)
      ];
    });

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
  }

  private applyFilters(subscriptions: any[], filters: SubscriptionFilters): any[] {
    let filtered = [...subscriptions];

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(sub => 
        sub.customerName.toLowerCase().includes(search) ||
        sub.customerEmail.toLowerCase().includes(search) ||
        sub.name.toLowerCase().includes(search) ||
        sub.id.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(sub => sub.status === filters.status);
    }

    // Frequency filter
    if (filters.frequency && filters.frequency !== 'all') {
      filtered = filtered.filter(sub => sub.frequency === filters.frequency);
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(sub => 
        new Date(sub.startDate) >= filters.dateFrom!
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(sub => 
        new Date(sub.startDate) <= filters.dateTo!
      );
    }

    // Value range filter
    if (filters.minValue !== undefined) {
      filtered = filtered.filter(sub => sub.total >= filters.minValue!);
    }
    if (filters.maxValue !== undefined) {
      filtered = filtered.filter(sub => sub.total <= filters.maxValue!);
    }

    return filtered;
  }
}

export const adminSubscriptionService = new AdminSubscriptionService();