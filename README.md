# Supermart 🛒 - Fresh Groceries Delivered in 15 Minutes

A complete, production-quality frontend application for an online supermarket designed specifically for Indian households ordering weekly groceries on mobile and desktop. Built with **React + Vite**, **React Router (HashRouter)**, and custom **plain CSS** (no external UI component libraries).

Prices are formatted in Indian Rupee (₹) using `Intl.NumberFormat('en-IN')`. The interface is fast to scan, lightweight, and easy to use with one hand on mobile devices.

---

## 🌟 Key Features & Pages

### 1. Pages & Routes
- **Home (`#/`)**: Delivery slot selection strip ("15 mins delivery"), interactive category tiles, "Deals of the Day" carousel, "Buy Again" past-order recommendations, and featured products grid.
- **Category & Search Results (`#/category/:slug` & `#/search?q=...`)**: Full product grid, sort dropdown (Price Low-to-High, High-to-Low, Highest Discount %, Customer Rating, Popularity), multi-faceted sidebar filters (Categories, Price range, In-stock only, Special offers only), active filter tags, and a friendly empty state.
- **Product Detail (`#/product/:id` pride-tested produce)**: Large image presentation area with emoji illustrations, multi-pack unit selector (e.g., 500 g, 1 kg, 2 kg saver packs), yellow price sticker with crossed MRP and savings badge, detailed description, shelf life, storage instructions, origin details, live stock indicator, quantity stepper, add-to-cart, wishlist toggle, and similar products row.
- **Cart (Drawer & Full Page `#/cart`)**: Accessible slide-out cart drawer from any page plus dedicated full-page cart. Features line items with unit displays, quantity steppers, remove button, promo code field (`SAVE50`, `SUPER100`, `FREEDEL`, `FRESH20`), free delivery progress bar (Free above ₹499, otherwise ₹40), and detailed bill breakdown (Item Total, Product Savings, Coupon Discount, Delivery Fee, Total Payable).
- **Checkout (`#/checkout`)**: 3-step checkout with address selection / new address form with Indian phone and 6-digit PIN code validation, delivery window picker (Today/Tomorrow express and standard slots), mock payment choices (UPI with Google Pay/PhonePe/Paytm/Custom UPI ID, Credit/Debit card, Cash on Delivery), and live order summary.
- **Order Success (`#/order-success/:orderId`)**: Order confirmation with generated Order ID (e.g., `SM-84920`), estimated delivery time tracker ("Arriving today within 15-25 mins") with milestone steps (*Order Placed* → *Packing* → *Out for Delivery* → *Delivered*), order breakdown, and quick action buttons.
- **Past Orders (`#/orders`)**: Delivery history with timestamps, status tags, item preview badges, bill totals, expandable line item details, and a 1-click **"Reorder All"** button that repopulates the cart with toast feedback.
- **Authentication & Profile (`#/login` & `#/profile`)**: Phone number / OTP mock authentication and 1-click Demo Login. Profile dashboard featuring saved delivery addresses management (add, edit, delete, set default) and quick links.
- **Wishlist (`#/wishlist`)**: Saved favorite groceries with 1-click "Move to Cart" and "Add All to Cart".
- **404 Page (`#/*`)**: Grocery-themed error screen with helpful return links.

### 2. State & Architecture
- **Global State**: React Context + `useReducer` for Cart, Wishlist, Authentication, and Orders. All states persist seamlessly to `localStorage`.
- **Live Search**: Debounced search (250ms) in the header with live suggestions categorized by matching categories and instant product results with prices.
- **Mock API Client (`src/api.js`)**: Clean async module (`getProducts`, `getProductById`, `getCategories`, `placeOrder`, `getPastOrders`) simulating realistic network latency. Can be swapped for a real REST or GraphQL backend simply by editing this single file.
- **Product Catalog (`src/data/products.js`)**: 44 authentic Indian grocery items across 7 categories (Fruits & Vegetables, Dairy & Eggs, Staples & Flours, Snacks & Munchies, Beverages & Chai, Household & Cleaning, Personal Care & Hygiene) with unit variations, MRPs, discounts, origin tags, and stock counts.

