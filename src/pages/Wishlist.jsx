import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getProductById } from '../api.js';
import { formatCurrency } from '../utils.js';
import { Skeleton } from '../components/Skeleton.jsx';

export const Wishlist = () => {
  const { wishlistIds, removeFromWishlist } = useWishlist();
  const { addItem, setIsDrawerOpen } = useCart();
  const { showToast } = useToast();

  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchWishlistItems = async () => {
      try {
        setLoading(true);
        const promises = wishlistIds.map((id) =>
          getProductById(id).catch(() => null)
        );
        const results = await Promise.all(promises);
        if (isMounted) {
          setWishlistProducts(results.filter(Boolean));
        }
      } catch (err) {
        console.error('Failed to load wishlist items', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchWishlistItems();
    return () => {
      isMounted = false;
    };
  }, [wishlistIds]);

  const handleMoveToCart = (product) => {
    const defaultUnit = product.unitOptions ? product.unitOptions[0] : null;
    addItem(product, defaultUnit, 1);
    removeFromWishlist(product.id);
    showToast(`Moved ${product.name} to your cart!`, 'success');
  };

  const handleAddAllToCart = () => {
    wishlistProducts.forEach((product) => {
      const defaultUnit = product.unitOptions ? product.unitOptions[0] : null;
      addItem(product, defaultUnit, 1);
    });
    showToast(`Added ${wishlistProducts.length} wishlist items to cart!`, 'success');
    setIsDrawerOpen(true);
  };

  return (
    <div className="wishlist-page-container">
      <div className="wishlist-header-banner">
        <div className="wishlist-title-wrap">
          <h1 className="wishlist-title">My Wishlist ({wishlistIds.length})</h1>
          <p className="wishlist-subtitle">
            Saved groceries for your upcoming weekly restocking.
          </p>
        </div>
        {wishlistProducts.length > 0 && (
          <button
            type="button"
            className="btn-add-all-cart"
            onClick={handleAddAllToCart}
          >
            🛒 Add All to Cart
          </button>
        )}
      </div>

      {loading ? (
        <div className="products-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="280px" borderRadius="12px" />
          ))}
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className="wishlist-empty-card">
          <span className="empty-wishlist-emoji" role="img" aria-label="Empty wishlist">
            ❤️
          </span>
          <h2>Your Wishlist is Empty</h2>
          <p>
            Tap the heart icon on any grocery item to save it here for quick access later.
          </p>
          <Link to="/" className="btn-explore-wishlist">
            Explore Fresh Groceries
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {wishlistProducts.map((product) => {
            const currentUnit = product.unitOptions ? product.unitOptions[0] : { unit: '1 unit', price: product.price, mrp: product.mrp };
            return (
              <article key={product.id} className="wishlist-card">
                <button
                  type="button"
                  className="wishlist-remove-cross"
                  onClick={() => {
                    removeFromWishlist(product.id);
                    showToast(`Removed from wishlist`, 'info');
                  }}
                  aria-label={`Remove ${product.name} from wishlist`}
                >
                  ✕
                </button>

                <Link to={`/product/${product.id}`} className="wishlist-card-visual">
                  <span className="product-emoji" role="img" aria-label={product.name}>
                    {product.emoji}
                  </span>
                </Link>

                <div className="wishlist-card-body">
                  <h3 className="wishlist-item-title">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                  </h3>
                  <span className="wishlist-item-unit">{currentUnit.unit}</span>

                  <div className="wishlist-price-row">
                    <span className="price-tag">{formatCurrency(currentUnit.price)}</span>
                    {currentUnit.mrp > currentUnit.price && (
                      <span className="mrp-price">{formatCurrency(currentUnit.mrp)}</span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn-move-to-cart-primary"
                    onClick={() => handleMoveToCart(product)}
                  >
                    Move to Cart 🛒
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

