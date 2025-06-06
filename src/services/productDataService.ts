import { Product, ProductCategory, ProductBrand, PetType } from '../types/products';
import { 
  createProductSlug, 
  createCategorySlug, 
  createBrandSlug, 
  stripHtmlTags, 
  extractShortDescription, 
  generateMetaTitle, 
  generateMetaDescription, 
  generateProductKeywords, 
  generateProductTags, 
  getStockStatus 
} from '../utils/productUtils';

// Raw data interfaces matching Excel structure
interface RawProductData {
  name: string;
  description: string;
  added_by: string;
  user_id: number;
  category_id: number;
  brand_id: number;
  video_provider: string;
  video_link: string;
  unit_price: number;
  purchase_price: number | string;
  unit: string;
  current_stock: number;
  est_shipping_days: number;
  meta_title: string;
  meta_description: string;
}

// Default categories mapping (expand based on your actual category data)
const DEFAULT_CATEGORIES: Record<number, ProductCategory> = {
  10: { id: 10, name: 'Dog Food', slug: 'dog-food', petType: 'dog' },
  11: { id: 11, name: 'Cat Food', slug: 'cat-food', petType: 'cat' },
  12: { id: 12, name: 'Dog Grooming', slug: 'dog-grooming', petType: 'dog' },
  15: { id: 15, name: 'Dog Care', slug: 'dog-care', petType: 'dog' },
  16: { id: 16, name: 'Dog Shampoo', slug: 'dog-shampoo', petType: 'dog' },
  18: { id: 18, name: 'Dog Toys', slug: 'dog-toys', petType: 'dog' },
  19: { id: 19, name: 'Dog Treats', slug: 'dog-treats', petType: 'dog' },
  22: { id: 22, name: 'Dog Accessories', slug: 'dog-accessories', petType: 'dog' },
  24: { id: 24, name: 'Cat Accessories', slug: 'cat-accessories', petType: 'cat' },
  25: { id: 25, name: 'Cat Care', slug: 'cat-care', petType: 'cat' },
  26: { id: 26, name: 'Cat Toys', slug: 'cat-toys', petType: 'cat' },
  27: { id: 27, name: 'Cat Treats', slug: 'cat-treats', petType: 'cat' },
  28: { id: 28, name: 'Bird Food', slug: 'bird-food', petType: 'bird' },
  29: { id: 29, name: 'Bird Accessories', slug: 'bird-accessories', petType: 'bird' },
  31: { id: 31, name: 'Small Animal Food', slug: 'small-animal-food', petType: 'rabbit' },
  34: { id: 34, name: 'Fish Food', slug: 'fish-food', petType: 'fish' },
  36: { id: 36, name: 'Dog Health', slug: 'dog-health', petType: 'dog' },
  37: { id: 37, name: 'Cat Health', slug: 'cat-health', petType: 'cat' },
  38: { id: 38, name: 'Bird Health', slug: 'bird-health', petType: 'bird' },
  39: { id: 39, name: 'Small Animal Health', slug: 'small-animal-health', petType: 'rabbit' },
  40: { id: 40, name: 'Fish Health', slug: 'fish-health', petType: 'fish' },
  41: { id: 41, name: 'General Pet Care', slug: 'general-pet-care' },
};

