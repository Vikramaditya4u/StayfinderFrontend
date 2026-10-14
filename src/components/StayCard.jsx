import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Wifi, Wind, Waves, Coffee } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

export default function StayCard({ stay }) {
  if (!stay) return null;

  const amenitiesList = stay.amenities
    ? stay.amenities.split(',').map((a) => a.trim()).slice(0, 3)
    : [];

  return (
    <div className="stay-card">
      <div className="stay-image-container">
        <img
          src={stay.imageUrl || FALLBACK_IMAGE}
          alt={stay.name}
          className="stay-card-img"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
          loading="lazy"
        />
        <div className="stay-badge-group">
          <span className="type-badge">{stay.propertyType}</span>
          {stay.featured && <span className="featured-badge">Featured</span>}
        </div>
        <div className="rating-pill">
          <Star size={14} className="star-icon fill-current" />
          <span>{stay.rating?.toFixed(1) || '4.5'}</span>
        </div>
      </div>

      <div className="stay-info">
        <div className="stay-location">
          <MapPin size={14} />
          <span>{stay.city}</span>
        </div>

        <h3 className="stay-title" title={stay.name}>
          {stay.name}
        </h3>

        {amenitiesList.length > 0 && (
          <div className="amenities-preview">
            {amenitiesList.map((item, idx) => (
              <span key={idx} className="amenity-chip">
                {item}
              </span>
            ))}
          </div>
        )}

        <div className="stay-footer">
          <div className="stay-price-box">
            <span className="price-label">Starting from</span>
            <span className="price-value">
              ₹{stay.minPricePerNight ? Number(stay.minPricePerNight).toLocaleString('en-IN') : '2,500'}
              <small>/night</small>
            </span>
          </div>

          <Link to={`/stays/${stay.id}`} className="view-details-btn">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
