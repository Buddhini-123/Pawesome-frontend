# 🐾 Pawsome Frontend - API & Data Documentation

## Overview
This document provides comprehensive information about the data models, API structures, and backend integration patterns used in the Pawsome Frontend project.

---

## 📊 Product Data Structure

### Real Product Database (133 Items)

The project includes a comprehensive product database imported from Excel with real pet care products. Here's the complete data structure:

#### Product Schema
```typescript
interface ProductData {
  name: string;                    // Product name
  description: string | null;      // HTML description
  added_by: string;               // Admin/seller identifier
  user_id: number;                // User ID of the seller
  category_id: number;            // Category identifier
  brand_id: number;               // Brand identifier
  video_provider: string;         // Video platform (youtube, etc.)
  video_link: string | null;      // Product demo video URL
  unit_price: number;             // Price in currency units
  purchase_price: number | null;  // Wholesale/cost price
  unit: string;                   // Unit of measurement (pc, kg, etc.)
  current_stock: number;          // Available inventory
  est_shipping_days: number;      // Estimated delivery time
  meta_title: string;             // SEO title
  meta_description: string;       // SEO description
}
```

### Category Mapping
```typescript
const CategoryMap = {
  12: "grooming",      // Pet grooming products
  15: "deodorizers",   // Deodorants and sprays
  16: "shampoos",      // Pet shampoos and conditioners
  19: "toys",          // Pet toys and chews
  // Additional categories based on data analysis
} as const;
```

### Brand Mapping
```typescript
const BrandMap = {
  1: "HerbPaw",        // Natural pet care brand
  3: "Cinnamon Trails", // Natural wood products
  // Additional brands from the dataset
} as const;
```

---

## 🏪 Product Catalog Analysis

### Product Distribution by Category

#### Grooming & Care Products (40+ items)
- **HerbPaw Waterless Bath Sprays**: Lemon, Tulsi, and other natural extracts
- **Shampoos & Conditioners**: Various formulations for different pet needs
- **Deodorizers**: Natural and chemical-free options
- **Price Range**: ₹799 - ₹1,299

#### Pet Toys & Accessories (30+ items)
- **Cinnamon Wood Chew Sticks**: Natural, sustainable dog chews
- **Interactive Toys**: Various materials and sizes
- **Safety Accessories**: Collars, leashes, and safety equipment
- **Price Range**: ₹299 - ₹1,999

#### Food & Nutrition (25+ items)
- **Premium Pet Foods**: Various brands and formulations
- **Treats & Supplements**: Health-focused nutrition
- **Special Dietary Products**: Veterinary recommended options
- **Price Range**: ₹399 - ₹4,999

#### Health & Wellness (20+ items)
- **Veterinary Products**: Medical-grade supplies
- **Supplements**: Vitamins and health boosters
- **First Aid**: Emergency care products
- **Price Range**: ₹199 - ₹2,499

#### Habitat & Environment (18+ items)
- **Cages & Enclosures**: Various sizes for different pets
- **Bedding & Comfort**: Sleep and rest products
- **Environmental Enrichment**: Habitat enhancement items
- **Price Range**: ₹499 - ₹9,999

### Featured Brands Analysis

#### HerbPaw (Natural Pet Care)
- **Product Focus**: Natural, chemical-free grooming products
- **Key Products**: Waterless bath sprays with natural extracts
- **Unique Selling Points**: 
  - Tulsi extract for anti-inflammatory benefits
  - Lemon extract for odor control and flea repellent
  - Chemical-free formulations
- **Price Point**: Premium (₹1,150 - ₹1,250)

#### Cinnamon Trails (Sustainable Toys)
- **Product Focus**: Natural wood chew toys
- **Key Products**: Cinnamon wood chew sticks
- **Unique Selling Points**:
  - Sustainably sourced from cinnamon debarking process
  - Natural dental hygiene benefits
  - Long-lasting compared to other wood chews
  - Vacuum-sealed packaging with moisture control
- **Price Point**: Mid-range (₹799)

---

## 🔌 API Integration Patterns

### Current Data Management

#### Mock Data Structure (Development)
```typescript
// src/data/mockProducts.ts
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
```

#### Real Data Integration
```typescript
// Future API integration pattern
interface APIProduct {
  id: number;
  name: string;
  description: string;
  category_id: number;
  brand_id: number;
  unit_price: number;
  current_stock: number;
  meta_title: string;
  meta_description: string;
  // ... other fields from Excel data
}

// Data transformation layer
const transformAPIProduct = (apiProduct: APIProduct): Product => {
  return {
    id: apiProduct.id.toString(),
    name: apiProduct.name,
    price: apiProduct.unit_price,
    inStock: apiProduct.current_stock > 0,
    category: getCategoryName(apiProduct.category_id),
    brand: getBrandName(apiProduct.brand_id),
    // ... transform other fields
  };
};
```

