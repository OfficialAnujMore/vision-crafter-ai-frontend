import axiosInstance from './index';
import { API_CONFIG } from '../../config/api';
import type { ApiResponse } from '../../interface/api';
import type { GoogleAuthResponse } from '../../interface/auth';
import { showSuccessToast } from '../../utils/toast';

export const authService = {
  googleAuth: async (googleToken: string): Promise<GoogleAuthResponse> => {
    const response = await axiosInstance.post<ApiResponse<GoogleAuthResponse>>(
      API_CONFIG.ENDPOINTS.AUTH.GOOGLE,
      { token: googleToken }
    );

    if (response.data.data.access_token) {
      localStorage.setItem('access_token', response.data.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      showSuccessToast('Successfully logged in!');
    }

    return response.data.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    showSuccessToast('Successfully logged out!');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  }
};