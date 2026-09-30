import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { authService } from '../../../services/authService';
import { validatePhoneNumber } from '../../../utils/validation';
import { ENV } from '../../../config/environment';
import { ApiError } from '../../../services/apiClient';
import './CustomerLogin.css';

export const CustomerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetRole = searchParams.get('role') === 'admin' ? 'admin' : 'customer';
  const { setPendingAuth } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState<string>('8074407557');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid 10-digit mobile number.');
      return;
    }

    const normalizedPhone = validation.normalizedValue!;
    setIsLoading(true);

    try {
      await authService.sendOtp({
        countryCode: ENV.COUNTRY_CODE,
        phoneNumber: normalizedPhone,
        role: targetRole,
      });

      setPendingAuth(ENV.COUNTRY_CODE, normalizedPhone, targetRole);
      navigate('/auth/verify-otp');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.userMessage);
      } else {
        setError('Unable to send OTP right now. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pg-clogin-page">
      <div className="pg-clogin-container">
        {/* Centered Auth Box */}
        <div className="pg-clogin-header">
          <div className="pg-clogin-badge" aria-hidden="true">
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

          <h1 className="pg-clogin-title">Enter Mobile Number</h1>
          <p className="pg-clogin-subtitle">We'll send you a 6-digit OTP</p>
        </div>

        {/* Card */}
        <div className="pg-clogin-card">
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="pg-clogin-error" role="alert">
                <span>{error}</span>
              </div>
            )}

            <div className="pg-clogin-field">
              <label htmlFor="pg-clogin-phone" className="pg-clogin-label">
                MOBILE NUMBER
              </label>
              <div className="pg-clogin-input-wrapper">
                <div className="pg-clogin-prefix">+91</div>
                <input
                  id="pg-clogin-phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="80744 07557"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (error) setError('');
                  }}
                  disabled={isLoading}
                  className="pg-clogin-input"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              className="pg-clogin-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            <p className="pg-clogin-terms">
              By continuing you agree to our Terms & Privacy Policy
            </p>
          </form>
        </div>

        {/* Back Link */}
        <button
          type="button"
          className="pg-clogin-back-btn"
          onClick={() => navigate('/')}
        >
          ← Back
        </button>

        {ENV.IS_DEMO_MODE && (
          <p className="pg-clogin-demo-hint">
            Demo OTP is <strong>{ENV.DEMO_OTP}</strong>
          </p>
        )}
      </div>
    </div>
  );
};
