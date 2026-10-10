import axios from 'axios';

/**
 * API Base URL Configuration:
 * 
 * 1. Default (Proxy-Relative Path): '/api'
 *    For local development, requests starting with '/api' are proxied by the Vite dev server
 *    (running on http://localhost:5173) to http://localhost:5000.
 *    This avoids browser CORS restrictions when the local backend has no CORS middleware enabled.
 * 
 * 2. Optional Direct URL (e.g. VITE_API_BASE_URL=https://api.accessmap.org/api):
 *    If VITE_API_BASE_URL is explicitly set to a full absolute URL, Axios will request that endpoint directly.
 *    Avoid setting VITE_API_BASE_URL to '/api/api' or appending extra trailing paths to prevent duplicate prefixes.
 */
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

// Response interceptor for logging & unified error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('[API Client Warning]:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };
