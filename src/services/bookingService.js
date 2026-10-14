import api from './api';

export const bookingService = {
  createBooking: async (bookingData) => {
    const res = await api.post('/bookings', bookingData);
    return res.data.data;
  },

  getMyBookings: async () => {
    const res = await api.get('/bookings/my');
    return res.data.data;
  },

  getBookingById: async (id) => {
    const res = await api.get(`/bookings/${id}`);
    return res.data.data;
  },

  cancelBooking: async (id) => {
    const res = await api.patch(`/bookings/${id}/cancel`);
    return res.data.data;
  },
};
