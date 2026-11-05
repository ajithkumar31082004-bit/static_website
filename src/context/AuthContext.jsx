import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils.js';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  name: 'Priya Sharma',
  phone: '9876543210',
  email: 'priya.sharma@example.com',
  isVerified: true,
};

const DEFAULT_ADDRESSES = [
  {
    id: 'addr-1',
    fullName: 'Priya Sharma',
    phone: '9876543210',
    flat: 'Flat 402, Tower B, Green Glen Layout',
    street: 'Outer Ring Road, Bellandur',
    city: 'Bengaluru',
    pincode: '560103',
    type: 'Home',
    isDefault: true,
  },
  {
    id: 'addr-2',
    fullName: 'Priya Sharma',
    phone: '9876543210',
    flat: 'Ecospace Business Park, 4th Floor',
    street: 'Marathahalli - Sarjapur Outer Ring Rd',
    city: 'Bengaluru',
    pincode: '560103',
    type: 'Work',
    isDefault: false,
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.get('user', DEFAULT_USER));
  const [addresses, setAddresses] = useState(() => storage.get('addresses', DEFAULT_ADDRESSES));

  useEffect(() => {
    storage.set('user', user);
  }, [user]);

  useEffect(() => {
    storage.set('addresses', addresses);
  }, [addresses]);

  const login = (userData) => {
    const newUser = {
      name: userData.name || 'Valued Shopper',
      phone: userData.phone || '9876543210',
      email: userData.email || `${userData.phone || 'user'}@supermart.in`,
      isVerified: true,
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  const addAddress = (newAddr) => {
    const id = `addr-${Date.now()}`;
    const address = {
      ...newAddr,
      id,
      isDefault: addresses.length === 0 || !!newAddr.isDefault,
    };

    setAddresses((prev) => {
      let updated = [...prev];
      if (address.isDefault) {
        updated = updated.map((a) => ({ ...a, isDefault: false }));
      }
      return [address, ...updated];
    });
    return address;
  };

  const updateAddress = (id, updatedFields) => {
    setAddresses((prev) =>
      prev.map((addr) => {
        if (addr.id === id) {
          return { ...addr, ...updatedFields };
        }
        if (updatedFields.isDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      })
    );
  };

  const deleteAddress = (id) => {
    setAddresses((prev) => {
      const remaining = prev.filter((a) => a.id !== id);
      if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
        remaining[0].isDefault = true;
      }
      return remaining;
    });
  };

  const setDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const getDefaultAddress = () => {
    return addresses.find((a) => a.isDefault) || addresses[0] || null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        addresses,
        login,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        getDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

