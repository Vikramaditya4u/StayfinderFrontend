import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { stayService } from '../services/stayService';
import SearchForm from '../components/SearchForm';
import StayCard from '../components/StayCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Compass,
  ShieldCheck,
  CreditCard,
  Headphones,
  Star,
  ArrowRight,
  Building,
  Palmtree,
  Home as HomeIcon,
  Castle,
} from 'lucide-react';

export default function Home() {
  const [featuredStays, setFeaturedStays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await stayService.getFeaturedStays();
        setFeaturedStays(data);
      } catch (err) {
        console.error('Failed to load featured stays:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const destinations = [
    { city: 'Hyderabad', tag: 'City of Pearls', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' },
    { city: 'Goa', tag: 'Sun & Coastal Sands', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80' },
    { city: 'Mumbai', tag: 'Maximum City Luxury', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80' },
    { city: 'Bengaluru', tag: 'Garden Tech Hub', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80' },
    { city: 'Jaipur', tag: 'Royal Pink Palace', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' },
    { city: 'Manali', tag: 'Snow & Pine Valleys', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80' },
  ];

  const categories = [
    { name: 'Hotel', label: 'Luxury Hotels', icon: <Building size={28} />, desc: 'Comfortable suites with full amenities' },
    { name: 'Resort', label: 'Beach & Nature Resorts', icon: <Palmtree size={28} />, desc: 'All-inclusive leisurely getaways' },
    { name: 'Villa', label: 'Private Villas', icon: <HomeIcon size={28} />, desc: 'Secluded luxury with private pools' },
    { name: 'Heritage', label: 'Heritage Havelis', icon: <Castle size={28} />, desc: 'Historic palace architecture' },
  ];

  const sampleReviews = [
    {
      name: 'Aditya Sharma',
      location: 'Hyderabad, India',
      rating: 5,
      comment: 'Booking through Stay Finder was completely seamless. The Royal Grand Residency in Jubilee Hills was exactly as pictured, and check-in took just 2 minutes!',
    },
    {
      name: 'Sneha Reddy',
      location: 'Bengaluru, India',
      rating: 5,
      comment: 'Our beach cottage in Goa was phenomenal. Great price transparency with zero hidden fees at checkout. Highly recommended!',
    },
    {
      name: 'Rohan Verma',
      location: 'Mumbai, India',
      rating: 5,
      comment: 'Stay Finder made comparing room sizes and instant availability super easy. The cancellation policy gives immense peace of mind.',
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-subheading">WELCOME TO STAY FINDER</p>
          <h1 className="hero-heading">
            Find Your Perfect
            <br />
            <span>Stay Anywhere</span>
          </h1>
          <p className="hero-description">
            Discover verified hotels, luxury resorts, and cozy boutique stays with real-time room availability, guaranteed pricing, and instant confirmation.
          </p>

          <div className="hero-search-wrapper">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="section-container destinations-section">
        <div className="section-header">
          <p className="section-kicker">EXPLORE INDIA</p>
          <h2 className="section-title">Popular Destinations</h2>
          <span className="section-subtitle">Top-rated cities and vacation spots curated by travelers</span>
        </div>

        <div className="destinations-grid">
          {destinations.map((dest) => (
            <Link
              key={dest.city}
              to={`/search?city=${encodeURIComponent(dest.city)}`}
              className="destination-card"
            >
              <img src={dest.image} alt={dest.city} loading="lazy" />
              <div className="destination-info">
                <h3>{dest.city}</h3>
                <p>{dest.tag}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Stays */}
      <section className="section-container featured-section" id="stays">
        <div className="section-header-row">
          <div>
            <p className="section-kicker">FEATURED ACCOMMODATIONS</p>
            <h2 className="section-title">Handpicked Stays</h2>
            <span className="section-subtitle">Verified comfort, exceptional amenities, and stellar guest reviews</span>
          </div>
          <Link to="/search" className="view-all-link">
            Browse All Stays <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading handpicked stays..." />
        ) : featuredStays.length === 0 ? (
          <div className="empty-state">
            <p>No featured stays available at the moment.</p>
          </div>
        ) : (
          <div className="stays-grid">
            {featuredStays.map((stay) => (
              <StayCard key={stay.id} stay={stay} />
            ))}
          </div>
        )}
      </section>

      {/* Accommodation Categories */}
      <section className="section-container categories-section">
        <div className="section-header">
          <p className="section-kicker">CURATED COLLECTIONS</p>
          <h2 className="section-title">Browse by Property Type</h2>
          <span className="section-subtitle">Find the accommodation style matching your trip</span>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/search?propertyType=${cat.name === 'Heritage' ? 'Resort' : cat.name}`}
              className="category-card"
            >
              <div className="category-icon-wrapper">{cat.icon}</div>
              <h3>{cat.label}</h3>
              <p>{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Stay Finder */}
      <section className="section-container features-section">
        <div className="section-header">
          <p className="section-kicker">THE STAY FINDER ADVANTAGE</p>
          <h2 className="section-title">Why Book With Us?</h2>
          <span className="section-subtitle">Seamless travel experiences designed for comfort, security, and savings</span>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-circle">
              <Compass size={28} />
            </div>
            <h3>Instant Room Availability</h3>
            <p>Live inventory synchronization ensures you never face double-bookings or surprise cancellations.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-circle">
              <CreditCard size={28} />
            </div>
            <h3>Transparent Pricing</h3>
            <p>Clear price breakdowns with room charges and taxes itemized upfront. No hidden checkout fees.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-circle">
              <ShieldCheck size={28} />
            </div>
            <h3>Verified Accommodations</h3>
            <p>All hotels and stays undergo verification to guarantee hygiene, security, and promised amenities.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-circle">
              <Headphones size={28} />
            </div>
            <h3>Flexible Cancellation</h3>
            <p>Cancel eligible upcoming bookings easily directly from your guest dashboard before check-in date.</p>
          </div>
        </div>
      </section>

      {/* Verified Reviews Section */}
      <section className="section-container reviews-section">
        <div className="section-header">
          <p className="section-kicker">GUEST EXPERIENCES</p>
          <h2 className="section-title">What Our Guests Say</h2>
          <span className="section-subtitle">Real feedback from verified guests who booked through Stay Finder</span>
        </div>

        <div className="reviews-grid">
          {sampleReviews.map((rev, idx) => (
            <div key={idx} className="review-card">
              <div className="review-stars">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={16} className="star-icon fill-current" />
                ))}
              </div>
              <p className="review-comment">"{rev.comment}"</p>
              <div className="review-author">
                <h4>{rev.name}</h4>
                <span>{rev.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-banner">
        <div className="cta-content">
          <h2>Ready to Plan Your Next Journey?</h2>
          <p>Join thousands of happy travelers and discover your perfect stay at the best rates today.</p>
          <div className="cta-buttons">
            <Link to="/search" className="cta-primary-btn">
              Explore All Stays
            </Link>
            <Link to="/register" className="cta-secondary-btn">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
