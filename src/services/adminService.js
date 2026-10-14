import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data.data;
  },

  getAllStays: async () => {
    const res = await api.get('/admin/stays');
    return res.data.data;
  },

  createStay: async (data) => {
    const res = await api.post('/admin/stays', data);
    return res.data.data;
  },

  updateStay: async (id, data) => {
    const res = await api.put(`/admin/stays/${id}`, data);
    return res.data.data;
  },

  deleteStay: async (id) => {
    const res = await api.delete(`/admin/stays/${id}`);
    return res.data.data;
  },

  addRoom: async (stayId, data) => {
    const res = await api.post(`/admin/stays/${stayId}/rooms`, data);
    return res.data.data;
  },

  updateRoom: async (roomId, data) => {
    const res = await api.put(`/admin/rooms/${roomId}`, data);
    return res.data.data;
  },

  deleteRoom: async (roomId) => {
    const res = await api.delete(`/admin/rooms/${roomId}`);
    return res.data.data;
  },

  getAllBookings: async () => {
    const res = await api.get('/admin/bookings');
    return res.data.data;
  },

  updateBookingStatus: async (bookingId, status) => {
    const res = await api.patch(`/admin/bookings/${bookingId}/status`, null, {
      params: { status },
    });
    return res.data.data;
  },

  getAllUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data.data;
  },
};
