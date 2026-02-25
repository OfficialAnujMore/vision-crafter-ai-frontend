export const API_CONFIG = {

  BASE_URL: import.meta.env.VITE_API_URL,
  IMAGEKIT_UPLOAD_URL: import.meta.env.VITE_IMAGEKIT_UPLOAD_URL,
  UNSPLASH_ACCESS_KEY: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
  UNSPLASH_API_URL: import.meta.env.VITE_UNSPLASH_API_URL,

  ENDPOINTS: {
    AUTH: {
      GOOGLE: '/auth/google',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE: '/user/update',
    },
    IMAGEKIT: {
      AUTH: "/api/imagekit/auth",
    },
    PROJECT: {
      CREATE: "/api/projects/create",
      GET_PROJECT: "/api/projects/",
      USER_PROJECTS: "/api/projects/user/",
      DELETE_BY_FILE_ID: "/api/projects/",
      UPDATE: "/api/projects/",
    }
  },
} as const;