import axios from 'axios';

// Configurable Base URL from environment variable, default to '/api' for Vite dev proxy or backend server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach Authorization token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessmap_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for logging & unified handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('[API Client Warning]:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };
