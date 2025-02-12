import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Collections from './pages/Collections';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Auth from './pages/Auth';
import ShippingInfo from './pages/ShippingInfo';
import Returns from './pages/Returns';
import SizeGuide from './pages/SizeGuide';

function Layout() {
  const location = useLocation();

  const hideNavAndFooter = location.pathname === '/auth';

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-500/10">
        {!hideNavAndFooter && <Navbar />}
        <main className=''>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/about" element={<About />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/shipping" element={<ShippingInfo />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/size-guide" element={<SizeGuide />} />
          </Routes>
        </main>
        {!hideNavAndFooter && location.pathname !== '/' && <Footer />}
      </div>
    </AuthProvider >
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
