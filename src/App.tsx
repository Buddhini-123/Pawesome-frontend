import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import './index.css';
import './output.css';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer/Footer';

// Pages
import Home from './components/pages/Home/Home';
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

const App: React.FC = () => {

  const location = useLocation();
  const hideLayout = location.pathname === '/login';

  return (
    <div className="App">
      {!hideLayout && <Header />}
      <main>
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
          
          {/* New Feature Routes */}
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/gifts" element={<Gifts />} />
          <Route path="/gifts/customize" element={<GiftCustomizer />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/deals/:slug" element={<DealDetail />} />
          <Route path="/loyalty-cards" element={<LoyaltyCards />} />

          <Route path="/product/:id" element={<ProductPage />} />
          
          <Route path="*" element={<NotFound />} />

        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;