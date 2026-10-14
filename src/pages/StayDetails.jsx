import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { stayService } from '../services/stayService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  MapPin,
  Star,
  Users,
  CheckCircle,
  Calendar,
  ShieldCheck,
  Award,
  Sparkles,
  Bed,
  MessageSquare,
  Send,
  AlertCircle,
} from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

export default function StayDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [stay, setStay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking selector state
  const getToday = () => new Date().toISOString().split('T')[0];
  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  };

  const [checkIn, setCheckIn] = useState(getToday());
  const [checkOut, setCheckOut] = useState(getTomorrow());
  const [guestCount, setGuestCount] = useState(2);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Review state
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchStay = async () => {
      setLoading(true);
      try {
        const data = await stayService.getStayById(id);
        setStay(data);
        if (data.rooms && data.rooms.length > 0) {
          setSelectedRoomId(data.rooms[0].id);
        }
        if (data.reviews) {
          setReviews(data.reviews);
        }
      } catch (err) {
        console.error('Failed to load stay details:', err);
        setError('Could not load accommodation details.');
      } finally {
        setLoading(false);
      }
    };

    fetchStay();
  }, [id]);

  // Check room availability whenever room or dates change
  useEffect(() => {
    if (!stay || !selectedRoomId || !checkIn || !checkOut) return;

    const check = async () => {
      setCheckingAvailability(true);
      try {
        const res = await stayService.checkAvailability(stay.id, selectedRoomId, checkIn, checkOut, 1);
        setAvailabilityStatus(res);
      } catch (err) {
        console.warn('Availability check failed:', err);
        setAvailabilityStatus(null);
      } finally {
        setCheckingAvailability(false);
      }
    };

    check();
  }, [stay, selectedRoomId, checkIn, checkOut]);

  const handleProceedToBooking = () => {
    if (!selectedRoomId) {
      alert('Please select a room type first');
      return;
    }
    navigate(`/booking/${stay.id}?roomId=${selectedRoomId}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guestCount}`);
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      const added = await stayService.addReview(stay.id, {
        rating: Number(newRating),
        comment: newComment.trim(),
      });
      setReviews([added, ...reviews]);
      setNewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading stay details..." />;
  }

  if (error || !stay) {
    return (
      <div className="error-container">
        <h2>Stay Not Found</h2>
        <p>{error || 'The requested accommodation does not exist.'}</p>
        <Link to="/search" className="back-link">
          Browse All Stays
        </Link>
      </div>
    );
  }

  const selectedRoom = stay.rooms?.find((r) => r.id === selectedRoomId) || stay.rooms?.[0];
  const amenitiesList = stay.amenities ? stay.amenities.split(',').map((a) => a.trim()) : [];

  return (
    <div className="stay-details-page">
      {/* Top Header */}
      <div className="stay-details-header">
        <div className="header-meta">
          <span className="type-badge-large">{stay.propertyType}</span>
          <div className="rating-pill-large">
            <Star size={16} className="star-icon fill-current" />
            <span>{stay.rating?.toFixed(1)}</span>
            <small>({reviews.length} reviews)</small>
          </div>
        </div>

        <h1 className="stay-main-title">{stay.name}</h1>

        <div className="stay-location-bar">
          <MapPin size={18} className="pin-icon" />
          <span>{stay.address}, {stay.city}</span>
        </div>
      </div>

      {/* Gallery */}
      <div className="stay-gallery">
        <div className="gallery-main-img-wrapper">
          <img
            src={stay.imageUrl || FALLBACK_IMAGE}
            alt={stay.name}
            className="gallery-main-img"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
        </div>
      </div>

      {/* Two Column Layout: Details vs Booking Card */}
      <div className="details-layout-container">
        {/* Left Column: Details, Rooms, Amenities, Reviews */}
        <div className="details-left-col">
          {/* Overview */}
          <section className="details-card">
            <h2>About this stay</h2>
            <p className="stay-description-text">{stay.description}</p>
          </section>

          {/* Amenities */}
          <section className="details-card">
            <h2>Popular Amenities</h2>
            <div className="amenities-grid-detailed">
              {amenitiesList.map((amenity, idx) => (
                <div key={idx} className="amenity-item-detailed">
                  <CheckCircle size={18} className="amenity-check-icon" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Available Rooms */}
          <section className="details-card" id="rooms">
            <h2>Available Room Types</h2>
            <p className="section-note">Select your preferred room to calculate exact pricing and reserve.</p>

            <div className="rooms-selection-list">
              {stay.rooms?.map((room) => {
                const isSelected = selectedRoomId === room.id;
                return (
                  <div
                    key={room.id}
                    className={`room-option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedRoomId(room.id)}
                  >
                    <div className="room-info-left">
                      <div className="room-type-title">
                        <Bed size={20} />
                        <h3>{room.roomType}</h3>
                      </div>
                      <p className="room-desc">{room.description}</p>
                      <div className="room-specs">
                        <span>
                          <Users size={14} /> Max Capacity: {room.capacity} Guests
                        </span>
                        <span>
                          <ShieldCheck size={14} /> Free Cancellation Available
                        </span>
                      </div>
                    </div>

                    <div className="room-pricing-right">
                      <span className="room-price">
                        ₹{Number(room.pricePerNight).toLocaleString('en-IN')}
                        <small>/night</small>
                      </span>
                      <button
                        className={`select-room-radio ${isSelected ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRoomId(room.id);
                        }}
                      >
                        {isSelected ? 'Selected' : 'Choose Room'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Guest Reviews Section */}
          <section className="details-card" id="reviews">
            <div className="reviews-card-header">
              <h2>Guest Reviews & Feedback</h2>
              <div className="reviews-stat-badge">
                <Star size={16} className="star-icon fill-current" />
                <span>{stay.rating?.toFixed(1)} / 5.0</span>
                <small>({reviews.length} ratings)</small>
              </div>
            </div>

            {/* Submit Review Form */}
            {isAuthenticated ? (
              <form onSubmit={handleAddReview} className="add-review-form">
                <h3>Write a Review</h3>
                {reviewSuccess && (
                  <div className="success-banner">
                    <CheckCircle size={16} /> Thank you! Your review was recorded successfully.
                  </div>
                )}
                <div className="review-rating-select">
                  <label>Your Rating:</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                  >
                    <option value="5">⭐⭐⭐⭐⭐ 5 - Exceptional</option>
                    <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                    <option value="3">⭐⭐⭐ 3 - Good</option>
                    <option value="2">⭐⭐ 2 - Fair</option>
                    <option value="1">⭐ 1 - Poor</option>
                  </select>
                </div>

                <textarea
                  placeholder="Share details of your experience, cleanliness, service, location..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  required
                />

                <button
                  type="submit"
                  disabled={submittingReview || !newComment.trim()}
                  className="submit-review-btn"
                >
                  <Send size={16} />
                  <span>{submittingReview ? 'Submitting...' : 'Post Guest Review'}</span>
                </button>
              </form>
            ) : (
              <div className="login-to-review-banner">
                <p>Have you stayed here? <Link to="/login">Sign in</Link> to share your review and experience.</p>
              </div>
            )}

            {/* Reviews List */}
            <div className="reviews-list">
              {reviews.length === 0 ? (
                <p className="no-reviews-note">No reviews posted yet. Be the first to review this stay!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="review-entry">
                    <div className="review-entry-top">
                      <div className="reviewer-avatar">
                        {rev.userName ? rev.userName[0].toUpperCase() : 'G'}
                      </div>
                      <div>
                        <h4>{rev.userName || 'Verified Guest'}</h4>
                        <div className="review-stars-small">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} size={12} className="star-icon fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="review-comment-text">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <aside className="details-right-col">
          <div className="booking-widget-card">
            <div className="widget-header">
              <div className="widget-price">
                <span className="price-num">
                  ₹{selectedRoom ? Number(selectedRoom.pricePerNight).toLocaleString('en-IN') : '0'}
                </span>
                <span className="price-unit">/ night</span>
              </div>
              <div className="widget-rating">
                <Star size={14} className="star-icon fill-current" />
                <span>{stay.rating?.toFixed(1)}</span>
              </div>
            </div>

            <div className="widget-date-selectors">
              <div className="date-field">
                <label>CHECK-IN</label>
                <input
                  type="date"
                  min={getToday()}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>

              <div className="date-field">
                <label>CHECK-OUT</label>
                <input
                  type="date"
                  min={checkIn}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>

            <div className="widget-guests-selector">
              <label>GUESTS</label>
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
              >
                {[...Array(selectedRoom?.capacity || 4)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} Guest{i > 0 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Indicator */}
            {checkingAvailability ? (
              <div className="availability-loading">
                <LoadingSpinner message="Checking real room inventory..." />
              </div>
            ) : availabilityStatus && (
              <div className={`availability-badge ${availabilityStatus.isAvailable ? 'available' : 'unavailable'}`}>
                {availabilityStatus.isAvailable ? (
                  <>
                    <CheckCircle size={16} />
                    <span>
                      Available! ({availabilityStatus.availableRooms} room(s) left)
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} />
                    <span>Sold out for selected dates. Try other dates.</span>
                  </>
                )}
              </div>
            )}

            {/* Price Estimate Breakdown */}
            {availabilityStatus && availabilityStatus.isAvailable && (
              <div className="widget-price-breakdown">
                <div className="breakdown-row">
                  <span>
                    ₹{Number(selectedRoom.pricePerNight).toLocaleString('en-IN')} × {availabilityStatus.numberOfNights} night(s)
                  </span>
                  <span>₹{Number(availabilityStatus.estimatedBasePrice).toLocaleString('en-IN')}</span>
                </div>
                <div className="breakdown-row">
                  <span>Taxes & GST (12%)</span>
                  <span>₹{Number(availabilityStatus.estimatedTax).toLocaleString('en-IN')}</span>
                </div>
                <div className="breakdown-row total-row">
                  <span>Estimated Total</span>
                  <span>₹{Number(availabilityStatus.estimatedTotal).toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleProceedToBooking}
              disabled={checkingAvailability || (availabilityStatus && !availabilityStatus.isAvailable)}
              className="widget-reserve-btn"
            >
              Reserve Room
            </button>

            <p className="widget-disclaimer">
              You won't be charged yet. Simulated payment for project demonstration.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
