import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Shield, Award, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            Stay<span>Finder</span>
          </div>
          <p className="footer-tagline">
            Discover verified hotels, scenic resorts, and boutique luxury stays across premier destinations with instant booking confirmation.
          </p>
          <div className="footer-badges">
            <span className="trust-badge">
              <Shield size={14} /> Verified Stays
            </span>
            <span className="trust-badge">
              <Award size={14} /> Best Price Guarantee
            </span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Top Destinations</h4>
          <ul>
            <li><Link to="/search?city=Hyderabad">Stays in Hyderabad</Link></li>
            <li><Link to="/search?city=Goa">Beach Resorts in Goa</Link></li>
            <li><Link to="/search?city=Mumbai">Hotels in Mumbai</Link></li>
            <li><Link to="/search?city=Bengaluru">Boutique Stays in Bengaluru</Link></li>
            <li><Link to="/search?city=Jaipur">Heritage Havelis in Jaipur</Link></li>
            <li><Link to="/search?city=Manali">Mountain Chalets in Manali</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Quick Navigation</h4>
          <ul>
            <li><Link to="/">Home Overview</Link></li>
            <li><Link to="/search">All Accommodations</Link></li>
            <li><Link to="/my-bookings">Manage Bookings</Link></li>
            <li><Link to="/profile">Guest Profile</Link></li>
            <li><Link to="/login">Sign In / Register</Link></li>
            <li><Link to="/admin">Admin Management Portal</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Technical Training Project</h4>
          <p className="academic-note">
            Built as a full-stack Java Spring Boot 3 & React project for College Technical Training evaluation.
          </p>
          <div className="contact-details">
            <p><MapPin size={15} /> Hyderabad, Telangana, India</p>
            <p><Mail size={15} /> support@stayfinder.local</p>
            <p><Phone size={15} /> +91 (040) 2345-6789</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Stay Finder. All rights reserved. Crafted with care for college technical training project presentation.</p>
      </div>
    </footer>
  );
}
