/**
 * Supermart Mock API Client
 * Clean async interface wrapping product data and localStorage operations.
 * Can be swapped with real HTTP endpoints without changing UI components.
 */

import { PRODUCTS } from './data/products.js';
import { CATEGORIES } from './data/categories.js';
import { storage, generateOrderId } from './utils.js';

// Realistic network delay simulator
const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

// Initial seed orders for realistic "Buy Again" and "Orders" history
const SEED_ORDERS = [
  {
    id: 'SM-81249',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Delivered',
    slot: { day: 'Today', time: '7:00 AM - 9:00 AM', tag: 'Morning Slot' },
    address: {
      fullName: 'Priya Sharma',
      phone: '9876543210',
      flat: 'Flat 402, Green Glen Layout',
      street: 'Outer Ring Road, Bellandur',
      city: 'Bengaluru',
      pincode: '560103',
      type: 'Home',
    },
    paymentMethod: 'UPI (Google Pay)',
    items: [
      {
        id: 'de-1',
        name: 'Amul Taaza Homogenised Toned Milk',
        emoji: '🥛',
        category: 'dairy-eggs',
        selectedUnit: { unit: '1 Litre Tetra Pack', price: 74, mrp: 78 },
        quantity: 2,
        price: 74,
      },
      {
        id: 'fv-1',
        name: 'Fresh Hybrid Tomatoes (Tamatar)',
        emoji: '🍅',
        category: 'fruits-vegetables',
        selectedUnit: { unit: '1 kg', price: 32, mrp: 45 },
        quantity: 1,
        price: 32,
      },
      {
        id: 'st-1',
        name: 'Aashirvaad Shudh Chakki Whole Wheat Atta',
        emoji: '🌾',
        category: 'staples',
        selectedUnit: { unit: '5 kg bag', price: 245, mrp: 295 },
        quantity: 1,
        price: 245,
      },
      {
        id: 'sn-1',
        name: "Haldiram's Nagpur Bhujia Sev",
        emoji: '🥨',
        category: 'snacks',
        selectedUnit: { unit: '200 g pouch', price: 62, mrp: 75 },
        quantity: 2,
        price: 62,
      },
    ],
    bill: {
      itemTotal: 549,
      deliveryFee: 0,
      couponDiscount: 50,
      finalTotal: 499,
      couponCode: 'SAVE50',
    },
  },
  {
    id: 'SM-79512',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Delivered',
    slot: { day: 'Tomorrow', time: '12:00 PM - 2:00 PM', tag: 'Midday Slot' },
    address: {
      fullName: 'Priya Sharma',
      phone: '9876543210',
      flat: 'Flat 402, Green Glen Layout',
      street: 'Outer Ring Road, Bellandur',
      city: 'Bengaluru',
      pincode: '560103',
      type: 'Home',
    },
    paymentMethod: 'Cash on Delivery',
    items: [
      {
        id: 'fv-2',
        name: 'Fresh Red Onions (Pyaaz)',
        emoji: '🧅',
        category: 'fruits-vegetables',
        selectedUnit: { unit: '1 kg', price: 44, mrp: 58 },
        quantity: 1,
        price: 44,
      },
      {
        id: 'de-3',
        name: 'Farm Fresh Brown Eggs (Pack of 12)',
        emoji: '🥚',
        category: 'dairy-eggs',
        selectedUnit: { unit: 'Pack of 12', price: 135, mrp: 165 },
        quantity: 1,
        price: 135,
      },
      {
        id: 'bev-1',
        name: 'Tata Tea Gold Leaf & Dust Blend',
        emoji: '☕',
        category: 'beverages',
        selectedUnit: { unit: '500 g pouch', price: 245, mrp: 290 },
        quantity: 1,
        price: 245,
      },
    ],
    bill: {
      itemTotal: 424,
      deliveryFee: 40,
      couponDiscount: 0,
      finalTotal: 464,
      couponCode: '',
    },
  },
];

/**
 * Fetch all categories
 */
export const getCategories = async () => {
  await delay(100);
  return [...CATEGORIES];
};

/**
 * Fetch single category by slug
 */
export const getCategoryBySlug = async (slug) => {
  await delay(100);
  return CATEGORIES.find((c) => c.slug === slug) || null;
};

/**
 * Fetch products with flexible filtering and sorting
 */
