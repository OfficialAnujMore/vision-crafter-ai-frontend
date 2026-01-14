import { colors } from '../constants/colors';

export const injectCSSVariables = () => {
  const root = document.documentElement;

  // Base colors
  root.style.setProperty('--color-black', colors.black);
  root.style.setProperty('--color-white', colors.white);
  root.style.setProperty('--color-accent', colors.accent);

  // Grey shades
  Object.entries(colors.grey).forEach(([key, value]) => {
    root.style.setProperty(`--color-grey-${key}`, value);
  });

  // Text colors
  Object.entries(colors.text).forEach(([key, value]) => {
    root.style.setProperty(`--text-${key}`, value);
  });

  // Background colors
  Object.entries(colors.background).forEach(([key, value]) => {
    root.style.setProperty(`--bg-${key}`, value);
  });

  // Border colors
  Object.entries(colors.border).forEach(([key, value]) => {
    root.style.setProperty(`--border-${key}`, value);
  });
};
