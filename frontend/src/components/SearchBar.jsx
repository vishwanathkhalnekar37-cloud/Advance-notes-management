import React, { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch, placeholder = 'Search notes...' }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch && onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch && onSearch('');
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={query}
        onChange={handleSearch}
      />
      {query && (
        <button className="search-clear" onClick={handleClear}>✕</button>
      )}
      <span className="search-icon">🔍</span>
    </div>
  );
};

export default SearchBar;