export const getProducts = async (filters = {}) => {
  await delay(150);
  const {
    category,
    search,
    minPrice,
    maxPrice,
    inStockOnly,
    onOfferOnly,
    tag,
    sort,
    limit,
  } = filters;

  let results = [...PRODUCTS];

  // Category filter
  if (category && category !== 'all') {
    results = results.filter((p) => p.category === category);
  }

  // Tag filter
  if (tag) {
    results = results.filter((p) => p.tags && p.tags.includes(tag));
  }

  // Search keyword filter
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q))) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // Price range filters
  if (minPrice !== undefined && minPrice !== null) {
    results = results.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice !== undefined && maxPrice !== null && Number(maxPrice) > 0) {
    results = results.filter((p) => p.price <= Number(maxPrice));
  }

  // Stock filter
  if (inStockOnly) {
    results = results.filter((p) => p.stock > 0);
  }

  // Offer/Discount filter
  if (onOfferOnly) {
    results = results.filter((p) => p.mrp > p.price);
  }

  // Sorting
  if (sort) {
    switch (sort) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        results.sort((a, b) => {
          const discA = ((a.mrp - a.price) / a.mrp) * 100;
          const discB = ((b.mrp - b.price) / b.mrp) * 100;
          return discB - discA;
        });
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        results.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
    }
  }

  // Limit
  if (limit && limit > 0) {
    results = results.slice(0, limit);
  }

  return results;
};

/**
 * Fetch product by ID
 */
export const getProductById = async (id) => {
  await delay(120);
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) {
    throw new Error(`Product with ID "${id}" was not found`);
  }
  return { ...product };
};

/**
 * Featured products for homepage
 */
export const getFeaturedProducts = async (limit = 8) => {
  return getProducts({ tag: 'featured', limit });
};

/**
 * Deals today
 */
export const getDealsToday = async (limit = 8) => {
  return getProducts({ tag: 'deals-today', limit });
};

/**
 * Buy again products (from past orders or curated staples)
 */
export const getBuyAgainProducts = async (limit = 8) => {
  const orders = await getPastOrders();
  const pastIds = new Set();
  orders.forEach((o) => o.items.forEach((item) => pastIds.add(item.id)));

  let matched = PRODUCTS.filter((p) => pastIds.has(p.id));
  if (matched.length < 4) {
    const staples = PRODUCTS.filter((p) => p.tags.includes('buy-again'));
    matched = [...new Set([...matched, ...staples])];
  }
  return matched.slice(0, limit);
};

/**
 * Similar products (same category, different id)
 */
export const getSimilarProducts = async (productId, category, limit = 4) => {
  await delay(120);
  return PRODUCTS.filter(
    (p) => p.id !== productId && p.category === category
  ).slice(0, limit);
};

/**
 * Live search suggestions with top matches and matching categories
 */
export const searchSuggestions = async (query) => {
  if (!query || query.trim().length === 0) return { products: [], categories: [] };
  const q = query.trim().toLowerCase();

  const matchingCategories = CATEGORIES.filter(
    (c) => c.name.toLowerCase().includes(q) || c.slug.includes(q)
  );

  const matchingProducts = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(q))) ||
      p.category.toLowerCase().includes(q)
  ).slice(0, 5);

  return {
    categories: matchingCategories,
    products: matchingProducts,
  };
};

/**
 * Place order (stored in localStorage)
 */
export const placeOrder = async (orderData) => {
  await delay(400); // Simulate network transaction
  const orderId = generateOrderId();
  const newOrder = {
    id: orderId,
    createdAt: new Date().toISOString(),
    status: 'Order Placed',
    estimatedDelivery: 'Today within 25 mins',
    ...orderData,
  };

  const existingOrders = storage.get('orders', SEED_ORDERS);
  const updatedOrders = [newOrder, ...existingOrders];
  storage.set('orders', updatedOrders);

  return newOrder;
};

/**
 * Get all past orders
 */
export const getPastOrders = async () => {
  await delay(150);
  const stored = storage.get('orders', null);
  if (!stored) {
    storage.set('orders', SEED_ORDERS);
    return SEED_ORDERS;
  }
  return stored;
};

/**
 * Get single order by ID
 */
export const getOrderById = async (orderId) => {
  await delay(120);
  const orders = await getPastOrders();
  return orders.find((o) => o.id === orderId) || null;
};

