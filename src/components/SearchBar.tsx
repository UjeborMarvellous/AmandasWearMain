// components/SearchBar.tsx
import { useState, useEffect } from 'react';
import { Product } from '../types';
import { IoClose } from "react-icons/io5";

interface SearchBarProps {
  products: Product[];
  searchTerm: string;
  onSearch: (term: string) => void;  // Changed to accept string
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ 
  products, 
  searchTerm,
  onSearch, 
  placeholder = "Search products...",
  className = ""
}: SearchBarProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isFocused, setIsFocused] = useState(false);
  
  // Sync local state with prop
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Debounce search to improve performance
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(localSearchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchTerm, onSearch]);

  const clearSearch = () => {
    setLocalSearchTerm('');
    onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder={placeholder}
          className="w-full py-1 px-4 pr-10 border-b border-white shadow-lg  bg-transparent focus:outline-none focus:ring-b focus:ring-white focus:border-transparent transition-all"
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        
        {/* Search icon or clear button */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
          {localSearchTerm ? (
            <button
              type="button"
              onClick={clearSearch}
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              <IoClose className="h-5 w-5" />
            </button>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        
        {/* Search suggestions dropdown */}
        {isFocused && localSearchTerm && (
          <div className="absolute z-10 mt-1 w-full bg-BWhite/80 border-b border-white shadow-lg max-h-60 overflow-y-auto">
            {products
              .filter(product => 
                product.name.toLowerCase().includes(localSearchTerm.toLowerCase())
              )
              .map(product => (
                <div 
                  key={product.id} 
                  className="px-2 py-1 hover:bg-BWhite/50 cursor-pointer flex flex-col justify-center"
                  onMouseDown={() => {
                    setLocalSearchTerm(product.name);
                    onSearch(product.name);
                  }}
                >
                  <span className="bg-gray-500/30 px-2 text-xs rounded-lg py-1">{product.name}</span>
                  {/* <span className="ml-auto text-xs text-gray-300 truncate">{product.description}</span> */}
                </div>
              ))}
              
            {products.filter(p => p.name.toLowerCase().includes(localSearchTerm.toLowerCase())).length === 0 && (
              <div className="px-4 py-2 text-gray-300 text-sm">
                No products found
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;