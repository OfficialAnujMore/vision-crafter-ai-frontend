import axiosInstance from './index';
import { API_CONFIG } from '../../config/api';

interface GoogleAuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    google_id: string;
    email: string;
    name: string;
    picture: string | null;
    is_active: boolean;
    created_at: string;
  };
}

export const authService = {
  googleAuth: async (googleToken: string): Promise<GoogleAuthResponse> => {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.AUTH.GOOGLE,
      { token: googleToken }
    );
    
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  }
};
