import React from 'react';
import { colors } from '../constants/colors';

type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'subheading' | 'caption';
type TextColor = 'primary' | 'secondary' | 'black' | 'white' | 'success' | 'error' | 'warning' | 'info';

interface CustomTextProps {
  variant: TextVariant;
  value: string | React.ReactNode;
  color?: TextColor;
}

const CustomText: React.FC<CustomTextProps> = ({ variant, value, color = 'black' }) => {
  const colorMap: Record<TextColor, string> = {
    primary: colors.primary[600],
    secondary: colors.text.primary,
    black: colors.neutral[900],
    white: colors.neutral[0],
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
  };

  const styles: Record<TextVariant, React.CSSProperties> = {
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
      margin: 0,
      color: colorMap[color],
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      margin: 0,
      color: colorMap[color],
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      margin: 0,
      color: colorMap[color],
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
      margin: 0,
      color: colorMap[color],
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
      margin: 0,
      color: colorMap[color],
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      margin: 0,
      color: colorMap[color],
    },
    p: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      margin: 0,
      color: colorMap[color],
    },
    subheading: {
      fontSize: '1.125rem',
      fontWeight: 400,
      lineHeight: 1.5,
      margin: 0,
      color: colorMap[color],
    },
    caption: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.4,
      margin: 0,
      color: colorMap[color],
    },
  };

  const style = styles[variant];

  switch (variant) {
    case 'h1':
      return <h1 style={style}>{value}</h1>;
    case 'h2':
      return <h2 style={style}>{value}</h2>;
    case 'h3':
      return <h3 style={style}>{value}</h3>;
    case 'h4':
      return <h4 style={style}>{value}</h4>;
    case 'h5':
      return <h5 style={style}>{value}</h5>;
    case 'h6':
      return <h6 style={style}>{value}</h6>;
    case 'subheading':
      return <p style={style}>{value}</p>;
    case 'caption':
      return <small style={style}>{value}</small>;
    case 'p':
    default:
      return <p style={style}>{value}</p>;
  }
};

export default CustomText;