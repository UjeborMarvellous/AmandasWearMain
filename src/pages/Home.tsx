import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
            alt="Fashion hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900 bg-opacity-40"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            FASHION MEETS LUXURY
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            Discover our curated collection of premium clothing that combines style, comfort, and sophistication.
          </p>
          <div className="mt-10">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          Featured Collections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['Dresses', 'Accessories', 'Outerwear'].map((category) => (
            <div key={category} className="relative group">
              <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white">
                <img
                  src={`https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`}
                  alt={category}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-6 text-sm text-gray-500">{category}</h3>
              <p className="text-base font-semibold text-gray-900">Shop Collection</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;