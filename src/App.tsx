import { useState, useEffect } from 'react';
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
import Cancel from './pages/CancelOrder';
import WhatsApp from './pages/WhatsAppButton';
import AuthCallback from './pages/AuthCallback';
import { Product } from './types';
import { supabase } from './lib/supabase';

async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data as Product[];
}

function Layout() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const products = await fetchProducts();
      setAllProducts(products);
      setFilteredProducts(products);
      setLoading(false);
    }
    loadProducts();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.description.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const hideNavAndFooter = location.pathname === '/auth';

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-500/10">
        {!hideNavAndFooter && (
          <Navbar 
            searchTerm={searchTerm}
            onSearch={handleSearch}
            products={allProducts}
          />
        )}
        <WhatsApp />
        <main className=''>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/products" 
              element={
                loading ? (
                  <div className="text-center py-12">Loading products...</div>
                ) : (
                  <Products product={searchTerm ? filteredProducts : allProducts} />
                )
              } 
            />
            <Route path="/collections" element={<Collections />} />
            <Route path="/about" element={<About />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/shipping" element={<ShippingInfo />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/size-guide" element={<SizeGuide />} />
            <Route path="/cancel" element={<Cancel />} />
          </Routes>
        </main>
        {!hideNavAndFooter && location.pathname !== '/' && <Footer />}
      </div>
    </AuthProvider>
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