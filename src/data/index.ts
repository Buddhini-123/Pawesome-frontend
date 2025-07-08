// Central export file for all mock data

// Products
export * from './mockProducts';

// Subscriptions
export * from './subscriptionProducts';

// Gift Box
export * from './giftBoxProducts';

// Deals
export { mockDealsData } from '../components/mockDeals';

// Helper function to get products by IDs
export const getProductsByIds = (productIds: string[], allProducts: any[]) => {
  return allProducts.filter(product => productIds.includes(product.id));
};

// Get all products in one array
import { dogProducts, catProducts, birdProducts, otherAnimalsProducts, vetDietProducts } from './mockProducts';

export const allProducts = [
  ...dogProducts,
  ...catProducts,
  ...birdProducts,
  ...otherAnimalsProducts,
  ...vetDietProducts
];

// Category mappings for easy access
export const productsByCategory = {
  dogs: dogProducts,
  cats: catProducts,
  birds: birdProducts,
  other: otherAnimalsProducts,
  vetdiet: vetDietProducts
};

// Quick stats
export const productStats = {
  totalProducts: allProducts.length,
  categories: {
    dogs: dogProducts.length,
    cats: catProducts.length,
    birds: birdProducts.length,
    other: otherAnimalsProducts.length,
    vetdiet: vetDietProducts.length
  },
  priceRange: {
    min: Math.min(...allProducts.map(p => p.price)),
    max: Math.max(...allProducts.map(p => p.price))
  },
  brandsCount: new Set(allProducts.map(p => p.brand)).size,
  productsInStock: allProducts.filter(p => p.inStock).length,
  productsWithDiscount: allProducts.filter(p => p.discount).length
};