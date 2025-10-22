import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import './index.css';
import './output.css';
import { ToastContainer, toast } from 'react-toastify';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer/Footer';
import AdminProtectedRoute from './components/common/AdminProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Pages
import Home from './components/pages/Home/HomeNew';
import Dogs from './components/pages/Categories/Dogs';
import Cats from './components/pages/Categories/Cats';
import VetDiet from './components/pages/Categories/VetDiet';
import Birds from './components/pages/Categories/Birds';
import OtherAnimals from './components/pages/Categories/OtherAnimals';
import Offers from './components/pages/Shop/Offers';
import Brands from './components/pages/Shop/Brands';
import Cart from './components/pages/Shop/Cart';
import Checkout from './components/pages/Shop/Checkout';
import OrderConfirmation from './components/pages/Shop/OrderConfirmation';
import Account from './components/pages/Account/Account';
import Contact from './components/pages/Account/Contact';
import NotFound from './components/pages/NotFound';

// New Feature Pages
import Subscriptions from './components/pages/Features/Subscriptions';
import Gifts from './components/pages/Features/Gifts';
import GiftCustomizer from './components/pages/Features/GiftCustomizer';
import Deals from './components/pages/Features/Deals';
import DealDetail from './components/deals/DealDetail';
import LoyaltyCards from './components/pages/Features/LoyaltyCards';
import Login from './components/pages/Login/Login';
import Register from './components/pages/Login/Register';
import ProductPage from './components/pages/Products/ProductPage';
import ProtectedRoute from './components/common/ProtectedRoute';

// Admin Pages
import AdminDashboard from './components/admin/Dashboard/AdminDashboard';
import ProductList from './components/admin/Products/ProductList';
import AddProduct from './components/admin/Products/AddProduct';
import OrderList from './components/admin/Orders/OrderList';
import UserList from './components/admin/Users/UserList';
import SubscriptionList from './components/admin/Subscriptions/SubscriptionList';
import DealsList from './components/admin/Deals/DealsList';
import ForgotPassword from './components/pages/Login/ForgotPassword';

const App: React.FC = () => {

  const location = useLocation();
  const hideLayout = location.pathname === '/login' || location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!hideLayout && <Header />}
      <main className="relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dogs" element={<Dogs />} />
          <Route path="/cats" element={<Cats />} />
          <Route path="/vet-diet" element={<VetDiet />} />
          <Route path="/birds" element={<Birds />} />
          <Route path="/other-animals" element={<OtherAnimals />} />
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
          <Route path="/account" element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          } />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/join" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* New Feature Routes */}
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/gifts" element={<Gifts />} />
          <Route path="/gifts/customize" element={<GiftCustomizer />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/deals/:slug" element={<DealDetail />} />
          <Route path="/loyalty-cards" element={<LoyaltyCards />} />

          <Route path="/product/:slug" element={<ProductPage />} />
          
          {/* Admin Routes */}
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
      </main>
      {!hideLayout && <Footer />}
       {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default App;