### API Endpoints Design

#### Product Management
```typescript
// GET /api/products
interface ProductsResponse {
  products: APIProduct[];
  total: number;
  page: number;
  limit: number;
  filters: FilterOptions;
}

// GET /api/products/:id
interface ProductDetailResponse {
  product: APIProduct;
  related_products: APIProduct[];
  reviews: ProductReview[];
  availability: StockInfo;
}

// GET /api/categories
interface CategoriesResponse {
  categories: Category[];
}

// GET /api/brands
interface BrandsResponse {
  brands: Brand[];
}
```

#### Search & Filtering
```typescript
// GET /api/products/search
interface SearchParams {
  query?: string;
  category_id?: number;
  brand_id?: number;
  price_min?: number;
  price_max?: number;
  in_stock?: boolean;
  rating_min?: number;
  sort_by?: 'price' | 'rating' | 'name' | 'popularity';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface SearchResponse {
  products: APIProduct[];
  facets: SearchFacets;
  total_results: number;
  search_time_ms: number;
}
```

#### Shopping Cart
```typescript
// POST /api/cart/add
interface AddToCartRequest {
  product_id: number;
  quantity: number;
  user_id?: number; // For logged-in users
  session_id?: string; // For guest users
}

// GET /api/cart
interface CartResponse {
  items: CartItem[];
  total_amount: number;
  shipping_cost: number;
  tax_amount: number;
  grand_total: number;
}
```

---

## 🎨 Frontend Data Models

### Component Props Interfaces

#### Product Card Component
```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (productId: string) => void;
  showDiscount?: boolean;
  showRating?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}
```

#### Product List Component
```typescript
interface ProductListProps {
  products: Product[];
  loading?: boolean;
  error?: string;
  onProductClick?: (productId: string) => void;
  onFilterChange?: (filters: FilterState) => void;
  onSortChange?: (sort: SortOption) => void;
  pagination?: PaginationState;
}
```

#### Filter Component
```typescript
interface FilterComponentProps {
  filters: FilterOption[];
  selectedFilters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

interface FilterOption {
  id: string;
  name: string;
  type: 'checkbox' | 'range' | 'select';
  options: FilterValue[];
}

interface FilterValue {
  value: string | number;
  label: string;
  count?: number;
}
```

### State Management Patterns

#### Product State
```typescript
interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  filters: FilterState;
  sort: SortOption;
  pagination: PaginationState;
}

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
}
```

#### Cart State
```typescript
interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  shipping: number;
  tax: number;
  grandTotal: number;
  loading: boolean;
  error: string | null;
}

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  subtotal: number;
}
```

---

## 📝 Content Management

### Product Descriptions Processing

#### HTML Content Handling
The Excel data contains rich HTML descriptions that need proper processing:

```typescript
interface ProductDescription {
  raw_html: string;
  plain_text: string;
  features: string[];
  benefits: string[];
  usage_instructions: string[];
}

// HTML sanitization and processing
const processProductDescription = (html: string): ProductDescription => {
  // Remove dangerous HTML elements
  const sanitized = DOMPurify.sanitize(html);
  
  // Extract plain text
  const plainText = sanitized.replace(/<[^>]*>/g, '');
  
  // Extract structured content
  const features = extractListItems(sanitized, 'features');
  const benefits = extractListItems(sanitized, 'benefits');
  
  return {
    raw_html: sanitized,
    plain_text: plainText,
    features,
    benefits,
    usage_instructions: []
  };
};
```

### SEO Data Management

#### Meta Information
```typescript
interface SEOData {
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
  structured_data: ProductStructuredData;
}

interface ProductStructuredData {
  "@context": "https://schema.org/";
  "@type": "Product";
  name: string;
  description: string;
  brand: Brand;
  offers: Offer;
  aggregateRating?: AggregateRating;
}
```

---

## 🔍 Search Implementation

### Search Architecture

#### Frontend Search State
```typescript
interface SearchState {
  query: string;
  results: Product[];
  suggestions: string[];
  filters: SearchFilters;
  sort: SortOption;
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
  searchTime: number;
}

interface SearchFilters {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number;
  availability: 'all' | 'in_stock' | 'out_of_stock';
}
```

