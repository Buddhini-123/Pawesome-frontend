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
  stock?: number;
  discount?: number;
  description?: string;
  weight?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
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
    stock: 45,
    discount: 17,
    weight: '3.00',
    dimensions: {
      length: 35,
      width: 25,
      height: 10
    }
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
    inStock: true,
    stock: 8,
    weight: '0.35',
    dimensions: {
      length: 20,
      width: 15,
      height: 12
    }
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
    discount: 20,
    weight: '2.50',
    dimensions: {
      length: 90,
      width: 70,
      height: 15
    }
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
    inStock: true,
    weight: '0.75',
    dimensions: {
      length: 22,
      width: 8,
      height: 8
    }
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
    inStock: false,
    weight: '0.15',
    dimensions: {
      length: 50,
      width: 2,
      height: 2
    }
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
    discount: 13,
    weight: '5.00',
    dimensions: {
      length: 40,
      width: 30,
      height: 12
    }
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
    inStock: true,
    weight: '0.25',
    dimensions: {
      length: 15,
      width: 12,
      height: 5
    }
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
    discount: 20,
    weight: '0.50',
    dimensions: {
      length: 25,
      width: 18,
      height: 8
    }
  },
  {
    id: 'dog-9',
    name: 'Dog Training Clicker Set',
    brand: 'PetSafe',
    price: 499,
    image: 'https://m.media-amazon.com/images/I/71TKQ9JMKVL._AC_SL1500_.jpg',
    rating: 4.4,
    reviews: 567,
    category: 'dogs',
    subcategory: 'training',
    inStock: true,
    description: 'Professional training clicker with wrist strap and training guide'
  },
  {
    id: 'dog-10',
    name: 'Waterproof Dog Jacket',
    brand: 'Kurgo',
    price: 2299,
    originalPrice: 2799,
    image: 'https://m.media-amazon.com/images/I/71jrO8nZpBL._AC_SL1500_.jpg',
    rating: 4.6,
    reviews: 234,
    category: 'dogs',
    subcategory: 'clothing',
    inStock: true,
    discount: 18
  },
  {
    id: 'dog-11',
    name: 'Dog Car Seat Cover',
    brand: 'BarksBar',
    price: 3499,
    image: 'https://m.media-amazon.com/images/I/91hPfrKE0DL._AC_SL1500_.jpg',
    rating: 4.7,
    reviews: 892,
    category: 'dogs',
    subcategory: 'travel',
    inStock: true,
    description: 'Waterproof, scratch-proof car seat cover with side flaps'
  },
  {
    id: 'dog-12',
    name: 'Automatic Dog Feeder',
    brand: 'PetSafe',
    price: 5999,
    originalPrice: 6999,
    image: 'https://m.media-amazon.com/images/I/71L5KfN9tSL._AC_SL1500_.jpg',
    rating: 4.5,
    reviews: 445,
    category: 'dogs',
    subcategory: 'feeding',
    inStock: true,
    discount: 14
  },
  {
    id: 'dog-13',
    name: 'Dog Nail Grinder',
    brand: 'Dremel',
    price: 2199,
    image: 'https://m.media-amazon.com/images/I/71mCMSnAFWL._AC_SL1500_.jpg',
    rating: 4.3,
    reviews: 678,
    category: 'dogs',
    subcategory: 'grooming',
    inStock: true,
    description: 'Quiet, rechargeable nail grinder with LED light'
  },
  {
    id: 'dog-14',
    name: 'Dog GPS Tracker',
    brand: 'Whistle',
    price: 7999,
    image: 'https://m.media-amazon.com/images/I/61PAgHHnmEL._AC_SL1500_.jpg',
    rating: 4.6,
    reviews: 334,
    category: 'dogs',
    subcategory: 'technology',
    inStock: false,
    description: 'Real-time GPS tracking with activity monitoring'
  },
  {
    id: 'dog-15',
    name: 'Calming Dog Bed',
    brand: 'Best Friends',
    price: 2999,
    originalPrice: 3999,
    image: 'https://m.media-amazon.com/images/I/81Cd3gB6kJL._AC_SL1500_.jpg',
    rating: 4.8,
    reviews: 1023,
    category: 'dogs',
    subcategory: 'bedding',
    inStock: true,
    discount: 25
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
  },
  {
    id: 'cat-9',
    name: 'Self-Cleaning Litter Box',
    brand: 'PetSafe',
    price: 12999,
    originalPrice: 14999,
    image: 'https://m.media-amazon.com/images/I/71iIwPSfYQL._AC_SL1500_.jpg',
    rating: 4.5,
    reviews: 456,
    category: 'cats',
    subcategory: 'litter',
    inStock: true,
    discount: 13,
    description: 'Automatic self-cleaning litter box with health tracking'
  },
  {
    id: 'cat-10',
    name: 'Cat Water Fountain',
    brand: 'Catit',
    price: 1999,
    image: 'https://m.media-amazon.com/images/I/71zGfD7lPPL._AC_SL1500_.jpg',
    rating: 4.6,
    reviews: 789,
    category: 'cats',
    subcategory: 'feeding',
    inStock: true,
    description: 'Triple-action filter fountain with LED nightlight'
  },
  {
    id: 'cat-11',
    name: 'Cat Grooming Glove',
    brand: 'DELOMO',
    price: 699,
    originalPrice: 999,
    image: 'https://m.media-amazon.com/images/I/71vT4qnW2TL._AC_SL1500_.jpg',
    rating: 4.4,
    reviews: 1234,
    category: 'cats',
    subcategory: 'grooming',
    inStock: true,
    discount: 30
  },
  {
    id: 'cat-12',
    name: 'Cat Tree Tower - 6ft',
    brand: 'Vesper',
    price: 8999,
    image: 'https://m.media-amazon.com/images/I/71Y2cJLKJSL._AC_SL1500_.jpg',
    rating: 4.8,
    reviews: 234,
    category: 'cats',
    subcategory: 'furniture',
    inStock: true,
    description: 'Modern design cat tree with memory foam cushions'
  },
  {
    id: 'cat-13',
    name: 'Automatic Cat Feeder',
    brand: 'PETLIBRO',
    price: 4999,
    originalPrice: 5999,
    image: 'https://m.media-amazon.com/images/I/71+Y1AH7ZXL._AC_SL1500_.jpg',
    rating: 4.5,
    reviews: 567,
    category: 'cats',
    subcategory: 'feeding',
    inStock: true,
    discount: 17
  },
  {
    id: 'cat-14',
    name: 'Cat Tunnel System',
    brand: 'Prosper Pet',
    price: 1599,
    image: 'https://m.media-amazon.com/images/I/71W5HX9x9VL._AC_SL1500_.jpg',
    rating: 4.7,
    reviews: 445,
    category: 'cats',
    subcategory: 'toys',
    inStock: true,
    description: '3-way collapsible tunnel with peek holes'
  },
  {
    id: 'cat-15',
    name: 'Cat Calming Diffuser',
    brand: 'Feliway',
    price: 2499,
    image: 'https://m.media-amazon.com/images/I/61RXNBGyUDL._AC_SL1500_.jpg',
    rating: 4.3,
    reviews: 892,
    category: 'cats',
    subcategory: 'health',
    inStock: false,
    description: 'Pheromone diffuser to reduce stress and anxiety'
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
  },
  {
    id: 'bird-7',
    name: 'Bird Cage Cover',
    brand: 'Prevue',
    price: 1199,
    originalPrice: 1499,
    image: 'https://m.media-amazon.com/images/I/71HY9rQ3+VL._AC_SL1500_.jpg',
    rating: 4.5,
    reviews: 178,
    category: 'birds',
    subcategory: 'accessories',
    inStock: true,
    discount: 20,
    description: 'Blackout cage cover for better sleep'
  },
  {
    id: 'bird-8',
    name: 'Cockatiel Seed Mix',
    brand: 'Kaytee',
    price: 799,
    image: 'https://m.media-amazon.com/images/I/81QpYSGnDjL._AC_SL1500_.jpg',
    rating: 4.6,
    reviews: 334,
    category: 'birds',
    subcategory: 'food',
    inStock: true,
    description: 'Fortified seed mix specially formulated for cockatiels'
  },
  {
    id: 'bird-9',
    name: 'Bird Perch Set - Natural Wood',
    brand: 'Borangs',
    price: 999,
    image: 'https://m.media-amazon.com/images/I/71K6aXzPoZL._AC_SL1500_.jpg',
    rating: 4.7,
    reviews: 223,
    category: 'birds',
    subcategory: 'accessories',
    inStock: true,
    description: 'Set of 6 natural wood perches of varying sizes'
  },
  {
    id: 'bird-10',
    name: 'Bird Harness & Leash',
    brand: 'Avianweb',
    price: 1599,
    originalPrice: 1999,
    image: 'https://m.media-amazon.com/images/I/61vSQ5Z5xLL._AC_SL1500_.jpg',
    rating: 4.2,
    reviews: 145,
    category: 'birds',
    subcategory: 'accessories',
    inStock: false,
    discount: 20
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
  },
  {
    id: 'other-7',
    name: 'Rabbit Hay Feeder',
    brand: 'Kaytee',
    price: 899,
    image: 'https://m.media-amazon.com/images/I/71TZWogiezL._AC_SL1500_.jpg',
    rating: 4.5,
    reviews: 234,
    category: 'other',
    subcategory: 'accessories',
    inStock: true,
    description: 'Attachable hay feeder reduces waste and mess'
  },
  {
    id: 'other-8',
    name: 'Hamster Ball - Clear',
    brand: 'Kaytee',
    price: 599,
    originalPrice: 799,
    image: 'https://m.media-amazon.com/images/I/71x8cR4aYvL._AC_SL1500_.jpg',
    rating: 4.3,
    reviews: 567,
    category: 'other',
    subcategory: 'toys',
    inStock: true,
    discount: 25
  },
  {
    id: 'other-9',
    name: 'Aquarium LED Light',
    brand: 'Nicrew',
    price: 3299,
    image: 'https://m.media-amazon.com/images/I/71K0cg8JKQL._AC_SL1500_.jpg',
    rating: 4.7,
    reviews: 892,
    category: 'other',
    subcategory: 'aquarium',
    inStock: true,
    description: 'Full spectrum LED light for planted aquariums'
  },
  {
    id: 'other-10',
    name: 'Guinea Pig Vitamin C Drops',
    brand: 'Oxbow',
    price: 799,
    image: 'https://m.media-amazon.com/images/I/71wVUeD5z2L._AC_SL1500_.jpg',
    rating: 4.8,
    reviews: 345,
    category: 'other',
    subcategory: 'supplements',
    inStock: true,
    description: 'Essential vitamin C supplement for guinea pigs'
  },
  {
    id: 'other-11',
    name: 'Reptile Heat Lamp',
    brand: 'Zoo Med',
    price: 1499,
    originalPrice: 1899,
    image: 'https://m.media-amazon.com/images/I/71-gAPTx2RL._AC_SL1500_.jpg',
    rating: 4.6,
    reviews: 223,
    category: 'other',
    subcategory: 'heating',
    inStock: true,
    discount: 21
  },
  {
    id: 'other-12',
    name: 'Small Animal Carrier',
    brand: 'Living World',
    price: 1299,
    image: 'https://m.media-amazon.com/images/I/71PckMV9oGL._AC_SL1500_.jpg',
    rating: 4.4,
    reviews: 445,
    category: 'other',
    subcategory: 'travel',
    inStock: false,
    description: 'Portable carrier for small animals with feeding door'
  }
];

