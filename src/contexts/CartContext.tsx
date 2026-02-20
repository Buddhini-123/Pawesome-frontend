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
  // Variant-related fields
  weight_source?: 'variant' | 'product';
  variant_label?: string;
  // Order-history snapshots
  weight_snapshot?: string;
  dimensions_snapshot?: string;
  product_name_snapshot?: string;
  // Deal item fields
  is_deal_item?: boolean;
  deal?: import('../types').CartDeal;
  deal_metadata?: any;
  product_snapshot?: {
    name: string;
    slug?: string;
    description?: string;
    image?: string | null;
    type?: string;
  };
  // Gift box metadata
  metadata?: {
    gift_box_group?: string;
    is_gift_item?: boolean;
    recipient_name?: string;
    gift_message?: string;
  };
}

interface CartContextType {
  cart: CartItem[];
  addItem: (product: Product, quantity?: number, variantId?: number) => Promise<void>;
  addDeal: (dealSlug: string) => Promise<void>;
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

  // Check localStorage on component mount
  console.log('[CartContext] Component mounting. Checking localStorage...');
  const storedCart = localStorage.getItem('cart');
  console.log('[CartContext] localStorage "cart" value:', storedCart);
  console.log('[CartContext] isAuthenticated on mount:', isAuthenticated);

  const [cart, setCartState] = useState<CartItem[]>([]);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [shippingBreakdown, setShippingBreakdown] = useState<ShippingBreakdown | null>(null);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Wrapper to log all cart state changes
  const setCart = useCallback((value: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
    console.log('[CartContext] setCart called with:', typeof value === 'function' ? 'function' : value);
    console.trace('[CartContext] setCart call stack');
    setCartState(value);
  }, []);

  // Helper: Convert backend cart response to local cart items
  const convertBackendCart = useCallback((backendCart: BackendCartResponse): CartItem[] => {
    if (!backendCart || !backendCart.items || !Array.isArray(backendCart.items)) {
      console.warn('[CartContext] Backend cart has no items array:', backendCart);
      return [];
    }
    return backendCart.items.map(item => cartService.convertToCartItem(item));
  }, []);

  // Helper: Load original prices from localStorage
  const loadOriginalPrices = useCallback((): Record<string, number> => {
    try {
      const saved = localStorage.getItem('cart_original_prices');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('[CartContext] Failed to load original prices:', error);
    }
    return {};
  }, []);

  // Helper: Save original prices to localStorage
  const saveOriginalPrices = useCallback((prices: Record<string, number>) => {
    try {
      localStorage.setItem('cart_original_prices', JSON.stringify(prices));
    } catch (error) {
      console.error('[CartContext] Failed to save original prices:', error);
    }
  }, []);

  // Helper: Load cart from localStorage (for guest users)
  const loadLocalCart = useCallback((): CartItem[] => {
    try {
      const savedCart = localStorage.getItem('cart');
      console.log('[CartContext] loadLocalCart called');
      console.log('[CartContext] localStorage raw value:', savedCart);

      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        console.log('[CartContext] Parsed cart:', parsed);
        if (Array.isArray(parsed)) {
          console.log('[CartContext] ✅ Local cart loaded with', parsed.length, 'items');
          console.log('[CartContext] Cart items:', parsed);
          return parsed;
        } else {
          console.warn('[CartContext] Parsed cart is not an array:', typeof parsed);
        }
      } else {
        console.log('[CartContext] No cart found in localStorage');
      }
    } catch (error) {
      console.error('[CartContext] Failed to load local cart:', error);
      localStorage.removeItem('cart');
    }
    console.log('[CartContext] Returning empty cart');
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

    console.log('[CartContext] Fetching cart from backend for user:', user.id);
    setIsLoading(true);
    try {
      const backendCart = await cartService.getCart();
      console.log('[CartContext] Backend cart response:', backendCart);

      if (backendCart && backendCart.items && backendCart.items.length > 0) {
        const items = convertBackendCart(backendCart);
        console.log('[CartContext] Converted backend items:', items);

        // Merge original prices from localStorage
        const originalPrices = loadOriginalPrices();
        const itemsWithPrices = items.map(item => {
          const originalPrice = originalPrices[item.product.id];
          if (originalPrice && originalPrice > item.product.price) {
            return {
              ...item,
              product: {
                ...item.product,
                originalPrice
              }
            };
          }
          return item;
        });

        setCart(itemsWithPrices);
        setShippingCost(parseFloat(backendCart.shipping_cost));
        setShippingBreakdown(backendCart.shipping_breakdown);
        setTaxAmount(parseFloat(backendCart.tax_amount));
        console.log('[CartContext] ✅ Backend cart loaded with', itemsWithPrices.length, 'items');
      } else {
        console.warn('[CartContext] Backend returned empty cart or no items');
        console.log('[CartContext] Falling back to localStorage backup for authenticated user');

        // FALLBACK: Try loading from localStorage backup for authenticated users
        const localBackup = loadLocalCart();
        if (localBackup.length > 0) {
          console.log('[CartContext] Found localStorage backup with', localBackup.length, 'items');
          setCart(localBackup);
        } else {
          console.log('[CartContext] No backup found, cart is empty');
          setCart([]);
        }
        setShippingCost(0);
        setShippingBreakdown(null);
        setTaxAmount(0);
      }
    } catch (error) {
      console.error('[CartContext] Failed to fetch backend cart:', error);
      // Fall back to local cart
      const localCart = loadLocalCart();
      console.log('[CartContext] Error fallback: loaded', localCart.length, 'items from localStorage');
      setCart(localCart);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, convertBackendCart, loadLocalCart, loadOriginalPrices]);

