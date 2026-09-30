import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { authService } from '../../../services/authService';
import { validateOtp } from '../../../utils/validation';
import { ENV } from '../../../config/environment';
import { ApiError } from '../../../services/apiClient';
import './VerifyOTP.css';

export const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const {
    pendingPhoneNumber,
    pendingCountryCode,
    pendingRole,
    loginUser,
  } = useAuth();

  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(ENV.OTP_RESEND_COOLDOWN);

  const effectivePhone = pendingPhoneNumber || '8074407557';
  const effectiveCountryCode = pendingCountryCode || ENV.COUNTRY_CODE;
  const effectiveRole = pendingRole || 'customer';

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = window.setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = validateOtp(otp);
    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.verifyOtp({
        countryCode: effectiveCountryCode,
        phoneNumber: effectivePhone,
        otp: validation.normalizedValue!,
        role: effectiveRole,
      });

      if (response.user && response.token) {
        loginUser(response.user, response.token);
        if (response.user.role === 'admin') {
          navigate('/admin');
        } else {
          // Navigate to Complete Profile onboarding screen!
          navigate('/auth/complete-profile');
        }
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.userMessage);
      } else {
        setError('Verification failed. Please check the OTP.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    setError('');
    try {
      await authService.sendOtp({
        countryCode: effectiveCountryCode,
        phoneNumber: effectivePhone,
        role: effectiveRole,
      });
      setCountdown(ENV.OTP_RESEND_COOLDOWN);
      setOtp('');
    } catch {
      setError('Unable to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="pg-votp-page">
      <div className="pg-votp-container">
        <div className="pg-votp-header">
          <div className="pg-votp-badge" aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ae600"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>

          <h1 className="pg-votp-title">Enter Verification Code</h1>
          <p className="pg-votp-subtitle">
            Sent to {effectiveCountryCode} {effectivePhone}
          </p>
        </div>

        <div className="pg-votp-card">
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="pg-votp-error" role="alert">
                <span>{error}</span>
              </div>
            )}

            <div className="pg-votp-field">
              <label htmlFor="pg-otp-code-input" className="pg-votp-label">
                ONE-TIME PASSWORD
              </label>
              <input
                id="pg-otp-code-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="1 2 3 4 5 6"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                  if (error) setError('');
                }}
                disabled={isLoading}
                className="pg-votp-input"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="pg-votp-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify and Continue'}
            </button>

            <div className="pg-votp-resend-row">
              {countdown > 0 ? (
                <>
                  <span className="pg-votp-resend-disabled">Resend OTP</span>
                  <span className="pg-votp-countdown">in {countdown}s</span>
                </>
              ) : (
                <button
                  type="button"
                  className="pg-votp-resend-btn"
                  onClick={handleResend}
                  disabled={isResending}
                >
                  {isResending ? 'Sending...' : 'Resend OTP'}
                </button>
              )}
            </div>
          </form>
        </div>

        <button
          type="button"
          className="pg-votp-back-btn"
          onClick={() => navigate('/login')}
        >
          ← Back
        </button>

        {ENV.IS_DEMO_MODE && (
          <p className="pg-votp-demo-hint">
            Demo OTP is <strong>{ENV.DEMO_OTP}</strong>
          </p>
        )}
      </div>
    </div>
  );
};
