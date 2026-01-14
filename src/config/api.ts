export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  ENDPOINTS: {
    AUTH: {
      GOOGLE: '/auth/google',
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE: '/user/update',
    },
  },
} as const;