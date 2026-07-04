import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    let token = null;
    if (typeof window !== 'undefined') {
      token = Cookies.get('token') || localStorage.getItem('token');
    }
    
    const finalToken = token;
    
    if (finalToken) {
      config.headers.Authorization = `Bearer ${finalToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
