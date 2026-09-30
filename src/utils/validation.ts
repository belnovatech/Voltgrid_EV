import { ENV } from '../config/environment';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  normalizedValue?: string;
}

/**
 * Normalizes phone input by removing non-digit characters and optional leading +91 or 0
 */
export function normalizePhoneNumber(rawInput: string): string {
  if (!rawInput) return '';
  // Remove all non-digits
  let digits = rawInput.replace(/\D/g, '');
  
  // If user pasted with 91 prefix and length is 12 digits, strip leading 91
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  return digits.slice(0, ENV.PHONE_LENGTH);
}

/**
 * Formats a 10-digit number as "XXXXX XXXXX" for display
 */
export function formatPhoneNumberDisplay(digits: string): string {
  const clean = digits.replace(/\D/g, '').slice(0, 10);
  if (clean.length > 5) {
    return `${clean.slice(0, 5)} ${clean.slice(5)}`;
  }
  return clean;
}

/**
 * Validates an Indian mobile number
 */
export function validatePhoneNumber(rawInput: string): ValidationResult {
  const normalized = normalizePhoneNumber(rawInput);

  if (!rawInput || !rawInput.trim()) {
    return {
      isValid: false,
      error: 'Please enter your 10-digit mobile number.',
      normalizedValue: '',
    };
  }

  if (normalized.length === 0) {
    return {
      isValid: false,
      error: 'Mobile number cannot contain only letters or symbols.',
      normalizedValue: '',
    };
  }

  if (normalized.length < ENV.PHONE_LENGTH) {
    return {
      isValid: false,
      error: `Mobile number must be exactly ${ENV.PHONE_LENGTH} digits. (Current: ${normalized.length})`,
      normalizedValue: normalized,
    };
  }

  // Valid Indian mobile numbers generally start with 6, 7, 8, or 9
  const firstDigit = normalized.charAt(0);
  if (!['6', '7', '8', '9'].includes(firstDigit)) {
    return {
      isValid: false,
      error: 'Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.',
      normalizedValue: normalized,
    };
  }

  return {
    isValid: true,
    normalizedValue: normalized,
  };
}

/**
 * Validates a 6-digit OTP
 */
export function validateOtp(rawOtp: string): ValidationResult {
  const cleanOtp = (rawOtp || '').replace(/\D/g, '');

  if (!rawOtp || !rawOtp.trim()) {
    return {
      isValid: false,
      error: 'Please enter the 6-digit OTP code.',
      normalizedValue: '',
    };
  }

  if (cleanOtp.length !== ENV.OTP_LENGTH) {
    return {
      isValid: false,
      error: `OTP must be exactly ${ENV.OTP_LENGTH} digits.`,
      normalizedValue: cleanOtp,
    };
  }

  return {
    isValid: true,
    normalizedValue: cleanOtp,
  };
}
