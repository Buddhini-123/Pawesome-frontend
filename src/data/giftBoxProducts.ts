export interface GiftProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: 'theme' | 'toy' | 'treat' | 'care' | 'wrap';
  petType?: 'dog' | 'cat' | 'bird' | 'small' | 'all';
}

export interface GiftBoxStep {
  id: number;
  title: string;
  shortTitle: string;
  products: GiftProduct[];
  minSelection: number;
  maxSelection?: number;
}

// Theme Cards
export const themeCards: GiftProduct[] = [
  {
    id: 'theme-birthday',
    name: 'Birthday Celebration',
    price: 150,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    description: 'Perfect for pet birthday celebrations with colorful designs',
    category: 'theme'
  },
  {
    id: 'theme-wellness',
    name: 'Get Well Soon',
    price: 150,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    description: 'Caring wishes for a speedy recovery',
    category: 'theme'
  },
  {
    id: 'theme-welcome',
    name: 'Welcome Home',
    price: 150,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop',
    description: 'Perfect for new pet parents or adoption celebrations',
    category: 'theme'
  },
  {
    id: 'theme-love',
    name: 'Just Because',
    price: 150,
    image: 'https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?w=400&h=400&fit=crop',
    description: 'Show your love anytime with this heartfelt design',
    category: 'theme'
  },
  {
    id: 'theme-holiday',
    name: 'Holiday Special',
    price: 200,
    image: 'https://images.unsplash.com/photo-1576859758361-c8d3b35ce432?w=400&h=400&fit=crop',
    description: 'Festive celebrations for special occasions',
    category: 'theme'
  },
  {
    id: 'theme-congrats',
    name: 'Congratulations',
    price: 150,
    image: 'https://images.unsplash.com/photo-1531986362435-16b427eb9c26?w=400&h=400&fit=crop',
    description: 'Celebrate achievements and milestones',
    category: 'theme'
  },
  {
    id: 'theme-sympathy',
    name: 'With Sympathy',
    price: 150,
    image: 'https://images.unsplash.com/photo-1516728778615-2d590ea1855e?w=400&h=400&fit=crop',
    description: 'Express condolences with a thoughtful message',
    category: 'theme'
  },
  {
    id: 'theme-thanks',
    name: 'Thank You',
    price: 150,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop',
    description: 'Show appreciation to pet sitters, vets, or friends',
    category: 'theme'
  }
];

// Dog Toys
export const dogToys: GiftProduct[] = [
  {
    id: 'dog-toy-bone',
    name: 'Squeaky Bone Deluxe',
    price: 899,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop',
    description: 'Classic squeaky bone toy made from durable rubber',
    category: 'toy',
    petType: 'dog'
  },
  {
    id: 'dog-toy-tennis',
    name: 'Tennis Ball Set (3 Pack)',
    price: 599,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop',
    description: 'High-bounce tennis balls perfect for fetch',
    category: 'toy',
    petType: 'dog'
  },
  {
    id: 'dog-toy-rope',
    name: 'Rope Tug Toy',
    price: 749,
    image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=400&fit=crop',
    description: 'Durable cotton rope for tug-of-war games',
    category: 'toy',
    petType: 'dog'
  },
  {
    id: 'dog-toy-plush',
    name: 'Soft Plush Bear',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=400&h=400&fit=crop',
    description: 'Cuddly plush toy for comfort and play',
    category: 'toy',
    petType: 'dog'
  },
  {
    id: 'dog-toy-puzzle',
    name: 'Interactive Puzzle Ball',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop',
    description: 'Mental stimulation puzzle that dispenses treats',
    category: 'toy',
    petType: 'dog'
  },
  {
    id: 'dog-toy-frisbee',
    name: 'Flying Disc Pro',
    price: 699,
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
    description: 'Soft rubber frisbee safe for teeth and gums',
    category: 'toy',
    petType: 'dog'
  },
  {
    id: 'dog-toy-kong',
    name: 'Kong Classic',
    price: 999,
    image: 'https://m.media-amazon.com/images/I/71eertN5CJL._AC_SL1500_.jpg',
    description: 'Durable rubber toy for treat stuffing',
    category: 'toy',
    petType: 'dog'
  },
  {
    id: 'dog-toy-ball-launcher',
    name: 'Ball Launcher Set',
    price: 1499,
    image: 'https://m.media-amazon.com/images/I/71iN+RKvYgL._AC_SL1500_.jpg',
    description: 'Throw balls further with less effort',
    category: 'toy',
    petType: 'dog'
  }
];

