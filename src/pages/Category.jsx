import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getProducts, getCategories } from '../api.js';
import { ProductCard } from '../components/ProductCard.jsx';
import { FilterPanel } from '../components/FilterPanel.jsx';
import { Skeleton } from '../components/Skeleton.jsx';

export const Category = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchQuery = searchParams.get('q') || '';
  const filterParam = searchParams.get('filter') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [currentCategory, setCurrentCategory] = useState(slug || 'all');
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onOfferOnly, setOnOfferOnly] = useState(filterParam === 'deals');
  const [sortBy, setSortBy] = useState('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state if slug changes in URL
  useEffect(() => {
    if (slug) {
      setCurrentCategory(slug);
    } else {
      setCurrentCategory('all');
    }
  }, [slug]);

  // Load categories
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  // Fetch filtered products
  useEffect(() => {
    let isMounted = true;
    const fetchFiltered = async () => {
      try {
        setLoading(true);
        const data = await getProducts({
          category: currentCategory === 'all' ? null : currentCategory,
          search: searchQuery,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          inStockOnly,
          onOfferOnly,
          sort: sortBy,
        });
        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to fetch category products', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFiltered();
    return () => {
      isMounted = false;
    };
  }, [currentCategory, searchQuery, priceRange, inStockOnly, onOfferOnly, sortBy]);

  const handleSelectCategory = (catSlug) => {
    setCurrentCategory(catSlug);
    if (catSlug === 'all') {
      navigate('/category/all');
    } else {
      navigate(`/category/${catSlug}`);
    }
    setIsMobileFilterOpen(false);
  };

  const handlePriceRangeChange = (min, max) => {
    setPriceRange({ min, max });
  };

  const handleResetFilters = () => {
    setPriceRange({ min: null, max: null });
    setInStockOnly(false);
    setOnOfferOnly(false);
    setSortBy('popular');
    if (searchQuery) {
      navigate('/category/all');
    }
  };

  // Category title display
  const activeCatObj = categories.find((c) => c.slug === currentCategory);
  const pageTitle = searchQuery
    ? `Results for "${searchQuery}"`
    : activeCatObj
    ? `${activeCatObj.icon} ${activeCatObj.name}`
    : 'All Groceries';

  return (
    <div className="category-page-container">
      {/* Category Banner */}
      <div className="category-header-banner">
        <div className="cat-banner-content">
          <h1 className="category-page-title">{pageTitle}</h1>
          <p className="category-page-desc">
            {activeCatObj
              ? activeCatObj.description
              : searchQuery
              ? `Showing results matching your query in fresh groceries`
              : 'Browse our complete catalog of farm fresh groceries, dairy, and household items.'}
          </p>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="category-layout">
        {/* Desktop Filter Sidebar */}
        <aside className="category-sidebar">
          <FilterPanel
            selectedCategory={currentCategory}
            onSelectCategory={handleSelectCategory}
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            inStockOnly={inStockOnly}
            onInStockChange={setInStockOnly}
            onOfferOnly={onOfferOnly}
            onOfferChange={setOnOfferOnly}
            onResetFilters={handleResetFilters}
          />
        </aside>

        {/* Mobile Filter Modal Backdrop */}
        {isMobileFilterOpen && (
          <div
            className="mobile-filter-backdrop"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            <div
              className="mobile-filter-sheet"
              onClick={(e) => e.stopPropagation()}
            >
              <FilterPanel
                selectedCategory={currentCategory}
                onSelectCategory={handleSelectCategory}
                priceRange={priceRange}
                onPriceRangeChange={handlePriceRangeChange}
                inStockOnly={inStockOnly}
                onInStockChange={setInStockOnly}
                onOfferOnly={onOfferOnly}
                onOfferChange={setOnOfferOnly}
                onResetFilters={handleResetFilters}
                isOpen={true}
                onClose={() => setIsMobileFilterOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Results Main Area */}
        <main className="category-main-content">
          {/* Controls Bar: Item count, Mobile filter button, Sort dropdown */}
          <div className="catalog-controls-bar">
            <div className="catalog-count-info">
              <button
                type="button"
                className="mobile-filter-trigger-btn"
                onClick={() => setIsMobileFilterOpen(true)}
                aria-label="Open filters"
              >
                <span>⚙️ Filters</span>
                {(priceRange.min !== null || inStockOnly || onOfferOnly) && (
                  <span className="filter-active-dot" />
                )}
              </button>
              <span className="items-count-text">
                Showing <strong>{products.length}</strong> items
              </span>
            </div>

            <div className="catalog-sort-group">
              <label htmlFor="sort-select" className="sort-label">
                Sort by:
              </label>
              <select
                id="sort-select"
                className="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(priceRange.min !== null || inStockOnly || onOfferOnly || searchQuery) && (
            <div className="active-filters-chips" aria-label="Active filters">
              {searchQuery && (
                <span className="filter-chip">
                  Query: "{searchQuery}"
                  <button
                    type="button"
                    onClick={() => navigate(`/category/${currentCategory}`)}
                    aria-label="Remove search filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {priceRange.min !== null && (
                <span className="filter-chip">
                  Price: ₹{priceRange.min} - {priceRange.max ? `₹${priceRange.max}` : 'above'}
                  <button
                    type="button"
                    onClick={() => setPriceRange({ min: null, max: null })}
                    aria-label="Remove price filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="filter-chip">
                  In Stock Only
                  <button
                    type="button"
                    onClick={() => setInStockOnly(false)}
                    aria-label="Remove in stock filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {onOfferOnly && (
                <span className="filter-chip">
                  Offers & Discounts
                  <button
                    type="button"
                    onClick={() => setOnOfferOnly(false)}
                    aria-label="Remove offers filter"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                type="button"
                className="clear-all-chips-btn"
                onClick={handleResetFilters}
              >
                Clear all
              </button>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="products-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} height="280px" borderRadius="12px" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-catalog-state">
              <span className="empty-catalog-emoji" role="img" aria-label="No groceries found">
                🥦
              </span>
              <h2>No groceries matched your filters</h2>
              <p>Try resetting some filters or searching with different keywords.</p>
              <button
                type="button"
                className="btn-reset-catalog"
                onClick={handleResetFilters}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

