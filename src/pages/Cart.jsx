import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatCurrency, AVAILABLE_COUPONS } from '../utils.js';
import { QuantityStepper } from '../components/QuantityStepper.jsx';

export const Cart = () => {
  const {
    items,
    bill,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();
  const { showToast } = useToast();
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    applyCoupon(couponCodeInput.trim());
    setCouponCodeInput('');
  };

  const handleQuickCoupon = (code) => {
    applyCoupon(code);
    showToast(`Applied coupon ${code}!`, 'success');
  };

  if (items.length === 0) {
    return (
      <div className="cart-page-empty">
        <span className="empty-cart-big-emoji" role="img" aria-label="Shopping Cart">
          🛒
        </span>
        <h1>Your Shopping Cart is Empty</h1>
        <p>Your weekly groceries, dairy, vegetables and snacks are waiting for you!</p>
        <Link to="/" className="btn-explore-groceries">
          Start Shopping Fresh Groceries
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="cart-page-header">
        <h1 className="cart-page-title">
          Shopping Cart ({bill.itemsCount} {bill.itemsCount === 1 ? 'item' : 'items'})
        </h1>
        <button
          type="button"
          className="btn-clear-cart"
          onClick={() => {
            clearCart();
            showToast('Cleared your cart', 'info');
          }}
        >
          Clear Cart
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="free-delivery-tracker-full">
        {bill.itemTotal >= 499 ? (
          <div className="free-delivery-success-full">
            <span className="free-icon">🎉</span>
            <span>You have unlocked <strong>FREE Delivery</strong> on this order!</span>
          </div>
        ) : (
          <div className="free-delivery-box">
            <div className="free-delivery-top-text">
              <span>
                Add <strong>{formatCurrency(bill.amountForFreeDelivery)}</strong> more groceries to get <strong>FREE Delivery</strong>
              </span>
              <span className="free-threshold-badge">Free above ₹499</span>
            </div>
            <div className="free-progress-bg">
              <div
                className="free-progress-bar"
                style={{ width: `${bill.freeDeliveryProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Cart Layout: Left Table/List + Right Bill Summary */}
      <div className="cart-content-layout">
        {/* Items List */}
        <div className="cart-items-column">
          <ul className="cart-items-table" aria-label="Cart line items">
            {items.map((item) => (
              <li key={item.lineItemId} className="cart-line-item-row">
                <div className="line-item-emoji-box">
                  <span className="item-emoji">{item.emoji}</span>
                </div>

                <div className="line-item-meta">
                  <h2 className="line-item-title">
                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                  </h2>
                  <span className="line-item-unit">
                    Unit: {item.selectedUnit?.unit || '1 unit'}
                  </span>
                  <div className="line-item-price-row">
                    <span className="line-item-single-price">
                      {formatCurrency(item.price)} each
                    </span>
                    {item.mrp > item.price && (
                      <span className="line-item-mrp-cross">
                        MRP {formatCurrency(item.mrp)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="line-item-stepper-cell">
                  <QuantityStepper
                    quantity={item.quantity}
                    onIncrease={() => updateQuantity(item.lineItemId, item.quantity + 1)}
                    onDecrease={() => updateQuantity(item.lineItemId, item.quantity - 1)}
                    itemName={`${item.name} (${item.selectedUnit?.unit})`}
                  />
                </div>

                <div className="line-item-total-cell">
                  <span className="line-total-price">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    className="btn-trash-item"
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
        </div>

        {/* Summary & Checkout Sidebar */}
        <aside className="cart-summary-sidebar">
          {/* Coupon Code Box */}
          <div className="cart-card-box">
            <h2 className="card-box-heading">Apply Coupon</h2>
            <form onSubmit={handleApplyCoupon} className="coupon-entry-form">
              <input
                type="text"
                className="coupon-text-field"
                placeholder="Coupon code (e.g. SAVE50)"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                aria-label="Coupon code"
              />
              <button type="submit" className="btn-coupon-submit">
                Apply
              </button>
            </form>

            {bill.appliedCoupon && (
              <div className="applied-coupon-card">
                <div className="coupon-badge-line">
                  <span className="tag-icon">🏷️</span>
                  <strong>{bill.appliedCoupon.code}</strong> Applied
                </div>
                <p className="coupon-savings-msg">
                  You save {formatCurrency(bill.couponDiscount)} with this coupon!
                </p>
                <button
                  type="button"
                  className="btn-remove-coupon-link"
                  onClick={removeCoupon}
                >
                  Remove Coupon
                </button>
              </div>
            )}

            {bill.couponError && (
              <div className="coupon-alert-error" role="alert">
                {bill.couponError}
              </div>
            )}

            {/* Quick coupon chips */}
            {!bill.appliedCoupon && (
              <div className="coupons-available-list">
                <span className="coupons-heading">Recommended Coupons:</span>
                {AVAILABLE_COUPONS.map((cp) => (
                  <button
                    key={cp.code}
                    type="button"
                    className="coupon-pill-card"
                    onClick={() => handleQuickCoupon(cp.code)}
                  >
                    <div className="pill-code-row">
                      <span className="pill-code">{cp.code}</span>
                      <span className="pill-apply">TAP TO APPLY</span>
                    </div>
                    <span className="pill-desc">{cp.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bill Breakdown */}
          <div className="cart-card-box bill-box">
            <h2 className="card-box-heading">Bill Details</h2>
            <div className="bill-line">
              <span>Item Total (MRP)</span>
              <span>{formatCurrency(bill.mrpTotal)}</span>
            </div>
            {bill.mrpSavings > 0 && (
              <div className="bill-line savings-green">
                <span>Product Discounts</span>
                <span>-{formatCurrency(bill.mrpSavings)}</span>
              </div>
            )}
            {bill.couponDiscount > 0 && (
              <div className="bill-line savings-green">
                <span>Coupon ({bill.appliedCoupon?.code})</span>
                <span>-{formatCurrency(bill.couponDiscount)}</span>
              </div>
            )}
            <div className="bill-line">
              <span>Delivery Fee</span>
              <span>
                {bill.deliveryFee === 0 ? (
                  <strong className="free-text">FREE</strong>
                ) : (
                  formatCurrency(bill.deliveryFee)
                )}
              </span>
            </div>

            <div className="bill-divider" />

            <div className="bill-line total-highlight">
              <strong>Grand Total</strong>
              <strong className="total-value">{formatCurrency(bill.finalTotal)}</strong>
            </div>

            {bill.totalDiscount > 0 && (
              <div className="total-savings-alert">
                🌟 Congratulations! You are saving {formatCurrency(bill.totalDiscount)} on this order.
              </div>
            )}

            <button
              type="button"
              className="btn-proceed-checkout"
              onClick={() => navigate('/checkout')}
            >
              <span>Proceed to Checkout</span>
              <span className="checkout-btn-amount">{formatCurrency(bill.finalTotal)} →</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

