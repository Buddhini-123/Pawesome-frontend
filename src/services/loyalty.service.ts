import {
  LoyaltyCard,
  PointTransaction,
  LoyaltyRule,
  Badge,
  LoyaltyTier,
  LOYALTY_CONSTANTS,
  TIER_BENEFITS,
  ReferralBonus,
  LoyaltyBalance
} from '../types/loyalty';
import { User } from '../types';
import { api } from './api';
import { v4 as uuidv4 } from 'uuid';
import { 
  mockLoyaltyCards, 
  mockPointTransactions,
  mockBadges 
} from '../data/mockLoyalty';

class LoyaltyService {
  constructor() {
    this.initializeData();
  }

  // Initialize mock data if not already present
  private initializeData(): void {
    // Check if loyalty cards already exist in localStorage
    const existingCards = localStorage.getItem('loyaltyCards');
    if (!existingCards) {
      // Initialize with mock data
      localStorage.setItem('loyaltyCards', JSON.stringify(mockLoyaltyCards));
      console.log('Initialized loyalty cards with mock data');
    }

    // Check if loyalty transactions already exist
    const existingTransactions = localStorage.getItem('loyaltyTransactions');
    if (!existingTransactions) {
      localStorage.setItem('loyaltyTransactions', JSON.stringify(mockPointTransactions));
      console.log('Initialized loyalty transactions with mock data');
    }

    // Fix existing demo user if they don't have a loyalty card ID
    this.linkDemoUserToLoyaltyCard();
  }

  // Helper method to link existing demo user to their loyalty card
  private linkDemoUserToLoyaltyCard(): void {
    try {
      const authUser = localStorage.getItem('auth_user');
      if (authUser) {
        const user = JSON.parse(authUser);
        if (user.id === 'demo-user-1' && !user.loyaltyCardId) {
          user.loyaltyCardId = 'lc-001';
          localStorage.setItem('auth_user', JSON.stringify(user));
          console.log('Linked demo user to loyalty card');
        }
      }

      // Also update in mockDb users
      const mockDbUsers = localStorage.getItem('mockDb_users');
      if (mockDbUsers) {
        const users = JSON.parse(mockDbUsers);
        const userArray = users.map(([id, userData]: [string, any]) => {
          if (id === 'demo-user-1' && !userData.loyaltyCardId) {
            userData.loyaltyCardId = 'lc-001';
          }
          return [id, userData];
        });
        localStorage.setItem('mockDb_users', JSON.stringify(userArray));
      }
    } catch (error) {
      console.warn('Could not link demo user to loyalty card:', error);
    }
  }

  // Register new loyalty card
  async registerLoyaltyCard(userId: string): Promise<LoyaltyCard> {
    try {
      const response = await api.request<LoyaltyCard>('/loyalty/register', {
        method: 'POST',
        body: { userId }
      });

      if (response.success && response.data) {
        return response.data;
      }
      throw new Error('Failed to register loyalty card');
    } catch (error) {
      // Mock implementation for development
      const newCard: LoyaltyCard = {
        id: uuidv4(),
        userId,
        cardNumber: this.generateCardNumber(),
        points: 0,
        tier: LoyaltyTier.BRONZE,
        joinDate: new Date(),
        totalEarned: 0,
        totalRedeemed: 0,
        totalDonated: 0,
        lastActivity: new Date(),
        isActive: true
      };
      
      // Store in localStorage for mock persistence
      this.saveLoyaltyCard(newCard);
      
      // Check for referral code and award bonus to referrer
      const referralCode = localStorage.getItem('pawsome_referral_code');
      if (referralCode) {
        // Extract card number from referral code (format: PAW1234)
        const referrerCardNumber = referralCode.replace('PAW', '');
        
        // Find referrer's loyalty card
        const allCards = this.getAllLoyaltyCards();
        const referrerCard = allCards.find(card => card.cardNumber.endsWith(referrerCardNumber));
        
        if (referrerCard) {
          // Award referral bonus to referrer (will be processed when friend makes first order)
          const referralBonus: ReferralBonus = {
            referrerId: referrerCard.userId,
            referredUserId: userId,
            status: 'pending',
            createdAt: new Date()
          };
          
          // Store referral bonus for later processing
          const existingBonuses = JSON.parse(localStorage.getItem('pawsome_referral_bonuses') || '[]');
          existingBonuses.push(referralBonus);
          localStorage.setItem('pawsome_referral_bonuses', JSON.stringify(existingBonuses));
          
          // Clear the referral code
          localStorage.removeItem('pawsome_referral_code');
        }
      }
      
      return newCard;
    }
  }

