import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { FaCartPlus } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    size: '',
    color: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  async function fetchProducts() {
    try {
      let query = supabase.from('products').select('*');

      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-');
        query = query.gte('price', min).lte('price', max);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white">
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Our Collection</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-beige-50 rounded-lg">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">All Categories</option>
              <option value="dresses">Dresses</option>
              <option value="tops">Tops</option>
              <option value="bottoms">Bottoms</option>
              <option value="outerwear">Outerwear</option>
            </select>

            <select
              value={filters.priceRange}
              onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">Price Range</option>
              <option value="0-50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-200">$100 - $200</option>
              <option value="200-500">$200+</option>
            </select>

            <select
              value={filters.size}
              onChange={(e) => setFilters({ ...filters, size: e.target.value })}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">Size</option>
              <option value="xs">XS</option>
              <option value="s">S</option>
              <option value="m">M</option>
              <option value="l">L</option>
              <option value="xl">XL</option>
            </select>

            <select
              value={filters.color}
              onChange={(e) => setFilters({ ...filters, color: e.target.value })}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">Color</option>
              <option value="black">Black</option>
              <option value="white">White</option>
              <option value="beige">Beige</option>
              <option value="brown">Brown</option>
            </select>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group put bg-[#e7e3e3]/20 hover:shadow-2xl rounded-xl p-1">
                {/* Wrap Only the Image in Link */}
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative shadow-2xl aspect-w-1 h-[50dvh] aspect-h-1 w-full overflow-hidden rounded-lg group">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-[60dvh] object-cover scale-100 object-center"
                    />
                    {/* Overlay on Hover */}
                    <div className="absolute h-full w-full bg-black/10 top-0 right-0 transition-opacity duration-300 flex justify-end p-4">
                      {/* Buttons on Right */}
                      <div className="flex flex-col space-y-4">
                        <button className="text-2xl shadow-2xl px-4 py-4 text-BWhite bg-white rounded-full hover:bg-BWhite/40 hover:text-white">
                          <FaCartPlus />
                        </button>
                        <button className="text-2xl shadow-2xl px-4 py-4 text-BWhite bg-white rounded-full hover:bg-BWhite/40 hover:text-white">
                          <FaHeart />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Keep the Text Outside the Link */}
                <div className="p-4">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-gray-800 text-lg truncate">{product.name}</h3>
                    <p className="text-yellow-400 my-auto font-bold flex gap-2">
                      <IoIosStar className="mt-1" />
                      <span className="text-black">{product.ratio}</span>
                    </p>
                  </div>
                  <p className="font-extralight text-gray-800 truncate">{product.description}</p>
                  <Link to={`/product/${product.id}`}>
                    <p className="font-extralight text-gray-800 text-xs truncate">Read more....</p>
                  </Link>
                  <p className="text-gray-600 font-bold mt-2">${product.price}</p>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}

export default Products;