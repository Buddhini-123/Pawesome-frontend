import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  LoyaltyCard, 
  PointTransaction, 
  Badge, 
  LoyaltyTier, 
  TIER_BENEFITS,
  LoyaltyTierBenefits
} from '../types/loyalty';
import { useAuth } from '../hooks/useAuth';
import { loyaltyService } from '../services/loyalty.service';

interface LoyaltyContextType {
  loyaltyCard: LoyaltyCard | null;
  pointsHistory: PointTransaction[];
  badges: Badge[];
  tierBenefits: LoyaltyTierBenefits | null;
  isLoading: boolean;
  error: string | null;
  // Actions
  registerLoyaltyCard: () => Promise<void>;
  refreshLoyaltyData: () => Promise<void>;
  calculatePointsForAmount: (amount: number, isPromotion?: boolean) => number;
  redeemPoints: (points: number, orderId: string) => Promise<{ success: boolean; value: number }>;
  awardPointsForOrder: (orderId: string, amount: number, description: string) => Promise<void>;
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

export const useLoyalty = () => {
  const context = useContext(LoyaltyContext);
  if (!context) {
    throw new Error('useLoyalty must be used within LoyaltyProvider');
  }
  return context;
};

interface LoyaltyProviderProps {
  children: ReactNode;
}

export const LoyaltyProvider: React.FC<LoyaltyProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [loyaltyCard, setLoyaltyCard] = useState<LoyaltyCard | null>(null);
  const [pointsHistory, setPointsHistory] = useState<PointTransaction[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get tier benefits
  const tierBenefits = loyaltyCard 
    ? TIER_BENEFITS.find(b => b.tier === loyaltyCard.tier) || null
    : null;

  // Load loyalty data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshLoyaltyData();
    } else {
      // Clear loyalty data when user logs out
      setLoyaltyCard(null);
      setPointsHistory([]);
      setBadges([]);
    }
  }, [isAuthenticated, user]);

  // Check for birthday bonus
  useEffect(() => {
    if (loyaltyCard && user) {
      const checkBirthdayBonus = async () => {
        await loyaltyService.awardBirthdayBonus(user.id, user);
        // Refresh data to show any new bonus
        refreshLoyaltyData();
      };
      checkBirthdayBonus();
    }
  }, [loyaltyCard, user]);

  const refreshLoyaltyData = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get loyalty card
      let card = await loyaltyService.getLoyaltyCard(user.id);
      
      // If no card exists and user has loyaltyCardId, try to get by that ID
      if (!card && user.loyaltyCardId) {
        const cards = JSON.parse(localStorage.getItem('loyaltyCards') || '[]');
        card = cards.find((c: LoyaltyCard) => c.id === user.loyaltyCardId) || null;
      }

      if (card) {
        setLoyaltyCard(card);
        
        // Get points history
        const history = await loyaltyService.getPointsHistory(card.id);
        setPointsHistory(history);
        
        // Get badges
        const userBadges = await loyaltyService.getUserBadges(card.id);
        setBadges(userBadges);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load loyalty data');
    } finally {
      setIsLoading(false);
    }
  };

  const registerLoyaltyCard = async () => {
    if (!user) {
      setError('User must be logged in to register for loyalty program');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const card = await loyaltyService.registerLoyaltyCard(user.id);
      setLoyaltyCard(card);
      
      // Update user's loyaltyCardId (in real app, this would be done on backend)
      user.loyaltyCardId = card.id;
      
      // Get initial badges
      const userBadges = await loyaltyService.getUserBadges(card.id);
      setBadges(userBadges);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register loyalty card');
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePointsForAmount = (amount: number, isPromotion = false): number => {
    if (!loyaltyCard) return 0;
    return loyaltyService.calculatePoints(amount, loyaltyCard.tier, isPromotion);
  };

  const redeemPoints = async (
    points: number, 
    orderId: string
  ): Promise<{ success: boolean; value: number }> => {
    if (!loyaltyCard) {
      return { success: false, value: 0 };
    }

    try {
      const result = await loyaltyService.redeemPoints(loyaltyCard.id, points, orderId);
      
      if (result.success) {
        // Refresh loyalty data to update balance
        await refreshLoyaltyData();
      }
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to redeem points');
      return { success: false, value: 0 };
    }
  };

  const awardPointsForOrder = async (
    orderId: string, 
    amount: number, 
    description: string
  ): Promise<void> => {
    if (!loyaltyCard) return;

    try {
      await loyaltyService.awardPoints(loyaltyCard.id, orderId, amount, description);
      // Refresh loyalty data to update balance
      await refreshLoyaltyData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to award points');
    }
  };

  const value: LoyaltyContextType = {
    loyaltyCard,
    pointsHistory,
    badges,
    tierBenefits,
    isLoading,
    error,
    registerLoyaltyCard,
    refreshLoyaltyData,
    calculatePointsForAmount,
    redeemPoints,
    awardPointsForOrder
  };

  return (
    <LoyaltyContext.Provider value={value}>
      {children}
    </LoyaltyContext.Provider>
  );
};

export default LoyaltyContext;