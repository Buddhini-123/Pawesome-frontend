import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import './output.css';

// Components
import Header from './components/common/Header';

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
import Account from './components/pages/Account/Account';
import Contact from './components/pages/Account/Contact';
import NotFound from './components/pages/NotFound';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;