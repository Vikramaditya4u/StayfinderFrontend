import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

export default function SearchForm({ initialValues = {} }) {
  const navigate = useNavigate();

  const getToday = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const getFutureDate = (daysAhead = 2) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  const [city, setCity] = useState(initialValues.city || '');
  const [checkIn, setCheckIn] = useState(initialValues.checkIn || getToday());
  const [checkOut, setCheckOut] = useState(initialValues.checkOut || getFutureDate(3));
  const [guests, setGuests] = useState(initialValues.guests || '2');

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (city.trim()) query.set('city', city.trim());
    if (checkIn) query.set('checkIn', checkIn);
    if (checkOut) query.set('checkOut', checkOut);
    if (guests) query.set('guests', guests);

    navigate(`/search?${query.toString()}`);
  };

  return (
    <form className="hero-search-form" onSubmit={handleSearch}>
      <div className="search-field">
        <label>
          <MapPin size={16} /> Destination
        </label>
        <input
          type="text"
          placeholder="Where are you going? (e.g. Hyderabad, Goa)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      <div className="search-field">
        <label>
          <Calendar size={16} /> Check-In
        </label>
        <input
          type="date"
          min={getToday()}
          value={checkIn}
          onChange={(e) => {
            setCheckIn(e.target.value);
            if (e.target.value >= checkOut) {
              const next = new Date(e.target.value);
              next.setDate(next.getDate() + 1);
              setCheckOut(next.toISOString().split('T')[0]);
            }
          }}
        />
      </div>

      <div className="search-field">
        <label>
          <Calendar size={16} /> Check-Out
        </label>
        <input
          type="date"
          min={checkIn || getToday()}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>

      <div className="search-field">
        <label>
          <Users size={16} /> Guests
        </label>
        <select value={guests} onChange={(e) => setGuests(e.target.value)}>
          <option value="1">1 Adult</option>
          <option value="2">2 Adults</option>
          <option value="3">3 Guests</option>
          <option value="4">4 Guests</option>
          <option value="6">6+ Guests (Family / Group)</option>
        </select>
      </div>

      <button type="submit" className="search-submit-btn">
        <Search size={18} />
        <span>Search Stays</span>
      </button>
    </form>
  );
}