### 3. Design Direction & Accessibility
- **Fresh-Market Color Palette**:
  - Primary: Leaf Green (`#1b6b43`)
  - Accent / Price Stickers & Cart Button: Sunny Yellow (`#ffd23f`)
  - Background: Pale Mint (`#edf5ef`)
  - Typography: Deep Ink (`#16241c`)
  - Discounts & Alerts: Red (`#d62f3a`)
- **Typography**: Google Fonts *Bricolage Grotesque* for headings and prices; *DM Sans* for body text.
- **Accessibility**: Semantic HTML (`<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`), visible `:focus-visible` outlines, ARIA attributes on icon buttons, screen-reader friendly live alerts, and `prefers-reduced-motion` compliance.

---

## 📁 Project Structure

```text
src/
├── api.js                   # Async API layer for products, search & orders
├── App.jsx                  # Main application shell, routes & layout
├── components/
│   ├── CartDrawer.jsx       # Global slide-out shopping cart drawer
│   ├── CategoryTile.jsx     # Category icon card
│   ├── DeliverySlotStrip.jsx# Top delivery location & slot strip
│   ├── FilterPanel.jsx      # Multi-criteria filter sidebar & mobile sheet
│   ├── Header.jsx           # Sticky desktop/mobile header with live search & cart pill
│   ├── ProductCard.jsx      # Product card with price sticker & stepper
│   ├── ProductRow.jsx       # Horizontal scrollable product row
│   ├── QuantityStepper.jsx  # Accessible +/- quantity stepper
│   ├── SearchBar.jsx        # Live debounced autocomplete search bar
│   ├── Skeleton.jsx         # Loading skeleton shimmers
│   └── TabBar.jsx           # Fixed bottom navigation bar for mobile
├── context/
│   ├── AuthContext.jsx      # User profile & saved addresses (localStorage)
│   ├── CartContext.jsx      # Cart items, quantities, coupon logic & bill
│   ├── OrderContext.jsx     # Order placement & reorder actions
│   ├── ToastContext.jsx     # Toast notification dispatcher
│   └── WishlistContext.jsx  # Saved favorite items (localStorage)
├── data/
│   ├── categories.js        # 7 grocery categories with metadata
│   └── products.js          # 44 Indian grocery products with unit options
├── index.css                # Plain CSS design system & responsive rules
├── main.jsx                 # React root bootstrap with HashRouter
└── utils.js                 # Currency (₹), slots, coupon & bill helpers
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18 or higher recommended; verified on Node v22)
- npm (v9 or higher)

### Installation & Development Server
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Open your browser at `http://localhost:5173` (or the port shown in your terminal).

---

## 📦 Production Build

To compile the application into a static production bundle:

```bash
npm run build
```

This generates an optimized static bundle in the `dist/` directory with:
- `dist/index.html`
- `dist/assets/*.js`
- `dist/assets/*.css`

To preview the production build locally:
```bash
npm run preview
```

---

## ☁️ AWS S3 Static Hosting Deployment

The project is pre-configured for AWS S3 static website hosting:
1. `vite.config.js` sets `base: "./"` so all asset references are relative.
2. `src/main.jsx` uses `HashRouter` (`#/route`) so page reloads on S3 work immediately without requiring custom CloudFront 404 rewriting rules.

### Deploy Steps Using AWS CLI

```bash
# 1. Build the production assets
npm run build

# 2. Sync files to your AWS S3 bucket
aws s3 cp dist/ s3://YOUR-SUPERMART-BUCKET-NAME/ --recursive

# 3. (Optional) Set index document if configuring S3 Static Website Hosting
aws s3 website s3://YOUR-SUPERMART-BUCKET-NAME/ --index-document index.html --error-document index.html
```

Your Supermart storefront is now live on AWS S3!

