// Product related types
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  category: string;
  subcategory: string;
  inStock: boolean;
  stock?: number;
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
  // Loyalty related fields
  loyaltyCardId?: string;
  birthDate?: Date;
  marketingPreferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    promotionalEmails: boolean;
    pointsExpiryAlerts: boolean;
    exclusiveOffers: boolean;
  };
  // Pet details for personalized offers
  pets?: Pet[];
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  fullName: string;
  phone: string;
  address: string;
  street?: string;
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
  paymentMethod: 'card' | 'upi' | 'cod' | 'netbanking';
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: OrderStatus;
  status: OrderStatus; // Alias for orderStatus for backward compatibility
  subtotal: number;
  shippingCost: number;
  shipping?: number; // Alias for shippingCost
  tax?: number;
  totalAmount: number;
  total: number; // Alias for totalAmount for backward compatibility
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
  // Loyalty points information
  pointsEarned?: number;
  pointsRedeemed?: number;
  pointsValue?: number; // Value in LKR of redeemed points
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  total?: number;
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
  paymentMethod: PaymentMethod | 'card' | 'upi' | 'cod';
  couponCode?: string;
}

// Pet Management types
export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'fish' | 'rabbit' | 'hamster' | 'other';
  breed?: string;
  age?: number;
  ageUnit?: 'months' | 'years';
  weight?: number;
  weightUnit?: 'kg' | 'lbs';
  gender?: 'male' | 'female';
  color?: string;
  dateOfBirth?: Date;
  isNeutered?: boolean;
  microchipId?: string;
  image?: string;
  medicalNotes?: string;
  allergies?: string[];
  medications?: string[];
  favoriteProducts?: string[]; // Product IDs
  // Enhanced tracking
  timeline?: PetTimelineEntry[];
  vetInfo?: VetInfo;
  emergencyContact?: EmergencyContact;
  insurance?: PetInsurance;
  preferences?: PetPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface PetTimelineEntry {
  id: string;
  petId: string;
  date: Date;
  type: TimelineEntryType;
  title: string;
  description?: string;
  category: TimelineCategory;
  importance: 'low' | 'medium' | 'high' | 'critical';
  attachments?: TimelineAttachment[];
  vetVisit?: VetVisitDetails;
  medication?: MedicationDetails;
  weight?: WeightEntry;
  vaccination?: VaccinationDetails;
  training?: TrainingDetails;
  behavior?: BehaviorEntry;
  grooming?: GroomingDetails;
  nutrition?: NutritionEntry;
  createdAt: Date;
  updatedAt: Date;
}

export type TimelineEntryType = 
  | 'vet_visit'
  | 'vaccination' 
  | 'medication'
  | 'weight_check'
  | 'grooming'
  | 'training'
  | 'behavior'
  | 'nutrition'
  | 'milestone'
  | 'emergency'
  | 'general'
  | 'surgery'
  | 'dental'
  | 'boarding'
  | 'travel';

export type TimelineCategory = 
  | 'health'
  | 'medical'
  | 'wellness'
  | 'behavior'
  | 'training'
  | 'grooming'
  | 'nutrition'
  | 'lifestyle'
  | 'emergency'
  | 'milestone';

export interface TimelineAttachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video';
  url: string;
  size?: number;
}

export interface VetVisitDetails {
  vetName: string;
  clinic: string;
  reason: string;
  diagnosis?: string;
  treatment?: string;
  followUpDate?: Date;
  cost?: number;
  prescriptions?: string[];
}

export interface MedicationDetails {
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  prescribedBy?: string;
  sideEffects?: string[];
  notes?: string;
}

export interface WeightEntry {
  weight: number;
  unit: 'kg' | 'lbs';
  bodyCondition?: 'underweight' | 'ideal' | 'overweight' | 'obese';
  notes?: string;
}

export interface VaccinationDetails {
  vaccine: string;
  batch?: string;
  nextDue?: Date;
  veterinarian: string;
  clinic: string;
  reactions?: string[];
}

export interface TrainingDetails {
  trainer?: string;
  skill: string;
  progress: 'started' | 'in_progress' | 'mastered';
  methods?: string[];
  duration?: number; // minutes
  notes?: string;
}

export interface BehaviorEntry {
  behavior: string;
  severity: 'mild' | 'moderate' | 'severe';
  triggers?: string[];
  interventions?: string[];
  progress?: string;
}

export interface GroomingDetails {
  service: string;
  groomer?: string;
  cost?: number;
  nextAppointment?: Date;
  notes?: string;
}

export interface NutritionEntry {
  food: string;
  brand?: string;
  amount: string;
  calories?: number;
  reason?: string; // diet change, weight management, etc.
  supplements?: string[];
}

export interface VetInfo {
  primaryVet: {
    name: string;
    clinic: string;
    phone: string;
    email?: string;
    address?: string;
  };
  emergencyVet?: {
    name: string;
    clinic: string;
    phone: string;
    address?: string;
  };
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  hasKeys?: boolean;
}

export interface PetInsurance {
  provider: string;
  policyNumber: string;
  coverage: string[];
  deductible?: number;
  monthlyPremium?: number;
  expiryDate?: Date;
}

export interface PetPreferences {
  favoriteToys?: string[];
  favoriteActivities?: string[];
  dislikes?: string[];
  specialNeeds?: string[];
  dailyRoutine?: {
    feeding: string[];
    walks: string[];
    sleep: string;
    play: string[];
  };
}

export interface PetForm {
  name: string;
  type: Pet['type'];
  breed: string;
  age: string;
  ageUnit: Pet['ageUnit'];
  weight: string;
  weightUnit: Pet['weightUnit'];
  gender: Pet['gender'];
  color: string;
  dateOfBirth: string;
  isNeutered: boolean;
  microchipId: string;
  medicalNotes: string;
  allergies: string;
  medications: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}