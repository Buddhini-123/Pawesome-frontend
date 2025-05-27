import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import './index.css';
import './output.css';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer/Footer.tsx';

// Pages
import Home from './components/pages/Home/Home.tsx';
import Dogs from './components/pages/Categories/Dogs.tsx';
import Cats from './components/pages/Categories/Cats.tsx';
import VetDiet from './components/pages/Categories/VetDiet.tsx';
import Birds from './components/pages/Categories/Birds.tsx';
import OtherAnimals from './components/pages/Categories/OtherAnimals.tsx';
import Offers from './components/pages/Shop/Offers.tsx';
import Brands from './components/pages/Shop/Brands.tsx';
import Cart from './components/pages/Shop/Cart.tsx';
import Account from './components/pages/Account/Account.tsx';
import Contact from './components/pages/Account/Contact.tsx';
import NotFound from './components/pages/NotFound.tsx';

// New Feature Pages
import Subscriptions from './components/pages/Features/Subscriptions.tsx';
import Gifts from './components/pages/Features/Gifts.tsx';
import Deals from './components/pages/Features/Deals.tsx';
import LoyaltyCards from './components/pages/Features/LoyaltyCards.tsx';
import Login from './components/pages/Login/Login.tsx';
import ProductPage from './components/pages/Products/ProductPage.tsx';

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
          <Route path="/account" element={<Account />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          
          {/* New Feature Routes */}
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/gifts" element={<Gifts />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/loyalty-cards" element={<LoyaltyCards />} />

          <Route path="/product" element={<ProductPage />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;