// Default brands mapping (expand based on your actual brand data)
const DEFAULT_BRANDS: Record<number, ProductBrand> = {
  1: { id: 1, name: 'HerbPaw', slug: 'herbpaw', description: 'Natural pet care products' },
  3: { id: 3, name: 'Cinnamon Trails', slug: 'cinnamon-trails', description: 'Natural pet treats and accessories' },
  4: { id: 4, name: 'Forever Friends', slug: 'forever-friends', description: 'Eco-friendly pet products' },
  5: { id: 5, name: 'KocoPlay', slug: 'kocoplay', description: 'Interactive pet toys' },
  6: { id: 6, name: 'PetSafe', slug: 'petsafe', description: 'Pet safety and training products' },
  11: { id: 11, name: 'Royal Canin', slug: 'royal-canin', description: 'Premium pet nutrition' },
  12: { id: 12, name: 'Whiskas', slug: 'whiskas', description: 'Cat food and treats' },
  13: { id: 13, name: 'Pedigree', slug: 'pedigree', description: 'Dog food and treats' },
  14: { id: 14, name: 'Hill\'s', slug: 'hills', description: 'Veterinary diet and nutrition' },
  15: { id: 15, name: 'Purina', slug: 'purina', description: 'Pet food and care products' },
  16: { id: 16, name: 'IAMS', slug: 'iams', description: 'Premium pet nutrition' },
  17: { id: 17, name: 'Eukanuba', slug: 'eukanuba', description: 'High-performance pet nutrition' },
  18: { id: 18, name: 'Taste of the Wild', slug: 'taste-of-the-wild', description: 'Grain-free pet food' },
  19: { id: 19, name: 'Blue Buffalo', slug: 'blue-buffalo', description: 'Natural pet food' },
  20: { id: 20, name: 'Wellness', slug: 'wellness', description: 'Holistic pet nutrition' },
  21: { id: 21, name: 'Merrick', slug: 'merrick', description: 'Natural pet food' },
  22: { id: 22, name: 'Orijen', slug: 'orijen', description: 'Biologically appropriate pet food' },
  23: { id: 23, name: 'Acana', slug: 'acana', description: 'Regional ingredients pet food' },
  24: { id: 24, name: 'Ziwi Peak', slug: 'ziwi-peak', description: 'Air-dried pet food' },
  25: { id: 25, name: 'Stella & Chewy\'s', slug: 'stella-chewys', description: 'Raw pet food' },
};

/**
 * Transform raw Excel data into structured Product objects
 */
export const transformRawDataToProducts = (rawData: RawProductData[]): Product[] => {
  return rawData.map((item, index) => transformSingleProduct(item, index));
};

/**
 * Transform a single raw product into a structured Product object
 */
export const transformSingleProduct = (rawProduct: RawProductData, index: number): Product => {
  const productId = `product-${index + 1}`;
  const category = DEFAULT_CATEGORIES[rawProduct.category_id] || createDefaultCategory(rawProduct.category_id);
  const brand = DEFAULT_BRANDS[rawProduct.brand_id] || createDefaultBrand(rawProduct.brand_id);
  
  // Clean and process description
  const cleanDescription = rawProduct.description || '';
  const shortDescription = extractShortDescription(cleanDescription, 160);
  
  // Generate SEO data
  const metaTitle = rawProduct.meta_title || generateMetaTitle(rawProduct.name, brand.name, category.name);
  const metaDescription = rawProduct.meta_description || generateMetaDescription(
    rawProduct.name, 
    shortDescription, 
    brand.name, 
    rawProduct.unit_price
  );
  
  // Generate keywords
  const keywords = generateProductKeywords(
    rawProduct.name,
    category.name,
    brand.name,
    category.petType,
    extractProductKeywords(cleanDescription)
  );
  
  // Create product slug
  const slug = createProductSlug(rawProduct.name, productId);
  
  // Process pricing
  const purchasePrice = typeof rawProduct.purchase_price === 'number' ? rawProduct.purchase_price : undefined;
  const isOnSale = purchasePrice && purchasePrice > 0 && purchasePrice < rawProduct.unit_price;
  
  // Generate stock status
  const stockStatus = getStockStatus(rawProduct.current_stock, 10);
  
  // Create base product
  const product: Product = {
    id: productId,
    name: rawProduct.name,
    slug,
    description: cleanDescription,
    shortDescription,
    images: generateDefaultImages(rawProduct.name, productId),
    price: {
      unitPrice: rawProduct.unit_price,
      purchasePrice,
      salePrice: isOnSale ? purchasePrice : undefined,
      currency: 'LKR',
      unit: normalizeUnit(rawProduct.unit),
      discountPercentage: isOnSale && purchasePrice 
        ? Math.round(((rawProduct.unit_price - purchasePrice) / rawProduct.unit_price) * 100)
        : undefined
    },
    inventory: {
      currentStock: rawProduct.current_stock,
      lowStockThreshold: 10,
      stockStatus,
      sku: `SKU-${productId.toUpperCase()}`,
      weight: estimateWeight(category.name, rawProduct.unit)
    },
    category,
    brand,
    specifications: generateSpecifications(rawProduct, category),
    tags: [],
    seo: {
      metaTitle,
      metaDescription,
      metaKeywords: keywords,
      structuredData: generateStructuredData(rawProduct, brand, category, slug),
      canonicalUrl: `/products/${slug}`
    },
    shipping: {
      estimatedDays: rawProduct.est_shipping_days || 3,
      freeShippingThreshold: 2500, // Default free shipping threshold
      shippingClass: determineShippingClass(category.name),
      weight: estimateWeight(category.name, rawProduct.unit)
    },
    ratings: {
      averageRating: generateRandomRating(),
      totalReviews: generateRandomReviewCount(),
      ratingDistribution: generateRatingDistribution()
    },
    relatedProducts: [], // Will be populated later
    crossSellProducts: [], // Will be populated later
    upsellProducts: [], // Will be populated later
    bundleProducts: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: rawProduct.current_stock > 0,
    isFeatured: rawProduct.unit_price > 1000 && rawProduct.current_stock > 20,
    isNew: index < 10, // Mark first 10 products as new
    isOnSale: isOnSale || false
  };
  
  // Generate tags based on the complete product
  product.tags = generateProductTags(product);
  
  return product;
};

