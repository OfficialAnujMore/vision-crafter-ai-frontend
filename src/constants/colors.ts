export const colors = {
  // Brand – Purple
  primary: {
    50: '#F4F1FF',
    100: '#E9E4FF',
    200: '#D3CAFF',
    300: '#BDAFFF',
    400: '#A795FF',
    500: '#917BFF',
    600: '#7C5CFF', // main
    700: '#684AE6',
    800: '#543ACC',
    900: '#432EA8',
  },

  // Neutrals (dark-first)
  neutral: {
    0: '#FFFFFF',
    50: '#F7F7FB',
    100: '#EEEFFC',
    200: '#D7D8E8',
    300: '#BFC1D6',
    400: '#989BBC',
    500: '#7B7EA3',
    600: '#5E607D',
    700: '#42435A',
    800: '#26263C',
    900: '#141323',
  },

  // Text
  text: {
    primary: '#EDEBFF',
    secondary: '#BBB7DA',
    tertiary: '#8E8AA8',
    disabled: '#6C6884',
    inverse: '#0E0D18',
  },

  // Surfaces / backgrounds
  background: {
    default: '#0F0D1A',
    subtle: '#17152A',
    raised: '#1E1B34',
  },

  // Borders
  border: {
    light: '#332E52',
    medium: '#3E3864',
    dark: '#4C457B',
  },

  // Semantic
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',

  // Gradients
  gradient: {
    primary: 'linear-gradient(135deg, #7C5CFF 0%, #684AE6 100%)',
    surface: 'linear-gradient(180deg, #1E1B34 0%, #17152A 100%)',
  },

  // Shadows
  shadow: {
    sm: '0 2px 6px rgba(0,0,0,0.25)',
    md: '0 8px 24px rgba(0,0,0,0.35)',
    lg: '0 20px 48px rgba(0,0,0,0.45)',
  },
} as const;