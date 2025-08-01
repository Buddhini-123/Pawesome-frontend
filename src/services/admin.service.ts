import { 
  dogProducts, 
  catProducts, 
  birdProducts, 
  otherAnimalsProducts,
  vetDietProducts,
  Product 
} from '../data/mockProducts';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  usersChange: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'paid' | 'unpaid' | 'partial' | 'refunded';
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress: Address;
  orderDate: string;
  deliveryDate?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  registeredDate: string;
  lastLogin?: string;
  orders: number;
  totalSpent: number;
  addresses: Address[];
}

class AdminService {
  // Get all products
  getAllProducts(): Product[] {
    return [
      ...dogProducts,
      ...catProducts,
      ...birdProducts,
      ...otherAnimalsProducts,
      ...vetDietProducts
    ];
  }

  // Get dashboard statistics
  getDashboardStats(): DashboardStats {
    const products = this.getAllProducts();
    const orders = this.getAllOrders();
    const users = this.getAllUsers();

    // Calculate revenue from orders
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalUsers: users.length,
      revenueChange: 12.5, // Mock data
      ordersChange: 8.3,
      productsChange: 2.1,
      usersChange: 15.7
    };
  }

  // Get all orders (mock data)
  getAllOrders(): Order[] {
    return [
      {
        id: 'ORD001',
        userId: 'USR001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          {
            productId: 'dog-food-1',
            productName: 'Royal Canin Adult Dog Food',
            price: 1500,
            quantity: 2,
            total: 3000
          }
        ],
        subtotal: 3000,
        tax: 300,
        shipping: 100,
        total: 3400,
        status: 'completed',
        paymentStatus: 'paid',
        paymentMethod: 'Credit Card',
        shippingAddress: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          zip: '400001',
          country: 'India'
        },
        billingAddress: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          zip: '400001',
          country: 'India'
        },
        orderDate: '2025-01-08',
        deliveryDate: '2025-01-10'
      },
      // Add more mock orders as needed
    ];
  }

  // Get all users (mock data)
  getAllUsers(): User[] {
    return [
      {
        id: 'USR001',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 98765 43210',
        role: 'user',
        status: 'active',
        registeredDate: '2024-01-15',
        lastLogin: '2025-01-08',
        orders: 12,
        totalSpent: 6000,
        addresses: [
          {
            street: '123 Main St',
            city: 'Mumbai',
            state: 'Maharashtra',
            zip: '400001',
            country: 'India'
          }
        ]
      },
      {
        id: 'USR002',
        name: 'Admin User',
        email: 'admin@pawsome.com',
        role: 'admin',
        status: 'active',
        registeredDate: '2023-01-01',
        lastLogin: '2025-01-08',
        orders: 0,
        totalSpent: 0,
        addresses: []
      },
      // Add more mock users as needed
    ];
  }

  // Product CRUD operations
  createProduct(product: Omit<Product, 'id'>): Product {
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}`
    };
    // In a real app, this would save to a database
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    // In a real app, this would update the database
    const products = this.getAllProducts();
    const product = products.find(p => p.id === id);
    if (product) {
      return { ...product, ...updates };
    }
    return null;
  }

  deleteProduct(id: string): boolean {
    // In a real app, this would delete from database
    return true;
  }

  // Order management
  updateOrderStatus(orderId: string, status: Order['status']): Order | null {
    const orders = this.getAllOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      return { ...order, status };
    }
    return null;
  }

  // User management
  updateUserStatus(userId: string, status: User['status']): User | null {
    const users = this.getAllUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      return { ...user, status };
    }
    return null;
  }

  // Analytics
  getProductAnalytics(productId: string) {
    // Mock analytics data
    return {
      views: Math.floor(Math.random() * 1000),
      sales: Math.floor(Math.random() * 100),
      revenue: Math.floor(Math.random() * 50000),
      conversionRate: (Math.random() * 10).toFixed(2)
    };
  }

  getOrderAnalytics(period: 'daily' | 'weekly' | 'monthly' | 'yearly') {
    // Mock analytics data
    return {
      period,
      orders: Math.floor(Math.random() * 100),
      revenue: Math.floor(Math.random() * 100000),
      avgOrderValue: Math.floor(Math.random() * 1000),
      topProducts: this.getAllProducts().slice(0, 5)
    };
  }
}

export default new AdminService();