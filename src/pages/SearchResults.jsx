import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { stayService } from '../services/stayService';
import StayCard from '../components/StayCard';
import FilterSidebar from '../components/FilterSidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, SlidersHorizontal, MapPin, Calendar, Users, X } from 'lucide-react';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();

  const cityParam = searchParams.get('city') || '';
  const propertyTypeParam = searchParams.get('propertyType') || '';
  const minRatingParam = searchParams.get('minRating') || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const sortByParam = searchParams.get('sortBy') || 'recommended';

  const checkInParam = searchParams.get('checkIn') || '';
  const checkOutParam = searchParams.get('checkOut') || '';
  const guestsParam = searchParams.get('guests') || '2';

  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Search filter state
  const [filters, setFilters] = useState({
    city: cityParam,
    propertyType: propertyTypeParam,
    minRating: minRatingParam,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    sortBy: sortByParam,
  });

  // Sync url params when filters change
  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);

    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    const resetState = {
      city: '',
      propertyType: '',
      minRating: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'recommended',
    };
    setFilters(resetState);
    setSearchParams({});
  };

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          city: cityParam || undefined,
          propertyType: propertyTypeParam || undefined,
          minRating: minRatingParam ? parseFloat(minRatingParam) : undefined,
          minPrice: minPriceParam ? parseFloat(minPriceParam) : undefined,
          maxPrice: maxPriceParam ? parseFloat(maxPriceParam) : undefined,
          sortBy: sortByParam || 'recommended',
        };
        const data = await stayService.getStays(params);
        setStays(data);
      } catch (err) {
        console.error('Failed to load search results:', err);
        setError('Unable to fetch accommodations. Please check connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [cityParam, propertyTypeParam, minRatingParam, minPriceParam, maxPriceParam, sortByParam]);

  return (
    <div className="search-results-page">
      {/* Search Header Banner */}
      <div className="search-header-banner">
        <div className="search-header-container">
          <div className="search-query-summary">
            <h1>
              {cityParam ? `Stays in "${cityParam}"` : 'All Accommodations'}
            </h1>
            <div className="search-meta-tags">
              {cityParam && (
                <span className="meta-tag">
                  <MapPin size={14} /> {cityParam}
                </span>
              )}
              {checkInParam && checkOutParam && (
                <span className="meta-tag">
                  <Calendar size={14} /> {checkInParam} to {checkOutParam}
                </span>
              )}
              <span className="meta-tag">
                <Users size={14} /> {guestsParam} Guest(s)
              </span>
            </div>
          </div>

          <div className="search-sort-bar">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="sort-select"
            >
              <option value="recommended">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Guest Rating</option>
            </select>

            <button
              className="mobile-filter-btn"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="search-layout-container">
        {/* Desktop Sidebar */}
        <div className="sidebar-column desktop-only">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Modal */}
        {mobileFilterOpen && (
          <div className="mobile-filter-modal-backdrop">
            <div className="mobile-filter-modal">
              <div className="modal-header">
                <h3>Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
              />
              <button
                className="apply-filters-btn"
                onClick={() => setMobileFilterOpen(false)}
              >
                Apply & View ({stays.length} results)
              </button>
            </div>
          </div>
        )}

        {/* Results List Column */}
        <div className="results-column">
          <div className="results-count-bar">
            <span>Showing <strong>{stays.length}</strong> available accommodation(s)</span>
          </div>

          {loading ? (
            <LoadingSpinner message="Searching verified stays matching your criteria..." />
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="retry-btn">
                Retry Search
              </button>
            </div>
          ) : stays.length === 0 ? (
            <div className="no-results-state">
              <div className="no-results-icon">
                <Search size={48} />
              </div>
              <h3>No stays matched your criteria</h3>
              <p>Try adjusting your search destination, loosening filters, or resetting price range.</p>
              <button onClick={handleResetFilters} className="reset-search-btn">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="results-grid">
              {stays.map((stay) => (
                <StayCard key={stay.id} stay={stay} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
