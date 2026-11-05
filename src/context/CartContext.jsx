import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { storage, calculateBill } from '../utils.js';

const CartContext = createContext(null);

const STORAGE_KEY = 'cart';

const initialState = {
  items: storage.get(STORAGE_KEY, []),
  appliedCouponCode: storage.get('coupon', ''),
  isDrawerOpen: false,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, unit, quantity = 1 } = action.payload;
      const selectedUnit = unit || (product.unitOptions && product.unitOptions[0]) || {
        unit: '1 standard',
        price: product.price,
        mrp: product.mrp,
      };

      const lineItemId = `${product.id}__${selectedUnit.unit}`;
      const existingIndex = state.items.findIndex((item) => item.lineItemId === lineItemId);

      let newItems;
      if (existingIndex > -1) {
        newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        };
      } else {
        newItems = [
          ...state.items,
          {
            lineItemId,
            id: product.id,
            name: product.name,
            emoji: product.emoji,
            category: product.category,
            stock: product.stock,
            selectedUnit,
            price: selectedUnit.price,
            mrp: selectedUnit.mrp,
            quantity,
          },
        ];
      }
      return { ...state, items: newItems };
    }

    case 'UPDATE_QUANTITY': {
      const { lineItemId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.lineItemId !== lineItemId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.lineItemId === lineItemId ? { ...item, quantity } : item
        ),
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.lineItemId !== action.payload.lineItemId),
      };
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
        appliedCouponCode: '',
      };
    }

    case 'APPLY_COUPON': {
      return {
        ...state,
        appliedCouponCode: action.payload.couponCode.trim().toUpperCase(),
      };
    }

    case 'REMOVE_COUPON': {
      return {
        ...state,
        appliedCouponCode: '',
      };
    }

    case 'SET_DRAWER_OPEN': {
      return {
        ...state,
        isDrawerOpen: action.payload,
      };
    }

    case 'REORDER_ITEMS': {
      // Reorders a list of items from a past order
      const incoming = action.payload.items;
      const mergedMap = new Map();

      state.items.forEach((item) => mergedMap.set(item.lineItemId, { ...item }));
      incoming.forEach((item) => {
        const lineItemId = item.lineItemId || `${item.id}__${item.selectedUnit?.unit || 'default'}`;
        if (mergedMap.has(lineItemId)) {
          const current = mergedMap.get(lineItemId);
          mergedMap.set(lineItemId, {
            ...current,
            quantity: current.quantity + (item.quantity || 1),
          });
        } else {
          mergedMap.set(lineItemId, {
            ...item,
            lineItemId,
            price: item.selectedUnit?.price || item.price,
            mrp: item.selectedUnit?.mrp || item.mrp || item.price,
          });
        }
      });

      return {
        ...state,
        items: Array.from(mergedMap.values()),
        isDrawerOpen: true,
      };
    }

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Sync with localStorage
  useEffect(() => {
    storage.set(STORAGE_KEY, state.items);
  }, [state.items]);

  useEffect(() => {
    storage.set('coupon', state.appliedCouponCode);
  }, [state.appliedCouponCode]);

  // Derived calculations
  const bill = calculateBill(state.items, state.appliedCouponCode);

  const addItem = (product, unit, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, unit, quantity } });
  };

  const updateQuantity = (lineItemId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { lineItemId, quantity } });
  };

  const removeItem = (lineItemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { lineItemId } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const applyCoupon = (couponCode) => {
    dispatch({ type: 'APPLY_COUPON', payload: { couponCode } });
  };

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
  };

  const setIsDrawerOpen = (isOpen) => {
    dispatch({ type: 'SET_DRAWER_OPEN', payload: isOpen });
  };

  const reorderItems = (items) => {
    dispatch({ type: 'REORDER_ITEMS', payload: { items } });
  };

  // Helper to get total quantity of a product across units or specific unit
  const getItemQuantity = (productId, unitName = null) => {
    if (unitName) {
      const lineItemId = `${productId}__${unitName}`;
      const found = state.items.find((i) => i.lineItemId === lineItemId);
      return found ? found.quantity : 0;
    }
    return state.items
      .filter((i) => i.id === productId)
      .reduce((sum, i) => sum + i.quantity, 0);
  };

  // Find line item for a product + unit
  const getLineItem = (productId, unitName = null) => {
    if (unitName) {
      return state.items.find((i) => i.id === productId && i.selectedUnit?.unit === unitName);
    }
    return state.items.find((i) => i.id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        appliedCouponCode: state.appliedCouponCode,
        isDrawerOpen: state.isDrawerOpen,
        bill,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        setIsDrawerOpen,
        reorderItems,
        getItemQuantity,
        getLineItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

