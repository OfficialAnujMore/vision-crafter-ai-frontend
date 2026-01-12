import React, { useId, useState } from 'react';
import { colors } from '../constants/colors';

interface CustomInputProps {
  label: string;
  placeholder?: string;
  value: string;
  disabled?: boolean;
  isSecure?: boolean;
  icon?: React.ReactNode; // used for password visibility toggle
  onChange?: (value: string) => void;
}

const EyeIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" strokeWidth="2" />
    <circle cx="12" cy="12" r="3" strokeWidth="2" />
  </svg>
);

const EyeOffIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M3 3l18 18M10.73 5.08A9.78 9.78 0 0 1 12 5c7 0 11 7 11 7a18.38 18.38 0 0 1-4.56 5.22M6.09 6.09A18.27 18.27 0 0 0 1 12s4 7 11 7c1.12 0 2.2-.16 3.21-.45" strokeWidth="2" />
    <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" strokeWidth="2" />
  </svg>
);

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  value,
  disabled = false,
  isSecure = false,
  icon,
  onChange,
}) => {
  const id = useId();
  const [show, setShow] = useState(false);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.95rem',
    color: colors.text.secondary,
    fontWeight: 500,
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: isSecure ? '10px 40px 10px 12px' : '10px 12px',
    fontSize: '1rem',
    border: `1.5px solid ${colors.border.light}`,
    borderRadius: 8,
    outline: 'none',
    color: colors.text.primary,
    backgroundColor: disabled ? colors.neutral[100] : colors.neutral[0],
    transition: 'border-color 0.2s',
  };

  const toggleBtnStyle: React.CSSProperties = {
    position: 'absolute',
    right: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 6,
    border: 'none',
    background: 'transparent',
    color: colors.text.secondary,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const inputType = isSecure && !show ? 'password' : 'text';

  return (
    <div style={containerStyle}>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      <div style={inputWrapperStyle}>
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          style={inputStyle}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={(e) => (e.currentTarget.style.borderColor = colors.primary[600])}
          onBlur={(e) => (e.currentTarget.style.borderColor = colors.border.light)}
        />
        {isSecure && (
          <button
            type="button"
            aria-label={show ? 'Hide password' : 'Show password'}
            style={toggleBtnStyle}
            onClick={() => !disabled && setShow((s) => !s)}
          >
            {icon ?? (show ? <EyeOffIcon /> : <EyeIcon />)}
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomInput;