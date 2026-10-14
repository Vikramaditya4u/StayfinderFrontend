import api from './api';

export const stayService = {
  getStays: async (params = {}) => {
    const res = await api.get('/stays', { params });
    return res.data.data;
  },

  getFeaturedStays: async () => {
    const res = await api.get('/stays/featured');
    return res.data.data;
  },

  getStayById: async (id) => {
    const res = await api.get(`/stays/${id}`);
    return res.data.data;
  },

  checkAvailability: async (stayId, roomId, checkIn, checkOut, requestedRooms = 1) => {
    const res = await api.get(`/stays/${stayId}/availability`, {
      params: { roomId, checkIn, checkOut, requestedRooms },
    });
    return res.data.data;
  },

  getReviews: async (stayId) => {
    const res = await api.get(`/stays/${stayId}/reviews`);
    return res.data.data;
  },

  addReview: async (stayId, reviewData) => {
    const res = await api.post(`/stays/${stayId}/reviews`, reviewData);
    return res.data.data;
  },
};
