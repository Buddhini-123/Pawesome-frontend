import React from 'react';
import { useFeaturedProducts, useCategories, useBrands, useDatasetStats } from '../../hooks';
import { formatPrice } from '../../utils/productUtils';

/**
 * Example component demonstrating how to use the Pawsome dataset
 * This shows various ways to fetch and display product data
 */
const ExampleDatasetUsage: React.FC = () => {
  // Hook examples
  const { products: featuredProducts, loading: featuredLoading } = useFeaturedProducts('featured', 8);
  const { products: newProducts } = useFeaturedProducts('new', 6);
  const { products: saleProducts } = useFeaturedProducts('sale', 4);
  const { categories, loading: categoriesLoading } = useCategories();
  const { brands, loading: brandsLoading } = useBrands();
  const { stats, loading: statsLoading } = useDatasetStats();

  if (featuredLoading || categoriesLoading || brandsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-energetic-orange mx-auto mb-4"></div>
          <p className="text-charcoal-gray">Loading Pawsome dataset...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Dataset Statistics */}
      <section className="bg-cream-white rounded-lg p-6">
        <h2 className="text-2xl font-bold text-charcoal-gray mb-4">Dataset Overview</h2>
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-energetic-orange">{stats.totalProducts}</div>
              <div className="text-sm text-charcoal-gray">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-natural-sage">{stats.categoriesCount}</div>
              <div className="text-sm text-charcoal-gray">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-calm-blue">{stats.brandsCount}</div>
              <div className="text-sm text-charcoal-gray">Brands</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warm-orange">{formatPrice(stats.averagePrice)}</div>
              <div className="text-sm text-charcoal-gray">Avg Price</div>
            </div>
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-2xl font-bold text-charcoal-gray mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-off-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-light-gray flex items-center justify-center">
                <img 
                  src={product.images[0]?.url} 
                  alt={product.images[0]?.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-charcoal-gray mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-warm-taupe mb-2">{product.brand.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-energetic-orange">
                    {formatPrice(product.price.unitPrice)}
                  </span>
                  {product.isOnSale && product.price.salePrice && (
                    <span className="text-sm text-crimson line-through">
                      {formatPrice(product.price.salePrice)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-charcoal-gray">{product.ratings.averageRating}</span>
                    <span className="text-xs text-warm-taupe">({product.ratings.totalReviews})</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    product.inventory.stockStatus === 'in-stock' 
                      ? 'bg-mint text-white' 
                      : product.inventory.stockStatus === 'low-stock'
                      ? 'bg-warm-orange text-white'
                      : 'bg-crimson text-white'
                  }`}>
                    {product.inventory.stockStatus.replace('-', ' ')}
                  </span>
                </div>
                {product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-periwinkle text-charcoal-gray px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Overview */}
      <section>
        <h2 className="text-2xl font-bold text-charcoal-gray mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 12).map((category) => (
            <div key={category.id} className="bg-off-white rounded-lg p-4 text-center hover:bg-periwinkle transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-natural-sage rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {category.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-sm font-medium text-charcoal-gray">{category.name}</h3>
              {category.petType && (
                <p className="text-xs text-warm-taupe capitalize">{category.petType}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SEO Information Example */}
      <section className="bg-light-gray rounded-lg p-6">
        <h2 className="text-xl font-bold text-charcoal-gray mb-4">SEO Data Example</h2>
        {featuredProducts[0] && (
          <div className="space-y-2 text-sm">
            <div>
              <strong>Meta Title:</strong> {featuredProducts[0].seo.metaTitle}
            </div>
            <div>
              <strong>Meta Description:</strong> {featuredProducts[0].seo.metaDescription}
            </div>
            <div>
              <strong>Keywords:</strong> {featuredProducts[0].seo.metaKeywords.join(', ')}
            </div>
            <div>
              <strong>Canonical URL:</strong> {featuredProducts[0].seo.canonicalUrl}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ExampleDatasetUsage;
