import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useOrder } from '../context/OrderContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatCurrency, getDeliverySlots } from '../utils.js';

export const Checkout = () => {
  const { items, bill, clearCart } = useCart();
  const { addresses, addAddress, getDefaultAddress, user } = useAuth();
  const { createOrder } = useOrder();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const slots = getDeliverySlots();
  const [selectedSlot, setSelectedSlot] = useState(slots[0]);

  // Address selection state
  const defaultAddr = getDefaultAddress();
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddr?.id || 'new');
  const [showNewAddressForm, setShowNewAddressForm] = useState(!defaultAddr);

  // New address form state
  const [addrForm, setAddrForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    flat: '',
    street: '',
    city: 'Bengaluru',
    pincode: '560103',
    type: 'Home',
  });
  const [addrErrors, setAddrErrors] = useState({});

  // Payment choice state
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiOption, setUpiOption] = useState('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [cardData, setCardData] = useState({
    number: '4532 •••• •••• 8821',
    name: user?.name || 'Priya Sharma',
    expiry: '11/28',
    cvv: '•••',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate address form
  const validateAddress = () => {
    const errs = {};
    if (!addrForm.fullName.trim()) errs.fullName = 'Full name is required';
    if (!/^[6-9]\d{9}$/.test(addrForm.phone.trim())) {
      errs.phone = 'Valid 10-digit Indian phone number required';
    }
    if (!addrForm.flat.trim()) errs.flat = 'House/Flat details required';
    if (!addrForm.street.trim()) errs.street = 'Street or locality required';
    if (!addrForm.city.trim()) errs.city = 'City is required';
    if (!/^[1-9]\d{5}$/.test(addrForm.pincode.trim())) {
      errs.pincode = 'Valid 6-digit Indian PIN code required';
    }
    setAddrErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      showToast('Your cart is empty', 'error');
      navigate('/');
      return;
    }

    let finalAddress;
    if (showNewAddressForm || selectedAddressId === 'new') {
      if (!validateAddress()) {
        showToast('Please fix address errors before placing order', 'error');
        return;
      }
      finalAddress = addAddress(addrForm);
    } else {
      finalAddress = addresses.find((a) => a.id === selectedAddressId) || defaultAddr;
    }

    if (!finalAddress) {
      showToast('Please provide a delivery address', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      let paymentDescription = 'UPI';
      if (paymentMethod === 'upi') {
        paymentDescription =
          upiOption === 'custom'
            ? `UPI (${customUpiId || 'user@upi'})`
            : `UPI (${upiOption === 'gpay' ? 'Google Pay' : upiOption === 'phonepe' ? 'PhonePe' : 'Paytm'})`;
      } else if (paymentMethod === 'card') {
        paymentDescription = 'Debit/Credit Card ending in 8821';
      } else if (paymentMethod === 'cod') {
        paymentDescription = 'Cash on Delivery (Pay at Doorstep)';
      }

      const orderPayload = {
        items: [...items],
        bill: { ...bill },
        slot: selectedSlot,
        address: finalAddress,
        paymentMethod: paymentDescription,
      };

      const placedOrder = await createOrder(orderPayload);
      clearCart();
      showToast('Order placed successfully! 🛒', 'success');
      navigate(`/order-success/${placedOrder.id}`);
    } catch (err) {
      console.error('Order creation error', err);
      showToast('Could not complete order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-empty-container">
        <h2>Your cart is empty</h2>
        <p>Please add grocery items to your cart before proceeding to checkout.</p>
        <Link to="/" className="btn-back-home">
          Browse Groceries
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      <h1 className="checkout-page-title">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="checkout-layout-grid">
        {/* Left Column: Delivery Address, Slot, Payment */}
        <div className="checkout-steps-column">
          {/* Step 1: Delivery Address */}
          <section className="checkout-step-card" aria-labelledby="step-address-heading">
            <div className="step-card-header">
              <span className="step-number-circle">1</span>
              <div>
                <h2 id="step-address-heading" className="step-title">Delivery Address</h2>
                <p className="step-subtitle">Where should we deliver your order?</p>
              </div>
            </div>

            {/* Saved Addresses List */}
            {addresses.length > 0 && !showNewAddressForm && (
              <div className="saved-addresses-list">
                {addresses.map((addr) => {
                  const isChecked = selectedAddressId === addr.id;
                  return (
                    <label
                      key={addr.id}
                      className={`saved-address-card ${isChecked ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="delivery_address"
                        value={addr.id}
                        checked={isChecked}
                        onChange={() => setSelectedAddressId(addr.id)}
                      />
                      <div className="address-card-info">
                        <div className="addr-header-row">
                          <span className="addr-name">{addr.fullName}</span>
                          <span className="addr-tag">{addr.type}</span>
                        </div>
                        <p className="addr-lines">
                          {addr.flat}, {addr.street}, {addr.city} - {addr.pincode}
                        </p>
                        <span className="addr-phone">Phone: +91 {addr.phone}</span>
                      </div>
                    </label>
                  );
                })}

                <button
                  type="button"
                  className="btn-add-new-address-toggle"
                  onClick={() => setShowNewAddressForm(true)}
                >
                  + Add New Address
                </button>
              </div>
            )}

            {/* New Address Form */}
            {showNewAddressForm && (
              <div className="new-address-form-box">
                {addresses.length > 0 && (
                  <button
                    type="button"
                    className="btn-back-to-saved"
                    onClick={() => setShowNewAddressForm(false)}
                  >
                    ← Back to saved addresses
                  </button>
                )}

                <div className="form-fields-grid">
                  <div className="field-group">
                    <label htmlFor="addr-name">Full Name *</label>
                    <input
                      id="addr-name"
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={addrForm.fullName}
                      onChange={(e) =>
                        setAddrForm({ ...addrForm, fullName: e.target.value })
                      }
                      className={addrErrors.fullName ? 'input-error' : ''}
                    />
                    {addrErrors.fullName && (
                      <span className="field-error-text">{addrErrors.fullName}</span>
                    )}
                  </div>

                  <div className="field-group">
                    <label htmlFor="addr-phone">10-Digit Mobile Number *</label>
                    <input
                      id="addr-phone"
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={addrForm.phone}
                      onChange={(e) =>
                        setAddrForm({ ...addrForm, phone: e.target.value })
                      }
                      className={addrErrors.phone ? 'input-error' : ''}
                    />
                    {addrErrors.phone && (
                      <span className="field-error-text">{addrErrors.phone}</span>
                    )}
                  </div>

                  <div className="field-group span-2">
                    <label htmlFor="addr-flat">Flat / House No. / Building / Floor *</label>
                    <input
                      id="addr-flat"
                      type="text"
                      placeholder="e.g. Flat 402, Green Glen Towers"
                      value={addrForm.flat}
                      onChange={(e) =>
                        setAddrForm({ ...addrForm, flat: e.target.value })
                      }
                      className={addrErrors.flat ? 'input-error' : ''}
                    />
                    {addrErrors.flat && (
                      <span className="field-error-text">{addrErrors.flat}</span>
                    )}
                  </div>

                  <div className="field-group span-2">
                    <label htmlFor="addr-street">Street / Area / Landmark *</label>
                    <input
                      id="addr-street"
                      type="text"
                      placeholder="e.g. Outer Ring Road, Near Bellandur Flyover"
                      value={addrForm.street}
                      onChange={(e) =>
                        setAddrForm({ ...addrForm, street: e.target.value })
                      }
                      className={addrErrors.street ? 'input-error' : ''}
                    />
                    {addrErrors.street && (
                      <span className="field-error-text">{addrErrors.street}</span>
                    )}
                  </div>

                  <div className="field-group">
                    <label htmlFor="addr-city">City *</label>
                    <input
                      id="addr-city"
                      type="text"
                      value={addrForm.city}
                      onChange={(e) =>
                        setAddrForm({ ...addrForm, city: e.target.value })
                      }
                      className={addrErrors.city ? 'input-error' : ''}
                    />
                    {addrErrors.city && (
                      <span className="field-error-text">{addrErrors.city}</span>
                    )}
                  </div>

                  <div className="field-group">
                    <label htmlFor="addr-pin">PIN Code *</label>
                    <input
                      id="addr-pin"
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 560103"
                      value={addrForm.pincode}
                      onChange={(e) =>
                        setAddrForm({ ...addrForm, pincode: e.target.value })
                      }
                      className={addrErrors.pincode ? 'input-error' : ''}
                    />
                    {addrErrors.pincode && (
                      <span className="field-error-text">{addrErrors.pincode}</span>
                    )}
                  </div>

                  <div className="field-group span-2">
                    <label>Save Address As</label>
                    <div className="address-type-radios">
                      {['Home', 'Work', 'Other'].map((type) => (
                        <label key={type} className="radio-pill-label">
                          <input
                            type="radio"
                            name="address_type"
                            value={type}
                            checked={addrForm.type === type}
                            onChange={() => setAddrForm({ ...addrForm, type })}
                          />
                          <span>{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Step 2: Delivery Slot Picker */}
          <section className="checkout-step-card" aria-labelledby="step-slot-heading">
            <div className="step-card-header">
              <span className="step-number-circle">2</span>
              <div>
                <h2 id="step-slot-heading" className="step-title">Delivery Slot</h2>
                <p className="step-subtitle">Choose when you want the delivery partner to arrive</p>
              </div>
            </div>

            <div className="slots-picker-grid">
              {slots.map((s) => {
                const isSelected = selectedSlot.id === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`slot-choice-pill ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedSlot(s)}
                  >
                    <div className="slot-day-row">
                      <span className="slot-bold-day">{s.day}</span>
                      {s.tag && <span className="slot-mini-tag">{s.tag}</span>}
                    </div>
                    <span className="slot-time-highlight">{s.time}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 3: Payment Choice */}
          <section className="checkout-step-card" aria-labelledby="step-payment-heading">
            <div className="step-card-header">
              <span className="step-number-circle">3</span>
              <div>
                <h2 id="step-payment-heading" className="step-title">Payment Choice</h2>
                <p className="step-subtitle">100% safe & verified mock payment interface</p>
              </div>
            </div>

            <div className="payment-options-accordion">
              {/* UPI Option */}
              <div className={`payment-method-box ${paymentMethod === 'upi' ? 'active' : ''}`}>
                <label className="payment-method-radio-label">
                  <input
                    type="radio"
                    name="payment_method"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  <div className="method-label-content">
                    <strong>UPI (Google Pay, PhonePe, Paytm, BHIM)</strong>
                    <span>Instant payment using any UPI app</span>
                  </div>
                </label>

                {paymentMethod === 'upi' && (
                  <div className="upi-details-pane">
                    <div className="upi-apps-row">
                      {[
                        { id: 'gpay', name: 'Google Pay', icon: '🟢' },
                        { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
                        { id: 'paytm', name: 'Paytm', icon: '🔵' },
                        { id: 'custom', name: 'Enter UPI ID', icon: '🆔' },
                      ].map((app) => (
                        <label key={app.id} className="upi-app-radio">
                          <input
                            type="radio"
                            name="upi_app"
                            value={app.id}
                            checked={upiOption === app.id}
                            onChange={() => setUpiOption(app.id)}
                          />
                          <span>{app.icon} {app.name}</span>
                        </label>
                      ))}
                    </div>

                    {upiOption === 'custom' && (
                      <div className="custom-upi-input-wrap">
                        <input
                          type="text"
                          placeholder="e.g. mobile@upi or username@okhdfcbank"
                          value={customUpiId}
                          onChange={(e) => setCustomUpiId(e.target.value)}
                          className="upi-input-field"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Option */}
              <div className={`payment-method-box ${paymentMethod === 'card' ? 'active' : ''}`}>
                <label className="payment-method-radio-label">
                  <input
                    type="radio"
                    name="payment_method"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <div className="method-label-content">
                    <strong>Credit / Debit Card</strong>
                    <span>Visa, Mastercard, RuPay, Maestro</span>
                  </div>
                </label>

                {paymentMethod === 'card' && (
                  <div className="card-details-pane">
                    <div className="mock-card-preview">
                      <span className="card-mock-type">💳 RuPay Debit</span>
                      <span className="card-mock-number">{cardData.number}</span>
                      <div className="card-mock-bottom">
                        <span>{cardData.name}</span>
                        <span>Exp: {cardData.expiry}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cash On Delivery Option */}
              <div className={`payment-method-box ${paymentMethod === 'cod' ? 'active' : ''}`}>
                <label className="payment-method-radio-label">
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div className="method-label-content">
                    <strong>Cash on Delivery (COD)</strong>
                    <span>Pay in cash or UPI when groceries arrive at your doorstep</span>
                  </div>
                </label>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <aside className="checkout-summary-column">
          <div className="order-summary-card">
            <h2 className="summary-card-title">Order Summary</h2>

            {/* Selected delivery preview */}
            <div className="summary-slot-preview">
              <span className="slot-clock-icon">🕒</span>
              <div>
                <strong>{selectedSlot.day}, {selectedSlot.time}</strong>
                <span>Estimated arrival in 15-25 minutes</span>
              </div>
            </div>

            {/* Line items mini-list */}
            <div className="summary-items-list">
              <span className="summary-items-count-heading">
                Items ({bill.itemsCount}):
              </span>
              <ul className="summary-mini-items">
                {items.map((item) => (
                  <li key={item.lineItemId} className="mini-item-row">
                    <span className="mini-item-title">
                      {item.emoji} {item.name} × {item.quantity}
                    </span>
                    <span className="mini-item-price">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bill Details */}
            <div className="summary-bill-rows">
              <div className="sum-row">
                <span>Item Total</span>
                <span>{formatCurrency(bill.itemTotal)}</span>
              </div>
              {bill.mrpSavings > 0 && (
                <div className="sum-row savings">
                  <span>Product Savings</span>
                  <span>-{formatCurrency(bill.mrpSavings)}</span>
                </div>
              )}
              {bill.couponDiscount > 0 && (
                <div className="sum-row savings">
                  <span>Coupon Discount ({bill.appliedCoupon?.code})</span>
                  <span>-{formatCurrency(bill.couponDiscount)}</span>
                </div>
              )}
              <div className="sum-row">
                <span>Delivery Fee</span>
                <span>
                  {bill.deliveryFee === 0 ? (
                    <span className="free-badge">FREE</span>
                  ) : (
                    formatCurrency(bill.deliveryFee)
                  )}
                </span>
              </div>
              <div className="sum-row sum-total-row">
                <strong>Total Amount</strong>
                <strong className="final-sum-price">{formatCurrency(bill.finalTotal)}</strong>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              className="btn-place-order-final"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Placing your order...</span>
              ) : (
                <>
                  <span>Place Order</span>
                  <span className="pay-amount-pill">{formatCurrency(bill.finalTotal)}</span>
                </>
              )}
            </button>

            <p className="order-safety-guarantee">
              🔒 Safe & Secure 256-bit Encrypted Checkout. Supermart 100% Freshness Guarantee.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
};

