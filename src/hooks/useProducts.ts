import { useState, useEffect, useMemo } from 'react';
import { Product, ProductCategory, ProductBrand, ProductFilters } from '../types/products';
import pawsomeDataset from '../data/pawsomeDataset';
import { DatasetInitializer } from '../data/datasetInitializer';

/**
 * Hook for accessing the dataset and ensuring it's initialized
 */
export const useDataset = () => {
  const [isLoading, setIsLoading] = useState(!pawsomeDataset.isDatasetLoaded());
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(pawsomeDataset.isDatasetLoaded());

  useEffect(() => {
    const initializeDataset = async () => {
      if (!pawsomeDataset.isDatasetLoaded()) {
        try {
          setIsLoading(true);
          setError(null);
          await DatasetInitializer.initializeFromExcel();
          setIsInitialized(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to initialize dataset');
          console.error('Dataset initialization error:', err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    initializeDataset();
  }, []);

  return {
    isLoading,
    error,
    isInitialized,
    dataset: pawsomeDataset
  };
};

/**
 * Hook for fetching products with filtering and pagination
 */
export const useProducts = (filters: ProductFilters & {
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
} = {}) => {
  const { isLoading: datasetLoading, isInitialized } = useDataset();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isInitialized) {
      setLoading(true);
      try {
        const result = pawsomeDataset.getFilteredProducts(filters);
        setProducts(result.products);
        setTotal(result.total);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }
  }, [isInitialized, JSON.stringify(filters)]);

  return {
    products,
    total,
    loading: datasetLoading || loading,
    refetch: () => {
      if (isInitialized) {
        const result = pawsomeDataset.getFilteredProducts(filters);
        setProducts(result.products);
        setTotal(result.total);
      }
    }
  };
};

/**
 * Hook for fetching a single product by ID or slug
 */
export const useProduct = (identifier: string, bySlug: boolean = false) => {
  const { isLoading: datasetLoading, isInitialized } = useDataset();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isInitialized && identifier) {
      setLoading(true);
      setError(null);
      
      try {
        const foundProduct = bySlug 
          ? pawsomeDataset.getProductBySlug(identifier)
          : pawsomeDataset.getProductById(identifier);
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError(`Product not found: ${identifier}`);
          setProduct(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching product');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
  }, [identifier, bySlug, isInitialized]);

  return {
    product,
    loading: datasetLoading || loading,
    error
  };
};

/**
 * Hook for fetching related products
 */
export const useRelatedProducts = (productId: string, limit: number = 8) => {
  const { isInitialized } = useDataset();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isInitialized && productId) {
      const related = pawsomeDataset.getRelatedProducts(productId, limit);
      setRelatedProducts(related);
    }
  }, [productId, limit, isInitialized]);

  return relatedProducts;
};

/**
 * Hook for fetching cross-sell products
 */
export const useCrossSellProducts = (productId: string, limit: number = 4) => {
  const { isInitialized } = useDataset();
  const [crossSellProducts, setCrossSellProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isInitialized && productId) {
      const crossSell = pawsomeDataset.getCrossSellProducts(productId, limit);
      setCrossSellProducts(crossSell);
    }
  }, [productId, limit, isInitialized]);

  return crossSellProducts;
};

/**
 * Hook for fetching upsell products
 */
export const useUpsellProducts = (productId: string, limit: number = 3) => {
  const { isInitialized } = useDataset();
  const [upsellProducts, setUpsellProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isInitialized && productId) {
      const upsell = pawsomeDataset.getUpsellProducts(productId, limit);
      setUpsellProducts(upsell);
    }
  }, [productId, limit, isInitialized]);

  return upsellProducts;
};

/**
 * Hook for fetching categories
 */
export const useCategories = (petType?: string) => {
  const { isLoading: datasetLoading, isInitialized } = useDataset();
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  useEffect(() => {
    if (isInitialized) {
      const allCategories = petType 
        ? pawsomeDataset.getCategoriesByPetType(petType)
        : pawsomeDataset.getCategories();
      setCategories(allCategories);
    }
  }, [petType, isInitialized]);

  return {
    categories,
    loading: datasetLoading
  };
};

/**
 * Hook for fetching brands
 */
export const useBrands = () => {
  const { isLoading: datasetLoading, isInitialized } = useDataset();
  const [brands, setBrands] = useState<ProductBrand[]>([]);

  useEffect(() => {
    if (isInitialized) {
      const allBrands = pawsomeDataset.getBrands();
      setBrands(allBrands);
    }
  }, [isInitialized]);

  return {
    brands,
    loading: datasetLoading
  };
};

