import * as XLSX from 'xlsx';
import { Product } from '../types/products';
import categories from './categories';
import brands from './brands';

// Helper functions
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
};

const extractKeywords = (text: string): string[] => {
  if (!text) return [];
  const cleanText = stripHtmlTags(text).toLowerCase();
  const words = cleanText.split(/\s+/);
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  return words
    .filter(word => word.length > 2 && !stopWords.includes(word))
    .slice(0, 8);
};

// Interface for raw Excel data
interface RawProductData {
  name: string;
  description?: string;
  added_by?: string;
  user_id: number;
  category_id: number;
  brand_id: number;
  video_provider?: string;
  unit_price: number;
  unit?: string;
  current_stock: number;
  est_shipping_days?: number;
  meta_title?: string;
  meta_description?: string;
}

export const transformExcelToProducts = async (filePath: string): Promise<Product[]> => {
  try {
    // Read Excel file
    const response = await window.fs.readFile(filePath);
    const workbook = XLSX.read(response, {
      cellStyles: true,
      cellFormulas: true,
      cellDates: true,
      cellNF: true,
      sheetStubs: true
    });

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData: RawProductData[] = XLSX.utils.sheet_to_json(worksheet);

    // Transform raw data to products
    const products: Product[] = rawData.map((raw, index) => {
      const id = `prod_${generateSlug(raw.name)}_${String(index + 1).padStart(3, '0')}`;
      const slug = generateSlug(raw.name);
      const description = stripHtmlTags(raw.description || '');
      const keywords = extractKeywords(`${raw.name} ${description}`);
      
      // Find category and brand
      const category = categories.find(c => c.id === raw.category_id) || categories[0];
      const brand = brands.find(b => b.id === raw.brand_id) || brands[0];
      
      // Determine stock status
      let stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock' = 'in-stock';
      if (raw.current_stock === 0) stockStatus = 'out-of-stock';
      else if (raw.current_stock <= 10) stockStatus = 'low-stock';
      
      // Generate tags
      const tags = [
        category.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'),
        brand.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'),
        category.petType,
        'pet-care',
        raw.unit_price > 1500 ? 'premium' : 'affordable',
        ...keywords.slice(0, 3)
      ].filter((tag, index, self) => self.indexOf(tag) === index);

      return {
        id,
        name: raw.name,
        slug,
        description: raw.description || '',
        shortDescription: description.substring(0, 160) + (description.length > 160 ? '...' : ''),
        images: [
          {
            id: `img_${id}_1`,
            url: `/images/products/${slug}/main.jpg`,
            alt: `${raw.name} - Main Product Image`,
            caption: raw.name,
            isPrimary: true,
            sortOrder: 1,
            type: 'product' as const
          },
          {
            id: `img_${id}_2`,
            url: `/images/products/${slug}/gallery-1.jpg`,
            alt: `${raw.name} - Gallery Image 1`,
            isPrimary: false,
            sortOrder: 2,
            type: 'gallery' as const
          },
          {
            id: `img_${id}_3`,
            url: `/images/products/${slug}/lifestyle.jpg`,
            alt: `${raw.name} - Lifestyle Image`,
            isPrimary: false,
            sortOrder: 3,
            type: 'lifestyle' as const
          }
        ],
        price: {
          unitPrice: raw.unit_price || 0,
          currency: 'LKR',
          unit: raw.unit || 'pc',
          salePrice: Math.random() > 0.75 ? Math.floor((raw.unit_price || 0) * 0.85) : undefined,
          discountPercentage: Math.random() > 0.75 ? Math.floor(Math.random() * 20) + 5 : undefined
        },
        inventory: {
          currentStock: raw.current_stock || 0,
          lowStockThreshold: 10,
          stockStatus,
          sku: `SKU_${id.toUpperCase()}`,
          barcode: `${Math.floor(Math.random() * 9000000000000) + 1000000000000}`,
          weight: Math.floor(Math.random() * 1000) + 50,
          dimensions: {
            length: Math.floor(Math.random() * 25) + 5,
            width: Math.floor(Math.random() * 20) + 5,
            height: Math.floor(Math.random() * 15) + 2,
            unit: 'cm' as const
          }
        },
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          icon: category.icon,
          petType: category.petType as any
        },
        brand: {
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          description: brand.description,
          countryOfOrigin: brand.countryOfOrigin,
          logo: brand.logo
        },
        specifications: [
          { name: "Unit", value: raw.unit || 'pc', group: "Product Info" },
          { name: "Shipping Time", value: `${raw.est_shipping_days || 3} days`, group: "Delivery" },
          { name: "Brand Origin", value: brand.countryOfOrigin, group: "Brand" },
          { name: "Stock Status", value: stockStatus.replace('-', ' '), group: "Availability" }
        ],
        tags,
        seo: {
          metaTitle: raw.meta_title || `${raw.name} - Premium ${category.name} | Pawsome`,
          metaDescription: raw.meta_description || `Shop ${raw.name} at Pawsome. ${description.substring(0, 120)}`,
          metaKeywords: [
            raw.name.toLowerCase(),
            brand.name.toLowerCase(),
            category.name.toLowerCase(),
            ...keywords,
            'pet care',
            'sri lanka',
            category.petType
          ].filter((keyword, index, self) => self.indexOf(keyword) === index),
          structuredData: {
            "@context": "https://schema.org/",
            "@type": "Product",
            name: raw.name,
            image: [
              `/images/products/${slug}/main.jpg`,
              `/images/products/${slug}/gallery-1.jpg`
            ],
            description,
            brand: {
              "@type": "Brand",
              name: brand.name
            },
            offers: {
              "@type": "Offer",
              price: raw.unit_price || 0,
              priceCurrency: "LKR",
              availability: stockStatus === 'in-stock' ? "https://schema.org/InStock" : 
                           stockStatus === 'low-stock' ? "https://schema.org/LimitedAvailability" : 
                           "https://schema.org/OutOfStock",
              seller: {
                "@type": "Organization",
                name: "Pawsome Pet Store"
              }
            }
          }
        },
        shipping: {
          estimatedDays: raw.est_shipping_days || 3,
          freeShippingThreshold: 5000,
          shippingClass: raw.unit_price > 2000 ? 'premium' : 'standard',
          restrictions: [],
          weight: Math.floor(Math.random() * 1000) + 50,
          dimensions: {
            length: Math.floor(Math.random() * 25) + 5,
            width: Math.floor(Math.random() * 20) + 5,
            height: Math.floor(Math.random() * 15) + 2,
            unit: 'cm' as const
          }
        },
        ratings: {
          averageRating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
          totalReviews: Math.floor(Math.random() * 100) + 1,
          ratingDistribution: (() => {
            const total = Math.floor(Math.random() * 100) + 1;
            const fiveStars = Math.floor(total * 0.4);
            const fourStars = Math.floor(total * 0.3);
            const threeStars = Math.floor(total * 0.2);
            const twoStars = Math.floor(total * 0.07);
            const oneStars = total - fiveStars - fourStars - threeStars - twoStars;
            return { 5: fiveStars, 4: fourStars, 3: threeStars, 2: twoStars, 1: oneStars };
          })(),
          verified: Math.random() > 0.3
        },
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
        updatedAt: new Date(),
        isActive: true,
        isFeatured: Math.random() > 0.85,
        isNew: Math.random() > 0.9,
        isOnSale: Math.random() > 0.8,
        relatedProducts: [],
        crossSellProducts: [],
        upsellProducts: []
      };
    });

    // Generate related products mapping
    const productsWithRelations = products.map(product => {
      // Find products in same category
      const sameCategoryProducts = products.filter(p => 
        p.id !== product.id && p.category.id === product.category.id
      ).slice(0, 4);
      
      // Find products from same brand
      const sameBrandProducts = products.filter(p => 
        p.id !== product.id && p.brand.id === product.brand.id
      ).slice(0, 3);
      
      // Find products in similar price range
      const similarPriceProducts = products.filter(p => {
        if (p.id === product.id) return false;
        const priceDiff = Math.abs(p.price.unitPrice - product.price.unitPrice);
        return priceDiff <= product.price.unitPrice * 0.3;
      }).slice(0, 3);

      return {
        ...product,
        relatedProducts: [
          ...sameCategoryProducts.map(p => p.id),
          ...sameBrandProducts.map(p => p.id)
        ].filter((id, index, self) => self.indexOf(id) === index).slice(0, 8),
        crossSellProducts: sameCategoryProducts.slice(0, 4).map(p => p.id),
        upsellProducts: products.filter(p => 
          p.id !== product.id && 
          p.category.id === product.category.id && 
          p.price.unitPrice > product.price.unitPrice
        ).slice(0, 3).map(p => p.id)
      };
    });

    return productsWithRelations;

  } catch (error) {
    console.error('Error transforming Excel to products:', error);
    throw error;
  }
};

export default transformExcelToProducts;