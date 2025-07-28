import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import './index.css';
import './output.css';

// Components that should always be loaded (core app shell)
import Header from './components/common/Header';
import Footer from './components/common/Footer/Footer';
import AdminProtectedRoute from './components/common/AdminProtectedRoute';
import ProtectedRoute from './components/common/ProtectedRoute';

// Custom loading components for different sections
const PageLoader = ({ section = 'default' }: { section?: string }) => {
  const messages = {
    default: 'Loading...',
    admin: 'Loading admin panel...',
    shop: 'Loading shop...',
    feature: 'Loading feature...'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-600">{messages[section as keyof typeof messages] || messages.default}</p>
    </div>
  );
};

// Error Boundary for handling lazy loading errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Critical pages that should load immediately
import Home from './components/pages/Home/HomeNew';

// Lazy load with retry logic
const lazyWithRetry = (componentImport: () => Promise<any>) => {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      // Retry once after 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      return componentImport();
    }
  });
};

// Category Pages - Preload on hover
const Dogs = lazyWithRetry(() => import('./components/pages/Categories/Dogs'));
const Cats = lazyWithRetry(() => import('./components/pages/Categories/Cats'));
const VetDiet = lazyWithRetry(() => import('./components/pages/Categories/VetDiet'));
const Birds = lazyWithRetry(() => import('./components/pages/Categories/Birds'));
const OtherAnimals = lazyWithRetry(() => import('./components/pages/Categories/OtherAnimals'));

// Shop Pages - Higher priority
const Offers = lazyWithRetry(() => import('./components/pages/Shop/Offers'));
const Brands = lazyWithRetry(() => import('./components/pages/Shop/Brands'));
const Cart = lazyWithRetry(() => import('./components/pages/Shop/Cart'));
const Checkout = lazyWithRetry(() => import('./components/pages/Shop/Checkout'));
const OrderConfirmation = lazyWithRetry(() => import('./components/pages/Shop/OrderConfirmation'));
const ProductPage = lazyWithRetry(() => import('./components/pages/Products/ProductPage'));

// Account Pages
const Account = lazyWithRetry(() => import('./components/pages/Account/Account'));
const Contact = lazyWithRetry(() => import('./components/pages/Account/Contact'));
const Login = lazyWithRetry(() => import('./components/pages/Login/Login'));
const Register = lazyWithRetry(() => import('./components/pages/Login/Register'));

// Feature Pages - Heavy components with dedicated chunks
const Subscriptions = lazyWithRetry(() => 
  import(/* webpackChunkName: "subscriptions" */ './components/pages/Features/Subscriptions')
);
const Gifts = lazyWithRetry(() => 
  import(/* webpackChunkName: "gifts" */ './components/pages/Features/Gifts')
);
const GiftCustomizer = lazyWithRetry(() => 
  import(/* webpackChunkName: "gift-customizer" */ './components/pages/Features/GiftCustomizer')
);
const Deals = lazyWithRetry(() => 
  import(/* webpackChunkName: "deals" */ './components/pages/Features/Deals')
);
const DealDetail = lazyWithRetry(() => 
  import(/* webpackChunkName: "deal-detail" */ './components/deals/DealDetail')
);
const LoyaltyCards = lazyWithRetry(() => 
  import(/* webpackChunkName: "loyalty" */ './components/pages/Features/LoyaltyCards')
);

// Admin Pages - Separate bundle with all admin code
const AdminLayout = lazyWithRetry(() => 
  import(/* webpackChunkName: "admin" */ './components/admin/AdminLayout')
);
const AdminDashboard = lazyWithRetry(() => 
  import(/* webpackChunkName: "admin" */ './components/admin/Dashboard/AdminDashboard')
);
const ProductList = lazyWithRetry(() => 
  import(/* webpackChunkName: "admin" */ './components/admin/Products/ProductList')
);
const AddProduct = lazyWithRetry(() => 
  import(/* webpackChunkName: "admin" */ './components/admin/Products/AddProduct')
);
const OrderList = lazyWithRetry(() => 
  import(/* webpackChunkName: "admin" */ './components/admin/Orders/OrderList')
);
const UserList = lazyWithRetry(() => 
  import(/* webpackChunkName: "admin" */ './components/admin/Users/UserList')
);
const SubscriptionList = lazyWithRetry(() => 
  import(/* webpackChunkName: "admin" */ './components/admin/Subscriptions/SubscriptionList')
);
const DealsList = lazyWithRetry(() => 
  import(/* webpackChunkName: "admin" */ './components/admin/Deals/DealsList')
);

// Utility Pages
const NotFound = lazyWithRetry(() => import('./components/pages/NotFound'));

// Preload functions for critical routes
const preloadCart = () => import('./components/pages/Shop/Cart');
const preloadCheckout = () => import('./components/pages/Shop/Checkout');
const preloadLogin = () => import('./components/pages/Login/Login');

