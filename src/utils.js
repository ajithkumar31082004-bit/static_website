/**
 * Utility functions for Supermart
 */

// Format numbers as Indian Rupee (₹)
export const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return inrFormatter.format(Math.round(amount));
};

// Calculate percentage discount
export const calculateDiscount = (price, mrp) => {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};

// Free delivery threshold in ₹
export const FREE_DELIVERY_THRESHOLD = 499;
export const STANDARD_DELIVERY_FEE = 40;

// Valid mock coupons
export const AVAILABLE_COUPONS = [
  {
    code: 'SAVE50',
    description: 'Flat ₹50 OFF on orders above ₹299',
    minOrder: 299,
    type: 'flat',
    value: 50,
  },
  {
    code: 'FREEDEL',
    description: 'Free delivery on your order',
    minOrder: 199,
    type: 'free_delivery',
    value: 40,
  },
  {
    code: 'SUPER100',
    description: 'Flat ₹100 OFF on orders above ₹799',
    minOrder: 799,
    type: 'flat',
    value: 100,
  },
  {
    code: 'FRESH20',
    description: '20% OFF (up to ₹120) on orders above ₹499',
    minOrder: 499,
    type: 'percent',
    percent: 20,
    maxDiscount: 120,
  },
];

// Bill calculation helper
export const calculateBill = (items = [], couponCode = '') => {
  const itemTotal = items.reduce((sum, item) => {
    const unitPrice = item.selectedUnit?.price ?? item.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const mrpTotal = items.reduce((sum, item) => {
    const unitMrp = item.selectedUnit?.mrp ?? item.mrp ?? item.price;
    return sum + unitMrp * item.quantity;
  }, 0);

  const mrpSavings = Math.max(0, mrpTotal - itemTotal);

  // Delivery fee calculation
  let deliveryFee = itemTotal === 0 ? 0 : itemTotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;

  // Coupon evaluation
  let couponDiscount = 0;
  let appliedCoupon = null;
  let couponError = null;

  if (couponCode) {
    const cleanCode = couponCode.trim().toUpperCase();
    const found = AVAILABLE_COUPONS.find((c) => c.code === cleanCode);

    if (!found) {
      couponError = `Coupon "${couponCode}" is invalid`;
    } else if (itemTotal < found.minOrder) {
      couponError = `Add ₹${found.minOrder - itemTotal} more to apply ${found.code}`;
    } else {
      appliedCoupon = found;
      if (found.type === 'flat') {
        couponDiscount = found.value;
      } else if (found.type === 'percent') {
        const calculated = Math.round((itemTotal * found.percent) / 100);
        couponDiscount = Math.min(calculated, found.maxDiscount);
      } else if (found.type === 'free_delivery') {
        couponDiscount = deliveryFee;
        deliveryFee = 0;
      }
    }
  }

  // Amount needed for free delivery
  const amountForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - itemTotal);
  const freeDeliveryProgress = Math.min(100, Math.round((itemTotal / FREE_DELIVERY_THRESHOLD) * 100));

  const totalDiscount = mrpSavings + couponDiscount;
  const finalTotal = Math.max(0, itemTotal - couponDiscount + deliveryFee);

  return {
    itemTotal,
    mrpTotal,
    mrpSavings,
    deliveryFee,
    couponDiscount,
    appliedCoupon,
    couponError,
    amountForFreeDelivery,
    freeDeliveryProgress,
    totalDiscount,
    finalTotal,
    itemsCount: items.reduce((sum, i) => sum + i.quantity, 0),
  };
};

// Delivery Slots Generator
export const getDeliverySlots = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (d) => {
    return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return [
    {
      id: 'express',
      day: 'Today',
      dayLabel: `Today (${formatDate(today)})`,
      time: '15-25 Mins',
      tag: 'Lightning Fast ⚡',
      type: 'express',
    },
    {
      id: 'today-morning',
      day: 'Today',
      dayLabel: `Today (${formatDate(today)})`,
      time: '7:00 AM - 9:00 AM',
      tag: 'Morning Slot',
      type: 'standard',
    },
    {
      id: 'today-afternoon',
      day: 'Today',
      dayLabel: `Today (${formatDate(today)})`,
      time: '12:00 PM - 2:00 PM',
      tag: 'Midday Slot',
      type: 'standard',
    },
    {
      id: 'today-evening',
      day: 'Today',
      dayLabel: `Today (${formatDate(today)})`,
      time: '6:00 PM - 8:00 PM',
      tag: 'Evening Slot',
      type: 'standard',
    },
    {
      id: 'tomorrow-morning',
      day: 'Tomorrow',
      dayLabel: `Tomorrow (${formatDate(tomorrow)})`,
      time: '7:00 AM - 9:00 AM',
      tag: 'Fresh Morning Slot',
      type: 'standard',
    },
    {
      id: 'tomorrow-afternoon',
      day: 'Tomorrow',
      dayLabel: `Tomorrow (${formatDate(tomorrow)})`,
      time: '12:00 PM - 2:00 PM',
      tag: 'Midday Slot',
      type: 'standard',
    },
    {
      id: 'tomorrow-evening',
      day: 'Tomorrow',
      dayLabel: `Tomorrow (${formatDate(tomorrow)})`,
      time: '6:00 PM - 8:00 PM',
      tag: 'Evening Slot',
      type: 'standard',
    },
  ];
};

// Local storage helper with error fallback
export const storage = {
  get: (key, defaultValue) => {
    try {
      const item = localStorage.getItem(`supermart_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(`supermart_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage set failed', e);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(`supermart_${key}`);
    } catch (e) {
      console.warn('Storage remove failed', e);
    }
  },
};

// Generate Order ID like "SM-84920"
export const generateOrderId = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `SM-${randomNum}`;
};

// Debounce helper
export const debounce = (fn, delay = 250) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