/**
 * Helper functions for data transformation
 */

const createDefaultCategory = (categoryId: number): ProductCategory => ({
  id: categoryId,
  name: `Category ${categoryId}`,
  slug: `category-${categoryId}`,
  description: `Products in category ${categoryId}`
});

const createDefaultBrand = (brandId: number): ProductBrand => ({
  id: brandId,
  name: `Brand ${brandId}`,
  slug: `brand-${brandId}`,
  description: `Products from brand ${brandId}`
});

const normalizeUnit = (unit: string): string => {
  const unitMap: Record<string, string> = {
    'pc': 'piece',
    'Pc': 'piece',
    'KG': 'kg',
    'G': 'g',
    'pack': 'pack',
    '1': 'piece'
  };
  
  return unitMap[unit] || unit.toLowerCase();
};

const generateDefaultImages = (productName: string, productId: string): any[] => {
  const placeholder = `https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=center`;
  
  return [
    {
      id: `${productId}-img-1`,
      url: placeholder,
      alt: `${productName} - Main Image`,
      caption: productName,
      isPrimary: true,
      sortOrder: 1,
      type: 'product' as const
    }
  ];
};

const generateSpecifications = (rawProduct: RawProductData, category: ProductCategory): any[] => {
  const specs = [
    { name: 'Unit', value: normalizeUnit(rawProduct.unit), group: 'Basic Info' },
    { name: 'Brand ID', value: rawProduct.brand_id.toString(), group: 'Basic Info' },
    { name: 'Category', value: category.name, group: 'Basic Info' }
  ];
  
  // Add category-specific specs
  if (category.petType) {
    specs.push({ name: 'Suitable For', value: category.petType, group: 'Pet Info' });
  }
  
  if (rawProduct.video_link) {
    specs.push({ name: 'Video Available', value: 'Yes', group: 'Media' });
  }
  
  return specs;
};

const estimateWeight = (categoryName: string, unit: string): number => {
  const category = categoryName.toLowerCase();
  
  if (unit.toLowerCase().includes('kg')) return 1000;
  if (unit.toLowerCase().includes('g')) return 500;
  if (category.includes('food')) return 500;
  if (category.includes('toy')) return 200;
  if (category.includes('accessory')) return 150;
  
  return 100; // Default weight in grams
};

const determineShippingClass = (categoryName: string): string => {
  const category = categoryName.toLowerCase();
  
  if (category.includes('food')) return 'standard';
  if (category.includes('toy')) return 'light';
  if (category.includes('health') || category.includes('medicine')) return 'fragile';
  
  return 'standard';
};

