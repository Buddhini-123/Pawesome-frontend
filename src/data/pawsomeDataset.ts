import { Product, ProductCategory, ProductBrand } from '../types/products';
import { transformRawDataToProducts, generateRelatedProductsMapping, DEFAULT_CATEGORIES, DEFAULT_BRANDS, RawProductData } from '../services/productDataService';

/**
 * Main dataset containing all products, categories, and brands
 */
class PawsomeDataset {
  private static instance: PawsomeDataset;
  private products: Product[] = [];
  private categories: ProductCategory[] = [];
  private brands: ProductBrand[] = [];
  private isLoaded = false;

  private constructor() {}

  public static getInstance(): PawsomeDataset {
    if (!PawsomeDataset.instance) {
      PawsomeDataset.instance = new PawsomeDataset();
    }
    return PawsomeDataset.instance;
  }

  /**
   * Load and process the Excel data
   */
  public async loadFromExcelData(rawData: RawProductData[]): Promise<void> {
    if (this.isLoaded) return;

    try {
      // Transform raw data to products
      console.log('Transforming raw data to products...');
      let products = transformRawDataToProducts(rawData);
      
      // Generate related products mapping
      console.log('Generating related products mapping...');
      products = generateRelatedProductsMapping(products);
      
      // Set the data
      this.products = products;
      this.categories = Object.values(DEFAULT_CATEGORIES);
      this.brands = Object.values(DEFAULT_BRANDS);
      
      this.isLoaded = true;
      console.log(`Dataset loaded successfully with ${this.products.length} products, ${this.categories.length} categories, and ${this.brands.length} brands.`);
    } catch (error) {
      console.error('Error loading dataset:', error);
      throw error;
    }
  }

  /**
   * Get all products
   */
  public getProducts(): Product[] {
    return [...this.products];
  }

