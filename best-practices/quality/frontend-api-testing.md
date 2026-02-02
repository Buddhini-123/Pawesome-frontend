# Frontend API Testing Strategies

## Type
quality

## Applies To
medium, large, mega

## Keywords
testing, api-mocking, unit-tests, integration-tests, typescript, jest

## Description

Implement comprehensive testing strategies for API integrations with proper mocking, error scenarios, and service layer unit tests.

## Implementation

### 1. Service Layer Unit Tests

Test service methods in isolation with mocked API:

```typescript
// src/services/__tests__/loyalty.service.test.ts
import { loyaltyService } from '../loyalty.service';
import * as apiModule from '../api';

// Mock the api module
jest.mock('../api');

describe('LoyaltyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getLoyaltyBalance', () => {
    it('should return loyalty balance on success', async () => {
      const mockBalance = {
        balance: 100,
        expiring_soon: 0,
        expiry_date: '2027-12-31 23:59:59'
      };

      (apiModule.api.request as jest.Mock).mockResolvedValueOnce({
        success: true,
        data: mockBalance
      });

      const result = await loyaltyService.getLoyaltyBalance();

      expect(result).toEqual(mockBalance);
      expect(apiModule.api.request).toHaveBeenCalledWith(
        '/loyalty/balance',
        { method: 'GET' }
      );
    });

    it('should throw error when API fails', async () => {
      (apiModule.api.request as jest.Mock).mockResolvedValueOnce({
        success: false,
        error: 'Network error'
      });

      await expect(loyaltyService.getLoyaltyBalance()).rejects.toThrow(
        'Failed to fetch loyalty balance'
      );
    });
  });

  describe('awardPoints', () => {
    it('should award points and return new balance', async () => {
      const mockResponse = {
        points_earned: 5,
        new_balance: 105
      };

      (apiModule.api.post as jest.Mock).mockResolvedValueOnce({
        success: true,
        data: mockResponse
      });

      const result = await loyaltyService.awardPoints('order-123', 500);

      expect(result).toEqual(mockResponse);
      expect(apiModule.api.post).toHaveBeenCalledWith(
        '/loyalty/earn',
        { order_id: 'order-123', amount_paid: 500 }
      );
    });
  });
});
```

### 2. Component Integration Tests

Test components with mocked services:

```typescript
// src/components/__tests__/LoyaltyDashboard.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { LoyaltyDashboard } from '../LoyaltyDashboard';
import * as loyaltyServiceModule from '../../services/loyalty.service';

jest.mock('../../services/loyalty.service');

describe('LoyaltyDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading skeleton while fetching', () => {
    (loyaltyServiceModule.loyaltyService.getLoyaltyBalance as jest.Mock)
      .mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve({
          balance: 100,
          expiring_soon: 0,
          expiry_date: '2027-12-31'
        }), 100))
      );

    render(<LoyaltyDashboard />);

    // Initially shows skeleton
    expect(screen.queryByText('Loyalty Balance')).not.toBeInTheDocument();
  });

  it('should display loyalty balance on success', async () => {
    const mockBalance = {
      balance: 250,
      expiring_soon: 0,
      expiry_date: '2027-12-31 23:59:59'
    };

    (loyaltyServiceModule.loyaltyService.getLoyaltyBalance as jest.Mock)
      .mockResolvedValueOnce(mockBalance);

    render(<LoyaltyDashboard />);

    await waitFor(() => {
      expect(screen.getByText('250 Points')).toBeInTheDocument();
    });
  });

  it('should display error message on API failure', async () => {
    const errorMessage = 'Failed to fetch loyalty balance';
    (loyaltyServiceModule.loyaltyService.getLoyaltyBalance as jest.Mock)
      .mockRejectedValueOnce(new Error(errorMessage));

    render(<LoyaltyDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to Load Loyalty Balance/)).toBeInTheDocument();
    });
  });

  it('should show warning when points expiring soon', async () => {
    const mockBalance = {
      balance: 100,
      expiring_soon: 50,
      expiry_date: '2027-12-31 23:59:59'
    };

    (loyaltyServiceModule.loyaltyService.getLoyaltyBalance as jest.Mock)
      .mockResolvedValueOnce(mockBalance);

    render(<LoyaltyDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/50 points expiring soon/)).toBeInTheDocument();
    });
  });
});
```

