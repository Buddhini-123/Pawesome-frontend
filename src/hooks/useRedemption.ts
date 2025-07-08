import { useState, useCallback } from 'react';
import { useLoyalty } from './useLoyalty';
import { usePointsCalculator } from './usePointsCalculator';

interface RedemptionState {
  pointsToRedeem: number;
  redemptionValue: number;
  isRedeeming: boolean;
  error: string | null;
}

interface UseRedemptionReturn extends RedemptionState {
  setPointsToRedeem: (points: number) => void;
  redeemPoints: (orderId: string) => Promise<boolean>;
  resetRedemption: () => void;
  canRedeem: boolean;
}

export const useRedemption = (orderTotal: number): UseRedemptionReturn => {
  const { loyaltyCard, redeemPoints: redeemPointsAction } = useLoyalty();
  const { maxRedeemablePoints, valuePerPoint } = usePointsCalculator(orderTotal);
  
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redemptionValue = pointsToRedeem * valuePerPoint;
  const canRedeem = pointsToRedeem > 0 && pointsToRedeem <= maxRedeemablePoints && !isRedeeming;

  const handleSetPointsToRedeem = useCallback((points: number) => {
    const validPoints = Math.max(0, Math.min(points, maxRedeemablePoints));
    setPointsToRedeem(validPoints);
    setError(null);
  }, [maxRedeemablePoints]);

  const redeemPoints = useCallback(async (orderId: string): Promise<boolean> => {
    if (!canRedeem || !loyaltyCard) {
      setError('Cannot redeem points');
      return false;
    }

    setIsRedeeming(true);
    setError(null);

    try {
      const result = await redeemPointsAction(pointsToRedeem, orderId);
      
      if (result.success) {
        // Points redeemed successfully
        return true;
      } else {
        setError('Failed to redeem points');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Redemption failed');
      return false;
    } finally {
      setIsRedeeming(false);
    }
  }, [canRedeem, loyaltyCard, pointsToRedeem, redeemPointsAction]);

  const resetRedemption = useCallback(() => {
    setPointsToRedeem(0);
    setError(null);
    setIsRedeeming(false);
  }, []);

  return {
    pointsToRedeem,
    redemptionValue,
    isRedeeming,
    error,
    setPointsToRedeem: handleSetPointsToRedeem,
    redeemPoints,
    resetRedemption,
    canRedeem
  };
};