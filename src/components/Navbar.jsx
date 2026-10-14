import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, Calendar, ShieldCheck, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          Stay<span>Finder</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links desktop-only">
          <Link to="/" className={location.pathname === '/' ? 'active-link' : ''}>
            Home
          </Link>
          <Link to="/search" className={location.pathname === '/search' ? 'active-link' : ''}>
            Find Stays
          </Link>
          {isAuthenticated && (
            <Link to="/my-bookings" className={location.pathname === '/my-bookings' ? 'active-link' : ''}>
              My Bookings
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className={`admin-badge-link ${location.pathname.startsWith('/admin') ? 'active-link' : ''}`}>
              <ShieldCheck size={16} /> Admin Portal
            </Link>
          )}
        </div>

        {/* Desktop Auth Section */}
        <div className="nav-auth desktop-only">
          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/profile" className="profile-chip">
                <div className="avatar-circle">
                  <User size={16} />
                </div>
                <span className="user-name">{user?.fullName?.split(' ')[0] || 'Profile'}</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn" title="Sign Out">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-link">
                Sign In
              </Link>
              <Link to="/register" className="register-btn">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <Link to="/" onClick={closeMenu} className="mobile-nav-link">
            Home
          </Link>
          <Link to="/search" onClick={closeMenu} className="mobile-nav-link">
            Find Stays
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/my-bookings" onClick={closeMenu} className="mobile-nav-link">
                <Calendar size={18} /> My Bookings
              </Link>
              <Link to="/profile" onClick={closeMenu} className="mobile-nav-link">
                <User size={18} /> My Profile ({user?.fullName})
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={closeMenu} className="mobile-nav-link admin-nav-link">
                  <ShieldCheck size={18} /> Admin Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="mobile-logout-btn">
                <LogOut size={18} /> Sign Out
              </button>
            </>
          ) : (
            <div className="mobile-auth-stack">
              <Link to="/login" onClick={closeMenu} className="mobile-login-btn">
                Sign In
              </Link>
              <Link to="/register" onClick={closeMenu} className="mobile-register-btn">
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