// Cat Toys
export const catToys: GiftProduct[] = [
  {
    id: 'cat-toy-mouse',
    name: 'Catnip Mouse Trio',
    price: 499,
    image: 'https://images.unsplash.com/photo-1585559700398-b4cb4f65a611?w=400&h=400&fit=crop',
    description: 'Three catnip-filled mice for hunting play',
    category: 'toy',
    petType: 'cat'
  },
  {
    id: 'cat-toy-feather',
    name: 'Feather Wand Deluxe',
    price: 599,
    image: 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=400&h=400&fit=crop',
    description: 'Interactive feather toy with extendable wand',
    category: 'toy',
    petType: 'cat'
  },
  {
    id: 'cat-toy-ball',
    name: 'Catnip Ball Set',
    price: 399,
    image: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=400&fit=crop',
    description: 'Colorful balls infused with premium catnip',
    category: 'toy',
    petType: 'cat'
  },
  {
    id: 'cat-toy-laser',
    name: 'Automatic Laser Toy',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=400&fit=crop',
    description: 'Hands-free laser pointer for endless entertainment',
    category: 'toy',
    petType: 'cat'
  },
  {
    id: 'cat-toy-tunnel',
    name: 'Crinkle Tunnel',
    price: 899,
    image: 'https://m.media-amazon.com/images/I/71W5HX9x9VL._AC_SL1500_.jpg',
    description: 'Collapsible tunnel with crinkle sounds',
    category: 'toy',
    petType: 'cat'
  },
  {
    id: 'cat-toy-tower',
    name: 'Track Ball Tower',
    price: 999,
    image: 'https://m.media-amazon.com/images/I/71qn6N7GMKL._AC_SL1500_.jpg',
    description: 'Multi-level ball track for batting fun',
    category: 'toy',
    petType: 'cat'
  },
  {
    id: 'cat-toy-spring',
    name: 'Colorful Springs (10 Pack)',
    price: 299,
    image: 'https://m.media-amazon.com/images/I/71J5dpe4CWL._AC_SL1500_.jpg',
    description: 'Bouncy springs cats love to bat around',
    category: 'toy',
    petType: 'cat'
  },
  {
    id: 'cat-toy-puzzle-feeder',
    name: 'Puzzle Treat Dispenser',
    price: 1099,
    image: 'https://m.media-amazon.com/images/I/71-nBY5PBKL._AC_SL1500_.jpg',
    description: 'Slow feeder puzzle for mental stimulation',
    category: 'toy',
    petType: 'cat'
  }
];

// Bird Toys
export const birdToys: GiftProduct[] = [
  {
    id: 'bird-toy-swing',
    name: 'Natural Wood Swing',
    price: 499,
    image: 'https://m.media-amazon.com/images/I/71QzONGx5vL._AC_SL1500_.jpg',
    description: 'Natural wood perch swing for all birds',
    category: 'toy',
    petType: 'bird'
  },
  {
    id: 'bird-toy-ladder',
    name: 'Colorful Ladder',
    price: 399,
    image: 'https://m.media-amazon.com/images/I/71sQCGkCYuL._AC_SL1500_.jpg',
    description: 'Wooden ladder with colorful rungs',
    category: 'toy',
    petType: 'bird'
  },
  {
    id: 'bird-toy-bell',
    name: 'Bell & Mirror Combo',
    price: 599,
    image: 'https://m.media-amazon.com/images/I/71PnVIHXYvL._AC_SL1500_.jpg',
    description: 'Interactive toy with bell and mirror',
    category: 'toy',
    petType: 'bird'
  },
  {
    id: 'bird-toy-foraging',
    name: 'Foraging Wheel',
    price: 799,
    image: 'https://m.media-amazon.com/images/I/71RyzW5SFUL._AC_SL1500_.jpg',
    description: 'Hide treats for foraging fun',
    category: 'toy',
    petType: 'bird'
  }
];

