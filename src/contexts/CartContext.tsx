import React, { createContext, useState, useCallback, useEffect } from 'react';
import { Product, ShippingBreakdown } from '../types';
import { productsService } from '../services/products.service';
import { cartService, BackendCartResponse } from '../services/cart.service';
import { useAuth } from '../hooks/useAuth';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  weight?: string;
  total_weight?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  subtotal?: string;
}

interface CartContextType {
  cart: CartItem[];
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  totalWeight: number;
  weightUnit: string;
  shippingCost: number;
  shippingBreakdown: ShippingBreakdown | null;
  taxAmount: number;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [shippingBreakdown, setShippingBreakdown] = useState<ShippingBreakdown | null>(null);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Helper: Convert backend cart response to local cart items
  const convertBackendCart = useCallback((backendCart: BackendCartResponse): CartItem[] => {
    if (!backendCart || !backendCart.items || !Array.isArray(backendCart.items)) {
      console.warn('[CartContext] Backend cart has no items array:', backendCart);
      return [];
    }
    return backendCart.items.map(item => cartService.convertToCartItem(item));
  }, []);

  // Helper: Load cart from localStorage (for guest users)
  const loadLocalCart = useCallback((): CartItem[] => {
    try {
      const savedCart = localStorage.getItem('cart');
      console.log('[CartContext] Loading cart from localStorage');

      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          console.log('[CartContext] ✅ Local cart loaded with', parsed.length, 'items');
          return parsed;
        }
      }
    } catch (error) {
      console.error('[CartContext] Failed to load local cart:', error);
      localStorage.removeItem('cart');
    }
    return [];
  }, []);

  // Helper: Save cart to localStorage
  const saveLocalCart = useCallback((cartItems: CartItem[]) => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('[CartContext] Failed to save local cart:', error);
    }
  }, []);

  // Helper: Calculate local shipping cost (fallback for guest users)
  const calculateLocalShipping = useCallback((weight: number): number => {
    if (weight < 1) return 350;
    if (weight <= 5) return 500;
    return 700;
  }, []);

  // Fetch cart from backend
  const fetchBackendCart = useCallback(async () => {
    if (!isAuthenticated || !user) {
      console.log('[CartContext] User not authenticated, skipping backend cart fetch');
      return;
    }

    setIsLoading(true);
    try {
      const backendCart = await cartService.getCart();

      if (backendCart) {
        const items = convertBackendCart(backendCart);
        setCart(items);
        setShippingCost(parseFloat(backendCart.shipping_cost));
        setShippingBreakdown(backendCart.shipping_breakdown);
        setTaxAmount(parseFloat(backendCart.tax_amount));
        console.log('[CartContext] ✅ Backend cart loaded:', backendCart);
      } else {
        console.log('[CartContext] No backend cart found');
        setCart([]);
        setShippingCost(0);
        setShippingBreakdown(null);
        setTaxAmount(0);
      }
    } catch (error) {
      console.error('[CartContext] Failed to fetch backend cart:', error);
      // Fall back to local cart
      const localCart = loadLocalCart();
      setCart(localCart);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, convertBackendCart, loadLocalCart]);

  // Initialize cart on mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchBackendCart();
    } else {
      // Load from localStorage for guest users
      const localCart = loadLocalCart();
      setCart(localCart);
    }
  }, [isAuthenticated, fetchBackendCart, loadLocalCart]);

  // Save to localStorage for guest users
  useEffect(() => {
    if (!isAuthenticated) {
      saveLocalCart(cart);

      // Calculate local shipping for guest users
      const weight = cart.reduce((sum, item) => {
        const itemWeight = parseFloat(item.product.weight || '0');
        return sum + (itemWeight * item.quantity);
      }, 0);
      setShippingCost(calculateLocalShipping(weight));
    }
  }, [cart, isAuthenticated, saveLocalCart, calculateLocalShipping]);

  // Refresh cart items with latest product data (for guest users)
  useEffect(() => {
    const refreshCartItems = async () => {
      if (isAuthenticated || cart.length === 0) return;

      console.log('[CartContext] Refreshing guest cart with latest product data...');

      try {
        const refreshedCart = await Promise.all(
          cart.map(async (item) => {
            const freshProduct = await productsService.getProductById(item.product.id);

            if (freshProduct) {
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

        const hasChanges = refreshedCart.some((item, index) => {
          const oldItem = cart[index];
          return item.product.weight !== oldItem.product.weight ||
                 JSON.stringify(item.product.dimensions) !== JSON.stringify(oldItem.product.dimensions);
        });

        if (hasChanges) {
          console.log('[CartContext] ✅ Guest cart refreshed with weight/dimensions');
          setCart(refreshedCart);
        }
      } catch (error) {
        console.error('[CartContext] Failed to refresh cart items:', error);
      }
    };

    refreshCartItems();
  }, [isAuthenticated]); // Only run when auth status changes

  // Add item to cart
  const addItem = useCallback(async (product: Product, quantity: number = 1) => {
    if (quantity < 1 || quantity > 99) {
      console.warn('[CartContext] Invalid quantity: must be between 1 and 99');
      return;
    }

    if (isAuthenticated && product.id) {
      // Use backend API
      try {
        setIsLoading(true);
        // Assuming product has a slug field, or use id as fallback
        const productSlug = (product as any).slug || product.id;
        console.log('[CartContext] Adding to backend cart:', { productSlug, quantity, product });
        const backendCart = await cartService.addItem(productSlug, quantity);

        const items = convertBackendCart(backendCart);
        setCart(items);
        setShippingCost(parseFloat(backendCart.shipping_cost));
        setShippingBreakdown(backendCart.shipping_breakdown);
        setTaxAmount(parseFloat(backendCart.tax_amount));
        console.log('[CartContext] ✅ Item added to backend cart successfully');
      } catch (error: any) {
        console.warn('[CartContext] Backend cart add failed, using local cart instead');
        console.warn('[CartContext] Error details:', error.message);
        console.warn('[CartContext] Product being added:', {
          id: product.id,
          name: product.name,
          weight: product.weight,
          dimensions: product.dimensions
        });
        // Fall back to local cart
        addToLocalCart(product, quantity);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Guest user: use local cart
      console.log('[CartContext] Using local cart (guest user or no auth)');
      addToLocalCart(product, quantity);
    }
  }, [isAuthenticated, convertBackendCart]);

  const addToLocalCart = (product: Product, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);

      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, 99);
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      return [...prevCart, { id: product.id, product, quantity }];
    });
  };

  // Remove item from cart
  const removeItem = useCallback(async (id: string) => {
    if (isAuthenticated) {
      // Use backend API
      try {
        setIsLoading(true);
        const backendCart = await cartService.removeItem(id);

        const items = convertBackendCart(backendCart);
        setCart(items);
        setShippingCost(parseFloat(backendCart.shipping_cost));
        setShippingBreakdown(backendCart.shipping_breakdown);
        setTaxAmount(parseFloat(backendCart.tax_amount));
      } catch (error) {
        console.error('[CartContext] Failed to remove item via backend:', error);
        // Fall back to local removal
        setCart(prevCart => prevCart.filter(item => item.id !== id));
      } finally {
        setIsLoading(false);
      }
    } else {
      // Guest user: use local cart
      setCart(prevCart => prevCart.filter(item => item.id !== id));
    }
  }, [isAuthenticated, convertBackendCart]);

  // Update item quantity
  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    if (quantity < 0) {
      console.warn('[CartContext] Invalid quantity: cannot be negative');
      return;
    }

    if (quantity > 99) {
      console.warn('[CartContext] Invalid quantity: maximum is 99');
      return;
    }

    if (quantity === 0) {
      await removeItem(id);
      return;
    }

    if (isAuthenticated) {
      // Use backend API
      try {
        setIsLoading(true);
        const backendCart = await cartService.updateItemQuantity(id, quantity);

        const items = convertBackendCart(backendCart);
        setCart(items);
        setShippingCost(parseFloat(backendCart.shipping_cost));
        setShippingBreakdown(backendCart.shipping_breakdown);
        setTaxAmount(parseFloat(backendCart.tax_amount));
      } catch (error) {
        console.error('[CartContext] Failed to update quantity via backend:', error);
        // Fall back to local update
        setCart(prevCart =>
          prevCart.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      // Guest user: use local cart
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  }, [isAuthenticated, removeItem, convertBackendCart]);

  // Clear cart
  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      // Use backend API
      try {
        setIsLoading(true);
        await cartService.clearCart();
        setCart([]);
        setShippingCost(0);
        setShippingBreakdown(null);
        setTaxAmount(0);
      } catch (error) {
        console.error('[CartContext] Failed to clear cart via backend:', error);
        // Fall back to local clear
        setCart([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Guest user: use local cart
      setCart([]);
    }
  }, [isAuthenticated]);

  // Refresh cart
  const refreshCart = useCallback(async () => {
    if (isAuthenticated) {
      await fetchBackendCart();
    }
  }, [isAuthenticated, fetchBackendCart]);

  // Calculate totals
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
    weightUnit: 'kg',
    shippingCost,
    shippingBreakdown,
    taxAmount,
    isLoading,
    refreshCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
