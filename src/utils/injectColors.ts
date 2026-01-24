import { colors } from '../constants/colors';

export const injectCSSVariables = () => {
  const root = document.documentElement;

  // Base colors
  root.style.setProperty('--color-black', colors.black);
  root.style.setProperty('--color-white', colors.white);
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-success', colors.success);
  root.style.setProperty('--color-error', colors.error);
  root.style.setProperty('--color-warning', colors.warning);

  // Grey shades
  Object.entries(colors.grey).forEach(([key, value]) => {
    root.style.setProperty(`--color-grey-${key}`, value);
  });
};
