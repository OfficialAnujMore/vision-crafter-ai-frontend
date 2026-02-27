import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import CustomText from './CustomText';
import '../../styles/CustomComponent/CustomInput.css';

interface CustomInputProps {
  label?: string;
  placeholder?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  disabled?: boolean;
  error?: string;
  required?: boolean;
  icon?: React.ReactElement;
  iconPosition?: 'left' | 'right';
  onBlur?: () => void;
  onFocus?: () => void;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  autoComplete?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  disabled = false,
  error,
  required = false,
  icon,
  iconPosition = 'left',
  onBlur,
  onFocus,
  minLength,
  maxLength,
  pattern,
  autoComplete,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const wrapperClass = [
    'custom-input__wrapper',
    error && 'custom-input__wrapper--error',
    disabled && 'custom-input__wrapper--disabled',
  ].filter(Boolean).join(' ');

  const inputType = type === 'password' && isPasswordVisible ? 'text' : type;

  return (
    <div className="custom-input">
      {label && (
        <div className="custom-input__label">
          <CustomText variant="p" text={label} fontSize="0.875rem" />
          {required && <span className="custom-input__required">*</span>}
        </div>
      )}

      <div className={wrapperClass}>
        {icon && iconPosition === 'left' && (
          <div className="custom-input__icon">{icon}</div>
        )}

        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          autoComplete={autoComplete}
          className="custom-input__field"
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="custom-input__password-toggle"
            tabIndex={-1}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {icon && iconPosition === 'right' && type !== 'password' && (
          <div className="custom-input__icon">{icon}</div>
        )}
      </div>

      {error && <div className="custom-input__error">{error}</div>}

      {maxLength && (
        <div className="custom-input__char-count">
          {String(value).length}/{maxLength}
        </div>
      )}
    </div>
  );
};

export default CustomInput;
