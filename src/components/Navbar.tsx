import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Search, LogOut, X , ArrowRight} from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import SearchBar from './SearchBar';
import { Product } from '../types';
import { FaCartPlus } from "react-icons/fa";

interface NavbarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  products: Product[];
}

function Navbar({ searchTerm, onSearch, products }: NavbarProps) {

  const [showPromoBanner, setShowPromoBanner] = useState<boolean>(true);
  const promoText: string = "🎉 Limited Time Offer: Get 10% OFF Your Entire Order! 🎉 From 21 April to 28 April";

  const navigate = useNavigate();
  const cart = useStore((state) => state.cart);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [bgColor, setBgColor] = useState<string>('bg-BWhite/10');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => {
      setBgColor(window.scrollY > 50 ? 'bg-BtnColor' : 'bg-BWhite/10');
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      subscription?.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
    <div className="promo">
      {showPromoBanner && (
        <div
          // Banner styling (positioning, background, etc.)
          className="top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white p-3 text-sm font-semibold shadow-lg animate-slideDownFadeIn flex items-center space-x-4 overflow-hidden" // *** Add overflow-hidden ***
          role="alert"
        >
          {/* Container for the marquee effect - hides overflowing text */}
          {/* Added marquee-container class for optional hover pause */}
          <div className="marquee-container flex-grow overflow-hidden whitespace-nowrap relative">
            {/* The actual text element that gets animated */}
            {/* Use 'animate-marquee' class (from CSS or Tailwind config) */}
            <span className="animate-marquee">
              {/* You often need to repeat the text for a seamless loop */}
              {promoText}
              {/* Add spacing or a visual separator if desired */}
              <span aria-hidden="true" className="mx-6">||</span>
              {promoText}
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setShowPromoBanner(false)}
            className="p-1 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 flex-shrink-0" // Keep flex-shrink-0
            aria-label="Dismiss promotional banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      </div>
    <nav className={`${bgColor} bg-BWhite/80 text-white top-0 sticky z-50 shadow-2xl transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 rounded-2xl lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex-1 flex items-center justify-between">
            <Link to="/" className="flex-shrink-0 flex items-center mr-4">
              <h1 className="lg:text-3xl text-xl font-bold font-serif">AW</h1>
            </Link>

            <div className="hidden sm:ml-6 font-bold sm:flex sm:space-x-8">
              <Link to="/products" className="text-white hover:text-gray-200 inline-flex items-center px-1 pt-1 text-sm font-bold transition-colors">
                Products
              </Link>
              <Link to="/collections" className="text-white hover:text-gray-200 inline-flex items-center px-1 pt-1 text-sm font-bold transition-colors">
                Collections
              </Link>
              <Link to="/about" className="text-white hover:text-gray-200 inline-flex items-center px-1 pt-1 text-sm font-bold transition-colors">
                About
              </Link>
            </div>

            <div className="flex items-center space-x-2 transition-all duration-300 transform">
              {/* Search component */}
              <div className="relative" ref={searchRef}>
                {isSearchOpen ? (
                  <div className="flex items-center">
                    <SearchBar searchTerm={searchTerm} onSearch={onSearch} products={products} />
                  </div>
                ) : (
                  <button onClick={handleSearchClick} className="text-white p-2 hover:text-gray-200 transition-colors" aria-label="Search">
                    <Search className="lg:h-5 h-4 lg:w-5 w-4" />
                  </button>
                )}
              </div>

              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="lg:text-sm text-xs text-white truncate max-w-[120px]">{user.email}</span>
                  <button onClick={handleSignOut} className="text-white lg:p-2 p-0 hover:text-gray-200 transition-colors" title="Sign out" aria-label="Sign out">
                    <LogOut className="lg:h-5 h-4 lg:w-5 w-4" />
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="text-white p-2 hover:text-gray-200 transition-colors" aria-label="Sign in">
                  <User className="h-5 w-5" />
                </Link>
              )}

              <Link to="/cart" className="text-white p-2 hover:text-gray-200 transition-colors relative" aria-label="Shopping cart">
                <FaCartPlus className="lg:h-5 lg:w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {cart.reduce((total, item) => total + (item.quantity || 1), 0)}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
    </>
  );
}

export default Navbar;
