import { Product } from './mockProducts';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  discount: number;
  image: string;
  minOrderValue: number;
  products: string[]; // Product IDs that can be included
  popularItems?: SubscriptionItem[];
}

export interface SubscriptionItem {
  productId: string;
  name: string;
  quantity: number;
  originalPrice: number;
  subscriptionPrice: number;
  image: string;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  // Dog Subscriptions
  {
    id: 'sub-dog-food',
    name: 'Pawsome Dog Food Plan',
    description: 'Never run out of dog food! Get your favorite brands delivered monthly with exclusive savings.',
    category: 'dogs',
    frequency: 'monthly',
    discount: 15,
    image: 'https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?w=800&h=600&fit=crop',
    minOrderValue: 2000,
    products: ['dog-1', 'dog-6', 'dog-8'],
    popularItems: [
      {
        productId: 'dog-1',
        name: 'Premium Adult Dog Food - Chicken & Rice',
        quantity: 2,
        originalPrice: 2499,
        subscriptionPrice: 2124,
        image: 'https://m.media-amazon.com/images/I/71+VzwU6K6L._AC_UF894,1000_QL80_.jpg'
      },
      {
        productId: 'dog-6',
        name: 'Grain-Free Puppy Food',
        quantity: 1,
        originalPrice: 3299,
        subscriptionPrice: 2804,
        image: 'https://m.media-amazon.com/images/I/81YYXSb0YBL._AC_SL1500_.jpg'
      }
    ]
  },
  {
    id: 'sub-dog-treats',
    name: 'Tail-Wagging Treats Box',
    description: 'Monthly delivery of premium dog treats and chews. Perfect for training and spoiling!',
    category: 'dogs',
    frequency: 'monthly',
    discount: 20,
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800&h=600&fit=crop',
    minOrderValue: 1000,
    products: ['dog-8'],
    popularItems: [
      {
        productId: 'dog-8',
        name: 'Dog Dental Chews - Pack of 30',
        quantity: 3,
        originalPrice: 799,
        subscriptionPrice: 639,
        image: 'https://m.media-amazon.com/images/I/81xUZgOj7LL._AC_SL1500_.jpg'
      }
    ]
  },
  {
    id: 'sub-dog-essentials',
    name: 'Complete Dog Care Bundle',
    description: 'Everything your dog needs: food, treats, toys, and grooming supplies in one convenient subscription.',
    category: 'dogs',
    frequency: 'monthly',
    discount: 25,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop',
    minOrderValue: 5000,
    products: ['dog-1', 'dog-2', 'dog-4', 'dog-8'],
    popularItems: [
      {
        productId: 'dog-1',
        name: 'Premium Adult Dog Food - Chicken & Rice',
        quantity: 2,
        originalPrice: 2499,
        subscriptionPrice: 1874,
        image: 'https://m.media-amazon.com/images/I/71+VzwU6K6L._AC_UF894,1000_QL80_.jpg'
      },
      {
        productId: 'dog-2',
        name: 'Interactive Puzzle Dog Toy',
        quantity: 1,
        originalPrice: 899,
        subscriptionPrice: 674,
        image: 'https://m.media-amazon.com/images/I/81XyqDXVwCL._AC_UF894,1000_QL80_.jpg'
      },
      {
        productId: 'dog-4',
        name: 'Dog Shampoo - Sensitive Skin',
        quantity: 1,
        originalPrice: 599,
        subscriptionPrice: 449,
        image: 'https://m.media-amazon.com/images/I/71d8cNL1HVL._AC_SL1500_.jpg'
      }
    ]
  },

