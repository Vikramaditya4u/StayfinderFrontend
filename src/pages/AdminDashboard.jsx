import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Users,
  Building2,
  CalendarCheck,
  IndianRupee,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  PlusCircle,
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
        setError('Could not retrieve dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading administration metrics and real revenue totals..." />;
  }

  if (error || !stats) {
    return (
      <div className="admin-error-box">
        <p>{error || 'Failed to load dashboard metrics.'}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-view">
      <div className="dashboard-welcome-banner">
        <div>
          <h1>Operations Overview</h1>
          <p>Real-time analytics, booking revenue, room inventory, and registered guest tracking.</p>
        </div>
        <Link to="/admin/stays" className="admin-quick-add-btn">
          <PlusCircle size={18} /> Add New Property
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper kpi-revenue">
            <IndianRupee size={26} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Confirmed Revenue</span>
            <strong className="kpi-val">
              ₹{Number(stats.totalRevenue).toLocaleString('en-IN')}
            </strong>
            <span className="kpi-meta">From verified bookings</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper kpi-bookings">
            <CalendarCheck size={26} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Total Bookings</span>
            <strong className="kpi-val">{stats.totalBookings}</strong>
            <span className="kpi-meta">{stats.confirmedBookings} confirmed / {stats.cancelledBookings} cancelled</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper kpi-properties">
            <Building2 size={26} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Active Properties</span>
            <strong className="kpi-val">{stats.totalProperties}</strong>
            <span className="kpi-meta">Across premier cities</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper kpi-users">
            <Users size={26} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Registered Accounts</span>
            <strong className="kpi-val">{stats.totalUsers}</strong>
            <span className="kpi-meta">Guests & administrators</span>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="admin-section-card">
        <div className="admin-section-header">
          <div>
            <h3>Recent Booking Transactions</h3>
            <p>Latest reservations placed across the Stay Finder network</p>
          </div>
          <Link to="/admin/bookings" className="admin-view-all-link">
            Manage All Bookings <ArrowRight size={16} />
          </Link>
        </div>

        {stats.recentBookings.length === 0 ? (
          <p className="no-data-msg">No booking transactions recorded yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ref ID</th>
                  <th>Guest</th>
                  <th>Accommodation</th>
                  <th>Dates</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <code className="booking-ref-badge">{b.bookingReference}</code>
                    </td>
                    <td>
                      <div className="table-user-cell">
                        <strong>{b.userName}</strong>
                        <span>{b.userEmail}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-prop-cell">
                        <strong>{b.propertyName}</strong>
                        <span>{b.roomType}</span>
                      </div>
                    </td>
                    <td>
                      <span>{b.checkIn} to {b.checkOut}</span>
                      <small className="sub-nights">({b.numberOfNights} nights)</small>
                    </td>
                    <td>
                      <strong>₹{Number(b.totalAmount).toLocaleString('en-IN')}</strong>
                    </td>
                    <td>
                      <span className={`table-status-pill status-${b.status?.toLowerCase()}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
