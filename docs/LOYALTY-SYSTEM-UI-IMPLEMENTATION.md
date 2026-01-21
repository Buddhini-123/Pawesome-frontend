# Loyalty System UI/UX Implementation Plan

**Project:** Pawesome E-commerce Frontend
**System:** React 19 + TypeScript
**Date:** January 22, 2026
**Status:** Ready for Implementation

---

## **Executive Summary**

Comprehensive Loyalty System UI enhancement delivering:
1. **Points Expiry Notice** - Clear communication of point expiration policy
2. **Birthday Discount** - Automatic 10% discount on customer birthdays
3. **Points Earned Preview** - Transparent points calculation in checkout
4. **Admin Loyalty Visibility** - Customer loyalty data in admin panel

**Total Implementation Complexity:** 18 points → Broken into 3 PRBs (5, 8, 6 points)

---

## **1. Screens/Components**

### **1.1 Loyalty Dashboard Enhancement** (PRB-003)

**Component:** `src/components/loyalty/LoyaltyDashboard.tsx`

**New Element:** Points Expiry Notice Banner

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.15 }}
  className="bg-coral-red/10 border-l-4 border-coral-red rounded-2xl p-6 shadow-lg"
>
  <div className="flex items-center space-x-4">
    <AlertCircle className="h-6 w-6 text-coral-red flex-shrink-0" />
    <div>
      <h3 className="font-fredoka font-semibold text-charcoal mb-1">
        Points Expiration Notice
      </h3>
      <p className="text-sm text-medium-gray font-fredoka">
        All points expire on <span className="font-bold text-coral-red">Dec 31, 11:59 PM</span>
      </p>
    </div>
  </div>
</motion.div>
```

**Features:**
- Positioned after loyalty card display
- Warning theme styling (coral-red accent)
- AlertCircle icon from lucide-react
- Framer Motion animation (delay: 0.15s)
- Responsive design

---

### **1.2 Checkout Breakdown Component** (PRB-004)

**Component:** `src/components/pages/Shop/Checkout.tsx`

**New Features:**
1. Birthday Discount Detection & Application
2. Points Earned Preview Calculation

**Birthday Discount Implementation:**

```tsx
// Birthday Detection Logic
const isTodayBirthday = (birthDate: Date | undefined): boolean => {
  if (!birthDate) return false;

  const today = new Date();
  const birth = new Date(birthDate);

  return (
    today.getMonth() === birth.getMonth() &&
    today.getDate() === birth.getDate()
  );
};

// State Management
const [birthdayDiscount, setBirthdayDiscount] = useState(0);
const [pointsToEarn, setPointsToEarn] = useState(0);

// Calculate Birthday Discount
useEffect(() => {
  if (user && isTodayBirthday(user.birthDate)) {
    setBirthdayDiscount(subscriptionSubtotal * 0.1); // 10% discount
  } else {
    setBirthdayDiscount(0);
  }
}, [user, subscriptionSubtotal]);

// Calculate Points Earned
useEffect(() => {
  const totalAfterDiscounts =
    subscriptionSubtotal -
    couponDiscount -
    birthdayDiscount -
    loyaltyRedemption.value;

  setPointsToEarn(Math.floor(totalAfterDiscounts / 100)); // 100 LKR = 1 point
}, [subscriptionSubtotal, couponDiscount, birthdayDiscount, loyaltyRedemption]);
```

**Pricing Breakdown Display:**

```tsx
{/* Birthday Discount Line Item */}
{birthdayDiscount > 0 && (
  <div className="flex justify-between items-center py-2">
    <div className="flex items-center space-x-2">
      <span className="text-2xl">🎂</span>
      <span className="text-charcoal font-fredoka">
        Birthday Discount (10%)
      </span>
    </div>
    <span className="text-mint-green font-fredoka font-bold">
      -{currentCurrency} {safeDisplayPrice(birthdayDiscount)}
    </span>
  </div>
)}

{/* Points Earned Preview */}
<div className="mt-4 p-4 bg-primary-blue/10 rounded-xl">
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <Trophy className="h-5 w-5 text-primary-blue" />
      <span className="font-fredoka text-charcoal">
        Points You'll Earn
      </span>
    </div>
    <span className="font-fredoka font-bold text-primary-blue text-lg">
      +{pointsToEarn} points
    </span>
  </div>
  <p className="text-xs text-medium-gray font-fredoka mt-1">
    Earn 1 point for every 100 LKR spent
  </p>
