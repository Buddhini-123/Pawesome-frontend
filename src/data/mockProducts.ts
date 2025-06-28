export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  subcategory: string;
  inStock: boolean;
  discount?: number;
  description?: string;
}

export const dogProducts: Product[] = [
  {
    id: 'dog-1',
    name: 'Premium Adult Dog Food - Chicken & Rice',
    brand: 'Royal Canin',
    price: 2499,
    originalPrice: 2999,
    image: 'https://m.media-amazon.com/images/I/71+VzwU6K6L._AC_UF894,1000_QL80_.jpg',
    rating: 4.5,
    reviews: 324,
    category: 'dogs',
    subcategory: 'food',
    inStock: true,
    discount: 17
  },
  {
    id: 'dog-2',
    name: 'Interactive Puzzle Dog Toy',
    brand: 'Kong',
    price: 899,
    image: 'https://m.media-amazon.com/images/I/81XyqDXVwCL._AC_UF894,1000_QL80_.jpg',
    rating: 4.8,
    reviews: 156,
    category: 'dogs',
    subcategory: 'toys',
    inStock: true
  },
  {
    id: 'dog-3',
    name: 'Orthopedic Dog Bed - Large',
    brand: 'PetSafe',
    price: 3999,
    originalPrice: 4999,
    image: 'https://m.media-amazon.com/images/I/81amc8iMp7L._AC_SL1500_.jpg',
    rating: 4.7,
    reviews: 89,
    category: 'dogs',
    subcategory: 'bedding',
    inStock: true,
    discount: 20
  },
  {
    id: 'dog-4',
    name: 'Dog Shampoo - Sensitive Skin',
    brand: 'Wahl',
    price: 599,
    image: 'https://m.media-amazon.com/images/I/71d8cNL1HVL._AC_SL1500_.jpg',
    rating: 4.3,
    reviews: 201,
    category: 'dogs',
    subcategory: 'grooming',
    inStock: true
  },
  {
    id: 'dog-5',
    name: 'LED Dog Collar - Rechargeable',
    brand: 'Illumiseen',
    price: 1299,
    image: 'https://m.media-amazon.com/images/I/61+GcO2yKyL._AC_SL1000_.jpg',
    rating: 4.6,
    reviews: 412,
    category: 'dogs',
    subcategory: 'accessories',
    inStock: false
  },
  {
    id: 'dog-6',
    name: 'Grain-Free Puppy Food',
    brand: 'Blue Buffalo',
    price: 3299,
    originalPrice: 3799,
    image: 'https://m.media-amazon.com/images/I/81YYXSb0YBL._AC_SL1500_.jpg',
    rating: 4.4,
    reviews: 567,
    category: 'dogs',
    subcategory: 'food',
    inStock: true,
    discount: 13
  },
  {
    id: 'dog-7',
    name: 'Retractable Dog Leash - 5m',
    brand: 'Flexi',
    price: 1599,
    image: 'https://m.media-amazon.com/images/I/71-NN3B+FtL._AC_SL1200_.jpg',
    rating: 4.2,
    reviews: 234,
    category: 'dogs',
    subcategory: 'accessories',
    inStock: true
  },
  {
    id: 'dog-8',
    name: 'Dog Dental Chews - Pack of 30',
    brand: 'Pedigree',
    price: 799,
    originalPrice: 999,
    image: 'https://m.media-amazon.com/images/I/81xUZgOj7LL._AC_SL1500_.jpg',
    rating: 4.5,
    reviews: 789,
    category: 'dogs',
    subcategory: 'treats',
    inStock: true,
    discount: 20
  }
];