export const vetDietProducts: Product[] = [
  {
    id: 'vetdiet-1',
    name: 'Prescription Joint Care - Canine',
    brand: 'Hill\'s Prescription Diet',
    price: 4599,
    originalPrice: 5299,
    image: 'https://m.media-amazon.com/images/I/81vZPevj4gL._AC_SL1500_.jpg',
    rating: 4.8,
    reviews: 234,
    category: 'vetdiet',
    subcategory: 'joint-care',
    inStock: true,
    discount: 13,
    description: 'Clinically proven nutrition to improve mobility in 30 days. Contains EPA, glucosamine, and chondroitin for joint support.'
  },
  {
    id: 'vetdiet-2',
    name: 'Cardiac Care Formula - Dogs',
    brand: 'Royal Canin Veterinary',
    price: 5299,
    image: 'https://m.media-amazon.com/images/I/71kGjW2YxTL._AC_SL1500_.jpg',
    rating: 4.7,
    reviews: 156,
    category: 'vetdiet',
    subcategory: 'heart-health',
    inStock: true,
    description: 'Supports cardiac function with restricted sodium, added taurine, L-carnitine, and antioxidants.'
  },
  {
    id: 'vetdiet-3',
    name: 'Gastrointestinal Low Fat - Canine',
    brand: 'Purina Pro Plan Veterinary',
    price: 3999,
    originalPrice: 4499,
    image: 'https://m.media-amazon.com/images/I/71sDQmG8KSL._AC_SL1500_.jpg',
    rating: 4.6,
    reviews: 389,
    category: 'vetdiet',
    subcategory: 'digestive-care',
    inStock: true,
    discount: 11,
    description: 'Highly digestible formula for dogs with GI disorders. Low fat content with prebiotic fiber.'
  },
  {
    id: 'vetdiet-4',
    name: 'Kidney Support - Feline',
    brand: 'Hill\'s Prescription Diet',
    price: 4199,
    image: 'https://m.media-amazon.com/images/I/81Z3fXkb5RL._AC_SL1500_.jpg',
    rating: 4.9,
    reviews: 567,
    category: 'vetdiet',
    subcategory: 'kidney-care',
    inStock: true,
    description: 'Clinically tested nutrition to improve and lengthen quality of life for cats with kidney disease.'
  },
  {
    id: 'vetdiet-5',
    name: 'Weight Management - Dogs',
    brand: 'Royal Canin Veterinary',
    price: 3799,
    originalPrice: 4299,
    image: 'https://m.media-amazon.com/images/I/71Y8KQZVUBL._AC_SL1500_.jpg',
    rating: 4.5,
    reviews: 432,
    category: 'vetdiet',
    subcategory: 'weight-management',
    inStock: true,
    discount: 12,
    description: 'High protein, low calorie diet to promote healthy weight loss while maintaining muscle mass.'
  },
  {
    id: 'vetdiet-6',
    name: 'Hypoallergenic Formula - Dogs',
    brand: 'Purina Pro Plan Veterinary',
    price: 5699,
    image: 'https://m.media-amazon.com/images/I/71w+nxKYnYL._AC_SL1500_.jpg',
    rating: 4.7,
    reviews: 298,
    category: 'vetdiet',
    subcategory: 'skin-allergy',
    inStock: false,
    description: 'Hydrolyzed protein formula for dogs with food sensitivities. Helps reduce skin and GI reactions.'
  },
  {
    id: 'vetdiet-7',
    name: 'Diabetic Management - Feline',
    brand: 'Hill\'s Prescription Diet',
    price: 4899,
    originalPrice: 5499,
    image: 'https://m.media-amazon.com/images/I/81kGBxgQi1L._AC_SL1500_.jpg',
    rating: 4.8,
    reviews: 189,
    category: 'vetdiet',
    subcategory: 'diabetes-care',
    inStock: true,
    discount: 11,
    description: 'Clinically proven to reduce insulin requirements. High protein, low carbohydrate formula.'
  },
  {
    id: 'vetdiet-8',
    name: 'Senior Care 7+ Formula',
    brand: 'Royal Canin Veterinary',
    price: 3599,
    image: 'https://m.media-amazon.com/images/I/71TsIvb8rML._AC_SL1500_.jpg',
    rating: 4.6,
    reviews: 523,
    category: 'vetdiet',
    subcategory: 'senior-care',
    inStock: true,
    description: 'Complete nutrition for aging pets with antioxidants, joint support, and kidney protection.'
  },
  {
    id: 'vetdiet-9',
    name: 'Urinary SO - Canine',
    brand: 'Royal Canin Veterinary',
    price: 4399,
    image: 'https://m.media-amazon.com/images/I/71RfAJXaKyL._AC_SL1500_.jpg',
    rating: 4.7,
    reviews: 345,
    category: 'vetdiet',
    subcategory: 'urinary-care',
    inStock: true,
    description: 'Dissolves struvite stones and helps prevent calcium oxalate stones. Promotes urinary health.'
  },
  {
    id: 'vetdiet-10',
    name: 'Recovery Support - Dogs & Cats',
    brand: 'Hill\'s Prescription Diet',
    price: 2999,
    originalPrice: 3499,
    image: 'https://m.media-amazon.com/images/I/71vHnfhNzJL._AC_SL1500_.jpg',
    rating: 4.9,
    reviews: 678,
    category: 'vetdiet',
    subcategory: 'recovery-care',
    inStock: true,
    discount: 14,
    description: 'High calorie, nutrient-dense formula for pets recovering from illness, surgery, or injury.'
  }
];