</div>
```

**Features:**
- Automatic birthday detection (month/day comparison)
- 10% discount on subtotal
- Birthday celebration icon (🎂)
- Points preview with Trophy icon
- Clear calculation messaging
- Responsive styling

---

### **1.3 Admin Customers Screen** (PRB-005)

**Component:** `src/components/admin/Users/UserList.tsx`

**New Columns:**
1. Loyalty Card Number
2. Points Balance
3. Tier Badge

**Implementation:**

```tsx
// State Management
const [loyaltyData, setLoyaltyData] = useState<Map<string, LoyaltyCard | null>>(new Map());
const [loyaltyLoading, setLoyaltyLoading] = useState(true);

// Fetch Loyalty Data
useEffect(() => {
  const fetchLoyaltyData = async () => {
    setLoyaltyLoading(true);
    const dataMap = new Map<string, LoyaltyCard | null>();

    for (const user of users) {
      try {
        const loyaltyCard = await loyaltyService.getLoyaltyCard(user.id);
        dataMap.set(user.id, loyaltyCard);
      } catch (error) {
        dataMap.set(user.id, null);
      }
    }

    setLoyaltyData(dataMap);
    setLoyaltyLoading(false);
  };

  if (users.length > 0) {
    fetchLoyaltyData();
  }
}, [users]);

// Tier Badge Component
const getTierBadge = (tier: LoyaltyTier | undefined) => {
  if (!tier) return '-';

  const colors = {
    BRONZE: 'bg-orange-100 text-orange-800',
    SILVER: 'bg-gray-100 text-gray-800',
    GOLD: 'bg-yellow-100 text-yellow-800',
    PLATINUM: 'bg-purple-100 text-purple-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-fredoka font-semibold ${colors[tier]}`}>
      {tier}
    </span>
  );
};

// Table Columns
const columns = [
  {
    key: 'name',
    label: 'Name',
    sortable: true
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true
  },
  {
    key: 'loyaltyCard',
    label: 'Loyalty Card',
    render: (user: User) => {
      const loyalty = loyaltyData.get(user.id);
      return loyalty ? loyalty.cardNumber : 'No Card';
    }
  },
  {
    key: 'points',
    label: 'Points',
    sortable: true,
    render: (user: User) => {
      const loyalty = loyaltyData.get(user.id);
      return loyalty ? loyalty.points.toLocaleString() : '-';
    }
  },
  {
    key: 'tier',
    label: 'Tier',
    render: (user: User) => {
      const loyalty = loyaltyData.get(user.id);
      return getTierBadge(loyalty?.tier);
    }
  },
  // ... other columns
];
```

**Features:**
- Loyalty card number display
- Points with thousand separators (1,250)
- Color-coded tier badges
- Sortable points column
- Loading states
- "No Card" empty state
- Error handling

---

## **2. TypeScript Interfaces**

### **2.1 PricingBreakdown Interface**

**File:** `src/types/loyalty.ts`

```typescript
/**
 * Comprehensive pricing breakdown for checkout
 * Includes all discount types and final calculations
 */
export interface PricingBreakdown {
  /** Order subtotal before any discounts */
  subtotal: number;

  /** Birthday discount amount (10% if applicable) */
  birthdayDiscount: number;

  /** Loyalty points redemption discount */
  loyaltyDiscount: number;

  /** Coupon/promo code discount */
  couponDiscount: number;

  /** Tax amount */
  tax: number;

  /** Shipping cost */
  shipping: number;

  /** Final total after all discounts and additions */
  total: number;

  /** Number of loyalty points customer will earn */
  pointsEarned: number;
}
```

---

### **2.2 CustomerAdminRow Interface**

**File:** `src/types/loyalty.ts`

```typescript
/**
 * Customer data row for admin customer management table
 * Includes loyalty program information
 */
export interface CustomerAdminRow {
  /** Unique user identifier */
  id: string;

  /** Customer full name */
  name: string;

  /** Customer email address */
  email: string;

  /** Customer phone number (optional) */
  phone?: string;

