import { api, host } from './api';
import { CartItem } from '../types';

export interface ShippingBreakdown {
  weight: string;
  weight_unit: string;
  tier: 'light' | 'medium' | 'heavy';
  description: string;
  cost: string;
  pricing_tiers: Array<{
    range: string;
    cost: string;
  }>;
}

export interface BackendCartResponse {
  id: number;
  user_id: number;
  items: any[];
  items_count: number;
  total_items: number;
  subtotal: string;
  tax_amount: string;
  shipping_cost: string;
  total_amount: string;
  currency: string;
  is_empty: boolean;
  total_weight: string;
  weight_unit: string;
  shipping_breakdown: ShippingBreakdown;
  subscription_options?: {
    eligible_items_count: number;
    ineligible_items_count: number;
    has_subscription_eligible_items: boolean;
    all_items_eligible: boolean;
  };
  metadata?: any;
  created_at: string;
  updated_at: string;
}

class CartService {
  /**
   * Get user's cart from backend
   */
  async getCart(): Promise<BackendCartResponse | null> {
    try {
      const response = await api.get<BackendCartResponse>('/cart');
      if (response.success && response.data) {
        console.log('[CartService] Cart fetched from backend:', response.data);
        console.log('[CartService] Cart items array:', response.data.items);
        console.log('[CartService] Is items an array?', Array.isArray(response.data.items));
        return response.data;
      }
      console.warn('[CartService] Cart response not successful or no data');
      return null;
    } catch (error: any) {
      console.error('[CartService] Failed to fetch cart:', error);
      // Return null if 404 (cart doesn't exist yet)
      if (error.response?.status === 404) {
        console.log('[CartService] No cart exists yet for user');
        return null;
      }
      throw error;
    }
  }

  /**
   * Add item to cart
   */
  async addItem(productSlug: string, quantity: number = 1): Promise<BackendCartResponse> {
    const response = await api.post<BackendCartResponse>('/cart/items', {
      product_slug: productSlug,
      quantity
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to add item to cart');
    }

    console.log('[CartService] Item added to cart:', response.data);
    return response.data;
  }

  /**
   * Update cart item quantity
   */
  async updateItemQuantity(itemId: string, quantity: number): Promise<BackendCartResponse> {
    const response = await api.put<BackendCartResponse>(`/cart/items/${itemId}`, {
      quantity
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update cart item');
    }

    console.log('[CartService] Cart item updated:', response.data);
    return response.data;
  }

  /**
   * Remove item from cart
   */
  async removeItem(itemId: string): Promise<BackendCartResponse> {
    const response = await api.delete<BackendCartResponse>(`/cart/items/${itemId}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to remove cart item');
    }

    console.log('[CartService] Cart item removed:', response.data);
    return response.data;
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<BackendCartResponse> {
    const response = await api.delete<BackendCartResponse>('/cart/clear');

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to clear cart');
    }

    console.log('[CartService] Cart cleared:', response.data);
    return response.data;
  }

  /**
   * Validate cart (check stock, prices, availability)
   */
  async validateCart(): Promise<{
    is_valid: boolean;
    issues: any[];
    cart: {
      subtotal: string;
      shipping_cost: string;
      total_amount: string;
      total_weight: string;
    };
  }> {
    const response = await api.post<any>('/cart/validate');

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to validate cart');
    }

    console.log('[CartService] Cart validated:', response.data);
    return response.data;
  }

  /**
   * Convert backend cart item to frontend CartItem format
   */
  convertToCartItem(backendItem: any): CartItem {
    // Normalize image URL
    let imageUrl = '/placeholder.png';
    if (backendItem.product?.primary_image?.url) {
      const imgUrl = backendItem.product.primary_image.url;
      imageUrl = imgUrl.startsWith('http') ? imgUrl : `${host}${imgUrl}`;
    }

    console.log('[CartService] Converting item:', {
      id: backendItem.id,
      name: backendItem.product?.name,
      weight: backendItem.weight,
      product_weight: backendItem.product?.weight,
      dimensions: backendItem.dimensions,
      product_dimensions: backendItem.product?.dimensions
    });

    return {
      id: String(backendItem.id),
      quantity: backendItem.quantity,
      weight: backendItem.weight,
      total_weight: backendItem.total_weight,
      dimensions: backendItem.dimensions,
      subtotal: backendItem.subtotal,
      product: {
        id: String(backendItem.product_id),
        name: backendItem.product?.name || 'Unknown Product',
        brand: backendItem.product?.brand?.name || '',
        price: parseFloat(backendItem.price_at_time || '0'),
        image: imageUrl,
        rating: 0, // Not available in backend response
        reviews: 0, // Not available in backend response
        category: backendItem.product?.category?.slug || '',
        subcategory: '',
        inStock: backendItem.is_available,
        weight: backendItem.product?.weight,
        dimensions: backendItem.product?.dimensions
      }
    };
  }
}

export const cartService = new CartService();
