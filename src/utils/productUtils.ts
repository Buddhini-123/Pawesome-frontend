import { Product, ProductCategory, ProductBrand, PetType } from '../types/products';

/**
 * Utility functions for generating SEO-optimized slugs
 */

export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

export const createProductSlug = (name: string, id?: string): string => {
  const baseSlug = createSlug(name);
  return id ? `${baseSlug}-${id}` : baseSlug;
};

export const createCategorySlug = (name: string, petType?: PetType): string => {
  const baseSlug = createSlug(name);
  return petType ? `${petType}-${baseSlug}` : baseSlug;
};

export const createBrandSlug = (name: string): string => {
  return createSlug(name);
};

/**
 * Utility functions for extracting and cleaning text from HTML descriptions
 */

export const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim();
};

export const extractShortDescription = (html: string, maxLength: number = 160): string => {
  const cleanText = stripHtmlTags(html);
  if (cleanText.length <= maxLength) return cleanText;
  
  // Find the last complete sentence within the limit
  const truncated = cleanText.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');
  
  if (lastSentence > maxLength * 0.7) {
    return cleanText.substring(0, lastSentence + 1);
  }
  
  // Fallback to word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  return cleanText.substring(0, lastSpace) + '...';
};

export const extractKeywords = (text: string, excludeWords: string[] = []): string[] => {
  const commonWords = [
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
  ];
  
  const words = stripHtmlTags(text)
    .toLowerCase()
    .split(/[^a-zA-Z0-9]+/)
    .filter(word => 
      word.length > 2 && 
      !commonWords.includes(word) && 
      !excludeWords.includes(word)
    );
  
  // Count word frequency
  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Return most frequent words
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
};

/**
 * SEO optimization utilities
 */

export const generateMetaTitle = (productName: string, brandName?: string, categoryName?: string): string => {
  const parts = [productName];
  
  if (brandName) parts.push(`by ${brandName}`);
  if (categoryName) parts.push(`- ${categoryName}`);
  parts.push('| Pawsome Sri Lanka');
  
  const title = parts.join(' ');
  return title.length > 60 ? `${productName} | Pawsome` : title;
};

export const generateMetaDescription = (
  productName: string, 
  shortDescription: string, 
  brandName?: string,
  price?: number
): string => {
  const parts = [`Shop ${productName}`];
  
  if (brandName) parts.push(`from ${brandName}`);
  if (price) parts.push(`starting at LKR ${price.toLocaleString()}`);
  parts.push(`at Pawsome Sri Lanka. ${shortDescription}`);
  parts.push('Free shipping available. Order now!');
  
  const description = parts.join(' ');
  return description.length > 160 ? description.substring(0, 157) + '...' : description;
};

export const generateProductKeywords = (
  productName: string,
  categoryName: string,
  brandName: string,
  petType?: PetType,
  additionalKeywords: string[] = []
): string[] => {
  const keywords = [
    productName.toLowerCase(),
    categoryName.toLowerCase(),
    brandName.toLowerCase(),
    'pet supplies sri lanka',
    'pet store colombo',
    'online pet shop',
    'pawsome'
  ];
  
  if (petType) {
    keywords.push(
      `${petType} supplies`,
      `${petType} products`,
      `${petType} accessories`
    );
  }
  
  // Add category-specific keywords
  const categoryKeywords = getCategoryKeywords(categoryName, petType);
  keywords.push(...categoryKeywords);
  
  // Add additional keywords
  keywords.push(...additionalKeywords);
  
  // Remove duplicates and return
  return [...new Set(keywords)].slice(0, 15);
};

export const getCategoryKeywords = (categoryName: string, petType?: PetType): string[] => {
  const category = categoryName.toLowerCase();
  const pet = petType || 'pet';
  
  const keywordMap: Record<string, string[]> = {
    'food': [`${pet} food`, `${pet} nutrition`, `${pet} diet`, 'premium pet food'],
    'treats': [`${pet} treats`, `${pet} snacks`, 'healthy treats', 'training treats'],
    'toys': [`${pet} toys`, 'interactive toys', 'chew toys', 'play accessories'],
    'grooming': [`${pet} grooming`, 'pet care', 'hygiene products', 'grooming supplies'],
    'health': [`${pet} health`, 'pet medicine', 'supplements', 'wellness'],
    'accessories': [`${pet} accessories`, 'pet gear', 'pet supplies'],
    'bedding': [`${pet} bed`, 'pet bedding', 'comfortable bedding', 'pet furniture'],
    'carriers': [`${pet} carrier`, 'travel accessories', 'transport', 'pet travel'],
    'collars': [`${pet} collar`, 'leash', 'walking accessories', 'pet safety'],
    'bowls': [`${pet} bowls`, 'feeding accessories', 'food bowls', 'water bowls']
  };
  
  // Find matching keywords based on category name
  for (const [key, keywords] of Object.entries(keywordMap)) {
    if (category.includes(key)) {
      return keywords;
    }
  }
  
  return [`${pet} products`, `${pet} supplies`];
};

