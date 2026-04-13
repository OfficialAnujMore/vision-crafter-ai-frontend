export const ROUTES = {
  HOME: '/',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  EDITOR: '/editor/:projectId',
  PROFILE: '/profile',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];
