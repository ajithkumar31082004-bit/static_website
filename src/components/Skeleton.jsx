import React from 'react';

export const Skeleton = ({
  width = '100%',
  height = '1rem',
  borderRadius = '6px',
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`skeleton-box ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
      aria-hidden="true"
    />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="product-card skeleton-card" aria-hidden="true">
      <Skeleton height="140px" borderRadius="12px" />
      <div style={{ padding: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Skeleton width="40%" height="0.8rem" />
        <Skeleton width="90%" height="1.1rem" />
        <Skeleton width="50%" height="0.8rem" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <Skeleton width="60px" height="26px" borderRadius="4px" />
          <Skeleton width="75px" height="32px" borderRadius="8px" />
        </div>
      </div>
    </div>
  );
};

export const CategoryTileSkeleton = () => {
  return (
    <div className="category-tile skeleton-category" aria-hidden="true">
      <Skeleton width="64px" height="64px" borderRadius="50%" />
      <Skeleton width="80%" height="0.9rem" style={{ marginTop: '0.5rem' }} />
    </div>
  );
};

