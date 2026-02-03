# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Development
npm start                    # Start dev server on http://localhost:3000
npm test                     # Run test suite with Jest
npm run build               # Production build to /build directory

# Image Optimization
npm run optimize:images     # Optimize all images in public/assets
npm run analyze:images      # Analyze images without optimizing
npm run install:image-deps  # Install image optimization dependencies
```

## Architecture Overview

### Application Structure

**Entry Point & Routing**: App.tsx configures client-side routing with React Router DOM v7. The app wraps routes in a multi-layer context provider hierarchy:
1. `BrowserRouter` (routing)
2. `AuthProvider` (authentication state)
3. `CartProvider` (shopping cart state)
4. `LoyaltyProvider` (loyalty program state)
5. `ErrorBoundary` (error handling)

**Layout Conditionals**: Header/Footer are hidden on `/login` and `/admin/*` routes.

### State Management

**No Redux** - Uses Context API + Custom Hooks pattern:

- **AuthContext** (`src/contexts/AuthContext.tsx`)
  - State: user, isAuthenticated, isLoading
  - Methods: login(), register(), logout(), updateUser()
  - Persistence: localStorage keys `auth_token` and `auth_user`
  - Access via: `useAuth()` hook

- **CartContext** (`src/contexts/CartContext.tsx`)
  - State: CartItem[] with computed totalItems, totalPrice
  - Methods: addItem(), removeItem(), updateQuantity(), clearCart()
  - Persistence: localStorage key `cart`
  - Validation: Quantity limits (1-99 items)
  - Access via: `useCart()` hook

- **LoyaltyContext** (`src/contexts/LoyaltyContext.tsx`)
  - State: loyaltyCard, pointsHistory, badges, tierBenefits
  - Tier system: BRONZE → SILVER → GOLD → PLATINUM
  - Features: Points earning/redemption, birthday bonuses, referral program
  - Backend integration: `/api/loyalty/*` endpoints
  - Access via: `useLoyalty()` hook

### API Integration

**Base Service** (`src/services/api.ts`):
- Backend URL: `http://127.0.0.1:8000/api`
- Generic methods: get<T>(), post<T>(), put<T>(), delete<T>(), patch<T>()
- Auto-adds Bearer token from localStorage (`auth_token`)
- Typed responses with `ApiResponse<T>` generic

**Service Layer**:
- `auth.service.ts` - Authentication with demo accounts
- `products.service.ts` - Product catalog with filtering/sorting/pagination
- `loyalty.service.ts` - Loyalty program with hybrid localStorage + API
- `orders.service.ts` - Order creation and tracking
- `mockDb.ts` - In-memory database with localStorage persistence

**Demo Accounts**:
- User: demo@pawsome.com / demo123
- Admin: admin@pawsome.com / admin123
- Any other email / password123

### Component Organization

```
src/components/
├── /admin                  # Admin dashboard (protected by AdminProtectedRoute)
│   ├── Dashboard/, Products/, Orders/, Users/, Subscriptions/, Deals/
│   └── /ui                # Admin-specific UI components
├── /common                # Shared components (Header, Footer, ProductCard, FilterSidebar)
├── /pages                 # Full page components organized by feature
│   ├── /Home, /Categories, /Features, /Shop, /Products, /Account, /Login
├── /effects               # 3D and animation components (Three.js, Framer Motion)
├── /loyalty               # Loyalty program UI (Dashboard, Badges, Redemption)
├── /deals                 # Deal/coupon components
└── /subscriptions         # Subscription features
```

### Key Features Implementation

**Shopping Cart**:
- Persistent localStorage with corruption recovery
- Real-time total calculations
- Free shipping threshold indicator (Rs. 2000)
- Animated item removal with Framer Motion
- Quantity validation (1-99 per item)

**Authentication Flow**:
1. User submits form in Login.tsx
2. `useAuth()` hook calls `/auth/login` or `/auth/register`
3. Response includes user object + access_token
4. Both stored in localStorage
5. Protected routes via `ProtectedRoute` and `AdminProtectedRoute` components

**Product Catalog**:
- Mock data from `src/data/mockProducts.ts` (133+ products)
- Filtering: category, subcategory, brand, price range, rating, stock
- Sorting: price (asc/desc), rating, name
- Search: Full-text on name, brand, description
- Pagination with `PaginatedResponse<Product>` interface

**Subscription System**:
- Frequency options: Daily, Weekly, Monthly
- Backend integration: `/api/subscriptions` endpoints
- Schedule configuration with next delivery calculation
- Pricing with discount tracking
- Checkout integration with `state.type="subscription"`

**Loyalty Program**:
- Points earning: 1 point per Rs. 10 spent (base rate)
- Tier multipliers: BRONZE 1x → PLATINUM 1.5x
- Point redemption: 1 point = Rs. 0.10
- Birthday bonus detection
- Referral program with bonus points
- Badge achievements system
- Exclusive tier-based deals

**Checkout Flow**:
1. Address selection/entry
2. Shipping method (Standard/Express)
3. Payment method (Card/UPI/COD/Net Banking)
4. Order review with loyalty redemption slider
5. Payment processing
- Pricing calculation via `POST /api/pricing/calculate`
- Birthday discount detection from backend

### 3D Effects & Animations

**Three.js** (`@react-three/fiber`, `@react-three/drei`):
- `Advanced3DBackground.tsx` - Interactive 3D pet models
- 8 interactive pet models with mouse tracking
- 5 interactive toy objects with physics
- Click-triggered animations and celebrations
- Dynamic lighting with realistic shadows
- Environment mapping for reflections

**Framer Motion** (v12):
- Entry animations: `initial={{ opacity: 0, y: 20 }}`
- Hover effects: `whileHover={{ scale: 1.05 }}`
- Staggered lists with variants
- Exit animations with `AnimatePresence`
- Used extensively in Cart, ProductCard, Checkout, LoyaltyCards

**Particle System** (`src/components/effects/ParticleSystem.tsx`):
- 4 particle types: paw prints, hearts, sparkles, bubbles
- Physics simulation with mouse interaction
- Color palette: purple, pink, blue, green, amber
- Performance optimized with cleanup

### Data Flow Patterns

**Product Data**:
```
mockProducts.ts → ProductsService (filter/sort) → Components → UI
```

**User Data**:
```
AuthService → localStorage → AuthProvider → useAuth() → Components
```

**Cart Data**:
```
CartContext (useState) → useCart() → Components → localStorage sync
```

**Order Data**:
```
Checkout → OrdersService.createOrder() → MockDB → localStorage + state → OrderConfirmation
```

**Loyalty Data**:
```
LoyaltyService → localStorage + API → LoyaltyContext → useLoyalty() → Components
```

### Styling & Design System

**Tailwind CSS** with custom configuration:
- Custom fonts: `font-fredoka` (Fredoka), `font-nunito` (Nunito), `font-pacifico` (Pacifico)
- Color palette:
  - Primary: `primary-blue`, `vibrant-orange`, `sunny-yellow`
  - Secondary: `soft-pink`, `mint-green`, `lavender`
  - Neutrals: `warm-white`, `soft-gray`, `charcoal`, `medium-gray`
  - Legacy: `energetic-orange`, `natural-sage`, `calm-blue`, etc.
- Custom animations: `animate-bounce-slow`, `animate-float`, `animate-wiggle`, `animate-pulse-soft`
- Custom keyframes in Tailwind config
- Mobile-first responsive design

### Type Definitions

**Core Types** (`src/types/index.ts` - 500+ lines):
- `Product` - Product catalog with pricing, stock, ratings
- `CartItem` - Shopping cart items with quantity
- `User` - User accounts with roles, addresses, loyalty
- `Order` - Order tracking with status workflow
- `Subscription` - Recurring deliveries with schedule
- `LoyaltyCard` - Loyalty program with tiers and points
- `Pet` - Pet profiles with medical history and timeline
- `Deal` - Promotional deals and coupons

**Loyalty Types** (`src/types/loyalty.ts`):
- Extended system with redemption, referrals, badges
- Tier benefits with discount percentages
- Transaction history with expiry tracking

### Admin Panel

**Route**: `/admin` (protected by `AdminProtectedRoute`)
**Access**: Requires `user.role === 'admin'`
**Layout**: Nested routes under `AdminLayout`

**Sections**:
- Dashboard - Overview stats and analytics
- Products - CRUD for product catalog
- Orders - Order management and tracking
- Subscriptions - Subscription management
- Users - Customer list with loyalty data
- Deals - Coupon/deal management

### localStorage Keys

**Authentication**:
- `auth_token` - JWT bearer token
- `auth_user` - User object (JSON serialized)

**Cart**:
- `cart` - CartItem[] array

**Loyalty**:
- `loyaltyCards` - Loyalty card data
- `loyaltyTransactions` - Points transaction history

**Mock Database**:
- `mockDb_users`, `mockDb_orders`, `mockDb_subscriptions`
- `mockDb_wishlists`, `mockDb_reviews`

### Performance Optimizations

- **Debouncing**: Search input with `useDebounce()` hook
- **Lazy Images**: `LazyImage` component with intersection observer
- **Memoization**: `useMemo()` for expensive calculations
- **Optimized Cards**: `OptimizedProductCard` variant
- **Error Recovery**: Graceful localStorage corruption handling
- **3D Optimization**: Frustum culling, LOD system, material reuse

### Testing

**Demo/Test Accounts**:
- demo@pawsome.com / demo123 (regular user)
- admin@pawsome.com / admin123 (admin access)
- Any other email / password123 (auto-registers)

**Test Data**:
- 133+ products across 5 categories
- Pre-seeded demo user "Buddy" with pets and timeline
- Mock orders, subscriptions, reviews in localStorage

## Common Development Patterns

### Adding a New Feature Page

1. Create component in `src/components/pages/Features/NewFeature.tsx`
2. Add route in `src/App.tsx`: `<Route path="/new-feature" element={<NewFeature />} />`
3. Add navigation link in `src/components/common/Header.tsx`
4. Create types if needed in `src/types/`
5. Create service if API integration needed in `src/services/`
6. Add context + hook if global state needed

### Adding a New Product Category

1. Add products to `src/data/mockProducts.ts`
2. Create category page in `src/components/pages/Categories/NewCategory.tsx`
3. Add route in `src/App.tsx`
4. Update `ProductsService` to include new category
5. Add filter option in `FilterSidebar.tsx`

### Creating a New Context

1. Create context file: `src/contexts/NewContext.tsx`
2. Define state interface and methods
3. Create provider component with useState/useReducer
4. Add to provider hierarchy in `src/index.tsx`
5. Export custom hook: `export const useNew = () => useContext(NewContext)`
6. Use hook in components: `const { state, methods } = useNew()`

### Adding 3D Effects

1. Create component in `src/components/effects/`
2. Use `@react-three/fiber` Canvas wrapper
3. Import helpers from `@react-three/drei`
4. Use `useFrame()` for animation loop
5. Use `useThree()` for mouse tracking
6. Optimize with frustum culling and LOD

### Styling Components

- Use Tailwind utility classes first
- Add Framer Motion for animations
- Use custom colors from Tailwind config
- Follow mobile-first responsive pattern
- Use `font-fredoka` for branded text
- Apply custom animations: `animate-float`, `animate-bounce-slow`

## Path Aliases

TypeScript path alias configured: `@/*` maps to `src/*`

Example: `import { Product } from '@/types'`

## Technology Stack

- **Frontend**: React 19, TypeScript 4.9, React Router DOM 7
- **State**: Context API + Custom Hooks (no Redux)
- **Styling**: Tailwind CSS 3, Custom CSS
- **Animations**: Framer Motion 12, GSAP 3
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **HTTP**: Fetch API (wrapped in api.ts)
- **Icons**: Lucide React, React Icons
- **Notifications**: React Toastify
- **Build**: React Scripts 5 (Create React App)
- **Backend**: Flask/Django at `http://127.0.0.1:8000/api` (optional)

## Known Limitations

- Mock database resets on app reload (localStorage only)
- Demo mode accepts any password (except specific demo accounts)
- 3D effects require WebGL 2.0 support
- Backend API optional (falls back to mock data)
- No server-side rendering (client-side only)
