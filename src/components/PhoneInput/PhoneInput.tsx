import { ChangeEvent, forwardRef } from 'react';
import { formatPhoneNumberDisplay, normalizePhoneNumber } from '../../utils/validation';
import './PhoneInput.css';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value,
      onChange,
      countryCode = '+91',
      error,
      disabled = false,
      placeholder = '98765 43210',
      id = 'phone-input',
    },
    ref
  ) => {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const normalized = normalizePhoneNumber(raw);
      onChange(normalized);
    };

    const displayValue = formatPhoneNumberDisplay(value);

    return (
      <div className="vg-phone-input-group">
        <label htmlFor={id} className="vg-phone-input__label">
          Mobile number
        </label>
        <div className={`vg-phone-input__wrapper ${error ? 'vg-phone-input__wrapper--error' : ''}`}>
          <div className="vg-phone-input__prefix" aria-hidden="true">
            {countryCode}
          </div>
          <input
            ref={ref}
            id={id}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            disabled={disabled}
            placeholder={placeholder}
            value={displayValue}
            onChange={handleInputChange}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className="vg-phone-input__field"
          />
        </div>
        {error && (
          <p id={`${id}-error`} className="vg-phone-input__error-text">
            {error}
          </p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
