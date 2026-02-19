# Quick Testing Guide: Weight-Based Shipping

## 🎯 What to Test Right Now

### 1. **Start Your Dev Server**
```bash
npm start
```

### 2. **Open Cart Page**
Navigate to: `http://localhost:3000/cart`

---

## ✅ What You Should See

### A. **Empty Cart** (if cart is empty)
- Message: "Your cart is empty"
- "Start Shopping" button

### B. **Cart With Items** (add some products first)

#### 1. **Benefits Banner** (Top of page)
Look for 5 cards including:
```
🚚 Free Shipping     🛡️ Secure Checkout     ⏰ 24/7 Support
🎁 Gift Wrapping     ⚖️ Total Weight: X.XX kg
```

#### 2. **NEW: Shipping Tier Indicator** (Right sidebar, above order summary)

You should see a white card with:

##### Header Section:
```
[🚚 Icon] Standard Package             Rs. 500
          Current weight: 2.5 kg       Shipping Cost
```

##### Progress Section (if not at max tier):
```
📈 Add 2.5 kg more                     Next tier: Rs. 700
[=========>             ] Progress Bar
```

##### Special Alert (if within 0.5 kg of next tier):
```
⚠️ Almost there! Add just 0.3 kg more to reach the next shipping tier!
```

##### Tier List:
```
✓ Under 1 kg             Rs. 350
→ 1-5 kg [Current]       Rs. 500
  Over 5 kg              Rs. 700
```

#### 3. **Cart Items Section**
Each product shows:
```
[Image] Product Name ❤️
        ⚖️ Weight: 1.2 kg
           Total: 2.4 kg (for qty 2)
        📏 Dimensions: 30 × 20 × 10 cm
        Rs. 1,500
```

#### 4. **Order Summary** (Right sidebar, below tier indicator)
```
Order Summary
─────────────
Subtotal                    Rs. 2,500
⚖️ Total Weight             2.5 kg
🚚 Shipping (1-5 kg)        Rs. 500
─────────────────────────────────────
Total                       Rs. 3,000

[Weight-Based Shipping Card]
📦 1-5 kg: Rs. 500 ✓
```

---

## 🧪 Interactive Tests

### Test 1: Add Items to Reach Next Tier

**Steps:**
1. Add a 0.8 kg item to cart
2. Notice: "Light Package" tier (Rs. 350)
3. Add another 0.3 kg item
4. **Expected Result**:
   - Tier changes to "Standard Package"
   - Cost updates from Rs. 350 → Rs. 500
   - Progress bar resets
   - Yellow alert appears: "Add X kg more..."

### Test 2: Progress Bar Animation

**Steps:**
1. Have 0.5 kg in cart
2. Watch progress bar (should be at ~50% of Light tier)
3. Add 0.3 kg item
4. **Expected Result**:
   - Progress bar animates to 80%
   - Alert box appears
   - Message: "Add just 0.2 kg more..."

### Test 3: Reach Maximum Tier

**Steps:**
1. Add items totaling > 5 kg
2. **Expected Result**:
   - Green success box appears
   - Message: "You're at the highest shipping tier!"
   - No progress bar shown
   - Shipping cost: Rs. 700

### Test 4: Real-time Updates

**Steps:**
1. Add 1 item (1 kg)
2. Note shipping: Rs. 350
3. Increase quantity to 2
4. **Expected Result**:
   - Weight updates: 1 kg → 2 kg
   - Tier changes: Light → Standard
   - Cost updates: Rs. 350 → Rs. 500
   - All values update simultaneously

### Test 5: Remove Items

**Steps:**
1. Have 2 kg in cart (Standard tier - Rs. 500)
2. Remove 1.5 kg worth of items
3. **Expected Result**:
   - Weight drops to 0.5 kg
   - Tier changes: Standard → Light
   - Cost updates: Rs. 500 → Rs. 350
   - Progress bar adjusts

---

## 🎨 Visual Checks

### Color Coding:
- **Light Package** (< 1 kg): Blue theme
- **Standard Package** (1-5 kg): Orange theme
- **Heavy Package** (> 5 kg): Red theme

### Animations:
- ✓ Progress bar animates smoothly (500ms ease-out)
- ✓ Cards have hover effects (scale 1.02)
- ✓ Tier indicator fades in (opacity 0 → 1)
- ✓ Alert box scales in when appearing