#### Search Query Builder
```typescript
class SearchQueryBuilder {
  private query: string = '';
  private filters: SearchFilters = {};
  private sort: SortOption = { field: 'relevance', order: 'desc' };

  setQuery(query: string): this {
    this.query = query;
    return this;
  }

  addFilter(key: keyof SearchFilters, value: any): this {
    this.filters[key] = value;
    return this;
  }

  setSort(field: string, order: 'asc' | 'desc'): this {
    this.sort = { field, order };
    return this;
  }

  build(): SearchParams {
    return {
      query: this.query,
      ...this.filters,
      sort_by: this.sort.field,
      sort_order: this.sort.order
    };
  }
}
```

---

## 🛡️ Data Validation

### Input Validation Schemas

#### Product Validation
```typescript
import { z } from 'zod';

const ProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  category_id: z.number().positive(),
  brand_id: z.number().positive(),
  unit_price: z.number().positive(),
  current_stock: z.number().min(0),
  unit: z.enum(['pc', 'kg', 'g', 'ml', 'l']),
  est_shipping_days: z.number().min(1).max(30)
});

const validateProduct = (data: unknown): Product => {
  return ProductSchema.parse(data);
};
```

#### Cart Validation
```typescript
const CartItemSchema = z.object({
  product_id: z.string(),
  quantity: z.number().min(1).max(99),
  user_id: z.string().optional(),
  session_id: z.string().optional()
});

const AddToCartSchema = z.object({
  items: z.array(CartItemSchema),
  shipping_address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip_code: z.string(),
    country: z.string()
  }).optional()
});
```

---

## 📊 Analytics & Tracking

### Event Tracking Schema

#### Product Events
```typescript
interface ProductViewEvent {
  event_type: 'product_view';
  product_id: string;
  product_name: string;
  category: string;
  brand: string;
  price: number;
  user_id?: string;
  session_id: string;
  timestamp: Date;
}

interface AddToCartEvent {
  event_type: 'add_to_cart';
  product_id: string;
  quantity: number;
  price: number;
  cart_total: number;
  user_id?: string;
  session_id: string;
  timestamp: Date;
}

interface PurchaseEvent {
  event_type: 'purchase';
  transaction_id: string;
  items: PurchaseItem[];
  total_amount: number;
  shipping_cost: number;
  tax_amount: number;
  payment_method: string;
  user_id?: string;
  timestamp: Date;
}
```

#### User Behavior Tracking
```typescript
interface PageViewEvent {
  event_type: 'page_view';
  page_url: string;
  page_title: string;
  referrer: string;
  user_agent: string;
  user_id?: string;
  session_id: string;
  timestamp: Date;
}

interface SearchEvent {
  event_type: 'search';
  query: string;
  results_count: number;
  filters_applied: FilterState;
  user_id?: string;
  session_id: string;
  timestamp: Date;
}
```

---

## 🔒 Authentication & Authorization

### User Management

#### User Profile Schema
```typescript
interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth?: Date;
  avatar_url?: string;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

interface UserPreferences {
  user_id: string;
  newsletter_subscribed: boolean;
  sms_notifications: boolean;
  email_notifications: boolean;
  preferred_language: string;
  preferred_currency: string;
  pet_profiles: PetProfile[];
}

interface PetProfile {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'fish' | 'other';
  breed?: string;
  age?: number;
  weight?: number;
  special_needs?: string[];
  avatar_url?: string;
}
```

#### Authentication Flow
```typescript
interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: UserProfile;
  expires_in: number;
}

interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  terms_accepted: boolean;
  marketing_consent?: boolean;
}
```

---

## 🚚 Order Management

### Order Schema

#### Order Structure
```typescript
interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  items: OrderItem[];
  shipping_address: Address;
  billing_address: Address;
  payment_method: PaymentMethod;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  estimated_delivery: Date;
  created_at: Date;
  updated_at: Date;
}

enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_variant?: ProductVariant;
}
```

#### Order Tracking
```typescript
interface OrderTracking {
  order_id: string;
  tracking_number?: string;
  carrier: string;
  status_history: OrderStatusUpdate[];
  estimated_delivery: Date;
  delivery_instructions?: string;
}

interface OrderStatusUpdate {
  status: OrderStatus;
  timestamp: Date;
  location?: string;
  notes?: string;
  updated_by: string;
}
```

---

## 💳 Payment Integration

### Payment Schema

#### Payment Methods
```typescript
interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'wallet' | 'cod';
  provider: string;
  is_default: boolean;
  metadata: PaymentMethodMetadata;
}

interface CreditCardMetadata {
  last_four: string;
  brand: string;
  expiry_month: number;
  expiry_year: number;
  cardholder_name: string;
}

interface UPIMetadata {
  vpa: string;
  bank_name?: string;
}
```

#### Payment Processing
```typescript
interface PaymentRequest {
  order_id: string;
  amount: number;
  currency: string;
  payment_method_id: string;
  return_url: string;
  webhook_url: string;
}

interface PaymentResponse {
  payment_id: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  gateway_response: any;
  transaction_fee: number;
  net_amount: number;
  processed_at?: Date;
}
```