  // Initialize cart on mount and when authentication changes
  useEffect(() => {
    console.log('[CartContext] Init effect running. isAuthenticated:', isAuthenticated);

    const initCart = async () => {
      if (isAuthenticated) {
        console.log('[CartContext] User is authenticated, fetching backend cart');
        await fetchBackendCart();
      } else {
        console.log('[CartContext] User is NOT authenticated, loading from localStorage');
        // Load from localStorage for guest users
        const localCart = loadLocalCart();
        console.log('[CartContext] Setting cart with', localCart.length, 'items');
        setCart(localCart);
      }
      console.log('[CartContext] Setting isInitialized to true');
      setIsInitialized(true);
    };

    initCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // Only run when auth status changes, not when functions change

  // Save to localStorage for guest users
  useEffect(() => {
    // Only save after cart has been initialized to prevent clearing localStorage on mount
    if (!isAuthenticated && isInitialized) {
      console.log('[CartContext] Saving cart to localStorage:', cart.length, 'items');
      saveLocalCart(cart);

      // Calculate local shipping for guest users
      const weight = cart.reduce((sum, item) => {
        const itemWeight = parseFloat(item.product.weight || '0');
        return sum + (itemWeight * item.quantity);
      }, 0);
      setShippingCost(calculateLocalShipping(weight));
    }
  }, [cart, isAuthenticated, isInitialized, saveLocalCart, calculateLocalShipping]);

  // Note: Removed cart refresh effect to prevent stale closure bugs
  // Product weight/dimensions should be fetched when adding to cart

  // Add item to cart
  const addItem = useCallback(async (product: Product, quantity: number = 1, variantId?: number) => {
    console.log('[CartContext] addItem called with:', {
      productId: product.id,
      productName: product.name,
      quantity,
      variantId,
      isAuthenticated,
      hasSlug: !!(product as any).slug
    });

    if (quantity < 1 || quantity > 99) {
      console.warn('[CartContext] Invalid quantity: must be between 1 and 99');
      return;
    }

    // Save originalPrice if present
    if ((product as any).originalPrice) {
      const originalPrices = loadOriginalPrices();
      originalPrices[product.id] = (product as any).originalPrice;
      saveOriginalPrices(originalPrices);
      console.log('[CartContext] Saved originalPrice for product', product.id, ':', (product as any).originalPrice);
    }

    console.log('[CartContext] Checking if should use backend API:', {
      isAuthenticated,
      hasProductId: !!product.id
    });

    if (isAuthenticated && product.id) {
      // Use backend API
      try {
        setIsLoading(true);
        // Assuming product has a slug field, or use id as fallback
        const productSlug = (product as any).slug || product.id;
        console.log('[CartContext] Adding to backend cart:', {
          productSlug,
          productId: product.id,
          productName: product.name,
          hasSlug: !!(product as any).slug,
          quantity,
        });
        const backendCart = await cartService.addItem(productSlug, quantity, variantId);

        const items = convertBackendCart(backendCart);

        // Merge original prices from localStorage
        const originalPrices = loadOriginalPrices();
        const itemsWithPrices = items.map(item => {
          const originalPrice = originalPrices[item.product.id];
          if (originalPrice && originalPrice > item.product.price) {
            return {
              ...item,
              product: {
                ...item.product,
                originalPrice
              }
            };
          }
          return item;
        });

        setCart(itemsWithPrices);
        setShippingCost(parseFloat(backendCart.shipping_cost));
        setShippingBreakdown(backendCart.shipping_breakdown);
        setTaxAmount(parseFloat(backendCart.tax_amount));

        // BACKUP: Also save to localStorage for authenticated users as fallback
        console.log('[CartContext] Saving backup to localStorage for authenticated user');
        saveLocalCart(itemsWithPrices);

        console.log('[CartContext] ✅ Item added to backend cart successfully with original prices merged');
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
  }, [isAuthenticated, convertBackendCart, loadOriginalPrices, saveOriginalPrices]);

  // Add a deal to cart (authenticated only — deals require backend)
  const addDeal = useCallback(async (dealSlug: string) => {
    if (!isAuthenticated) {
      throw new Error('Please log in to add deals to your cart');
    }
    try {
      setIsLoading(true);
      const backendCart = await cartService.addDeal(dealSlug);
      const items = convertBackendCart(backendCart);
      setCart(items);
      setShippingCost(parseFloat(backendCart.shipping_cost));
      setShippingBreakdown(backendCart.shipping_breakdown);
      setTaxAmount(parseFloat(backendCart.tax_amount));
      saveLocalCart(items);
    } catch (error: any) {
      // Re-throw so the caller can show a toast (e.g. "deal already in cart")
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, convertBackendCart, saveLocalCart]);

  const addToLocalCart = (product: Product, quantity: number) => {
    console.log('[CartContext] Adding to local cart:', product.name, 'qty:', quantity);
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);

      let newCart;
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, 99);
        newCart = prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        newCart = [...prevCart, { id: product.id, product, quantity }];
      }

      // IMPORTANT: Save to localStorage immediately (even for authenticated users as backup)
      console.log('[CartContext] Saving local cart to localStorage:', newCart.length, 'items');
      saveLocalCart(newCart);

      return newCart;
    });
  };