// Small Animal Toys
export const smallAnimalToys: GiftProduct[] = [
  {
    id: 'small-toy-wheel',
    name: 'Silent Exercise Wheel',
    price: 899,
    image: 'https://m.media-amazon.com/images/I/71v-vyJJGTL._AC_SL1500_.jpg',
    description: 'Quiet wheel for hamsters and gerbils',
    category: 'toy',
    petType: 'small'
  },
  {
    id: 'small-toy-tunnel',
    name: 'Bendable Tunnel System',
    price: 699,
    image: 'https://m.media-amazon.com/images/I/71q5KMLqnpL._AC_SL1500_.jpg',
    description: 'Expandable tunnel for exploration',
    category: 'toy',
    petType: 'small'
  },
  {
    id: 'small-toy-chew',
    name: 'Natural Wood Chews',
    price: 499,
    image: 'https://m.media-amazon.com/images/I/71rjSe0SJiL._AC_SL1500_.jpg',
    description: 'Apple wood sticks for healthy teeth',
    category: 'toy',
    petType: 'small'
  },
  {
    id: 'small-toy-hideout',
    name: 'Grass Mat & Ball Set',
    price: 599,
    image: 'https://m.media-amazon.com/images/I/71PUhSGCYhL._AC_SL1500_.jpg',
    description: 'Natural grass mat with play balls',
    category: 'toy',
    petType: 'small'
  }
];

// Treats
export const treatProducts: GiftProduct[] = [
  {
    id: 'treat-dog-chicken',
    name: 'Chicken Jerky Strips',
    price: 699,
    image: 'https://images.unsplash.com/photo-1589985701653-d9643bc790de?w=400&h=400&fit=crop',
    description: 'Premium chicken jerky for dogs',
    category: 'treat',
    petType: 'dog'
  },
  {
    id: 'treat-dog-dental',
    name: 'Dental Health Chews',
    price: 549,
    image: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=400&h=400&fit=crop',
    description: 'Promotes dental health while treating',
    category: 'treat',
    petType: 'dog'
  },
  {
    id: 'treat-dog-training',
    name: 'Training Treat Bits',
    price: 399,
    image: 'https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?w=400&h=400&fit=crop',
    description: 'Small, low-calorie training rewards',
    category: 'treat',
    petType: 'dog'
  },
  {
    id: 'treat-cat-salmon',
    name: 'Salmon Bites for Cats',
    price: 599,
    image: 'https://images.unsplash.com/photo-1560743173-567a3b5658b1?w=400&h=400&fit=crop',
    description: 'Freeze-dried salmon treats',
    category: 'treat',
    petType: 'cat'
  },
  {
    id: 'treat-cat-tuna',
    name: 'Tuna Flakes',
    price: 449,
    image: 'https://m.media-amazon.com/images/I/71x5nnnFQnL._AC_SL1500_.jpg',
    description: 'Pure tuna flakes cats love',
    category: 'treat',
    petType: 'cat'
  },
  {
    id: 'treat-cat-catnip',
    name: 'Catnip Treats',
    price: 349,
    image: 'https://m.media-amazon.com/images/I/71QCJXq5SFL._AC_SL1500_.jpg',
    description: 'Crunchy treats with catnip',
    category: 'treat',
    petType: 'cat'
  },
  {
    id: 'treat-bird-seed',
    name: 'Honey Seed Sticks',
    price: 299,
    image: 'https://m.media-amazon.com/images/I/71u3jPgFZCL._AC_SL1500_.jpg',
    description: 'Honey-coated seed treats for birds',
    category: 'treat',
    petType: 'bird'
  },
  {
    id: 'treat-small-yogurt',
    name: 'Yogurt Drops',
    price: 249,
    image: 'https://m.media-amazon.com/images/I/71zQGbPNJPL._AC_SL1500_.jpg',
    description: 'Yogurt treats for small animals',
    category: 'treat',
    petType: 'small'
  },
  {
    id: 'treat-mixed-variety',
    name: 'Mixed Pet Treat Box',
    price: 999,
    image: 'https://images.unsplash.com/photo-1585581190777-41d75e2ba755?w=400&h=400&fit=crop',
    description: 'Variety pack for multiple pets',
    category: 'treat',
    petType: 'all'
  },
  {
    id: 'treat-dog-peanut',
    name: 'Peanut Butter Bones',
    price: 599,
    image: 'https://m.media-amazon.com/images/I/81f7E7aXc0L._AC_SL1500_.jpg',
    description: 'Crunchy peanut butter flavored bones',
    category: 'treat',
    petType: 'dog'
  }
];

