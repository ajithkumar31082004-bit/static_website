import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatCurrency, AVAILABLE_COUPONS } from '../utils.js';
import { QuantityStepper } from './QuantityStepper.jsx';

export const CartDrawer = () => {
  const {
    items,
    appliedCouponCode,
    isDrawerOpen,
    bill,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    setIsDrawerOpen,
    clearCart,
  } = useCart();

  const { showToast } = useToast();
  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, setIsDrawerOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const handleApplyCoupon = (e) => {
    e?.preventDefault();
    if (!couponInput.trim()) return;
    applyCoupon(couponInput.trim());
    setCouponInput('');
  };

  const handleQuickCoupon = (code) => {
    applyCoupon(code);
    showToast(`Applied coupon code ${code}`, 'success');
  };

  const handleCheckoutClick = () => {
    setIsDrawerOpen(false);
    navigate('/checkout');
  };

  if (!isDrawerOpen) return null;

  return (
    <div
      className="drawer-overlay"
      onClick={() => setIsDrawerOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <aside
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Shopping Cart Drawer"
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-header-left">
            <h2 id="cart-drawer-title" className="drawer-title">My Cart</h2>
            <span className="drawer-count-badge">
              {bill.itemsCount} {bill.itemsCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close cart drawer"
          >
            ✕
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="free-delivery-tracker" role="status">
          {bill.itemTotal >= 499 ? (
            <div className="free-delivery-success">
              <span className="delivery-icon">🎉</span>
              <span>Yay! You've unlocked <strong>FREE Delivery</strong></span>
            </div>
          ) : (
            <div className="free-delivery-progress-wrap">
              <div className="delivery-progress-text">
                <span>Add <strong>{formatCurrency(bill.amountForFreeDelivery)}</strong> more for <strong>FREE Delivery</strong></span>
              </div>
              <div className="progress-bar-bg" aria-hidden="true">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${bill.freeDeliveryProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Drawer Content */}
        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="drawer-empty-state">
              <span className="empty-cart-emoji" role="img" aria-label="Empty cart">🛒</span>
              <h3>Your cart is empty</h3>
              <p>Explore farm-fresh veggies, dairy, snacks, and daily essentials.</p>
              <button
                type="button"
                className="btn-start-shopping"
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/category/fruits-vegetables');
                }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Line Items List */}
              <ul className="drawer-items-list" aria-label="Cart items">
                {items.map((item) => (
                  <li key={item.lineItemId} className="drawer-item">
                    <div className="drawer-item-emoji-wrap">
                      <span role="img" aria-label={item.name} className="drawer-item-emoji">
                        {item.emoji}
                      </span>
                    </div>

                    <div className="drawer-item-info">
                      <h4 className="drawer-item-title">
                        <Link
                          to={`/product/${item.id}`}
                          onClick={() => setIsDrawerOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </h4>
                      <span className="drawer-item-unit">
                        {item.selectedUnit ? item.selectedUnit.unit : '1 unit'}
                      </span>
                      <div className="drawer-item-pricing">
                        <span className="drawer-item-price">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                        {item.mrp > item.price && (
                          <span className="drawer-item-mrp">
                            {formatCurrency(item.mrp * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="drawer-item-actions">
                      <QuantityStepper
                        quantity={item.quantity}
                        onIncrease={() => updateQuantity(item.lineItemId, item.quantity + 1)}
                        onDecrease={() => updateQuantity(item.lineItemId, item.quantity - 1)}
                        itemName={`${item.name} (${item.selectedUnit?.unit})`}
                        size="small"
                      />
                      <button
                        type="button"
                        className="btn-remove-line"
                        onClick={() => {
                          removeItem(item.lineItemId);
                          showToast(`Removed ${item.name} from cart`, 'info');
                        }}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Coupons & Offers Section */}
              <div className="drawer-coupon-box">
                <form onSubmit={handleApplyCoupon} className="coupon-form">
                  <input
                    type="text"
                    className="coupon-input"
                    placeholder="Enter coupon code (e.g. SAVE50)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    aria-label="Coupon code input"
                  />
                  <button type="submit" className="coupon-apply-btn">
                    Apply
                  </button>
                </form>

                {bill.appliedCoupon && (
                  <div className="applied-coupon-pill">
                    <span className="coupon-tag-icon">🏷️</span>
                    <span className="applied-coupon-name">
                      <strong>{bill.appliedCoupon.code}</strong> applied ({formatCurrency(bill.couponDiscount)} OFF)
                    </span>
                    <button
                      type="button"
                      className="btn-remove-coupon"
                      onClick={removeCoupon}
                      aria-label="Remove coupon"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {bill.couponError && (
                  <div className="coupon-error-msg" role="alert">
                    {bill.couponError}
                  </div>
                )}

                {/* Available Coupon Chips */}
                {!bill.appliedCoupon && (
                  <div className="quick-coupons-row">
                    <span className="quick-coupon-heading">Available Offers:</span>
                    <div className="coupon-chips-list">
                      {AVAILABLE_COUPONS.map((coupon) => (
                        <button
                          key={coupon.code}
                          type="button"
                          className="coupon-chip-btn"
                          onClick={() => handleQuickCoupon(coupon.code)}
                        >
                          <span className="chip-code">{coupon.code}</span>
                          <span className="chip-desc">{coupon.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bill Details */}
              <div className="drawer-bill-summary">
                <h3 className="bill-summary-title">Bill Breakdown</h3>
                <div className="bill-row">
                  <span>Item Total (MRP)</span>
                  <span>{formatCurrency(bill.mrpTotal)}</span>
                </div>
                {bill.mrpSavings > 0 && (
                  <div className="bill-row bill-savings-row">
                    <span>Product Savings</span>
                    <span>-{formatCurrency(bill.mrpSavings)}</span>
                  </div>
                )}
                {bill.couponDiscount > 0 && (
                  <div className="bill-row bill-discount-row">
                    <span>Coupon Discount</span>
                    <span>-{formatCurrency(bill.couponDiscount)}</span>
                  </div>
                )}
                <div className="bill-row">
                  <span>Delivery Fee</span>
                  <span>
                    {bill.deliveryFee === 0 ? (
                      <span className="free-tag">FREE</span>
                    ) : (
                      formatCurrency(bill.deliveryFee)
                    )}
                  </span>
                </div>
                <div className="bill-row bill-total-row">
                  <strong>To Pay</strong>
                  <strong className="bill-final-price">{formatCurrency(bill.finalTotal)}</strong>
                </div>

                {bill.totalDiscount > 0 && (
                  <div className="bill-total-savings-banner">
                    🎉 You save a total of {formatCurrency(bill.totalDiscount)} on this order!
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {items.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-footer-actions">
              <button
                type="button"
                className="btn-checkout-primary"
                onClick={handleCheckoutClick}
              >
                <span>Proceed to Checkout</span>
                <span className="checkout-total-pill">{formatCurrency(bill.finalTotal)} →</span>
              </button>
              <Link
                to="/cart"
                className="btn-view-full-cart"
                onClick={() => setIsDrawerOpen(false)}
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