  /** Loyalty card number (e.g., "PAW1234567890") */
  loyaltyCardNumber: string | null;

  /** Current loyalty points balance */
  points: number;

  /** Loyalty tier level */
  tier: LoyaltyTier;

  /** Total number of orders placed */
  totalOrders: number;

  /** Date of last activity/order */
  lastActivity: Date;

  /** Customer registration date */
  createdAt: Date;
}
```

---

### **2.3 LoyaltyBalance Interface (Alias)**

**File:** `src/types/loyalty.ts`

```typescript
/**
 * Simplified loyalty balance view
 * Alias for commonly used loyalty card fields
 */
export interface LoyaltyBalance {
  /** Current available points */
  currentPoints: number;

  /** Total points earned lifetime */
  totalEarned: number;

  /** Total points redeemed lifetime */
  totalRedeemed: number;

  /** Current loyalty tier */
  tier: LoyaltyTier;

  /** Points needed to reach next tier */
  pointsToNextTier?: number;
}
```

---

### **2.4 LoyaltyLedgerItem Interface (Already Exists)**

**File:** `src/types/loyalty.ts`

```typescript
/**
 * Individual loyalty points transaction
 * NOTE: This interface already exists as PointTransaction
 */
export type LoyaltyLedgerItem = PointTransaction;

// Existing PointTransaction interface:
export interface PointTransaction {
  id: string;
  loyaltyCardId: string;
  type: 'earned' | 'redeemed' | 'expired' | 'donated' | 'bonus';
  points: number;
  description: string;
  orderId?: string;
  createdAt: Date;
  expiresAt?: Date;
  balance: number;
}
```

---

## **3. API Integration Plan**

### **3.1 Current Infrastructure** ✅

**Service Layer:** `src/services/loyalty.service.ts`

**Available Methods:**
```typescript
// Get loyalty card for user
getLoyaltyCard(userId: string): Promise<LoyaltyCard | null>

// Get points transaction history
getPointsHistory(loyaltyCardId: string): Promise<PointTransaction[]>

// Award points for order
awardPoints(
  loyaltyCardId: string,
  orderId: string,
  amount: number,
  description: string
): Promise<void>

// Redeem points
redeemPoints(
  loyaltyCardId: string,
  points: number,
  orderId: string
): Promise<{ success: boolean; value: number }>

// Calculate points for amount
calculatePoints(
  amount: number,
  tier: LoyaltyTier,
  isPromotion?: boolean
): number

// Award birthday bonus
awardBirthdayBonus(userId: string, user: User): Promise<void>
```

---

### **3.2 API Integration Examples**

#### **Example 1: Fetch Loyalty Data for Dashboard**

```typescript
import { useLoyalty } from '../../hooks/useLoyalty';

const LoyaltyDashboard: React.FC = () => {
  const {
    loyaltyCard,      // Current loyalty card
    pointsHistory,    // Transaction history
    badges,           // Earned badges
    tierBenefits,     // Current tier benefits
    isLoading,        // Loading state
    refreshLoyaltyData  // Refresh function
  } = useLoyalty();

  // Data automatically loaded when user is authenticated
  // Manual refresh:
  await refreshLoyaltyData();
};
```

---

#### **Example 2: Calculate Points in Checkout**

```typescript
import { LOYALTY_CONSTANTS } from '../types/loyalty';
import { useLoyalty } from '../hooks/useLoyalty';

const Checkout: React.FC = () => {
  const { calculatePointsForAmount } = useLoyalty();

  // Method 1: Using context helper
  const pointsEarned = calculatePointsForAmount(finalTotal);

  // Method 2: Direct calculation
  const pointsEarned = Math.floor(finalTotal * LOYALTY_CONSTANTS.POINTS_PER_LKR);
  // finalTotal in LKR, POINTS_PER_LKR = 0.1 (100 LKR = 1 point)
};
```

---

#### **Example 3: Award Points After Order**

```typescript
import { useLoyalty } from '../hooks/useLoyalty';

