import { User, Order, Subscription, Review, WishlistItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

class MockDatabase {
  private users: Map<string, User>;
  private orders: Map<string, Order[]>;
  private subscriptions: Map<string, Subscription[]>;
  private reviews: Map<string, Review[]>;
  private wishlists: Map<string, WishlistItem[]>;
  private sessions: Map<string, { userId: string; expiresAt: Date }>;

  constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.subscriptions = new Map();
    this.reviews = new Map();
    this.wishlists = new Map();
    this.sessions = new Map();
    
    this.loadFromLocalStorage();
    this.seedData();
  }

  private loadFromLocalStorage() {
    try {
      const storedUsers = localStorage.getItem('mockDb_users');
      const storedOrders = localStorage.getItem('mockDb_orders');
      const storedSubscriptions = localStorage.getItem('mockDb_subscriptions');
      const storedReviews = localStorage.getItem('mockDb_reviews');
      const storedWishlists = localStorage.getItem('mockDb_wishlists');
      
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        this.users = new Map(users);
      }
      
      if (storedOrders) {
        const orders = JSON.parse(storedOrders);
        this.orders = new Map(orders);
      }
      
      if (storedSubscriptions) {
        const subscriptions = JSON.parse(storedSubscriptions);
        this.subscriptions = new Map(subscriptions);
      }
      
      if (storedReviews) {
        const reviews = JSON.parse(storedReviews);
        this.reviews = new Map(reviews);
      }
      
      if (storedWishlists) {
        const wishlists = JSON.parse(storedWishlists);
        this.wishlists = new Map(wishlists);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem('mockDb_users', JSON.stringify(Array.from(this.users.entries())));
      localStorage.setItem('mockDb_orders', JSON.stringify(Array.from(this.orders.entries())));
      localStorage.setItem('mockDb_subscriptions', JSON.stringify(Array.from(this.subscriptions.entries())));
      localStorage.setItem('mockDb_reviews', JSON.stringify(Array.from(this.reviews.entries())));
      localStorage.setItem('mockDb_wishlists', JSON.stringify(Array.from(this.wishlists.entries())));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private seedData() {
    // Seed with demo user if no users exist
    if (this.users.size === 0) {
      const demoUser: User = {
        id: 'demo-user-1',
        email: 'demo@pawsome.com',
        name: 'Demo User',
        phone: '+91 9876543210',
        role: 'user',
        addresses: [
          {
            id: 'addr-1',
            type: 'home',
            fullName: 'Demo User',
            phone: '+91 9876543210',
            address: '123 Main Street',
            street: '123 Main Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            country: 'India',
            isDefault: true
          }
        ],
        createdAt: new Date()
      };

      const adminUser: User = {
        id: 'admin-user-1',
        email: 'admin@pawsome.com',
        name: 'Admin User',
        phone: '+91 9876543211',
        role: 'admin',
        addresses: [],
        createdAt: new Date()
      };
      
      this.users.set(demoUser.id, demoUser);
      this.users.set(adminUser.id, adminUser);
      this.saveToLocalStorage();
    }
  }

  // User methods
  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    await this.simulateDelay();
    
    const existingUser = Array.from(this.users.values()).find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const user: User = {
      ...userData,
      id: uuidv4(),
      createdAt: new Date()
    };
    
    this.users.set(user.id, user);
    this.saveToLocalStorage();
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    await this.simulateDelay();
    const user = Array.from(this.users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  }

  async findUserById(id: string): Promise<User | null> {
    await this.simulateDelay();
    return this.users.get(id) || null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    await this.simulateDelay();
    const user = this.users.get(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    const updatedUser = { ...user, ...updates, id: user.id };
    this.users.set(id, updatedUser);
    this.saveToLocalStorage();
    return updatedUser;
  }

  // Session methods
  async createSession(userId: string): Promise<string> {
    await this.simulateDelay();
    const sessionId = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry
    
    this.sessions.set(sessionId, { userId, expiresAt });
    return sessionId;
  }

  async validateSession(sessionId: string): Promise<string | null> {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    
    if (new Date() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return null;
    }
    
    return session.userId;
  }

  async deleteSession(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
  }

  // Order methods
  async createOrder(userId: string, orderData: Omit<Order, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'userEmail'>): Promise<Order>;
  async createOrder(order: Order): Promise<Order>;
  async createOrder(userIdOrOrder: string | Order, orderData?: Omit<Order, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'userEmail'>): Promise<Order> {
    await this.simulateDelay();
    
    let order: Order;
    
    if (typeof userIdOrOrder === 'string') {
      // New signature from orders.service.ts
      const userId = userIdOrOrder;
      const user = await this.findUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      order = {
        ...orderData!,
        id: uuidv4(),
        userId,
        userEmail: user.email,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } else {
      // Legacy signature from order.service.ts
      order = userIdOrOrder;
    }
    
    const userOrders = this.orders.get(order.userId) || [];
    userOrders.push(order);
    this.orders.set(order.userId, userOrders);
    this.saveToLocalStorage();
    
    return order;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    await this.simulateDelay();
    return this.orders.get(userId) || [];
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    await this.simulateDelay();
    
    for (const orders of this.orders.values()) {
      const order = orders.find(o => o.id === orderId);
      if (order) return order;
    }
    
    return null;
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    await this.simulateDelay();
    
    for (const [userId, orders] of this.orders.entries()) {
      const orderIndex = orders.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        orders[orderIndex] = {
          ...orders[orderIndex],
          status,
          updatedAt: new Date()
        };
        this.orders.set(userId, orders);
        this.saveToLocalStorage();
        return orders[orderIndex];
      }
    }
    
    throw new Error('Order not found');
  }

  // Subscription methods
  async createSubscription(userId: string, subscriptionData: Omit<Subscription, 'id' | 'userId'>): Promise<Subscription> {
    await this.simulateDelay();
    
    const subscription: Subscription = {
      ...subscriptionData,
      id: uuidv4(),
      userId
    };
    
    const userSubscriptions = this.subscriptions.get(userId) || [];
    userSubscriptions.push(subscription);
    this.subscriptions.set(userId, userSubscriptions);
    this.saveToLocalStorage();
    
    return subscription;
  }

  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    await this.simulateDelay();
    return this.subscriptions.get(userId) || [];
  }

  // Review methods
  async createReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'helpful'>): Promise<Review> {
    await this.simulateDelay();
    
    const review: Review = {
      ...reviewData,
      id: uuidv4(),
      createdAt: new Date(),
      helpful: 0
    };
    
    const productReviews = this.reviews.get(reviewData.productId) || [];
    productReviews.push(review);
    this.reviews.set(reviewData.productId, productReviews);
    this.saveToLocalStorage();
    
    return review;
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    await this.simulateDelay();
    return this.reviews.get(productId) || [];
  }

  // Admin methods
  getAllOrders(): Order[] {
    const allOrders: Order[] = [];
    for (const orders of this.orders.values()) {
      allOrders.push(...orders);
    }
    return allOrders;
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  // Wishlist methods
  async addToWishlist(userId: string, item: Omit<WishlistItem, 'id' | 'addedAt'>): Promise<WishlistItem> {
    await this.simulateDelay();
    
    const wishlistItem: WishlistItem = {
      ...item,
      id: uuidv4(),
      addedAt: new Date()
    };
    
    const userWishlist = this.wishlists.get(userId) || [];
    
    // Check if already in wishlist
    if (userWishlist.some(w => w.productId === item.productId)) {
      throw new Error('Product already in wishlist');
    }
    
    userWishlist.push(wishlistItem);
    this.wishlists.set(userId, userWishlist);
    this.saveToLocalStorage();
    
    return wishlistItem;
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    await this.simulateDelay();
    
    const userWishlist = this.wishlists.get(userId) || [];
    const filtered = userWishlist.filter(w => w.productId !== productId);
    this.wishlists.set(userId, filtered);
    this.saveToLocalStorage();
  }

  async getUserWishlist(userId: string): Promise<WishlistItem[]> {
    await this.simulateDelay();
    return this.wishlists.get(userId) || [];
  }

  // Get current user from session
  getCurrentUser(): User | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    // In a real app, we'd validate the token
    // For mock, we'll just get the user from the token (which contains userId)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user = this.users.get(payload.userId);
      return user || null;
    } catch {
      return null;
    }
  }

  // Utility methods
  private async simulateDelay(min: number = 100, max: number = 500): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  // Clear all data (for testing)
  async clearAllData(): Promise<void> {
    this.users.clear();
    this.orders.clear();
    this.subscriptions.clear();
    this.reviews.clear();
    this.wishlists.clear();
    this.sessions.clear();
    
    localStorage.removeItem('mockDb_users');
    localStorage.removeItem('mockDb_orders');
    localStorage.removeItem('mockDb_subscriptions');
    localStorage.removeItem('mockDb_reviews');
    localStorage.removeItem('mockDb_wishlists');
    
    this.seedData();
  }
  
  // Force reset with default users
  forceResetUsers(): void {
    console.log('Force resetting users...');
    this.users.clear();
    localStorage.removeItem('mockDb_users');
    this.seedData();
    console.log('Users after reset:', Array.from(this.users.values()));
  }

  // Debug method to check all users
  debugGetAllUsers(): any {
    const users = Array.from(this.users.entries());
    console.log('All users in database:', users);
    console.log('Users from localStorage:', localStorage.getItem('mockDb_users'));
    return users;
  }
}

// Create singleton instance
export const mockDb = new MockDatabase();

// Temporary: expose to window for debugging
if (typeof window !== 'undefined') {
  (window as any).mockDb = mockDb;
}