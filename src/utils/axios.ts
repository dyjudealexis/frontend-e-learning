// utils/axios.ts
import axios from 'axios';
import { getCookie } from './cookies';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`, // e.g., http://localhost:8000
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Request interceptor to add Bearer token
api.interceptors.request.use(
  (config) => {
    // Example: get token from localStorage (or use a more secure method)
    const token = typeof window !== 'undefined' ? getCookie(`${process.env.NEXT_PUBLIC_SESSION_TOKEN_COOKIE}`) : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🌐 Optional: global response error handler
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
