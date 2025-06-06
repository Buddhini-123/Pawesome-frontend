# Pawsome Dataset System

A comprehensive, SEO-optimized product dataset system for the Pawsome pet supplies e-commerce platform. This system transforms Excel product data into a structured, searchable, and highly optimized dataset with full TypeScript support.

## 🌟 Features

### Core Functionality
- **📊 Complete Data Transformation**: Converts Excel data into structured Product objects
- **🔍 Advanced Search**: Full-text search with relevance scoring and filtering
- **🏷️ Auto-Generated Tags**: Intelligent tagging based on product attributes
- **🔗 Related Products**: Automatic cross-sell, upsell, and related product mapping
- **📈 SEO Optimization**: Rich meta tags, structured data, and keyword generation
- **⚡ Performance Optimized**: Singleton pattern with efficient data access
- **🎯 TypeScript Support**: Full type safety throughout the system

### SEO Features
- **Meta Titles & Descriptions**: Auto-generated, optimized for search engines
- **Structured Data**: JSON-LD schema markup for rich snippets
- **Keywords**: Intelligent keyword extraction and generation
- **Canonical URLs**: SEO-friendly URL structure
- **Twitter Cards**: Social media optimization

### Product Relationships
- **Related Products**: Based on category, brand, and price similarity
- **Cross-sell**: Complementary products for the same pet type
- **Upsell**: Higher-priced alternatives in the same category
- **Bundles**: Product bundle suggestions

## 📁 Project Structure

```
src/
├── types/
│   └── products.ts              # TypeScript interfaces and types
├── utils/
│   └── productUtils.ts          # Utility functions for data processing
├── services/
│   └── productDataService.ts    # Data transformation logic
├── data/
│   ├── pawsomeDataset.ts        # Main dataset class (singleton)
│   └── datasetInitializer.ts    # Data initialization from Excel
├── hooks/
│   ├── useProducts.ts           # React hooks for data access
│   └── index.ts                 # Hook exports
└── components/
    └── examples/
        └── ExampleDatasetUsage.tsx  # Example implementation
```

## 🚀 Quick Start

### 1. Initialize the Dataset

```typescript
import { DatasetInitializer } from './data/datasetInitializer';

// Auto-initialization (recommended)
await DatasetInitializer.initializeFromExcel();

// Or use the auto-init function
import { autoInitDataset } from './data/datasetInitializer';
await autoInitDataset(true);
```

### 2. Use React Hooks

```tsx
import { useFeaturedProducts, useProducts, useProductSearch } from './hooks';

function ProductPage() {
  // Get featured products
  const { products, loading } = useFeaturedProducts('featured', 12);
  
  // Get filtered products
  const { products: dogProducts } = useProducts({
    petType: 'dog',
    categoryId: 15,
    limit: 20
  });
  
  // Search products
  const { results } = useProductSearch('dog food', {
    categories: [10, 11],
    limit: 10
  });
  
  return (
    <div>
      {/* Render products */}
    </div>
  );
}
```

### 3. Direct Dataset Access

```typescript
import pawsomeDataset from './data/pawsomeDataset';

// Get all products
const products = pawsomeDataset.getProducts();

// Get product by ID
const product = pawsomeDataset.getProductById('product-1');

// Get filtered products
const { products: filtered, total } = pawsomeDataset.getFilteredProducts({
  brandId: 1,
  priceRange: { min: 100, max: 1000 },
  inStock: true
});

// Search products
const searchResults = pawsomeDataset.searchProducts('natural dog food');
```

## 🏗️ Data Structure

### Product Interface

```typescript
interface Product {
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
  relatedProducts?: string[];
  crossSellProducts?: string[];
  upsellProducts?: string[];
  // ... more fields
}
```

### SEO Data Structure

```typescript
interface ProductSEO {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  structuredData: ProductStructuredData;
  canonicalUrl: string;
  ogImage?: string;
  twitterCard?: TwitterCardData;
}
```

## 🔧 Available Hooks

### Core Hooks
- `useDataset()` - Access dataset and initialization status
- `useProducts(filters)` - Get filtered products with pagination
- `useProduct(id, bySlug)` - Get single product by ID or slug
- `useProductSearch(query, options)` - Search products with debouncing

### Product Type Hooks
- `useFeaturedProducts(type, limit)` - Featured, new, sale, popular, trending
- `useCategoryProducts(categoryId, limit)` - Products by category
- `useBrandProducts(brandId, limit)` - Products by brand
- `usePetTypeProducts(petType, limit)` - Products by pet type

### Relationship Hooks
- `useRelatedProducts(productId, limit)` - Related products
- `useCrossSellProducts(productId, limit)` - Cross-sell recommendations
- `useUpsellProducts(productId, limit)` - Upsell recommendations

### Utility Hooks
- `useCategories(petType?)` - Get all categories or by pet type
- `useBrands()` - Get all brands
- `useDatasetStats()` - Dataset statistics
- `useInventoryProducts(type)` - Low stock or out of stock products

## 📊 Dataset Statistics

```typescript
const stats = pawsomeDataset.getStatistics();
// Returns:
// {
//   totalProducts: number;
//   activeProducts: number;
//   featuredProducts: number;
//   onSaleProducts: number;
//   averagePrice: number;
//   categoriesCount: number;
//   brandsCount: number;
//   priceRange: { min: number; max: number };
//   stockStatus: Record<string, number>;
// }
```

