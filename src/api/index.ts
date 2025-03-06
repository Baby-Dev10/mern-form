import axios from 'axios';

// Use import.meta.env instead of process.env for Vite compatibility
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
const endpoints = {
  // Booking endpoints
  bookings: {
    getAll: () => api.get('/bookings'),
    getByUser: (userId: string) => api.get(`/bookings/user/${userId}`),
    create: (data: any) => api.post('/bookings', data),
    updateStatus: (id: string, status: string) => api.put(`/bookings/${id}/status`, { status }),
  },
  
  // Receipt endpoints
  receipts: {
    download: (id: string) => api.get(`/receipts/${id}`, { responseType: 'blob' }),
  },
  
  // Admin notification endpoints
  admin: {
    getNotifications: () => api.get('/notify-admin/notifications'),
    markAsRead: (id: string) => api.put(`/notify-admin/notifications/${id}`),
    notify: (data: any) => api.post('/notify-admin', data),
  },
};

// Interceptors for handling auth tokens, errors, etc.
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { api, endpoints };
