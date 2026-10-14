import api from './api';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.data.token) {
      localStorage.setItem('stayfinder_token', res.data.data.token);
      localStorage.setItem('stayfinder_user', JSON.stringify(res.data.data.user));
    }
    return res.data.data;
  },

  register: async (fullName, email, phone, password) => {
    const res = await api.post('/auth/register', { fullName, email, phone, password });
    if (res.data.data.token) {
      localStorage.setItem('stayfinder_token', res.data.data.token);
      localStorage.setItem('stayfinder_user', JSON.stringify(res.data.data.user));
    }
    return res.data.data;
  },

  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data.data;
  },

  logout: () => {
    localStorage.removeItem('stayfinder_token');
    localStorage.removeItem('stayfinder_user');
  },

  getStoredUser: () => {
    const userStr = localStorage.getItem('stayfinder_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getToken: () => localStorage.getItem('stayfinder_token'),
};