### 3. API Service Mock Factory

Create factory for consistent API mocks:

```typescript
// src/services/__mocks__/api.ts
export const api = {
  request: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
};

// Helper to setup successful response
export function mockApiSuccess<T>(data: T) {
  return {
    success: true,
    data
  };
}

// Helper to setup error response
export function mockApiError(error: string) {
  return {
    success: false,
    error
  };
}
```

### 4. Error Scenario Testing

Test all error paths:

```typescript
describe('Error Scenarios', () => {
  it('should handle network timeout', async () => {
    (apiModule.api.request as jest.Mock).mockRejectedValueOnce(
      new Error('Request timeout')
    );

    await expect(loyaltyService.getLoyaltyBalance()).rejects.toThrow();
  });

  it('should handle 401 unauthorized', async () => {
    (apiModule.api.request as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'Unauthorized'
    });

    // Should trigger logout or redirect to login
    await expect(loyaltyService.getLoyaltyBalance()).rejects.toThrow();
  });

  it('should handle 500 server error', async () => {
    (apiModule.api.request as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'Internal server error'
    });

    await expect(loyaltyService.getLoyaltyBalance()).rejects.toThrow();
  });

  it('should handle malformed response', async () => {
    (apiModule.api.request as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: null
    });

    await expect(loyaltyService.getLoyaltyBalance()).rejects.toThrow();
  });
});
```

### 5. Integration Test Setup

Test actual API flow without making real requests:

```typescript
// src/__tests__/integration/loyalty-flow.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../../App';
import * as server from '../mocks/server'; // MSW setup

// Start mocking server before tests
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Loyalty Balance Flow', () => {
  it('should load and display loyalty balance with all details', async () => {
    render(<App />);

    // Navigate to loyalty section
    const loyaltyLink = screen.getByRole('link', { name: /loyalty/i });
    await userEvent.click(loyaltyLink);

    // Wait for balance to load
    const balance = await screen.findByText(/\d+ Points/);
    expect(balance).toBeInTheDocument();

    // Verify all details displayed
    expect(screen.getByText(/Expires:/)).toBeInTheDocument();
  });
});
```

## Quality Gates

- ✅ Service methods have unit tests with mocked API
- ✅ All API error scenarios are tested
- ✅ Components tested with mocked services
- ✅ Loading and error states have specific test cases
- ✅ Success responses return correct data
- ✅ Error messages are user-friendly
- ✅ Tests use realistic mock data
- ✅ No real API calls in unit/integration tests

## Testing Best Practices

**Setup & Cleanup:**
```typescript
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
```

**Mock Consistent API Responses:**
```typescript
const mockResponses = {
  loyaltyBalance: {
    balance: 100,
    expiring_soon: 0,
    expiry_date: '2027-12-31 23:59:59'
  },
  error: {
    success: false,
    error: 'API Error'
  }
};
```

## Benefits

- **Reliability**: Tests catch breaking changes early
- **Confidence**: Team can refactor with test coverage
- **Documentation**: Tests serve as usage examples
- **Error Coverage**: All error paths are verified
- **Regression Prevention**: Prevents same bugs from reoccurring

## Common Mistakes to Avoid

- ❌ Testing without mocking real API calls
- ❌ Not testing error paths
- ❌ Using hardcoded mock data instead of factories
- ❌ Testing implementation instead of behavior
- ❌ Missing async/await in async test functions
- ❌ Not cleaning up mocks between tests
- ❌ Testing too many things in one test
