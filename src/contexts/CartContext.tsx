import React, { createContext, useState, useCallback, useEffect } from 'react';
import { Product } from '../types';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initial mount with error handling
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        // Validate parsed data is an array
        if (Array.isArray(parsed)) {
          return parsed;
        }
        console.warn('Invalid cart data in localStorage, expected array');
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      // Clear corrupted data
      try {
        localStorage.removeItem('cart');
      } catch (e) {
        console.error('Failed to clear corrupted cart data:', e);
      }
    }
    return [];
  });

  // Save cart to localStorage whenever it changes with error handling
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
      // Handle quota exceeded or other localStorage errors
    }
  }, [cart]);

  const addItem = useCallback((product: Product, quantity: number = 1) => {
    // Validate quantity range
    if (quantity < 1 || quantity > 99) {
      console.warn('Invalid quantity: must be between 1 and 99');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);

      if (existingItem) {
        // Check total quantity won't exceed limit
        const newQuantity = Math.min(existingItem.quantity + quantity, 99);

        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      return [...prevCart, { id: product.id, product, quantity }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    // Validate quantity range
    if (quantity < 0) {
      console.warn('Invalid quantity: cannot be negative');
      return;
    }

    if (quantity > 99) {
      console.warn('Invalid quantity: maximum is 99');
      return;
    }

    // Remove item if quantity is 0
    if (quantity === 0) {
      removeItem(id);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const value: CartContextType = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};