## 🔍 Search Capabilities

### Basic Search
```typescript
const results = pawsomeDataset.searchProducts('dog food');
```

### Advanced Search
```typescript
const results = pawsomeDataset.searchProducts('natural', {
  categories: [10, 11, 15],
  brands: [1, 3, 5],
  limit: 20,
  fuzzy: true
});
```

### Filtered Search
```typescript
const { products, total } = pawsomeDataset.getFilteredProducts({
  searchQuery: 'premium',
  petType: 'dog',
  priceRange: { min: 500, max: 2000 },
  inStock: true,
  featured: true,
  sortBy: 'price',
  sortOrder: 'asc',
  limit: 20,
  offset: 0
});
```

## 🏷️ Tag System

The system automatically generates intelligent tags based on:

- **Product Attributes**: new, featured, sale, premium, budget-friendly
- **Stock Status**: limited-stock, out-of-stock
- **Pet Type**: dog, cat, bird, fish, etc.
- **Brand**: Brand slug as tag
- **Rating**: highly-rated, popular
- **Shipping**: same-day-delivery, fast-shipping
- **Category**: Specific category-based tags

## 🎯 SEO Optimization

### Meta Title Generation
```typescript
// Example output:
"HerbPaw Waterless Bath Spray by HerbPaw - Dog Care | Pawsome Sri Lanka"
```

### Meta Description Generation
```typescript
// Example output:
"Shop HerbPaw Waterless Bath Spray from HerbPaw starting at LKR 1,250 at Pawsome Sri Lanka. Natural pet care products with lemon extract. Free shipping available. Order now!"
```

### Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "HerbPaw Waterless Bath Spray",
  "image": ["https://pawsome.lk/images/products/herbpaw-spray-1.jpg"],
  "description": "Natural waterless bath spray with lemon extract...",
  "brand": {
    "@type": "Brand",
    "name": "HerbPaw"
  },
  "offers": {
    "@type": "Offer",
    "price": 1250,
    "priceCurrency": "LKR",
    "availability": "https://schema.org/InStock"
  }
}
```

## 🔗 Related Products Algorithm

The system uses a sophisticated scoring algorithm to determine product relationships:

1. **Same Category** (40 points) - Highest priority
2. **Same Brand** (30 points) - Brand affinity
3. **Similar Price** (20 points) - Within 50% price range
4. **Same Pet Type** (15 points) - Pet compatibility
5. **Common Tags** (2 points each) - Attribute similarity

## 📱 Usage Examples

### E-commerce Product Grid
```tsx
function ProductGrid() {
  const { products, loading, total } = useProducts({
    limit: 20,
    sortBy: 'popularity',
    inStock: true
  });

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="grid grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Category Page
```tsx
function CategoryPage({ categorySlug }: { categorySlug: string }) {
  const category = pawsomeDataset.getCategoryBySlug(categorySlug);
  const { products } = useCategoryProducts(category?.id, 50);

  return (
    <div>
      <h1>{category?.name}</h1>
      <ProductGrid products={products} />
    </div>
  );
}
```

### Product Detail Page
```tsx
function ProductDetail({ productSlug }: { productSlug: string }) {
  const { product, loading, error } = useProduct(productSlug, true);
  const relatedProducts = useRelatedProducts(product?.id || '', 8);
  const crossSellProducts = useCrossSellProducts(product?.id || '', 4);

  if (loading) return <div>Loading...</div>;
  if (error || !product) return <div>Product not found</div>;

  return (
    <div>
      <ProductDetails product={product} />
      <RelatedProducts products={relatedProducts} />
      <CrossSellSection products={crossSellProducts} />
    </div>
  );
}
```

## 🔧 Configuration

### Categories Mapping
Update `DEFAULT_CATEGORIES` in `productDataService.ts` to match your category structure:

```typescript
const DEFAULT_CATEGORIES: Record<number, ProductCategory> = {
  10: { id: 10, name: 'Dog Food', slug: 'dog-food', petType: 'dog' },
  // ... add your categories
};
```

### Brands Mapping
Update `DEFAULT_BRANDS` in `productDataService.ts`:

```typescript
const DEFAULT_BRANDS: Record<number, ProductBrand> = {
  1: { id: 1, name: 'HerbPaw', slug: 'herbpaw', description: 'Natural pet care' },
  // ... add your brands
};
```

## 🚀 Performance Considerations

- **Singleton Pattern**: Only one dataset instance throughout the app
- **Lazy Loading**: Dataset loads only when needed
- **Efficient Filtering**: Optimized filtering algorithms
- **Debounced Search**: Prevents excessive search API calls
- **Memoized Results**: React hooks use proper dependencies

## 📦 Dependencies

The dataset system requires:
- React 18+
- TypeScript 4.5+
- Tailwind CSS (for example components)
- XLSX library (for Excel processing)

## 🤝 Contributing

When adding new features:

1. Update TypeScript interfaces in `types/products.ts`
2. Add utility functions to `utils/productUtils.ts`
3. Create React hooks in `hooks/useProducts.ts`
4. Update transformation logic in `services/productDataService.ts`
5. Add examples to `components/examples/`

## 📄 License

This dataset system is part of the Pawsome project and follows the project's licensing terms.
