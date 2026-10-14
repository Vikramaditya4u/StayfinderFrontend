import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">
          <Compass size={64} />
        </div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page or destination you are searching for does not exist or has been moved.</p>
        <Link to="/" className="back-home-btn">
          <Home size={18} /> Return to Homepage
        </Link>
      </div>
    </div>
  );
}