export const getDogFilters = () => [
  {
    title: 'Category',
    type: 'checkbox' as const,
    options: [
      { label: 'Food', value: 'food', count: 3 },
      { label: 'Toys', value: 'toys', count: 1 },
      { label: 'Bedding', value: 'bedding', count: 2 },
      { label: 'Grooming', value: 'grooming', count: 2 },
      { label: 'Accessories', value: 'accessories', count: 2 },
      { label: 'Treats', value: 'treats', count: 1 },
      { label: 'Training', value: 'training', count: 1 },
      { label: 'Clothing', value: 'clothing', count: 1 },
      { label: 'Travel', value: 'travel', count: 1 },
      { label: 'Feeding', value: 'feeding', count: 1 },
      { label: 'Technology', value: 'technology', count: 1 }
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
      { label: 'Litter', value: 'litter', count: 2 },
      { label: 'Toys', value: 'toys', count: 2 },
      { label: 'Furniture', value: 'furniture', count: 3 },
      { label: 'Accessories', value: 'accessories', count: 1 },
      { label: 'Treats', value: 'treats', count: 1 },
      { label: 'Feeding', value: 'feeding', count: 2 },
      { label: 'Grooming', value: 'grooming', count: 1 },
      { label: 'Health', value: 'health', count: 1 }
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
      { label: 'Food', value: 'food', count: 3 },
      { label: 'Cages', value: 'cages', count: 1 },
      { label: 'Toys', value: 'toys', count: 1 },
      { label: 'Supplements', value: 'supplements', count: 1 },
      { label: 'Accessories', value: 'accessories', count: 4 }
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
      { label: 'Food', value: 'food', count: 2 },
      { label: 'Toys', value: 'toys', count: 2 },
      { label: 'Aquarium', value: 'aquarium', count: 2 },
      { label: 'Accessories', value: 'accessories', count: 2 },
      { label: 'Bedding', value: 'bedding', count: 1 },
      { label: 'Supplements', value: 'supplements', count: 1 },
      { label: 'Heating', value: 'heating', count: 1 },
      { label: 'Travel', value: 'travel', count: 1 }
    ]
  }
];

