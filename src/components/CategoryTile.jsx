import React from 'react';
import { Link } from 'react-router-dom';

export const CategoryTile = ({ category }) => {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="category-tile"
      aria-label={`Browse ${category.name}`}
    >
      <div
        className="category-tile-icon-box"
        style={{
          backgroundColor: category.color || '#e8f5e9',
          color: category.accentColor || '#1b6b43',
        }}
      >
        <span className="category-tile-emoji" role="img" aria-label={category.name}>
          {category.icon}
        </span>
      </div>
      <span className="category-tile-name">{category.name}</span>
    </Link>
  );
};

