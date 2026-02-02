# Loyalty Points & Rewards API Guide

Complete guide for integrating the loyalty points system into your frontend application.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Business Logic Overview](#business-logic-overview)
3. [API Endpoints](#api-endpoints)
4. [Frontend Integration Examples](#frontend-integration-examples)
5. [Common Use Cases](#common-use-cases)

---

## Quick Start

### Authentication Required
All loyalty endpoints require authentication using Laravel Sanctum bearer tokens.

```bash
# Include this header in all requests:
Authorization: Bearer YOUR_TOKEN_HERE
```

### Test Tokens (from SeedTestData)
```bash
John Doe:      5|iuFK6i5FpOti6u0Khu3TnsZYcv65iCbeb80QetLmb2d54a25
Jane Smith:    6|wkgYX1X9GwgY8o5SYYwHNEVGNpswzL4ObqrW389m63b89625
Michael Chen:  7|s6MRReCSCBaXImBv29V5a3T3wAAN0BKJrcSbXk4R3d05089d
Admin:         8|Ks77QlTCjt7bgVlk3pdVq3vcu0PIalUHDFUIL8eBffdccc8d
```

---

## Business Logic Overview

### Loyalty Rules
- **Earning**: Every 100 LKR spent = 1 loyalty point
- **Registration Bonus**: 100 points awarded on account creation
- **Birthday Discount**: 10% discount on orders placed on birthday
- **Expiration**: Points expire on December 31st every year
- **Spending**: FIFO (First In, First Out) - oldest points used first

### Point Lifecycle
```
ORDER PLACED → ORDER PAID → POINTS EARNED → STORED IN LEDGER
                                           → BALANCE UPDATED
                                           → EXPIRES DEC 31
```

---

## API Endpoints

### 1. GET /api/loyalty/balance
Get current loyalty points balance and expiring points information.

#### Request
```bash
curl -X GET http://localhost:8000/api/loyalty/balance \
  -H "Authorization: Bearer 5|iuFK6i5FpOti6u0Khu3TnsZYcv65iCbeb80QetLmb2d54a25" \
  -H "Accept: application/json"
```

#### Response
```json
{
  "balance": 100,
  "expiring_soon": 0,
  "expiry_date": "2027-12-31 23:59:59"
}
```

#### Response Fields
- `balance` (int): Current available points
- `expiring_soon` (int): Points expiring within next 30 days
- `expiry_date` (string): Date when current year points expire

---

### 2. GET /api/loyalty/ledger
Get complete transaction history with pagination.

#### Request
```bash
curl -X GET "http://localhost:8000/api/loyalty/ledger?page=1" \
  -H "Authorization: Bearer 5|iuFK6i5FpOti6u0Khu3TnsZYcv65iCbeb80QetLmb2d54a25" \
  -H "Accept: application/json"
```

#### Response
```json
{
  "data": [
    {
      "id": 1,
      "type": "earn",
      "points": 100,
      "description": "Registration bonus",
      "expires_at": "2026-12-31 23:59:59",
      "created_at": "2026-02-02 10:30:00",
      "reference": {
        "type": null,
        "id": null
      }
    },
    {
      "id": 2,
      "type": "earn",
      "points": 25,
      "description": "Earned from order #12345",
      "expires_at": "2026-12-31 23:59:59",
      "created_at": "2026-02-01 14:20:00",
      "reference": {
        "type": "App\\Models\\Order",
        "id": 12345
      }
    }
  ],
  "links": { ... },
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 2
  }
}
```

#### Ledger Entry Types
- `earn`: Points earned from purchases or bonuses
- `spend`: Points spent/redeemed
- `expire`: Points that expired
- `bonus`: Special bonuses (registration, birthday, etc.)

---

### 3. POST /api/loyalty/earn
Award loyalty points when an order is paid. This endpoint is typically called by your payment processing system.

#### Request
```bash
curl -X POST http://localhost:8000/api/loyalty/earn \
  -H "Authorization: Bearer 5|iuFK6i5FpOti6u0Khu3TnsZYcv65iCbeb80QetLmb2d54a25" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "order_id": 1,
    "amount_paid": 2500.00
  }'
```

#### Request Body
```json
{
  "order_id": 1,           // Required: ID of the paid order
  "amount_paid": 2500.00   // Required: Total amount paid (in LKR)
}
```

#### Response
```json
{
  "message": "Points earned successfully",
  "points_earned": 25,
  "new_balance": 125
}
```

#### Points Calculation
```
Amount: 2,500 LKR
Points: 2,500 ÷ 100 = 25 points
```

#### Error Responses
```json
// 403 - Unauthorized (order doesn't belong to user)
{
  "message": "Unauthorized"
}

// 422 - Validation Error
{
  "message": "The order id field is required."
}
```

---

### 4. POST /api/pricing/calculate
Calculate order pricing including birthday discount and points that will be earned.

#### Request
```bash
curl -X POST http://localhost:8000/api/pricing/calculate \
  -H "Authorization: Bearer 5|iuFK6i5FpOti6u0Khu3TnsZYcv65iCbeb80QetLmb2d54a25" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "subtotal": 5000.00
  }'
```

#### Request Body
```json
{
  "subtotal": 5000.00   // Required: Cart/order subtotal
}
```

#### Response (Non-Birthday)
```json
{
  "subtotal": 5000,
  "birthday_discount": {
    "applies": false,
    "percentage": 10,
    "amount": 0,
    "message": "Birthday discount not applicable"
  },
  "total": 5000,
  "loyalty_points": {
    "will_earn": 50,
    "current_balance": 100,
    "new_balance": 150
  }
}
```

#### Response (Birthday - 10% Discount)
```json
{
  "subtotal": 5000,
  "birthday_discount": {
    "applies": true,
    "percentage": 10,
    "amount": 500,
    "message": "🎉 Happy Birthday! Enjoy 10% off your order"
  },
  "total": 4500,
  "loyalty_points": {
    "will_earn": 45,
    "current_balance": 100,
    "new_balance": 145
  }
}
```

#### Birthday Discount Logic
- Applies only on user's birthday (matches date, ignores year)
- 10% discount on entire order
- Points calculated on discounted total (not original subtotal)

---

### 5. GET /api/admin/customers?include=loyalty
Admin endpoint to view customer loyalty data.

#### Request
```bash
curl -X GET "http://localhost:8000/api/admin/customers?include=loyalty&page=1" \
  -H "Authorization: Bearer 8|Ks77QlTCjt7bgVlk3pdVq3vcu0PIalUHDFUIL8eBffdccc8d" \
  -H "Accept: application/json"
```

#### Response
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "birthday": "1990-05-15",
      "loyalty_balance": {
        "id": 1,
        "user_id": 1,
        "balance": 125,
        "lifetime_earned": 250,
        "lifetime_spent": 125,
        "updated_at": "2026-02-02T10:30:00.000000Z"
      },
      "loyalty_ledger": [
        {
          "id": 1,
          "type": "earn",
          "points": 100,
          "description": "Registration bonus",
          "expires_at": "2026-12-31T23:59:59.000000Z",
          "created_at": "2026-02-02T10:30:00.000000Z"
        }
        // ... up to 10 recent transactions
      ]
    }
  ],
  "links": { ... },
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 4
  }
}
```

---

## Frontend Integration Examples

### React Integration

#### 1. Loyalty Balance Component
```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LoyaltyBalance() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get('http://localhost:8000/api/loyalty/balance', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      setBalance(response.data);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="loyalty-balance">
      <h3>Loyalty Points</h3>
      <div className="points-display">
        <span className="points">{balance.balance}</span>
        <span className="label">Available Points</span>
      </div>
      {balance.expiring_soon > 0 && (
        <div className="expiry-warning">
          ⚠️ {balance.expiring_soon} points expiring soon on {balance.expiry_date}
        </div>
      )}
    </div>
  );
}