export const getVetDietFilters = () => [
  {
    title: 'Condition Type',
    type: 'checkbox' as const,
    options: [
      { label: 'Joint Care', value: 'joint-care', count: 1 },
      { label: 'Heart Health', value: 'heart-health', count: 1 },
      { label: 'Digestive Care', value: 'digestive-care', count: 1 },
      { label: 'Kidney Care', value: 'kidney-care', count: 1 },
      { label: 'Weight Management', value: 'weight-management', count: 1 },
      { label: 'Skin & Allergy', value: 'skin-allergy', count: 1 },
      { label: 'Diabetes Care', value: 'diabetes-care', count: 1 },
      { label: 'Senior Care', value: 'senior-care', count: 1 },
      { label: 'Urinary Care', value: 'urinary-care', count: 1 },
      { label: 'Recovery Care', value: 'recovery-care', count: 1 }
    ]
  },
  {
    title: 'Brand',
    type: 'checkbox' as const,
    options: [
      { label: 'Hill\'s Prescription Diet', value: 'Hill\'s Prescription Diet' },
      { label: 'Royal Canin Veterinary', value: 'Royal Canin Veterinary' },
      { label: 'Purina Pro Plan Veterinary', value: 'Purina Pro Plan Veterinary' }
    ]
  },
  {
    title: 'Pet Type',
    type: 'checkbox' as const,
    options: [
      { label: 'Dogs', value: 'canine' },
      { label: 'Cats', value: 'feline' },
      { label: 'Both', value: 'both' }
    ]
  },
  {
    title: 'Price Range',
    type: 'checkbox' as const,
    options: [
      { label: 'Under Rs.3000', value: '0-3000' },
      { label: 'Rs.3000 - Rs.4500', value: '3000-4500' },
      { label: 'Rs.4500 - Rs.6000', value: '4500-6000' },
      { label: 'Above Rs.6000', value: '6000+' }
    ]
  }
];

// Aggregate all products
export const products: Product[] = [
  ...dogProducts,
  ...catProducts,
  ...birdProducts,
  ...otherAnimalsProducts,
  ...vetDietProducts
];
