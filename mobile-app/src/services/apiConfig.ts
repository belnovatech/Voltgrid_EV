/**
 * Centralized API & Mobile Application Configuration
 * Reuses existing backend URLs, demo modes, and provides Capacitor native defaults.
 */
export const API_CONFIG = {
  // Production / Deployed API Base URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.voltgrid.example.com/v1',
  IS_DEMO_MODE: import.meta.env.VITE_ENABLE_DEMO_MODE !== 'false',
  DEMO_OTP: import.meta.env.VITE_DEMO_OTP || '123456',
  OTP_COOLDOWN_SECONDS: Number(import.meta.env.VITE_OTP_RESEND_COOLDOWN_SECONDS) || 29,
  DEFAULT_COUNTRY_CODE: '+91',
  PHONE_LENGTH: 10,
  OTP_LENGTH: 6,
  REQUEST_TIMEOUT_MS: 12000,
  MAX_RETRIES: 2,
};
