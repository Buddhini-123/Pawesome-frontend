// Product related types
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  subcategory: string;
  inStock: boolean;
  discount?: number;
  description?: string;
}

// Cart related types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// User related types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin';
  addresses?: Address[];
  createdAt: Date;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

// Auth related types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// Order related types
export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: 'card' | 'upi' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: OrderStatus;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface PaymentMethod {
  type: 'card' | 'upi' | 'netbanking' | 'cod';
  last4?: string;
  cardBrand?: string;
}

// API related types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  category?: string;
  subcategory?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'name';
}

// Subscription types
export interface Subscription {
  id: string;
  userId: string;
  name: string;
  products: SubscriptionItem[];
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate?: Date;
  nextDelivery: Date;
  deliveryAddress: Address;
  status: 'active' | 'paused' | 'cancelled';
  total: number;
  savedAmount: number;
}

export interface SubscriptionItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

// Review types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  createdAt: Date;
  helpful: number;
}

// Wishlist types
export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: Date;
}

// Deal types
export interface Deal {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  offerType: 'buy-get-free' | 'discount' | 'bundle' | 'free-shipping' | 'referral' | 'upgrade';
  discount?: number;
  originalPrice?: number;
  salePrice?: number;
  image: string;
  isActive: boolean;
  validUntil?: Date;
  slug: string;
  category: string[];
  products?: string[];
}

// Form types
export interface CheckoutForm {
  email: string;
  shippingAddress: Address;
  billingAddress?: Address;
  sameAsShipping: boolean;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}