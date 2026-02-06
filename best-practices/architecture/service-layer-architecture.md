# Service Layer Architecture

## Type
architecture

## Applies To
tiny, medium, large, mega

## Keywords
service, api, integration, typescript, data-access, separation-of-concerns

## Description

Establish a clean service layer that separates API communication from React components using a centralized API service with type-safe methods and consistent error handling patterns.

## Implementation

### 1. Base API Service Pattern

Create a centralized `api.ts` that handles all HTTP communication:

```typescript
// src/services/api.ts
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

class ApiService {
  private baseURL: string = 'http://127.0.0.1:8000/api';

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    try {
      const { method = 'GET', body, headers = {}, params } = options;

      // Build URL with query parameters
      let url = `${this.baseURL}${endpoint}`;
      if (params) {
        const queryString = new URLSearchParams(params).toString();
        url += `?${queryString}`;
      }

      // Prepare headers with authentication
      const authToken = this.getAuthToken();
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      };

      if (authToken) {
        requestHeaders['Authorization'] = `Bearer ${authToken}`;
      }

      // Execute request
      const res = await fetch(url, {
        method,
        headers: requestHeaders,
        ...(body && method !== 'GET' ? { body: JSON.stringify(body) } : {}),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || `HTTP error! status: ${res.status}`);
      }

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('API Error:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Convenience methods
  get<T>(endpoint: string, params?: Record<string, any>) {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  post<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  put<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  patch<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }
}

export const api = new ApiService();
```

### 2. Domain-Specific Service Pattern

Create typed service classes that wrap API calls with business logic:

```typescript
// src/services/loyalty.service.ts
import { api } from './api';
import { LoyaltyBalance, PointTransaction } from '../types/loyalty';

class LoyaltyService {
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

  /**
   * Get transaction history with pagination
   * GET /api/loyalty/ledger?page={page}
   * Requires authentication
   */
  async getPointsHistory(page: number = 1): Promise<PointTransaction[]> {
    const response = await api.request<{ data: PointTransaction[] }>(
      '/loyalty/ledger',
      {
        method: 'GET',
        params: { page }
      }
    );

    if (response.success && response.data?.data) {
      return response.data.data;
    }
    throw new Error('Failed to fetch points history');
  }

  /**
   * Award points on order payment
   * POST /api/loyalty/earn
   * Requires authentication
   */
  async awardPoints(orderId: string, amountPaid: number): Promise<{ points_earned: number; new_balance: number }> {
    const response = await api.post<{ points_earned: number; new_balance: number }>(
      '/loyalty/earn',
      {
        order_id: orderId,
        amount_paid: amountPaid
      }
    );

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to award loyalty points');
  }
}

export const loyaltyService = new LoyaltyService();
```

### 3. Error Handling Pattern

Implement consistent error handling with typed responses:

```typescript
// src/types/index.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Usage in services
async function fetchData(): Promise<T> {
  const response = await api.get<T>('/endpoint');

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Unknown error occurred');
  }

  return response.data;
}
```

## Quality Gates

- ✅ All HTTP requests go through centralized API service
- ✅ Authentication token automatically added to all requests
- ✅ Services export class instances, not classes
- ✅ Methods return strongly-typed data or throw specific errors
- ✅ API responses always have `ApiResponse<T>` wrapper with success/error handling
- ✅ No component directly uses fetch - all via service layer
- ✅ Error messages are user-friendly and logged to console

## Benefits

- **Separation of Concerns**: Components don't know about HTTP details
- **Reusability**: Services can be used across multiple components
- **Testability**: Services can be mocked for unit tests
- **Consistency**: All API calls follow same authentication and error handling
- **Type Safety**: Full TypeScript support with proper types
- **Maintainability**: Centralized API endpoint management

## Common Mistakes to Avoid

- ❌ Calling fetch directly in components
- ❌ Hardcoding API endpoints in multiple places
- ❌ Not handling API errors in components
- ❌ Forgetting authentication tokens
- ❌ Mixing business logic with HTTP logic
