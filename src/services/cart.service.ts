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

export interface ApiShippingTier {
  id: number;
  name: string;
  min_weight: number;
  max_weight: number | null;
  cost: string;
}

class CartService {
  /**
   * Get user's cart from backend
   */
  async getCart(): Promise<BackendCartResponse | null> {
    try {
      const response = await api.get<BackendCartResponse>('/cart');
      console.log('[CartService] Full API response:', JSON.stringify(response, null, 2));

      if (response.success && response.data) {
        // Handle double-wrapped response (response.data.data)
        let cartData = response.data;
        if ((cartData as any).data && typeof (cartData as any).data === 'object') {
          console.log('[CartService] Detected double-wrapped response, unwrapping...');
          cartData = (cartData as any).data;
        }

        console.log('[CartService] Cart data structure:', JSON.stringify(cartData, null, 2));
        console.log('[CartService] Cart items array:', cartData.items);
        console.log('[CartService] Is items an array?', Array.isArray(cartData.items));

        // Handle case where backend returns cart without items array
        if (!cartData.items || !Array.isArray(cartData.items)) {
          console.warn('[CartService] Backend cart has no items array, initializing empty array');
          cartData.items = [];
        }

        return cartData as BackendCartResponse;
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
   * Add item to cart — optionally pass a variant_id when the user selected a specific variant
   */
  async addItem(productSlug: string, quantity: number = 1, variantId?: number): Promise<BackendCartResponse> {
    const body: Record<string, any> = {
      product_slug: productSlug,
      quantity,
    };

    if (variantId !== undefined && variantId !== null) {
      body.variant_id = variantId;
    }

    const response = await api.post<BackendCartResponse>('/cart/items', body);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to add item to cart');
    }

    // Handle double-wrapped response (same pattern as getCart / addDeal)
    let cartData = response.data as any;
    if (cartData.data && typeof cartData.data === 'object') {
      cartData = cartData.data;
    }
    if (!cartData.items || !Array.isArray(cartData.items)) {
      cartData.items = [];
    }

    console.log('[CartService] Item added to cart:', cartData);
    return cartData as BackendCartResponse;
  }

  /**
   * Fetch shipping tiers from backend API
   * Falls back to hardcoded tiers if the endpoint is unavailable
   */
  async getShippingTiers(): Promise<ApiShippingTier[]> {
    try {
      const response = await api.get<{ data: ApiShippingTier[] }>('/shipping-tiers');

      if (response.success && response.data) {
        const tiers = (response.data as any).data ?? response.data;
        if (Array.isArray(tiers) && tiers.length > 0) {
          console.log('[CartService] Shipping tiers loaded from API:', tiers);
          return tiers;
        }
      }
    } catch (error) {
      console.warn('[CartService] /shipping-tiers unavailable, using fallback tiers');
    }

    // Fallback — mirrors the backend weight logic
    return [
      { id: 1, name: 'Light Package',    min_weight: 0,    max_weight: 1,    cost: '350.00' },
      { id: 2, name: 'Standard Package', min_weight: 1,    max_weight: 5,    cost: '500.00' },
      { id: 3, name: 'Heavy Package',    min_weight: 5.01, max_weight: null, cost: '700.00' },
    ];
  }

  /**
   * Add a deal to cart via POST /api/cart/deals
   * Throws with message "This deal is already in your cart" on 400
   */
  async addDeal(dealSlug: string): Promise<BackendCartResponse> {
    const response = await api.post<BackendCartResponse>('/cart/deals', { deal_slug: dealSlug });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to add deal to cart');
    }

    // Handle double-wrapped response (same pattern as getCart)
    let cartData = response.data as any;
    if (cartData.data && typeof cartData.data === 'object') {
      console.log('[CartService] addDeal: detected double-wrapped response, unwrapping...');
      cartData = cartData.data;
    }

    if (!cartData.items || !Array.isArray(cartData.items)) {
      console.warn('[CartService] addDeal: no items array in response, initializing empty');
      cartData.items = [];
    }

    console.log('[CartService] Deal added to cart:', cartData);
    return cartData as BackendCartResponse;
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

    // Handle double-wrapped response
    let cartData = response.data as any;
    if (cartData.data && typeof cartData.data === 'object') {
      cartData = cartData.data;
    }
    if (!cartData.items || !Array.isArray(cartData.items)) {
      cartData.items = [];
    }

    console.log('[CartService] Cart item updated:', cartData);
    return cartData as BackendCartResponse;
  }

  /**
   * Remove item from cart
   */
  async removeItem(itemId: string): Promise<BackendCartResponse> {
    const response = await api.delete<BackendCartResponse>(`/cart/items/${itemId}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to remove cart item');
    }

    // Handle double-wrapped response
    let cartData = response.data as any;
    if (cartData.data && typeof cartData.data === 'object') {
      cartData = cartData.data;
    }
    if (!cartData.items || !Array.isArray(cartData.items)) {
      cartData.items = [];
    }

    console.log('[CartService] Cart item removed:', cartData);
    return cartData as BackendCartResponse;
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
   * Convert backend cart item to frontend CartItem format.
   * Preserves weight_source so the UI can display "Size: Large (2.5 kg)" when relevant,
   * and keeps snapshot fields for order-history display.
   */
  convertToCartItem(backendItem: any): CartItem {
    // --- Deal item: product is null, render using deal/product_snapshot ---
    if (backendItem.is_deal_item) {
      const snapshot = backendItem.product_snapshot ?? {};
      const dealImageUrl = snapshot.image
        ? (snapshot.image.startsWith('http') ? snapshot.image : `${host}${snapshot.image}`)
        : '/placeholder.png';

      return {
        id: String(backendItem.id),
        quantity: backendItem.quantity ?? 1,
        is_deal_item: true,
        deal: backendItem.deal,
        deal_metadata: backendItem.deal_metadata,
        product_snapshot: snapshot,
        // Minimal product stub so existing code that reads item.product doesn't crash
        product: {
          id: String(backendItem.deal?.id ?? backendItem.id),
          name: snapshot.name ?? backendItem.deal?.title ?? 'Deal',
          brand: '',
          price: 0,
          image: dealImageUrl,
          rating: 0,
          reviews: 0,
          category: '',
          subcategory: '',
          inStock: true,
        },
      };
    }

    // Normalize image URL
    let imageUrl = '/placeholder.png';
    if (backendItem.product?.primary_image?.url) {
      const imgUrl = backendItem.product.primary_image.url;
      imageUrl = imgUrl.startsWith('http') ? imgUrl : `${host}${imgUrl}`;
    }

    // Prefer variant weight when present (weight_source === 'variant')
    const resolvedWeight =
      backendItem.weight_source === 'variant' && backendItem.variant?.weight != null
        ? String(backendItem.variant.weight)
        : backendItem.product?.weight;

    const resolvedDimensions =
      backendItem.weight_source === 'variant' && backendItem.variant?.dimensions != null
        ? backendItem.variant.dimensions
        : backendItem.product?.dimensions;

    // Build a human-readable variant label e.g. "Large (2.5 kg)"
    const variantLabel: string | undefined =
      backendItem.weight_source === 'variant' && backendItem.variant
        ? [backendItem.variant.name, resolvedWeight ? `${resolvedWeight} kg` : undefined]
            .filter(Boolean)
            .join(' ')
        : undefined;

    return {
      id: String(backendItem.id),
      quantity: backendItem.quantity,
      weight: backendItem.weight,
      total_weight: backendItem.total_weight,
      dimensions: backendItem.dimensions,
      subtotal: backendItem.subtotal,
      // Expose extra fields as pass-through so Cart UI can read them
      weight_source: backendItem.weight_source,
      variant_label: variantLabel,
      // Order-history snapshots (present on order items, not live cart items)
      weight_snapshot: backendItem.weight_snapshot,
      dimensions_snapshot: backendItem.dimensions_snapshot,
      product_name_snapshot: backendItem.product_name_snapshot,
      // Gift box metadata - preserve for grouping in cart
      metadata: backendItem.metadata || null,
      product: {
        id: String(backendItem.product_id),
        name: backendItem.product?.name || 'Unknown Product',
        brand: backendItem.product?.brand?.name || '',
        price: parseFloat(backendItem.price_at_time || '0'),
        image: imageUrl,
        rating: 0,
        reviews: 0,
        category: backendItem.product?.category?.slug || '',
        subcategory: '',
        inStock: backendItem.is_available,
        weight: resolvedWeight,
        dimensions: resolvedDimensions,
      },
    };
  }
}

export const cartService = new CartService();
