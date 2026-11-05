import React from 'react';
import { CATEGORIES } from '../data/categories.js';

export const FilterPanel = ({
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceRangeChange,
  inStockOnly,
  onInStockChange,
  onOfferOnly,
  onOfferChange,
  onResetFilters,
  isOpen = false,
  onClose,
}) => {
  const priceOptions = [
    { label: 'All Prices', min: null, max: null },
    { label: 'Under ₹50', min: 0, max: 50 },
    { label: '₹50 - ₹150', min: 50, max: 150 },
    { label: '₹150 - ₹350', min: 150, max: 350 },
    { label: 'Above ₹350', min: 350, max: null },
  ];

  return (
    <aside className={`filter-panel ${isOpen ? 'filter-panel-open' : ''}`} aria-label="Product filters">
      <div className="filter-header">
        <h3 className="filter-title">Filters</h3>
        <button
          type="button"
          className="filter-reset-btn"
          onClick={onResetFilters}
          aria-label="Clear all applied filters"
        >
          Reset All
        </button>
        {onClose && (
          <button
            type="button"
            className="filter-close-btn"
            onClick={onClose}
            aria-label="Close filters"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <h4 className="filter-group-heading">Categories</h4>
        <div className="filter-options-list">
          <label className="filter-radio-label">
            <input
              type="radio"
              name="filter-category"
              value="all"
              checked={selectedCategory === 'all' || !selectedCategory}
              onChange={() => onSelectCategory('all')}
            />
            <span>All Categories</span>
          </label>
          {CATEGORIES.map((cat) => (
            <label key={cat.id} className="filter-radio-label">
              <input
                type="radio"
                name="filter-category"
                value={cat.slug}
                checked={selectedCategory === cat.slug}
                onChange={() => onSelectCategory(cat.slug)}
              />
              <span className="cat-filter-name">
                <span className="cat-filter-emoji">{cat.icon}</span>
                <span>{cat.name}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="filter-group">
        <h4 className="filter-group-heading">Price Range</h4>
        <div className="filter-options-list">
          {priceOptions.map((opt, i) => {
            const isChecked =
              priceRange.min === opt.min && priceRange.max === opt.max;
            return (
              <label key={i} className="filter-radio-label">
                <input
                  type="radio"
                  name="price-filter"
                  checked={isChecked}
                  onChange={() => onPriceRangeChange(opt.min, opt.max)}
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Toggles */}
      <div className="filter-group">
        <h4 className="filter-group-heading">Availability & Offers</h4>
        <div className="filter-toggle-list">
          <label className="filter-checkbox-label">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onInStockChange(e.target.checked)}
            />
            <span>In Stock Only</span>
          </label>

          <label className="filter-checkbox-label">
            <input
              type="checkbox"
              checked={onOfferOnly}
              onChange={(e) => onOfferChange(e.target.checked)}
            />
            <span>Special Offers & Deals Only</span>
          </label>
        </div>
      </div>
    </aside>
  );
};

