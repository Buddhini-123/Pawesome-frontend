import { ApiResponse } from '../types';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

class ApiService {
  private baseURL: string = '/api';
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Simulate network errors randomly (5% chance)
  private shouldSimulateError(): boolean {
    return Math.random() < 0.05;
  }

  // Simulate network delay
  private async simulateNetworkDelay(): Promise<void> {
    const delay = Math.floor(Math.random() * 400) + 100; // 100-500ms
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  // Get auth token from localStorage
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Main request method
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    try {
      // Simulate network delay
      await this.simulateNetworkDelay();

      // Simulate random network errors
      if (this.shouldSimulateError()) {
        throw new Error('Network error: Unable to connect to server');
      }

      const { method = 'GET', body, headers = {}, params } = options;

      // Build URL with query params
      let url = `${this.baseURL}${endpoint}`;
      if (params) {
        const queryString = new URLSearchParams(params).toString();
        url += `?${queryString}`;
      }

      // Add auth token if available
      const authToken = this.getAuthToken();
      const requestHeaders = {
        ...this.defaultHeaders,
        ...headers,
      };

      if (authToken) {
        requestHeaders['Authorization'] = `Bearer ${authToken}`;
      }

      // Build request options
      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
      };

      if (body && method !== 'GET') {
        requestOptions.body = JSON.stringify(body);
      }

      // Since we're mocking, we'll route to our mock handlers
      const response = await this.handleMockRequest<T>(endpoint, method, body, params);
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('API Error:', errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Mock request handler (routes to appropriate service)
  private async handleMockRequest<T>(
    endpoint: string,
    method: HttpMethod,
    body?: any,
    params?: any
  ): Promise<T> {
    // Import services dynamically to avoid circular dependencies
    const { authService } = await import('./auth.service');
    const { productsService } = await import('./products.service');
    const { ordersService } = await import('./orders.service');

    // Route based on endpoint
    if (endpoint.startsWith('/auth')) {
      return this.handleAuthRoute(endpoint, method, body) as Promise<T>;
    } else if (endpoint.startsWith('/products')) {
      return this.handleProductsRoute(endpoint, method, body, params) as Promise<T>;
    } else if (endpoint.startsWith('/orders')) {
      return this.handleOrdersRoute(endpoint, method, body) as Promise<T>;
    } else if (endpoint.startsWith('/cart')) {
      return this.handleCartRoute(endpoint, method, body) as Promise<T>;
    } else if (endpoint.startsWith('/wishlist')) {
      return this.handleWishlistRoute(endpoint, method, body) as Promise<T>;
    } else if (endpoint.startsWith('/reviews')) {
      return this.handleReviewsRoute(endpoint, method, body) as Promise<T>;
    } else if (endpoint.startsWith('/subscriptions')) {
      return this.handleSubscriptionsRoute(endpoint, method, body) as Promise<T>;
    }

    throw new Error(`Unknown endpoint: ${endpoint}`);
  }

  // Route handlers (these will be implemented to call appropriate services)
  private async handleAuthRoute(endpoint: string, method: HttpMethod, body?: any): Promise<any> {
    const { authService } = await import('./auth.service');
    
    if (endpoint === '/auth/login' && method === 'POST') {
      return authService.login(body);
    } else if (endpoint === '/auth/register' && method === 'POST') {
      return authService.register(body);
    } else if (endpoint === '/auth/logout' && method === 'POST') {
      return authService.logout();
    } else if (endpoint === '/auth/me' && method === 'GET') {
      return authService.getCurrentUser();
    } else if (endpoint === '/auth/refresh' && method === 'POST') {
      return authService.refreshToken();
    }
    
    throw new Error(`Unknown auth endpoint: ${endpoint}`);
  }

  private async handleProductsRoute(endpoint: string, method: HttpMethod, body?: any, params?: any): Promise<any> {
    const { productsService } = await import('./products.service');
    
    if (endpoint === '/products' && method === 'GET') {
      return productsService.getProducts(params);
    } else if (endpoint.match(/^\/products\/[^/]+$/) && method === 'GET') {
      const id = endpoint.split('/').pop()!;
      return productsService.getProductById(id);
    } else if (endpoint === '/products/search' && method === 'GET') {
      return productsService.searchProducts(params?.query || '');
    }
    
    throw new Error(`Unknown products endpoint: ${endpoint}`);
  }

  private async handleOrdersRoute(endpoint: string, method: HttpMethod, body?: any): Promise<any> {
    const { ordersService } = await import('./orders.service');
    
    if (endpoint === '/orders' && method === 'GET') {
      return ordersService.getUserOrders();
    } else if (endpoint === '/orders' && method === 'POST') {
      return ordersService.createOrder(body);
    } else if (endpoint.match(/^\/orders\/[^/]+$/) && method === 'GET') {
      const id = endpoint.split('/').pop()!;
      return ordersService.getOrderById(id);
    }
    
    throw new Error(`Unknown orders endpoint: ${endpoint}`);
  }

  private async handleCartRoute(endpoint: string, method: HttpMethod, body?: any): Promise<any> {
    // Cart is handled locally via context, but we can simulate API calls
    if (endpoint === '/cart/validate' && method === 'POST') {
      // Validate cart items (check stock, prices, etc.)
      return { valid: true, items: body.items };
    }
    
    throw new Error(`Unknown cart endpoint: ${endpoint}`);
  }

  private async handleWishlistRoute(endpoint: string, method: HttpMethod, body?: any): Promise<any> {
    const { authService } = await import('./auth.service');
    const user = await authService.getCurrentUser();
    
    if (!user) {
      throw new Error('Unauthorized');
    }
    
    const { mockDb } = await import('./mockDb');
    
    if (endpoint === '/wishlist' && method === 'GET') {
      return mockDb.getUserWishlist(user.id);
    } else if (endpoint === '/wishlist' && method === 'POST') {
      return mockDb.addToWishlist(user.id, body);
    } else if (endpoint.match(/^\/wishlist\/[^/]+$/) && method === 'DELETE') {
      const productId = endpoint.split('/').pop()!;
      await mockDb.removeFromWishlist(user.id, productId);
      return { success: true };
    }
    
    throw new Error(`Unknown wishlist endpoint: ${endpoint}`);
  }

  private async handleReviewsRoute(endpoint: string, method: HttpMethod, body?: any): Promise<any> {
    const { mockDb } = await import('./mockDb');
    
    if (endpoint.match(/^\/reviews\/product\/[^/]+$/) && method === 'GET') {
      const productId = endpoint.split('/').pop()!;
      return mockDb.getProductReviews(productId);
    } else if (endpoint === '/reviews' && method === 'POST') {
      return mockDb.createReview(body);
    }
    
    throw new Error(`Unknown reviews endpoint: ${endpoint}`);
  }

  private async handleSubscriptionsRoute(endpoint: string, method: HttpMethod, body?: any): Promise<any> {
    const { authService } = await import('./auth.service');
    const user = await authService.getCurrentUser();
    
    if (!user) {
      throw new Error('Unauthorized');
    }
    
    const { mockDb } = await import('./mockDb');
    
    if (endpoint === '/subscriptions' && method === 'GET') {
      return mockDb.getUserSubscriptions(user.id);
    } else if (endpoint === '/subscriptions' && method === 'POST') {
      return mockDb.createSubscription(user.id, body);
    }
    
    throw new Error(`Unknown subscriptions endpoint: ${endpoint}`);
  }

  // Convenience methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }
}

// Create singleton instance
export const api = new ApiService();