import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DeliverySlotStrip } from '../components/DeliverySlotStrip.jsx';
import { CategoryTile } from '../components/CategoryTile.jsx';
import { ProductRow } from '../components/ProductRow.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { Skeleton, CategoryTileSkeleton } from '../components/Skeleton.jsx';
import {
  getCategories,
  getDealsToday,
  getBuyAgainProducts,
  getFeaturedProducts,
} from '../api.js';

export const Home = () => {
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [buyAgain, setBuyAgain] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [catsData, dealsData, buyAgainData, featuredData] = await Promise.all([
          getCategories(),
          getDealsToday(8),
          getBuyAgainProducts(8),
          getFeaturedProducts(8),
        ]);

        if (isMounted) {
          setCategories(catsData);
          setDeals(dealsData);
          setBuyAgain(buyAgainData);
          setFeatured(featuredData);
        }
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadHomeData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="home-page-container">
      {/* 1. Delivery Slot Strip */}
      <DeliverySlotStrip />

      {/* Hero Banner Strip */}
      <section className="home-hero-banner" aria-label="Fresh Supermarket Offers">
        <div className="hero-content">
          <span className="hero-badge">🌿 100% FARM FRESH GUARANTEE</span>
          <h1 className="hero-title">
            Groceries delivered in <strong>15 minutes</strong>
          </h1>
          <p className="hero-subtitle">
            Hand-picked farm veggies, dairy essentials, staples & snacks at local mandi prices.
          </p>
          <div className="hero-cta-group">
            <Link to="/category/fruits-vegetables" className="btn-hero-primary">
              Shop Fresh Produce
            </Link>
            <div className="hero-perks">
              <span>✓ Free delivery over ₹499</span>
              <span>✓ No minimum order</span>
              <span>✓ Instant refunds</span>
            </div>
          </div>
        </div>
        <div className="hero-image-pane" aria-hidden="true">
          <div className="hero-emoji-cluster">
            <span className="hero-big-emoji float-1">🥦</span>
            <span className="hero-big-emoji float-2">🥛</span>
            <span className="hero-big-emoji float-3">🍎</span>
            <span className="hero-big-emoji float-4">🌾</span>
          </div>
        </div>
      </section>

      {/* 2. Category Tiles */}
      <section className="home-categories-section" aria-label="Browse by Category">
        <div className="section-header">
          <div className="section-title-wrap">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Everything your home needs, organized for quick shopping</p>
          </div>
        </div>

        <div className="category-tiles-grid">
          {loading
            ? Array.from({ length: 7 }).map((_, idx) => <CategoryTileSkeleton key={idx} />)
            : categories.map((cat) => <CategoryTile key={cat.id} category={cat} />)}
        </div>
      </section>

      {/* 3. Deals Today Row */}
      <ProductRow
        title="⚡ Deals of the Day"
        subtitle="Up to 40% OFF on daily staples, fruits, and snacks"
        badge="LIMITED TIME"
        viewAllLink="/category/all?filter=deals"
        products={deals}
        loading={loading}
      />

      {/* 4. Buy Again Row */}
      <ProductRow
        title="🔁 Buy Again"
        subtitle="Frequently purchased items from your pantry history"
        badge="YOUR STAPLES"
        viewAllLink="/orders"
        products={buyAgain}
        loading={loading}
      />

      {/* 5. Featured Products Grid */}
      <section className="featured-section" aria-label="Featured Products">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-badge">POPULAR CHOICES</span>
            <h2 className="section-title">Top Rated Groceries</h2>
            <p className="section-subtitle">Highest rated essentials trusted by thousands of Indian households</p>
          </div>
          <Link to="/category/all" className="view-all-link">
            <span>Explore All</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="products-grid">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} height="280px" borderRadius="12px" />)
            : featured.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </div>
  );
};

