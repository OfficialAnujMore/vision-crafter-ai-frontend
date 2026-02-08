import React from 'react';
import { colors } from '../constants/colors';
import type { TextColor, TextVariant } from '../constants/textVarients';

interface CustomTextProps {
  variant: TextVariant;
  text: string | React.ReactNode;
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

const getGradientTextStyle = (from: string, to: string, angle: number = 135) => ({
  background: `linear-gradient(${angle}deg, ${from} 0%, ${to} 100%)`,
  WebkitBackgroundClip: 'text' as const,
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text' as const,
  color: 'transparent',
});

const CustomText: React.FC<CustomTextProps> = ({ variant, text, fontSize, lineHeight, onClick }) => {


  const baseStyle = { margin: 0 };

  const styles: Record<TextVariant, React.CSSProperties> = {
    h1: {
      ...baseStyle,
      fontSize: '3.8rem',
      fontWeight: 700,
      lineHeight: 1.1,
      display: 'inline-block',
      width: '100%',
      ...getGradientTextStyle(colors.white, colors.accent),
    },
    h2: {
      ...baseStyle,
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      display: 'inline-block',
      width: '100%',
      ...getGradientTextStyle(colors.accent, colors.white),
    },
    h3: {
      ...baseStyle,
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: colors.accent,
    },
    h4: {
      ...baseStyle,
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
      color: colors.accent,
    },
    p: {
      ...baseStyle,
      fontSize: '1.1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: colors.grey[400],
      transition: 'color 0.3s ease',
    },
  };

  const style = { ...styles[variant] };
  if (fontSize) style.fontSize = fontSize;
  if (lineHeight) style.lineHeight = lineHeight;
  if (onClick) style.cursor = 'pointer';


  switch (variant) {
    case 'h1':
      return <h1
        style={style}
        onClick={onClick}>
        {text}
      </h1>;
    case 'h2':
      return <h2
        style={style}
        onClick={onClick}>
        {text}
      </h2>;
    case 'h3':
      return <h3
        style={style}
        onClick={onClick}>
        {text}
      </h3>;
    case 'h4':
      return <h4
        style={style}
        onClick={onClick}>
        {text}
      </h4>;
    case 'p':
    default:
      return <p
        style={style}
        onClick={onClick}>
        {text}
      </p>;
  }
};

export default CustomText;