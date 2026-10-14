import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setError('Could not retrieve your bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id, ref) => {
    const confirmed = window.confirm(`Are you sure you want to cancel booking ${ref}? This cannot be undone.`);
    if (!confirmed) return;

    setCancellingId(id);
    try {
      await bookingService.cancelBooking(id);
      await fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed.');
    } finally {
      setCancellingId(null);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'UPCOMING') return b.status === 'CONFIRMED' && b.checkIn >= todayStr;
    if (activeTab === 'PAST') return b.status === 'COMPLETED' || (b.status === 'CONFIRMED' && b.checkIn < todayStr);
    if (activeTab === 'CANCELLED') return b.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="my-bookings-page">
      <div className="page-header-container">
        <h1>My Reservations & Bookings</h1>
        <p>Track your upcoming vacations, past stays, and manage reservations.</p>
      </div>

      {/* Booking Filter Tabs */}
      <div className="bookings-tabs-bar">
        {[
          { key: 'ALL', label: `All Stays (${bookings.length})` },
          {
            key: 'UPCOMING',
            label: `Upcoming (${bookings.filter((b) => b.status === 'CONFIRMED' && b.checkIn >= todayStr).length})`,
          },
          {
            key: 'PAST',
            label: `Past / Completed (${bookings.filter((b) => b.status === 'COMPLETED' || (b.status === 'CONFIRMED' && b.checkIn < todayStr)).length})`,
          },
          {
            key: 'CANCELLED',
            label: `Cancelled (${bookings.filter((b) => b.status === 'CANCELLED').length})`,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`booking-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bookings-list-container">
        {loading ? (
          <LoadingSpinner message="Loading your reservation history..." />
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchBookings} className="retry-btn">
              Retry
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="empty-bookings-box">
            <Calendar size={48} className="empty-cal-icon" />
            <h3>No bookings found in this category</h3>
            <p>Ready to plan your next getaway? Discover beautiful stays at the best rates.</p>
            <Link to="/search" className="explore-stays-btn">
              Explore Available Stays <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="bookings-cards-grid">
            {filteredBookings.map((b) => {
              const canCancel = b.status === 'CONFIRMED' && b.checkIn > todayStr;
              return (
                <div key={b.id} className="booking-record-card">
                  <div className="booking-card-top">
                    <div className="booking-ref-block">
                      <span className="ref-title">Booking Reference:</span>
                      <strong className="ref-code">{b.bookingReference}</strong>
                    </div>

                    <div className={`status-pill status-${b.status?.toLowerCase()}`}>
                      {b.status === 'CONFIRMED' && <CheckCircle size={14} />}
                      {b.status === 'CANCELLED' && <XCircle size={14} />}
                      {b.status === 'COMPLETED' && <Clock size={14} />}
                      <span>{b.status}</span>
                    </div>
                  </div>

                  <div className="booking-card-body">
                    {b.propertyImageUrl && (
                      <img
                        src={b.propertyImageUrl}
                        alt={b.propertyName}
                        className="booking-prop-thumb"
                      />
                    )}

                    <div className="booking-info-middle">
                      <h3>{b.propertyName}</h3>
                      <p className="booking-prop-loc">
                        <MapPin size={14} /> {b.propertyCity}
                      </p>
                      <p className="booking-room-type">
                        Room Category: <strong>{b.roomType}</strong> ({b.guestCount} Guest(s))
                      </p>
                    </div>

                    <div className="booking-dates-box">
                      <div className="date-item">
                        <span className="d-label">Check-In</span>
                        <strong className="d-val">{b.checkIn}</strong>
                      </div>
                      <div className="date-arrow">→</div>
                      <div className="date-item">
                        <span className="d-label">Check-Out</span>
                        <strong className="d-val">{b.checkOut}</strong>
                      </div>
                      <span className="nights-count">{b.numberOfNights} night(s)</span>
                    </div>

                    <div className="booking-pricing-box">
                      <span className="price-tag-title">Total Paid</span>
                      <span className="price-tag-num">
                        ₹{Number(b.totalAmount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="booking-card-footer">
                    <span className="booked-timestamp">
                      Booked on: {new Date(b.createdAt).toLocaleDateString()}
                    </span>

                    <div className="footer-actions">
                      <Link to={`/stays/${b.propertyId}`} className="view-property-link">
                        View Property
                      </Link>

                      {canCancel && (
                        <button
                          onClick={() => handleCancelBooking(b.id, b.bookingReference)}
                          disabled={cancellingId === b.id}
                          className="cancel-booking-btn"
                        >
                          {cancellingId === b.id ? 'Cancelling...' : 'Cancel Reservation'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
