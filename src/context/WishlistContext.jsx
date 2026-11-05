import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils.js';

const WishlistContext = createContext(null);

const STORAGE_KEY = 'wishlist';

export const WishlistProvider = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState(() => storage.get(STORAGE_KEY, ['fv-4', 'sn-4']));

  useEffect(() => {
    storage.set(STORAGE_KEY, wishlistIds);
  }, [wishlistIds]);

  const toggleWishlist = (productId) => {
    let isAdded = false;
    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        isAdded = false;
        return prev.filter((id) => id !== productId);
      } else {
        isAdded = true;
        return [...prev, productId];
      }
    });
    return isAdded;
  };

  const isInWishlist = (productId) => wishlistIds.includes(productId);

  const removeFromWishlist = (productId) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        count: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

