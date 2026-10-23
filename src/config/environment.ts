/**
 * Centralized Application Configuration
 * All environment variables are parsed and typed here for safe usage.
 */
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.voltgrid.example.com/v1',
  IS_DEMO_MODE: import.meta.env.VITE_ENABLE_DEMO_MODE !== 'false',
  DEMO_OTP: import.meta.env.VITE_DEMO_OTP || '123456',
  OTP_RESEND_COOLDOWN: Number(import.meta.env.VITE_OTP_RESEND_COOLDOWN_SECONDS) || 29,
  COUNTRY_CODE: '+91',
  PHONE_LENGTH: 10,
  OTP_LENGTH: 6,
  PAYMENT_GATEWAY_PROVIDER: import.meta.env.VITE_PAYMENT_GATEWAY_PROVIDER || 'sandbox',
  PAYMENT_CURRENCY: import.meta.env.VITE_PAYMENT_CURRENCY || 'INR',
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
} as const;
