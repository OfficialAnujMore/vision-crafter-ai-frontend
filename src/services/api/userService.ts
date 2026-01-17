import axiosInstance from './index';
import { API_CONFIG } from '../../config/api';

export const userService = {
  getProfile: async () => {
    const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USER.PROFILE);
    return response.data;
  },
};