const generateRandomRating = (): number => {
  return Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 to 5.0
};

const generateRandomReviewCount = (): number => {
  return Math.floor(Math.random() * 100) + 5; // 5 to 104 reviews
};

const generateRatingDistribution = (): Record<number, number> => {
  const total = generateRandomReviewCount();
  const distribution: Record<number, number> = {};
  
  // Generate realistic distribution favoring higher ratings
  distribution[5] = Math.floor(total * 0.5);
  distribution[4] = Math.floor(total * 0.3);
  distribution[3] = Math.floor(total * 0.15);
  distribution[2] = Math.floor(total * 0.04);
  distribution[1] = Math.floor(total * 0.01);
  
  return distribution;
};

const extractProductKeywords = (description: string): string[] => {
  const text = stripHtmlTags(description).toLowerCase();
  const petKeywords = ['natural', 'organic', 'premium', 'healthy', 'nutritious', 'safe', 'effective', 'quality'];
  
  return petKeywords.filter(keyword => text.includes(keyword));
};

const generateStructuredData = (
  rawProduct: RawProductData, 
  brand: ProductBrand, 
  category: ProductCategory, 
  slug: string
): any => {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: rawProduct.name,
    image: [`https://pawsome.lk/images/products/${slug}-1.jpg`],
    description: stripHtmlTags(rawProduct.description).substring(0, 200),
    brand: {
      "@type": "Brand",
      name: brand.name
    },
    offers: {
      "@type": "Offer",
      price: rawProduct.unit_price,
      priceCurrency: "LKR",
      availability: rawProduct.current_stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Pawsome Sri Lanka"
      }
    },
    category: category.name,
    sku: `SKU-PRODUCT-${rawProduct.category_id}-${rawProduct.brand_id}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: generateRandomRating(),
      reviewCount: generateRandomReviewCount()
    }
  };
};

/**
 * Generate related products mapping after all products are created
 */
export const generateRelatedProductsMapping = (products: Product[]): Product[] => {
  return products.map(product => {
    // Find products in same category
    const sameCategory = products.filter(p => 
      p.id !== product.id && 
      p.category.id === product.category.id &&
      p.isActive
    ).slice(0, 4);
    
    // Find products from same brand
    const sameBrand = products.filter(p => 
      p.id !== product.id && 
      p.brand.id === product.brand.id &&
      p.isActive &&
      !sameCategory.some(sc => sc.id === p.id)
    ).slice(0, 2);
    
    // Find products in similar price range
    const priceRange = product.price.unitPrice * 0.3;
    const similarPrice = products.filter(p => 
      p.id !== product.id &&
      Math.abs(p.price.unitPrice - product.price.unitPrice) <= priceRange &&
      p.isActive &&
      !sameCategory.some(sc => sc.id === p.id) &&
      !sameBrand.some(sb => sb.id === p.id)
    ).slice(0, 2);
    
    const relatedProducts = [
      ...sameCategory,
      ...sameBrand,
      ...similarPrice
    ].slice(0, 8);
    
    // Generate cross-sell products (accessories or complementary items)
    const crossSell = products.filter(p => 
      p.id !== product.id &&
      p.category.petType === product.category.petType &&
      p.category.id !== product.category.id &&
      p.isActive
    ).slice(0, 4);
    
    // Generate upsell products (higher priced similar products)
    const upsell = products.filter(p => 
      p.id !== product.id &&
      p.category.id === product.category.id &&
      p.price.unitPrice > product.price.unitPrice &&
      p.price.unitPrice <= product.price.unitPrice * 1.5 &&
      p.isActive
    ).slice(0, 3);
    
    return {
      ...product,
      relatedProducts: relatedProducts.map(p => p.id),
      crossSellProducts: crossSell.map(p => p.id),
      upsellProducts: upsell.map(p => p.id)
    };
  });
};

/**
 * Export functions and constants for use in data processing
 */
export { DEFAULT_CATEGORIES, DEFAULT_BRANDS };
export type { RawProductData };
