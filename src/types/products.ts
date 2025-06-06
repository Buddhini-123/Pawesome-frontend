// Product Core Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: ProductImage[];
  price: ProductPrice;
  inventory: ProductInventory;
  category: ProductCategory;
  brand: ProductBrand;
  specifications: ProductSpecification[];
  tags: string[];
  seo: ProductSEO;
  shipping: ProductShipping;
  ratings: ProductRatings;
  variants?: ProductVariant[];
  relatedProducts?: string[]; // Product IDs
  crossSellProducts?: string[]; // Product IDs  
  upsellProducts?: string[]; // Product IDs
  bundleProducts?: ProductBundle[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  isPrimary: boolean;
  sortOrder: number;
  type: 'product' | 'gallery' | 'lifestyle' | 'detail';
}

export interface ProductPrice {
  unitPrice: number;
  purchasePrice?: number;
  salePrice?: number;
  currency: string;
  unit: string;
  discountPercentage?: number;
  priceHistory?: PriceHistoryEntry[];
}

export interface PriceHistoryEntry {
  price: number;
  date: Date;
  reason?: string;
}

export interface ProductInventory {
  currentStock: number;
  lowStockThreshold: number;
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock' | 'pre-order';
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: ProductDimensions;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  parentId?: number;
  icon?: string;
  description?: string;
  petType?: PetType;
  seo?: CategorySEO;
}

export interface ProductBrand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  countryOfOrigin?: string;
  established?: number;
  seo?: BrandSEO;
}

export interface ProductSpecification {
  name: string;
  value: string;
  unit?: string;
  group?: string; // e.g., "Nutrition", "Physical", "Care Instructions"
}

export interface ProductSEO {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  structuredData?: ProductStructuredData;
  canonicalUrl?: string;
  ogImage?: string;
  twitterCard?: TwitterCardData;
}

export interface ProductStructuredData {
  "@context": "https://schema.org/";
  "@type": "Product";
  name: string;
  image: string[];
  description: string;
  brand: {
    "@type": "Brand";
    name: string;
  };
  offers: {
    "@type": "Offer";
    price: number;
    priceCurrency: string;
    availability: string;
    seller: {
      "@type": "Organization";
      name: string;
    };
  };
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
  };
}

export interface TwitterCardData {
  card: "summary" | "summary_large_image" | "app" | "player";
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
}

export interface ProductShipping {
  estimatedDays: number;
  freeShippingThreshold?: number;
  shippingClass?: string;
  restrictions?: string[];
  dimensions?: ProductDimensions;
  weight?: number;
}

export interface ProductRatings {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>; // e.g., {5: 10, 4: 5, 3: 2, 2: 1, 1: 0}
  verified?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  attributes: Record<string, string>; // e.g., {"size": "Large", "color": "Blue"}
  price: ProductPrice;
  inventory: ProductInventory;
  images?: ProductImage[];
  sku?: string;
}

export interface ProductBundle {
  products: Array<{
    productId: string;
    quantity: number;
  }>;
  bundlePrice: number;
  savings: number;
  name: string;
  description?: string;
}

// Category & Brand SEO Types
export interface CategorySEO {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  canonicalUrl?: string;
  structuredData?: CategoryStructuredData;
}

export interface CategoryStructuredData {
  "@context": "https://schema.org/";
  "@type": "CollectionPage";
  name: string;
  description: string;
  url: string;
}

export interface BrandSEO {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  canonicalUrl?: string;
  structuredData?: BrandStructuredData;
}

export interface BrandStructuredData {
  "@context": "https://schema.org/";
  "@type": "Brand";
  name: string;
  description: string;
  logo?: string;
  url?: string;
}

// Pet & Animal Types
export type PetType = 
  | 'dog' 
  | 'cat' 
  | 'bird' 
  | 'fish' 
  | 'rabbit' 
  | 'hamster' 
  | 'guinea-pig' 
  | 'reptile' 
  | 'ferret' 
  | 'other';

export interface PetBreed {
  id: string;
  name: string;
  petType: PetType;
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  characteristics?: string[];
  commonHealthIssues?: string[];
  lifespan?: string;
  origin?: string;
}

// Search & Filter Types
export interface ProductFilters {
  categories?: number[];
  brands?: number[];
  petTypes?: PetType[];
  priceRange?: {
    min: number;
    max: number;
  };
  ratings?: number[];
  inStock?: boolean;
  onSale?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  tags?: string[];
}

export interface ProductSortOptions {
  field: 'name' | 'price' | 'rating' | 'popularity' | 'newest' | 'oldest';
  direction: 'asc' | 'desc';
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  facets: ProductFacets;
}

export interface ProductFacets {
  categories: Array<{ id: number; name: string; count: number }>;
  brands: Array<{ id: number; name: string; count: number }>;
  petTypes: Array<{ type: PetType; count: number }>;
  priceRanges: Array<{ min: number; max: number; count: number }>;
  ratings: Array<{ rating: number; count: number }>;
}

// Component Props Types
export interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list' | 'compact';
  showQuickView?: boolean;
  showCompare?: boolean;
  showWishlist?: boolean;
  className?: string;
  onClick?: (product: Product) => void;
}

export interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  layout?: 'grid' | 'list';
  columns?: number;
  showFilters?: boolean;
  showSorting?: boolean;
  onProductClick?: (product: Product) => void;
  className?: string;
}

export interface ProductDetailsProps {
  product: Product;
  relatedProducts?: Product[];
  onAddToCart?: (product: Product, quantity: number, variant?: ProductVariant) => void;
  onAddToWishlist?: (product: Product) => void;
  className?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  meta?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export type ProductApiResponse = ApiResponse<Product[]>;
export type SingleProductApiResponse = ApiResponse<Product>;
export type CategoryApiResponse = ApiResponse<ProductCategory[]>;
export type BrandApiResponse = ApiResponse<ProductBrand[]>;
