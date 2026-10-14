import axios from 'axios';

let rawBase = import.meta.env.VITE_API_URL || '/api';
if (rawBase.endsWith('/')) {
  rawBase = rawBase.slice(0, -1);
}
const baseURL = (rawBase !== '/api' && !rawBase.endsWith('/api')) ? `${rawBase}/api` : rawBase;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('stayfinder_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if we're on login or registering
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('stayfinder_token');
        localStorage.removeItem('stayfinder_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