  // Cat Subscriptions
  {
    id: 'sub-cat-food',
    name: 'Purrfect Meal Plan',
    description: 'Premium cat food delivered to your door. Choose from wet, dry, or mixed options.',
    category: 'cats',
    frequency: 'monthly',
    discount: 15,
    image: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=800&h=600&fit=crop',
    minOrderValue: 1500,
    products: ['cat-2', 'cat-6'],
    popularItems: [
      {
        productId: 'cat-2',
        name: 'Indoor Cat Food - Salmon',
        quantity: 2,
        originalPrice: 1999,
        subscriptionPrice: 1699,
        image: 'https://m.media-amazon.com/images/I/71G+hZJwDfL._AC_SL1500_.jpg'
      }
    ]
  },
  {
    id: 'sub-cat-litter',
    name: 'Fresh & Clean Litter Service',
    description: 'Never run out of cat litter! Regular delivery of premium clumping litter.',
    category: 'cats',
    frequency: 'monthly',
    discount: 20,
    image: 'https://images.unsplash.com/photo-1615789591457-74a63395c990?w=800&h=600&fit=crop',
    minOrderValue: 1500,
    products: ['cat-1'],
    popularItems: [
      {
        productId: 'cat-1',
        name: 'Premium Cat Litter - Clumping',
        quantity: 4,
        originalPrice: 899,
        subscriptionPrice: 719,
        image: 'https://m.media-amazon.com/images/I/71VZE3vx5iL._AC_SL1200_.jpg'
      }
    ]
  },
  {
    id: 'sub-cat-complete',
    name: 'Complete Cat Care Kit',
    description: 'Food, litter, toys, and treats - everything for a happy cat delivered monthly.',
    category: 'cats',
    frequency: 'monthly',
    discount: 25,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop',
    minOrderValue: 4000,
    products: ['cat-1', 'cat-2', 'cat-4', 'cat-8'],
    popularItems: [
      {
        productId: 'cat-2',
        name: 'Indoor Cat Food - Salmon',
        quantity: 2,
        originalPrice: 1999,
        subscriptionPrice: 1499,
        image: 'https://m.media-amazon.com/images/I/71G+hZJwDfL._AC_SL1500_.jpg'
      },
      {
        productId: 'cat-1',
        name: 'Premium Cat Litter - Clumping',
        quantity: 2,
        originalPrice: 899,
        subscriptionPrice: 674,
        image: 'https://m.media-amazon.com/images/I/71VZE3vx5iL._AC_SL1200_.jpg'
      },
      {
        productId: 'cat-8',
        name: 'Cat Treats - Tuna Flavor',
        quantity: 3,
        originalPrice: 399,
        subscriptionPrice: 299,
        image: 'https://m.media-amazon.com/images/I/71x5nnnFQnL._AC_SL1500_.jpg'
      }
    ]
  },

  // Bird Subscriptions
  {
    id: 'sub-bird-food',
    name: 'Chirpy Food Club',
    description: 'Premium bird seeds and pellets delivered monthly for your feathered friends.',
    category: 'birds',
    frequency: 'monthly',
    discount: 15,
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&h=600&fit=crop',
    minOrderValue: 1000,
    products: ['bird-1', 'bird-6'],
    popularItems: [
      {
        productId: 'bird-1',
        name: 'Premium Bird Seed Mix',
        quantity: 3,
        originalPrice: 599,
        subscriptionPrice: 509,
        image: 'https://m.media-amazon.com/images/I/81T9dkNSMlL._AC_SL1500_.jpg'
      },
      {
        productId: 'bird-6',
        name: 'Parrot Pellets - Fruit Blend',
        quantity: 1,
        originalPrice: 1299,
        subscriptionPrice: 1104,
        image: 'https://m.media-amazon.com/images/I/91L3o8w+0PL._AC_SL1500_.jpg'
      }
    ]
  },
  {
    id: 'sub-bird-complete',
    name: 'Happy Bird Bundle',
    description: 'Complete bird care with food, toys, and supplements delivered monthly.',
    category: 'birds',
    frequency: 'monthly',
    discount: 20,
    image: 'https://images.unsplash.com/photo-1606567595334-d39972c85dbe?w=800&h=600&fit=crop',
    minOrderValue: 2000,
    products: ['bird-1', 'bird-3', 'bird-4'],
    popularItems: [
      {
        productId: 'bird-1',
        name: 'Premium Bird Seed Mix',
        quantity: 2,
        originalPrice: 599,
        subscriptionPrice: 479,
        image: 'https://m.media-amazon.com/images/I/81T9dkNSMlL._AC_SL1500_.jpg'
      },
      {
        productId: 'bird-4',
        name: 'Mineral Block for Birds',
        quantity: 4,
        originalPrice: 299,
        subscriptionPrice: 239,
        image: 'https://m.media-amazon.com/images/I/71HXfMnWcPL._AC_SL1500_.jpg'
      }
    ]
  },

