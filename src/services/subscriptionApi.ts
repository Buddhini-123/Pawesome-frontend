// Mock API service for subscription products
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  category: string;
  subcategory: string;
  description: string;
  features: string[];
  specifications: {
    weight: string;
    ingredients: string;
    ageGroup: string;
    petSize: string;
    flavor: string;
  };
  availability: 'in-stock' | 'out-of-stock' | 'limited';
  tags: string[];
  subscriptionOptions: {
    frequencies: string[];
    discounts: { [key: string]: number };
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  frequency: string;
  products: Product[];
  benefits: string[];
  image: string;
  popular?: boolean;
}

// Mock subscription products data
export const mockSubscriptionProducts: Product[] = [
  {
    id: "sub-001",
    name: "Royal Canin Adult Dog Food",
    brand: "Royal Canin",
    price: 2499,
    originalPrice: 2999,
    discount: 17,
    rating: 4.8,
    reviewCount: 1245,
    image: "https://images.unsplash.com/photo-1589985701653-d9643bc790de?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1589985701653-d9643bc790de?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1564486123817-39cef6e9e3a1?w=400&h=400&fit=crop"
    ],
    category: "Dog Food",
    subcategory: "Dry Food",
    description: "Premium nutrition for adult dogs aged 1-7 years. Specially formulated with high-quality proteins and essential nutrients to support your dog's health and vitality.",
    features: [
      "High-quality protein for muscle maintenance",
      "Optimal kibble size and texture",
      "Supports digestive health",
      "Enhanced with antioxidants",
      "Balanced nutrition for active dogs"
    ],
    specifications: {
      weight: "3kg",
      ingredients: "Chicken, Rice, Corn, Chicken Fat, Beet Pulp",
      ageGroup: "Adult (1-7 years)",
      petSize: "Medium to Large",
      flavor: "Chicken"
    },
    availability: "in-stock",
    tags: ["Premium", "Adult", "Digestive Health", "High Protein"],
    subscriptionOptions: {
      frequencies: ["Weekly", "Bi-weekly", "Monthly"],
      discounts: { "Weekly": 5, "Bi-weekly": 10, "Monthly": 15 }
    }
  },
  {
    id: "sub-002",
    name: "Whiskas Cat Food Ocean Fish",
    brand: "Whiskas",
    price: 899,
    originalPrice: 1099,
    discount: 18,
    rating: 4.6,
    reviewCount: 892,
    image: "https://images.unsplash.com/photo-1560743173-567a3b5658b1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560743173-567a3b5658b1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=400&h=400&fit=crop"
    ],
    category: "Cat Food",
    subcategory: "Wet Food",
    description: "Delicious ocean fish recipe packed with essential nutrients for adult cats. Made with real fish and enriched with vitamins and minerals.",
    features: [
      "Real ocean fish as main ingredient",
      "Rich in Omega-3 fatty acids",
      "Supports healthy coat and skin",
      "Complete and balanced nutrition",
      "Irresistible taste cats love"
    ],
    specifications: {
      weight: "400g x 12 pack",
      ingredients: "Ocean Fish, Chicken, Rice, Fish Oil, Vitamins",
      ageGroup: "Adult (1+ years)",
      petSize: "All sizes",
      flavor: "Ocean Fish"
    },
    availability: "in-stock",
    tags: ["Wet Food", "Ocean Fish", "Omega-3", "Adult Cat"],
    subscriptionOptions: {
      frequencies: ["Weekly", "Bi-weekly", "Monthly"],
      discounts: { "Weekly": 8, "Bi-weekly": 12, "Monthly": 20 }
    }
  },
  {
    id: "sub-003",
    name: "Pedigree Puppy Growth Food",
    brand: "Pedigree",
    price: 1899,
    originalPrice: 2199,
    discount: 14,
    rating: 4.7,
    reviewCount: 1567,
    image: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1585581190777-41d75e2ba755?w=400&h=400&fit=crop"
    ],
    category: "Dog Food",
    subcategory: "Puppy Food",
    description: "Specially formulated for growing puppies aged 2-12 months. Provides essential nutrients for healthy growth and development.",
    features: [
      "DHA for brain development",
      "High-quality protein for muscle growth",
      "Calcium for strong bones and teeth",
      "Easy to digest formula",
      "Supports immune system"
    ],
    specifications: {
      weight: "3kg",
      ingredients: "Chicken, Rice, Corn, Chicken Fat, Fish Oil",
      ageGroup: "Puppy (2-12 months)",
      petSize: "All sizes",
      flavor: "Chicken & Rice"
    },
    availability: "in-stock",
    tags: ["Puppy", "Growth Formula", "DHA", "Immune Support"],
    subscriptionOptions: {
      frequencies: ["Weekly", "Bi-weekly", "Monthly"],
      discounts: { "Weekly": 6, "Bi-weekly": 10, "Monthly": 16 }
    }
  },
  {
    id: "sub-004",
    name: "Hills Science Diet Adult",
    brand: "Hills",
    price: 3499,
    originalPrice: 3999,
    discount: 13,
    rating: 4.9,
    reviewCount: 756,
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1556909114-8e3e17e6b19d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop"
    ],
    category: "Dog Food",
    subcategory: "Scientific Diet",
    description: "Veterinarian-recommended nutrition with clinically proven antioxidants to support your dog's immune system and overall health.",
    features: [
      "Clinically proven antioxidants",
      "High-quality protein",
      "Supports healthy digestion",
      "Balanced minerals for urinary health",
      "Veterinarian recommended"
    ],
    specifications: {
      weight: "5kg",
      ingredients: "Chicken, Brown Rice, Oats, Chicken Fat, Flaxseed",
      ageGroup: "Adult (1-6 years)",
      petSize: "All sizes",
      flavor: "Chicken & Brown Rice"
    },
    availability: "in-stock",
    tags: ["Scientific Diet", "Veterinarian Recommended", "Antioxidants", "Premium"],
    subscriptionOptions: {
      frequencies: ["Bi-weekly", "Monthly", "Bi-monthly"],
      discounts: { "Bi-weekly": 8, "Monthly": 15, "Bi-monthly": 25 }
    }
  },
  {
    id: "sub-005",
    name: "Royal Canin Kitten Food",
    brand: "Royal Canin",
    price: 1999,
    originalPrice: 2299,
    discount: 13,
    rating: 4.8,
    reviewCount: 634,
    image: "https://images.unsplash.com/photo-1615647285132-0855e8a0de31?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1615647285132-0855e8a0de31?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=400&h=400&fit=crop"
    ],
    category: "Cat Food",
    subcategory: "Kitten Food",
    description: "Tailored nutrition for kittens up to 12 months old. Supports healthy growth and development with essential nutrients.",
    features: [
      "Supports healthy growth",
      "Easy to chew kibble size",
      "Immune system support",
      "Digestive health formula",
      "High energy content"
    ],
    specifications: {
      weight: "2kg",
      ingredients: "Chicken, Rice, Chicken Fat, Fish Oil, Vitamins",
      ageGroup: "Kitten (up to 12 months)",
      petSize: "All sizes",
      flavor: "Chicken"
    },
    availability: "in-stock",
    tags: ["Kitten", "Growth Support", "Easy Digest", "High Energy"],
    subscriptionOptions: {
      frequencies: ["Weekly", "Bi-weekly", "Monthly"],
      discounts: { "Weekly": 7, "Bi-weekly": 12, "Monthly": 18 }
    }
  },
  {
    id: "sub-006",
    name: "Orijen Regional Red Dog Food",
    brand: "Orijen",
    price: 4999,
    originalPrice: 5699,
    discount: 12,
    rating: 4.9,
    reviewCount: 423,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=400&fit=crop"
    ],
    category: "Dog Food",
    subcategory: "Premium Grain-Free",
    description: "Biologically appropriate dog food featuring ranch-raised beef, wild boar, bison, and lamb in ratios that mirror your dog's natural diet.",
    features: [
      "85% quality animal ingredients",
      "Grain-free formula",
      "Freeze-dried liver coating",
      "No artificial preservatives",
      "Biologically appropriate"
    ],
    specifications: {
      weight: "2kg",
      ingredients: "Beef, Wild Boar, Bison, Lamb, Fish, Vegetables",
      ageGroup: "All life stages",
      petSize: "All sizes",
      flavor: "Regional Red"
    },
    availability: "limited",
    tags: ["Premium", "Grain-Free", "Biologically Appropriate", "Multi-Protein"],
    subscriptionOptions: {
      frequencies: ["Monthly", "Bi-monthly"],
      discounts: { "Monthly": 10, "Bi-monthly": 20 }
    }
  }
];