  // Get loyalty card by user ID
  async getLoyaltyCard(userId: string): Promise<LoyaltyCard | null> {
    try {
      const response = await api.request<LoyaltyCard>(`/loyalty/card/${userId}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      // Mock implementation
      const cards = this.getAllLoyaltyCards();
      return cards.find(card => card.userId === userId) || null;
    }
  }

  /**
   * Get loyalty balance with expiry information from backend API
   * GET /api/loyalty/balance
   * Requires authentication (bearer token)
   */
  async getLoyaltyBalance(): Promise<LoyaltyBalance> {
    const response = await api.request<LoyaltyBalance>('/loyalty/balance', {
      method: 'GET'
    });

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to fetch loyalty balance');
  }

  // Get points balance
  async getPointsBalance(loyaltyCardId: string): Promise<number> {
    try {
      const response = await api.request<{ balance: number }>(`/loyalty/balance/${loyaltyCardId}`);

      if (response.success && response.data) {
        return response.data.balance;
      }
      return 0;
    } catch (error) {
      // Mock implementation
      const card = this.getLoyaltyCardById(loyaltyCardId);
      return card?.points || 0;
    }
  }

  // Get points history
  async getPointsHistory(loyaltyCardId: string, limit = 50): Promise<PointTransaction[]> {
    try {
      const response = await api.request<PointTransaction[]>(`/loyalty/history/${loyaltyCardId}?limit=${limit}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      // Mock implementation
      const transactions = this.getStoredTransactions();
      return transactions
        .filter(t => t.loyaltyCardId === loyaltyCardId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limit);
    }
  }

  // Calculate points for order
  calculatePoints(
    orderTotal: number, 
    tier: LoyaltyTier = LoyaltyTier.BRONZE, 
    isPromotion = false
  ): number {
    const tierBenefit = TIER_BENEFITS.find(b => b.tier === tier);
    const multiplier = tierBenefit?.pointsMultiplier || 1;
    const basePoints = Math.floor(orderTotal * LOYALTY_CONSTANTS.POINTS_PER_LKR);
    const finalPoints = Math.floor(basePoints * multiplier * (isPromotion ? 2 : 1));
    
    return finalPoints;
  }

  // Award points for order
  async awardPoints(
    loyaltyCardId: string, 
    orderId: string, 
    amount: number, 
    description: string
  ): Promise<PointTransaction> {
    try {
      const response = await api.request<PointTransaction>('/loyalty/award', {
        method: 'POST',
        body: {
          loyaltyCardId,
          orderId,
          amount,
          description
        }
      });

      if (response.success && response.data) {
        return response.data;
      }
      throw new Error('Failed to award points');
    } catch (error) {
      // Mock implementation
      const card = this.getLoyaltyCardById(loyaltyCardId);
      if (!card) throw new Error('Loyalty card not found');

      const points = this.calculatePoints(amount, card.tier);
      const transaction: PointTransaction = {
        id: uuidv4(),
        loyaltyCardId,
        type: 'earned',
        points,
        description,
        orderId,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + LOYALTY_CONSTANTS.POINTS_VALIDITY_MONTHS * 30 * 24 * 60 * 60 * 1000),
        balance: card.points + points
      };

      // Update card
      card.points += points;
      card.totalEarned += points;
      card.lastActivity = new Date();
      this.updateTier(card);
      
      // Save changes
      this.saveLoyaltyCard(card);
      this.saveTransaction(transaction);
      
      return transaction;
    }
  }

