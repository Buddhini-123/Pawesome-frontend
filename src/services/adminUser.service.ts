import { User, PaginatedResponse } from '../types';
import { api } from './api';

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

export interface AdminUserDetail {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  loyalty_points: number;
  loyalty_tier: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  addresses?: BackendAddress[];
}

export interface BackendAddress {
  id: number;
  type: 'home' | 'work' | 'other';
  type_label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  district: string;
  postal_code: string;
  landmark?: string;
  country: string;
  is_default: boolean;
  formatted_address: string;
}

export interface AdminUserStats {
  active_subscriptions: number;
  total_subscriptions: number;
  loyalty_balance: number;
  lifetime_earned: number;
  lifetime_redeemed: number;
  tier_multiplier: number;
  points_to_next_tier: number | null;
  has_addresses: boolean;
  has_default_address: boolean;
}

class AdminUserService {
  async getAllUsers(
    page: number = 1,
    pageSize: number = 10,
    filters?: UserFilters
  ): Promise<PaginatedResponse<User>> {
    const params: Record<string, any> = { page, per_page: pageSize };

    if (filters?.search) params.search = filters.search;
    if (filters?.role && filters.role !== 'all') params.role = filters.role;
    if (filters?.isActive !== undefined) params.status = filters.isActive ? 'active' : 'inactive';

    const response = await api.get<any>('/admin/users', params);

    if (!response.data?.success) {
      return { items: [], total: 0, page, pageSize, totalPages: 0 };
    }

    const { users, meta } = response.data.data;
    const mapped: User[] = users.map((u: AdminUserDetail) => this.mapToUser(u));

    return {
      items: mapped,
      total: meta.total,
      page: meta.current_page,
      pageSize: meta.per_page,
      totalPages: meta.last_page,
    };
  }

  async getUserById(userId: string): Promise<{ user: AdminUserDetail; stats?: AdminUserStats } | null> {
    const response = await api.get<any>(`/admin/users/${userId}`, { include: 'addresses,stats' });
    if (!response.data?.success) return null;
    return response.data.data;
  }

  async updateUser(userId: string, updates: Partial<User> & { role?: string }): Promise<User> {
    const payload: Record<string, any> = {};
    if (updates.name) {
      const parts = (updates.name as string).split(' ');
      payload.first_name = parts[0] ?? '';
      payload.last_name = parts.slice(1).join(' ') ?? '';
    }
    if (updates.email) payload.email = updates.email;
    if (updates.phone !== undefined) payload.phone = updates.phone;
    if (updates.role) payload.role = updates.role;

    const response = await api.patch<any>(`/admin/users/${userId}`, payload);
    if (!response.data?.success) throw new Error('Failed to update user');
    return this.mapToUser(response.data.data.user);
  }

  async getUserStats(): Promise<UserStats> {
    // Fetch total counts using the admin users endpoint
    const [allResp, adminResp, activeResp] = await Promise.all([
      api.get<any>('/admin/users', { per_page: 1 }),
      api.get<any>('/admin/users', { per_page: 1, role: 'admin' }),
      api.get<any>('/admin/users', { per_page: 1, status: 'active' }),
    ]);

    const total = allResp.data?.data?.meta?.total ?? 0;
    const adminCount = adminResp.data?.data?.meta?.total ?? 0;
    const activeCount = activeResp.data?.data?.meta?.total ?? 0;

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const newResp = await api.get<any>('/admin/users', { per_page: 1, date_from: firstOfMonth });
    const newThisMonth = newResp.data?.data?.meta?.total ?? 0;

    return {
      totalUsers: total,
      activeUsers: activeCount,
      adminUsers: adminCount,
      regularUsers: total - adminCount,
      newUsersThisMonth: newThisMonth,
      usersWithOrders: 0,
      usersWithSubscriptions: 0,
      totalOrdersValue: 0,
    };
  }

  async getUserActivity(userId: string): Promise<UserActivity[]> {
    // No real activity endpoint — return minimal synthetic activity from account creation
    return [];
  }

  async exportUsers(filters?: UserFilters): Promise<string> {
    const result = await this.getAllUsers(1, 1000, filters);
    const headers = ['User ID', 'Name', 'Email', 'Phone', 'Role', 'Created Date'];
    const rows = result.items.map(user => [
      user.id,
      user.name,
      user.email,
      user.phone || 'N/A',
      user.role,
      new Date(user.createdAt).toLocaleDateString(),
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');
  }

  async toggleUserStatus(userId: string, isActive: boolean): Promise<User> {
    const response = await api.patch<any>(`/admin/users/${userId}`, { is_active: isActive });
    if (!response.data?.success) throw new Error('Failed to toggle user status');
    return this.mapToUser(response.data.data.user);
  }

  async resetUserPassword(userId: string): Promise<void> {
    console.log(`Password reset initiated for user ${userId}`);
  }

  async getUserOrderSummary(userId: string): Promise<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: Date;
  }> {
    return { totalOrders: 0, totalSpent: 0, averageOrderValue: 0 };
  }

  mapToUser(u: AdminUserDetail): User {
    return {
      id: String(u.id),
      name: u.name || `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim(),
      email: u.email,
      phone: u.phone,
      role: u.role,
      createdAt: new Date(u.created_at),
      addresses: [],
    };
  }
}

export const adminUserService = new AdminUserService();
