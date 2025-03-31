import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { SlidersHorizontal } from 'lucide-react';
import { FaCartPlus, FaHeart } from "react-icons/fa";
import { MdOutlineKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { IoIosStar } from "react-icons/io";

interface ProductsProps {
  product: Product[];
}

function Products({ product }: ProductsProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(product);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    size: '',
    color: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const applyFilters = useCallback(() => {
    setLoading(true);
    let result = [...product];

    if (filters.category) {
      result = result.filter(p => p.category_id === filters.category);
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(p => p.price >= min && p.price <= max);
    }

    if (filters.size) {
      result = result.filter(p => p.size === filters.size);
    }

    if (filters.color) {
      result = result.filter(p => p.color === filters.color);
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page after filtering
    setLoading(false);
  }, [filters, product]);

  useEffect(() => {
    setFilteredProducts(product);
  }, [product]);

  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>, filterName: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: e.target.value
    }));
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  if (product.length === 0) {
    return (
      <div className="text-center mt-[13%] h-[40dvh] item-center justify-center">
        <p>No products available</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg md:text-3xl font-bold">Our Collection</h1>
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
            <select value={filters.category} onChange={(e) => handleFilterChange(e, 'category')} className="border border-gray-300 rounded-md p-2">
              <option value="">All Categories</option>
              <option value="dresses">Dresses</option>
              <option value="tops">Tops</option>
              <option value="bottoms">Bottoms</option>
              <option value="outerwear">Outerwear</option>
            </select>

            <select value={filters.priceRange} onChange={(e) => handleFilterChange(e, 'priceRange')} className="border border-gray-300 rounded-md p-2">
              <option value="">All Prices</option>
              <option value="0-50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-200">$100 - $200</option>
              <option value="200-500">$200+</option>
            </select>

            <select value={filters.size} onChange={(e) => handleFilterChange(e, 'size')} className="border border-gray-300 rounded-md p-2">
              <option value="">All Sizes</option>
              <option value="xs">XS</option>
              <option value="s">S</option>
              <option value="m">M</option>
              <option value="l">L</option>
              <option value="xl">XL</option>
            </select>

            <select value={filters.color} onChange={(e) => handleFilterChange(e, 'color')} className="border border-gray-300 rounded-md p-2">
              <option value="">All Colors</option>
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {paginatedProducts.map((product) => (
                <div key={product.id} className="group put bg-[#e7e3e3]/20 hover:shadow-2xl rounded-xl p-1">
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="relative shadow-2xl aspect-w-1 h-[50dvh] aspect-h-1 w-full overflow-hidden rounded-lg group">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-[60dvh] object-cover scale-100 object-center"
                      />
                      <div className="absolute h-full w-full bg-black/10 top-0 right-0 transition-opacity duration-300 flex justify-end p-4">
                        <div className="flex flex-col space-y-4">
                          <button className="text-2xl shadow-2xl p-2 text-BWhite bg-white rounded-full hover:bg-BWhite/40 hover:text-white">
                            <FaCartPlus />
                          </button>
                          <button className="text-2xl shadow-2xl p-2 text-BWhite bg-white rounded-full hover:bg-BWhite/40 hover:text-white">
                            <FaHeart />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="p-4">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-gray-800 text-lg truncate">{product.name}</h3>
                      <p className="text-yellow-400 my-auto font-bold flex gap-2">
                        <IoIosStar className="mt-1" />
                        <span className="text-black">{product.ratio}</span>
                      </p>
                    </div>
                    <Link to={`/product/${product.id}`}>
                      <p className="font-extralight text-gray-800 text-xs truncate">{product.description} <br /> Read more...</p>
                    </Link>
                    <div className='flex gap-2 items-center'>
                    <p className="text-gray-600 font-bold mt-2">${product.price}</p>
                    {product.Discount_Price > 0 && <p className="text-gray-400 font-thin text-[0.9rem] mt-2 line-through">${product.Discount_Price}</p>}
                    <div />
                  </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-4">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="px-4 py-2 bg-gray-200 rounded-md">
                 <MdKeyboardDoubleArrowLeft />
                </button>
                <span className="font-bold">{currentPage} | {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="px-4 py-2 bg-gray-200 rounded-md">
                  <MdOutlineKeyboardDoubleArrowRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Products;
