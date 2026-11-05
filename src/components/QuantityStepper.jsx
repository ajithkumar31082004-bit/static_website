import React from 'react';

export const QuantityStepper = ({
  quantity = 0,
  onIncrease,
  onDecrease,
  max = 99,
  size = 'normal',
  itemName = 'item',
}) => {
  if (quantity <= 0) {
    return (
      <button
        type="button"
        className={`stepper-add-btn stepper-btn-${size}`}
        onClick={onIncrease}
        aria-label={`Add ${itemName} to cart`}
      >
        <span className="stepper-plus-icon">+</span>
        <span>ADD</span>
      </button>
    );
  }

  return (
    <div className={`quantity-stepper stepper-${size}`} role="group" aria-label={`Quantity for ${itemName}`}>
      <button
        type="button"
        className="stepper-btn stepper-btn-dec"
        onClick={onDecrease}
        aria-label={`Decrease quantity of ${itemName}`}
      >
        −
      </button>
      <span className="stepper-value" aria-live="polite" aria-atomic="true">
        {quantity}
      </span>
      <button
        type="button"
        className="stepper-btn stepper-btn-inc"
        onClick={onIncrease}
        disabled={quantity >= max}
        aria-label={`Increase quantity of ${itemName}`}
      >
        +
      </button>
    </div>
  );
};