// Care Products
export const careProducts: GiftProduct[] = [
  {
    id: 'care-shampoo-dog',
    name: 'Oatmeal Dog Shampoo',
    price: 799,
    image: 'https://m.media-amazon.com/images/I/71d8cNL1HVL._AC_SL1500_.jpg',
    description: 'Gentle oatmeal shampoo for sensitive skin',
    category: 'care',
    petType: 'dog'
  },
  {
    id: 'care-brush-slicker',
    name: 'Professional Slicker Brush',
    price: 699,
    image: 'https://m.media-amazon.com/images/I/71vn1fKhYQL._AC_SL1500_.jpg',
    description: 'Removes loose fur and prevents matting',
    category: 'care',
    petType: 'all'
  },
  {
    id: 'care-nail-clipper',
    name: 'LED Nail Clippers',
    price: 899,
    image: 'https://m.media-amazon.com/images/I/71aXzv34N+L._AC_SL1500_.jpg',
    description: 'Safety nail clippers with LED light',
    category: 'care',
    petType: 'all'
  },
  {
    id: 'care-toothbrush',
    name: 'Pet Dental Care Kit',
    price: 599,
    image: 'https://m.media-amazon.com/images/I/71TC69SnGPL._AC_SL1500_.jpg',
    description: 'Complete dental care set with toothpaste',
    category: 'care',
    petType: 'all'
  },
  {
    id: 'care-wipes',
    name: 'Grooming Wipes (100 Pack)',
    price: 499,
    image: 'https://m.media-amazon.com/images/I/71hLQi7GzML._AC_SL1500_.jpg',
    description: 'Hypoallergenic cleaning wipes',
    category: 'care',
    petType: 'all'
  },
  {
    id: 'care-spray-cat',
    name: 'Waterless Cat Shampoo',
    price: 649,
    image: 'https://m.media-amazon.com/images/I/61e4W6r7YsL._AC_SL1500_.jpg',
    description: 'No-rinse foam shampoo for cats',
    category: 'care',
    petType: 'cat'
  },
  {
    id: 'care-conditioner',
    name: 'Detangling Conditioner',
    price: 699,
    image: 'https://m.media-amazon.com/images/I/71gZDY5AcsL._AC_SL1500_.jpg',
    description: 'Leave-in conditioner for silky coat',
    category: 'care',
    petType: 'all'
  },
  {
    id: 'care-paw-balm',
    name: 'Paw Protection Balm',
    price: 549,
    image: 'https://m.media-amazon.com/images/I/71QAXfN5kML._AC_SL1500_.jpg',
    description: 'Moisturizes and protects paw pads',
    category: 'care',
    petType: 'dog'
  }
];

