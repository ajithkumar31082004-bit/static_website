import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatCurrency, calculateDiscount } from '../utils.js';
import { QuantityStepper } from './QuantityStepper.jsx';

export const ProductCard = ({ product }) => {
  const { items, addItem, updateQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const unitOptions = product.unitOptions || [
    { unit: '1 unit', price: product.price, mrp: product.mrp },
  ];
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);

  const currentUnit = unitOptions[selectedUnitIndex] || unitOptions[0];
  const discount = calculateDiscount(currentUnit.price, currentUnit.mrp);
  const isWishlisted = isInWishlist(product.id);

  // Find if this product with current unit is in cart
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

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product.id);
    showToast(
      added ? `Saved ${product.name} to wishlist` : `Removed ${product.name} from wishlist`,
      'info'
    );
  };

  return (
    <article className="product-card" data-product-id={product.id}>
      {/* Top badges: Discount & Wishlist */}
      <div className="card-top-row">
        {discount > 0 ? (
          <span className="badge-discount" aria-label={`${discount}% discount`}>
            {discount}% OFF
          </span>
        ) : (
          <span />
        )}

        <button
          type="button"
          className={`wishlist-btn ${isWishlisted ? 'wishlist-btn-active' : ''}`}
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Product Image Area */}
      <Link
        to={`/product/${product.id}`}
        className="card-image-link"
        aria-label={`View details of ${product.name}`}
      >
        <div className="card-image-wrap">
          <span className="product-emoji" role="img" aria-label={product.name}>
            {product.emoji}
          </span>
          {product.stock <= 5 && product.stock > 0 && (
            <span className="stock-pill low-stock">Only {product.stock} left</span>
          )}
          {product.stock === 0 && (
            <span className="stock-pill out-of-stock">Out of stock</span>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="card-content">
        <div className="card-meta">
          <span className="card-rating">★ {product.rating}</span>
          <span className="card-delivery-time">15 MINS</span>
        </div>

        <h3 className="card-title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        {/* Unit Selection dropdown or pill */}
        <div className="card-unit-wrap">
          {unitOptions.length > 1 ? (
            <select
              className="unit-select"
              value={selectedUnitIndex}
              onChange={(e) => setSelectedUnitIndex(Number(e.target.value))}
              aria-label={`Select pack size for ${product.name}`}
            >
              {unitOptions.map((opt, idx) => (
                <option key={opt.unit} value={idx}>
                  {opt.unit} - {formatCurrency(opt.price)}
                </option>
              ))}
            </select>
          ) : (
            <span className="single-unit-label">{currentUnit.unit}</span>
          )}
        </div>

        {/* Price & Stepper Row */}
        <div className="card-footer-row">
          <div className="price-tag-container">
            <span className="price-tag" aria-label={`Price: ${formatCurrency(currentUnit.price)}`}>
              {formatCurrency(currentUnit.price)}
            </span>
            {currentUnit.mrp > currentUnit.price && (
              <span className="mrp-price" aria-label={`MRP: ${formatCurrency(currentUnit.mrp)}`}>
                {formatCurrency(currentUnit.mrp)}
              </span>
            )}
          </div>

          <div className="card-action">
            {product.stock === 0 ? (
              <span className="out-of-stock-label">Out of Stock</span>
            ) : (
              <QuantityStepper
                quantity={quantity}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                max={product.stock}
                itemName={`${product.name} (${currentUnit.unit})`}
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

