import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { API_CONFIG } from '../../config/api.ts';
import { ApiError } from '../../interface/api';
import type { ApiResponse, ApiErrorResponse } from '../../interface/api';
import { showErrorToast, showWarningToast } from '../../utils/toast';

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
    showErrorToast(error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and standardized responses
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown> | ApiErrorResponse>) => {
    // Check if response has the expected structure
    if (response.data && typeof response.data === 'object') {
      // If success is explicitly false, treat as error
      const data = response.data as ApiResponse<unknown> | ApiErrorResponse & { success?: boolean };
      if ('success' in data && !data.success) {
        const errorData = response.data as ApiErrorResponse;
        const error = new ApiError(
          errorData.message,
          errorData.statusCode || response.status
        );
        showErrorToast(error);
        return Promise.reject(error);
      }
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

    // Handle 401 - token expired (but not for auth endpoints like login/register)
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      // Clear authentication and redirect to signup
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');

      // Show warning toast for session expiry
      showWarningToast('Session expired', 'Please sign in again.');

      // Dispatch custom event to update UI
      window.dispatchEvent(new Event('authStateChanged'));

      // Redirect to signup
      window.location.href = '/signup';

      return Promise.reject(new ApiError('Session expired. Please sign in again.', 401));
    }

    // Handle network errors
    if (!error.response) {
      showErrorToast(new Error('Network error. Please check your connection.'));
      return Promise.reject(new ApiError('Network error. Please check your connection.'));
    }

    // Extract error from standardized ApiErrorResponse
    const errorResponse = error.response?.data as ApiErrorResponse;
    const errorMessage = errorResponse?.message || error.message || 'An error occurred';
    const errorCode = errorResponse?.error;
    const statusCode = errorResponse?.statusCode || error.response?.status;

    const customError = new ApiError(errorMessage, statusCode, errorCode);

    // Don't show toast for auth endpoints (handled in authService)
    if (!isAuthEndpoint) {
      showErrorToast(customError);
    }

    return Promise.reject(customError);
  }
);

export default axiosInstance;