// Gift Wrap Options
export const giftWrapOptions: GiftProduct[] = [
  {
    id: 'wrap-classic',
    name: 'Classic Paw Print Wrap',
    price: 99,
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop',
    description: 'Classic wrapping paper with paw print pattern',
    category: 'wrap'
  },
  {
    id: 'wrap-birthday',
    name: 'Birthday Celebration Wrap',
    price: 129,
    image: 'https://images.unsplash.com/photo-1558618047-71ecd614c712?w=400&h=400&fit=crop',
    description: 'Colorful birthday themed wrapping',
    category: 'wrap'
  },
  {
    id: 'wrap-premium',
    name: 'Premium Gift Box',
    price: 299,
    image: 'https://images.unsplash.com/photo-1577971132997-c10be9372519?w=400&h=400&fit=crop',
    description: 'Luxury gift box with ribbon and bow',
    category: 'wrap'
  },
  {
    id: 'wrap-eco',
    name: 'Eco-Friendly Wrap',
    price: 149,
    image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&h=400&fit=crop',
    description: 'Sustainable kraft paper with twine',
    category: 'wrap'
  },
  {
    id: 'wrap-basket',
    name: 'Woven Gift Basket',
    price: 399,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    description: 'Reusable woven basket with handle',
    category: 'wrap'
  },
  {
    id: 'wrap-personalized',
    name: 'Personalized Gift Bag',
    price: 249,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop',
    description: 'Custom gift bag with pet\'s name',
    category: 'wrap'
  }
];

// Gift Box Steps Configuration
export const giftBoxSteps: GiftBoxStep[] = [
  {
    id: 1,
    title: 'Choose a Theme Card',
    shortTitle: 'Theme Card',
    minSelection: 1,
    maxSelection: 1,
    products: themeCards
  },
  {
    id: 2,
    title: 'Select Your Main Pet Toy',
    shortTitle: 'Main Toy',
    minSelection: 1,
    maxSelection: 1,
    products: [...dogToys, ...catToys, ...birdToys, ...smallAnimalToys]
  },
  {
    id: 3,
    title: 'Add Complementary Toys (Optional)',
    shortTitle: 'Extra Toys',
    minSelection: 0,
    maxSelection: 3,
    products: [...dogToys, ...catToys, ...birdToys, ...smallAnimalToys].map(toy => ({
      ...toy,
      price: Math.round(toy.price * 0.8) // 20% discount on additional toys
    }))
  },
  {
    id: 4,
    title: 'Select Pet Treats',
    shortTitle: 'Treats',
    minSelection: 1,
    maxSelection: 3,
    products: treatProducts
  },
  {
    id: 5,
    title: 'Add Care Products (Optional)',
    shortTitle: 'Care Products',
    minSelection: 0,
    maxSelection: 2,
    products: careProducts
  },
  {
    id: 6,
    title: 'Choose Gift Wrapping',
    shortTitle: 'Gift Wrap',
    minSelection: 1,
    maxSelection: 1,
    products: giftWrapOptions
  }
];

// Helper functions
export const getProductsByPetType = (petType: string): GiftProduct[] => {
  const allProducts = [
    ...dogToys,
    ...catToys,
    ...birdToys,
    ...smallAnimalToys,
    ...treatProducts,
    ...careProducts
  ];
  
  if (petType === 'all') {
    return allProducts;
  }
  
  return allProducts.filter(product => 
    product.petType === petType || product.petType === 'all'
  );
};

export const calculateGiftBoxTotal = (selectedProducts: GiftProduct[]): number => {
  return selectedProducts.reduce((total, product) => total + product.price, 0);
};

export const getGiftBoxSavings = (total: number): number => {
  // Apply bulk discount based on total
  if (total >= 5000) return Math.round(total * 0.15); // 15% off
  if (total >= 3000) return Math.round(total * 0.10); // 10% off
  if (total >= 2000) return Math.round(total * 0.05); // 5% off
  return 0;
};