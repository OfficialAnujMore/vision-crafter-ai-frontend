import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { API_CONFIG } from '../../config/api.ts';

class APIError extends Error {
  response?: AxiosResponse;
  
  constructor(message: string) {
    super(message);
    this.name = 'APIError';
  }
}

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest.url?.includes('/auth/');

    // Handle 401 - token expired (but not for auth endpoints like login/register)
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
          { refresh_token: refreshToken }
        );
        
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    // Create a custom error object with the detail message from backend
    const errorMessage = error.response?.data?.detail || error.message || 'An error occurred';
    const customError = new APIError(errorMessage);
    customError.response = error.response;
    
    return Promise.reject(customError);
  }
);

export default axiosInstance;