const OrderConfirmation: React.FC = () => {
  const { awardPointsForOrder } = useLoyalty();

  useEffect(() => {
    const handlePointsAward = async () => {
      await awardPointsForOrder(
        orderId,
        orderTotal,
        `Order #${orderNumber} - Purchase reward`
      );
    };

    handlePointsAward();
  }, [orderId]);
};
```

---

#### **Example 4: Admin - Fetch All Customer Loyalty Data**

```typescript
import { loyaltyService } from '../services/loyalty.service';
import { LoyaltyCard } from '../types/loyalty';

const AdminUserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loyaltyData, setLoyaltyData] = useState<Map<string, LoyaltyCard | null>>(new Map());

  useEffect(() => {
    const fetchAllLoyaltyData = async () => {
      const dataMap = new Map<string, LoyaltyCard | null>();

      // Fetch loyalty data for each user
      for (const user of users) {
        try {
          const card = await loyaltyService.getLoyaltyCard(user.id);
          dataMap.set(user.id, card);
        } catch (error) {
          console.error(`Failed to fetch loyalty for user ${user.id}:`, error);
          dataMap.set(user.id, null);
        }
      }

      setLoyaltyData(dataMap);
    };

    if (users.length > 0) {
      fetchAllLoyaltyData();
    }
  }, [users]);

  // Access loyalty data in table render
  const renderPointsCell = (user: User) => {
    const loyalty = loyaltyData.get(user.id);
    return loyalty ? loyalty.points.toLocaleString() : '-';
  };
};
```

---

### **3.3 State Management Approach**

**Recommended:** React Context (Already Implemented)

**Why:**
- ✅ Already in place (`LoyaltyContext`)
- ✅ Provides global loyalty state
- ✅ Handles authentication integration
- ✅ Automatic data refresh
- ✅ Built-in loading/error states

**Alternative Approaches:**

**React Query (Future Enhancement):**
```typescript
import { useQuery } from '@tanstack/react-query';

