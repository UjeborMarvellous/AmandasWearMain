import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';

function Navbar() {
  const navigate = useNavigate();
  const cart = useStore((state) => state.cart);
  const [user, setUser] = useState(null);
  const [bgColor, setBgColor] = useState('bg-BWhite/10');

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setBgColor('bg-BWhite/90'); // Change to dark color
      } else {
        setBgColor('bg-BWhite/10'); // Default color
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
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
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className={`${bgColor} text-white top-0 sticky z-50 shadow-2xl`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 rounded-2xl lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex-1 flex items-center justify-between">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-3xl font-bold font-serif">AW</h1>
            </Link>

            <div className="hidden sm:ml-6 font-bold sm:flex sm:space-x-8">
              <Link
                to="/products"
                className="text-white inline-flex items-center px-1 pt-1 text-sm font-bold"
              >
                Products
              </Link>
              <Link
                to="/collections"
                className="text-white inline-flex items-center px-1 pt-1 text-sm font-bold"
              >
                Collections
              </Link>
              <Link
                to="/about"
                className="text-white inline-flex items-center px-1 pt-1 text-sm font-bold"
              >
                About
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-white p-2">
                <Search className="h-5 w-5" />
              </button>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-white">
                    {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-white p-2"
                    title="Sign out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="text-white p-2">
                  <User className="h-5 w-5" />
                </Link>
              )}
              <Link to="/cart" className="text-white p-2 relative">
                <ShoppingBag className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
