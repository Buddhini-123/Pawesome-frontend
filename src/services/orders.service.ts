import { Order, OrderItem, CheckoutForm, CartItem } from '../types';
import { mockDb } from './mockDb';
import { authService } from './auth.service';
import { productsService } from './products.service';

class OrdersService {
  async createOrder(checkoutData: CheckoutForm & { items: CartItem[] }): Promise<Order> {
    // Validate user is logged in
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User must be logged in to place an order');
    }

    // Validate cart items
    if (!checkoutData.items || checkoutData.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Validate all products are available
    for (const item of checkoutData.items) {
      const isAvailable = await productsService.validateProductAvailability(
        item.product.id,
        item.quantity
      );
      if (!isAvailable) {
        throw new Error(`Product ${item.product.name} is not available in requested quantity`);
      }
    }

    // Calculate order totals
    const subtotal = checkoutData.items.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
    
    // Free shipping for orders above Rs.20,000
    const shipping = subtotal > 20000 ? 0 : 150;
    
    // Calculate tax (GST 18%)
    const tax = Math.round(subtotal * 0.18);
    
    const total = subtotal + shipping + tax;

    // Transform cart items to order items
    const orderItems: OrderItem[] = checkoutData.items.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.image,
      price: item.product.price,
      quantity: item.quantity,
      total: item.product.price * item.quantity
    }));

    // Create order data
    const orderData: Omit<Order, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
      items: orderItems,
      shippingAddress: checkoutData.shippingAddress,
      paymentMethod: checkoutData.paymentMethod,
      subtotal,
      shipping,
      tax,
      total,
      status: 'pending'
    };

    // Create order in database
    const order = await mockDb.createOrder(currentUser.id, orderData);

    // Simulate payment processing
    await this.processPayment(order, checkoutData.paymentMethod);

    // Update order status to processing
    const updatedOrder = await mockDb.updateOrderStatus(order.id, 'processing');

    // Clear the cart (this should be done in the cart context)
    // We'll handle this when we fix the cart implementation

    return updatedOrder;
  }

  async getUserOrders(): Promise<Order[]> {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User must be logged in');
    }

    return mockDb.getUserOrders(currentUser.id);
  }

  async getOrderById(orderId: string): Promise<Order> {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User must be logged in');
    }

    const order = await mockDb.getOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Verify the order belongs to the current user
    if (order.userId !== currentUser.id) {
      throw new Error('Unauthorized access to order');
    }

    return order;
  }

  async trackOrder(orderId: string): Promise<{
    order: Order;
    trackingInfo: {
      currentStatus: string;
      statusHistory: { status: string; timestamp: Date; description: string }[];
      estimatedDelivery: Date;
    };
  }> {
    const order = await this.getOrderById(orderId);

    // Simulate tracking information
    const statusHistory = [
      {
        status: 'Order Placed',
        timestamp: order.createdAt,
        description: 'Your order has been successfully placed'
      },
      {
        status: 'Processing',
        timestamp: new Date(order.createdAt.getTime() + 3600000), // +1 hour
        description: 'Your order is being processed'
      }
    ];

    if (order.status === 'shipped' || order.status === 'delivered') {
      statusHistory.push({
        status: 'Shipped',
        timestamp: new Date(order.createdAt.getTime() + 86400000), // +1 day
        description: `Your order has been shipped. Tracking: ${order.trackingNumber}`
      });
    }

    if (order.status === 'delivered') {
      statusHistory.push({
        status: 'Delivered',
        timestamp: order.updatedAt,
        description: 'Your order has been delivered successfully'
      });
    }

    // Estimate delivery date (3-5 days from order)
    const estimatedDelivery = new Date(order.createdAt);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 4);

    return {
      order,
      trackingInfo: {
        currentStatus: order.status,
        statusHistory,
        estimatedDelivery
      }
    };
  }

  async cancelOrder(orderId: string): Promise<Order> {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User must be logged in');
    }

    const order = await this.getOrderById(orderId);

    // Can only cancel pending or processing orders
    if (order.status !== 'pending' && order.status !== 'processing') {
      throw new Error('Cannot cancel order in current status');
    }

    // Update order status
    const cancelledOrder = await mockDb.updateOrderStatus(orderId, 'cancelled');

    // In a real app, we'd also process refunds here
    console.log('Order cancelled, refund initiated');

    return cancelledOrder;
  }

  async getOrderSummary(): Promise<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    recentOrders: Order[];
  }> {
    const orders = await this.getUserOrders();
    
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;
    const recentOrders = orders
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    return {
      totalOrders,
      totalSpent,
      averageOrderValue,
      recentOrders
    };
  }

  private async processPayment(order: Order, paymentMethod: any): Promise<void> {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, this would integrate with payment gateways
    // For now, we'll just simulate success
    console.log(`Processing payment for order ${order.id} using ${paymentMethod.type}`);
    
    // Random payment failure (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Payment failed. Please try again.');
    }

    console.log('Payment processed successfully');
  }

  async applyPromoCode(code: string, subtotal: number): Promise<{
    valid: boolean;
    discount: number;
    message: string;
  }> {
    // Simulate promo code validation
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock promo codes
    const promoCodes: Record<string, { discount: number; minOrder?: number }> = {
      'WELCOME10': { discount: 0.1, minOrder: 500 },
      'SAVE20': { discount: 0.2, minOrder: 2000 },
      'FREESHIP': { discount: 150, minOrder: 1000 }, // Flat discount for shipping
      'PAWSOME15': { discount: 0.15, minOrder: 1500 }
    };

    const promo = promoCodes[code.toUpperCase()];
    
    if (!promo) {
      return {
        valid: false,
        discount: 0,
        message: 'Invalid promo code'
      };
    }

    if (promo.minOrder && subtotal < promo.minOrder) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order value of ₹${promo.minOrder} required for this code`
      };
    }

    const discount = promo.discount < 1 
      ? Math.round(subtotal * promo.discount) 
      : promo.discount;

    return {
      valid: true,
      discount,
      message: `Promo code applied! You saved ₹${discount}`
    };
  }
}

// Create singleton instance
export const ordersService = new OrdersService();