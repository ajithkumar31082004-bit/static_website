import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPastOrders, placeOrder as apiPlaceOrder } from '../api.js';
import { useCart } from './CartContext.jsx';
import { useToast } from './ToastContext.jsx';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { reorderItems } = useCart();
  const { showToast } = useToast();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getPastOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load past orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const createOrder = async (orderData) => {
    const placed = await apiPlaceOrder(orderData);
    setOrders((prev) => [placed, ...prev]);
    return placed;
  };

  const reorder = (orderId) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return false;

    reorderItems(target.items);
    showToast(`Added ${target.items.length} items from order #${orderId} to cart!`, 'success');
    return true;
  };

  const getOrder = (orderId) => {
    return orders.find((o) => o.id === orderId) || null;
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        createOrder,
        reorder,
        getOrder,
        refreshOrders: loadOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