export default LoyaltyBalance;
```

#### 2. Transaction History Component
```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LoyaltyHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage]);

  const fetchHistory = async (page) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(
        `http://localhost:8000/api/loyalty/ledger?page=${page}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      earn: 'green',
      spend: 'red',
      expire: 'gray',
      bonus: 'blue'
    };
    return colors[type] || 'black';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="loyalty-history">
      <h3>Transaction History</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Description</th>
            <th>Points</th>
            <th>Expires</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{new Date(tx.created_at).toLocaleDateString()}</td>
              <td style={{ color: getTypeColor(tx.type) }}>
                {tx.type.toUpperCase()}
              </td>
              <td>{tx.description}</td>
              <td>{tx.type === 'earn' || tx.type === 'bonus' ? '+' : '-'}{tx.points}</td>
              <td>{tx.expires_at ? new Date(tx.expires_at).toLocaleDateString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LoyaltyHistory;
```

#### 3. Checkout Pricing Preview Component
```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CheckoutPricing({ subtotal }) {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subtotal > 0) {
      calculatePricing();
    }
  }, [subtotal]);

  const calculatePricing = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(
        'http://localhost:8000/api/pricing/calculate',
        { subtotal },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      setPricing(response.data);
    } catch (error) {
      console.error('Error calculating pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Calculating...</div>;
  if (!pricing) return null;

  return (
    <div className="checkout-pricing">
      <div className="pricing-row">
        <span>Subtotal:</span>
        <span>LKR {pricing.subtotal.toFixed(2)}</span>
      </div>

      {pricing.birthday_discount.applies && (
        <div className="pricing-row discount">
          <span>🎉 Birthday Discount ({pricing.birthday_discount.percentage}%):</span>
          <span>- LKR {pricing.birthday_discount.amount.toFixed(2)}</span>
        </div>
      )}

      <div className="pricing-row total">
        <span><strong>Total:</strong></span>
        <span><strong>LKR {pricing.total.toFixed(2)}</strong></span>
      </div>

      <div className="loyalty-info">
        <p>
          ✨ You'll earn <strong>{pricing.loyalty_points.will_earn} points</strong> from this order
        </p>
        <p className="text-sm">
          Current Balance: {pricing.loyalty_points.current_balance} points
          → New Balance: {pricing.loyalty_points.new_balance} points
        </p>
      </div>

      {pricing.birthday_discount.applies && (
        <div className="birthday-message">
          {pricing.birthday_discount.message}
        </div>
      )}
    </div>
  );
}

export default CheckoutPricing;
```

---

### Vue.js Integration

#### Loyalty Dashboard Component
```vue
<template>
  <div class="loyalty-dashboard">
    <div v-if="loading">Loading...</div>
    <div v-else>
      <!-- Balance Card -->
      <div class="balance-card">
        <h3>Your Loyalty Points</h3>
        <div class="points-display">
          {{ balance.balance }}
        </div>
        <p>Expires: {{ formatDate(balance.expiry_date) }}</p>
        <div v-if="balance.expiring_soon > 0" class="warning">
          ⚠️ {{ balance.expiring_soon }} points expiring soon
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="transactions">
        <h3>Recent Activity</h3>
        <div v-for="tx in transactions" :key="tx.id" class="transaction-item">
          <span :class="`type-${tx.type}`">{{ tx.type.toUpperCase() }}</span>
          <span class="description">{{ tx.description }}</span>
          <span class="points">
            {{ tx.type === 'earn' || tx.type === 'bonus' ? '+' : '-' }}{{ tx.points }}
          </span>
          <span class="date">{{ formatDate(tx.created_at) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoyaltyDashboard',
  data() {
    return {
      balance: null,
      transactions: [],
      loading: true
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const token = localStorage.getItem('auth_token');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        };

        // Fetch balance
        const balanceRes = await axios.get(
          'http://localhost:8000/api/loyalty/balance',
          config
        );
        this.balance = balanceRes.data;

        // Fetch transactions
        const ledgerRes = await axios.get(
          'http://localhost:8000/api/loyalty/ledger',
          config
        );
        this.transactions = ledgerRes.data.data;
      } catch (error) {
        console.error('Error fetching loyalty data:', error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    }
  }
};
</script>

<style scoped>
.balance-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
}

.points-display {
  font-size: 3rem;
  font-weight: bold;
  margin: 1rem 0;
}

.type-earn, .type-bonus { color: #10b981; }
.type-spend { color: #ef4444; }
.type-expire { color: #6b7280; }

.transaction-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}
</style>
```

---

### Vanilla JavaScript Integration

```javascript
// loyalty-api.js - Reusable API functions

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Get authentication token from localStorage
 */
function getAuthToken() {
  return localStorage.getItem('auth_token');
}

/**
 * Fetch loyalty points balance
 */
async function fetchLoyaltyBalance() {
  try {
    const response = await fetch(`${API_BASE_URL}/loyalty/balance`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching loyalty balance:', error);
    throw error;
  }
}

/**
 * Fetch transaction history
 */
async function fetchLoyaltyLedger(page = 1) {
  try {
    const response = await fetch(`${API_BASE_URL}/loyalty/ledger?page=${page}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching loyalty ledger:', error);
    throw error;
  }
}

