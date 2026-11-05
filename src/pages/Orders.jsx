import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext.jsx';
import { formatCurrency } from '../utils.js';
import { Skeleton } from '../components/Skeleton.jsx';

export const Orders = () => {
  const { orders, loading, reorder } = useOrder();
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleExpand = (id) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Recently';
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="orders-page-container">
      <div className="orders-page-header">
        <h1 className="orders-page-title">My Orders</h1>
        <p className="orders-page-subtitle">
          Review your past grocery deliveries and reorder pantry essentials in 1-click.
        </p>
      </div>

      {loading ? (
        <div className="orders-list-loading">
          <Skeleton height="160px" borderRadius="12px" style={{ marginBottom: '1rem' }} />
          <Skeleton height="160px" borderRadius="12px" />
        </div>
      ) : orders.length === 0 ? (
        <div className="orders-empty-card">
          <span className="empty-orders-emoji" role="img" aria-label="No orders">
            📦
          </span>
          <h2>No Past Orders Yet</h2>
          <p>Once you place an order, you can track it and reorder your weekly groceries here.</p>
          <Link to="/" className="btn-start-order">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list-grid">
          {orders.map((order) => {
            const isExpanded = !!expandedOrders[order.id];
            const itemsCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

            return (
              <article key={order.id} className="order-history-card">
                {/* Header row */}
                <div className="order-card-header">
                  <div className="order-id-date-group">
                    <span className="order-card-id">{order.id}</span>
                    <span className="order-card-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <span className={`order-status-pill status-${(order.status || 'Delivered').toLowerCase().replace(' ', '-')}`}>
                    {order.status || 'Delivered'}
                  </span>
                </div>

                {/* Items preview preview row */}
                <div className="order-items-preview">
                  <div className="order-emojis-cluster">
                    {order.items.slice(0, 5).map((item, idx) => (
                      <span key={idx} className="preview-emoji-pill" title={item.name}>
                        {item.emoji}
                      </span>
                    ))}
                    {order.items.length > 5 && (
                      <span className="preview-more-badge">
                        +{order.items.length - 5}
                      </span>
                    )}
                  </div>
                  <div className="order-summary-text">
                    <span>
                      {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                    </span>
                    <span className="order-total-amount">
                      {formatCurrency(order.bill?.finalTotal || 0)}
                    </span>
                  </div>
                </div>

                {/* Expanded Details list */}
                {isExpanded && (
                  <div className="order-expanded-details">
                    <h3 className="expanded-heading">Items in this delivery</h3>
                    <ul className="expanded-items-list">
                      {order.items.map((item, i) => (
                        <li key={i} className="expanded-item-row">
                          <span className="expanded-emoji">{item.emoji}</span>
                          <div className="expanded-info">
                            <span className="expanded-name">{item.name}</span>
                            <span className="expanded-unit">
                              {item.selectedUnit?.unit || '1 unit'} × {item.quantity}
                            </span>
                          </div>
                          <span className="expanded-price">
                            {formatCurrency(
                              (item.selectedUnit?.price || item.price) * item.quantity
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="order-meta-info-grid">
                      <div>
                        <strong>Delivery Address:</strong>
                        <p>
                          {order.address?.flat}, {order.address?.street}, {order.address?.city} ({order.address?.pincode})
                        </p>
                      </div>
                      <div>
                        <strong>Payment:</strong>
                        <p>{order.paymentMethod || 'UPI'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card footer actions */}
                <div className="order-card-footer">
                  <button
                    type="button"
                    className="btn-toggle-details"
                    onClick={() => toggleExpand(order.id)}
                  >
                    {isExpanded ? 'Hide Details ▲' : 'View Details ▼'}
                  </button>

                  <button
                    type="button"
                    className="btn-reorder-primary"
                    onClick={() => reorder(order.id)}
                  >
                    <span>🔁 Reorder All</span>
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

