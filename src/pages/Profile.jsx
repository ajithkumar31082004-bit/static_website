import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const Profile = () => {
  const {
    user,
    isAuthenticated,
    addresses,
    logout,
    addAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAuth();
  const { bill } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    flat: '',
    street: '',
    city: 'Bengaluru',
    pincode: '560103',
    type: 'Home',
    isDefault: false,
  });

  const handleLogout = () => {
    logout();
    showToast('You have been signed out', 'info');
    navigate('/login');
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.phone || !newAddr.flat || !newAddr.pincode) {
      showToast('Please fill all mandatory fields', 'error');
      return;
    }
    addAddress(newAddr);
    setShowAddModal(false);
    showToast('New address saved!', 'success');
    setNewAddr({
      fullName: user?.name || '',
      phone: user?.phone || '',
      flat: '',
      street: '',
      city: 'Bengaluru',
      pincode: '560103',
      type: 'Home',
      isDefault: false,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="profile-logged-out-card">
        <span className="profile-lock-icon">👤</span>
        <h2>Sign In to View Your Profile</h2>
        <p>Access your saved addresses, past orders, and custom preferences.</p>
        <Link to="/login" className="btn-go-login">
          Sign In / Register
        </Link>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      {/* Profile Header Card */}
      <div className="profile-header-card">
        <div className="profile-avatar-large">
          {(user?.name || 'P')[0].toUpperCase()}
        </div>
        <div className="profile-details-info">
          <h1 className="profile-name">{user?.name || 'Valued Shopper'}</h1>
          <span className="profile-phone">+91 {user?.phone}</span>
          <span className="profile-email">{user?.email}</span>
        </div>
        <button
          type="button"
          className="btn-profile-logout"
          onClick={handleLogout}
        >
          Sign Out
        </button>
      </div>

      {/* Quick Summary Cards */}
      <div className="profile-stats-grid">
        <Link to="/orders" className="profile-stat-card">
          <span className="stat-emoji">📦</span>
          <div className="stat-text">
            <strong>Past Orders</strong>
            <span>View recent deliveries</span>
          </div>
        </Link>

        <Link to="/wishlist" className="profile-stat-card">
          <span className="stat-emoji">❤️</span>
          <div className="stat-text">
            <strong>My Wishlist</strong>
            <span>{wishlistCount} saved essentials</span>
          </div>
        </Link>

        <Link to="/cart" className="profile-stat-card">
          <span className="stat-emoji">🛒</span>
          <div className="stat-text">
            <strong>Active Cart</strong>
            <span>{bill.itemsCount} items in basket</span>
          </div>
        </Link>
      </div>

      {/* Saved Addresses Section */}
      <section className="profile-addresses-section" aria-labelledby="saved-addresses-heading">
        <div className="section-header">
          <div className="section-title-wrap">
            <h2 id="saved-addresses-heading" className="section-title">Saved Delivery Addresses</h2>
            <p className="section-subtitle">Manage where your fresh orders are delivered</p>
          </div>
          <button
            type="button"
            className="btn-add-address-profile"
            onClick={() => setShowAddModal(true)}
          >
            + Add New Address
          </button>
        </div>

        <div className="profile-addresses-grid">
          {addresses.map((addr) => (
            <div key={addr.id} className={`profile-addr-card ${addr.isDefault ? 'default' : ''}`}>
              <div className="addr-tag-row">
                <span className="addr-type-pill">{addr.type}</span>
                {addr.isDefault ? (
                  <span className="default-pill">Default Address</span>
                ) : (
                  <button
                    type="button"
                    className="btn-set-default"
                    onClick={() => {
                      setDefaultAddress(addr.id);
                      showToast(`Set ${addr.type} as default address`, 'success');
                    }}
                  >
                    Set as Default
                  </button>
                )}
              </div>

              <h3 className="addr-recipient">{addr.fullName}</h3>
              <p className="addr-street-line">
                {addr.flat}, {addr.street}
              </p>
              <p className="addr-city-line">
                {addr.city} - {addr.pincode}
              </p>
              <span className="addr-contact">Contact: +91 {addr.phone}</span>

              <div className="addr-card-actions">
                <button
                  type="button"
                  className="btn-delete-addr"
                  onClick={() => {
                    deleteAddress(addr.id);
                    showToast('Address deleted', 'info');
                  }}
                  disabled={addresses.length === 1}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add Address Modal */}
      {showAddModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowAddModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Delivery Address</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveAddress} className="modal-body-form">
              <div className="field-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  value={newAddr.fullName}
                  onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                />
              </div>

              <div className="field-group">
                <label>10-Digit Mobile Number *</label>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                />
              </div>

              <div className="field-group">
                <label>House / Flat / Floor / Building *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 304, Green Palms"
                  value={newAddr.flat}
                  onChange={(e) => setNewAddr({ ...newAddr, flat: e.target.value })}
                />
              </div>

              <div className="field-group">
                <label>Street / Area / Landmark *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 12th Main, Indiranagar"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                />
              </div>

              <div className="field-group-row">
                <div className="field-group">
                  <label>City *</label>
                  <input
                    type="text"
                    required
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  />
                </div>
                <div className="field-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Address Type</label>
                <div className="address-type-radios">
                  {['Home', 'Work', 'Other'].map((t) => (
                    <label key={t} className="radio-pill-label">
                      <input
                        type="radio"
                        name="modal_addr_type"
                        checked={newAddr.type === t}
                        onChange={() => setNewAddr({ ...newAddr, type: t })}
                      />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save-addr-primary">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