const useLoyaltyCard = (userId: string) => {
  return useQuery({
    queryKey: ['loyaltyCard', userId],
    queryFn: () => loyaltyService.getLoyaltyCard(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

**Zustand (Future Enhancement):**
```typescript
import create from 'zustand';

const useLoyaltyStore = create((set) => ({
  loyaltyCard: null,
  pointsHistory: [],
  fetchLoyaltyCard: async (userId) => {
    const card = await loyaltyService.getLoyaltyCard(userId);
    set({ loyaltyCard: card });
  },
}));
```

---

## **4. UI Validation Rules & Empty States**

### **4.1 Loyalty Dashboard**

**Validation Rules:**
- ✅ Only display if user has loyalty card (`loyaltyCard !== null`)
- ✅ Handle loading state during initial data fetch
- ✅ Validate points are non-negative numbers
- ✅ Validate tier is one of valid enum values

**Empty States:**
```tsx
// No Loyalty Card
{!loyaltyCard && !isLoading && (
  <div className="text-center py-12">
    <Trophy className="h-16 w-16 text-light-gray mx-auto mb-4" />
    <h3 className="text-xl font-fredoka font-bold text-charcoal mb-2">
      Join Paw Rewards
    </h3>
    <p className="text-medium-gray font-fredoka mb-6">
      Start earning points with every purchase!
    </p>
    <button
      onClick={registerLoyaltyCard}
      className="bg-primary-blue text-white px-6 py-3 rounded-xl font-fredoka font-semibold hover:bg-primary-blue/90"
    >
      Sign Up Now
    </button>
  </div>
)}

// Loading State
{isLoading && (
  <div className="text-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-blue border-t-transparent mx-auto"></div>
    <p className="text-medium-gray font-fredoka mt-4">Loading loyalty data...</p>
  </div>
)}

// Error State
{error && (
  <div className="bg-coral-red/10 border-l-4 border-coral-red rounded-xl p-6">
    <p className="text-coral-red font-fredoka">{error}</p>
    <button
      onClick={refreshLoyaltyData}
      className="mt-4 text-primary-blue font-fredoka font-semibold"
    >
      Try Again
    </button>
  </div>
)}
```

---

### **4.2 Checkout Birthday Discount**

**Validation Rules:**
- ✅ Only show discount if `user.birthDate` exists
- ✅ Only apply discount if today matches birthday (month/day)
- ✅ Discount calculation: `subtotal * 0.1` (10%)
- ✅ Prevent stacking issues with other discounts
- ✅ Handle leap year birthdays (Feb 29)

**Empty States:**
```tsx
// No Birthday Set
{!user?.birthDate && (
  <div className="bg-soft-gray rounded-xl p-4 mb-4">
    <p className="text-sm text-medium-gray font-fredoka">
      💡 Add your birthday to your profile to receive a special 10% discount!
    </p>
  </div>
)}

// Not Birthday
{user?.birthDate && !isTodayBirthday(user.birthDate) && (
  // Don't show anything (normal checkout flow)
  null
)}

// Birthday! 🎂
{birthdayDiscount > 0 && (
  <div className="bg-sunny-yellow/10 border-2 border-sunny-yellow rounded-xl p-4 mb-4">
    <div className="flex items-center space-x-3">
      <span className="text-3xl">🎂</span>
      <div>
        <h4 className="font-fredoka font-bold text-charcoal">
          Happy Birthday!
        </h4>
        <p className="text-sm text-medium-gray font-fredoka">
          Enjoy your special 10% birthday discount today!
        </p>
      </div>
    </div>
  </div>
)}
```

---

### **4.3 Checkout Points Preview**

**Validation Rules:**
- ✅ Calculate after ALL discounts applied
- ✅ Formula: `Math.floor(finalTotal / 100)`
- ✅ Minimum 0 points (never negative)
- ✅ Display only if user has loyalty card

**Empty States:**
```tsx
// No Loyalty Card
{!user?.loyaltyCardId && (
  <div className="bg-primary-blue/10 rounded-xl p-4 mt-4">
    <p className="text-sm text-charcoal font-fredoka mb-2">
      <strong>Join Paw Rewards</strong> to earn points with this order!
    </p>
    <p className="text-xs text-medium-gray font-fredoka">
      You could earn {Math.floor(finalTotal / 100)} points with this purchase.
    </p>
    <button className="text-primary-blue font-fredoka font-semibold text-sm mt-2">
      Sign Up →
    </button>
  </div>
)}

// Has Loyalty Card
{user?.loyaltyCardId && pointsToEarn > 0 && (
  <div className="bg-mint-green/10 rounded-xl p-4 mt-4">
    <div className="flex items-center justify-between">
      <span className="font-fredoka text-charcoal">Points You'll Earn</span>
      <span className="font-fredoka font-bold text-mint-green text-lg">
        +{pointsToEarn} points
      </span>
    </div>
  </div>
)}

// Zero Points (Small Order)
{user?.loyaltyCardId && pointsToEarn === 0 && (
  <div className="bg-soft-gray rounded-xl p-3 mt-4">
    <p className="text-xs text-medium-gray font-fredoka">
      Orders over 100 LKR earn loyalty points
    </p>
  </div>
)}
```

---

### **4.4 Admin Customers Table**

**Validation Rules:**
- ✅ Handle users without loyalty cards gracefully
- ✅ Format points with thousand separators
- ✅ Validate tier is valid enum value
- ✅ Handle failed loyalty data fetch per user

**Empty States:**
```tsx
// No Loyalty Card
{!loyaltyData.get(user.id) && (
  <span className="text-medium-gray font-fredoka text-sm">No Card</span>
)}

// Loading Loyalty Data
{loyaltyLoading && (
  <div className="flex items-center space-x-2">
    <div className="w-4 h-4 border-2 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
    <span className="text-xs text-medium-gray">Loading...</span>
  </div>
)}

// Failed to Load
{loyaltyError && (
  <span className="text-coral-red font-fredoka text-sm">Error</span>
)}

// No Users in Table
{users.length === 0 && (
  <div className="text-center py-12">
    <Users className="h-16 w-16 text-light-gray mx-auto mb-4" />
    <p className="text-medium-gray font-fredoka">No customers found</p>
  </div>
)}
```

---

## **5. Acceptance Criteria Checklists**

### **5.1 PRB-003: Loyalty Dashboard Expiry Notice**

**Expiry Banner:**
- [ ] Banner displays after loyalty card component
- [ ] Text reads: "All points expire on Dec 31, 11:59 PM"
- [ ] Warning theme styling (coral-red accent)
- [ ] AlertCircle icon from lucide-react included
- [ ] Framer Motion fade-in animation (delay: 0.15s)
- [ ] Banner only shown if user has loyalty card
- [ ] Responsive design (mobile/tablet/desktop)

**TypeScript Interfaces:**
- [ ] `PricingBreakdown` interface created with all fields
- [ ] `CustomerAdminRow` interface created with all fields
- [ ] Interfaces exported from `types/loyalty.ts`
- [ ] JSDoc comments added to each interface
- [ ] TypeScript compiles with no errors
- [ ] Interfaces properly typed (no `any` types)

---

### **5.2 PRB-004: Checkout Birthday Discount & Points Preview**

**Birthday Discount:**
- [ ] Birthday detected when today matches `user.birthDate` (month/day only)
- [ ] 10% discount applied to order subtotal
- [ ] Discount shown as separate line item in pricing breakdown
- [ ] Birthday celebration message displayed ("Happy Birthday!")
- [ ] Birthday icon (🎂) included in discount line
- [ ] Discount integrates correctly with existing coupon/loyalty discounts
- [ ] No discount if `user.birthDate` is null/undefined
- [ ] Date comparison ignores year and time
- [ ] Leap year birthdays handled correctly (Feb 29)

**Points Earned Preview:**
- [ ] Points calculated as: `Math.floor(finalTotal / 100)`
- [ ] Uses `LOYALTY_CONSTANTS.POINTS_PER_LKR` for accuracy
- [ ] Preview displayed in Order Summary section
- [ ] Text: "You will earn X points with this order"
- [ ] Trophy icon included with points preview
- [ ] Calculation includes all discounts (birthday, coupon, loyalty)
- [ ] Points displayed only if user has loyalty card
- [ ] Zero points handled gracefully (small orders)
- [ ] Preview updates dynamically as cart changes

**Pricing Integration:**
- [ ] Total calculation includes birthday discount
- [ ] All discounts shown as separate line items
- [ ] No calculation errors or rounding issues
- [ ] Pricing breakdown clear and easy to understand
- [ ] No layout shifts when discount applied/removed

**UI/UX:**
- [ ] No layout shift when birthday discount applied
- [ ] Loading states handled gracefully
- [ ] Error handling if birthday calculation fails
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessible (keyboard navigation, screen readers)

---

### **5.3 PRB-005: Admin Customers with Loyalty Points**

**Table Columns:**
- [ ] Loyalty Card Number column added
- [ ] Points Balance column added (formatted with commas)
- [ ] Tier Badge column added
- [ ] Columns display correctly for all users
- [ ] Table sortable by Points column
- [ ] Columns responsive on different screen sizes

**Data Fetching:**
- [ ] Loyalty data fetched for all users on mount
- [ ] Async data fetch handled with async/await
- [ ] Loading state displayed during fetch
- [ ] Error handling for failed fetches
- [ ] No performance issues with many users
- [ ] Data cached appropriately (no unnecessary refetches)

**Tier Badges:**
- [ ] Bronze tier badge: orange/brown colors
- [ ] Silver tier badge: gray/silver colors
- [ ] Gold tier badge: yellow/gold colors
- [ ] Platinum tier badge: purple/indigo colors
- [ ] Badge styling consistent with design system
- [ ] Tier text readable and clear

**Empty States:**
- [ ] Users without loyalty cards show "No Card"
- [ ] Missing points show "-"
- [ ] Table displays correctly when no users have cards
- [ ] Graceful handling if loyalty service unavailable
- [ ] Loading spinner during data fetch

**Validation:**
- [ ] Points displayed are never negative
- [ ] Only valid tier values shown (BRONZE/SILVER/GOLD/PLATINUM)
- [ ] Card numbers displayed in consistent format
- [ ] Thousand separators in points (1,250 not 1250)

---

## **6. Implementation Timeline**

### **Phase 1: PRB-003** (5 complexity points)
**Duration:** 2-3 hours
**Tasks:**
1. Add expiry notice banner to LoyaltyDashboard
2. Create TypeScript interfaces
3. Test, document, commit, push

**Deliverables:**
- Enhanced Loyalty Dashboard with expiry banner
- `PricingBreakdown` interface
- `CustomerAdminRow` interface

---

### **Phase 2: PRB-004** (8 complexity points)
**Duration:** 4-6 hours
**Tasks:**
1. Implement birthday detection logic
2. Add birthday discount calculation
3. Create points earned preview
4. Integrate with existing checkout pricing
5. Test edge cases (leap year, no birthday, etc.)
6. Document, commit, push

**Deliverables:**
- Birthday discount feature
- Points earned preview
- Enhanced checkout pricing breakdown

---

### **Phase 3: PRB-005** (6 complexity points)
**Duration:** 3-4 hours
**Tasks:**
1. Enhance UserList component
2. Implement loyalty data fetching
3. Add loyalty columns to table
4. Create tier badge component
5. Test sorting and data display
6. Document, commit, push

**Deliverables:**
- Admin customer table with loyalty columns
- Tier badge styling
- Sortable points column

---

## **7. Testing Strategy**

### **Manual Testing Checklist**

**Loyalty Dashboard:**
- [ ] Banner displays when user has loyalty card
- [ ] Banner not shown when user has no loyalty card
- [ ] Animation plays smoothly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Text is clear and readable

**Checkout Birthday Discount:**
- [ ] Test with user birthday = today → discount applied
- [ ] Test with user birthday ≠ today → no discount
- [ ] Test with no birthday set → no discount
- [ ] Test Feb 29 birthday on non-leap year
- [ ] Test discount stacking with coupon
- [ ] Test points calculation accuracy
- [ ] Test with orders < 100 LKR (0 points)
- [ ] Test with orders > 100 LKR (points earned)

**Admin Customers:**
- [ ] Table loads all users correctly
- [ ] Loyalty data fetches without errors
- [ ] Users without cards show "No Card"
- [ ] Points formatted with thousand separators
- [ ] Tier badges display correct colors
- [ ] Sorting by points works correctly
- [ ] Loading state displays during fetch
- [ ] Error handling works when fetch fails

---

### **Automated Testing (Future Enhancement)**

```typescript
// Birthday Discount Logic Test
describe('Birthday Discount', () => {
  it('should apply 10% discount when today is user birthday', () => {
    const user = { birthDate: new Date() }; // Today
    const subtotal = 1000;

    const discount = calculateBirthdayDiscount(user, subtotal);
    expect(discount).toBe(100); // 10% of 1000
  });

  it('should not apply discount when not birthday', () => {
    const user = { birthDate: new Date('2000-06-15') }; // Not today
    const subtotal = 1000;

    const discount = calculateBirthdayDiscount(user, subtotal);
    expect(discount).toBe(0);
  });
});

// Points Calculation Test
describe('Points Earned Preview', () => {
  it('should calculate 1 point per 100 LKR', () => {
    const total = 2500;
    const points = calculatePointsEarned(total);
    expect(points).toBe(25); // 2500 / 100 = 25
  });

  it('should round down partial points', () => {
    const total = 2550;
    const points = calculatePointsEarned(total);
    expect(points).toBe(25); // Math.floor(2550 / 100) = 25
  });
});
```

---

## **8. Error Handling & Edge Cases**

### **Birthday Discount Edge Cases**

**Leap Year Birthday (Feb 29):**
```typescript
const isTodayBirthday = (birthDate: Date | undefined): boolean => {
  if (!birthDate) return false;

  const today = new Date();
  const birth = new Date(birthDate);

  // Handle Feb 29 birthdays on non-leap years
  if (birth.getMonth() === 1 && birth.getDate() === 29) {
    // If today is Feb 28 in non-leap year
    if (!isLeapYear(today.getFullYear()) &&
        today.getMonth() === 1 &&
        today.getDate() === 28) {
      return true;
    }
  }

  return (
    today.getMonth() === birth.getMonth() &&
    today.getDate() === birth.getDate()
  );
};

const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};
```

**Invalid Date Handling:**
```typescript
try {
  const birthDate = new Date(user.birthDate);
  if (isNaN(birthDate.getTime())) {
    // Invalid date
    return 0; // No discount
  }
  // Proceed with calculation
} catch (error) {
  console.error('Invalid birth date:', error);
  return 0; // No discount
}
```

---

### **Points Calculation Edge Cases**

**Negative Total (Should Never Happen):**
```typescript
const calculatePointsEarned = (total: number): number => {
  if (total < 0) {
    console.warn('Negative order total detected');
    return 0;
  }
  return Math.floor(total / 100);
};
```

**Floating Point Precision:**
```typescript
// Always use Math.floor to prevent floating point issues
const points = Math.floor(total / 100); // ✅ Correct
// NOT: Math.round(total / 100) - could round up incorrectly
```

---

### **Admin Data Fetching Edge Cases**

**Network Timeout:**
```typescript
const fetchLoyaltyData = async () => {
  try {
    const card = await Promise.race([
      loyaltyService.getLoyaltyCard(userId),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
      )
    ]);
    return card;
  } catch (error) {
    if (error.message === 'Timeout') {
      // Handle timeout gracefully
      return null;
    }
    throw error;
  }
};
```

**Partial Data Fetch Failure:**
```typescript
// Continue loading other users even if one fails
for (const user of users) {
  try {
    const card = await loyaltyService.getLoyaltyCard(user.id);
    dataMap.set(user.id, card);
  } catch (error) {
    console.error(`Failed to load loyalty for user ${user.id}:`, error);
    dataMap.set(user.id, null); // Continue with null value
  }
}
```

---

## **9. Performance Considerations**

### **Loyalty Data Caching**

```typescript
// Cache loyalty data for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const cachedLoyaltyData = new Map<string, {
  data: LoyaltyCard | null;
  timestamp: number;
}>();

const getCachedLoyaltyCard = async (userId: string): Promise<LoyaltyCard | null> => {
  const cached = cachedLoyaltyData.get(userId);

  if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
    return cached.data; // Return cached data
  }

  // Fetch fresh data
  const freshData = await loyaltyService.getLoyaltyCard(userId);
  cachedLoyaltyData.set(userId, {
    data: freshData,
    timestamp: Date.now()
  });

  return freshData;
};
```

### **Batch Fetching for Admin**

```typescript
// Instead of individual requests, batch fetch all loyalty cards
const fetchAllLoyaltyCards = async (userIds: string[]): Promise<Map<string, LoyaltyCard | null>> => {
  // Future API enhancement: single endpoint for multiple users
  const response = await api.post('/loyalty/batch', { userIds });
  return new Map(response.data.map(card => [card.userId, card]));
};
```

---

## **10. Deployment Checklist**

- [ ] All PRBs completed and tested
- [ ] TypeScript compilation passes with no errors
- [ ] All unit tests passing (if implemented)
- [ ] Manual testing completed on all screens
- [ ] Browser compatibility tested (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness verified
- [ ] Accessibility checked (keyboard navigation, screen readers)
- [ ] Performance profiling completed (no significant slowdowns)
- [ ] Error logging configured for production
- [ ] Documentation updated (this file + inline comments)
- [ ] Version bumped appropriately (0.1.2 → 0.3.0)
- [ ] CHANGELOG.md updated with all changes
- [ ] Git commits follow conventional commit format
- [ ] Changes pushed to remote repository
- [ ] Pull request created (if required)
- [ ] Code review completed (if required)
- [ ] Staging environment tested
- [ ] Production deployment approved

---

## **11. Future Enhancements**

### **Priority 1 (High Impact)**
- Real backend API integration (replace mock data)
- Points expiry tracking per transaction
- Automated birthday email notifications
- Admin bulk loyalty operations (award/revoke points)

### **Priority 2 (Medium Impact)**
- Points redemption in checkout (not just viewing)
- Loyalty tier upgrade notifications
- Points transfer between users
- Referral program integration

### **Priority 3 (Nice to Have)**
- Points history export (CSV, PDF)
- Advanced admin analytics (points trends, tier distribution)
- Gamification (badges, achievements, challenges)
- Social sharing of loyalty milestones

---

## **Contact & Support**

**Documentation:** This file
**PRB Files:** `/prbs/ready/PRB-003.yaml`, `/prbs/ready/PRB-004.yaml`, `/prbs/ready/PRB-005.yaml`
**Implementation Timeline:** 3 PRBs × 2-6 hours = 9-13 hours total development time

**Ready to Execute!** 🚀

All PRBs are fully documented with complete context, implementation details, acceptance criteria, and validation rules. Each PRB can be executed independently by a @Developer specialist.

---

**End of Implementation Plan**
