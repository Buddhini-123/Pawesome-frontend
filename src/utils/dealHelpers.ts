import { Deal } from '../types/deals';

// Helper function to convert legacy deal objects to the new enhanced Deal interface
export const enhanceDeal = (legacyDeal: Partial<Deal>): Deal => {
  const now = new Date();
  return {
    // Required fields with defaults
    id: legacyDeal.id || '',
    title: legacyDeal.title || '',
    subtitle: legacyDeal.subtitle || '',
    description: legacyDeal.description || '',
    offerType: legacyDeal.offerType || 'discount',
    image: legacyDeal.image || '/api/placeholder/300/200',
    isActive: legacyDeal.isActive ?? true,
    validFrom: legacyDeal.validFrom || now,
    slug: legacyDeal.slug || '',
    category: legacyDeal.category || [],
    product_id: legacyDeal.product_id || legacyDeal.products?.[0] || 'default-product-id',
    
    // Enhanced fields with defaults
    createdAt: legacyDeal.createdAt || now,
    updatedAt: legacyDeal.updatedAt || now,
    createdBy: legacyDeal.createdBy || 'legacy-user',
    priority: legacyDeal.priority || 5,
    currentUses: legacyDeal.currentUses || 0,
    tags: legacyDeal.tags || [],
    targetAudience: legacyDeal.targetAudience || 'all',
    
    // Performance tracking with defaults
    views: legacyDeal.views || Math.floor(Math.random() * 1000) + 100,
    clicks: legacyDeal.clicks || Math.floor(Math.random() * 200) + 20,
    conversions: legacyDeal.conversions || Math.floor(Math.random() * 50) + 5,
    revenue: legacyDeal.revenue || Math.floor(Math.random() * 50000) + 5000,
    
    // Coupon fields
    couponRequired: legacyDeal.couponRequired || false,
    
    // Optional fields
    discount: legacyDeal.discount,
    discountType: legacyDeal.discountType,
    originalPrice: legacyDeal.originalPrice,
    salePrice: legacyDeal.salePrice,
    validUntil: legacyDeal.validUntil,
    products: legacyDeal.products,
    maxUses: legacyDeal.maxUses,
    minOrderAmount: legacyDeal.minOrderAmount,
    maxDiscountAmount: legacyDeal.maxDiscountAmount,
    couponCode: legacyDeal.couponCode
  };
};

// Helper to generate realistic mock data for missing fields
export const generateMockDealData = (baseData: Partial<Deal>): Partial<Deal> => {
  const mockViews = Math.floor(Math.random() * 2000) + 500;
  const mockClicks = Math.floor(mockViews * (Math.random() * 0.3 + 0.1)); // 10-40% click rate
  const mockConversions = Math.floor(mockClicks * (Math.random() * 0.2 + 0.05)); // 5-25% conversion rate
  const mockRevenue = mockConversions * (Math.random() * 3000 + 1000); // 1000-4000 per conversion

  return {
    ...baseData,
    views: mockViews,
    clicks: mockClicks,
    conversions: mockConversions,
    revenue: Math.floor(mockRevenue),
    currentUses: mockConversions,
    tags: baseData.tags || generateTagsFromCategory(baseData.category || []),
    priority: Math.floor(Math.random() * 5) + 1,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
    updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last 7 days
  };
};

// Helper to generate tags from categories
const generateTagsFromCategory = (categories: string[]): string[] => {
  const tagMap: Record<string, string[]> = {
    'dog-food': ['premium', 'nutrition', 'healthy'],
    'cat-food': ['feline', 'nutrition', 'tasty'],
    'premium': ['high-quality', 'premium', 'luxury'],
    'subscription': ['auto-delivery', 'convenient', 'recurring'],
    'shipping': ['delivery', 'fast', 'convenient'],
    'referral': ['friend', 'sharing', 'bonus'],
    'new-customer': ['welcome', 'first-time', 'trial'],
    'bulk': ['wholesale', 'savings', 'economy'],
    'family': ['multi-pet', 'bundle', 'complete'],
    'loyalty': ['rewards', 'points', 'member'],
    'vip': ['exclusive', 'premium', 'special']
  };

  const tags = new Set<string>();
  categories.forEach(category => {
    const categoryTags = tagMap[category] || [category];
    categoryTags.forEach(tag => tags.add(tag));
  });

  return Array.from(tags);
};