  // Redeem points
  async redeemPoints(
    loyaltyCardId: string, 
    points: number, 
    orderId: string
  ): Promise<{ success: boolean; value: number; transaction?: PointTransaction }> {
    try {
      const response = await api.request<{ success: boolean; value: number; transaction: PointTransaction }>(
        '/loyalty/redeem',
        {
          method: 'POST',
          body: {
            loyaltyCardId,
            points,
            orderId
          }
        }
      );

      if (response.success && response.data) {
        return response.data;
      }
      throw new Error('Failed to redeem points');
    } catch (error) {
      // Mock implementation
      const card = this.getLoyaltyCardById(loyaltyCardId);
      if (!card) throw new Error('Loyalty card not found');
      
      if (card.points < points) {
        return { success: false, value: 0 };
      }

      const value = points * LOYALTY_CONSTANTS.REDEMPTION_RATE;
      const transaction: PointTransaction = {
        id: uuidv4(),
        loyaltyCardId,
        type: 'redeemed',
        points: -points,
        description: `Redeemed for order #${orderId}`,
        orderId,
        createdAt: new Date(),
        balance: card.points - points
      };

      // Update card
      card.points -= points;
      card.totalRedeemed += points;
      card.lastActivity = new Date();
      
      // Save changes
      this.saveLoyaltyCard(card);
      this.saveTransaction(transaction);
      
      return { success: true, value, transaction };
    }
  }

  // Check and handle expiring points
  async checkExpiringPoints(loyaltyCardId: string): Promise<number> {
    const transactions = await this.getPointsHistory(loyaltyCardId, 1000);
    const now = new Date();
    let expiringPoints = 0;

    for (const transaction of transactions) {
      if (
        transaction.type === 'earned' && 
        transaction.expiresAt && 
        transaction.expiresAt <= now &&
        transaction.points > 0
      ) {
        expiringPoints += transaction.points;
      }
    }

    return expiringPoints;
  }

  // Donate expiring points
  async donateExpiringPoints(loyaltyCardId: string): Promise<PointTransaction | null> {
    const card = this.getLoyaltyCardById(loyaltyCardId);
    if (!card) return null;

    const expiringPoints = await this.checkExpiringPoints(loyaltyCardId);
    const pointsToDonate = Math.max(0, card.points - LOYALTY_CONSTANTS.MIN_POINTS_BALANCE);

    if (pointsToDonate > 0) {
      const transaction: PointTransaction = {
        id: uuidv4(),
        loyaltyCardId,
        type: 'donated',
        points: -pointsToDonate,
        description: 'Points donated to pet adoption and welfare centers',
        createdAt: new Date(),
        balance: LOYALTY_CONSTANTS.MIN_POINTS_BALANCE
      };

      // Update card
      card.points = LOYALTY_CONSTANTS.MIN_POINTS_BALANCE;
      card.totalDonated += pointsToDonate;
      card.lastActivity = new Date();
      
      // Save changes
      this.saveLoyaltyCard(card);
      this.saveTransaction(transaction);
      
      return transaction;
    }

    return null;
  }

  // Award birthday bonus
  async awardBirthdayBonus(userId: string, user: User): Promise<PointTransaction | null> {
    const card = await this.getLoyaltyCard(userId);
    if (!card || !user.birthDate) return null;

    const today = new Date();
    const birthday = new Date(user.birthDate);
    
    if (
      today.getMonth() === birthday.getMonth() && 
      today.getDate() === birthday.getDate()
    ) {
      const tier = TIER_BENEFITS.find(b => b.tier === card.tier);
      const multiplier = tier?.tier === LoyaltyTier.GOLD ? 2 : tier?.tier === LoyaltyTier.PLATINUM ? 3 : 1;
      const bonusPoints = LOYALTY_CONSTANTS.BIRTHDAY_BONUS_POINTS * multiplier;

      const transaction: PointTransaction = {
        id: uuidv4(),
        loyaltyCardId: card.id,
        type: 'bonus',
        points: bonusPoints,
        description: 'Happy Birthday! Enjoy your bonus points 🎂',
        createdAt: new Date(),
        balance: card.points + bonusPoints
      };

      // Update card
      card.points += bonusPoints;
      card.totalEarned += bonusPoints;
      card.lastActivity = new Date();
      this.updateTier(card);
      
      // Save changes
      this.saveLoyaltyCard(card);
      this.saveTransaction(transaction);
      
      return transaction;
    }

    return null;
  }

