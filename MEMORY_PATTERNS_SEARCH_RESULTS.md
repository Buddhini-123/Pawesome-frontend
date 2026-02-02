# Memory Patterns Search Results - Loyalty API Integration

**Date:** February 2, 2026
**Search Context:** API integration patterns, loyalty system implementations, React TypeScript service layer patterns
**Status:** Top 3 Most Relevant Patterns Identified

---

## Top 3 Most Relevant Memory Patterns

### Pattern #1: Backend API-First Architecture for Loyalty Systems ⭐⭐⭐ (HIGHEST RELEVANCE)

**Source:** `/docs/BACKEND-API-INTEGRATION-SUMMARY.md`
**Relevance Score:** 95/100
**Applies To:** All loyalty API endpoint implementations

#### Key Learnings:

**Core Principle:** Move business logic to backend, frontend displays data only
```typescript
// ❌ WRONG: Frontend calculates loyalty points
const pointsEarned = Math.floor(finalTotal / 100);

// ✅ CORRECT: Backend calculates, frontend displays
const response = await api.request('/pricing/calculate', {
  method: 'POST',
  body: { subtotal }
});
const pointsEarned = response.data.loyalty_points.points_to_earn;
```

**Why This Matters:**
- **Security:** Birthday discount cannot be manipulated (backend verifies via JWT)
- **Consistency:** No timezone or floating-point issues
- **Maintainability:** Business logic in single source of truth (backend)
- **Accuracy:** Real-time calculations with latest business rules

#### Specific API Integration Patterns:

**1. Loyalty Balance Endpoint Pattern:**
```typescript
// Interface
interface LoyaltyBalance {
  balance: number;
  expiring_soon: number;
  expiry_date: string; // "2027-12-31 23:59:59"
}

// Service Method
async getLoyaltyBalance(): Promise<LoyaltyBalance> {
  return this.api.request<LoyaltyBalance>('/loyalty/balance');
}

// Usage: Display dynamic expiry_date, not hardcoded
```

**2. Pricing Calculation Endpoint Pattern (Debounced):**
```typescript
// Interface
interface PricingCalculation {
  subtotal: number;
  birthday_discount?: {
    applies: boolean;
    amount: number;
    percentage: number;
    message: string;
  };
  total: number;
  loyalty_points: {
    current_balance: number;
    points_to_earn: number;
    new_balance: number;
  };
}

// Service with debouncing to prevent excessive calls
async calculatePricing(subtotal: number): Promise<PricingCalculation> {
  return this.api.request<PricingCalculation>('/pricing/calculate', {
    method: 'POST',
    body: { subtotal }
  });
}
```

**3. Admin Customers Endpoint Pattern (N+1 Problem Solved):**
```typescript
// ❌ WRONG: Fetch loyalty per user (N+1 queries)
// 100 users = 101 API calls! Performance disaster.
for (const user of users) {
  const loyalty = await loyaltyService.getLoyaltyCard(user.id);
}

// ✅ CORRECT: Single optimized endpoint with includes
const customers = await api.request<AdminCustomer[]>(
  '/admin/customers?include=loyalty'
);
// Loyalty data already included in response!
```

**Implementation Complexity Reduction:**
- Original approach: 19 points total (frontend calculations)
- Revised approach: 13 points total (backend APIs)
- **Savings: 30% faster implementation**

---

### Pattern #2: React TypeScript Service Layer Error Handling & Loading States

**Source:** `/docs/api/API_DOCUMENTATION.md` + `/LOYALTY_API_GUIDE.md`
**Relevance Score:** 88/100
**Applies To:** All React components consuming loyalty APIs

#### Key Learnings:

**Standard Loading & Error Pattern:**
```typescript
// ✅ Standard pattern from API documentation
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<LoyaltyData | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/loyalty/balance', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setData(response.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [token]);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
```

**Error Handler Function (Reusable):**
```typescript
// From /docs/api/API_DOCUMENTATION.md
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

**Axios Interceptor Pattern:**
```typescript
// src/services/api/client.ts
const client = axios.create();

// Error interceptor for 401 responses (token expiry)
client.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Pagination Pattern:**
```typescript
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    total: number;
    // ... other pagination fields
  }
}

// Usage in component
const [page, setPage] = useState(1);
const [ledger, setLedger] = useState<TransactionItem[]>([]);

useEffect(() => {
  const fetch = async () => {
    const response = await api.request<PaginatedResponse<TransactionItem>>(
      `/loyalty/ledger?page=${page}`
    );
    setLedger(response.data);
  };
  fetch();
}, [page]);
```

---

### Pattern #3: Loyalty Points Calculation & Checkout Flow Integration

