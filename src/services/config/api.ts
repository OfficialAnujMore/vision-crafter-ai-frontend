export const API_CONFIG = {

  BASE_URL: import.meta.env.VITE_API_URL,
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
    STORAGE: {
      PRESIGN: "/api/storage/presign",
    },
    PROJECT: {
      CREATE: "/api/projects/create",
      GET_PROJECT: "/api/projects/",
      USER_PROJECTS: "/api/projects/user/",
      DELETE: "/api/projects/",
      UPDATE: "/api/projects/",
    },
    AI: {
      REMOVE_BACKGROUND: "/api/ai/remove-background",
      EXTEND_IMAGE: "/api/ai/extend-image",
      GENERATE_IMAGE: "/api/ai/generate-image",
      EDIT_IMAGE: "/api/ai/edit-image",
    },
    PAYMENTS: {
      BALANCE: "/api/payments/balance",
      PURCHASES: "/api/payments/purchases",
      CHECKOUT: "/api/payments/checkout",
    },
  },
} as const;