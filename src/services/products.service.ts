import { Product, SearchFilters, PaginatedResponse } from '../types';
import { dogProducts, catProducts, birdProducts, otherAnimalsProducts, vetDietProducts } from '../data/mockProducts';

class ProductsService {
  private allProducts: Product[];

  constructor() {
    // Combine all products
    this.allProducts = [
      ...dogProducts,
      ...catProducts,
      ...birdProducts,
      ...otherAnimalsProducts,
      ...vetDietProducts
    ];
  }

  async getProducts(filters?: SearchFilters): Promise<PaginatedResponse<Product>> {
    // Simulate API delay
    await this.simulateDelay();

    let filteredProducts = [...this.allProducts];

    if (filters) {
      // Apply search query
      if (filters.query) {
        const query = filters.query.toLowerCase();
        filteredProducts = filteredProducts.filter(
          product =>
            product.name.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query)
        );
      }

      // Apply category filter
      if (filters.category) {
        filteredProducts = filteredProducts.filter(
          product => product.category === filters.category
        );
      }

      // Apply subcategory filter
      if (filters.subcategory) {
        filteredProducts = filteredProducts.filter(
          product => product.subcategory === filters.subcategory
        );
      }

      // Apply brand filter
      if (filters.brands && filters.brands.length > 0) {
        filteredProducts = filteredProducts.filter(
          product => filters.brands!.includes(product.brand)
        );
      }

      // Apply price range filter
      if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(
          product => product.price >= filters.minPrice!
        );
      }

      if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(
          product => product.price <= filters.maxPrice!
        );
      }

      // Apply rating filter
      if (filters.minRating !== undefined) {
        filteredProducts = filteredProducts.filter(
          product => product.rating >= filters.minRating!
        );
      }

      // Apply stock filter
      if (filters.inStock !== undefined) {
        filteredProducts = filteredProducts.filter(
          product => product.inStock === filters.inStock
        );
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
          case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        }
      }
    }

    // Pagination (default to page 1, 20 items per page)
    const page = 1;
    const pageSize = 20;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      items: paginatedProducts,
      total: filteredProducts.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredProducts.length / pageSize)
    };
  }

  async getProductById(id: string): Promise<Product | null> {
    await this.simulateDelay();
    
    const product = this.allProducts.find(p => p.id === id);
    return product || null;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    await this.simulateDelay();
    
    return this.allProducts.filter(p => p.category === category);
  }

  async searchProducts(query: string): Promise<Product[]> {
    await this.simulateDelay();
    
    const searchQuery = query.toLowerCase();
    return this.allProducts.filter(
      product =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.brand.toLowerCase().includes(searchQuery) ||
        product.description?.toLowerCase().includes(searchQuery)
    );
  }

  async getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
    await this.simulateDelay();
    
    const product = await this.getProductById(productId);
    if (!product) return [];

    // Find products in the same category, excluding the current product
    const relatedProducts = this.allProducts
      .filter(p => p.category === product.category && p.id !== productId)
      .sort(() => Math.random() - 0.5) // Randomize
      .slice(0, limit);

    return relatedProducts;
  }

  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    await this.simulateDelay();
    
    // Return products with highest ratings or discounts
    return this.allProducts
      .filter(p => p.inStock)
      .sort((a, b) => {
        // Prioritize discounted products and high ratings
        const scoreA = (a.discount || 0) + a.rating * 10;
        const scoreB = (b.discount || 0) + b.rating * 10;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  async getProductsByBrand(brand: string): Promise<Product[]> {
    await this.simulateDelay();
    
    return this.allProducts.filter(p => p.brand === brand);
  }

  async getBrands(): Promise<string[]> {
    await this.simulateDelay();
    
    const brands = new Set(this.allProducts.map(p => p.brand));
    return Array.from(brands).sort();
  }

  async getCategories(): Promise<string[]> {
    await this.simulateDelay();
    
    const categories = new Set(this.allProducts.map(p => p.category));
    return Array.from(categories);
  }

  async getSubcategories(category?: string): Promise<string[]> {
    await this.simulateDelay();
    
    let products = this.allProducts;
    if (category) {
      products = products.filter(p => p.category === category);
    }
    
    const subcategories = new Set(products.map(p => p.subcategory));
    return Array.from(subcategories).sort();
  }

  async getPriceRange(): Promise<{ min: number; max: number }> {
    await this.simulateDelay();
    
    const prices = this.allProducts.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }

  async validateProductAvailability(productId: string, quantity: number): Promise<boolean> {
    await this.simulateDelay();
    
    const product = await this.getProductById(productId);
    if (!product) return false;
    
    // For now, just check if product is in stock
    // In a real app, we'd check actual inventory
    return product.inStock && quantity > 0;
  }

  async getDealsProducts(): Promise<Product[]> {
    await this.simulateDelay();
    
    // Return products with discounts
    return this.allProducts
      .filter(p => p.discount && p.discount > 0 && p.inStock)
      .sort((a, b) => (b.discount || 0) - (a.discount || 0));
  }

  private async simulateDelay(): Promise<void> {
    const delay = Math.floor(Math.random() * 300) + 100;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Create singleton instance
export const productsService = new ProductsService();