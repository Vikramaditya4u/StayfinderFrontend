import api from './api';

export const userService = {
  getProfile: async () => {
    const res = await api.get('/users/me');
    return res.data.data;
  },

  updateProfile: async (data) => {
    const res = await api.patch('/users/me', data);
    return res.data.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const res = await api.post('/users/change-password', { currentPassword, newPassword });
    return res.data;
  },
};
