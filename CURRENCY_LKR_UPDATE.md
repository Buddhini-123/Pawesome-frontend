# Currency Update: LKR (Sri Lankan Rupees) Corrections

## Current Status

✅ **formatters.ts** - Already correctly configured for LKR:
```typescript
currency: (amount: number): string => {
  return `Rs. ${amount.toLocaleString('en-LK')}`;
}
```

❌ **Problem:** Many components use ₹ (Indian Rupee symbol) instead of Rs. (Lankan Rupee)

---

## Symbol Difference

| Currency | Symbol | Format Example |
|----------|--------|----------------|
| **Indian Rupee (INR)** | ₹ | ₹1,500 |
| **Sri Lankan Rupee (LKR)** | Rs. | Rs. 1,500 |

---

## Files to Update

### 1. Header Components (3 files)

**File:** `src/components/common/Header.tsx`
**File:** `src/components/common/Header.optimized.tsx`
**File:** `src/components/common/Header.backup.tsx`

**Change:**
```tsx
// Before
🐾 FREE SHIPPING on orders above ₹20,000

// After
🐾 FREE SHIPPING on orders above Rs. 20,000
```

---

### 2. Admin Product Form

**File:** `src/components/admin/Products/AddProduct.tsx`

**Changes:**
```tsx
// Before
Price (₹) *
Original Price (₹)

// After
Price (Rs.) *
Original Price (Rs.)
```

---

### 3. Account Page

**File:** `src/components/pages/Account/Account.tsx`

**Changes:**
```tsx
// Before
₹4,998
₹899
₹599
₹1,299

// After - Use formatters.currency()
{formatters.currency(4998)}
{formatters.currency(899)}
{formatters.currency(599)}
{formatters.currency(1299)}
```

---

### 4. Subscriptions Page

**File:** `src/components/pages/Features/Subscriptions.tsx`

**Changes:**
```tsx
// Before
free shipping on orders over ₹2,000
₹250+
On orders above ₹2,000
-₹{amount}
₹{amount}

// After
free shipping on orders over Rs. 2,000
Rs. 250+
On orders above Rs. 2,000
-Rs. {amount}
Rs. {amount}
```

---

### 5. Cart Page

**File:** `src/components/pages/Shop/Cart.tsx`

**Changes:**
```tsx
// Before
Free Shipping on ₹2000+

// After
Free Shipping on Rs. 2,000+
```

---

### 6. Checkout Page

**File:** `src/components/pages/Shop/Checkout.tsx`

**Changes:**
```tsx
// Before
₹${baseShippingCost}
+₹100
+₹50 COD charges
₹50 additional charges

// After
Rs. ${baseShippingCost}
+Rs. 100
+Rs. 50 COD charges
Rs. 50 additional charges
```

---

### 7. Hero Section

**File:** `src/components/pages/Home/HeroSection.tsx`

**Changes:**
```tsx
// Before
Starting ₹299

// After
Starting Rs. 299
```

---

## Best Practice Recommendation

### Use formatters.currency() Everywhere

Instead of manually typing currency symbols, always use:

```typescript
import { formatters } from '@/utils/formatters';

// Good ✅
<p>{formatters.currency(1500)}</p>
// Output: Rs. 1,500

// Bad ❌
<p>₹1500</p>
// Output: ₹1500 (wrong symbol, no formatting)
```

### Benefits:
1. ✅ Consistent formatting
2. ✅ Automatic number localization (en-LK)
3. ✅ Correct currency symbol (Rs.)
4. ✅ Easy to change if needed
5. ✅ Proper thousand separators

---

## Free Shipping Thresholds

Currently mixed values found:
- Rs. 2,000 (in some places)
- Rs. 20,000 (in headers)

**Recommendation:** Standardize to one value. Common Sri Lankan e-commerce typically uses:
- **Rs. 2,000** for standard free shipping
- **Rs. 5,000** for premium/express free shipping

---

## Locale Configuration

Already correctly set to **en-LK** (Sri Lankan English) in formatters:

```typescript
// Number formatting
amount.toLocaleString('en-LK')

// Date formatting
date.toLocaleDateString('en-LK', options)

// Time formatting
date.toLocaleTimeString('en-LK', options)

// Phone formatting
+94 XX XXX XXXX (Sri Lankan format)
```

---

## Quick Find & Replace Guide

Use these patterns to find and replace throughout the codebase:

| Find | Replace |
|------|---------|
| `₹` | `Rs. ` |
| `₹{` | `Rs. {` |
| `₹$` | `Rs. $` |

**Important:** Make sure to add space after `Rs.` and before the amount!

---

## Documentation Updates Needed

Update any documentation that mentions:
- ❌ "Indian Rupees"
- ❌ "INR"
- ❌ "₹" symbol

To:
- ✅ "Sri Lankan Rupees"
- ✅ "LKR"
- ✅ "Rs." symbol

---

## Summary

| Item | Status | Action Needed |
|------|--------|---------------|
| Formatters utility | ✅ Correct | None |
| Phone formatting | ✅ Correct (+94) | None |
| Locale (en-LK) | ✅ Correct | None |
| Country default | ✅ Correct (Sri Lanka) | None |
| Currency symbol | ❌ Mixed | Replace ₹ with Rs. |
| Manual formatting | ⚠️ Inconsistent | Use formatters.currency() |
| Documentation | ℹ️ Unknown | Check for INR references |

---

## Implementation Priority

1. **High Priority** - User-facing text:
   - Headers (free shipping threshold)
   - Product prices
   - Cart totals
   - Checkout amounts

2. **Medium Priority** - Forms:
   - Admin product form labels
   - Input placeholders

3. **Low Priority** - Comments:
   - Code comments
   - Documentation

---

**Note:** The core currency system is already correctly configured for LKR. The updates needed are mainly cosmetic replacements of the ₹ symbol with Rs. throughout the UI.
