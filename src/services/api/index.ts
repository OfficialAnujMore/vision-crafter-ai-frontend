import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { API_CONFIG } from '../config/api.ts';
import { ApiError } from '../../interface/api';
import type { ApiResponse, ApiErrorResponse } from '../../interface/api';
import { showErrorToast, showWarningToast } from '../../utils/toast';
import { ROUTES } from '../../constants/routes';

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    const errorMessage = error instanceof Error ? error.message : 'Request failed';
    showErrorToast(new Error(errorMessage));
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown> | ApiErrorResponse>) => {
    if (response.data && typeof response.data === 'object') {
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
    const isRefreshEndpoint = originalRequest?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        if (isRefreshEndpoint) {
          throw new Error('Refresh token also expired');
        }

        await axiosInstance.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH);
        return axiosInstance(originalRequest);
      } catch {
        localStorage.removeItem('user');
        showWarningToast('Session expired', 'Please sign in again.');
        window.dispatchEvent(new Event('authStateChanged'));
        window.location.href = ROUTES.SIGNUP;

        return Promise.reject(new ApiError('Session expired. Please sign in again.', 401));
      }
    }

    if (!error.response) {
      showErrorToast(new Error('Network error. Please check your connection.'));
      return Promise.reject(new ApiError('Network error. Please check your connection.'));
    }

    const errorResponse = error.response?.data as ApiErrorResponse;
    const errorMessage = errorResponse?.message || error.message || 'An error occurred';
    const errorCode = errorResponse?.error;
    const statusCode = errorResponse?.statusCode || error.response?.status;

    const customError = new ApiError(errorMessage, statusCode, errorCode);

    if (!isAuthEndpoint) {
      showErrorToast(customError);
    }

    return Promise.reject(customError);
  }
);

export default axiosInstance;
