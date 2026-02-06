import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import ProductCard from '../../common/ProductCard';
import { productsService } from '../../../services/products.service';
import { Product } from '../../../types';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const results = await productsService.searchProducts(query);
        setProducts(results);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    productsService.searchProducts(query)
      .then(results => setProducts(results))
      .catch(() => setError('Failed to search products. Please try again.'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-soft-gray">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-fredoka font-bold text-charcoal mb-2">
            Search Results for: "{query}"
          </h1>
          {!loading && !error && (
            <p className="text-lg text-medium-gray">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </p>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-crimson/10 border border-crimson rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-crimson font-fredoka font-semibold mb-2">
                  ⚠️ {error}
                </p>
              </div>
              <button
                onClick={handleRetry}
                className="bg-crimson text-white px-6 py-2 rounded-full font-fredoka font-semibold hover:bg-crimson/90 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-56 bg-soft-gray"></div>
                <div className="p-5">
                  <div className="h-4 bg-soft-gray rounded mb-2 w-1/3"></div>
                  <div className="h-6 bg-soft-gray rounded mb-3 w-full"></div>
                  <div className="h-4 bg-soft-gray rounded mb-4 w-2/3"></div>
                  <div className="h-8 bg-soft-gray rounded mb-4 w-1/2"></div>
                  <div className="h-12 bg-soft-gray rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && query.trim() && (
          <div className="text-center py-16">
            <div className="mb-6">
              <Search className="h-24 w-24 text-light-gray mx-auto mb-4" />
            </div>
            <h2 className="text-2xl font-fredoka font-bold text-charcoal mb-4">
              No products found for: "{query}"
            </h2>
            <p className="text-lg text-medium-gray mb-6">
              Try different keywords or browse our categories
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="/dogs"
                className="bg-primary-blue text-white px-6 py-3 rounded-full font-fredoka font-semibold hover:bg-primary-blue/90 transition-colors"
              >
                🐕 Shop Dogs
              </a>
              <a
                href="/cats"
                className="bg-vibrant-orange text-white px-6 py-3 rounded-full font-fredoka font-semibold hover:bg-vibrant-orange/90 transition-colors"
              >
                🐱 Shop Cats
              </a>
              <a
                href="/deals"
                className="bg-sunny-yellow text-white px-6 py-3 rounded-full font-fredoka font-semibold hover:bg-sunny-yellow/90 transition-colors"
              >
                🏷️ View Deals
              </a>
            </div>
          </div>
        )}

        {/* No Query State */}
        {!loading && !error && !query.trim() && (
          <div className="text-center py-16">
            <div className="mb-6">
              <Search className="h-24 w-24 text-light-gray mx-auto mb-4" />
            </div>
            <h2 className="text-2xl font-fredoka font-bold text-charcoal mb-4">
              Start searching for products
            </h2>
            <p className="text-lg text-medium-gray">
              Use the search bar above to find treats, toys, food and more!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
