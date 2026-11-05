import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Header } from './components/Header.jsx';
import { TabBar } from './components/TabBar.jsx';
import { CartDrawer } from './components/CartDrawer.jsx';

import { Home } from './pages/Home.jsx';
import { Category } from './pages/Category.jsx';
import { Product } from './pages/Product.jsx';
import { Cart } from './pages/Cart.jsx';
import { Checkout } from './pages/Checkout.jsx';
import { Success } from './pages/Success.jsx';
import { Orders } from './pages/Orders.jsx';
import { Login } from './pages/Login.jsx';
import { Profile } from './pages/Profile.jsx';
import { Wishlist } from './pages/Wishlist.jsx';
import { NotFound } from './pages/NotFound.jsx';

export function App() {
  return (
    <div className="app-shell">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a href="#main-content" className="skip-to-content-link">
        Skip to main content
      </a>

      {/* Global Header */}
      <Header />

      {/* Slide-out Cart Drawer (accessible anywhere) */}
      <CartDrawer />

      {/* Main Content Area */}
      <main id="main-content" className="app-main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/search" element={<Category />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderId" element={<Success />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Desktop Site Footer */}
      <footer className="site-footer" role="contentinfo">
        <div className="footer-container">
          <div className="footer-top-grid">
            <div className="footer-col-brand">
              <div className="footer-brand-title">
                <span className="brand-emoji">🛒</span>
                <span>Supermart</span>
              </div>
              <p className="footer-brand-desc">
                India's favorite 15-minute online supermarket. Daily fresh vegetables, milk, farm eggs, staples, snacks and personal care delivered straight to your door.
              </p>
              <div className="footer-contact-info">
                <span>📞 Customer Care: 1800-890-SUPER</span>
                <span>⏰ Delivery Hours: 6:00 AM - 11:00 PM</span>
              </div>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">Categories</h3>
              <ul className="footer-links">
                <li><Link to="/category/fruits-vegetables">Fruits & Vegetables</Link></li>
                <li><Link to="/category/dairy-eggs">Dairy & Eggs</Link></li>
                <li><Link to="/category/staples">Atta, Rice & Dal</Link></li>
                <li><Link to="/category/snacks">Snacks & Munchies</Link></li>
                <li><Link to="/category/beverages">Beverages & Chai</Link></li>
                <li><Link to="/category/household">Household & Cleaning</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">Account & Help</h3>
              <ul className="footer-links">
                <li><Link to="/orders">My Past Orders</Link></li>
                <li><Link to="/wishlist">Saved Wishlist</Link></li>
                <li><Link to="/profile">Saved Addresses</Link></li>
                <li><Link to="/cart">View Cart</Link></li>
                <li><Link to="/login">Sign In / Switch User</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">Supermart Promise</h3>
              <div className="footer-promises">
                <div className="promise-item">
                  <span className="promise-icon">⚡</span>
                  <div>
                    <strong>15-Min Delivery</strong>
                    <p>Packed carefully at your neighborhood dark store</p>
                  </div>
                </div>
                <div className="promise-item">
                  <span className="promise-icon">🌿</span>
                  <div>
                    <strong>Farm Fresh Only</strong>
                    <p>Sourced daily at 4:00 AM from local mandis</p>
                  </div>
                </div>
                <div className="promise-item">
                  <span className="promise-icon">💰</span>
                  <div>
                    <strong>Mandi Price Guarantee</strong>
                    <p>Direct wholesale rates with no hidden fees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <p>© {new Date().getFullYear()} Supermart Retail Pvt. Ltd. All rights reserved. Prices in Indian Rupee (₹).</p>
            <div className="footer-legal-tags">
              <span>Made with ❤️ for Indian Households</span>
              <span>•</span>
              <span>FSSAI Certified</span>
              <span>•</span>
              <span>PCI-DSS Compliant Mock Gateway</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <TabBar />
    </div>
  );
}

export default App;

