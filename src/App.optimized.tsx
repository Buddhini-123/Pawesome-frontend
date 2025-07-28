import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import './index.css';
import './output.css';

// Components that should always be loaded (core app shell)
import Header from './components/common/Header';
import Footer from './components/common/Footer/Footer';
import AdminProtectedRoute from './components/common/AdminProtectedRoute';
import ProtectedRoute from './components/common/ProtectedRoute';

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Critical pages that should load immediately (above the fold)
import Home from './components/pages/Home/HomeNew';

// Lazy load all other pages
// Category Pages (medium priority - likely to be visited)
const Dogs = lazy(() => import('./components/pages/Categories/Dogs'));
const Cats = lazy(() => import('./components/pages/Categories/Cats'));
const VetDiet = lazy(() => import('./components/pages/Categories/VetDiet'));
const Birds = lazy(() => import('./components/pages/Categories/Birds'));
const OtherAnimals = lazy(() => import('./components/pages/Categories/OtherAnimals'));

// Shop Pages (high priority - revenue generating)
const Offers = lazy(() => import('./components/pages/Shop/Offers'));
const Brands = lazy(() => import('./components/pages/Shop/Brands'));
const Cart = lazy(() => import('./components/pages/Shop/Cart'));
const Checkout = lazy(() => import('./components/pages/Shop/Checkout'));
const OrderConfirmation = lazy(() => import('./components/pages/Shop/OrderConfirmation'));
const ProductPage = lazy(() => import('./components/pages/Products/ProductPage'));

// Account Pages (medium priority)
const Account = lazy(() => import('./components/pages/Account/Account'));
const Contact = lazy(() => import('./components/pages/Account/Contact'));
const Login = lazy(() => import('./components/pages/Login/Login'));
const Register = lazy(() => import('./components/pages/Login/Register'));

// Feature Pages (low priority - heavy components)
const Subscriptions = lazy(() => import('./components/pages/Features/Subscriptions'));
const Gifts = lazy(() => import('./components/pages/Features/Gifts'));
const GiftCustomizer = lazy(() => import('./components/pages/Features/GiftCustomizer'));
const Deals = lazy(() => import('./components/pages/Features/Deals'));
const DealDetail = lazy(() => import('./components/deals/DealDetail'));
const LoyaltyCards = lazy(() => import('./components/pages/Features/LoyaltyCards'));

// Admin Pages (lowest priority - separate bundle)
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./components/admin/Dashboard/AdminDashboard'));
const ProductList = lazy(() => import('./components/admin/Products/ProductList'));
const AddProduct = lazy(() => import('./components/admin/Products/AddProduct'));
const OrderList = lazy(() => import('./components/admin/Orders/OrderList'));
const UserList = lazy(() => import('./components/admin/Users/UserList'));
const SubscriptionList = lazy(() => import('./components/admin/Subscriptions/SubscriptionList'));
const DealsList = lazy(() => import('./components/admin/Deals/DealsList'));

// Utility Pages
const NotFound = lazy(() => import('./components/pages/NotFound'));

const App: React.FC = () => {
  const location = useLocation();
  const hideLayout = location.pathname === '/login' || location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!hideLayout && <Header />}
      <main className="relative">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Home route loads immediately */}
            <Route path="/" element={<Home />} />
            
            {/* Category Routes */}
            <Route path="/dogs" element={<Dogs />} />
            <Route path="/cats" element={<Cats />} />
            <Route path="/vet-diet" element={<VetDiet />} />
            <Route path="/birds" element={<Birds />} />
            <Route path="/other-animals" element={<OtherAnimals />} />
            
            {/* Shop Routes */}
            <Route path="/offers" element={<Offers />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/order-confirmation/:orderId" element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            } />
            <Route path="/product/:id" element={<ProductPage />} />
            
            {/* Account Routes */}
            <Route path="/account" element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/join" element={<Register />} />
            
            {/* Feature Routes */}
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/gifts" element={<Gifts />} />
            <Route path="/gifts/customize" element={<GiftCustomizer />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/deals/:slug" element={<DealDetail />} />
            <Route path="/loyalty-cards" element={<LoyaltyCards />} />
            
            {/* Admin Routes - Nested Suspense for better granularity */}
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/new" element={<AddProduct />} />
              <Route path="orders" element={<OrderList />} />
              <Route path="users" element={<UserList />} />
              <Route path="deals" element={<DealsList />} />
              <Route path="subscriptions" element={<SubscriptionList />} />
              <Route path="gift-cards" element={<div>Gift Cards Management - Coming Soon</div>} />
              <Route path="analytics" element={<div>Analytics - Coming Soon</div>} />
              <Route path="settings" element={<div>Settings - Coming Soon</div>} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;