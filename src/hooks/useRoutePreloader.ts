import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Define route preload mappings
const routePreloadMap: Record<string, (() => Promise<any>)[]> = {
  // When on product pages, preload cart and checkout
  '/product': [
    () => import('../components/pages/Shop/Cart'),
    () => import('../components/pages/Shop/Checkout'),
  ],
  // When on category pages, preload product page and cart
  '/dogs': [
    () => import('../components/pages/Products/ProductPage'),
    () => import('../components/pages/Shop/Cart'),
  ],
  '/cats': [
    () => import('../components/pages/Products/ProductPage'),
    () => import('../components/pages/Shop/Cart'),
  ],
  '/birds': [
    () => import('../components/pages/Products/ProductPage'),
    () => import('../components/pages/Shop/Cart'),
  ],
  // When in cart, preload checkout and login
  '/cart': [
    () => import('../components/pages/Shop/Checkout'),
    () => import('../components/pages/Login/Login'),
  ],
  // When on home, preload popular categories
  '/': [
    () => import('../components/pages/Categories/Dogs'),
    () => import('../components/pages/Categories/Cats'),
    () => import('../components/pages/Shop/Offers'),
  ],
  // When on deals page, preload deal details
  '/deals': [
    () => import('../components/deals/DealDetail'),
  ],
  // When on gifts page, preload customizer
  '/gifts': [
    () => import('../components/pages/Features/GiftCustomizer'),
  ],
};

// Intersection Observer for link preloading
const observerOptions = {
  root: null,
  rootMargin: '50px',
  threshold: 0.01,
};

export const useRoutePreloader = () => {
  const location = useLocation();

  useEffect(() => {
    // Preload routes based on current location
    const currentPath = location.pathname;
    
    // Find matching preload configuration
    for (const [pattern, preloadFns] of Object.entries(routePreloadMap)) {
      if (currentPath.includes(pattern)) {
        // Execute preload functions with a slight delay to avoid blocking
        setTimeout(() => {
          preloadFns.forEach(fn => fn().catch(() => {})); // Silently fail
        }, 1000);
        break;
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    // Set up intersection observer for link preloading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const link = entry.target as HTMLAnchorElement;
          const href = link.getAttribute('href');
          
          if (href) {
            // Preload specific routes on hover/visibility
            if (href.includes('/product/')) {
              import('../components/pages/Products/ProductPage').catch(() => {});
            } else if (href === '/cart') {
              import('../components/pages/Shop/Cart').catch(() => {});
            } else if (href === '/checkout') {
              import('../components/pages/Shop/Checkout').catch(() => {});
            } else if (href.includes('/deals/')) {
              import('../components/deals/DealDetail').catch(() => {});
            }
          }
        }
      });
    }, observerOptions);

    // Observe all internal links
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach(link => observer.observe(link));

    return () => observer.disconnect();
  }, [location.pathname]); // Re-run when route changes
};

// Manual preload function for programmatic use
export const preloadRoute = (route: string) => {
  switch (route) {
    case 'cart':
      return import('../components/pages/Shop/Cart');
    case 'checkout':
      return import('../components/pages/Shop/Checkout');
    case 'login':
      return import('../components/pages/Login/Login');
    case 'product':
      return import('../components/pages/Products/ProductPage');
    case 'subscriptions':
      return import('../components/pages/Features/Subscriptions');
    case 'gifts':
      return import('../components/pages/Features/Gifts');
    case 'gift-customizer':
      return import('../components/pages/Features/GiftCustomizer');
    case 'deals':
      return import('../components/pages/Features/Deals');
    case 'admin':
      return import('../components/admin/AdminLayout');
    default:
      return Promise.resolve();
  }
};