import React, { useState, useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';
import { Product } from '../../types';

interface StandardCategoryPageProps {
  title: string;
  description: string;
  products: Product[];
  filters: any[];
  headerIcon?: React.ReactNode;
  emptyStateIcon?: string;
}

const StandardCategoryPage: React.FC<StandardCategoryPageProps> = ({
  title,
  description,
  products,
  filters,
  headerIcon,
  emptyStateIcon = '📦'
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    let filteredProducts = [...products];

    // Apply filters
    Object.entries(selectedFilters).forEach(([filterType, values]) => {
  if (values.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      switch (filterType) {
        case 'Category':
          // Match category_id with selected category values
          return values.includes(product.category_id.toString());

        case 'Brand':
          // Match brand_id with selected brand values
          return values.includes(product.brand_id.toString());

        case 'Price Range':
          return values.some(range => {
            const [min, max] = range.split('-').map(v => v.replace(/[^\d]/g, ''));
            if (max === '+') {
              return parseFloat(product.price) >= parseInt(min);
            }
            return (
              parseFloat(product.price) >= parseInt(min) &&
              parseFloat(product.price) <= parseInt(max)
            );
          });

        case 'Rating':
          return parseFloat(product.rating_avg) >= parseInt(values[0]);

        case 'Subcategory':
        case 'Condition Type':
        case 'Pet Type':
          // Adjust these if you have related fields later
          return true;

        default:
          return true;
      }
    });
  }
});


    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // In real app, would sort by date
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filteredProducts;
  }, [products, selectedFilters, sortBy]);

  return (
    <div className="min-h-screen bg-soft-gray">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-fredoka font-bold text-charcoal mb-4">{title}</h1>
          <p className="text-lg text-medium-gray">{description}</p>
        </div>

        {/* Custom Header Content (if provided) */}
        {headerIcon && <div className="mb-8">{headerIcon}</div>}

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 text-charcoal hover:text-vibrant-orange"
            >
              <Filter className="h-5 w-5" />
              <span className="font-fredoka font-medium">Filters</span>
            </button>
            <p className="text-medium-gray">
              Showing {filteredProducts.length} products
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-fredoka text-medium-gray">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
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
                <div className="text-6xl mb-4">{emptyStateIcon}</div>
                <p className="text-xl font-fredoka text-medium-gray">No products found matching your filters</p>
                <button
                  onClick={() => setSelectedFilters({})}
                  className="mt-4 text-vibrant-orange font-fredoka hover:text-orange-600"
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
              <h2 className="text-xl font-fredoka font-semibold">Filters</h2>
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

export default StandardCategoryPage;