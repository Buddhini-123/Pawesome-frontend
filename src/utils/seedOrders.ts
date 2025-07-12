import { mockDb } from '../services/mockDb';
import { Order, OrderStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

const paymentMethods = ['card', 'upi', 'cod', 'netbanking'] as const;
const orderStatuses: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const sampleCustomers = [
  { name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91 9876543210', city: 'Mumbai' },
  { name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 9876543211', city: 'Delhi' },
  { name: 'Amit Patel', email: 'amit@example.com', phone: '+91 9876543212', city: 'Bangalore' },
  { name: 'Sunita Reddy', email: 'sunita@example.com', phone: '+91 9876543213', city: 'Hyderabad' },
  { name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 9876543214', city: 'Chennai' },
  { name: 'Neha Gupta', email: 'neha@example.com', phone: '+91 9876543215', city: 'Pune' },
  { name: 'Arjun Nair', email: 'arjun@example.com', phone: '+91 9876543216', city: 'Kochi' },
  { name: 'Pooja Verma', email: 'pooja@example.com', phone: '+91 9876543217', city: 'Jaipur' }
];

const sampleProducts = [
  { id: 'prod1', name: 'Royal Canin Adult Dog Food', price: 2500, image: '/api/placeholder/100/100' },
  { id: 'prod2', name: 'Whiskas Cat Food - Tuna', price: 300, image: '/api/placeholder/100/100' },
  { id: 'prod3', name: 'Premium Dog Leash', price: 200, image: '/api/placeholder/100/100' },
  { id: 'prod4', name: 'Bird Seed Mix', price: 100, image: '/api/placeholder/100/100' },
  { id: 'prod5', name: 'Cat Litter Box', price: 1500, image: '/api/placeholder/100/100' },
  { id: 'prod6', name: 'Dog Grooming Kit', price: 800, image: '/api/placeholder/100/100' },
  { id: 'prod7', name: 'Hamster Wheel', price: 500, image: '/api/placeholder/100/100' },
  { id: 'prod8', name: 'Aquarium Filter', price: 1200, image: '/api/placeholder/100/100' }
];

export const seedSampleOrders = async (count: number = 20) => {
  const orders: Order[] = [];
  
  // Create orders spread over the last 30 days
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const customer = sampleCustomers[Math.floor(Math.random() * sampleCustomers.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - daysAgo);
    
    // Random number of items (1-5)
    const itemCount = Math.floor(Math.random() * 5) + 1;
    const items = [];
    let subtotal = 0;
    
    for (let j = 0; j < itemCount; j++) {
      const product = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      items.push({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        price: product.price,
        quantity: quantity,
        total: product.price * quantity
      });
      subtotal += product.price * quantity;
    }
    
    // Calculate shipping (free above 2000)
    const shippingCost = subtotal > 2000 ? 0 : 150;
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const totalAmount = subtotal + shippingCost + tax;
    
    // Random status (weighted towards completed orders)
    const statusWeights = [5, 10, 15, 20, 40, 10]; // pending, confirmed, processing, shipped, delivered, cancelled
    const totalWeight = statusWeights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    let status: OrderStatus = 'pending';
    
    for (let k = 0; k < statusWeights.length; k++) {
      random -= statusWeights[k];
      if (random <= 0) {
        status = orderStatuses[k];
        break;
      }
    }
    
    // Payment status based on order status
    const paymentStatus = status === 'cancelled' ? 'failed' : 
                         status === 'pending' ? 'pending' : 'completed';
    
    const order: Order = {
      id: uuidv4(),
      userId: 'demo-user-' + (i % 5 + 1), // Distribute among 5 demo users
      userEmail: customer.email,
      items: items,
      shippingAddress: {
        id: uuidv4(),
        type: 'home',
        fullName: customer.name,
        phone: customer.phone,
        address: `${Math.floor(Math.random() * 999) + 1} Main Street, Sector ${Math.floor(Math.random() * 50) + 1}`,
        city: customer.city,
        state: 'Maharashtra',
        pincode: `${400000 + Math.floor(Math.random() * 99)}`,
        country: 'India',
        isDefault: true
      },
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      paymentStatus: paymentStatus,
      orderStatus: status,
      status: status,
      subtotal: subtotal,
      shippingCost: shippingCost,
      shipping: shippingCost,
      tax: tax,
      totalAmount: totalAmount,
      total: totalAmount,
      createdAt: createdAt,
      updatedAt: new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000), // Random time after creation
      trackingNumber: status === 'shipped' || status === 'delivered' ? `TRACK${Math.floor(Math.random() * 999999) + 100000}` : undefined
    };
    
    orders.push(order);
  }
  
  // Save orders to mockDb
  let successCount = 0;
  for (const order of orders) {
    try {
      await mockDb.createOrder(order);
      successCount++;
    } catch (error) {
      console.error('Error creating order:', error);
    }
  }
  
  console.log(`Successfully created ${successCount} sample orders`);
  return orders;
};