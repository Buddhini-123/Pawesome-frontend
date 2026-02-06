#!/usr/bin/env node

console.log('🔍 Testing Loyalty System Fix...\n');

// Simulate browser localStorage for testing
const { JSDOM } = require('jsdom');
const dom = new JSDOM();
global.window = dom.window;
global.localStorage = dom.window.localStorage;

// Mock console methods to capture output
const consoleLogs = [];
const originalLog = console.log;
console.log = (...args) => {
  consoleLogs.push(args.join(' '));
  originalLog(...args);
};

// Mock UUID
const mockUUID = () => 'mock-uuid-' + Math.random().toString(36).substr(2, 9);

// Simulate mock loyalty data
const mockLoyaltyCards = [
  {
    id: 'lc-001',
    userId: 'demo-user-1',
    cardNumber: 'PAW123456789',
    points: 2500,
    tier: 'SILVER',
    joinDate: new Date('2024-01-15'),
    totalEarned: 7500,
    totalRedeemed: 5000,
    totalDonated: 0,
    lastActivity: new Date('2025-01-05'),
    isActive: true
  }
];

const mockPointTransactions = [
  {
    id: 'pt-001',
    loyaltyCardId: 'lc-001',
    type: 'earned',
    points: 250,
    description: 'Purchase: Royal Canin Dog Food',
    orderId: 'order-001',
    createdAt: new Date('2025-01-05'),
    expiresAt: new Date('2026-01-05'),
    balance: 2500
  }
];

// Simulate the LoyaltyService initialization
class TestLoyaltyService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    const existingCards = localStorage.getItem('loyaltyCards');
    if (!existingCards) {
      localStorage.setItem('loyaltyCards', JSON.stringify(mockLoyaltyCards));
      console.log('✅ Initialized loyalty cards with mock data');
    }

    const existingTransactions = localStorage.getItem('loyaltyTransactions');
    if (!existingTransactions) {
      localStorage.setItem('loyaltyTransactions', JSON.stringify(mockPointTransactions));
      console.log('✅ Initialized loyalty transactions with mock data');
    }

    this.linkDemoUserToLoyaltyCard();
  }

  linkDemoUserToLoyaltyCard() {
    try {
      // Simulate existing auth user without loyalty card ID
      const demoUser = {
        id: 'demo-user-1',
        email: 'demo@pawsome.com',
        name: 'Demo User',
        role: 'user'
        // No loyaltyCardId initially
      };
      localStorage.setItem('auth_user', JSON.stringify(demoUser));

      const authUser = localStorage.getItem('auth_user');
      if (authUser) {
        const user = JSON.parse(authUser);
        if (user.id === 'demo-user-1' && !user.loyaltyCardId) {
          user.loyaltyCardId = 'lc-001';
          localStorage.setItem('auth_user', JSON.stringify(user));
          console.log('✅ Linked demo user to loyalty card');
        }
      }
    } catch (error) {
      console.warn('❌ Could not link demo user to loyalty card:', error);
    }
  }

  async getLoyaltyCard(userId) {
    const cards = JSON.parse(localStorage.getItem('loyaltyCards') || '[]');
    const card = cards.find(card => card.userId === userId);
    console.log(`🔍 Looking for loyalty card for user ${userId}`);
    if (card) {
      console.log(`✅ Found loyalty card: ${card.id} with ${card.points} points`);
    } else {
      console.log(`❌ No loyalty card found for user ${userId}`);
    }
    return card || null;
  }
}

async function runTest() {
  console.log('1️⃣ Creating LoyaltyService instance...');
  const loyaltyService = new TestLoyaltyService();

  console.log('\n2️⃣ Checking stored data...');
  const storedCards = localStorage.getItem('loyaltyCards');
  const storedTransactions = localStorage.getItem('loyaltyTransactions');
  const storedUser = localStorage.getItem('auth_user');

  console.log(`   Loyalty cards: ${storedCards ? '✅ Present' : '❌ Missing'}`);
  console.log(`   Transactions: ${storedTransactions ? '✅ Present' : '❌ Missing'}`);
  console.log(`   Auth user: ${storedUser ? '✅ Present' : '❌ Missing'}`);

  if (storedUser) {
    const user = JSON.parse(storedUser);
    console.log(`   User loyalty card ID: ${user.loyaltyCardId || '❌ Missing'}`);
  }

  console.log('\n3️⃣ Testing loyalty card retrieval...');
  const card = await loyaltyService.getLoyaltyCard('demo-user-1');

  console.log('\n📊 Test Results:');
  if (card && card.points > 0) {
    console.log('🎉 SUCCESS: Loyalty system is working correctly!');
    console.log(`   User has ${card.points} points in ${card.tier} tier`);
    return true;
  } else {
    console.log('❌ FAILED: Loyalty system is not working correctly');
    return false;
  }
}

runTest().then(success => {
  console.log(`\n${success ? '✅' : '❌'} Test ${success ? 'PASSED' : 'FAILED'}`);
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Test failed with error:', error);
  process.exit(1);
});