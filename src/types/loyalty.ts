// Loyalty Program Type Definitions

export interface LoyaltyCard {
  id: string;
  userId: string;
  cardNumber: string;
  points: number;
  tier: LoyaltyTier;
  joinDate: Date;
  totalEarned: number;
  totalRedeemed: number;
  totalDonated: number;
  lastActivity: Date;
  isActive: boolean;
}

export enum LoyaltyTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM'
}

export interface LoyaltyTierBenefits {
  tier: LoyaltyTier;
  minPoints: number;
  benefits: string[];
  additionalDiscount: number; // percentage
  freeShippingThreshold: number;
  pointsMultiplier: number;
}

export interface PointTransaction {
  id: string;
  loyaltyCardId: string;
  type: 'earned' | 'redeemed' | 'expired' | 'donated' | 'bonus';
  points: number;
  description: string;
  orderId?: string;
  createdAt: Date;
  expiresAt?: Date;
  balance: number; // Balance after transaction
}

export interface LoyaltyRule {
  id: string;
  name: string;
  type: 'earning' | 'redemption' | 'bonus';
  value: number;
  description: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  conditions?: {
    minOrderValue?: number;
    maxPoints?: number;
    categories?: string[];
    dayOfWeek?: number[];
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredPoints?: number;
  requiredOrders?: number;
  requiredReferrals?: number;
  tier?: LoyaltyTier;
  isLocked: boolean;
  unlockedAt?: Date;
}

export interface ReferralBonus {
  referrerId: string;
  referredUserId: string;
  pointsAwarded?: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
}

/**
 * Loyalty balance response from backend API
 * GET /api/loyalty/balance
 */
export interface LoyaltyBalance {
  balance: number;
  expiring_soon: number;
  expiry_date: string;
}

/**
 * Redeem points request payload
 * POST /api/loyalty/redeem
 */
export interface RedeemPointsRequest {
  points: number;
  order_id: string;
  reason: string;
}

/**
 * Redeem points response from backend API
 * POST /api/loyalty/redeem
 */
export interface RedeemPointsResponse {
  message: string;
  points_redeemed: number;
  new_balance: number;
}

/**
 * Earn points request payload
 * POST /api/loyalty/earn
 */
export interface EarnPointsRequest {
  order_id: number;
  amount_paid: number;
}

/**
 * Earn points response from backend API
 * POST /api/loyalty/earn
 */
export interface EarnPointsResponse {
  message: string;
  points_earned: number;
  new_balance: number;
}

export interface MarketingPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  promotionalEmails: boolean;
  pointsExpiryAlerts: boolean;
  exclusiveOffers: boolean;
}

export interface LoyaltyStats {
  totalMembers: number;
  activeMembers: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  totalPointsDonated: number;
  averagePointsPerMember: number;
  topTierDistribution: {
    [key in LoyaltyTier]: number;
  };
}

// Constants
export const LOYALTY_CONSTANTS = {
  POINTS_PER_LKR: 0.01, // 1 point per 100 LKR (matching backend earning rate)
  REDEMPTION_RATE: 1, // 1 point = 1 LKR (1% cashback rate - balanced earning/redemption)
  MIN_POINTS_BALANCE: 100, // Minimum points that won't expire
  POINTS_VALIDITY_MONTHS: 12,
  REFERRAL_BONUS_POINTS: 500,
  BIRTHDAY_BONUS_POINTS: 1000,
  ANNIVERSARY_BONUS_POINTS: 2000,
};

// Tier thresholds and benefits
export const TIER_BENEFITS: LoyaltyTierBenefits[] = [
  {
    tier: LoyaltyTier.BRONZE,
    minPoints: 0,
    benefits: [
      'Earn 1 point per 10 LKR spent',
      'Birthday bonus points',
      'Exclusive member offers'
    ],
    additionalDiscount: 0,
    freeShippingThreshold: 2000,
    pointsMultiplier: 1
  },
  {
    tier: LoyaltyTier.SILVER,
    minPoints: 5000,
    benefits: [
      'Earn 1.5 points per 10 LKR spent',
      'Birthday & anniversary bonus points',
      'Early access to sales',
      '5% additional discount on deals'
    ],
    additionalDiscount: 5,
    freeShippingThreshold: 1500,
    pointsMultiplier: 1.5
  },
  {
    tier: LoyaltyTier.GOLD,
    minPoints: 15000,
    benefits: [
      'Earn 2 points per 10 LKR spent',
      'Double birthday & anniversary bonus',
      'Priority customer support',
      '10% additional discount on deals',
      'Free shipping on all orders'
    ],
    additionalDiscount: 10,
    freeShippingThreshold: 0,
    pointsMultiplier: 2
  },
  {
    tier: LoyaltyTier.PLATINUM,
    minPoints: 30000,
    benefits: [
      'Earn 3 points per 10 LKR spent',
      'Triple birthday & anniversary bonus',
      'VIP customer support',
      '15% additional discount on deals',
      'Free shipping + priority delivery',
      'Exclusive VIP events'
    ],
    additionalDiscount: 15,
    freeShippingThreshold: 0,
    pointsMultiplier: 3
  }
];