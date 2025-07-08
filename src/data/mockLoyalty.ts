import { 
  LoyaltyCard, 
  PointTransaction, 
  LoyaltyRule, 
  Badge, 
  LoyaltyTier,
  ReferralBonus 
} from '../types/loyalty';

export const mockLoyaltyCards: LoyaltyCard[] = [
  {
    id: 'lc-001',
    userId: 'user-001',
    cardNumber: 'PAW123456789',
    points: 2500,
    tier: LoyaltyTier.SILVER,
    joinDate: new Date('2024-01-15'),
    totalEarned: 7500,
    totalRedeemed: 5000,
    totalDonated: 0,
    lastActivity: new Date('2025-01-05'),
    isActive: true
  },
  {
    id: 'lc-002',
    userId: 'user-002',
    cardNumber: 'PAW987654321',
    points: 12000,
    tier: LoyaltyTier.GOLD,
    joinDate: new Date('2023-06-20'),
    totalEarned: 25000,
    totalRedeemed: 13000,
    totalDonated: 0,
    lastActivity: new Date('2025-01-07'),
    isActive: true
  }
];

export const mockPointTransactions: PointTransaction[] = [
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
  },
  {
    id: 'pt-002',
    loyaltyCardId: 'lc-001',
    type: 'redeemed',
    points: -1000,
    description: 'Redeemed for order #PW123456',
    orderId: 'order-002',
    createdAt: new Date('2024-12-20'),
    balance: 2250
  },
  {
    id: 'pt-003',
    loyaltyCardId: 'lc-001',
    type: 'bonus',
    points: 1000,
    description: 'Birthday Bonus! 🎂',
    createdAt: new Date('2024-11-15'),
    balance: 3250
  },
  {
    id: 'pt-004',
    loyaltyCardId: 'lc-001',
    type: 'earned',
    points: 180,
    description: 'Purchase: Cat Litter & Toys',
    orderId: 'order-003',
    createdAt: new Date('2024-10-10'),
    expiresAt: new Date('2025-10-10'),
    balance: 3430
  }
];

export const mockLoyaltyRules: LoyaltyRule[] = [
  {
    id: 'rule-001',
    name: 'Standard Points Earning',
    type: 'earning',
    value: 0.1, // 1 point per 10 LKR
    description: 'Earn 1 point for every 10 LKR spent',
    isActive: true
  },
  {
    id: 'rule-002',
    name: 'Double Points Weekend',
    type: 'bonus',
    value: 2,
    description: 'Earn double points on weekends',
    isActive: true,
    conditions: {
      dayOfWeek: [0, 6] // Sunday and Saturday
    }
  },
  {
    id: 'rule-003',
    name: 'Birthday Bonus',
    type: 'bonus',
    value: 1000,
    description: 'Get 1000 bonus points on your birthday',
    isActive: true
  },
  {
    id: 'rule-004',
    name: 'Referral Bonus',
    type: 'bonus',
    value: 500,
    description: 'Earn 500 points for each successful referral',
    isActive: true
  }
];

export const mockBadges: Badge[] = [
  {
    id: 'badge-001',
    name: 'Welcome Paw',
    description: 'Join the Pawsome loyalty family',
    icon: '🐾',
    isLocked: false
  },
  {
    id: 'badge-002',
    name: 'First Purchase',
    description: 'Complete your first order',
    icon: '🛍️',
    requiredOrders: 1,
    isLocked: false,
    unlockedAt: new Date('2024-01-20')
  },
  {
    id: 'badge-003',
    name: 'Point Collector',
    description: 'Earn 1,000 points',
    icon: '⭐',
    requiredPoints: 1000,
    isLocked: false,
    unlockedAt: new Date('2024-03-15')
  },
  {
    id: 'badge-004',
    name: 'Silver Paw',
    description: 'Reach Silver tier',
    icon: '🥈',
    tier: LoyaltyTier.SILVER,
    isLocked: false,
    unlockedAt: new Date('2024-06-10')
  },
  {
    id: 'badge-005',
    name: 'Gold Paw',
    description: 'Reach Gold tier',
    icon: '🥇',
    tier: LoyaltyTier.GOLD,
    isLocked: true
  },
  {
    id: 'badge-006',
    name: 'Pet Parent Pro',
    description: 'Complete 5 orders',
    icon: '👑',
    requiredOrders: 5,
    isLocked: false,
    unlockedAt: new Date('2024-09-20')
  }
];

export const mockReferralBonuses: ReferralBonus[] = [
  {
    referrerId: 'user-001',
    referredUserId: 'user-003',
    pointsAwarded: 500,
    status: 'completed',
    createdAt: new Date('2024-08-15'),
    completedAt: new Date('2024-08-20')
  },
  {
    referrerId: 'user-001',
    referredUserId: 'user-004',
    pointsAwarded: 500,
    status: 'pending',
    createdAt: new Date('2025-01-02')
  }
];

// Sample promotional offers for loyalty members
export const mockLoyaltyOffers = [
  {
    id: 'offer-001',
    title: 'Extra 5% Off for Silver Members',
    description: 'Exclusive discount on all dog food',
    tier: LoyaltyTier.SILVER,
    discount: 5,
    validUntil: new Date('2025-02-28')
  },
  {
    id: 'offer-002',
    title: 'Free Shipping for Gold Members',
    description: 'No minimum order value required',
    tier: LoyaltyTier.GOLD,
    freeShipping: true,
    validUntil: new Date('2025-12-31')
  },
  {
    id: 'offer-003',
    title: 'Double Points on Cat Products',
    description: 'This weekend only!',
    tier: LoyaltyTier.BRONZE,
    pointsMultiplier: 2,
    categories: ['cats'],
    validUntil: new Date('2025-01-14')
  }
];