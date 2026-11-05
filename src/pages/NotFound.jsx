import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <span className="not-found-emoji" role="img" aria-label="Spilled groceries">
          🥦🧺💨
        </span>
        <span className="not-found-code">404</span>
        <h1 className="not-found-title">Page Spilled Off the Shelf!</h1>
        <p className="not-found-desc">
          We couldn't find the page or grocery item you're looking for. It might have rolled away or been restocked somewhere else.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="btn-not-found-home">
            Go to Supermart Home
          </Link>
          <Link to="/category/fruits-vegetables" className="btn-not-found-catalog">
            Browse Produce
          </Link>
          <Link to="/orders" className="btn-not-found-orders">
            My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

