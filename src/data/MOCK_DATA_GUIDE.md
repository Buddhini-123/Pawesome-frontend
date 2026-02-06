# Mock Data Guide for Pawsome Pet Store

## Overview
This guide explains the structure and usage of mock data in the Pawsome pet store application. All data is configured for Sri Lankan market with prices in Sri Lankan Rupees (Rs.).

## Data Structure

### 1. Products (`mockProducts.ts`)

#### Product Interface
```typescript
interface Product {
  id: string;              // Unique identifier (format: category-subcategory-number)
  name: string;            // Product name
  brand: string;           // Brand name
  price: number;           // Current price in LKR
  originalPrice?: number;  // Original price (if discounted)
  image: string;           // Product image URL
  rating: number;          // Rating (1-5)
  reviews: number;         // Number of reviews
  category: string;        // Main category
  subcategory: string;     // Subcategory
  inStock: boolean;        // Stock availability
  discount?: number;       // Discount percentage
  description?: string;    // Product description
}
```

#### Categories & Product Count
- **Dogs**: 15 products
  - Subcategories: food, toys, bedding, grooming, accessories, treats, training, clothing, travel, feeding, technology
- **Cats**: 15 products
  - Subcategories: food, litter, toys, furniture, accessories, treats, feeding, grooming, health
- **Birds**: 10 products
  - Subcategories: food, cages, toys, supplements, accessories
- **Other Animals**: 12 products
  - Subcategories: food, toys, aquarium, accessories, bedding, supplements, heating, travel
- **Vet Diet**: 10 products
  - Subcategories: joint-care, heart-health, digestive-care, kidney-care, weight-management, skin-allergy, diabetes-care, senior-care, urinary-care, recovery-care

**Total Products: 62**

### 2. Subscriptions (`subscriptionProducts.ts`)

#### Subscription Plan Interface
```typescript
interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  discount: number;        // Percentage discount
  image: string;
  minOrderValue: number;   // Minimum order value in LKR
  products: string[];      // Product IDs included
  popularItems?: SubscriptionItem[];
}
```

#### Available Subscription Plans (12 total)
1. **Dog Subscriptions**
   - Pawsome Dog Food Plan (15% off)
   - Tail-Wagging Treats Box (20% off)
   - Complete Dog Care Bundle (25% off)

2. **Cat Subscriptions**
   - Purrfect Meal Plan (15% off)
   - Fresh & Clean Litter Service (20% off)
   - Complete Cat Care Kit (25% off)

3. **Bird Subscriptions**
   - Chirpy Food Club (15% off)
   - Happy Bird Bundle (20% off)

4. **Small Animals Subscriptions**
   - Small Pet Feast (15% off)
   - Aquarium Care Club (20% off)

5. **Special Subscriptions**
   - Prescription Diet Plan (10% off)
   - Multi-Pet Family Plan (30% off)

### 3. Gift Box Products (`giftBoxProducts.ts`)

#### Gift Product Categories
1. **Theme Cards** (8 options)
   - Birthday, Get Well Soon, Welcome Home, Just Because, Holiday Special, Congratulations, With Sympathy, Thank You
   - Price: Rs. 150-200

2. **Toys** 
   - Dog Toys: 8 options (Rs. 599-1599)
   - Cat Toys: 8 options (Rs. 299-1299)
   - Bird Toys: 4 options (Rs. 399-799)
   - Small Animal Toys: 4 options (Rs. 499-899)

3. **Treats** (10 options)
   - Various treats for all pet types
   - Price: Rs. 249-999

4. **Care Products** (8 options)
   - Grooming and health products
   - Price: Rs. 499-899

5. **Gift Wrap Options** (6 options)
   - Various wrapping styles
   - Price: Rs. 99-399

#### Gift Box Steps
1. Choose Theme Card (required: 1)
2. Select Main Toy (required: 1)
3. Add Extra Toys (optional: 0-3, 20% discount)
4. Select Treats (required: 1-3)
5. Add Care Products (optional: 0-2)
6. Choose Gift Wrap (required: 1)

### 4. Deals (`mockDeals.ts`)

#### Deal Types
- `buy-get-free`: Buy X Get Y Free offers
- `free-shipping`: Free shipping promotions
- `referral`: Referral discounts
- `upgrade`: Upgrade promotions
- `bundle`: Bundle deals
- `discount`: Percentage discounts

#### Deal Sections
1. **Weekly Deals**: 4 active deals
2. **Stock Up & Save**: 4 bulk buying deals
3. **Loyalty Rewards**: 4 loyalty program deals

Each deal is linked to actual product IDs for dynamic pricing and availability.

## Usage Examples

### Import All Data
```typescript
import { 
  allProducts, 
  productsByCategory, 
  subscriptionPlans, 
  giftBoxSteps,
  mockDealsData 
} from '../data';
```

### Get Products by Category
```typescript
import { productsByCategory } from '../data';

const dogProducts = productsByCategory.dogs;
const catProducts = productsByCategory.cats;
```

### Get Subscription Plans
```typescript
import { getSubscriptionsByCategory } from '../data/subscriptionProducts';

const dogSubscriptions = getSubscriptionsByCategory('dogs');
const allSubscriptions = getSubscriptionsByCategory('all');
```

### Calculate Gift Box Total
```typescript
import { calculateGiftBoxTotal, getGiftBoxSavings } from '../data/giftBoxProducts';

const selectedProducts = [...]; // Array of selected gift products
const total = calculateGiftBoxTotal(selectedProducts);
const savings = getGiftBoxSavings(total);
```

### Get Products for a Deal
```typescript
import { allProducts } from '../data';
import { mockDealsData } from '../data';

const deal = mockDealsData.sections[0].deals[0];
const dealProducts = allProducts.filter(p => deal.products.includes(p.id));
```

## Price Ranges (in LKR)
- **Economy**: Rs. 249 - Rs. 999
- **Standard**: Rs. 1,000 - Rs. 2,999
- **Premium**: Rs. 3,000 - Rs. 5,999
- **Luxury**: Rs. 6,000 - Rs. 15,999

## Key Features
1. **Real Product Images**: All products use high-quality images from Amazon or Unsplash
2. **Realistic Pricing**: Prices adjusted for Sri Lankan market
3. **Comprehensive Descriptions**: Key products include detailed descriptions
4. **Stock Management**: Products have stock status indicators
5. **Discount System**: Many products include discount percentages
6. **Rating System**: All products have ratings between 4.0-4.9 stars
7. **Review Counts**: Realistic review numbers for social proof

## Data Consistency
- All product IDs follow the pattern: `{category}-{number}` or `{category}-{subcategory}-{number}`
- All deals reference valid product IDs
- Subscription plans link to existing products
- Prices are consistent across related products
- Images are properly sized and optimized

## Extending the Data
To add new products:
1. Follow the existing ID pattern
2. Ensure category and subcategory match existing values
3. Use high-quality product images (400x400 minimum)
4. Set realistic prices in LKR
5. Add to the appropriate array in `mockProducts.ts`
6. Update filter counts if adding new subcategories

## Integration Points
- Product Service: `src/services/products.service.ts`
- Cart System: Products integrate with cart functionality
- Search: Products are searchable by name, brand, and description
- Filters: Dynamic filters based on actual product data
- Deals: Linked to real products for accurate pricing