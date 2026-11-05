import React, { useState } from 'react';
import { getDeliverySlots } from '../utils.js';
import { useAuth } from '../context/AuthContext.jsx';

export const DeliverySlotStrip = () => {
  const { getDefaultAddress } = useAuth();
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const slots = getDeliverySlots();
  const [selectedSlot, setSelectedSlot] = useState(slots[0]);

  const defaultAddr = getDefaultAddress();
  const locality = defaultAddr ? `${defaultAddr.city} (${defaultAddr.pincode})` : 'Indiranagar, Bengaluru (560103)';

  return (
    <>
      <section className="delivery-slot-strip" aria-label="Delivery information">
        <div className="slot-strip-container">
          <div className="slot-strip-left">
            <span className="slot-flash-badge">⚡ 15 MINS</span>
            <div className="slot-info-text">
              <span className="slot-address-label">Delivering to <strong>{locality}</strong></span>
              <span className="slot-divider" aria-hidden="true">•</span>
              <span className="slot-time-label">
                Slot: <strong>{selectedSlot.day}, {selectedSlot.time}</strong>
              </span>
            </div>
          </div>
          <button
            type="button"
            className="slot-change-btn"
            onClick={() => setIsSlotModalOpen(true)}
            aria-label="Change delivery slot"
          >
            Change Slot
          </button>
        </div>
      </section>

      {/* Delivery Slot Selection Modal */}
      {isSlotModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsSlotModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="slot-modal-title"
        >
          <div className="modal-dialog slot-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 id="slot-modal-title" className="modal-title">Select Delivery Window</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsSlotModalOpen(false)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-subtitle">
                Choose when you would like your fresh groceries delivered:
              </p>
              <div className="slots-grid">
                {slots.map((slot) => {
                  const isSelected = selectedSlot.id === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      className={`slot-card-choice ${isSelected ? 'slot-card-selected' : ''}`}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setIsSlotModalOpen(false);
                      }}
                    >
                      <div className="slot-card-header">
                        <span className="slot-day-pill">{slot.day}</span>
                        {slot.tag && <span className="slot-tag-badge">{slot.tag}</span>}
                      </div>
                      <div className="slot-time-text">{slot.time}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

