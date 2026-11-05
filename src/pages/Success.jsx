import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../api.js';
import { formatCurrency } from '../utils.js';
import { Skeleton } from '../components/Skeleton.jsx';

export const Success = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getOrderById(orderId)
      .then((data) => {
        if (isMounted) setOrder(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="success-loading-container">
        <Skeleton width="60%" height="2rem" style={{ margin: '2rem auto' }} />
        <Skeleton height="300px" borderRadius="16px" />
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="order-success-card">
        {/* Confetti & Success Icon */}
        <div className="success-icon-banner">
          <div className="success-checkmark-circle" aria-hidden="true">
            ✓
          </div>
          <span className="celebration-emoji" aria-hidden="true">🎉</span>
        </div>

        <h1 className="success-headline">Order Placed Successfully!</h1>
        <p className="success-subtext">
          Thank you for shopping with Supermart. We are packing your fresh groceries right now.
        </p>

        {/* Order Reference Pill */}
        <div className="order-ref-pill">
          <span className="ref-label">Order ID:</span>
          <strong className="ref-id">{orderId}</strong>
        </div>

        {/* Live Delivery Progress Tracker */}
        <div className="live-delivery-tracker" aria-label="Order Tracking Status">
          <h2 className="tracker-heading">Delivery Status</h2>
          <div className="tracker-eta-badge">
            ⚡ Estimated Delivery: <strong>Today within 15-25 minutes</strong>
          </div>

          <div className="tracking-steps-row">
            <div className="track-step step-complete">
              <div className="step-circle">✓</div>
              <span className="step-title">Order Placed</span>
            </div>
            <div className="track-line active" />
            <div className="track-step step-active">
              <div className="step-circle">📦</div>
              <span className="step-title">Packing Order</span>
            </div>
            <div className="track-line" />
            <div className="track-step">
              <div className="step-circle">🛵</div>
              <span className="step-title">Out for Delivery</span>
            </div>
            <div className="track-line" />
            <div className="track-step">
              <div className="step-circle">🏠</div>
              <span className="step-title">Delivered</span>
            </div>
          </div>
        </div>

        {/* Order Details Breakdown */}
        {order && (
          <div className="success-order-details-box">
            <div className="details-col">
              <h3>Delivery Slot</h3>
              <p>
                <strong>{order.slot?.day || 'Today'}</strong>, {order.slot?.time || '15-25 Mins'}
              </p>
            </div>

            <div className="details-col">
              <h3>Delivery Address</h3>
              <p>
                {order.address?.flat}, {order.address?.street},{' '}
                {order.address?.city} - {order.address?.pincode}
              </p>
            </div>

            <div className="details-col">
              <h3>Payment Method</h3>
              <p>{order.paymentMethod || 'UPI'}</p>
            </div>

            <div className="details-col">
              <h3>Total Paid</h3>
              <p className="paid-total">
                {formatCurrency(order.bill?.finalTotal || 0)}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="success-actions-row">
          <Link to="/orders" className="btn-view-orders-link">
            View All Past Orders
          </Link>
          <Link to="/" className="btn-continue-shopping-primary">
            Continue Shopping Groceries →
          </Link>
        </div>
      </div>
    </div>
  );
};

