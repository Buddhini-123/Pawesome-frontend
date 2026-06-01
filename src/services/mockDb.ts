import { User, Order, Subscription, Review, WishlistItem, Pet } from '../types';
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
      const samplePets: Pet[] = [
        {
          id: 'pet-1',
          name: 'Buddy',
          type: 'dog',
          breed: 'Golden Retriever',
          age: 3,
          ageUnit: 'years',
          weight: 32,
          weightUnit: 'kg',
          gender: 'male',
          color: 'Golden',
          dateOfBirth: new Date('2021-03-15'),
          isNeutered: true,
          microchipId: '123456789012345',
          medicalNotes: 'Healthy and active. Regular vet checkups.',
          allergies: ['chicken'],
          medications: ['heartworm prevention'],
          timeline: [
            {
              id: 'timeline-1',
              petId: 'pet-1',
              date: new Date('2024-12-15'),
              type: 'vet_visit',
              title: 'Annual Health Checkup',
              description: 'Regular yearly checkup and vaccinations',
              category: 'medical',
              importance: 'medium',
              vetVisit: {
                vetName: 'Dr. Sarah Johnson',
                clinic: 'Pawsome Veterinary Clinic',
                reason: 'Annual checkup',
                diagnosis: 'Healthy overall, slight weight gain',
                treatment: 'Diet adjustment recommended',
                cost: 150
              },
              createdAt: new Date('2024-12-15'),
              updatedAt: new Date('2024-12-15')
            },
            {
              id: 'timeline-2',
              petId: 'pet-1',
              date: new Date('2024-11-20'),
              type: 'weight_check',
              title: 'Monthly Weight Check',
              description: 'Tracking weight management progress',
              category: 'wellness',
              importance: 'medium',
              weight: {
                weight: 32,
                unit: 'kg',
                bodyCondition: 'ideal',
                notes: 'Maintaining healthy weight'
              },
              createdAt: new Date('2024-11-20'),
              updatedAt: new Date('2024-11-20')
            },
            {
              id: 'timeline-3',
              petId: 'pet-1',
              date: new Date('2024-10-05'),
              type: 'training',
              title: 'Advanced Obedience Training',
              description: 'Working on recall and stay commands',
              category: 'training',
              importance: 'low',
              training: {
                skill: 'Advanced Recall',
                progress: 'in_progress',
                trainer: 'Mike Peterson',
                duration: 60,
                notes: 'Great progress with distractions'
              },
              createdAt: new Date('2024-10-05'),
              updatedAt: new Date('2024-10-05')
            }
          ],
          vetInfo: {
            primaryVet: {
              name: 'Dr. Sarah Johnson',
              clinic: 'Pawsome Veterinary Clinic',
              phone: '+91 98765 43210',
              email: 'sarah@pawsomevet.com',
              address: '123 Pet Care Street, Mumbai'
            }
          },
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 'pet-2',
          name: 'Whiskers',
          type: 'cat',
          breed: 'Persian',
          age: 2,
          ageUnit: 'years',  
          weight: 4.5,
          weightUnit: 'kg',
          gender: 'female',
          color: 'White',
          dateOfBirth: new Date('2022-06-20'),
          isNeutered: true,
          medicalNotes: 'Indoor cat, needs regular grooming.',
          medications: ['flea prevention'],
          timeline: [
            {
              id: 'timeline-4',
              petId: 'pet-2',
              date: new Date('2024-12-10'),
              type: 'grooming',
              title: 'Professional Grooming Session',
              description: 'Full grooming including bath, brush, and nail trim',
              category: 'grooming',
              importance: 'medium',
              grooming: {
                service: 'Full grooming package',
                groomer: 'Lisa Chen',
                cost: 80,
                nextAppointment: new Date('2025-03-10'),
                notes: 'Handled grooming very well, minimal matting'
              },
              createdAt: new Date('2024-12-10'),
              updatedAt: new Date('2024-12-10')
            },
            {
              id: 'timeline-5',
              petId: 'pet-2',
              date: new Date('2024-11-15'),
              type: 'vaccination',
              title: 'Annual Vaccination Booster',
              description: 'FVRCP and rabies vaccination',
              category: 'health',
              importance: 'high',
              vaccination: {
                vaccine: 'FVRCP + Rabies',
                veterinarian: 'Dr. Michael Wong',
                clinic: 'Downtown Animal Hospital',
                nextDue: new Date('2025-11-15')
              },
              createdAt: new Date('2024-11-15'),
              updatedAt: new Date('2024-11-15')
            },
            {
              id: 'timeline-6',
              petId: 'pet-2',
              date: new Date('2024-09-22'),
              type: 'behavior',
              title: 'Excessive Scratching Behavior',
              description: 'Observed increased scratching of furniture',
              category: 'behavior',
              importance: 'medium',
              behavior: {
                behavior: 'Furniture scratching',
                severity: 'moderate',
                triggers: ['boredom', 'territorial marking'],
                interventions: ['new scratching posts', 'interactive toys'],
                progress: 'Improvement seen with new scratching posts'
              },
              createdAt: new Date('2024-09-22'),
              updatedAt: new Date('2024-09-22')
            }
          ],
          vetInfo: {
            primaryVet: {
              name: 'Dr. Michael Wong',
              clinic: 'Downtown Animal Hospital',
              phone: '+91 98765 43211',
              email: 'michael@downtownvet.com',
              address: '456 Main Street, Mumbai'
            }
          },
          createdAt: new Date('2024-02-10'),
          updatedAt: new Date('2024-02-10')
        }
      ];

      const demoUser: User = {
        id: 'demo-user-1',
        email: 'demo@pawsome.com',
        name: 'Demo User',
        phone: '+91 9876543210',
        role: 'user',
        loyaltyCardId: 'lc-001', // Link to demo user's loyalty card
        pets: samplePets,
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
    try {
      // AuthContext persists the full user object under 'auth_user'
      const userData = localStorage.getItem('auth_user');
      if (!userData) return null;
      return JSON.parse(userData) as User;
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