  // Award referral bonus
  async awardReferralBonus(
    referrerId: string, 
    referredEmail: string
  ): Promise<ReferralBonus> {
    const referrerCard = await this.getLoyaltyCard(referrerId);
    if (!referrerCard) throw new Error('Referrer loyalty card not found');

    const bonus: ReferralBonus = {
      referrerId,
      referredUserId: '', // Will be updated when referred user registers
      pointsAwarded: LOYALTY_CONSTANTS.REFERRAL_BONUS_POINTS,
      status: 'pending',
      createdAt: new Date()
    };

    // Store referral bonus (would be in database in real app)
    this.saveReferralBonus(bonus);
    
    return bonus;
  }

  // Get user badges
  async getUserBadges(loyaltyCardId: string): Promise<Badge[]> {
    const card = this.getLoyaltyCardById(loyaltyCardId);
    if (!card) return [];

    const allBadges = this.getAllBadges();
    const transactions = await this.getPointsHistory(loyaltyCardId, 1000);
    const orderCount = new Set(transactions.filter(t => t.orderId).map(t => t.orderId)).size;

    return allBadges.map(badge => {
      let isUnlocked = false;
      
      if (badge.requiredPoints && card.totalEarned >= badge.requiredPoints) {
        isUnlocked = true;
      }
      if (badge.requiredOrders && orderCount >= badge.requiredOrders) {
        isUnlocked = true;
      }
      if (badge.tier && this.compareTiers(card.tier, badge.tier) >= 0) {
        isUnlocked = true;
      }

      return {
        ...badge,
        isLocked: !isUnlocked,
        unlockedAt: isUnlocked ? new Date() : undefined
      };
    });
  }

  // Private helper methods
  private generateCardNumber(): string {
    const prefix = 'PAW';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${timestamp}${random}`;
  }

  private updateTier(card: LoyaltyCard): void {
    for (let i = TIER_BENEFITS.length - 1; i >= 0; i--) {
      if (card.totalEarned >= TIER_BENEFITS[i].minPoints) {
        card.tier = TIER_BENEFITS[i].tier;
        break;
      }
    }
  }

  private compareTiers(tier1: LoyaltyTier, tier2: LoyaltyTier): number {
    const tierOrder = [LoyaltyTier.BRONZE, LoyaltyTier.SILVER, LoyaltyTier.GOLD, LoyaltyTier.PLATINUM];
    return tierOrder.indexOf(tier1) - tierOrder.indexOf(tier2);
  }

  // Mock storage methods
  private saveLoyaltyCard(card: LoyaltyCard): void {
    const cards = this.getAllLoyaltyCards();
    const index = cards.findIndex(c => c.id === card.id);
    if (index >= 0) {
      cards[index] = card;
    } else {
      cards.push(card);
    }
    localStorage.setItem('loyaltyCards', JSON.stringify(cards));
  }

  private getAllLoyaltyCards(): LoyaltyCard[] {
    const stored = localStorage.getItem('loyaltyCards');
    return stored ? JSON.parse(stored) : [];
  }

  private getLoyaltyCardById(id: string): LoyaltyCard | null {
    const cards = this.getAllLoyaltyCards();
    return cards.find(card => card.id === id) || null;
  }

  private saveTransaction(transaction: PointTransaction): void {
    const transactions = this.getStoredTransactions();
    transactions.push(transaction);
    localStorage.setItem('loyaltyTransactions', JSON.stringify(transactions));
  }

  private getStoredTransactions(): PointTransaction[] {
    const stored = localStorage.getItem('loyaltyTransactions');
    return stored ? JSON.parse(stored) : [];
  }

  private saveReferralBonus(bonus: ReferralBonus): void {
    const bonuses = this.getStoredReferralBonuses();
    bonuses.push(bonus);
    localStorage.setItem('referralBonuses', JSON.stringify(bonuses));
  }

  private getStoredReferralBonuses(): ReferralBonus[] {
    const stored = localStorage.getItem('referralBonuses');
    return stored ? JSON.parse(stored) : [];
  }

  private getAllBadges(): Badge[] {
    return mockBadges;
  }
}

export const loyaltyService = new LoyaltyService();