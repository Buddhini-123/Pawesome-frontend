export interface Deal {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  offerType: 'buy-get-free' | 'free-shipping' | 'referral' | 'upgrade' | 'discount' | 'bundle' | 'flash-sale' | 'bulk-discount';
  discount?: number;
  discountType?: 'percentage' | 'fixed'; // percentage or fixed amount
  originalPrice?: number;
  salePrice?: number;
  image: string;
  isActive: boolean;
  validFrom: Date;
  validUntil?: Date;
  slug: string;
  category: string[];
  product_id: string; // Primary product ID for this deal
  products?: string[]; // Additional Product IDs associated with this deal
  // Enhanced fields for admin management
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // Admin user ID
  priority: number; // Display priority (1-10)
  maxUses?: number; // Maximum number of times this deal can be used
  currentUses: number; // Current usage count
  minOrderAmount?: number; // Minimum order amount to qualify
  maxDiscountAmount?: number; // Maximum discount amount (for percentage discounts)
  tags: string[]; // Tags for better organization
  targetAudience?: 'all' | 'new-customers' | 'existing-customers' | 'vip';
  // Performance tracking
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
  // Coupon codes
  couponCode?: string;
  couponRequired: boolean;
  start_date: string;
  end_date: string;
  display_title?: string;
  display_description?: string
  sri_lankan_formatting?: SriLankanFormatting;
  is_available: string
  user_data: UserData;
  usage_count: number;
  usage_statistics: UsageStaticstics,
  applies_to: AppliesTo,
  deal_type: string
  discount_value: string
}

export interface AppliesTo {
  categories: any;
  products: any;
  [key: string]: any;
}
export interface UsageStaticstics {
  total_claims: number;
  remaining_uses: number;
  usage_percentage: number;
}

export interface UserData {
  can_claim: boolean;
  has_claimed: any;
  [key: string]: any; // optional for additional dynamic fields
}

export interface SriLankanFormatting {
  discount_display: string;
  minimum_purchase_display: string;
  maximum_discount_display: string;
}

export interface DealSection {
  id: string;
  title: string;
  subtitle?: string;
  deals: Deal[];
  backgroundColor?: string;
  textColor?: string;
}

export interface DealsPageData {
  sections: DealSection[];
}

export type DealCardProps = {
  deal: Deal;
  onClick: (deal: Deal) => void;
  className?: string;
}

export type DealSectionProps = {
  section: DealSection;
  onDealClick: (deal: Deal) => void;
  className?: string;
}