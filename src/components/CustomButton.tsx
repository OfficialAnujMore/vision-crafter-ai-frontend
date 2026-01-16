import React from 'react';
import { colors } from '../constants/colors';

type ButtonVariant = 'primary' | 'secondary' | 'icon' | 'ternary';

interface CustomButtonProps {
  variant: ButtonVariant;
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  text?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  variant,
  disabled = false,
  onClick,
  icon,
  text,
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    border: 'none',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    opacity: disabled ? 0.6 : 1,
  };

  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: colors.accent,
      color: colors.white,
      boxShadow: colors.shadow.md,
    },

    secondary: {
      backgroundColor: 'transparent',
      color: colors.accent,
      border: `2px solid ${colors.accent}`,
    },

    icon: {
      padding: '0.5rem',
      minWidth: 'auto',
      backgroundColor: 'transparent',
      color: colors.accent,
    },

    ternary: {
      backgroundColor: colors.grey[700],
      color: colors.white,
      boxShadow: colors.shadow.sm,
    },
  };

  const hoverStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: colors.accent,
      boxShadow: colors.shadow.lg,
      transform: 'translateY(-2px)',
      opacity: 0.9,
    },
    secondary: {
      backgroundColor: colors.grey[900],
      color: colors.accent,
    },
    icon: {
      // backgroundColor: colors.grey[900],
      transform: 'scale(1.1)',
    },
    ternary: {
      backgroundColor: colors.grey[700],
      boxShadow: colors.shadow.md,
      transform: 'translateY(-1px)',
    },
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const style: React.CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...(isHovered && !disabled && hoverStyles[variant]),
  };

  return (
    <button
      style={style}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon && <span>{icon}</span>}
      {text}
    </button>
  );
};

export default CustomButton;