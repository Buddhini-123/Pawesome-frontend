import {
  LoyaltyCard,
  PointTransaction,
  LoyaltyRule,
  Badge,
  LoyaltyTier,
  LOYALTY_CONSTANTS,
  TIER_BENEFITS,
  ReferralBonus,
  LoyaltyBalance,
  RedeemPointsResponse
} from '../types/loyalty';
import { User } from '../types';
import { api } from './api';
import { v4 as uuidv4 } from 'uuid';
import {
  mockLoyaltyCards,
  mockPointTransactions,
  mockBadges
} from '../data/mockLoyalty';

/**
 * Error handling utility for loyalty API operations
 * Provides user-friendly error messages for common API failure scenarios
 */
function handleLoyaltyApiError(error: any): string {
  if (error.response?.status === 401) {
    return 'Please log in to use loyalty points';
  }
  if (error.response?.status === 403) {
    return 'Insufficient loyalty points or unauthorized action';
  }
  if (error.response?.status === 422) {
    return error.response.data.message || 'Invalid loyalty request';
  }
  if (error.response?.status >= 500) {
    return 'Loyalty service temporarily unavailable. Your order will still be processed.';
  }
  return 'An unexpected error occurred with loyalty points';
}

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
      // Call the current user's card endpoint (no userId param needed)
      const response = await api.request<{
        user: {
          id: number;
          name: string;
          email: string;
          member_since: string;
        };
        card: {
          card_number: string;
          tier: string;
          tier_code: string;
          current_points: number;
          lifetime_earned: number;
          expiring_soon: number;
          expiry_warning_days: number;
        };
        tier_progress: {
          current_tier: string;
          next_tier: string;
          points_to_next_tier: number;
          progress_percentage: number;
        };
        benefits: {
          multiplier: string;
          perks: string[];
        };
        qr_code_data: any;
      }>('/loyalty/card');

      if (response.success && response.data) {
        // Backend returns {success: true, data: {user, card, ...}}
        // api.request wraps it, so response.data contains the backend's full response
        const backendResponse = response.data as any;

        // Extract the actual data from the nested structure
        const backendData = backendResponse.data || backendResponse;

        // Transform backend response to frontend LoyaltyCard type
        const transformedCard: LoyaltyCard = {
          id: backendData.card?.card_number || 'unknown', // Use card number as ID
          userId: backendData.user?.id?.toString() || '',
          cardNumber: backendData.card?.card_number || '',
          points: backendData.card?.current_points ?? 0, // Use nullish coalescing for 0 values
          tier: this.mapTierToEnum(backendData.card?.tier_code || 'bronze'),
          joinDate: backendData.user?.member_since ? new Date(backendData.user.member_since) : new Date(),
          totalEarned: backendData.card?.lifetime_earned ?? 0,
          totalRedeemed: 0, // Backend doesn't provide this yet
          totalDonated: 0, // Backend doesn't provide this yet
          lastActivity: new Date(), // Backend doesn't provide this yet
          isActive: true
        };

        console.log('[LoyaltyService] Loyalty card loaded - Points:', transformedCard.points);
        return transformedCard;
      }
      return null;
    } catch (error: any) {
      // Silently handle 404 - endpoint not implemented yet on backend
      // Fall back to localStorage implementation
      if (error.response?.status === 404) {
        console.log('[LoyaltyService] Using localStorage for loyalty card (backend endpoint not available)');
      } else {
        console.warn('[LoyaltyService] Error fetching loyalty card from backend:', error.message);
      }

      // Fallback to localStorage implementation
      const cards = this.getAllLoyaltyCards();
      return cards.find(card => card.userId === userId) || null;
    }
  }

  // Helper method to map backend tier strings to frontend enum
  private mapTierToEnum(tierCode: string): LoyaltyTier {
    const tierMap: Record<string, LoyaltyTier> = {
      'bronze': LoyaltyTier.BRONZE,
      'silver': LoyaltyTier.SILVER,
      'gold': LoyaltyTier.GOLD,
      'platinum': LoyaltyTier.PLATINUM
    };
    return tierMap[tierCode.toLowerCase()] || LoyaltyTier.BRONZE;
  }

  /**
   * Get loyalty balance with expiry information from backend API
   * GET /api/loyalty/points
   * Requires authentication (bearer token)
   */
  async getLoyaltyBalance(): Promise<LoyaltyBalance> {
    const response = await api.request<LoyaltyBalance>('/loyalty/points', {
      method: 'GET'
    });

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to fetch loyalty balance');
  }

  /**
   * Redeem loyalty points for checkout discount
   * POST /api/loyalty/redeem
   * Requires authentication (bearer token)
   *
   * @param points Number of points to redeem
   * @param orderId Order ID for tracking
   * @param reason Redemption reason (default: 'Order discount')
   * @returns Redemption response with points redeemed and new balance
   */
  async redeemPoints(
    points: number,
    orderId: string,
    reason: string = 'Order discount'
  ): Promise<RedeemPointsResponse> {
    try {
      const response = await api.request<RedeemPointsResponse>('/loyalty/redeem', {
        method: 'POST',
        body: {
          points,
          order_id: orderId,
          reason
        }
      });

      if (response.success && response.data) {
        // Refresh loyalty balance after redemption
        await this.getLoyaltyBalance();

        return response.data;
      }

      throw new Error('Failed to redeem points');
    } catch (error: any) {
      console.error('Point redemption failed:', error);
      throw new Error(handleLoyaltyApiError(error));
    }
  }

  /**
   * Get available loyalty rewards from catalog
   * GET /api/loyalty/rewards
   * Requires authentication (bearer token)
   *
   * @param filters Optional filters (tier, type, affordable_only, max_points)
   * @returns List of available rewards
   */
  async getRewards(filters?: {
    tier?: string;
    type?: string;
    affordable_only?: boolean;
    max_points?: number;
  }): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.tier) queryParams.append('tier', filters.tier);
      if (filters?.type) queryParams.append('type', filters.type);
      if (filters?.affordable_only) queryParams.append('affordable_only', 'true');
      if (filters?.max_points) queryParams.append('max_points', filters.max_points.toString());

      const url = `/loyalty/rewards${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await api.request<any>(url, {
        method: 'GET'
      });

      if (response.success && response.data) {
        // Backend returns { status: 'success', data: { rewards: [...], ... } }
        // api.request wraps it, so response.data is the full backend body
        const backendResponse = response.data as any;
        return backendResponse.data || backendResponse;
      }

      throw new Error('Failed to fetch rewards');
    } catch (error: any) {
      console.error('Failed to fetch rewards:', error);
      throw new Error(handleLoyaltyApiError(error));
    }
  }

  /**
   * Redeem a specific loyalty reward
   * POST /api/loyalty/redeem
   * Requires authentication (bearer token)
   *
   * @param rewardId ID of the reward to redeem
   * @returns Redemption details including reward code and expiration
   */
  async redeemReward(rewardId: number): Promise<any> {
    try {
      const response = await api.request<any>('/loyalty/redeem', {
        method: 'POST',
        body: {
          reward_id: rewardId
        }
      });

      if (response.success && response.data) {
        // Refresh loyalty balance after redemption
        await this.getLoyaltyBalance();

        return response.data;
      }

      throw new Error('Failed to redeem reward');
    } catch (error: any) {
      console.error('Reward redemption failed:', error);
      const message = error.response?.data?.message || handleLoyaltyApiError(error);
      throw new Error(message);
    }
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

  /**
   * Get paginated points history from backend API
   * GET /api/loyalty/history?page={page}
   *
   * @param page - Page number (default: 1)
   * @returns Paginated transaction data with metadata
   */
  async getPointsHistory(page: number = 1): Promise<{
    data: PointTransaction[];
    meta: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  }> {
    try {
      const response = await api.request<any>(`/loyalty/history?page=${page}`, {
        method: 'GET'
      });

      console.log('[LoyaltyService] Transaction history - success:', response.success);

      if (response.success && response.data) {
        // Backend returns {success: true, data: {data: [...], meta: {...}}}
        // api.request wraps it, so we need to access the nested data
        const apiResponse = response.data as any;

        // Check if apiResponse itself has a 'data' property (double nested)
        const backendData = (apiResponse.data !== undefined) ? apiResponse.data : apiResponse;

        // Transform backend response to frontend PointTransaction type
        const transactions = Array.isArray(backendData.data) ? backendData.data :
                           Array.isArray(backendData) ? backendData : [];

        console.log('[LoyaltyService] Transactions count:', transactions.length);

        const transformedData: PointTransaction[] = transactions.map((tx: any) => ({
          id: tx.id?.toString() || '',
          loyaltyCardId: '', // Backend doesn't send this, frontend doesn't need it for display
          type: tx.type as 'earned' | 'redeemed' | 'expired' | 'donated' | 'bonus',
          points: tx.points || 0,
          description: tx.description || '',
          createdAt: tx.created_at ? new Date(tx.created_at) : new Date(),
          expiresAt: tx.expires_at ? new Date(tx.expires_at) : undefined,
          orderId: tx.reference?.id?.toString(),
          balance: 0 // Backend doesn't send balance per transaction in ledger endpoint
        }));

        const meta = backendData.meta || { current_page: 1, per_page: 20, total: 0 };

        return {
          data: transformedData,
          meta: {
            current_page: meta.current_page || 1,
            per_page: meta.per_page || 20,
            total: meta.total || 0,
            last_page: Math.ceil((meta.total || 0) / (meta.per_page || 20)) || 1
          }
        };
      }

      console.log('[LoyaltyService] No data in response');
      // Fallback to empty data
      return {
        data: [],
        meta: {
          current_page: 1,
          per_page: 20,
          total: 0,
          last_page: 1
        }
      };
    } catch (error: any) {
      console.error('[LoyaltyService] Transaction history error:', error.message);
      // Return empty data on error with proper structure
      return {
        data: [],
        meta: {
          current_page: 1,
          per_page: 20,
          total: 0,
          last_page: 1
        }
      };
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

  /**
   * Earn loyalty points for a completed order
   * POST /api/loyalty/earn
   * This should be called after order is successfully created and paid
   *
   * @param orderId - The order ID
   * @param amountPaid - Total amount paid for the order
   * @returns Transaction details with points earned
   */
  async earnPointsForOrder(orderId: number | string, amountPaid: number): Promise<{
    points_earned: number;
    new_balance: number;
    transaction_id: number;
  }> {
    try {
      const response = await api.request<{
        points_earned: number;
        new_balance: number;
        transaction_id: number;
      }>('/loyalty/earn', {
        method: 'POST',
        body: {
          order_id: orderId,
          amount_paid: amountPaid
        }
      });

      if (response.success && response.data) {
        const result = (response.data as any).data || response.data;
        console.log('[LoyaltyService] Points earned:', result.points_earned);
        return result;
      }

      throw new Error('Failed to earn points');
    } catch (error: any) {
      console.error('[LoyaltyService] Failed to earn points for order:', error.message);
      throw error;
    }
  }

  // Award points for order (legacy method - kept for backwards compatibility)
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


  // Check and handle expiring points
  async checkExpiringPoints(loyaltyCardId: string): Promise<number> {
    // Note: This method is deprecated as backend now provides expiring points via /api/loyalty/balance
    // Keeping for backward compatibility
    const historyResponse = await this.getPointsHistory(1);
    const transactions = historyResponse.data;
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
    const historyResponse = await this.getPointsHistory(1);
    const transactions = historyResponse.data;
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