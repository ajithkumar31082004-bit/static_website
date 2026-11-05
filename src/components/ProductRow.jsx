import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from './ProductCard.jsx';
import { ProductCardSkeleton } from './Skeleton.jsx';

export const ProductRow = ({
  title,
  subtitle,
  badge,
  viewAllLink,
  products = [],
  loading = false,
}) => {
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="product-row-section">
      <div className="section-header">
        <div className="section-title-wrap">
          <div className="section-headline-group">
            {badge && <span className="section-badge">{badge}</span>}
            <h2 className="section-title">{title}</h2>
          </div>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>

        <div className="section-header-actions">
          {viewAllLink && (
            <Link to={viewAllLink} className="view-all-link">
              <span>View All</span>
              <span aria-hidden="true">→</span>
            </Link>
          )}
          <div className="row-nav-btns" aria-hidden="true">
            <button
              type="button"
              className="scroll-btn scroll-btn-prev"
              onClick={() => handleScroll('left')}
              aria-label={`Scroll ${title} left`}
            >
              ‹
            </button>
            <button
              type="button"
              className="scroll-btn scroll-btn-next"
              onClick={() => handleScroll('right')}
              aria-label={`Scroll ${title} right`}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div className="product-row-carousel" ref={scrollContainerRef}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
        ) : products.length > 0 ? (
          products.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="row-empty">No products available at the moment.</div>
        )}
      </div>
    </section>
  );
};

