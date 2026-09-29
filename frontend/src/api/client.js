import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('metraverify_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token is expired or invalid, clear and redirect to login if not already on public route
      const isPublicPath =
        window.location.pathname.startsWith('/verify') ||
        window.location.pathname === '/login' ||
        window.location.pathname === '/register' ||
        window.location.pathname === '/';

      if (!isPublicPath) {
        localStorage.removeItem('metraverify_token');
        localStorage.removeItem('metraverify_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
