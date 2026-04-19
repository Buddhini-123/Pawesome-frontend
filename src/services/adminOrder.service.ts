import { Order, OrderStatus, PaginatedResponse } from '../types';
import { mockDb } from './mockDb';
import { formatters } from '../utils/formatters';
import axiosInstance from './axiosInstance';

export interface OrderFilters {
  search?: string;
  status?: OrderStatus | 'all';
  dateFrom?: Date;
  dateTo?: Date;
  paymentMethod?: string;
  paymentStatus?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  averageOrderValue: number;
}

class AdminOrderService {
  async getAllOrders(
    page: number = 1,
    pageSize: number = 10,
    filters?: OrderFilters
  ): Promise<PaginatedResponse<Order>> {
    // Get all orders from mockDb
    let orders = mockDb.getAllOrders();

    // Apply filters
    if (filters) {
      orders = this.applyFilters(orders, filters);
    }

    // Sort by date (newest first)
    orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Paginate
    const total = orders.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedOrders = orders.slice(start, end);

    return {
      items: paginatedOrders,
      total,
      page,
      pageSize,
      totalPages
    };
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return mockDb.getOrderById(orderId);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await mockDb.updateOrderStatus(orderId, status);
    
    // In a real app, you might want to send notifications here
    console.log(`Order ${orderId} status updated to ${status}`);
    
    // Update payment status if order is delivered
    if (status === 'delivered' && order.paymentMethod === 'cod') {
      // In a real app, update payment status
      console.log('COD payment marked as completed');
    }
    
    return order;
  }

  async getOrderStats(): Promise<OrderStats> {
    const orders = mockDb.getAllOrders();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats: OrderStats = {
      totalOrders: orders.length,
      pendingOrders: 0,
      processingOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
      totalRevenue: 0,
      todayRevenue: 0,
      averageOrderValue: 0
    };

    orders.forEach(order => {
      // Count by status
      switch (order.status) {
        case 'pending':
          stats.pendingOrders++;
          break;
        case 'confirmed':
        case 'processing':
          stats.processingOrders++;
          break;
        case 'shipped':
          stats.shippedOrders++;
          break;
        case 'delivered':
          stats.deliveredOrders++;
          break;
        case 'cancelled':
          stats.cancelledOrders++;
          break;
      }

      // Calculate revenue (only for non-cancelled orders)
      if (order.status !== 'cancelled') {
        stats.totalRevenue += order.totalAmount;
        
        // Check if order is from today
        const orderDate = new Date(order.createdAt);
        if (orderDate >= today) {
          stats.todayRevenue += order.totalAmount;
        }
      }
    });

    // Calculate average order value
    const nonCancelledOrders = orders.filter(o => o.status !== 'cancelled').length;
    stats.averageOrderValue = nonCancelledOrders > 0 
      ? Math.round(stats.totalRevenue / nonCancelledOrders) 
      : 0;

    return stats;
  }

  async exportOrders(filters?: OrderFilters): Promise<string> {
    let orders = mockDb.getAllOrders();
    
    if (filters) {
      orders = this.applyFilters(orders, filters);
    }

    // Convert to CSV
    const headers = [
      'Order ID',
      'Date',
      'Customer Email',
      'Status',
      'Payment Method',
      'Payment Status',
      'Items',
      'Subtotal',
      'Shipping',
      'Total',
      'Delivery Address'
    ];

    const rows = orders.map(order => [
      order.id,
      formatters.date(order.createdAt),
      order.userEmail,
      order.status,
      order.paymentMethod.toUpperCase(),
      order.paymentStatus,
      order.items.length,
      formatters.currency(order.subtotal),
      formatters.currency(order.shippingCost),
      formatters.currency(order.totalAmount),
      `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
  }

  async bulkUpdateStatus(orderIds: string[], status: OrderStatus): Promise<Order[]> {
    const updatedOrders: Order[] = [];
    
    for (const orderId of orderIds) {
      try {
        const updated = await this.updateOrderStatus(orderId, status);
        updatedOrders.push(updated);
      } catch (error) {
        console.error(`Failed to update order ${orderId}:`, error);
      }
    }
    
    return updatedOrders;
  }

  private applyFilters(orders: Order[], filters: OrderFilters): Order[] {
    let filtered = [...orders];

    // Search filter (ID, email, or address)
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(search) ||
        order.userEmail.toLowerCase().includes(search) ||
        order.shippingAddress.city.toLowerCase().includes(search) ||
        order.shippingAddress.address.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(order => 
        new Date(order.createdAt) >= filters.dateFrom!
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(order => 
        new Date(order.createdAt) <= filters.dateTo!
      );
    }

    // Payment method filter
    if (filters.paymentMethod) {
      filtered = filtered.filter(order => 
        order.paymentMethod === filters.paymentMethod
      );
    }

    // Payment status filter
    if (filters.paymentStatus) {
      filtered = filtered.filter(order => 
        order.paymentStatus === filters.paymentStatus
      );
    }

    // Amount range filter
    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(order => 
        order.totalAmount >= filters.minAmount!
      );
    }
    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(order => 
        order.totalAmount <= filters.maxAmount!
      );
    }

    return filtered;
  }

  async sendInvoice(orderId: string): Promise<{ message: string }> {
    const response = await axiosInstance.post(`/admin/orders/${orderId}/send-invoice`);
    return response.data;
  }

  // Get order timeline for tracking
  getOrderTimeline(order: Order): Array<{
    status: string;
    timestamp: Date;
    description: string;
    icon?: string;
  }> {
    const timeline = [
      {
        status: 'Order Placed',
        timestamp: order.createdAt,
        description: 'Your order has been received',
        icon: 'ShoppingCart'
      }
    ];

    // Add status-based timeline items
    if (['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)) {
      timeline.push({
        status: 'Order Confirmed',
        timestamp: new Date(order.createdAt.getTime() + 30 * 60000), // +30 mins
        description: 'Your order has been confirmed',
        icon: 'CheckCircle'
      });
    }

    if (['processing', 'shipped', 'delivered'].includes(order.status)) {
      timeline.push({
        status: 'Processing',
        timestamp: new Date(order.createdAt.getTime() + 2 * 3600000), // +2 hours
        description: 'We are preparing your order',
        icon: 'Package'
      });
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      timeline.push({
        status: 'Shipped',
        timestamp: new Date(order.createdAt.getTime() + 24 * 3600000), // +1 day
        description: `Shipped with tracking: ${order.trackingNumber || 'TRACK123456'}`,
        icon: 'Truck'
      });
    }

    if (order.status === 'delivered') {
      timeline.push({
        status: 'Delivered',
        timestamp: order.updatedAt,
        description: 'Your order has been delivered',
        icon: 'CheckCircle2'
      });
    }

    if (order.status === 'cancelled') {
      timeline.push({
        status: 'Cancelled',
        timestamp: order.updatedAt,
        description: 'Order has been cancelled',
        icon: 'XCircle'
      });
    }

    return timeline;
  }
}

export const adminOrderService = new AdminOrderService();