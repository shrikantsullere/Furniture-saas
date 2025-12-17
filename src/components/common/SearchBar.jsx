import { useState } from 'react';
import { MdSearch, MdClose } from 'react-icons/md';

/**
 * SearchBar Component
 * Provides search functionality for orders by Order ID, Customer Name, or Delivery Note Number
 */
const SearchBar = ({ onSearch, onClear, placeholder = "Search by Order ID, Customer Name, or Delivery Note Number..." }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Real-time search as user types
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    if (onClear) {
      onClear();
    }
    if (onSearch) {
      onSearch('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MdSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-3 border border-primary rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-white"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <MdClose className="h-5 w-5" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;

