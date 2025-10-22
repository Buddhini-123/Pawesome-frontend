import { ApiResponse } from '../types';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

class ApiService {
  private baseURL: string = 'http://127.0.0.1:8000/api';

  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  private getAuthToken(): string | null {
    return localStorage.getItem('token');
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
        throw new Error(data.message || `HTTP error! status: ${res.status}`);
      }

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('API Error:', errorMessage);
      return { success: false, error: errorMessage };
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
}

export const api = new ApiService();
export const host = api.getBaseURL();