  // Small Animals Subscriptions
  {
    id: 'sub-small-food',
    name: 'Small Pet Feast',
    description: 'Nutritious food for rabbits, guinea pigs, hamsters, and more - delivered monthly.',
    category: 'other',
    frequency: 'monthly',
    discount: 15,
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&h=600&fit=crop',
    minOrderValue: 1000,
    products: ['other-1', 'other-5'],
    popularItems: [
      {
        productId: 'other-1',
        name: 'Rabbit Pellets - Timothy Hay Based',
        quantity: 2,
        originalPrice: 899,
        subscriptionPrice: 764,
        image: 'https://m.media-amazon.com/images/I/81gC7frfJyL._AC_SL1500_.jpg'
      }
    ]
  },
  {
    id: 'sub-aquarium',
    name: 'Aquarium Care Club',
    description: 'Fish food, water treatments, and aquarium supplies delivered monthly.',
    category: 'other',
    frequency: 'monthly',
    discount: 20,
    image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?w=800&h=600&fit=crop',
    minOrderValue: 1500,
    products: ['other-3', 'other-5'],
    popularItems: [
      {
        productId: 'other-5',
        name: 'Turtle Food Pellets',
        quantity: 3,
        originalPrice: 599,
        subscriptionPrice: 479,
        image: 'https://m.media-amazon.com/images/I/81pRoUeS-sL._AC_SL1500_.jpg'
      }
    ]
  },

  // Vet Diet Subscriptions
  {
    id: 'sub-vet-diet',
    name: 'Prescription Diet Plan',
    description: 'Veterinary diets delivered monthly with vet consultation included.',
    category: 'vetdiet',
    frequency: 'monthly',
    discount: 10,
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800&h=600&fit=crop',
    minOrderValue: 3000,
    products: ['vetdiet-1', 'vetdiet-2', 'vetdiet-3', 'vetdiet-4', 'vetdiet-5', 'vetdiet-6', 'vetdiet-7', 'vetdiet-8', 'vetdiet-9', 'vetdiet-10'],
    popularItems: [
      {
        productId: 'vetdiet-1',
        name: 'Prescription Joint Care - Canine',
        quantity: 1,
        originalPrice: 4599,
        subscriptionPrice: 4139,
        image: 'https://m.media-amazon.com/images/I/81vZPevj4gL._AC_SL1500_.jpg'
      },
      {
        productId: 'vetdiet-4',
        name: 'Kidney Support - Feline',
        quantity: 1,
        originalPrice: 4199,
        subscriptionPrice: 3779,
        image: 'https://m.media-amazon.com/images/I/81Z3fXkb5RL._AC_SL1500_.jpg'
      }
    ]
  },

  // Mixed/Multi-Pet Subscriptions
  {
    id: 'sub-multi-pet',
    name: 'Multi-Pet Family Plan',
    description: 'Customize your subscription for multiple pets. Mix and match products across all categories.',
    category: 'all',
    frequency: 'monthly',
    discount: 30,
    image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&h=600&fit=crop',
    minOrderValue: 8000,
    products: ['dog-1', 'cat-2', 'bird-1', 'other-1'],
    popularItems: [
      {
        productId: 'dog-1',
        name: 'Premium Adult Dog Food - Chicken & Rice',
        quantity: 2,
        originalPrice: 2499,
        subscriptionPrice: 1749,
        image: 'https://m.media-amazon.com/images/I/71+VzwU6K6L._AC_UF894,1000_QL80_.jpg'
      },
      {
        productId: 'cat-2',
        name: 'Indoor Cat Food - Salmon',
        quantity: 2,
        originalPrice: 1999,
        subscriptionPrice: 1399,
        image: 'https://m.media-amazon.com/images/I/71G+hZJwDfL._AC_SL1500_.jpg'
      }
    ]
  }
];

export const getSubscriptionsByCategory = (category: string): SubscriptionPlan[] => {
  if (category === 'all') {
    return subscriptionPlans;
  }
  return subscriptionPlans.filter(plan => 
    plan.category === category || plan.category === 'all'
  );
};

export const getSubscriptionById = (id: string): SubscriptionPlan | undefined => {
  return subscriptionPlans.find(plan => plan.id === id);
};

export const calculateSubscriptionSavings = (
  originalTotal: number,
  discountPercentage: number
): { discountedTotal: number; savings: number } => {
  const discountedTotal = originalTotal * (1 - discountPercentage / 100);
  const savings = originalTotal - discountedTotal;
  return {
    discountedTotal: Math.round(discountedTotal),
    savings: Math.round(savings)
  };
};