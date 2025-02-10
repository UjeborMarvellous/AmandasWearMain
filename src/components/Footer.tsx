import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-BtnColor border-t -mb-[20%] ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-gray-200 font-semibold">AMANDASWEARS</h3>
            <p className="text-sm text-gray-100">
              Luxury fashion for the modern woman.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-gray-200 font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm text-gray-100 hover:text-gray-900">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-100 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-100 hover:text-gray-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-gray-200 font-semibold mb-4">Help</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shipping" className="text-sm text-gray-100 hover:text-gray-900">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-sm text-gray-100 hover:text-gray-900">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-sm text-gray-100 hover:text-gray-900">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="text-gray-200 font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-100 hover:text-gray-900">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-100 hover:text-gray-900">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-100 hover:text-gray-900">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-gray-100">
              Follow us for updates, styling tips, and exclusive offers.
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-gray-100">
            © {new Date().getFullYear()} AMANDASWEARS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
