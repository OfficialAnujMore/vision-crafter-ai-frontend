export const API_CONFIG = {
  
  BASE_URL: import.meta.env.VITE_API_URL,
  IMAGEKIT_UPLOAD_URL: import.meta.env.VITE_IMAGEKIT_UPLOAD_URL,
  ENDPOINTS: {
    AUTH: {
      GOOGLE: '/auth/google',
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE: '/user/update',
    },
    IMAGEKIT:{
      AUTH:"/api/imagekit/auth",
    },
    PROJECT:{
      CREATE:"/api/projects/create",
      GET_PROJECT: "/api/projects/",
      USER_PROJECTS: "/api/projects/user/",
      DELETE_BY_FILE_ID: "/api/projects/"
    }
  },
} as const;