const App: React.FC = () => {
  const location = useLocation();
  const hideLayout = location.pathname === '/login' || location.pathname.startsWith('/admin');

  // Preload critical routes based on user behavior
  useEffect(() => {
    // Preload cart when user is browsing products
    if (location.pathname.includes('/product') || location.pathname.includes('/category')) {
      preloadCart();
    }
    
    // Preload checkout when user is in cart
    if (location.pathname === '/cart') {
      preloadCheckout();
    }
    
    // Preload login when user clicks on protected routes
    if (location.pathname === '/account' || location.pathname === '/checkout') {
      preloadLogin();
    }
  }, [location.pathname]);

  return (
    <div className="App">
      {!hideLayout && <Header />}
      <main className="relative">
        <ErrorBoundary>
          <Routes>
            {/* Home route loads immediately */}
            <Route path="/" element={<Home />} />
            
            {/* Category Routes with shared Suspense */}
            <Route path="/dogs" element={
              <Suspense fallback={<PageLoader />}>
                <Dogs />
              </Suspense>
            } />
            <Route path="/cats" element={
              <Suspense fallback={<PageLoader />}>
                <Cats />
              </Suspense>
            } />
            <Route path="/vet-diet" element={
              <Suspense fallback={<PageLoader />}>
                <VetDiet />
              </Suspense>
            } />
            <Route path="/birds" element={
              <Suspense fallback={<PageLoader />}>
                <Birds />
              </Suspense>
            } />
            <Route path="/other-animals" element={
              <Suspense fallback={<PageLoader />}>
                <OtherAnimals />
              </Suspense>
            } />
            
            {/* Shop Routes with dedicated loading states */}
            <Route path="/offers" element={
              <Suspense fallback={<PageLoader section="shop" />}>
                <Offers />
              </Suspense>
            } />
            <Route path="/brands" element={
              <Suspense fallback={<PageLoader section="shop" />}>
                <Brands />
              </Suspense>
            } />
            <Route path="/cart" element={
              <Suspense fallback={<PageLoader section="shop" />}>
                <Cart />
              </Suspense>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader section="shop" />}>
                  <Checkout />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/order-confirmation/:orderId" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader section="shop" />}>
                  <OrderConfirmation />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/product/:id" element={
              <Suspense fallback={<PageLoader section="shop" />}>
                <ProductPage />
              </Suspense>
            } />
            
            {/* Account Routes */}
            <Route path="/account" element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <Account />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/contact" element={
              <Suspense fallback={<PageLoader />}>
                <Contact />
              </Suspense>
            } />
            <Route path="/login" element={
              <Suspense fallback={<PageLoader />}>
                <Login />
              </Suspense>
            } />
            <Route path="/register" element={
              <Suspense fallback={<PageLoader />}>
                <Register />
              </Suspense>
            } />
            <Route path="/join" element={
              <Suspense fallback={<PageLoader />}>
                <Register />
              </Suspense>
            } />
            
            {/* Feature Routes with dedicated loading */}
            <Route path="/subscriptions" element={
              <Suspense fallback={<PageLoader section="feature" />}>
                <Subscriptions />
              </Suspense>
            } />
            <Route path="/gifts" element={
              <Suspense fallback={<PageLoader section="feature" />}>
                <Gifts />
              </Suspense>
            } />
            <Route path="/gifts/customize" element={
              <Suspense fallback={<PageLoader section="feature" />}>
                <GiftCustomizer />
              </Suspense>
            } />
            <Route path="/deals" element={
              <Suspense fallback={<PageLoader section="feature" />}>
                <Deals />
              </Suspense>
            } />
            <Route path="/deals/:slug" element={
              <Suspense fallback={<PageLoader section="feature" />}>
                <DealDetail />
              </Suspense>
            } />
            <Route path="/loyalty-cards" element={
              <Suspense fallback={<PageLoader section="feature" />}>
                <LoyaltyCards />
              </Suspense>
            } />
            
            {/* Admin Routes with nested Suspense */}
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <Suspense fallback={<PageLoader section="admin" />}>
                  <AdminLayout />
                </Suspense>
              </AdminProtectedRoute>
            }>
              <Route index element={
                <Suspense fallback={<PageLoader section="admin" />}>
                  <AdminDashboard />
                </Suspense>
              } />
              <Route path="products" element={
                <Suspense fallback={<PageLoader section="admin" />}>
                  <ProductList />
                </Suspense>
              } />
              <Route path="products/new" element={
                <Suspense fallback={<PageLoader section="admin" />}>
                  <AddProduct />
                </Suspense>
              } />
              <Route path="orders" element={
                <Suspense fallback={<PageLoader section="admin" />}>
                  <OrderList />
                </Suspense>
              } />
              <Route path="users" element={
                <Suspense fallback={<PageLoader section="admin" />}>
                  <UserList />
                </Suspense>
              } />
              <Route path="deals" element={
                <Suspense fallback={<PageLoader section="admin" />}>
                  <DealsList />
                </Suspense>
              } />
              <Route path="subscriptions" element={
                <Suspense fallback={<PageLoader section="admin" />}>
                  <SubscriptionList />
                </Suspense>
              } />
              <Route path="gift-cards" element={<div>Gift Cards Management - Coming Soon</div>} />
              <Route path="analytics" element={<div>Analytics - Coming Soon</div>} />
              <Route path="settings" element={<div>Settings - Coming Soon</div>} />
            </Route>
            
            <Route path="*" element={
              <Suspense fallback={<PageLoader />}>
                <NotFound />
              </Suspense>
            } />
          </Routes>
        </ErrorBoundary>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;