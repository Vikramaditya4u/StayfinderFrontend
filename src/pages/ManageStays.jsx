import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  PlusCircle,
  Edit2,
  Trash2,
  Bed,
  MapPin,
  Star,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function ManageStays() {
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Property Modal State
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [editingStay, setEditingStay] = useState(null);
  const [propertyForm, setPropertyForm] = useState({
    name: '',
    description: '',
    city: '',
    address: '',
    propertyType: 'Hotel',
    rating: 4.5,
    imageUrl: '',
    amenities: '',
    active: true,
    featured: false,
  });

  // Room Modal State
  const [selectedStayForRooms, setSelectedStayForRooms] = useState(null);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [roomForm, setRoomForm] = useState({
    roomType: '',
    description: '',
    capacity: 2,
    totalRooms: 5,
    pricePerNight: '2500',
    active: true,
  });

  const fetchStays = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllStays();
      setStays(data);
    } catch (err) {
      console.error('Failed to load stays:', err);
      setError('Could not retrieve stays list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStays();
  }, []);

  const openAddProperty = () => {
    setEditingStay(null);
    setPropertyForm({
      name: '',
      description: '',
      city: '',
      address: '',
      propertyType: 'Hotel',
      rating: 4.5,
      imageUrl: '',
      amenities: 'Free WiFi, Air Conditioning, Swimming Pool, Parking',
      active: true,
      featured: false,
    });
    setShowPropertyModal(true);
  };

  const openEditProperty = (stay) => {
    setEditingStay(stay);
    setPropertyForm({
      name: stay.name,
      description: stay.description,
      city: stay.city,
      address: stay.address,
      propertyType: stay.propertyType,
      rating: stay.rating || 4.5,
      imageUrl: stay.imageUrl || '',
      amenities: stay.amenities || '',
      active: stay.active,
      featured: stay.featured,
    });
    setShowPropertyModal(true);
  };

  const handleSaveProperty = async (e) => {
    e.preventDefault();
    try {
      if (editingStay) {
        await adminService.updateStay(editingStay.id, propertyForm);
      } else {
        await adminService.createStay(propertyForm);
      }
      setShowPropertyModal(false);
      await fetchStays();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save property.');
    }
  };

  const handleDeleteProperty = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate "${name}"?`)) return;
    try {
      await adminService.deleteStay(id);
      await fetchStays();
    } catch (err) {
      alert('Failed to deactivate property');
    }
  };

  const openRoomsManager = (stay) => {
    setSelectedStayForRooms(stay);
    setShowRoomModal(true);
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!selectedStayForRooms) return;
    try {
      await adminService.addRoom(selectedStayForRooms.id, {
        roomType: roomForm.roomType,
        description: roomForm.description,
        capacity: Number(roomForm.capacity),
        totalRooms: Number(roomForm.totalRooms),
        pricePerNight: roomForm.pricePerNight,
        active: true,
      });
      setShowRoomModal(false);
      setRoomForm({
        roomType: '',
        description: '',
        capacity: 2,
        totalRooms: 5,
        pricePerNight: '2500',
        active: true,
      });
      await fetchStays();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add room.');
    }
  };

  return (
    <div className="manage-stays-page">
      <div className="manage-header-row">
        <div>
          <h1>Manage Accommodations</h1>
          <p>Add properties, configure room types, pricing, and availability inventory.</p>
        </div>
        <button onClick={openAddProperty} className="admin-primary-btn">
          <PlusCircle size={18} /> Add New Accommodation
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading properties and rooms inventory..." />
      ) : error ? (
        <div className="admin-error-box">
          <p>{error}</p>
          <button onClick={fetchStays} className="retry-btn">
            Retry
          </button>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Destination</th>
                <th>Type</th>
                <th>Rating</th>
                <th>Rooms</th>
                <th>Starting Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stays.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="prop-name-cell">
                      <img
                        src={s.imageUrl}
                        alt={s.name}
                        className="prop-mini-thumb"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <div>
                        <strong>{s.name}</strong>
                        {s.featured && <span className="featured-chip-small">Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="city-cell">
                      <MapPin size={14} /> {s.city}
                    </span>
                  </td>
                  <td>{s.propertyType}</td>
                  <td>
                    <div className="rating-cell">
                      <Star size={14} className="star-icon fill-current" />
                      <span>{s.rating?.toFixed(1)}</span>
                    </div>
                  </td>
                  <td>
                    <span className="room-count-badge">
                      <Bed size={14} /> {s.rooms?.length || 0} room type(s)
                    </span>
                  </td>
                  <td>
                    <strong>₹{Number(s.minPricePerNight || 0).toLocaleString('en-IN')}</strong>
                  </td>
                  <td>
                    <span className={`status-pill ${s.active ? 'status-confirmed' : 'status-cancelled'}`}>
                      {s.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="table-btn-group">
                      <button
                        onClick={() => openRoomsManager(s)}
                        className="action-icon-btn manage-rooms-btn"
                        title="Manage Room Inventory"
                      >
                        <Bed size={16} />
                      </button>
                      <button
                        onClick={() => openEditProperty(s)}
                        className="action-icon-btn edit-btn"
                        title="Edit Stay"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(s.id, s.name)}
                        className="action-icon-btn delete-btn"
                        title="Deactivate Stay"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Property Create/Edit Modal */}
      {showPropertyModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="modal-header">
              <h3>{editingStay ? 'Edit Accommodation' : 'Add New Accommodation'}</h3>
              <button onClick={() => setShowPropertyModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="modal-form">
              <div className="form-group">
                <label>Property Name</label>
                <input
                  type="text"
                  value={propertyForm.name}
                  onChange={(e) => setPropertyForm({ ...propertyForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={propertyForm.city}
                    onChange={(e) => setPropertyForm({ ...propertyForm, city: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Property Type</label>
                  <select
                    value={propertyForm.propertyType}
                    onChange={(e) => setPropertyForm({ ...propertyForm, propertyType: e.target.value })}
                  >
                    <option value="Hotel">Hotel</option>
                    <option value="Resort">Resort</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Full Address</label>
                <input
                  type="text"
                  value={propertyForm.address}
                  onChange={(e) => setPropertyForm({ ...propertyForm, address: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={propertyForm.imageUrl}
                  onChange={(e) => setPropertyForm({ ...propertyForm, imageUrl: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  value={propertyForm.description}
                  onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Amenities (Comma-separated)</label>
                <input
                  type="text"
                  value={propertyForm.amenities}
                  onChange={(e) => setPropertyForm({ ...propertyForm, amenities: e.target.value })}
                />
              </div>

              <div className="form-checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={propertyForm.featured}
                    onChange={(e) => setPropertyForm({ ...propertyForm, featured: e.target.checked })}
                  />
                  <span>Mark as Featured Stay on Homepage</span>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowPropertyModal(false)}
                  className="modal-cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn">
                  {editingStay ? 'Save Changes' : 'Create Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {showRoomModal && selectedStayForRooms && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="modal-header">
              <h3>
                Add Room to "{selectedStayForRooms.name}"
              </h3>
              <button onClick={() => setShowRoomModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddRoom} className="modal-form">
              <div className="form-group">
                <label>Room Category / Type</label>
                <input
                  type="text"
                  placeholder="e.g. Deluxe Suite King"
                  value={roomForm.roomType}
                  onChange={(e) => setRoomForm({ ...roomForm, roomType: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={2}
                  placeholder="Bed setup, view, highlights..."
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                />
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label>Max Guests</label>
                  <input
                    type="number"
                    min="1"
                    value={roomForm.capacity}
                    onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Total Inventory</label>
                  <input
                    type="number"
                    min="1"
                    value={roomForm.totalRooms}
                    onChange={(e) => setRoomForm({ ...roomForm, totalRooms: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price/Night (₹)</label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={roomForm.pricePerNight}
                    onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="modal-cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn">
                  Add Room Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
