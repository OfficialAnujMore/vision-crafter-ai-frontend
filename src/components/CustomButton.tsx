import React from 'react';
import { colors } from '../constants/colors';
import type { ButtonVariant } from '../constants/buttonVarients';



interface CustomButtonProps {
  variant: ButtonVariant;
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ReactElement;
  text?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  variant,
  disabled = false,
  onClick,
  icon,
  text,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  const baseStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: '8px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,

    transform: 'translateY(0)',
    transition:
      'transform 120ms cubic-bezier(0.4, 0, 0.2, 1), ' +
      'box-shadow 120ms cubic-bezier(0.4, 0, 0.2, 1), ' +
      'background-color 120ms ease, ' +
      'opacity 120ms ease',
  };

  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: colors.accent,
      color: colors.white,
      boxShadow: colors.shadow.md,
      border: `2px solid ${colors.white}`,
    },

    secondary: {
      backgroundColor: colors.white,
      color: colors.accent,
      border: `2px solid ${colors.accent}`,
    },

    icon: {
      padding: '0rem',
      backgroundColor: 'transparent',
      color: colors.accent,
    },

    ternary: {
      backgroundColor: 'transparent',
      color: colors.white,
      border: `2px solid ${colors.accent}`,
    },
  };

  const hoverStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      transform: 'scale(1.05)',
    },

    secondary: {
      transform: 'scale(1.05)',
    },

    icon: {
      transform: 'scale(1.5)',
    },

    ternary: {
      transform: 'scale(1.05)',
    },
  };

  const activeStyles: React.CSSProperties = {
    transform: 'translateY(-1px)',
    boxShadow: colors.shadow.sm,
  };

  const style: React.CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...(isHovered && !disabled && hoverStyles[variant]),
    ...(isActive && !disabled && activeStyles),
  };

  return (
    <button
      type="button"
      disabled={disabled}
      style={style}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
    >
      {icon && <span>{icon}</span>}
      {text}
    </button>
  );
};

export default CustomButton;
