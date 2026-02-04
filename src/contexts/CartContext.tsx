import React, { createContext, useState, useCallback, useEffect } from 'react';
import { Product } from '../types';
import { productsService } from '../services/products.service';

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
  totalWeight: number;
  weightUnit: string;
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
      console.log('[CartContext] Loading cart from localStorage:', savedCart);

      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        console.log('[CartContext] Parsed cart data:', parsed);
        console.log('[CartContext] Is array?', Array.isArray(parsed));
        console.log('[CartContext] Cart length:', parsed?.length);

        // Validate parsed data is an array
        if (Array.isArray(parsed)) {
          console.log('[CartContext] ✅ Cart loaded successfully with', parsed.length, 'items');
          return parsed;
        }
        console.warn('[CartContext] ⚠️ Invalid cart data in localStorage, expected array but got:', typeof parsed);
      } else {
        console.log('[CartContext] No saved cart found in localStorage');
      }
    } catch (error) {
      console.error('[CartContext] ❌ Failed to load cart from localStorage:', error);
      // Clear corrupted data
      try {
        localStorage.removeItem('cart');
      } catch (e) {
        console.error('[CartContext] Failed to clear corrupted cart data:', e);
      }
    }
    console.log('[CartContext] Returning empty cart');
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

  // Refresh cart items with latest product data on mount (to get weight/dimensions)
  useEffect(() => {
    const refreshCartItems = async () => {
      if (cart.length === 0) return;

      console.log('[CartContext] Refreshing cart items with latest product data...');

      try {
        const refreshedCart = await Promise.all(
          cart.map(async (item) => {
            const freshProduct = await productsService.getProductById(item.product.id);

            if (freshProduct) {
              // Merge fresh product data with existing cart item
              return {
                ...item,
                product: {
                  ...item.product,
                  weight: freshProduct.weight,
                  dimensions: freshProduct.dimensions
                }
              };
            }

            return item;
          })
        );

        // Check if any items were updated
        const hasChanges = refreshedCart.some((item, index) => {
          const oldItem = cart[index];
          return item.product.weight !== oldItem.product.weight ||
                 JSON.stringify(item.product.dimensions) !== JSON.stringify(oldItem.product.dimensions);
        });

        if (hasChanges) {
          console.log('[CartContext] ✅ Cart items refreshed with weight/dimensions');
          setCart(refreshedCart);
        } else {
          console.log('[CartContext] Cart items already up to date');
        }
      } catch (error) {
        console.error('[CartContext] Failed to refresh cart items:', error);
      }
    };

    refreshCartItems();
  }, []); // Only run on mount

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
  const totalWeight = cart.reduce((sum, item) => {
    const weight = parseFloat(item.product.weight || '0');
    return sum + (weight * item.quantity);
  }, 0);

  const value: CartContextType = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    totalWeight,
    weightUnit: 'kg'
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};