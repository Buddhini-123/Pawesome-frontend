# 🐾 Pawsome E-commerce - Complete API Requirements Documentation

## Table of Contents
1. [Overview](#overview)
2. [Page-by-Page API Analysis](#page-by-page-api-analysis)
3. [Complete API Endpoints List](#complete-api-endpoints-list)
4. [Data Models & Schemas](#data-models--schemas)
5. [Implementation Strategy](#implementation-strategy)

---

## Overview

This document provides a comprehensive analysis of all APIs required for the Pawsome e-commerce platform. Each page has been thoroughly analyzed to identify data requirements, user interactions, and necessary API endpoints.

---

## Page-by-Page API Analysis

### 1. **Home Page** (`/`)
**Location**: `src/components/pages/Home/Home.tsx`

**Purpose**: Landing page with hero section, featured categories, and call-to-action buttons

**APIs Required**:
```typescript
GET /api/products/featured?limit=8      // Featured products for carousel
GET /api/categories/top?limit=6         // Popular categories
GET /api/banners/homepage               // Dynamic banner content
GET /api/deals/active?limit=3           // Active promotional deals
```

**Data Handling**:
- Featured products are displayed in a carousel format
- Categories shown as interactive cards with hover effects
- Real-time deal countdown timers
- No authentication required

**Current Implementation**: Uses static data and hardcoded categories

---

### 2. **Login Page** (`/login`)
**Location**: `src/components/pages/Login/Login.tsx`

**Purpose**: User authentication with email/password

**APIs Required**:
```typescript
POST /api/auth/login
Body: {
  email: string,
  password: string,
  remember_me: boolean
}
Response: {
  access_token: string,
  refresh_token: string,
  user: User,
  expires_in: number
}

GET /api/auth/session   // Check existing session
```

**Data Handling**:
- Form validation before submission
- JWT token stored in localStorage/cookies
- Redirect to intended page after login
- Error messages for invalid credentials

**Current Implementation**: Mock authentication with demo@pawsome.com

---

### 3. **Register Page** (`/register`)
**Location**: `src/components/pages/Login/Register.tsx`

**Purpose**: New user account creation

**APIs Required**:
```typescript
POST /api/auth/register
Body: {
  name: string,
  email: string,
  password: string,
  phone?: string,
  terms_accepted: boolean
}

POST /api/auth/verify-email
Body: {
  email: string,
  otp: string
}
```

**Data Handling**:
- Multi-step registration process
- Email verification with OTP
- Password strength validation
- Auto-login after successful registration

**Current Implementation**: Simulated registration with localStorage

---

### 4. **Product Category Pages** (`/dogs`, `/cats`, `/birds`, `/other-animals`)
**Location**: `src/components/pages/Categories/*.tsx`

**Purpose**: Display filtered products by animal type

**APIs Required**:
```typescript
GET /api/products
Query Parameters: {
  category: 'dogs' | 'cats' | 'birds' | 'other-animals',
  subcategory?: string[],
  brands?: string[],
  price_min?: number,
  price_max?: number,
  rating_min?: number,
  in_stock?: boolean,
  sort_by?: 'price_asc' | 'price_desc' | 'rating' | 'popularity',
  page: number,
  limit: number
}

GET /api/filters/category/{category}    // Dynamic filter options
GET /api/categories/{category}/subcategories
```

**Data Handling**:
- Server-side filtering and pagination
- Dynamic filter options based on available products
- Real-time filter updates
- Infinite scroll or pagination

**Current Implementation**: Mock data with client-side filtering

---

### 5. **Product Detail Page** (`/product/:id`)
**Location**: `src/components/pages/Products/ProductPage.tsx`

**Purpose**: Display comprehensive product information

**APIs Required**:
```typescript
GET /api/products/{id}
Response: {
  product: Product,
  variants?: ProductVariant[],
  availability: StockInfo
}

GET /api/products/{id}/reviews?page=1&limit=10
GET /api/products/{id}/related?limit=4
POST /api/products/{id}/view    // Track product views
```

**Data Handling**:
- Dynamic image gallery
- Variant selection (size, color)
- Real-time stock checking
- Review pagination
- Add to cart functionality

**Current Implementation**: Static product data, basic cart integration

---

### 6. **Shopping Cart** (`/cart`)
**Location**: `src/components/pages/Shop/Cart.tsx`

**Purpose**: Cart management and pre-checkout

**APIs Required**:
```typescript
GET /api/cart
PUT /api/cart/items/{itemId}
Body: { quantity: number }

DELETE /api/cart/items/{itemId}
DELETE /api/cart/clear

POST /api/cart/validate    // Check stock availability
POST /api/shipping/calculate
Body: { pincode: string }
```

**Data Handling**:
- Sync cart between localStorage and server
- Real-time price calculations
- Shipping cost estimation
- Stock validation before checkout

**Current Implementation**: Context-based cart with localStorage

---

### 7. **Checkout Page** (`/checkout`)
**Location**: `src/components/pages/Shop/Checkout.tsx`

**Purpose**: Complete order placement

**APIs Required**:
```typescript
GET /api/users/addresses
POST /api/users/addresses
PUT /api/users/addresses/{id}

POST /api/orders
Body: {
  items: CartItem[],
  shipping_address_id: string,
  billing_address_id: string,
  payment_method: string,
  coupon_code?: string
}

POST /api/payments/initiate
POST /api/coupons/validate
```

**Data Handling**:
- Multi-step checkout process
- Address management
- Payment gateway integration
- Order confirmation

**Current Implementation**: Mock order creation

---

### 8. **Order Confirmation** (`/order-confirmation/:orderId`)
**Location**: `src/components/pages/Shop/OrderConfirmation.tsx`

**Purpose**: Display order success details

**APIs Required**:
```typescript
GET /api/orders/{orderId}
POST /api/notifications/order-email
Body: { order_id: string }
```

**Data Handling**:
- Display order summary
- Send confirmation email
- Show estimated delivery

**Current Implementation**: Mock order display

---

### 9. **My Account** (`/account`)
**Location**: `src/components/pages/Account/Account.tsx`

**Purpose**: User profile and order management

**APIs Required**:
```typescript
GET /api/users/profile
PUT /api/users/profile
GET /api/orders?page=1&limit=10
GET /api/loyalty/points
PUT /api/users/preferences
```

**Data Handling**:
- Profile editing
- Order history with filters
- Loyalty points display
- Preference management

**Current Implementation**: Mock user data

---

### 10. **Subscriptions** (`/subscriptions`)
**Location**: `src/components/pages/Features/Subscriptions.tsx`

**Purpose**: Recurring delivery management

**APIs Required**:
```typescript
GET /api/subscriptions
POST /api/subscriptions
Body: {
  products: Array<{product_id: string, quantity: number}>,
  frequency: 'weekly' | 'biweekly' | 'monthly',
  start_date: Date,
  delivery_address_id: string
}

PUT /api/subscriptions/{id}
POST /api/subscriptions/{id}/pause
POST /api/subscriptions/{id}/resume
DELETE /api/subscriptions/{id}
```

**Data Handling**:
- Subscription creation wizard
- Frequency management
- Pause/resume functionality
- Upcoming delivery calendar

**Current Implementation**: Static subscription plans display

---

### 11. **Gift Customizer** (`/gifts/customize`)
**Location**: `src/components/pages/Features/GiftCustomizer.tsx`

**Purpose**: Create custom gift boxes

**APIs Required**:
```typescript
GET /api/gifts/themes
GET /api/gifts/products?category=toys
GET /api/gifts/products?category=treats
POST /api/gifts/custom-box
Body: {
  theme_id: string,
  products: string[],
  greeting_card: string,
  recipient_name: string
}
```

**Data Handling**:
- Multi-step customization
- Real-time price calculation
- Preview generation
- Add to cart as bundle

**Current Implementation**: Static gift options

---

### 12. **Daily Deals** (`/deals`, `/deals/:slug`)
**Location**: `src/components/pages/Features/Deals.tsx`

**Purpose**: Time-sensitive offers

**APIs Required**:
```typescript
GET /api/deals
GET /api/deals/{slug}
POST /api/deals/{id}/claim
GET /api/deals/countdown
```

**Data Handling**:
- Real-time countdown timers
- Limited quantity tracking
- Automatic expiration
- Deal claiming process

**Current Implementation**: Mock deals data

---

### 13. **Loyalty Program** (`/loyalty-cards`)
**Location**: `src/components/pages/Features/LoyaltyCards.tsx`

**Purpose**: Points and rewards management

**APIs Required**:
```typescript
GET /api/loyalty/points
GET /api/loyalty/history?page=1&limit=20
GET /api/loyalty/rewards
POST /api/loyalty/redeem
Body: {
  reward_id: string,
  points: number
}
```

**Data Handling**:
- Points balance display
- Transaction history
- Available rewards
- Redemption process

**Current Implementation**: Static loyalty program info

---

### 14. **Contact Us** (`/contact`)
**Location**: `src/components/pages/Account/Contact.tsx`

**Purpose**: Customer support

**APIs Required**:
```typescript
POST /api/contact
Body: {
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string,
  order_id?: string
}

GET /api/support/faqs
```

**Data Handling**:
- Form submission with validation
- File attachment support
- Auto-ticket creation
- FAQ integration

**Current Implementation**: Form without backend

---

### 15. **Brands Page** (`/brands`)
**Location**: `src/components/pages/Shop/Brands.tsx`

**Purpose**: Browse by brand

**APIs Required**:
```typescript
GET /api/brands
GET /api/brands/{brand}/products?page=1&limit=20
```

**Data Handling**:
- Brand grid display
- Brand-specific products
- Brand information

**Current Implementation**: Mock brand data

---

### 16. **Offers Page** (`/offers`)
**Location**: `src/components/pages/Shop/Offers.tsx`

**Purpose**: All promotional offers

**APIs Required**:
```typescript
GET /api/offers/active
GET /api/products?discount_min=10
GET /api/coupons/public
```

**Data Handling**:
- Offer categorization
- Discount calculations
- Coupon management

**Current Implementation**: Static offers

---

## Complete API Endpoints List

### Authentication & User Management
```typescript
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
POST   /api/auth/refresh-token
GET    /api/auth/session
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/verify-email
GET    /api/users/profile
PUT    /api/users/profile
PUT    /api/users/change-password
DELETE /api/users/account
```

### Product Catalog
```typescript
GET    /api/products
GET    /api/products/{id}
GET    /api/products/featured
GET    /api/products/search
GET    /api/categories
GET    /api/categories/{category}/subcategories
GET    /api/brands
GET    /api/brands/{brand}/products
POST   /api/products/{id}/view
GET    /api/products/{id}/reviews
POST   /api/products/{id}/reviews
GET    /api/products/{id}/related
```

### Shopping Cart & Orders
```typescript
GET    /api/cart
POST   /api/cart/items
PUT    /api/cart/items/{itemId}
DELETE /api/cart/items/{itemId}
DELETE /api/cart/clear
POST   /api/cart/validate
POST   /api/orders
GET    /api/orders
GET    /api/orders/{orderId}
PUT    /api/orders/{orderId}/cancel
GET    /api/orders/{orderId}/track
POST   /api/orders/{orderId}/return
```

### Payments
```typescript
POST   /api/payments/initiate
POST   /api/payments/confirm
POST   /api/payments/webhook
GET    /api/payments/methods
POST   /api/payments/save-method
DELETE /api/payments/methods/{id}
```

### Subscriptions
```typescript
GET    /api/subscriptions
POST   /api/subscriptions
GET    /api/subscriptions/{id}
PUT    /api/subscriptions/{id}
DELETE /api/subscriptions/{id}
POST   /api/subscriptions/{id}/pause
POST   /api/subscriptions/{id}/resume
GET    /api/subscriptions/{id}/history
```

### Special Features
```typescript
GET    /api/gifts/themes
GET    /api/gifts/products
POST   /api/gifts/custom-box
GET    /api/deals
GET    /api/deals/{slug}
POST   /api/deals/{id}/claim
GET    /api/loyalty/points
GET    /api/loyalty/history
GET    /api/loyalty/rewards
POST   /api/loyalty/redeem
```

### Support & Communication
```typescript
POST   /api/contact
POST   /api/support/tickets
GET    /api/support/tickets
GET    /api/support/faqs
POST   /api/newsletter/subscribe
DELETE /api/newsletter/unsubscribe
```

### Shipping & Address
```typescript
GET    /api/users/addresses
POST   /api/users/addresses
PUT    /api/users/addresses/{id}
DELETE /api/users/addresses/{id}
POST   /api/shipping/calculate
GET    /api/shipping/zones
GET    /api/shipping/pincodes/{pincode}
```

### Analytics & Tracking
```typescript
POST   /api/analytics/events
POST   /api/analytics/page-view
POST   /api/analytics/conversion
GET    /api/analytics/user-behavior
```

---

## Data Models & Schemas

### Core Models

#### User Model
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
  phoneVerified: boolean;
  addresses: Address[];
  preferences: UserPreferences;
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  createdAt: Date;
  updatedAt: Date;
}

enum LoyaltyTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum'
}

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}
```

#### Product Model
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  brandId: string;
  price: number;
  originalPrice?: number;
  currency: 'INR';
  images: string[];
  thumbnailImage: string;
  categoryId: string;
  subcategory: string;
  tags: string[];
  ratingId: number;
  reviewCount: number;
  sku: string;
  barcode?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  inStock: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  features: string[];
  specifications: Record<string, string>;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  discount?: Discount;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  attributes: Record<string, string>; // e.g., { size: 'L', color: 'Red' }
  image?: string;
}
```

#### Order Model
```typescript
interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  couponCode?: string;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
}

enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  RETURNED = 'returned'
}
```

#### Subscription Model
```typescript
interface Subscription {
  id: string;
  userId: string;
  ratingId: string;
  name: string;
  status: SubscriptionStatus;
  products: SubscriptionProduct[];
  frequency: SubscriptionFrequency;
  startDate: Date;
  endDate?: Date;
  nextDeliveryDate: Date;
  pausedUntil?: Date;
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  deliveryDayPreference?: number[]; // Day of week (0-6)
  skipDates: Date[];
  totalDeliveries: number;
  createdAt: Date;
  updatedAt: Date;
}

interface SubscriptionProduct {
  productId: string;
  quantity: number;
  customizations?: Record<string, any>;
}

interface Category {
  id: string;
  name: string 'dogs' | 'cats' | 'birds' | 'other-animals';
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Discount {
  id: string;
  productId: string;
  orderId: string;
  subscriptionId: string;
  name: string;
  discountType: string;
  discountAmount: float;
  start_at: Date;
  end_at: Date;
  is_active: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Ratings {
  id: string;
  productId: string;
  subscriptionId: string;
  rating: string;
  review: string;
  createdAt: Date;
  updatedAt: Date;
}

enum SubscriptionFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly'
}

enum SubscriptionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
}
```

### API Response Formats

#### Success Response
```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  metadata?: {
    timestamp: Date;
    version: string;
  };
}
```

#### Error Response
```typescript
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    field?: string;
  };
  metadata?: {
    timestamp: Date;
    traceId: string;
  };
}
```

#### Paginated Response
```typescript
interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  filters?: Record<string, any>;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
}
```

---

## Implementation Strategy

### Current State Analysis
1. **Authentication**: Mock auth with localStorage
2. **Product Data**: Static mock data in `/src/data/mockProducts.ts`
3. **Cart Management**: React Context with localStorage persistence
4. **API Services**: Mock service classes simulating API calls
5. **State Management**: Context API for global state

### Migration Phases

#### Phase 1: Core Infrastructure (Week 1-2)
- Set up API client with interceptors
- Implement authentication flow with JWT
- Create base service classes
- Set up error handling and logging

#### Phase 2: Product Catalog (Week 3-4)
- Implement product listing APIs
- Add search and filtering
- Product detail pages
- Category management

#### Phase 3: Shopping Flow (Week 5-6)
- Cart synchronization
- Checkout process
- Payment integration
- Order management

#### Phase 4: User Features (Week 7-8)
- User profile management
- Address book
- Order history
- Wishlist functionality

#### Phase 5: Advanced Features (Week 9-10)
- Subscription system
- Gift customization
- Loyalty program
- Deal management

### API Client Configuration
```typescript
// src/services/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.pawsome.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh
      await refreshToken();
    }
    return Promise.reject(error);
  }
);
```

### Service Layer Pattern
```typescript
// src/services/api/products.service.ts
export class ProductsService {
  static async getProducts(params: ProductParams): Promise<PaginatedResponse<Product>> {
    return apiClient.get('/products', { params });
  }

  static async getProductById(id: string): Promise<ApiResponse<Product>> {
    return apiClient.get(`/products/${id}`);
  }

  static async searchProducts(query: string): Promise<ApiResponse<Product[]>> {
    return apiClient.post('/products/search', { query });
  }
}
```

### Error Handling Strategy
```typescript
// src/utils/errorHandler.ts
export const handleApiError = (error: any): string => {
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};
```

### Performance Optimizations
1. **Caching**: Implement React Query for API caching
2. **Pagination**: Server-side pagination for all lists
3. **Lazy Loading**: Code splitting and lazy imports
4. **Image Optimization**: CDN integration with responsive images
5. **Search Debouncing**: Prevent excessive API calls

### Security Considerations
1. **Authentication**: JWT with refresh token rotation
2. **HTTPS**: Enforce secure connections
3. **CORS**: Proper CORS configuration
4. **Input Validation**: Client and server-side validation
5. **Rate Limiting**: Implement API rate limits
6. **XSS Protection**: Sanitize user inputs

---

## Conclusion

This comprehensive documentation covers all 60+ API endpoints required for the Pawsome e-commerce platform. Each page's functionality has been analyzed with corresponding API requirements clearly defined. The current mock implementation provides a solid foundation for transitioning to a real backend API.

### Key Statistics:
- **Total Pages Analyzed**: 16
- **Total API Endpoints**: 65+
- **Core Data Models**: 12
- **Authentication Methods**: JWT with refresh tokens
- **State Management**: React Context + API integration

### Next Steps:
1. Backend API development based on this specification
2. Progressive migration from mock to real APIs
3. Implementation of authentication system
4. Integration testing for all endpoints
5. Performance optimization and monitoring

---

*Document Version*: 1.0.1  
*Last Updated*: July 2025  
*Status*: Ready for Implementation ✅