export const catProducts: Product[] = [
  {
    id: 'cat-1',
    name: 'Premium Cat Litter - Clumping',
    brand: 'Ever Clean',
    price: 899,
    image: 'https://m.media-amazon.com/images/I/71VZE3vx5iL._AC_SL1200_.jpg',
    rating: 4.6,
    reviews: 456,
    category: 'cats',
    subcategory: 'litter',
    inStock: true
  },
  {
    id: 'cat-2',
    name: 'Indoor Cat Food - Salmon',
    brand: 'Royal Canin',
    price: 1999,
    originalPrice: 2499,
    image: 'https://m.media-amazon.com/images/I/71G+hZJwDfL._AC_SL1500_.jpg',
    rating: 4.7,
    reviews: 321,
    category: 'cats',
    subcategory: 'food',
    inStock: true,
    discount: 20
  },
  {
    id: 'cat-3',
    name: 'Cat Scratching Post - Tall',
    brand: 'Catit',
    price: 2499,
    image: 'https://m.media-amazon.com/images/I/71+Uv8q7r7L._AC_SL1500_.jpg',
    rating: 4.5,
    reviews: 189,
    category: 'cats',
    subcategory: 'furniture',
    inStock: true
  },
  {
    id: 'cat-4',
    name: 'Interactive Laser Cat Toy',
    brand: 'PetSafe',
    price: 1299,
    originalPrice: 1599,
    image: 'https://m.media-amazon.com/images/I/61B8+8Bg6DL._AC_SL1010_.jpg',
    rating: 4.3,
    reviews: 267,
    category: 'cats',
    subcategory: 'toys',
    inStock: false,
    discount: 19
  },
  {
    id: 'cat-5',
    name: 'Cat Carrier - Airline Approved',
    brand: 'Sherpa',
    price: 3999,
    image: 'https://m.media-amazon.com/images/I/81GwldRb94L._AC_SL1500_.jpg',
    rating: 4.8,
    reviews: 92,
    category: 'cats',
    subcategory: 'accessories',
    inStock: true
  },
  {
    id: 'cat-6',
    name: 'Kitten Milk Replacer',
    brand: 'KMR',
    price: 1499,
    image: 'https://m.media-amazon.com/images/I/61nPAlnPtTL._AC_SL1500_.jpg',
    rating: 4.9,
    reviews: 145,
    category: 'cats',
    subcategory: 'food',
    inStock: true
  },
  {
    id: 'cat-7',
    name: 'Cat Window Perch',
    brand: 'K&H Pet',
    price: 2299,
    originalPrice: 2799,
    image: 'https://m.media-amazon.com/images/I/71nB6+C5CdL._AC_SL1500_.jpg',
    rating: 4.4,
    reviews: 333,
    category: 'cats',
    subcategory: 'furniture',
    inStock: true,
    discount: 18
  },
  {
    id: 'cat-8',
    name: 'Cat Treats - Tuna Flavor',
    brand: 'Temptations',
    price: 399,
    image: 'https://m.media-amazon.com/images/I/71x5nnnFQnL._AC_SL1500_.jpg',
    rating: 4.7,
    reviews: 892,
    category: 'cats',
    subcategory: 'treats',
    inStock: true
  }
];

export const birdProducts: Product[] = [
  {
    id: 'bird-1',
    name: 'Premium Bird Seed Mix',
    brand: 'Vitakraft',
    price: 599,
    image: 'https://m.media-amazon.com/images/I/81T9dkNSMlL._AC_SL1500_.jpg',
    rating: 4.5,
    reviews: 234,
    category: 'birds',
    subcategory: 'food',
    inStock: true
  },
  {
    id: 'bird-2',
    name: 'Large Bird Cage - Powder Coated',
    brand: 'Prevue',
    price: 7999,
    originalPrice: 9999,
    image: 'https://m.media-amazon.com/images/I/81K7x9leGuL._AC_SL1500_.jpg',
    rating: 4.6,
    reviews: 67,
    category: 'birds',
    subcategory: 'cages',
    inStock: true,
    discount: 20
  },
  {
    id: 'bird-3',
    name: 'Bird Swing Toy Set',
    brand: 'JW Pet',
    price: 899,
    image: 'https://m.media-amazon.com/images/I/71QzONGx5vL._AC_SL1500_.jpg',
    rating: 4.4,
    reviews: 156,
    category: 'birds',
    subcategory: 'toys',
    inStock: true
  },
  {
    id: 'bird-4',
    name: 'Mineral Block for Birds',
    brand: 'Kaytee',
    price: 299,
    image: 'https://m.media-amazon.com/images/I/71HXfMnWcPL._AC_SL1500_.jpg',
    rating: 4.3,
    reviews: 389,
    category: 'birds',
    subcategory: 'supplements',
    inStock: true
  },
  {
    id: 'bird-5',
    name: 'Bird Bath - Attachable',
    brand: 'Lixit',
    price: 499,
    originalPrice: 699,
    image: 'https://m.media-amazon.com/images/I/51zIbIq34zL._AC_SL1000_.jpg',
    rating: 4.7,
    reviews: 203,
    category: 'birds',
    subcategory: 'accessories',
    inStock: false,
    discount: 29
  },
  {
    id: 'bird-6',
    name: 'Parrot Pellets - Fruit Blend',
    brand: 'ZuPreem',
    price: 1299,
    image: 'https://m.media-amazon.com/images/I/91L3o8w+0PL._AC_SL1500_.jpg',
    rating: 4.8,
    reviews: 445,
    category: 'birds',
    subcategory: 'food',
    inStock: true
  }
];