**Source:** `/LOYALTY_API_GUIDE.md` (Complete integration guide)
**Relevance Score:** 85/100
**Applies To:** Checkout flow, points preview, birthday discount display

#### Key Learnings:

**Checkout Points Preview Flow:**
```typescript
// Display points earned before confirming purchase
// This is a points PREVIEW, not actual earning
interface CheckoutPricingDisplay {
  subtotal: number;
  discount: number | null; // birthday discount if applicable
  total: number;
  loyaltyPreview: {
    currentBalance: number;
    willEarn: number;
    newBalance: number; // after purchase
    message?: string; // "Happy Birthday! Enjoy 10% off!"
  }
}
```

**Points Earning Trigger Pattern:**
```typescript
// Points are earned via POST /api/loyalty/earn
// Typically called by payment processing system (after payment succeeds)
interface PointsEarning {
  order_id: number;
  amount_paid: number;
}

// Response
interface PointsEarningResponse {
  points_earned: number;
  new_balance: number;
}

// In checkout component:
// 1. Call /pricing/calculate for preview
// 2. User completes payment
// 3. Payment gateway calls /loyalty/earn (usually backend-to-backend)
// 4. Frontend notifies user of points earned
```

**Transaction History Pagination:**
```typescript
interface TransactionItem {
  id: number;
  type: 'bonus' | 'purchase' | 'redemption' | 'expiry';
  points: number;
  description: string;
  expires_at: string;
  created_at: string;
}

// Fetch with pagination
interface TransactionHistory {
  data: TransactionItem[];
  meta: {
    current_page: number;
    total: number;
  }
}

// Component pagination logic
const [currentPage, setCurrentPage] = useState(1);

const fetchLedger = async (page: number) => {
  const response = await api.request<TransactionHistory>(
    `/loyalty/ledger?page=${page}`
  );
  return response;
};
```

**Birthday Discount Integration:**
```typescript
// Birthday discount is detected by backend from JWT token
// Response example when user's birthday matches today
{
  "subtotal": 1000.00,
  "birthday_discount": {
    "applies": true,
    "amount": 100.00,
    "percentage": 10,
    "message": "Happy Birthday! Enjoy 10% off!"
  },
  "total": 900.00,
  "loyalty_points": {
    "current_balance": 100,
    "points_to_earn": 9,
    "new_balance": 109
  }
}

// When it's NOT user's birthday
{
  "subtotal": 1000.00,
  "birthday_discount": null,  // null when not applicable
  "total": 1000.00,
  "loyalty_points": {
    "current_balance": 100,
    "points_to_earn": 10,
    "new_balance": 110
  }
}

// Frontend displays:
if (response.birthday_discount?.applies) {
  displayBirthdayMessage(response.birthday_discount.message);
  displayDiscount(response.birthday_discount.amount);
}
```

---

## Implementation Recommendations

### For Loyalty API Endpoints:

1. **Always use backend-calculated values** - Don't recreate birthday/points logic on frontend
2. **Handle loading states** - Use standard `useState(true)` pattern
3. **Handle errors gracefully** - Use `handleApiError()` utility function
4. **Use pagination for ledger** - Don't load all transactions at once
5. **Debounce pricing calls** - POST /pricing/calculate should be debounced (500ms)
6. **Respect N+1 prevention** - Use ?include=loyalty query parameter for admin views

### For Error Handling:

```typescript
// Standard 3-state pattern
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<T | null>(null);

// Always use finally to cleanup loading state
try {
  // API call
} catch (err) {
  setError(handleApiError(err));
} finally {
  setLoading(false);
}
```

### For Pagination:

```typescript
// Controlled pagination pattern
const [page, setPage] = useState(1);
useEffect(() => {
  fetchData(page);
}, [page]);

// Buttons trigger: setPage(page + 1) or setPage(page - 1)
```

---

## Related Documentation Files

- **Primary:** `/docs/BACKEND-API-INTEGRATION-SUMMARY.md` - Backend API contracts
- **Secondary:** `/LOYALTY_API_GUIDE.md` - Integration examples
- **Reference:** `/docs/api/API_DOCUMENTATION.md` - Service layer patterns

---

## Next Steps for Implementation

1. Review the 3 patterns above
2. Reference `/docs/BACKEND-API-INTEGRATION-SUMMARY.md` for exact API contracts
3. Use Pattern #2 (error handling & loading) as template for all components
4. Apply Pattern #1 (backend-first architecture) to all loyalty features
5. Implement pagination using Pattern #3 for transaction history

---

**Generated:** February 2, 2026
**Status:** Ready for implementation reference
