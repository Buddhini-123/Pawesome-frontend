import { User, PaginatedResponse } from '../types';
import { mockDb } from './mockDb';
import { formatters } from '../utils/formatters';

export interface UserFilters {
  search?: string;
  role?: 'all' | 'user' | 'admin';
  dateFrom?: Date;
  dateTo?: Date;
  hasOrders?: boolean;
  hasSubscriptions?: boolean;
  isActive?: boolean;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  regularUsers: number;
  newUsersThisMonth: number;
  usersWithOrders: number;
  usersWithSubscriptions: number;
  totalOrdersValue: number;
}

export interface UserActivity {
  userId: string;
  action: string;
  timestamp: Date;
  details?: string;
}

class AdminUserService {
  async getAllUsers(
    page: number = 1,
    pageSize: number = 10,
    filters?: UserFilters
  ): Promise<PaginatedResponse<User>> {
    // Get all users from mockDb
    let users = mockDb.getAllUsers();

    // Apply filters
    if (filters) {
      users = this.applyFilters(users, filters);
    }

    // Sort by creation date (newest first)
    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Paginate
    const total = users.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedUsers = users.slice(start, end);

    return {
      items: paginatedUsers,
      total,
      page,
      pageSize,
      totalPages
    };
  }

  async getUserById(userId: string): Promise<User | null> {
    return mockDb.findUserById(userId);
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    return mockDb.updateUser(userId, updates);
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    return mockDb.createUser(userData);
  }

  async getUserStats(): Promise<UserStats> {
    const users = mockDb.getAllUsers();
    const orders = mockDb.getAllOrders();
    const now = new Date();
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    // Calculate basic stats
    const totalUsers = users.length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const regularUsers = users.filter(u => u.role === 'user').length;
    const newUsersThisMonth = users.filter(u => new Date(u.createdAt) >= monthAgo).length;

    // Users with orders
    const userIdsWithOrders = new Set(orders.map(o => o.userId));
    const usersWithOrders = users.filter(u => userIdsWithOrders.has(u.id)).length;

    // Calculate total order value
    const totalOrdersValue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // Mock subscription data - in real app, would fetch from subscription service
    const usersWithSubscriptions = Math.floor(totalUsers * 0.3); // 30% have subscriptions

    return {
      totalUsers,
      activeUsers: totalUsers, // In real app, would track active status
      adminUsers,
      regularUsers,
      newUsersThisMonth,
      usersWithOrders,
      usersWithSubscriptions,
      totalOrdersValue
    };
  }

  async getUserActivity(userId: string): Promise<UserActivity[]> {
    // Mock activity data - in real app, would track user actions
    const activities: UserActivity[] = [
      {
        userId,
        action: 'Login',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        details: 'Logged in from Chrome browser'
      },
      {
        userId,
        action: 'Order Placed',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        details: 'Order #ORD001 - ₹2,500'
      },
      {
        userId,
        action: 'Profile Updated',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        details: 'Updated shipping address'
      },
      {
        userId,
        action: 'Account Created',
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        details: 'Account registration completed'
      }
    ];

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async exportUsers(filters?: UserFilters): Promise<string> {
    let users = mockDb.getAllUsers();
    
    if (filters) {
      users = this.applyFilters(users, filters);
    }

    // Convert to CSV
    const headers = [
      'User ID',
      'Name',
      'Email',
      'Phone',
      'Role',
      'Created Date',
      'Addresses Count',
      'Orders Count',
      'Total Spent'
    ];

    const orders = mockDb.getAllOrders();
    const rows = users.map(user => {
      const userOrders = orders.filter(o => o.userId === user.id && o.status !== 'cancelled');
      const totalSpent = userOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      return [
        user.id,
        user.name,
        user.email,
        user.phone || 'N/A',
        user.role,
        formatters.date(user.createdAt),
        user.addresses?.length || 0,
        userOrders.length,
        formatters.currency(totalSpent)
      ];
    });

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
  }

  async toggleUserStatus(userId: string, isActive: boolean): Promise<User> {
    // In real app, would have an isActive field
    // For now, we'll just return the user as-is
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real implementation, would update user status
    console.log(`User ${userId} status changed to ${isActive ? 'active' : 'inactive'}`);
    
    return user;
  }

  async resetUserPassword(userId: string): Promise<void> {
    // In real app, would send password reset email
    console.log(`Password reset initiated for user ${userId}`);
  }

  async getUserOrderSummary(userId: string): Promise<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: Date;
  }> {
    const orders = mockDb.getAllOrders().filter(o => o.userId === userId && o.status !== 'cancelled');
    
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;
    const lastOrderDate = orders.length > 0 
      ? new Date(Math.max(...orders.map(o => new Date(o.createdAt).getTime())))
      : undefined;

    return {
      totalOrders,
      totalSpent,
      averageOrderValue,
      lastOrderDate
    };
  }

  private applyFilters(users: User[], filters: UserFilters): User[] {
    let filtered = [...users];

    // Search filter (name, email, or phone)
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        (user.phone && user.phone.toLowerCase().includes(search))
      );
    }

    // Role filter
    if (filters.role && filters.role !== 'all') {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(user => 
        new Date(user.createdAt) >= filters.dateFrom!
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(user => 
        new Date(user.createdAt) <= filters.dateTo!
      );
    }

    // Users with orders filter
    if (filters.hasOrders !== undefined) {
      const orders = mockDb.getAllOrders();
      const userIdsWithOrders = new Set(orders.map(o => o.userId));
      
      if (filters.hasOrders) {
        filtered = filtered.filter(user => userIdsWithOrders.has(user.id));
      } else {
        filtered = filtered.filter(user => !userIdsWithOrders.has(user.id));
      }
    }

    return filtered;
  }
}

export const adminUserService = new AdminUserService();