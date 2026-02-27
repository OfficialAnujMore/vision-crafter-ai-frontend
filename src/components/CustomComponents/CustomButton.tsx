import React from 'react';
import type { ButtonVariant } from '../../constants/buttonVarients';
import '../../styles/CustomComponent/CustomButton.css';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant;
  icon?: React.ReactElement;
  text?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  variant,
  icon,
  text,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={`custom-btn custom-btn--${variant}${className ? ` ${className}` : ''}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {text}
    </button>
  );
};

export default CustomButton;
