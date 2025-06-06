import { useState, useEffect } from 'react';
import { Product, ProductCategory, ProductBrand } from '../types/products';
import { transformExcelToProducts } from '../services/excelToProductsService';
import categories from '../data/categories';
import brands from '../data/brands';

interface UseProductsDataset {
  products: Product[];
  categories: ProductCategory[];
  brands: ProductBrand[];
  loading: boolean;
  error: string | null;
  totalProducts: number;
  featuredProducts: Product[];
  newProducts: Product[];
  saleProducts: Product[];
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductsByCategory: (categoryId: number) => Product[];
  getProductsByBrand: (brandId: number) => Product[];
  searchProducts: (query: string) => Product[];
  refreshData: () => Promise<void>;
}

const useProductsDataset = (): UseProductsDataset => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProductsFromExcel = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Transform Excel data to products
      const transformedProducts = await transformExcelToProducts('products.xlsx');
      setProducts(transformedProducts);
      
      console.log(`✅ Loaded ${transformedProducts.length} products from Excel`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductsFromExcel();
  }, []);

  // Computed values
  const featuredProducts = products.filter(p => p.isFeatured && p.isActive);
  const newProducts = products.filter(p => p.isNew && p.isActive);
  const saleProducts = products.filter(p => p.isOnSale && p.isActive);

  // Helper functions
  const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  };

  const getProductBySlug = (slug: string): Product | undefined => {
    return products.find(p => p.slug === slug);
  };

  const getProductsByCategory = (categoryId: number): Product[] => {
    return products.filter(p => p.category.id === categoryId && p.isActive);
  };

  const getProductsByBrand = (brandId: number): Product[] => {
    return products.filter(p => p.brand.id === brandId && p.isActive);
  };

  const searchProducts = (query: string): Product[] => {
    if (!query.trim()) return [];
    
    const searchTerms = query.toLowerCase().split(' ');
    
    return products.filter(product => {
      if (!product.isActive) return false;
      
      const searchText = [
        product.name,
        product.description,
        product.shortDescription,
        product.brand.name,
        product.category.name,
        ...product.tags
      ].join(' ').toLowerCase();

      return searchTerms.some(term => searchText.includes(term));
    });
  };

  const refreshData = async () => {
    await loadProductsFromExcel();
  };

  return {
    products: products.filter(p => p.isActive),
    categories: categories as ProductCategory[],
    brands: brands as ProductBrand[],
    loading,
    error,
    totalProducts: products.filter(p => p.isActive).length,
    featuredProducts,
    newProducts,
    saleProducts,
    getProductById,
    getProductBySlug,
    getProductsByCategory,
    getProductsByBrand,
    searchProducts,
    refreshData
  };
};

export default useProductsDataset;