### Mobile Responsive:
1. Resize browser to mobile width (< 768px)
2. Check:
   - ✓ Tier indicator stacks vertically
   - ✓ All text remains readable
   - ✓ Progress bar works on mobile
   - ✓ Cards maintain spacing

---

## 🐛 Troubleshooting

### Issue: "Shipping cost shows Rs. 0"
**Fix:**
- Backend may not be running
- Check console for API errors
- Verify `http://127.0.0.1:8000/api/cart` returns data

### Issue: "No weight displayed"
**Fix:**
- Products may not have weight field
- Check product data in database
- Verify weight is a number, not null

### Issue: "Tier indicator not showing"
**Fix:**
- Check if `totalWeight > 0`
- Component only renders when cart has weight
- Inspect React DevTools for ShippingTierIndicator

### Issue: "Progress bar not animating"
**Fix:**
- Ensure Framer Motion is installed
- Check console for animation errors
- Try hard refresh (Ctrl+Shift+R)

### Issue: "Tailwind classes not working"
**Fix:**
- Run `npm run build` to regenerate CSS
- Check tailwind.config.js includes component path
- Verify custom colors are defined

---

## 📱 Browser Console Tests

Open DevTools (F12) and check:

### 1. **Network Tab**
When adding/removing items, you should see:
```
POST /api/cart/items    → 200 OK
Response includes:
  - shipping_cost
  - total_weight
  - shipping_breakdown
```

### 2. **Console Logs**
Look for:
```
[CartContext] Backend cart loaded with X items
[CartContext] Shipping cost: 500
[CartContext] Total weight: 2.5
```

### 3. **React DevTools**
Inspect ShippingTierIndicator props:
```
currentWeight: 2.5
shippingCost: 500
weightUnit: "kg"
```

---

## ✅ Success Criteria

Your integration is working if:

- [x] Cart page loads without errors
- [x] Total weight displays correctly
- [x] Shipping tier indicator shows
- [x] Current tier is highlighted
- [x] Progress bar displays (if not at max)
- [x] Adding items updates weight
- [x] Adding items may change tier
- [x] Shipping cost matches tier
- [x] All 3 tiers display in list
- [x] Animations work smoothly
- [x] Mobile view is responsive
- [x] Backend API returns shipping_cost
- [x] Console shows no React errors

---

## 📸 Expected Screenshots

### Desktop View:
```
┌─────────────────────────────────────────────────────┐
│  My Cart                                            │
│  📦 3 items ready for checkout                      │
│                                                     │
│  [Benefits Banner: 🚚 🛡️ ⏰ 🎁 ⚖️]                 │
│                                                     │
│  ┌───────────────┬─────────────────────────────┐   │
│  │               │ [Shipping Tier Indicator]    │   │
│  │  Cart Items   │  🚚 Standard Package         │   │
│  │               │  Current: 2.5 kg             │   │
│  │  [Item 1]     │  Progress: [=======>    ]    │   │
│  │  [Item 2]     │                              │   │
│  │  [Item 3]     │  Tiers:                      │   │
│  │               │  ✓ 1-5 kg: Rs. 500          │   │
│  │               │                              │   │
│  │               │ [Order Summary]              │   │
│  │               │  Subtotal: Rs. 2,500        │   │
│  │               │  Shipping: Rs. 500          │   │
│  │               │  Total: Rs. 3,000           │   │
│  └───────────────┴─────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Mobile View:
```
┌───────────────────┐
│  My Cart          │
│  📦 3 items       │
│                   │
│  [Benefits]       │
│                   │
│  [Cart Items]     │
│                   │
│  [Tier Indicator] │
│  🚚 Standard      │
│  2.5 kg           │
│  [Progress Bar]   │
│                   │
│  [Order Summary]  │
│                   │
│  [Checkout Btn]   │
└───────────────────┘
```

---

## 🎉 All Done!

If you can see all these elements and they respond correctly to adding/removing items, your **weight-based shipping integration is working perfectly!**

### Quick Summary:
✅ Backend calculates shipping based on weight
✅ Frontend displays weight and tier beautifully
✅ Real-time updates when cart changes
✅ Visual progress indicators work
✅ Mobile responsive design works
✅ Animations are smooth

### Need Help?
Check:
1. Console for errors
2. Network tab for API responses
3. React DevTools for component props
4. SHIPPING_INTEGRATION_SUMMARY.md for detailed info

**Happy Testing! 🚀**
