import React from 'react';
import type { TextColor, TextVariant } from '../../constants/textVariants';
import '../../styles/CustomComponent/CustomText.css';

interface CustomTextProps {
  variant: TextVariant;
  text: string | React.ReactNode;
  color?: TextColor;
  fontSize?: string | number;
  lineHeight?: number;
  onClick?: () => void;
}

const TAG_MAP: Record<TextVariant, keyof React.JSX.IntrinsicElements> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  p: 'p',
};

const CustomText: React.FC<CustomTextProps> = ({ variant, text, color, fontSize, lineHeight, onClick }) => {
  const Tag = TAG_MAP[variant] || 'p';

  const className = [
    'custom-text',
    `custom-text--${variant}`,
    color && `custom-text--color-${color}`,
    onClick && 'custom-text--clickable',
  ].filter(Boolean).join(' ');

  const style: React.CSSProperties | undefined =
    fontSize || lineHeight
      ? { ...(fontSize && { fontSize }), ...(lineHeight && { lineHeight }) }
      : undefined;

  return (
    <Tag className={className} style={style} onClick={onClick}>
      {text}
    </Tag>
  );
};

export default CustomText;
