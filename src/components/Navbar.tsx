import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';

function Navbar() {
  const navigate = useNavigate();
  const cart = useStore((state) => state.cart);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
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
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-1 flex items-center justify-between">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-serif">AW</h1>
            </Link>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/products"
                className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Products
              </Link>
              <Link
                to="/collections"
                className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Collections
              </Link>
              <Link
                to="/about"
                className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                About
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-900 p-2">
                <Search className="h-5 w-5" />
              </button>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-900 p-2"
                    title="Sign out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="text-gray-900 p-2">
                  <User className="h-5 w-5" />
                </Link>
              )}
              <Link to="/cart" className="text-gray-900 p-2 relative">
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