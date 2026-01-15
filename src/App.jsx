import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './components/ProductDetails';
import Admin from './pages/Admin';
import CategoryPage from './pages/CategoryPage';
import Footer from './components/Footer';
import { AnimationProvider } from './context/AnimationContext';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import { ProductProvider } from './context/ProductContext';
import ScrollToTop from './components/ScrollToTop';
import CartDrawer from './components/CartDrawer';
import SearchOverlay from './components/SearchOverlay';

function App() {
  return (
    <ProductProvider>
      <SearchProvider>
        <CartProvider>
          <AnimationProvider>
            <BrowserRouter>
              <ScrollToTop />
              <CartDrawer />
              <SearchOverlay />
              <div className="min-h-screen">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
                <Footer />
              </div>
            </BrowserRouter>
          </AnimationProvider>
        </CartProvider>
      </SearchProvider>
    </ProductProvider>
  );
}

export default App;
