import { ApiResponse } from '../types';
import { API_BASE_URL } from '../config';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

class ApiService {
  private baseURL: string = API_BASE_URL;

  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getBaseURL() {
    return this.baseURL.replace(/\/api$/, ''); // remove /api if you want the host only
  }
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    try {
      const { method = 'GET', body, headers = {}, params } = options;

      // Build full URL
      let url = `${this.baseURL}${endpoint}`;
      if (params) {
        const queryString = new URLSearchParams(params).toString();
        url += `?${queryString}`;
      }

      // Prepare headers
      const authToken = this.getAuthToken();
      const requestHeaders: Record<string, string> = {
        ...this.defaultHeaders,
        ...headers,
      };

      if (authToken) {
        requestHeaders['Authorization'] = `Bearer ${authToken}`;
      }

      // Prepare request
      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
        ...(body && method !== 'GET' ? { body: JSON.stringify(body) } : {}),
      };

      // Perform fetch
      const res = await fetch(url, requestOptions);

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Include status code in error for better handling
        const error: any = new Error(data.message || `HTTP error! status: ${res.status}`);
        error.response = { status: res.status, data };
        throw error;
      }

      return { success: true, data };
    } catch (error: any) {
      const errorMessage = error.message || 'An unknown error occurred';

      // Suppress logging for expected 404s on optional endpoints
      const is404 = error.response?.status === 404;
      const isOptionalEndpoint = endpoint.includes('/loyalty/card/');

      if (is404 && isOptionalEndpoint) {
        // Silently fail for optional endpoints that aren't implemented yet
        return { success: false, error: errorMessage, response: error.response };
      }

      // Log all other errors
      console.error('API Error:', errorMessage);
      return { success: false, error: errorMessage, response: error.response };
    }
  }

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

  async uploadForm<T>(endpoint: string, formData: FormData): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const authToken = this.getAuthToken();
      const headers: Record<string, string> = { Accept: 'application/json' };
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

      const res = await fetch(url, { method: 'POST', headers, body: formData });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const error: any = new Error(data.message || `HTTP error! status: ${res.status}`);
        error.response = { status: res.status, data };
        throw error;
      }

      return { success: true, data };
    } catch (error: any) {
      console.error('API Error:', error.message);
      return { success: false, error: error.message };
    }
  }
}

export const api = new ApiService();
export const host = api.getBaseURL();