  // Remove item from cart
  const removeItem = useCallback(async (id: string) => {
    // Find product ID before removal to clean up originalPrice
    const item = cart.find(item => item.id === id);
    const productId = item?.product.id;

    if (isAuthenticated) {
      // Use backend API
      try {
        setIsLoading(true);
        const backendCart = await cartService.removeItem(id);

        const items = convertBackendCart(backendCart);

        // Merge original prices from localStorage
        const originalPrices = loadOriginalPrices();
        const itemsWithPrices = items.map(item => {
          const originalPrice = originalPrices[item.product.id];
          if (originalPrice && originalPrice > item.product.price) {
            return {
              ...item,
              product: {
                ...item.product,
                originalPrice
              }
            };
          }
          return item;
        });

        setCart(itemsWithPrices);
        setShippingCost(parseFloat(backendCart.shipping_cost));
        setShippingBreakdown(backendCart.shipping_breakdown);
        setTaxAmount(parseFloat(backendCart.tax_amount));

        // BACKUP: Save to localStorage
        saveLocalCart(itemsWithPrices);

        // Clean up originalPrice for removed product
        if (productId) {
          const updatedPrices = loadOriginalPrices();
          delete updatedPrices[productId];
          saveOriginalPrices(updatedPrices);
        }
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

      // Clean up originalPrice for removed product
      if (productId) {
        const updatedPrices = loadOriginalPrices();
        delete updatedPrices[productId];
        saveOriginalPrices(updatedPrices);
      }
    }
  }, [isAuthenticated, cart, convertBackendCart, loadOriginalPrices, saveOriginalPrices]);

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

        // Merge original prices from localStorage
        const originalPrices = loadOriginalPrices();
        const itemsWithPrices = items.map(item => {
          const originalPrice = originalPrices[item.product.id];
          if (originalPrice && originalPrice > item.product.price) {
            return {
              ...item,
              product: {
                ...item.product,
                originalPrice
              }
            };
          }
          return item;
        });

        setCart(itemsWithPrices);
        setShippingCost(parseFloat(backendCart.shipping_cost));
        setShippingBreakdown(backendCart.shipping_breakdown);
        setTaxAmount(parseFloat(backendCart.tax_amount));

        // BACKUP: Save to localStorage
        saveLocalCart(itemsWithPrices);
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
  }, [isAuthenticated, removeItem, convertBackendCart, loadOriginalPrices]);

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

        // Clear original prices
        saveOriginalPrices({});
      } catch (error) {
        console.error('[CartContext] Failed to clear cart via backend:', error);
        // Fall back to local clear
        setCart([]);
        saveOriginalPrices({});
      } finally {
        setIsLoading(false);
      }
    } else {
      // Guest user: use local cart
      setCart([]);
      saveOriginalPrices({});
    }
  }, [isAuthenticated, saveOriginalPrices]);

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
    addDeal,
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
