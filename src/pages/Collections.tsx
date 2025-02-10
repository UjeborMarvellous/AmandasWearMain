import React from 'react';
import { Link } from 'react-router-dom';

const collections = [
  {
    id: 1,
    name: 'Classic Africa Wears',
    description: 'Vibrant African print shoe for any occasion',
    image: 'https://images.unsplash.com/photo-1544441892-794166f1e3be?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 2,
    name: 'Africa Modern Fusion',
    description: 'Contemporary styles with African inspiration',
    image: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 3,
    name: 'Traditional Wear',
    description: 'Authentic African traditional clothing',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 4,
    name: 'Classic Accessories',
    description: 'Complete your look with our African-inspired accessories',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }
];

function Collections() {
  return (
    <div className="pb-[7.99%] ">
      {/* Hero Section */}
      <div className="relative ">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Collections hero"
            className="w-full h-[37dvh] object-cover"
          />
          <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif text-white text-center">
            Our Collections
          </h1>
          <p className="mt-4 text-xl text-white text-center max-w-3xl mx-auto">
            Discover our curated collections of African-inspired fashion, where tradition meets contemporary style
          </p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              to={`/products?collection=${collection.name.toLowerCase()}`}
              className="group relative"
            >
              <div className="relative h-80 w-full overflow-hidden rounded-lg">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gray-900 bg-opacity-40 transition-opacity group-hover:bg-opacity-30"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-serif text-white">{collection.name}</h3>
                  <p className="mt-1 text-sm text-white">{collection.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Collections;