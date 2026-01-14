export const colors = {
  // Base Colors
  black: '#000000',
  white: '#FFFFFF',
  accent: '#7C5CFF',

  // Grey Shades
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#A3A3A3',
    tertiary: '#737373',
    inverse: '#000000',
  },

  // Background Colors
  background: {
    primary: '#000000',
    secondary: '#171717',
    tertiary: '#262626',
  },

  // Border Colors
  border: {
    primary: '#404040',
    secondary: '#262626',
    accent: '#7C5CFF',
  },

  // Shadows
  shadow: {
    sm: '0 2px 6px rgba(0, 0, 0, 0.25)',
    md: '0 8px 24px rgba(0, 0, 0, 0.35)',
    lg: '0 20px 48px rgba(0, 0, 0, 0.45)',
  },
} as const;