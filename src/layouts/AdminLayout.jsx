import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Building2, CalendarDays, Users, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user } = useAuth();

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Shield size={24} className="admin-shield-icon" />
          <div>
            <h3>StayFinder</h3>
            <span className="admin-badge-tag">Admin Console</span>
          </div>
        </div>

        <div className="admin-user-info">
          <p className="admin-name">{user?.fullName}</p>
          <span className="admin-email">{user?.email}</span>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/stays" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Building2 size={18} />
            <span>Manage Stays</span>
          </NavLink>

          <NavLink to="/admin/bookings" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <CalendarDays size={18} />
            <span>Manage Bookings</span>
          </NavLink>

          <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Users size={18} />
            <span>Registered Users</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="back-to-site-btn">
            <ArrowLeft size={16} />
            <span>Back to Public Site</span>
          </Link>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <h2>Administration & Operations</h2>
          <div className="admin-status-indicator">
            <span className="status-dot"></span> Live System
          </div>
        </header>

        <div className="admin-content-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
