import React, { ChangeEvent, ClipboardEvent, KeyboardEvent, useRef } from 'react';
import { ENV } from '../../config/environment';
import './OtpInput.css';

interface OtpInputProps {
  value: string;
  onChange: (otp: string) => void;
  error?: string;
  disabled?: boolean;
  id?: string;
  autoFocus?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  error,
  disabled = false,
  id = 'otp-input',
  autoFocus = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, ENV.OTP_LENGTH);
    onChange(raw);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && value.length === 0) {
      // no-op
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text/plain');
    const digitsOnly = pasted.replace(/\D/g, '').slice(0, ENV.OTP_LENGTH);
    onChange(digitsOnly);
  };

  return (
    <div className="vg-otp-group">
      <label htmlFor={id} className="vg-otp__label">
        One-time password
      </label>

      <div className={`vg-otp__input-container ${error ? 'vg-otp__input-container--error' : ''}`}>
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          maxLength={ENV.OTP_LENGTH}
          autoFocus={autoFocus}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="vg-otp__native-input"
          placeholder="1 2 3 4 5 6"
        />
        
        {/* Render segmented digits for screenshot visual fidelity */}
        <div className="vg-otp__display-boxes" aria-hidden="true" onClick={() => inputRef.current?.focus()}>
          {Array.from({ length: ENV.OTP_LENGTH }).map((_, index) => {
            const digit = value[index] || '';
            const isCurrent = index === value.length && !disabled;
            return (
              <div
                key={index}
                className={`vg-otp__box ${digit ? 'vg-otp__box--filled' : ''} ${isCurrent ? 'vg-otp__box--active' : ''}`}
              >
                {digit}
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <p id={`${id}-error`} className="vg-otp__error-text">
          {error}
        </p>
      )}
    </div>
  );
};