  /**
   * Get products with filtering and pagination
   */
  public getFilteredProducts(filters: {
    categoryId?: number;
    brandId?: number;
    petType?: string;
    priceRange?: { min: number; max: number };
    inStock?: boolean;
    featured?: boolean;
    onSale?: boolean;
    searchQuery?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
    sortBy?: 'name' | 'price' | 'rating' | 'newest';
    sortOrder?: 'asc' | 'desc';
  } = {}): { products: Product[]; total: number } {
    let filtered = [...this.products];

    // Apply filters
    if (filters.categoryId) {
      filtered = filtered.filter(p => p.category.id === filters.categoryId);
    }

    if (filters.brandId) {
      filtered = filtered.filter(p => p.brand.id === filters.brandId);
    }

    if (filters.petType) {
      filtered = filtered.filter(p => p.category.petType === filters.petType);
    }

    if (filters.priceRange) {
      filtered = filtered.filter(p => 
        p.price.unitPrice >= filters.priceRange!.min && 
        p.price.unitPrice <= filters.priceRange!.max
      );
    }

    if (filters.inStock) {
      filtered = filtered.filter(p => p.inventory.stockStatus === 'in-stock');
    }

    if (filters.featured) {
      filtered = filtered.filter(p => p.isFeatured);
    }

    if (filters.onSale) {
      filtered = filtered.filter(p => p.isOnSale);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.brand.name.toLowerCase().includes(query) ||
        p.category.name.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(p => 
        filters.tags!.some(tag => p.tags.includes(tag))
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let comparison = 0;
        
        switch (filters.sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'price':
            comparison = a.price.unitPrice - b.price.unitPrice;
            break;
          case 'rating':
            comparison = a.ratings.averageRating - b.ratings.averageRating;
            break;
          case 'newest':
            comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            break;
          default:
            comparison = 0;
        }
        
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    const total = filtered.length;

    // Apply pagination
    if (filters.offset || filters.limit) {
      const offset = filters.offset || 0;
      const limit = filters.limit || 20;
      filtered = filtered.slice(offset, offset + limit);
    }

    return { products: filtered, total };
  }

  /**
   * Get a single product by ID
   */
  public getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  /**
   * Get a single product by slug
   */
  public getProductBySlug(slug: string): Product | undefined {
    return this.products.find(p => p.slug === slug);
  }

  /**
   * Get related products for a product
   */
  public getRelatedProducts(productId: string, limit: number = 8): Product[] {
    const product = this.getProductById(productId);
    if (!product || !product.relatedProducts) return [];

    return product.relatedProducts
      .map(id => this.getProductById(id))
      .filter((p): p is Product => p !== undefined)
      .slice(0, limit);
  }

  /**
   * Get cross-sell products for a product
   */
  public getCrossSellProducts(productId: string, limit: number = 4): Product[] {
    const product = this.getProductById(productId);
    if (!product || !product.crossSellProducts) return [];

    return product.crossSellProducts
      .map(id => this.getProductById(id))
      .filter((p): p is Product => p !== undefined)
      .slice(0, limit);
  }

  /**
   * Get upsell products for a product
   */
  public getUpsellProducts(productId: string, limit: number = 3): Product[] {
    const product = this.getProductById(productId);
    if (!product || !product.upsellProducts) return [];

    return product.upsellProducts
      .map(id => this.getProductById(id))
      .filter((p): p is Product => p !== undefined)
      .slice(0, limit);
  }

  /**
   * Get all categories
   */
  public getCategories(): ProductCategory[] {
    return [...this.categories];
  }

  /**
   * Get categories by pet type
   */
  public getCategoriesByPetType(petType: string): ProductCategory[] {
    return this.categories.filter(c => c.petType === petType);
  }

  /**
   * Get category by ID
   */
  public getCategoryById(id: number): ProductCategory | undefined {
    return this.categories.find(c => c.id === id);
  }

  /**
   * Get category by slug
   */
  public getCategoryBySlug(slug: string): ProductCategory | undefined {
    return this.categories.find(c => c.slug === slug);
  }

  /**
   * Get all brands
   */
  public getBrands(): ProductBrand[] {
    return [...this.brands];
  }

  /**
   * Get brand by ID
   */
  public getBrandById(id: number): ProductBrand | undefined {
    return this.brands.find(b => b.id === id);
  }

  /**
   * Get brand by slug
   */
  public getBrandBySlug(slug: string): ProductBrand | undefined {
    return this.brands.find(b => b.slug === slug);
  }

  /**
   * Get featured products
   */
  public getFeaturedProducts(limit: number = 12): Product[] {
    return this.products
      .filter(p => p.isFeatured && p.isActive)
      .slice(0, limit);
  }

  /**
   * Get new products
   */
  public getNewProducts(limit: number = 12): Product[] {
    return this.products
      .filter(p => p.isNew && p.isActive)
      .slice(0, limit);
  }

  /**
   * Get products on sale
   */
  public getSaleProducts(limit: number = 12): Product[] {
    return this.products
      .filter(p => p.isOnSale && p.isActive)
      .slice(0, limit);
  }

  /**
   * Get popular products (high ratings and reviews)
   */
  public getPopularProducts(limit: number = 12): Product[] {
    return this.products
      .filter(p => p.isActive)
      .sort((a, b) => {
        const scoreA = a.ratings.averageRating * Math.log(a.ratings.totalReviews + 1);
        const scoreB = b.ratings.averageRating * Math.log(b.ratings.totalReviews + 1);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  /**
   * Search products with advanced search capabilities
   */
  public searchProducts(query: string, options: {
    fuzzy?: boolean;
    categories?: number[];
    brands?: number[];
    limit?: number;
  } = {}): Product[] {
    const searchTerms = query.toLowerCase().split(' ');
    
    const results = this.products
      .filter(p => p.isActive)
      .map(product => {
        let score = 0;
        const searchText = [
          product.name,
          product.description,
          product.shortDescription,
          product.brand.name,
          product.category.name,
          ...product.tags,
          ...product.seo.metaKeywords
        ].join(' ').toLowerCase();

        // Calculate relevance score
        searchTerms.forEach(term => {
          const termCount = (searchText.match(new RegExp(term, 'g')) || []).length;
          score += termCount;
          
          // Boost for exact matches in name
          if (product.name.toLowerCase().includes(term)) score += 10;
          
          // Boost for brand matches
          if (product.brand.name.toLowerCase().includes(term)) score += 5;
          
          // Boost for category matches
          if (product.category.name.toLowerCase().includes(term)) score += 3;
        });

        return { product, score };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score);

    // Apply additional filters
    let filtered = results.map(r => r.product);
    
    if (options.categories && options.categories.length > 0) {
      filtered = filtered.filter(p => options.categories!.includes(p.category.id));
    }

    if (options.brands && options.brands.length > 0) {
      filtered = filtered.filter(p => options.brands!.includes(p.brand.id));
    }

    return filtered.slice(0, options.limit || 20);
  }

  /**
   * Get product statistics
   */
  public getStatistics(): {
    totalProducts: number;
    activeProducts: number;
    featuredProducts: number;
    onSaleProducts: number;
    averagePrice: number;
    categoriesCount: number;
    brandsCount: number;
    priceRange: { min: number; max: number };
    stockStatus: Record<string, number>;
  } {
    const activeProducts = this.products.filter(p => p.isActive);
    const prices = activeProducts.map(p => p.price.unitPrice);
    
    return {
      totalProducts: this.products.length,
      activeProducts: activeProducts.length,
      featuredProducts: this.products.filter(p => p.isFeatured).length,
      onSaleProducts: this.products.filter(p => p.isOnSale).length,
      averagePrice: prices.reduce((a, b) => a + b, 0) / prices.length,
      categoriesCount: this.categories.length,
      brandsCount: this.brands.length,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      },
      stockStatus: this.products.reduce((acc, p) => {
        acc[p.inventory.stockStatus] = (acc[p.inventory.stockStatus] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  /**
   * Get trending products based on a combination of factors
   */
  public getTrendingProducts(limit: number = 12): Product[] {
    return this.products
      .filter(p => p.isActive)
      .sort((a, b) => {
        // Trending score based on multiple factors
        const scoreA = (
          (a.ratings.averageRating * 0.3) +
          (Math.log(a.ratings.totalReviews + 1) * 0.2) +
          (a.isFeatured ? 10 : 0) +
          (a.isNew ? 5 : 0) +
          (a.isOnSale ? 3 : 0) +
          (a.inventory.currentStock > 50 ? 2 : 0)
        );
        
        const scoreB = (
          (b.ratings.averageRating * 0.3) +
          (Math.log(b.ratings.totalReviews + 1) * 0.2) +
          (b.isFeatured ? 10 : 0) +
          (b.isNew ? 5 : 0) +
          (b.isOnSale ? 3 : 0) +
          (b.inventory.currentStock > 50 ? 2 : 0)
        );
        
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  /**
   * Get products by price range
   */
  public getProductsByPriceRange(min: number, max: number, limit?: number): Product[] {
    const filtered = this.products.filter(p => 
      p.isActive && 
      p.price.unitPrice >= min && 
      p.price.unitPrice <= max
    );
    
    return limit ? filtered.slice(0, limit) : filtered;
  }

  /**
   * Get low stock products
   */
  public getLowStockProducts(): Product[] {
    return this.products.filter(p => 
      p.isActive && 
      p.inventory.stockStatus === 'low-stock'
    );
  }

  /**
   * Get out of stock products
   */
  public getOutOfStockProducts(): Product[] {
    return this.products.filter(p => 
      p.inventory.stockStatus === 'out-of-stock'
    );
  }

  /**
   * Check if dataset is loaded
   */
  public isDatasetLoaded(): boolean {
    return this.isLoaded;
  }

  /**
   * Reset the dataset
   */
  public reset(): void {
    this.products = [];
    this.categories = [];
    this.brands = [];
    this.isLoaded = false;
  }
}

/**
 * Export singleton instance and utility functions
 */
export const pawsomeDataset = PawsomeDataset.getInstance();

/**
 * Convenience functions for easy access
 */
export const getProducts = () => pawsomeDataset.getProducts();
export const getProductById = (id: string) => pawsomeDataset.getProductById(id);
export const getProductBySlug = (slug: string) => pawsomeDataset.getProductBySlug(slug);
export const getFeaturedProducts = (limit?: number) => pawsomeDataset.getFeaturedProducts(limit);
export const getNewProducts = (limit?: number) => pawsomeDataset.getNewProducts(limit);
export const getSaleProducts = (limit?: number) => pawsomeDataset.getSaleProducts(limit);
export const getPopularProducts = (limit?: number) => pawsomeDataset.getPopularProducts(limit);
export const getTrendingProducts = (limit?: number) => pawsomeDataset.getTrendingProducts(limit);
export const getCategories = () => pawsomeDataset.getCategories();
export const getCategoryById = (id: number) => pawsomeDataset.getCategoryById(id);
export const getCategoryBySlug = (slug: string) => pawsomeDataset.getCategoryBySlug(slug);
export const getBrands = () => pawsomeDataset.getBrands();
export const getBrandById = (id: number) => pawsomeDataset.getBrandById(id);
export const getBrandBySlug = (slug: string) => pawsomeDataset.getBrandBySlug(slug);
export const searchProducts = (query: string, options?: any) => pawsomeDataset.searchProducts(query, options);
export const getFilteredProducts = (filters: any) => pawsomeDataset.getFilteredProducts(filters);
export const getRelatedProducts = (productId: string, limit?: number) => pawsomeDataset.getRelatedProducts(productId, limit);
export const getCrossSellProducts = (productId: string, limit?: number) => pawsomeDataset.getCrossSellProducts(productId, limit);
export const getUpsellProducts = (productId: string, limit?: number) => pawsomeDataset.getUpsellProducts(productId, limit);

export default pawsomeDataset;
