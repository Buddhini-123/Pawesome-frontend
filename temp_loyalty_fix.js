// First, create a demo user and login session
const demoUser = {
  id: 'demo-user-123',
  email: 'demo@pawsome.com',
  name: 'Demo User',
  role: 'user',
  loyaltyCardId: 'demo-loyalty-card-123',
  addresses: []
};

// Create demo loyalty card
const demoLoyaltyCard = {
  id: 'demo-loyalty-card-123',
  userId: 'demo-user-123',
  cardNumber: 'PAW123456789',
  points: 6000,
  tier: 'GOLD',
  joinDate: new Date().toISOString(),
  totalEarned: 30000,
  totalRedeemed: 5000,
  totalDonated: 0,
  lastActivity: new Date().toISOString(),
  isActive: true
};

// Save auth data
localStorage.setItem('auth_token', 'demo-token-123');
localStorage.setItem('auth_user', JSON.stringify(demoUser));

// Save loyalty data
const existingCards = JSON.parse(localStorage.getItem('loyaltyCards') || '[]');
const filteredCards = existingCards.filter(card => card.userId \!== 'demo-user-123');
filteredCards.push(demoLoyaltyCard);
localStorage.setItem('loyaltyCards', JSON.stringify(filteredCards));

console.log('Demo user and loyalty card created\! Refresh the page.');
EOF < /dev/null