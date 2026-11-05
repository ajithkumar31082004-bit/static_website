import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatCurrency } from '../utils.js';
import { SearchBar } from './SearchBar.jsx';

export const Header = () => {
  const { bill, setIsDrawerOpen } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isAuthenticated, getDefaultAddress } = useAuth();
  const navigate = useNavigate();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const defaultAddr = getDefaultAddress();

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Brand Logo */}
        <div className="header-brand-wrap">
          <Link to="/" className="brand-logo" aria-label="Supermart Home">
            <span className="brand-cart-icon" aria-hidden="true">🛒</span>
            <div className="brand-text-group">
              <span className="brand-name">Supermart</span>
              <span className="brand-tagline">Fresh in 15 mins</span>
            </div>
          </Link>

          {/* Quick Location Pill */}
          <button
            type="button"
            className="location-pill-btn"
            onClick={() => navigate('/profile')}
            aria-label="Delivery location"
          >
            <span className="location-pin" aria-hidden="true">📍</span>
            <div className="location-details">
              <span className="location-heading">Delivering to</span>
              <span className="location-area">
                {defaultAddr ? `${defaultAddr.city} ${defaultAddr.pincode}` : 'Bengaluru 560103'}
              </span>
            </div>
            <span className="location-arrow" aria-hidden="true">▾</span>
          </button>
        </div>

        {/* Live Search Center */}
        <div className="header-search-wrap">
          <SearchBar />
        </div>

        {/* Action Buttons */}
        <nav className="header-actions-nav" aria-label="Main User Navigation">
          <Link to="/orders" className="header-action-link" aria-label="My Orders">
            <span className="nav-icon" aria-hidden="true">📦</span>
            <span className="nav-label">Orders</span>
          </Link>

          <Link to="/wishlist" className="header-action-link wishlist-link" aria-label={`Wishlist (${wishlistCount} items)`}>
            <span className="nav-icon" aria-hidden="true">❤️</span>
            <span className="nav-label">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="header-badge" aria-hidden="true">{wishlistCount}</span>
            )}
          </Link>

          {isAuthenticated ? (
            <Link to="/profile" className="header-action-link user-profile-link" aria-label={`My Account - ${user?.name || 'User'}`}>
              <div className="user-avatar-circle" aria-hidden="true">
                {(user?.name || 'P')[0].toUpperCase()}
              </div>
              <span className="nav-label">{user?.name ? user.name.split(' ')[0] : 'Profile'}</span>
            </Link>
          ) : (
            <Link to="/login" className="header-action-link login-link" aria-label="Sign In">
              <span className="nav-icon" aria-hidden="true">👤</span>
              <span className="nav-label">Login</span>
            </Link>
          )}

          {/* Sunny Yellow Cart Button */}
          <button
            type="button"
            className="header-cart-btn"
            onClick={() => setIsDrawerOpen(true)}
            aria-label={`Open shopping cart with ${bill.itemsCount} items totaling ${formatCurrency(bill.finalTotal)}`}
          >
            <span className="cart-btn-icon" aria-hidden="true">🛒</span>
            <div className="cart-btn-content">
              <span className="cart-items-counter">
                {bill.itemsCount} {bill.itemsCount === 1 ? 'item' : 'items'}
              </span>
              <span className="cart-price-total">{formatCurrency(bill.itemTotal)}</span>
            </div>
          </button>
        </nav>
      </div>
    </header>
  );
};

