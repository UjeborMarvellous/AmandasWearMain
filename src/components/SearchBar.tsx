// components/SearchBar.tsx
import { useState, useEffect } from 'react';
import { Product } from '../types';

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
          className="w-full py-1 px-4 pr-10 rounded-full border border-gray-500 shadow-lg  bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        
        {/* Search suggestions dropdown */}
        {isFocused && localSearchTerm && (
          <div className="absolute z-10 mt-1 w-full bg-BWhite/80 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
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