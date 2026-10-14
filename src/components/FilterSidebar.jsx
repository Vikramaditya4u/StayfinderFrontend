import React from 'react';
import { Filter, RotateCcw, Star } from 'lucide-react';

export default function FilterSidebar({
  filters,
  onFilterChange,
  onResetFilters,
}) {
  const propertyTypes = ['All', 'Hotel', 'Resort', 'Villa', 'Apartment'];

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <div className="filter-title">
          <Filter size={18} />
          <h3>Filter Stays</h3>
        </div>
        <button onClick={onResetFilters} className="reset-filter-btn" title="Reset all filters">
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Property Type */}
      <div className="filter-group">
        <label className="filter-group-title">Property Type</label>
        <div className="filter-options">
          {propertyTypes.map((type) => (
            <label key={type} className="radio-label">
              <input
                type="radio"
                name="propertyType"
                checked={(filters.propertyType || 'All') === type}
                onChange={() => onFilterChange('propertyType', type === 'All' ? '' : type)}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="filter-group">
        <label className="filter-group-title">Guest Rating</label>
        <div className="filter-options">
          {[
            { label: 'Any Rating', val: '' },
            { label: '4.5+ Exceptional', val: '4.5' },
            { label: '4.0+ Very Good', val: '4.0' },
            { label: '3.5+ Good', val: '3.5' },
          ].map((item) => (
            <label key={item.label} className="radio-label">
              <input
                type="radio"
                name="minRating"
                checked={(filters.minRating || '') === item.val}
                onChange={() => onFilterChange('minRating', item.val)}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <label className="filter-group-title">Price Range (per night)</label>
        <div className="price-inputs">
          <div className="price-input-wrapper">
            <span className="currency-prefix">₹</span>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              min="0"
              step="500"
            />
          </div>
          <span className="price-sep">to</span>
          <div className="price-input-wrapper">
            <span className="currency-prefix">₹</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              min="0"
              step="500"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
