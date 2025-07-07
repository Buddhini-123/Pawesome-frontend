# 🧩 Pawsome Component Guide

## Table of Contents
1. [Component Architecture](#component-architecture)
2. [Common Components](#common-components)
3. [Page Components](#page-components)
4. [Feature Components](#feature-components)
5. [Effect Components](#effect-components)
6. [Context Providers](#context-providers)
7. [Custom Hooks](#custom-hooks)
8. [Component Best Practices](#component-best-practices)

---

## Component Architecture

### Directory Structure
```
src/
├── components/
│   ├── common/          # Shared components
│   ├── pages/           # Page-level components
│   ├── effects/         # Animation & visual effects
│   ├── deals/           # Deal-specific components
│   ├── FAQ/             # FAQ components
│   ├── banners/         # Banner components
│   ├── carousels/       # Carousel components
│   └── ui/              # UI utility components
├── contexts/            # React Context providers
├── hooks/               # Custom React hooks
└── types/               # TypeScript type definitions
```

---

## Common Components

### Header Component
**Location**: `src/components/common/Header.tsx`

**Purpose**: Main navigation header with responsive design

**Props**: None (uses context)

**Usage**:
```jsx
import Header from './components/common/Header';

<Header />
```

**Features**:
- Mobile hamburger menu
- Desktop navigation bar
- Search functionality
- Cart indicator with count
- User authentication menu
- Responsive breakpoint at 768px

**State Management**:
- `isMobile`: Tracks screen size for responsive rendering
- `showMobileMenu`: Controls mobile menu visibility
- `showMobileSearch`: Controls mobile search bar
- `showUserMenu`: Controls user dropdown
- `searchQuery`: Search input value

---

### Footer Component
**Location**: `src/components/common/Footer/Footer.tsx`

**Purpose**: Site footer with multi-column layout

**Components**:
- `FooterColumns.tsx`: Column layout manager
- `FooterColumn.tsx`: Individual column component
- `FooterExtras.tsx`: Payment methods & certifications
- `NewsletterSection.tsx`: Email subscription form

**Usage**:
```jsx
import Footer from './components/common/Footer/Footer';

<Footer />
```

---

### ProductCard Component
**Location**: `src/components/common/ProductCard.tsx`

**Purpose**: Reusable product display card

**Props**:
```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  variant?: 'default' | 'compact' | 'featured';
}
```

**Usage**:
```jsx
<ProductCard 
  product={productData}
  onAddToCart={handleAddToCart}
  variant="default"
/>
```

**Features**:
- Product image with lazy loading
- Price display with discount
- Rating stars
- Add to cart button
- Out of stock indicator
- Hover animations

---

### ErrorBoundary Component
**Location**: `src/components/common/ErrorBoundary.tsx`

**Purpose**: Catches React errors and displays fallback UI

**Props**:
```typescript
interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}
```

**Usage**:
```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## Page Components

### Home Component
**Location**: `src/components/pages/Home/HomeNew.tsx`

**Purpose**: Main landing page

**Sub-components**:
- `HeroSection.tsx`: Animated hero banner
- Service cards grid
- Feature highlights
- Category showcase

**Key Features**:
- Animated pet emojis
- Service card hover effects
- Responsive grid layout

---

### Product Page Component
**Location**: `src/components/pages/Products/ProductPage.tsx`

**Purpose**: Individual product detail view

**Sub-components**:
- `ProductGallery.tsx`: Image gallery
- `ProductDetails.tsx`: Product information
- `ProductTabs.tsx`: Description/reviews tabs
- `QuantitySelector.tsx`: Quantity input
- `ProductSidebar.tsx`: Price & actions

**Props**:
```typescript
interface ProductPageProps {
  productId: string;
}
```

---

### Cart Component
**Location**: `src/components/pages/Shop/Cart.tsx`

**Purpose**: Shopping cart page

**Features**:
- Cart item list with quantity controls
- Price calculations
- Coupon code input
- Checkout button
- Empty cart state

**Context Usage**:
```jsx
const { cart, updateQuantity, removeItem, totalPrice } = useCart();
```

---

### Checkout Component
**Location**: `src/components/pages/Shop/Checkout.tsx`

**Purpose**: Multi-step checkout process

**Steps**:
1. Shipping information
2. Payment method
3. Order review

**Form Fields**:
- Customer details
- Shipping address
- Payment selection
- Order notes

---

## Feature Components

### Subscription Component
**Location**: `src/components/pages/Features/Subscriptions.tsx`

**Purpose**: Pet subscription service page

**Features**:
- Subscription plans grid
- Frequency selector
- Product selection
- Price calculator

---

### Gift Customizer Component
**Location**: `src/components/pages/Features/GiftCustomizer.tsx`

**Purpose**: Multi-step gift box customization

**Props**: None

**Steps**:
1. Theme selection
2. Main toy selection
3. Complementary toys
4. Treats selection
5. Care products
6. Accessories
7. Greeting card

**State Management**:
```typescript
const [currentStep, setCurrentStep] = useState(1);
const [selections, setSelections] = useState<{ [key: number]: string[] }>({});
```

---

### Deals Component
**Location**: `src/components/pages/Features/Deals.tsx`

**Purpose**: Daily deals showcase

**Sub-components**:
- `DealCard.tsx`: Individual deal display
- `DealDetail.tsx`: Deal modal/page
- `DealSection.tsx`: Deals grid layout

**Features**:
- Countdown timers
- Discount calculations
- Category filtering

---

## Effect Components

### EnhancedParticleSystem
**Location**: `src/components/effects/EnhancedParticleSystem.tsx`

**Purpose**: Animated particle effects

**Props**:
```typescript
interface Props {
  intensity?: number;
  mouseInteractive?: boolean;
  particleCount?: number;
}
```

**Usage**:
```jsx
<EnhancedParticleSystem 
  intensity={1.5} 
  mouseInteractive={true} 
/>
```

---

### Loading3D Component
**Location**: `src/components/effects/Loading3D.tsx`

**Purpose**: 3D loading animation

**Features**:
- Three.js integration
- Rotating pet models
- Progress indicator

---

### StarRating Component
**Location**: `src/components/effects/StarRating/StarRating.tsx`

**Purpose**: Product rating display

**Props**:
```typescript
interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}
```

---

## Context Providers

### CartContext
**Location**: `src/contexts/CartContext.tsx`

**Purpose**: Global cart state management

**Provided Values**:
```typescript
interface CartContextType {
  cart: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
```

**Usage**:
```jsx
// In App.tsx
<CartProvider>
  <App />
</CartProvider>

// In components
import { useCart } from '../hooks/useCart';
const { cart, addItem } = useCart();
```

---

### AuthContext
**Location**: `src/contexts/AuthContext.tsx`

**Purpose**: User authentication state

**Provided Values**:
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
}
```

---

## Custom Hooks

### useCart Hook
**Location**: `src/hooks/useCart.ts`

**Purpose**: Cart context consumer

**Usage**:
```jsx
const { cart, addItem, totalPrice } = useCart();
```

---

### useAuth Hook
**Location**: `src/hooks/useAuth.ts`

**Purpose**: Auth context consumer

**Usage**:
```jsx
const { user, isAuthenticated, login, logout } = useAuth();
```

---

### useDebounce Hook
**Location**: `src/hooks/useDebounce.ts`

**Purpose**: Debounce values

**Usage**:
```jsx
const debouncedSearchTerm = useDebounce(searchTerm, 500);
```

---

### useLocalStorage Hook
**Location**: `src/hooks/useLocalStorage.ts`

**Purpose**: Persist state to localStorage

**Usage**:
```jsx
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

---

## Component Best Practices

### 1. Component Structure
```tsx
// Good component structure
const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  // 1. Hooks
  const [state, setState] = useState();
  const { contextValue } = useContext();
  
  // 2. Effects
  useEffect(() => {}, []);
  
  // 3. Handlers
  const handleClick = () => {};
  
  // 4. Render helpers
  const renderItem = () => {};
  
  // 5. Main render
  return <div>...</div>;
};
```

### 2. Props Interface
```typescript
// Always define prop types
interface ComponentProps {
  required: string;
  optional?: number;
  children?: React.ReactNode;
  onAction?: (value: string) => void;
}
```

### 3. State Management
```jsx
// Use appropriate state location
// Local state for UI-only concerns
const [isOpen, setIsOpen] = useState(false);

// Context for shared state
const { cart } = useCart();

// URL params for navigation state
const { productId } = useParams();
```

### 4. Performance Optimization
```jsx
// Memoize expensive computations
const totalPrice = useMemo(() => {
  return cart.reduce((sum, item) => sum + item.price, 0);
}, [cart]);

// Memoize callbacks
const handleSubmit = useCallback((data) => {
  // Handle submission
}, [dependency]);

// Lazy load components
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### 5. Accessibility
```jsx
// Always include ARIA labels
<button
  aria-label="Add to cart"
  aria-pressed={isInCart}
  onClick={handleAddToCart}
>
  <ShoppingCart />
</button>

// Keyboard navigation
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
```

### 6. Error Handling
```jsx
// Handle loading and error states
if (loading) return <LoadingSkeleton />;
if (error) return <ErrorMessage error={error} />;

// Try-catch for async operations
try {
  await addToCart(product);
} catch (error) {
  showError('Failed to add item to cart');
}
```

### 7. Responsive Design
```jsx
// Mobile-first approach
<div className="
  grid-cols-1 
  sm:grid-cols-2 
  md:grid-cols-3 
  lg:grid-cols-4
">
```

### 8. Testing Considerations
```jsx
// Add data-testid for testing
<button
  data-testid="add-to-cart-button"
  onClick={handleAddToCart}
>
  Add to Cart
</button>
```

---

## Component Lifecycle

### Creation Checklist
1. Define TypeScript interfaces
2. Set up component file structure
3. Import necessary dependencies
4. Implement responsive design
5. Add accessibility features
6. Include error handling
7. Write component documentation
8. Add to component exports

### Update Checklist
1. Check prop interface changes
2. Update TypeScript types
3. Test responsive behavior
4. Verify accessibility
5. Update documentation
6. Test error scenarios
7. Check performance impact

---

## Styling Patterns

### Tailwind Classes Organization
```jsx
<div className={`
  // Layout
  flex flex-col md:flex-row
  items-center justify-between
  
  // Spacing
  p-4 md:p-6 lg:p-8
  gap-4 md:gap-6
  
  // Styling
  bg-white rounded-3xl shadow-lg
  border-2 border-transparent
  
  // Typography
  font-fredoka text-charcoal
  
  // Interactions
  hover:shadow-2xl hover:border-primary-blue
  transition-all duration-300
  
  // Conditional
  ${isActive ? 'bg-primary-blue text-white' : ''}
`}>
```

### Dynamic Styling
```jsx
// Using classnames library
import cx from 'classnames';

<div className={cx(
  'base-classes',
  {
    'active-class': isActive,
    'error-class': hasError,
  },
  customClass
)}>
```

---

## Component Documentation Template

```tsx
/**
 * ComponentName
 * 
 * Purpose: Brief description of component purpose
 * 
 * Props:
 * - prop1: Description of prop1
 * - prop2: Description of prop2
 * 
 * Usage:
 * ```jsx
 * <ComponentName prop1="value" prop2={data} />
 * ```
 * 
 * Dependencies:
 * - Context: CartContext, AuthContext
 * - Hooks: useCart, useDebounce
 * 
 * Notes:
 * - Any special considerations
 * - Performance notes
 * - Accessibility features
 */
```

---

*Component Guide Version: 1.0*  
*Last Updated: January 7, 2025*  
*Maintained by: Pawsome Development Team*