export const otherAnimalsProducts: Product[] = [
  {
    id: 'other-1',
    name: 'Rabbit Pellets - Timothy Hay Based',
    brand: 'Oxbow',
    price: 899,
    image: 'https://m.media-amazon.com/images/I/81gC7frfJyL._AC_SL1500_.jpg',
    rating: 4.7,
    reviews: 167,
    category: 'other',
    subcategory: 'food',
    inStock: true
  },
  {
    id: 'other-2',
    name: 'Hamster Wheel - Silent Spinner',
    brand: 'Kaytee',
    price: 699,
    originalPrice: 899,
    image: 'https://m.media-amazon.com/images/I/71v-vyJJGTL._AC_SL1500_.jpg',
    rating: 4.5,
    reviews: 298,
    category: 'other',
    subcategory: 'toys',
    inStock: true,
    discount: 22
  },
  {
    id: 'other-3',
    name: 'Fish Tank Filter - 20 Gallon',
    brand: 'Tetra',
    price: 2499,
    image: 'https://m.media-amazon.com/images/I/81KaKZUn9wL._AC_SL1500_.jpg',
    rating: 4.4,
    reviews: 432,
    category: 'other',
    subcategory: 'aquarium',
    inStock: true
  },
  {
    id: 'other-4',
    name: 'Guinea Pig Hideout',
    brand: 'Ware',
    price: 1299,
    image: 'https://m.media-amazon.com/images/I/71K6-yMQQsL._AC_SL1500_.jpg',
    rating: 4.6,
    reviews: 89,
    category: 'other',
    subcategory: 'accessories',
    inStock: true
  },
  {
    id: 'other-5',
    name: 'Turtle Food Pellets',
    brand: 'ReptoMin',
    price: 599,
    image: 'https://m.media-amazon.com/images/I/81pRoUeS-sL._AC_SL1500_.jpg',
    rating: 4.3,
    reviews: 234,
    category: 'other',
    subcategory: 'food',
    inStock: false
  },
  {
    id: 'other-6',
    name: 'Ferret Hammock',
    brand: 'Marshall',
    price: 1599,
    originalPrice: 1999,
    image: 'https://m.media-amazon.com/images/I/71MLW8e3cZL._AC_SL1500_.jpg',
    rating: 4.8,
    reviews: 156,
    category: 'other',
    subcategory: 'bedding',
    inStock: true,
    discount: 20
  }
];