// Mock subscription plans
export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "plan-001",
    name: "Essential Care Plan",
    description: "Perfect for pet parents who want consistent nutrition without the hassle",
    price: 2499,
    originalPrice: 2999,
    discount: 17,
    frequency: "Monthly",
    products: [mockSubscriptionProducts[0], mockSubscriptionProducts[2]],
    benefits: [
      "Free delivery every month",
      "15% discount on all products",
      "Flexible scheduling",
      "Cancel anytime",
      "Priority customer support"
    ],
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop"
  },
  {
    id: "plan-002", 
    name: "Premium Nutrition Plan",
    description: "For pets who deserve the very best nutrition and care",
    price: 4299,
    originalPrice: 5399,
    discount: 20,
    frequency: "Monthly",
    products: [mockSubscriptionProducts[3], mockSubscriptionProducts[5]],
    benefits: [
      "20% discount on premium brands",
      "Free bi-weekly delivery",
      "Nutritionist consultation",
      "Health monitoring tools",
      "VIP customer support",
      "Free treat samples"
    ],
    image: "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?w=400&h=400&fit=crop",
    popular: true
  },
  {
    id: "plan-003",
    name: "Multi-Pet Family Plan", 
    description: "Ideal for families with multiple furry friends",
    price: 3899,
    originalPrice: 4699,
    discount: 17,
    frequency: "Monthly",
    products: [mockSubscriptionProducts[0], mockSubscriptionProducts[1], mockSubscriptionProducts[4]],
    benefits: [
      "Multi-pet discounts",
      "Customized delivery schedule",
      "Mix and match products",
      "Family nutrition planning",
      "Bulk order savings",
      "24/7 support"
    ],
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop"
  }
];
// API simulation functions
export const subscriptionApi = {
  // Get all subscription products
  getSubscriptionProducts: async (): Promise<Product[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockSubscriptionProducts;
  },

  // Get subscription plans
  getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSubscriptionPlans;
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockSubscriptionProducts.find(product => product.id === id) || null;
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockSubscriptionProducts.filter(product => 
      product.category.toLowerCase().includes(category.toLowerCase())
    );
  },

  // Get featured products
  getFeaturedProducts: async (): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSubscriptionProducts.filter(product => product.rating >= 4.7);
  },

  // Search products
  searchProducts: async (query: string): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const searchTerm = query.toLowerCase();
    return mockSubscriptionProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
};

// Product utilities
export const productUtils = {
  // Calculate discounted price
  getDiscountedPrice: (product: Product): number => {
    if (product.discount && product.originalPrice) {
      return Math.round(product.originalPrice * (1 - product.discount / 100));
    }
    return product.price;
  },

  // Get discount percentage
  getDiscountPercentage: (product: Product): number => {
    if (product.originalPrice && product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return product.discount || 0;
  },

  // Check if product is on sale
  isOnSale: (product: Product): boolean => {
    return !!(product.discount && product.originalPrice && product.originalPrice > product.price);
  },

  // Get subscription discount for frequency
  getSubscriptionDiscount: (product: Product, frequency: string): number => {
    return product.subscriptionOptions.discounts[frequency] || 0;
  },

  // Calculate subscription price
  getSubscriptionPrice: (product: Product, frequency: string): number => {
    const discount = productUtils.getSubscriptionDiscount(product, frequency);
    return Math.round(product.price * (1 - discount / 100));
  }
};

export default subscriptionApi;