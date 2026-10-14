import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Users,
} from 'lucide-react';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setError('Could not retrieve bookings list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await adminService.updateBookingStatus(id, newStatus);
      await fetchBookings();
    } catch (err) {
      alert('Failed to update booking status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.propertyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userEmail?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="manage-bookings-page">
      <div className="manage-header-row">
        <div>
          <h1>Manage All Bookings</h1>
          <p>Supervise reservations, verify guest records, and update status lifecycles.</p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="table-controls-bar">
        <div className="search-input-wrapper">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by reference, guest name, email, or property..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-select-wrapper">
          <Filter size={16} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading all bookings..." />
      ) : error ? (
        <div className="admin-error-box">
          <p>{error}</p>
          <button onClick={fetchBookings} className="retry-btn">
            Retry
          </button>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Guest</th>
                <th>Property & Room</th>
                <th>Dates</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Admin Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td>
                    <code className="booking-ref-badge">{b.bookingReference}</code>
                  </td>
                  <td>
                    <div className="table-user-cell">
                      <strong>{b.userName}</strong>
                      <span>{b.userEmail}</span>
                      {b.userPhone && <small>{b.userPhone}</small>}
                    </div>
                  </td>
                  <td>
                    <div className="table-prop-cell">
                      <strong>{b.propertyName}</strong>
                      <span>{b.roomType} ({b.guestCount} guests)</span>
                      <small className="cell-loc">
                        <MapPin size={12} /> {b.propertyCity}
                      </small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{b.checkIn} → {b.checkOut}</span>
                      <small className="sub-nights">({b.numberOfNights} nights)</small>
                    </div>
                  </td>
                  <td>
                    <div className="table-amt-cell">
                      <strong>₹{Number(b.totalAmount).toLocaleString('en-IN')}</strong>
                      <small>Tax: ₹{Number(b.taxAmount).toLocaleString('en-IN')}</small>
                    </div>
                  </td>
                  <td>
                    <span className={`table-status-pill status-${b.status?.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <div className="status-action-select-wrapper">
                      <select
                        value={b.status}
                        disabled={updatingId === b.id}
                        onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                        className="status-dropdown"
                      >
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
