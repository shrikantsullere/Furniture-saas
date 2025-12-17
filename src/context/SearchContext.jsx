import { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  const setSearchQuery = (query) => {
    setGlobalSearchQuery(query);
  };

  const clearSearch = () => {
    setGlobalSearchQuery('');
  };

  return (
    <SearchContext.Provider value={{ globalSearchQuery, setSearchQuery, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

