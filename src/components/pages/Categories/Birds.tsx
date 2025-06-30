import React, { useState, useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import ProductCard from '../../common/ProductCard';
import FilterSidebar from '../../common/FilterSidebar';
import { birdProducts, getBirdFilters } from '../../../data/mockProducts';

const Birds: React.FC = () => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState('featured');

  const filters = getBirdFilters();

  const filteredProducts = useMemo(() => {
    let products = [...birdProducts];

    // Apply filters
    Object.entries(selectedFilters).forEach(([filterType, values]) => {
      if (values.length > 0) {
        products = products.filter(product => {
          switch (filterType) {
            case 'Category':
              return values.includes(product.subcategory);
            case 'Brand':
              return values.includes(product.brand);
            case 'Price Range':
              return values.some(range => {
                const [min, max] = range.split('-').map(v => v.replace(/[^\d]/g, ''));
                if (max === '+') {
                  return product.price >= parseInt(min);
                }
                return product.price >= parseInt(min) && product.price <= parseInt(max);
              });
            case 'Rating':
              return product.rating >= parseInt(values[0]);
            default:
              return true;
          }
        });
      }
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // In real app, would sort by date
        break;
      default:
        // Featured - keep original order
        break;
    }

    return products;
  }, [selectedFilters, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal-gray mb-4">Bird Products</h1>
          <p className="text-lg text-gray-600">
            Special care products for your feathered companions
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 text-charcoal-gray hover:text-energetic-orange"
            >
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filters</span>
            </button>
            <p className="text-gray-600">
              Showing {filteredProducts.length} products
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-energetic-orange"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={setSelectedFilters}
            />
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🦜</div>
                <p className="text-xl text-gray-600">No products found matching your filters</p>
                <button
                  onClick={() => setSelectedFilters({})}
                  className="mt-4 text-energetic-orange hover:text-orange-600"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)]">
              <FilterSidebar
                filters={filters}
                onFilterChange={setSelectedFilters}
                isMobile
                onClose={() => setShowMobileFilters(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Birds;