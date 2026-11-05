import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchSuggestions } from '../api.js';
import { formatCurrency } from '../utils.js';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState({ categories: [], products: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search suggestions
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions({ categories: [], products: [] });
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchSuggestions(query);
        setSuggestions(results);
        setIsOpen(true);
      } catch (err) {
        console.error('Search suggestion error', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleProductSelect = (productId) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/product/${productId}`);
  };

  const handleCategorySelect = (categorySlug) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/category/${categorySlug}`);
  };

  const clearQuery = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="search-bar-container" ref={containerRef}>
      <form onSubmit={handleSearchSubmit} className="search-form" role="search">
        <label htmlFor="search-input" className="sr-only">
          Search for atta, dal, vegetables, milk and more
        </label>
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          id="search-input"
          ref={inputRef}
          type="search"
          className="search-input"
          placeholder='Search "milk", "atta", "paneer", "apple"...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={clearQuery}
            aria-label="Clear search query"
          >
            ✕
          </button>
        )}
        <button type="submit" className="search-submit-btn" aria-label="Search">
          Search
        </button>
      </form>

      {/* Live Suggestions Dropdown */}
      {isOpen && (suggestions.categories.length > 0 || suggestions.products.length > 0) && (
        <div className="search-dropdown" role="listbox" aria-label="Search suggestions">
          {isLoading && <div className="search-dropdown-loading">Searching fresh catalog...</div>}

          {suggestions.categories.length > 0 && (
            <div className="search-dropdown-group">
              <span className="search-group-title">Categories</span>
              <div className="search-category-chips">
                {suggestions.categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className="search-cat-chip"
                    onClick={() => handleCategorySelect(cat.slug)}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {suggestions.products.length > 0 && (
            <div className="search-dropdown-group">
              <span className="search-group-title">Products</span>
              <ul className="search-product-list">
                {suggestions.products.map((prod) => (
                  <li key={prod.id}>
                    <button
                      type="button"
                      className="search-product-item"
                      onClick={() => handleProductSelect(prod.id)}
                    >
                      <span className="search-item-emoji">{prod.emoji}</span>
                      <div className="search-item-details">
                        <span className="search-item-name">{prod.name}</span>
                        <span className="search-item-unit">
                          {prod.unitOptions ? prod.unitOptions[0].unit : ''}
                        </span>
                      </div>
                      <span className="search-item-price">
                        {formatCurrency(prod.unitOptions ? prod.unitOptions[0].price : prod.price)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="search-dropdown-footer">
            <button
              type="button"
              className="view-all-results-btn"
              onClick={handleSearchSubmit}
            >
              See all results for "{query}" →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

