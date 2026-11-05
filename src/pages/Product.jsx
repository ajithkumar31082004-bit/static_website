import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getSimilarProducts } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatCurrency, calculateDiscount } from '../utils.js';
import { QuantityStepper } from '../components/QuantityStepper.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { Skeleton } from '../components/Skeleton.jsx';

export const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUnitIdx, setSelectedUnitIdx] = useState(0);

  const { items, addItem, updateQuantity, setIsDrawerOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const loadProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(id);
        if (isMounted) {
          setProduct(data);
          setSelectedUnitIdx(0);
          const similarData = await getSimilarProducts(data.id, data.category, 4);
          if (isMounted) setSimilar(similarData);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Product could not be loaded');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-container">
        <Skeleton width="40%" height="1.5rem" style={{ margin: '1rem 0' }} />
        <div className="product-detail-grid">
          <Skeleton height="380px" borderRadius="16px" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Skeleton width="80%" height="2rem" />
            <Skeleton width="40%" height="1.5rem" />
            <Skeleton width="100%" height="100px" />
            <Skeleton width="60%" height="3rem" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-error-container">
        <span className="product-error-emoji">🔍</span>
        <h2>Product Not Found</h2>
        <p>{error || 'The grocery item you are looking for is currently unavailable.'}</p>
        <Link to="/" className="btn-back-home">
          Return to Supermart
        </Link>
      </div>
    );
  }

  const unitOptions = product.unitOptions || [
    { unit: '1 unit', price: product.price, mrp: product.mrp },
  ];
  const currentUnit = unitOptions[selectedUnitIdx] || unitOptions[0];
  const discount = calculateDiscount(currentUnit.price, currentUnit.mrp);
  const isWishlisted = isInWishlist(product.id);

  // Cart quantity for current unit
  const lineItemId = `${product.id}__${currentUnit.unit}`;
  const cartItem = items.find((i) => i.lineItemId === lineItemId);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleIncrease = () => {
    if (quantity === 0) {
      addItem(product, currentUnit, 1);
      showToast(`Added ${product.name} (${currentUnit.unit}) to cart`, 'success');
    } else {
      updateQuantity(lineItemId, quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      updateQuantity(lineItemId, quantity - 1);
    }
  };

  const handleWishlistClick = () => {
    const added = toggleWishlist(product.id);
    showToast(
      added ? `Saved ${product.name} to wishlist` : `Removed from wishlist`,
      'info'
    );
  };

  return (
    <div className="product-detail-page">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs-nav" aria-label="Breadcrumbs">
        <Link to="/">Home</Link>
        <span className="bc-sep">/</span>
        <Link to={`/category/${product.category}`}>
          {product.category.replace('-', ' & ')}
        </Link>
        <span className="bc-sep">/</span>
        <span className="bc-current">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <article className="product-detail-grid">
        {/* Left Column: Big Visual Image Area */}
        <div className="product-hero-visual-card">
          <div className="product-visual-image-box">
            <span className="product-large-emoji" role="img" aria-label={product.name}>
              {product.emoji}
            </span>
            {discount > 0 && (
              <span className="product-large-discount-badge">{discount}% OFF</span>
            )}
            <button
              type="button"
              className={`product-detail-wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={handleWishlistClick}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isWishlisted ? '❤️ Saved' : '🤍 Wishlist'}
            </button>
          </div>

          <div className="product-guarantee-badges">
            <div className="guarantee-badge">
              <span className="gb-icon">⚡</span>
              <span className="gb-text">Delivered in 15 mins</span>
            </div>
            <div className="guarantee-badge">
              <span className="gb-icon">🌿</span>
              <span className="gb-text">Clean & Quality Checked</span>
            </div>
            <div className="guarantee-badge">
              <span className="gb-icon">🔄</span>
              <span className="gb-text">Doorstep Replacement</span>
            </div>
          </div>
        </div>

        {/* Right Column: Information, Pack Options, Price, CTA */}
        <div className="product-info-panel">
          <div className="product-meta-row">
            <span className="product-category-tag">
              <Link to={`/category/${product.category}`}>{product.category}</Link>
            </span>
            <div className="product-rating-box">
              <span className="rating-star">★</span>
              <span className="rating-score">{product.rating}</span>
              <span className="rating-count">({product.reviewsCount} reviews)</span>
            </div>
          </div>

          <h1 className="product-title-heading">{product.name}</h1>

          {/* Price Sticker */}
          <div className="product-price-section">
            <div className="price-tag-big" aria-label={`Price ${formatCurrency(currentUnit.price)}`}>
              <span className="currency-symbol">₹</span>
              <span className="price-number">{currentUnit.price}</span>
            </div>
            {currentUnit.mrp > currentUnit.price && (
              <div className="mrp-savings-group">
                <span className="mrp-crossed">MRP {formatCurrency(currentUnit.mrp)}</span>
                <span className="savings-pill">
                  Save {formatCurrency(currentUnit.mrp - currentUnit.price)}
                </span>
              </div>
            )}
          </div>
          <span className="inclusive-taxes-note">(Inclusive of all taxes)</span>

          {/* Unit / Pack Size Options */}
          <div className="unit-options-section">
            <span className="section-small-label">Select Pack Size:</span>
            <div className="unit-buttons-grid">
              {unitOptions.map((opt, idx) => {
                const isSelected = selectedUnitIdx === idx;
                const optDiscount = calculateDiscount(opt.price, opt.mrp);
                return (
                  <button
                    key={opt.unit}
                    type="button"
                    className={`unit-option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedUnitIdx(idx)}
                  >
                    <span className="opt-unit-name">{opt.unit}</span>
                    <span className="opt-unit-price">{formatCurrency(opt.price)}</span>
                    {optDiscount > 0 && (
                      <span className="opt-unit-discount">{optDiscount}% OFF</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Status Indicator */}
          <div className="stock-status-row">
            {product.stock > 10 ? (
              <span className="stock-indicator in-stock">
                ✓ In Stock (Fresh batch available)
              </span>
            ) : product.stock > 0 ? (
              <span className="stock-indicator low-stock">
                ⚠️ Hurry, only {product.stock} packs left!
              </span>
            ) : (
              <span className="stock-indicator out-of-stock">
                ✕ Currently Out of Stock
              </span>
            )}
          </div>

          {/* Action Row: Stepper & Add To Cart Button */}
          <div className="product-cta-action-row">
            {product.stock === 0 ? (
              <button type="button" className="btn-out-of-stock-disabled" disabled>
                Out of Stock
              </button>
            ) : quantity === 0 ? (
              <button
                type="button"
                className="btn-add-primary"
                onClick={handleIncrease}
              >
                <span>Add {currentUnit.unit} to Cart</span>
                <span className="btn-arrow">→</span>
              </button>
            ) : (
              <div className="cta-stepper-wrap">
                <QuantityStepper
                  quantity={quantity}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  max={product.stock}
                  size="large"
                  itemName={`${product.name} (${currentUnit.unit})`}
                />
                <button
                  type="button"
                  className="btn-view-cart-shortcut"
                  onClick={() => setIsDrawerOpen(true)}
                >
                  View Cart 🛒
                </button>
              </div>
            )}
          </div>

          {/* Description & Details */}
          <div className="product-details-accordion">
            <div className="accordion-item">
              <h2 className="accordion-title">Product Description</h2>
              <p className="accordion-text">{product.description}</p>
            </div>

            <div className="accordion-spec-grid">
              {product.origin && (
                <div className="spec-card">
                  <span className="spec-label">Source / Origin</span>
                  <span className="spec-value">{product.origin}</span>
                </div>
              )}
              {product.shelfLife && (
                <div className="spec-card">
                  <span className="spec-label">Shelf Life</span>
                  <span className="spec-value">{product.shelfLife}</span>
                </div>
              )}
              {product.storage && (
                <div className="spec-card">
                  <span className="spec-label">Storage Instructions</span>
                  <span className="spec-value">{product.storage}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Similar Products Row */}
      {similar.length > 0 && (
        <section className="similar-products-section">
          <div className="section-header">
            <h2 className="section-title">Similar Items You Might Like</h2>
          </div>
          <div className="products-grid">
            {similar.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