---

## 📱 Mobile API Considerations

### Mobile-Specific Endpoints

#### App Configuration
```typescript
// GET /api/mobile/config
interface MobileConfigResponse {
  app_version: string;
  min_supported_version: string;
  force_update: boolean;
  maintenance_mode: boolean;
  features: FeatureFlags;
  api_endpoints: APIEndpoints;
}

interface FeatureFlags {
  three_d_homepage: boolean;
  advanced_search: boolean;
  social_login: boolean;
  push_notifications: boolean;
  offline_mode: boolean;
}
```

#### Push Notifications
```typescript
interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  data: NotificationData;
  actions?: NotificationAction[];
}

interface NotificationData {
  type: 'order_update' | 'promotion' | 'recommendation' | 'general';
  target_screen: string;
  target_params?: Record<string, any>;
}
```

---

## 🔧 Developer Tools & Testing

### API Testing Interfaces

#### Test Data Factories
```typescript
class ProductFactory {
  static create(overrides?: Partial<Product>): Product {
    return {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      brand: faker.company.name(),
      price: faker.number.int({ min: 100, max: 10000 }),
      image: faker.image.url(),
      rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
      reviews: faker.number.int({ min: 0, max: 1000 }),
      category: faker.helpers.arrayElement(['dogs', 'cats', 'birds']),
      subcategory: faker.commerce.department(),
      inStock: faker.datatype.boolean(),
      ...overrides
    };
  }

  static createMany(count: number): Product[] {
    return Array.from({ length: count }, () => this.create());
  }
}
```

#### API Response Mocks
```typescript
class APIMocker {
  static mockProductsResponse(products: Product[]): ProductsResponse {
    return {
      products,
      total: products.length,
      page: 1,
      limit: 20,
      filters: this.getDefaultFilters()
    };
  }

  static mockSearchResponse(query: string, products: Product[]): SearchResponse {
    return {
      products,
      facets: this.generateFacets(products),
      total_results: products.length,
      search_time_ms: faker.number.int({ min: 10, max: 500 })
    };
  }
}
```

---

## 🎯 Performance Monitoring

### Performance Metrics

#### API Performance Tracking
```typescript
interface APIPerformanceMetrics {
  endpoint: string;
  method: string;
  response_time_ms: number;
  status_code: number;
  payload_size_bytes: number;
  user_id?: string;
  session_id: string;
  timestamp: Date;
}

interface DatabaseQueryMetrics {
  query_type: 'select' | 'insert' | 'update' | 'delete';
  table_name: string;
  execution_time_ms: number;
  rows_affected: number;
  query_complexity: 'simple' | 'moderate' | 'complex';
  timestamp: Date;
}
```

#### Frontend Performance Integration
```typescript
interface PerformanceMonitoring {
  trackAPICall: (endpoint: string, duration: number) => void;
  trackComponentRender: (component: string, renderTime: number) => void;
  trackUserInteraction: (action: string, element: string) => void;
  trackError: (error: Error, context: string) => void;
}

// Performance tracking implementation
const performanceTracker: PerformanceMonitoring = {
  trackAPICall: (endpoint, duration) => {
    // Send to analytics service
    analytics.track('api_call', {
      endpoint,
      duration,
      timestamp: new Date()
    });
  },
  // ... other implementations
};
```

---

## 📈 Business Intelligence

### Analytics Data Models

#### Sales Analytics
```typescript
interface SalesMetrics {
  total_revenue: number;
  order_count: number;
  average_order_value: number;
  conversion_rate: number;
  top_selling_products: ProductSalesData[];
  revenue_by_category: CategoryRevenue[];
  customer_acquisition_cost: number;
  customer_lifetime_value: number;
}

interface ProductSalesData {
  product_id: string;
  product_name: string;
  units_sold: number;
  revenue: number;
  profit_margin: number;
  growth_rate: number;
}
```

#### Customer Analytics
```typescript
interface CustomerSegment {
  segment_id: string;
  segment_name: string;
  customer_count: number;
  avg_order_value: number;
  purchase_frequency: number;
  churn_rate: number;
  characteristics: SegmentCharacteristics;
}

interface UserBehaviorMetrics {
  user_id: string;
  session_count: number;
  total_page_views: number;
  avg_session_duration: number;
  bounce_rate: number;
  cart_abandonment_rate: number;
  purchase_history: PurchaseHistory[];
}
```

---

*Last Updated: June 18, 2025*  
*API Documentation Version: 1.0.0*  
*Database Schema Version: 1.0.0*  
*Integration Status: Development Ready* ✅