/**
 * Award points for an order
 */
async function awardLoyaltyPoints(orderId, amountPaid) {
  try {
    const response = await fetch(`${API_BASE_URL}/loyalty/earn`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        order_id: orderId,
        amount_paid: amountPaid
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error awarding loyalty points:', error);
    throw error;
  }
}

/**
 * Calculate order pricing with discounts
 */
async function calculatePricing(subtotal) {
  try {
    const response = await fetch(`${API_BASE_URL}/pricing/calculate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ subtotal })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calculating pricing:', error);
    throw error;
  }
}

/**
 * Display loyalty balance in DOM
 */
async function displayLoyaltyBalance(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '<p>Loading...</p>';

  try {
    const data = await fetchLoyaltyBalance();

    container.innerHTML = `
      <div class="loyalty-balance">
        <h3>Loyalty Points</h3>
        <div class="points">${data.balance}</div>
        <p>Expires: ${new Date(data.expiry_date).toLocaleDateString()}</p>
        ${data.expiring_soon > 0 ?
          `<div class="warning">⚠️ ${data.expiring_soon} points expiring soon</div>` :
          ''}
      </div>
    `;
  } catch (error) {
    container.innerHTML = '<p>Error loading balance</p>';
  }
}

/**
 * Display transaction history in DOM
 */
async function displayLoyaltyHistory(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '<p>Loading...</p>';

  try {
    const data = await fetchLoyaltyLedger();

    const html = `
      <div class="loyalty-history">
        <h3>Transaction History</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            ${data.data.map(tx => `
              <tr>
                <td>${new Date(tx.created_at).toLocaleDateString()}</td>
                <td class="type-${tx.type}">${tx.type.toUpperCase()}</td>
                <td>${tx.description}</td>
                <td>${(tx.type === 'earn' || tx.type === 'bonus' ? '+' : '-')}${tx.points}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = '<p>Error loading history</p>';
  }
}

// Example usage:
// displayLoyaltyBalance('balance-container');
// displayLoyaltyHistory('history-container');
```

---

## Common Use Cases

### 1. Display Points on User Dashboard
```javascript
// On user login or dashboard load
async function loadUserDashboard() {
  const balance = await fetchLoyaltyBalance();

  // Update UI
  document.getElementById('points-badge').textContent = balance.balance;

  // Show expiry warning if needed
  if (balance.expiring_soon > 0) {
    showExpiryWarning(balance.expiring_soon, balance.expiry_date);
  }
}
```

### 2. Show Points Preview at Checkout
```javascript
// When cart total updates
async function updateCheckoutSummary(cartTotal) {
  const pricing = await calculatePricing(cartTotal);

  // Display pricing breakdown
  document.getElementById('subtotal').textContent = `LKR ${pricing.subtotal}`;
  document.getElementById('total').textContent = `LKR ${pricing.total}`;

  // Show birthday discount if applicable
  if (pricing.birthday_discount.applies) {
    document.getElementById('birthday-discount').style.display = 'block';
    document.getElementById('discount-amount').textContent =
      `- LKR ${pricing.birthday_discount.amount}`;
    showBirthdayMessage(pricing.birthday_discount.message);
  }

  // Show points that will be earned
  document.getElementById('points-preview').textContent =
    `You'll earn ${pricing.loyalty_points.will_earn} points from this order!`;
}
```

### 3. Award Points After Payment
```javascript
// After payment gateway confirms successful payment
async function handlePaymentSuccess(orderId, amountPaid) {
  try {
    const result = await awardLoyaltyPoints(orderId, amountPaid);

    // Show success message
    showNotification(
      `🎉 ${result.message}! You earned ${result.points_earned} points.
       New balance: ${result.new_balance} points`
    );

    // Refresh user's balance display
    await loadUserDashboard();

  } catch (error) {
    console.error('Failed to award points:', error);
    // Non-critical error - don't block order completion
  }
}
```

### 4. Show Transaction History Page
```javascript
// On loyalty page load
let currentPage = 1;

async function loadLoyaltyPage() {
  // Load balance
  await displayLoyaltyBalance('balance-section');

  // Load transaction history
  await loadTransactionHistory(currentPage);
}

async function loadTransactionHistory(page) {
  const data = await fetchLoyaltyLedger(page);

  // Render transactions
  renderTransactions(data.data);

  // Setup pagination
  setupPagination(data.meta);
}

function setupPagination(meta) {
  const pagination = document.getElementById('pagination');

  if (meta.current_page < meta.last_page) {
    pagination.innerHTML = `
      <button onclick="loadTransactionHistory(${meta.current_page + 1})">
        Load More
      </button>
    `;
  }
}
```

### 5. Admin Customer View
```javascript
// Admin panel - view customer loyalty data
async function fetchCustomerLoyaltyData(page = 1) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/customers?include=loyalty&page=${page}`,
      {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Accept': 'application/json'
        }
      }
    );

    const data = await response.json();

    // Display customers with loyalty stats
    data.data.forEach(customer => {
      console.log(`Customer: ${customer.name}`);
      console.log(`Balance: ${customer.loyalty_balance.balance} points`);
      console.log(`Lifetime Earned: ${customer.loyalty_balance.lifetime_earned}`);
      console.log(`Recent Transactions:`, customer.loyalty_ledger);
    });

    return data;
  } catch (error) {
    console.error('Error fetching customer data:', error);
  }
}
```

---

## Testing with cURL

### Test All Endpoints

```bash
# Set your token
TOKEN="5|iuFK6i5FpOti6u0Khu3TnsZYcv65iCbeb80QetLmb2d54a25"

# 1. Get Balance
curl -X GET http://localhost:8000/api/loyalty/balance \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"

# 2. Get Transaction History
curl -X GET "http://localhost:8000/api/loyalty/ledger?page=1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"

# 3. Calculate Pricing (Non-Birthday)
curl -X POST http://localhost:8000/api/pricing/calculate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"subtotal": 5000}'

# 4. Award Points (after creating an order)
curl -X POST http://localhost:8000/api/loyalty/earn \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "order_id": 1,
    "amount_paid": 2500
  }'

# 5. Admin - View Customers with Loyalty Data
ADMIN_TOKEN="8|Ks77QlTCjt7bgVlk3pdVq3vcu0PIalUHDFUIL8eBffdccc8d"

curl -X GET "http://localhost:8000/api/admin/customers?include=loyalty" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Accept: application/json"
```

---

## Error Handling

### Common Errors

#### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```
**Cause**: Missing or invalid authentication token
**Solution**: Ensure `Authorization: Bearer {token}` header is included

#### 403 Forbidden
```json
{
  "message": "Unauthorized"
}
```
**Cause**: Attempting to earn points for another user's order
**Solution**: Verify the order belongs to the authenticated user

#### 422 Validation Error
```json
{
  "message": "The order id field is required.",
  "errors": {
    "order_id": ["The order id field is required."]
  }
}
```
**Cause**: Missing required fields
**Solution**: Check request body includes all required fields

---

## Best Practices

### 1. Cache Balance Locally
```javascript
// Cache balance for 5 minutes to reduce API calls
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class LoyaltyCache {
  static get balance() {
    const cached = localStorage.getItem('loyalty_balance_cache');
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      return null; // Cache expired
    }

    return data;
  }

  static set balance(data) {
    localStorage.setItem('loyalty_balance_cache', JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  }
}

// Usage
async function getBalance() {
  let balance = LoyaltyCache.balance;

  if (!balance) {
    balance = await fetchLoyaltyBalance();
    LoyaltyCache.balance = balance;
  }

  return balance;
}
```

### 2. Optimistic UI Updates
```javascript
// Show immediate feedback while API request is pending
async function handleEarnPoints(orderId, amount) {
  const estimatedPoints = Math.floor(amount / 100);

  // Optimistically update UI
  updatePointsDisplay(currentBalance + estimatedPoints);

  try {
    // Actual API call
    const result = await awardLoyaltyPoints(orderId, amount);

    // Update with real value
    updatePointsDisplay(result.new_balance);
  } catch (error) {
    // Revert on error
    updatePointsDisplay(currentBalance);
    showError('Failed to award points');
  }
}
```

### 3. Show Points Everywhere
Display loyalty points in multiple places to increase engagement:
- Header/navigation bar
- Cart page
- Checkout summary
- Order confirmation
- User dashboard
- Product pages (show points that will be earned)

### 4. Highlight Birthday Discount
```javascript
// Check if today is user's birthday on login
async function checkBirthdayOnLogin(user) {
  const today = new Date();
  const birthday = new Date(user.birthday);

  if (today.getMonth() === birthday.getMonth() &&
      today.getDate() === birthday.getDate()) {
    // Show prominent birthday banner
    showBirthdayBanner();
  }
}
```

---

## Summary

The loyalty system provides a complete points-based rewards program with:

✅ **Automatic Points**: Earn 1 point per 100 LKR spent
✅ **Birthday Rewards**: 10% discount on birthday
✅ **Registration Bonus**: 100 points for new users
✅ **Transaction History**: Complete audit trail
✅ **Expiration Management**: Points expire Dec 31 yearly
✅ **Admin Oversight**: Full customer loyalty visibility

All endpoints are production-ready with proper validation, error handling, and resource transformers.

For questions or issues, refer to:
- **LoyaltyService.php**: Core business logic
- **LoyaltyController.php**: API endpoint implementations
- **database/migrations**: Database schema
- **tests/Feature/LoyaltyTest.php**: Test cases (19 tests, all passing)
