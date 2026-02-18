import axiosInstance from './index';
import { API_CONFIG } from '../config/api';
import type { ApiResponse } from '../../interface/api';
import type { GoogleAuthResponse } from '../../interface/auth';
import { showSuccessToast } from '../../utils/toast';

export const authService = {
  googleAuth: async (googleToken: string): Promise<GoogleAuthResponse> => {
    try {      
      const response = await axiosInstance.post<ApiResponse<GoogleAuthResponse>>(
        API_CONFIG.ENDPOINTS.AUTH.GOOGLE,
        { token: googleToken }
      );
      if (response.data.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        showSuccessToast('Successfully logged in!');
        return response.data.data;
      } else {
        throw new Error('No user data received from backend');
      }
    } catch (error) {
      console.error('❌ Google auth error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      
      await axiosInstance.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      
      console.error('Logout API error:', error);
    }
    
    
    localStorage.removeItem('user');
    showSuccessToast('Successfully logged out!');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },


  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  }
};