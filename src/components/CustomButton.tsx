import React from 'react';
import { colors } from '../constants/colors';

type ButtonVariant = 'primary' | 'secondary';

interface CustomButtonProps {
  variant: ButtonVariant;
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  text: string;
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
      backgroundColor: colors.primary[600],
      color: colors.neutral[0],
      boxShadow: colors.shadow.md,
    },
    secondary: {
      backgroundColor: 'transparent',
      color: colors.primary[600],
      border: `2px solid ${colors.primary[600]}`,
    },
  };

  const hoverStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: colors.primary[700],
      boxShadow: colors.shadow.lg,
      transform: 'translateY(-2px)',
    },
    secondary: {
      backgroundColor: colors.primary[50],
      color: colors.primary[700],
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