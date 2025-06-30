import { Order, OrderStatus, Address } from '../types';
import { api } from './api';
import { mockDb } from './mockDb';
import { v4 as uuidv4 } from 'uuid';

interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: Omit<Address, 'id' | 'type' | 'isDefault' | 'country' | 'street'> & {
    country?: string;
  };
  paymentMethod: 'card' | 'upi' | 'cod';
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
}

class OrderService {
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      const response = await api.request<Order>('/orders', {
        method: 'POST',
        body: orderData
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to create order');
    } catch (error) {
      // Mock implementation for development
      const currentUser = mockDb.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const newOrder: Order = {
        id: uuidv4(),
        userId: currentUser.id,
        userEmail: currentUser.email,
        items: orderData.items.map(item => ({
          ...item,
          productName: `Product ${item.productId}` // In real app, would fetch product details
        })),
        shippingAddress: {
          id: uuidv4(),
          type: 'home' as const,
          ...orderData.shippingAddress,
          country: orderData.shippingAddress.country || 'India'
        },
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'completed',
        orderStatus: 'confirmed' as OrderStatus,
        status: 'confirmed' as OrderStatus,
        subtotal: orderData.subtotal,
        shippingCost: orderData.shippingCost,
        shipping: orderData.shippingCost,
        totalAmount: orderData.totalAmount,
        total: orderData.totalAmount,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockDb.createOrder(newOrder);
      return newOrder;
    }
  }

  async getOrders(): Promise<Order[]> {
    try {
      const response = await api.request<Order[]>('/orders');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      // Mock implementation
      const currentUser = mockDb.getCurrentUser();
      if (!currentUser) {
        return [];
      }
      
      return mockDb.getUserOrders(currentUser.id);
    }
  }

  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await api.request<Order>(`/orders/${orderId}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Order not found');
    } catch (error) {
      // Mock implementation
      const currentUser = mockDb.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const orders = await mockDb.getUserOrders(currentUser.id);
      const order = orders.find(o => o.id === orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      return order;
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    try {
      const response = await api.request<Order>(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: { status }
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error('Failed to update order status');
    } catch (error) {
      // Mock implementation would update the order in mockDb
      throw new Error('Update order status not implemented in mock');
    }
  }

  async cancelOrder(orderId: string): Promise<void> {
    try {
      const response = await api.request(`/orders/${orderId}/cancel`, {
        method: 'POST'
      });
      
      if (!response.success) {
        throw new Error('Failed to cancel order');
      }
    } catch (error) {
      // Mock implementation would update the order status to 'cancelled'
      throw new Error('Cancel order not implemented in mock');
    }
  }
}

export const orderService = new OrderService();