export const getDogFilters = () => [
  {
    title: 'Category',
    type: 'checkbox' as const,
    options: [
      { label: 'Food', value: 'food', count: 2 },
      { label: 'Toys', value: 'toys', count: 1 },
      { label: 'Bedding', value: 'bedding', count: 1 },
      { label: 'Grooming', value: 'grooming', count: 1 },
      { label: 'Accessories', value: 'accessories', count: 2 },
      { label: 'Treats', value: 'treats', count: 1 }
    ]
  },
  {
    title: 'Brand',
    type: 'checkbox' as const,
    options: [
      { label: 'Royal Canin', value: 'Royal Canin' },
      { label: 'Kong', value: 'Kong' },
      { label: 'PetSafe', value: 'PetSafe' },
      { label: 'Blue Buffalo', value: 'Blue Buffalo' },
      { label: 'Pedigree', value: 'Pedigree' }
    ]
  },
  {
    title: 'Price Range',
    type: 'checkbox' as const,
    options: [
      { label: 'Under Rs.1000', value: '0-1000' },
      { label: 'Rs.1000 - Rs.2500', value: '1000-2500' },
      { label: 'Rs.2500 - Rs.5000', value: '2500-5000' },
      { label: 'Above Rs.5000', value: '5000+' }
    ]
  },
  {
    title: 'Rating',
    type: 'checkbox' as const,
    options: [
      { label: '4★ & above', value: '4' },
      { label: '3★ & above', value: '3' },
      { label: '2★ & above', value: '2' }
    ]
  }
];

export const getCatFilters = () => [
  {
    title: 'Category',
    type: 'checkbox' as const,
    options: [
      { label: 'Food', value: 'food', count: 2 },
      { label: 'Litter', value: 'litter', count: 1 },
      { label: 'Toys', value: 'toys', count: 1 },
      { label: 'Furniture', value: 'furniture', count: 2 },
      { label: 'Accessories', value: 'accessories', count: 1 },
      { label: 'Treats', value: 'treats', count: 1 }
    ]
  },
  {
    title: 'Brand',
    type: 'checkbox' as const,
    options: [
      { label: 'Royal Canin', value: 'Royal Canin' },
      { label: 'Ever Clean', value: 'Ever Clean' },
      { label: 'Catit', value: 'Catit' },
      { label: 'PetSafe', value: 'PetSafe' },
      { label: 'Temptations', value: 'Temptations' }
    ]
  },
  {
    title: 'Price Range',
    type: 'checkbox' as const,
    options: [
      { label: 'Under Rs.500', value: '0-500' },
      { label: 'Rs.500 - Rs.1500', value: '500-1500' },
      { label: 'Rs.1500 - Rs.3000', value: '1500-3000' },
      { label: 'Above Rs.3000', value: '3000+' }
    ]
  }
];

export const getBirdFilters = () => [
  {
    title: 'Category',
    type: 'checkbox' as const,
    options: [
      { label: 'Food', value: 'food', count: 2 },
      { label: 'Cages', value: 'cages', count: 1 },
      { label: 'Toys', value: 'toys', count: 1 },
      { label: 'Supplements', value: 'supplements', count: 1 },
      { label: 'Accessories', value: 'accessories', count: 1 }
    ]
  },
  {
    title: 'Brand',
    type: 'checkbox' as const,
    options: [
      { label: 'Vitakraft', value: 'Vitakraft' },
      { label: 'Kaytee', value: 'Kaytee' },
      { label: 'ZuPreem', value: 'ZuPreem' },
      { label: 'Prevue', value: 'Prevue' }
    ]
  }
];

export const getOtherAnimalsFilters = () => [
  {
    title: 'Pet Type',
    type: 'checkbox' as const,
    options: [
      { label: 'Rabbits', value: 'rabbits' },
      { label: 'Hamsters', value: 'hamsters' },
      { label: 'Fish', value: 'fish' },
      { label: 'Guinea Pigs', value: 'guinea-pigs' },
      { label: 'Turtles', value: 'turtles' },
      { label: 'Ferrets', value: 'ferrets' }
    ]
  },
  {
    title: 'Category',
    type: 'checkbox' as const,
    options: [
      { label: 'Food', value: 'food' },
      { label: 'Toys', value: 'toys' },
      { label: 'Aquarium', value: 'aquarium' },
      { label: 'Accessories', value: 'accessories' },
      { label: 'Bedding', value: 'bedding' }
    ]
  }
];