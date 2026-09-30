import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { validatePhoneNumber } from '../../utils/validation';
import { ENV } from '../../config/environment';
import { ApiError } from '../../services/apiClient';
import { UserRole } from '../../types/auth';
import './Login.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setPendingAuth, loginUser } = useAuth();

  const roleParam = (searchParams.get('role') as UserRole) || 'customer';
  const [activeRole, setActiveRole] = useState<UserRole>(
    roleParam === 'admin' ? 'admin' : 'customer'
  );

  // Form states
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [adminEmail, setAdminEmail] = useState<string>('ops.lead@powergrid.ev');
  const [adminPassword, setAdminPassword] = useState<string>('admin123');
  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (searchParams.get('role') === 'admin') {
      setActiveRole('admin');
    }
  }, [searchParams]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
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
        role: activeRole,
      });

      setPendingAuth(ENV.COUNTRY_CODE, normalizedPhone, activeRole);
      navigate(`/verify-otp?role=${activeRole}`);
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

  const handleAdminCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!adminEmail.includes('@')) {
      setError('Please enter a valid admin email address.');
      return;
    }

    if (!adminPassword || adminPassword.length < 4) {
      setError('Please enter your admin password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.loginWithCredentials({
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });

      if (response.user && response.token) {
        loginUser(response.user, response.token);
        navigate('/admin');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.userMessage);
      } else {
        setError('Authentication failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pg-login-page">
      <div className="pg-login-container">
        {/* Back Link */}
        <button
          type="button"
          className="pg-login__back-btn"
          onClick={() => navigate('/')}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to Home</span>
        </button>

        {/* Auth Card */}
        <div className="pg-login-card">
          {/* Logo Badge */}
          <div className="pg-login-card__logo-badge" aria-hidden="true">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>

          <h1 className="pg-login-card__title">
            {activeRole === 'admin' ? 'Operations Center Login' : 'Sign in to PowerGrid'}
          </h1>
          <p className="pg-login-card__subtitle">
            {activeRole === 'admin'
              ? 'Enter your operator credentials or mobile number.'
              : "We'll send a one-time password to your mobile."}
          </p>

          {/* Role Switcher Tabs */}
          <div className="pg-login__role-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeRole === 'customer'}
              className={`pg-login__role-tab ${activeRole === 'customer' ? 'pg-login__role-tab--active' : ''}`}
              onClick={() => {
                setActiveRole('customer');
                setError('');
              }}
            >
              Customer
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeRole === 'admin'}
              className={`pg-login__role-tab ${activeRole === 'admin' ? 'pg-login__role-tab--active' : ''}`}
              onClick={() => {
                setActiveRole('admin');
                setError('');
              }}
            >
              Operations Admin
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="pg-login__error-alert" role="alert">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Customer / OTP Form */}
          {activeRole === 'customer' || authMode === 'otp' ? (
            <form onSubmit={handlePhoneSubmit} noValidate>
              <div className="pg-login__field-group">
                <label htmlFor="pg-phone-input" className="pg-login__label">
                  Mobile number
                </label>
                <div className="pg-login__phone-wrapper">
                  <span className="pg-login__phone-prefix">+91</span>
                  <input
                    id="pg-phone-input"
                    type="tel"
                    inputMode="numeric"
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (error) setError('');
                    }}
                    disabled={isLoading}
                    className="pg-login__input"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="pg-login__submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>

              {activeRole === 'admin' && (
                <button
                  type="button"
                  className="pg-login__switch-mode-btn"
                  onClick={() => setAuthMode('password')}
                >
                  Use Operator Email & Password instead
                </button>
              )}
            </form>
          ) : (
            /* Admin Password Form */
            <form onSubmit={handleAdminCredentialsSubmit} noValidate>
              <div className="pg-login__field-group">
                <label htmlFor="pg-admin-email" className="pg-login__label">
                  Operator Email
                </label>
                <input
                  id="pg-admin-email"
                  type="email"
                  placeholder="ops.lead@powergrid.ev"
                  value={adminEmail}
                  onChange={(e) => {
                    setAdminEmail(e.target.value);
                    if (error) setError('');
                  }}
                  disabled={isLoading}
                  className="pg-login__input pg-login__input--full"
                />
              </div>

              <div className="pg-login__field-group">
                <label htmlFor="pg-admin-password" className="pg-login__label">
                  Password
                </label>
                <input
                  id="pg-admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    if (error) setError('');
                  }}
                  disabled={isLoading}
                  className="pg-login__input pg-login__input--full"
                />
              </div>

              <button
                type="submit"
                className="pg-login__submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Sign in as Operator'}
              </button>

              <button
                type="button"
                className="pg-login__switch-mode-btn"
                onClick={() => setAuthMode('otp')}
              >
                Use Mobile OTP verification instead
              </button>
            </form>
          )}

          {ENV.IS_DEMO_MODE && (
            <p className="pg-login__demo-hint">
              Demo OTP is <strong>{ENV.DEMO_OTP}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
