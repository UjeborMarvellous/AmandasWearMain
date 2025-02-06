import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { Filter, SlidersHorizontal } from 'lucide-react';

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
          <h1 className="text-3xl font-serif">Our Collection</h1>
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
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group"
              >
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-[40dvh] w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="text-sm text-gray-700">{product.name}</h3>
                  <h3 className="text-sm text-gray-700">{product.description}</h3>
                  <p className="text-lg font-medium text-gray-900">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;