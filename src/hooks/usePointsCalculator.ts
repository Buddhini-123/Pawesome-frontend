import { useMemo } from 'react';
import { useLoyalty } from './useLoyalty';
import { LOYALTY_CONSTANTS } from '../types/loyalty';

interface PointsCalculation {
  pointsToEarn: number;
  maxRedeemablePoints: number;
  maxRedeemableValue: number;
  valuePerPoint: number;
}

export const usePointsCalculator = (amount: number): PointsCalculation => {
  const { loyaltyCard, calculatePointsForAmount } = useLoyalty();

  return useMemo(() => {
    const pointsToEarn = calculatePointsForAmount(amount);
    const availablePoints = loyaltyCard?.points || 0;
    
    // Can't redeem more than the order total
    const maxRedeemableValue = Math.min(
      availablePoints * LOYALTY_CONSTANTS.REDEMPTION_RATE,
      amount
    );
    const maxRedeemablePoints = Math.floor(maxRedeemableValue / LOYALTY_CONSTANTS.REDEMPTION_RATE);

    return {
      pointsToEarn,
      maxRedeemablePoints,
      maxRedeemableValue,
      valuePerPoint: LOYALTY_CONSTANTS.REDEMPTION_RATE
    };
  }, [amount, loyaltyCard?.points, calculatePointsForAmount]);
};