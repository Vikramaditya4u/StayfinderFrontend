import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { stayService } from '../services/stayService';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Calendar,
  Users,
  MapPin,
  ShieldCheck,
  CheckCircle,
  CreditCard,
  AlertCircle,
  ArrowLeft,
  Bed,
} from 'lucide-react';

export default function Booking() {
  const { stayId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const roomId = searchParams.get('roomId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = parseInt(searchParams.get('guests') || '2', 10);

  const [stay, setStay] = useState(null);
  const [room, setRoom] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Simulated guest details state
  const [guestName, setGuestName] = useState(user?.fullName || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: { from: { pathname: `/booking/${stayId}?${searchParams.toString()}` } },
      });
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const stayData = await stayService.getStayById(stayId);
        setStay(stayData);

        const selectedRoom = stayData.rooms?.find((r) => r.id === Number(roomId)) || stayData.rooms?.[0];
        setRoom(selectedRoom);

        if (selectedRoom) {
          const avail = await stayService.checkAvailability(
            stayId,
            selectedRoom.id,
            checkIn,
            checkOut,
            1
          );
          setAvailability(avail);
        }
      } catch (err) {
        console.error('Failed to load booking info:', err);
        setError(err.response?.data?.message || 'Could not load booking details.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [stayId, roomId, checkIn, checkOut, isAuthenticated]);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!room) return;

    setBookingLoading(true);
    setError(null);

    try {
      const response = await bookingService.createBooking({
        roomId: room.id,
        checkIn: checkIn,
        checkOut: checkOut,
        guestCount: guests,
        numberOfRooms: 1,
      });

      setConfirmedBooking(response);
    } catch (err) {
      console.error('Booking failed:', err);
      setError(err.response?.data?.message || 'Reservation could not be processed. Room may no longer be available.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Calculating validated pricing and room inventory..." />;
  }

  // Confirmation Success State
  if (confirmedBooking) {
    return (
      <div className="booking-confirmation-container">
        <div className="confirmation-card">
          <div className="confirmation-icon-circle">
            <CheckCircle size={48} className="text-emerald-500" />
          </div>
          <h2>Booking Confirmed!</h2>
          <p className="confirmation-subtitle">
            Your reservation has been secured. A confirmation record has been generated.
          </p>

          <div className="confirmation-ref-box">
            <span className="ref-label">Booking Reference</span>
            <span className="ref-number">{confirmedBooking.bookingReference}</span>
          </div>

          <div className="confirmation-details-grid">
            <div className="conf-detail">
              <span className="label">Accommodation:</span>
              <span className="val">{confirmedBooking.propertyName}</span>
            </div>
            <div className="conf-detail">
              <span className="label">Room Category:</span>
              <span className="val">{confirmedBooking.roomType}</span>
            </div>
            <div className="conf-detail">
              <span className="label">Check-in:</span>
              <span className="val">{confirmedBooking.checkIn}</span>
            </div>
            <div className="conf-detail">
              <span className="label">Check-out:</span>
              <span className="val">{confirmedBooking.checkOut}</span>
            </div>
            <div className="conf-detail">
              <span className="label">Duration:</span>
              <span className="val">{confirmedBooking.numberOfNights} Night(s)</span>
            </div>
            <div className="conf-detail">
              <span className="label">Total Paid (Demo):</span>
              <span className="val total-val">₹{Number(confirmedBooking.totalAmount).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="confirmation-actions">
            <Link to="/my-bookings" className="conf-btn-primary">
              View My Bookings
            </Link>
            <Link to="/" className="conf-btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page-container">
      <div className="booking-header">
        <Link to={`/stays/${stayId}`} className="back-to-stay-link">
          <ArrowLeft size={16} /> Back to Property Details
        </Link>
        <h1>Confirm & Secure Your Stay</h1>
      </div>

      {error && (
        <div className="booking-error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="booking-grid-layout">
        {/* Left Column: Guest Details & Demo Payment */}
        <div className="booking-form-col">
          <form onSubmit={handleConfirmBooking} className="booking-checkout-form">
            <section className="checkout-section">
              <h3>1. Guest Information</h3>
              <div className="form-row-2">
                <div className="field-block">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                  />
                </div>
                <div className="field-block">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field-block">
                <label>Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                />
              </div>

              <div className="field-block">
                <label>Special Requests (Optional)</label>
                <textarea
                  placeholder="Early check-in, high floor, quiet room, dietary requests..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={2}
                />
              </div>
            </section>

            <section className="checkout-section">
              <div className="payment-section-header">
                <h3>2. Payment Method</h3>
                <span className="demo-sim-badge">Simulated Demo Checkout</span>
              </div>
              <p className="payment-note">
                This project runs in academic demo mode. No actual debit or credit card charges will occur.
              </p>

              <div className="demo-card-selection">
                <div className="demo-card-item active">
                  <CreditCard size={20} className="demo-card-icon" />
                  <div>
                    <strong>Simulated Instant Pay (Technical Training Demo)</strong>
                    <p>Instant confirmation with test authorization token</p>
                  </div>
                </div>
              </div>
            </section>

            <button
              type="submit"
              disabled={bookingLoading || (availability && !availability.isAvailable)}
              className="confirm-booking-submit-btn"
            >
              {bookingLoading ? 'Processing Reservation...' : `Confirm & Reserve for ₹${availability ? Number(availability.estimatedTotal).toLocaleString('en-IN') : '...'}`}
            </button>
          </form>
        </div>

        {/* Right Column: Reservation Summary */}
        <aside className="booking-summary-col">
          <div className="reservation-summary-card">
            <h3>Reservation Summary</h3>

            {stay && (
              <div className="summary-property-header">
                <img
                  src={stay.imageUrl}
                  alt={stay.name}
                  className="summary-img"
                />
                <div>
                  <span className="summary-type">{stay.propertyType}</span>
                  <h4>{stay.name}</h4>
                  <p className="summary-loc">
                    <MapPin size={13} /> {stay.city}
                  </p>
                </div>
              </div>
            )}

            <div className="summary-details-list">
              <div className="summary-row">
                <span className="summary-label">
                  <Bed size={15} /> Room Type:
                </span>
                <span className="summary-val">{room?.roomType}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">
                  <Calendar size={15} /> Check-In:
                </span>
                <span className="summary-val">{checkIn}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">
                  <Calendar size={15} /> Check-Out:
                </span>
                <span className="summary-val">{checkOut}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">
                  <Users size={15} /> Guests:
                </span>
                <span className="summary-val">{guests} Guest(s)</span>
              </div>
            </div>

            {/* Price Itemization */}
            {availability && (
              <div className="summary-pricing-itemization">
                <h4>Price Itemization</h4>
                <div className="item-row">
                  <span>
                    ₹{Number(room.pricePerNight).toLocaleString('en-IN')} × {availability.numberOfNights} night(s)
                  </span>
                  <span>₹{Number(availability.estimatedBasePrice).toLocaleString('en-IN')}</span>
                </div>
                <div className="item-row">
                  <span>Hospitality Tax & GST (12%)</span>
                  <span>₹{Number(availability.estimatedTax).toLocaleString('en-IN')}</span>
                </div>
                <div className="item-row total-item-row">
                  <span>Total Amount</span>
                  <span className="total-accent">
                    ₹{Number(availability.estimatedTotal).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}

            <div className="summary-guarantees">
              <p>
                <ShieldCheck size={16} /> Free cancellation eligible prior to check-in
              </p>
              <p>
                <CheckCircle size={16} /> Instant booking confirmation reference
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
