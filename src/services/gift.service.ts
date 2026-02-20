import { api } from './api';

export interface PresetGiftBox {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  occasion: string;
  base_price: string;
  discount_percentage: string;
  final_price: string;
  savings_amount: number;
  formatted_base_price: string;
  formatted_final_price: string;
  formatted_savings: string;
  is_active: boolean;
  total_items: number;
  theme?: {
    id: number;
    name: string;
    description: string;
  };
  products?: Array<{
    id: number;
    name: string;
    slug: string;
    price: string;
    image_url: string;
    pivot: {
      quantity: number;
      display_order: number;
    };
  }>;
}

export interface PresetBoxesResponse {
  success: boolean;
  data: PresetGiftBox[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface SinglePresetBoxResponse {
  success: boolean;
  data: PresetGiftBox;
}

class GiftService {
  /**
   * Get all active preset gift boxes
   */
  async getPresetBoxes(params?: {
    occasion?: string;
    search?: string;
    per_page?: number;
  }): Promise<PresetBoxesResponse> {
    try {
      const response: any = await api.get('/gifts/preset-boxes', { params });
      // Handle both direct response and wrapped response
      if (response.data?.data) {
        return response.data;
      }
      return response.data || response;
    } catch (error) {
      console.error('[GiftService] Failed to fetch preset boxes:', error);
      throw error;
    }
  }

  /**
   * Get single preset gift box by slug
   */
  async getPresetBox(slug: string): Promise<SinglePresetBoxResponse> {
    try {
      const response: any = await api.get(`/gifts/preset-boxes/${slug}`);
      // Handle both direct response and wrapped response
      if (response.data?.data) {
        return response.data;
      }
      return response.data || response;
    } catch (error) {
      console.error('[GiftService] Failed to fetch preset box:', error);
      throw error;
    }
  }

  /**
   * Add preset gift box to cart
   */
  async addPresetBoxToCart(presetBoxId: number): Promise<any> {
    try {
      const response = await api.post('/cart/add-preset-box', {
        preset_gift_box_id: presetBoxId,
      });
      return response.data || response;
    } catch (error: any) {
      console.error('[GiftService] Failed to add preset box to cart:', error);
      throw error;
    }
  }
}

export const giftService = new GiftService();
