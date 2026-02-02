# React API Integration with Error Handling & Loading States

## Type
development

## Applies To
tiny, medium, large, mega

## Keywords
react, typescript, api-integration, error-handling, loading-states, useEffect, hooks

## Description

Implement clean React component patterns for API integration with robust error handling, loading states, and user feedback mechanisms using React hooks and custom hooks.

## Implementation

### 1. Custom Hook for API Calls

Create reusable hook for API operations with error and loading state:

```typescript
// src/hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
): UseApiState<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await fetchFn();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState({ data: null, loading: false, error: errorMessage });
    }
  }, [fetchFn]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return state;
}
```

### 2. Component with Loading and Error States

Implement proper UI states in React component:

```typescript
// src/components/LoyaltyDashboard.tsx
import React from 'react';
import { useApi } from '../hooks/useApi';
import { loyaltyService } from '../services/loyalty.service';
import LoadingSkeleton from './ui/LoadingSkeleton';
import ErrorAlert from './ui/ErrorAlert';
import { LoyaltyBalance } from '../types/loyalty';

export const LoyaltyDashboard: React.FC = () => {
  // Fetch loyalty balance using custom hook
  const { data: balance, loading, error } = useApi<LoyaltyBalance>(
    () => loyaltyService.getLoyaltyBalance(),
    [] // Dependency array - refetch on deps change
  );

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton height={200} className="rounded-lg" />
        <LoadingSkeleton height={100} className="rounded-lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorAlert
        title="Failed to Load Loyalty Balance"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Success state
  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold mb-4">Loyalty Balance</h2>
      <div className="text-4xl font-bold text-blue-600">
        {balance?.balance || 0} Points
      </div>
      <p className="text-gray-600 mt-2">
        Expires: {balance?.expiry_date}
      </p>
      {balance?.expiring_soon > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            ⚠️ {balance.expiring_soon} points expiring soon
          </p>
        </div>
      )}
    </div>
  );
};
```

### 3. Error Alert Component

Create reusable error display component:

```typescript
// src/components/ui/ErrorAlert.tsx
import React from 'react';

interface ErrorAlertProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ title, message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-red-800">{title}</h3>
      <p className="text-red-700 mt-2">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;
```

### 4. Multiple API Calls with Async Operations

Handle complex async flows:

```typescript
// Component using multiple service calls
import { useState, useCallback } from 'react';

export const PointsRedemption: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRedeem = useCallback(async (points: number) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Service method handles API call and errors
      const result = await loyaltyService.redeemPoints(
        'loyalty-card-id',
        points,
        'order-123'
      );

      if (result.success) {
        setSuccess(true);
        // Optionally refetch balance
      } else {
        setError('Insufficient points for redemption');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Redemption failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div>
      {error && <ErrorAlert title="Error" message={error} />}
      {success && <SuccessAlert message="Points redeemed successfully!" />}
      <button
        onClick={() => handleRedeem(100)}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Redeem Points'}
      </button>
    </div>
  );
};
```

## Quality Gates

- ✅ All data fetches use loading state before rendering
- ✅ Error boundaries or error states for all API calls
- ✅ User-friendly error messages (not raw error stack)
- ✅ Loading skeletons or spinners during data fetching
- ✅ Proper TypeScript types for all API responses
- ✅ Error handling with try/catch in async operations
- ✅ Success feedback for user actions (toasts, alerts)
- ✅ Dependencies array properly set in useEffect hooks

## Benefits

- **Better UX**: Users see loading states instead of frozen UI
- **Error Recovery**: Users can retry failed operations
- **Type Safety**: TypeScript catches API data shape mismatches
- **Reusability**: Custom hooks work across multiple components
- **Maintainability**: Clear separation of API and UI logic

## Common Mistakes to Avoid

- ❌ Not handling loading state (blank screen while fetching)
- ❌ Showing raw error messages from API
- ❌ Missing error boundary or error state handling
- ❌ Fetching in render without useEffect
- ❌ Not showing success feedback for user actions
- ❌ Infinite loops in useEffect (missing dependencies)
- ❌ Not cleaning up async operations on unmount