/**
 * Related products utilities
 */

export const findRelatedProducts = (
  currentProduct: Product,
  allProducts: Product[],
  maxResults: number = 8
): Product[] => {
  if (!allProducts.length) return [];
  
  const scoredProducts = allProducts
    .filter(product => product.id !== currentProduct.id && product.isActive)
    .map(product => ({
      product,
      score: calculateSimilarityScore(currentProduct, product)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(item => item.product);
  
  return scoredProducts;
};

export const calculateSimilarityScore = (product1: Product, product2: Product): number => {
  let score = 0;
  
  // Same category (highest weight)
  if (product1.category.id === product2.category.id) score += 40;
  
  // Same brand
  if (product1.brand.id === product2.brand.id) score += 30;
  
  // Similar price range (within 50% difference)
  const priceDiff = Math.abs(product1.price.unitPrice - product2.price.unitPrice);
  const avgPrice = (product1.price.unitPrice + product2.price.unitPrice) / 2;
  const priceRatio = priceDiff / avgPrice;
  if (priceRatio < 0.5) score += 20;
  
  // Similar tags
  const commonTags = product1.tags.filter(tag => product2.tags.includes(tag));
  score += commonTags.length * 2;
  
  // Same pet type (if applicable)
  if (product1.category.petType && product1.category.petType === product2.category.petType) {
    score += 15;
  }
  
  return score;
};

/**
 * Product tag generation utilities
 */

export const generateProductTags = (product: Product): string[] => {
  const tags: string[] = [];
  
  // Basic product tags
  if (product.isNew) tags.push('new');
  if (product.isFeatured) tags.push('featured');
  if (product.isOnSale) tags.push('sale');
  
  // Price-based tags
  if (product.price.unitPrice < 500) tags.push('budget-friendly');
  else if (product.price.unitPrice > 5000) tags.push('premium');
  
  // Stock-based tags
  if (product.inventory.stockStatus === 'low-stock') tags.push('limited-stock');
  if (product.inventory.stockStatus === 'out-of-stock') tags.push('out-of-stock');
  
  // Category-based tags
  if (product.category.petType) {
    tags.push(product.category.petType);
    tags.push(`${product.category.petType}-products`);
  }
  
  // Brand-based tags
  tags.push(product.brand.slug);
  
  // Rating-based tags
  if (product.ratings.averageRating >= 4.5) tags.push('highly-rated');
  if (product.ratings.totalReviews > 50) tags.push('popular');
  
  // Shipping-based tags
  if (product.shipping.estimatedDays <= 1) tags.push('same-day-delivery');
  else if (product.shipping.estimatedDays <= 3) tags.push('fast-shipping');
  
  return [...new Set(tags)];
};

/**
 * Inventory status utilities
 */

export const getStockStatus = (currentStock: number, lowStockThreshold: number = 10): 'in-stock' | 'low-stock' | 'out-of-stock' => {
  if (currentStock === 0) return 'out-of-stock';
  if (currentStock <= lowStockThreshold) return 'low-stock';
  return 'in-stock';
};

export const getStockMessage = (status: string, currentStock: number): string => {
  switch (status) {
    case 'in-stock':
      return 'In Stock';
    case 'low-stock':
      return `Only ${currentStock} left in stock`;
    case 'out-of-stock':
      return 'Out of Stock';
    case 'pre-order':
      return 'Available for Pre-order';
    default:
      return 'Stock status unknown';
  }
};

/**
 * Price formatting utilities
 */

export const formatPrice = (price: number, currency: string = 'LKR'): string => {
  return `${currency} ${price.toLocaleString()}`;
};

export const calculateDiscount = (originalPrice: number, salePrice: number): number => {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

export const formatPriceRange = (minPrice: number, maxPrice: number, currency: string = 'LKR'): string => {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice, currency);
  }
  return `${formatPrice(minPrice, currency)} - ${formatPrice(maxPrice, currency)}`;
};
