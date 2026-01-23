import React, { useState } from 'react';
import { colors } from '../constants/colors';

type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'subheading' | 'caption';
type TextColor = 'primary' | 'secondary' | 'black' | 'white' | 'success' | 'error' | 'warning' | 'info';

interface CustomTextProps {
  variant: TextVariant;
  value: string | React.ReactNode ;
  color?: TextColor;
  fontSize?: string | number;
  lineHeight?: number;
  gradient?: {
    from: string;
    to: string;
    angle?: number;
  };
  onClick?: () => void;
}

const CustomText: React.FC<CustomTextProps> = ({ variant, value, color = 'black', fontSize, lineHeight, gradient, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorMap: Record<TextColor, string> = {
    primary: colors.accent,
    secondary: colors.text.secondary,
    black: colors.black,
    white: colors.white,
    success: '#4ADE80',
    error: '#F87171',
    warning: '#FBBF24',
    info: '#60A5FA',
  };

  const hoverColorMap: Record<TextColor, string> = {
    primary: colors.accent,
    secondary: colors.text.primary,
    black: colors.black,
    white: colors.white,
    success: '#4ADE80',
    error: '#F87171',
    warning: '#FBBF24',
    info: '#60A5FA',
  };

  const styles: Record<TextVariant, React.CSSProperties> = {
    h1: {
      fontSize: '3.8rem',
      fontWeight: 700,
      lineHeight: 1.1,
      margin: 0,
      background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.accent} 100%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      color: 'transparent',
      display: 'inline-block',
      width: '100%',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      margin: 0,
      display: 'inline-block',
      width: '100%',
      ...(gradient ? {
        background: `linear-gradient(${gradient.angle || 135}deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent',
      } : {
        color: colorMap[color],
      }),
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      margin: 0,
      color: colors.accent,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
      margin: 0,
      color: colors.accent,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
      margin: 0,
      color: onClick && isHovered ? hoverColorMap[color] : colorMap[color],
      transition: 'color 0.3s ease',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      margin: 0,
      color: onClick && isHovered ? hoverColorMap[color] : colorMap[color],
      transition: 'color 0.3s ease',
    },
    p: {
      fontSize: '1.1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      margin: 0,
      color: onClick && isHovered ? hoverColorMap[color] : (color === 'black' ? colors.text.secondary : colorMap[color]),
      transition: 'color 0.3s ease',
    },
    subheading: {
      fontSize: '1.125rem',
      fontWeight: 400,
      lineHeight: 1.5,
      margin: 0,
      color: onClick && isHovered ? hoverColorMap[color] : colorMap[color],
      transition: 'color 0.3s ease',
    },
    caption: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.4,
      margin: 0,
      color: onClick && isHovered ? hoverColorMap[color] : colorMap[color],
      transition: 'color 0.3s ease',
    },
  };

  // Apply custom fontSize and lineHeight if provided
  const style = { ...styles[variant] };
  if (fontSize) style.fontSize = fontSize;
  if (lineHeight) style.lineHeight = lineHeight;
  if (onClick) style.cursor = 'pointer';

  const handleMouseEnter = onClick ? () => setIsHovered(true) : undefined;
  const handleMouseLeave = onClick ? () => setIsHovered(false) : undefined;

  switch (variant) {
    case 'h1':
      return <h1 style={style} onClick={onClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{value}</h1>;
    case 'h2':
      return <h2 style={style} onClick={onClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{value}</h2>;
    case 'h3':
      return <h3 style={style} onClick={onClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{value}</h3>;
    case 'h4':
      return <h4 style={style} onClick={onClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{value}</h4>;
    case 'h5':
      return <h5 style={style} onClick={onClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{value}</h5>;
    case 'h6':
      return <h6 style={style} onClick={onClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{value}</h6>;
    case 'subheading':
      return <p style={style} onClick={onClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{value}</p>;
    case 'caption':
      return <small style={style} onClick={onClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{value}</small>;
    case 'p':
    default:
      return <p style={style} onClick={onClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{value}</p>;
  }
};

export default CustomText;