/**
 * Debounce hook for search queries
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for product search with debouncing
 */
export const useProductSearch = (query: string, options: {
  categories?: number[];
  brands?: number[];
  limit?: number;
  debounceMs?: number;
} = {}) => {
  const { isInitialized } = useDataset();
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  
  const debouncedQuery = useDebounce(query, options.debounceMs || 300);

  useEffect(() => {
    if (isInitialized && debouncedQuery.trim()) {
      setLoading(true);
      try {
        const searchResults = pawsomeDataset.searchProducts(debouncedQuery, options);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [debouncedQuery, isInitialized, JSON.stringify(options)]);

  return {
    results,
    loading,
    query: debouncedQuery
  };
};

/**
 * Hook for featured/new/sale products
 */
export const useFeaturedProducts = (type: 'featured' | 'new' | 'sale' | 'popular' | 'trending' = 'featured', limit: number = 12) => {
  const { isLoading: datasetLoading, isInitialized } = useDataset();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isInitialized) {
      let result: Product[] = [];
      
      switch (type) {
        case 'featured':
          result = pawsomeDataset.getFeaturedProducts(limit);
          break;
        case 'new':
          result = pawsomeDataset.getNewProducts(limit);
          break;
        case 'sale':
          result = pawsomeDataset.getSaleProducts(limit);
          break;
        case 'popular':
          result = pawsomeDataset.getPopularProducts(limit);
          break;
        case 'trending':
          result = pawsomeDataset.getTrendingProducts(limit);
          break;
        default:
          result = pawsomeDataset.getFeaturedProducts(limit);
      }
      
      setProducts(result);
    }
  }, [type, limit, isInitialized]);

  return {
    products,
    loading: datasetLoading
  };
};

/**
 * Hook for dataset statistics
 */
export const useDatasetStats = () => {
  const { isLoading: datasetLoading, isInitialized } = useDataset();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (isInitialized) {
      const statistics = pawsomeDataset.getStatistics();
      setStats(statistics);
    }
  }, [isInitialized]);

  return {
    stats,
    loading: datasetLoading
  };
};

/**
 * Hook for category/brand specific products
 */
export const useCategoryProducts = (categoryId: number, limit?: number) => {
  const filters = useMemo(() => ({
    categoryId,
    limit
  }), [categoryId, limit]);

  return useProducts(filters);
};

export const useBrandProducts = (brandId: number, limit?: number) => {
  const filters = useMemo(() => ({
    brandId,
    limit
  }), [brandId, limit]);

  return useProducts(filters);
};

/**
 * Hook for pet type specific products
 */
export const usePetTypeProducts = (petType: string, limit?: number) => {
  const filters = useMemo(() => ({
    petType,
    limit
  }), [petType, limit]);

  return useProducts(filters);
};

/**
 * Hook for price range products
 */
export const usePriceRangeProducts = (minPrice: number, maxPrice: number, limit?: number) => {
  const { isInitialized } = useDataset();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isInitialized) {
      const result = pawsomeDataset.getProductsByPriceRange(minPrice, maxPrice, limit);
      setProducts(result);
    }
  }, [minPrice, maxPrice, limit, isInitialized]);

  return products;
};

/**
 * Hook for inventory management
 */
export const useInventoryProducts = (type: 'low-stock' | 'out-of-stock') => {
  const { isInitialized } = useDataset();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isInitialized) {
      const result = type === 'low-stock' 
        ? pawsomeDataset.getLowStockProducts()
        : pawsomeDataset.getOutOfStockProducts();
      setProducts(result);
    }
  }, [type, isInitialized]);

  return products;
};

/**
 * Hook for product recommendations based on user behavior
 * This is a simplified version - in a real app, this would consider user history
 */
export const useProductRecommendations = (basedOnProduct?: Product, limit: number = 8) => {
  const { isInitialized } = useDataset();
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    if (isInitialized) {
      if (basedOnProduct) {
        // Get recommendations based on the product
        const related = pawsomeDataset.getRelatedProducts(basedOnProduct.id, limit);
        setRecommendations(related);
      } else {
        // Get trending products as general recommendations
        const trending = pawsomeDataset.getTrendingProducts(limit);
        setRecommendations(trending);
      }
    }
  }, [basedOnProduct?.id, limit, isInitialized]);

  return recommendations;
};
