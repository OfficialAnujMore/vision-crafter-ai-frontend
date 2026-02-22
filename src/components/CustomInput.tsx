import React, { useState } from 'react';
import { colors } from '../constants/colors';

interface CustomInputProps {
  label?: string;
  placeholder?: string;
  value: string|number;
  onChange: (value: string|number) => void;
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
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    width: '100%',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: error ? colors.error : colors.grey[400],
    transition: 'color 120ms ease',
  };

  const inputWrapperStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    borderRadius: '8px',
    border: `2px solid ${
      error ? colors.error : isFocused ? colors.accent : colors.grey[600]
    }`,
    backgroundColor: disabled ? colors.grey[800] : colors.black,
    transition: 'border-color 120ms ease, box-shadow 120ms ease',
    boxShadow: isFocused ? `0 0 0 3px rgba(255, 148, 22, 0.1)` : 'none',
    padding: '0 0.75rem',
  };

  const inputStyles: React.CSSProperties = {
    flex: 1,
    padding: '0.75rem',
    fontSize: '1rem',
    fontWeight: 400,
    backgroundColor: 'transparent',
    color: colors.white,
    border: 'none',
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'text',
    opacity: disabled ? 0.6 : 1,
    fontFamily: 'inherit',
    transition: 'opacity 120ms ease',
  };

  const iconWrapperStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isFocused ? colors.accent : colors.grey[500],
    transition: 'color 120ms ease',
    padding: '0 0.5rem',
  };

  const passwordToggleStyles: React.CSSProperties = {
    ...iconWrapperStyles,
    cursor: 'pointer',
    userSelect: 'none',
  };

  const errorMessageStyles: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 400,
    color: colors.error,
    marginTop: '0.25rem',
  };

  const charCountStyles: React.CSSProperties = {
    fontSize: '0.75rem',
    color: colors.grey[500],
    marginTop: '0.25rem',
    textAlign: 'right',
  };

  const inputType =
    type === 'password' && isPasswordVisible ? 'text' : type;

  return (
    <div style={containerStyles}>
      {label && (
        <label style={labelStyles}>
          {label}
          {required && <span style={{ color: colors.error }}>*</span>}
        </label>
      )}

      <div style={inputWrapperStyles}>
        {icon && iconPosition === 'left' && (
          <div style={iconWrapperStyles}>{icon}</div>
        )}

        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          autoComplete={autoComplete}
          style={inputStyles}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            style={{
              ...passwordToggleStyles,
              background: 'none',
              border: 'none',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            tabIndex={-1}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
          </button>
        )}

        {icon && iconPosition === 'right' && type !== 'password' && (
          <div style={iconWrapperStyles}>{icon}</div>
        )}
      </div>

      {error && <div style={errorMessageStyles}>{error}</div>}

      {maxLength && (
        <div style={charCountStyles}>
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
};

export default CustomInput;
