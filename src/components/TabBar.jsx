import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export const TabBar = () => {
  const { bill, setIsDrawerOpen } = useCart();

  return (
    <nav className="mobile-tab-bar" aria-label="Mobile Navigation Bar">
      <NavLink
        to="/"
        className={({ isActive }) => `tab-bar-item ${isActive ? 'tab-bar-active' : ''}`}
        end
      >
        <span className="tab-icon" aria-hidden="true">🏠</span>
        <span className="tab-label">Home</span>
      </NavLink>

      <NavLink
        to="/category/fruits-vegetables"
        className={({ isActive }) => `tab-bar-item ${isActive ? 'tab-bar-active' : ''}`}
      >
        <span className="tab-icon" aria-hidden="true">🍱</span>
        <span className="tab-label">Categories</span>
      </NavLink>

      <button
        type="button"
        className="tab-bar-item tab-cart-trigger"
        onClick={() => setIsDrawerOpen(true)}
        aria-label={`Open Cart (${bill.itemsCount} items)`}
      >
        <div className="tab-cart-icon-wrap">
          <span className="tab-icon" aria-hidden="true">🛒</span>
          {bill.itemsCount > 0 && (
            <span className="tab-badge" aria-hidden="true">{bill.itemsCount}</span>
          )}
        </div>
        <span className="tab-label">Cart</span>
      </button>

      <NavLink
        to="/orders"
        className={({ isActive }) => `tab-bar-item ${isActive ? 'tab-bar-active' : ''}`}
      >
        <span className="tab-icon" aria-hidden="true">📦</span>
        <span className="tab-label">Orders</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) => `tab-bar-item ${isActive ? 'tab-bar-active' : ''}`}
      >
        <span className="tab-icon" aria-hidden="true">👤</span>
        <span className="tab-label">Profile</span>
      </NavLink>
    </nav>
  );
};

