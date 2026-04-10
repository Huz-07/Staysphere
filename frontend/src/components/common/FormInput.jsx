import React, { useState } from 'react';
import './FormInput.css';

export default function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  icon,
  hint,
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`form-field ${error ? 'form-field--error' : ''} ${disabled ? 'form-field--disabled' : ''}`}>
      {label && (
        <label className="form-field__label" htmlFor={name}>
          {label}
          {required && <span className="form-field__required" aria-hidden>*</span>}
        </label>
      )}
      <div className="form-field__control">
        {icon && <span className="form-field__icon form-field__icon--left">{icon}</span>}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`form-field__input ${icon ? 'form-field__input--icon-left' : ''} ${type === 'password' ? 'form-field__input--icon-right' : ''}`}
          aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
          aria-invalid={!!error}
          {...rest}
        />
        {type === 'password' && (
          <button
            type="button"
            className="form-field__icon form-field__icon--right form-field__toggle-pw"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
                <path d="M3 3l14 14M8.5 8.5A3 3 0 0011.5 11.5M6.08 6.08A9.77 9.77 0 002 10c1.54 3.11 5 5 8 5a9.77 9.77 0 003.92-.92M10 5c2.97 0 6.46 1.89 8 5a10.07 10.07 0 01-1.44 2.56" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
                <path d="M2 10c1.54-3.11 5-5 8-5s6.46 1.89 8 5c-1.54 3.11-5 5-8 5s-6.46-1.89-8-5z" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="form-field__error" id={`${name}-error`} role="alert">{error}</p>}
      {hint && !error && <p className="form-field__hint" id={`${name}-hint`}>{hint}</p>}
    </div>
  );
}
