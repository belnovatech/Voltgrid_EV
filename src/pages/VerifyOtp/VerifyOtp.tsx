import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../../components/BackButton/BackButton';
import { AuthCard } from '../../components/AuthCard/AuthCard';
import { OtpInput } from '../../components/OtpInput/OtpInput';
import { Button } from '../../components/Button/Button';
import { InlineAlert } from '../../components/InlineAlert/InlineAlert';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { validateOtp } from '../../utils/validation';
import { ENV } from '../../config/environment';
import { ApiError } from '../../services/apiClient';
import './VerifyOtp.css';

export const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  const {
    pendingPhoneNumber,
    pendingCountryCode,
    pendingRole,
    loginUser,
  } = useAuth();

  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(ENV.OTP_RESEND_COOLDOWN);

  const effectivePhone = pendingPhoneNumber || '9876543210';
  const effectiveCountryCode = pendingCountryCode || ENV.COUNTRY_CODE;
  const effectiveRole = pendingRole || 'customer';

  // Resend Timer Effect
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
    setSuccessMessage('');

    const validation = validateOtp(otp);
    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid 6-digit code.');
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
          navigate('/dashboard');
        }
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.userMessage);
      } else {
        setError('Verification failed. Please check the OTP and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || isResending) return;

    setError('');
    setSuccessMessage('');
    setIsResending(true);

    try {
      await authService.sendOtp({
        countryCode: effectiveCountryCode,
        phoneNumber: effectivePhone,
        role: effectiveRole,
      });

      setSuccessMessage('A new OTP has been sent to your mobile number.');
      setCountdown(ENV.OTP_RESEND_COOLDOWN);
      setOtp('');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.userMessage);
      } else {
        setError('Unable to resend OTP. Please try again later.');
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="vg-auth-page">
      <div className="container vg-auth-page__container">
        <div className="vg-auth-page__nav-row">
          <BackButton to="/login" />
        </div>

        <div className="vg-auth-page__center-box">
          <AuthCard
            title="Verify your number"
            subtitle={`Enter the 6-digit code sent to ${effectiveCountryCode} ${effectivePhone}.`}
          >
            <form onSubmit={handleSubmit} noValidate>
              <InlineAlert type="error" message={error} />
              <InlineAlert type="success" message={successMessage} />

              <OtpInput
                value={otp}
                onChange={(val) => {
                  setOtp(val);
                  if (error) setError('');
                }}
                disabled={isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                className="vg-verify__submit-btn"
              >
                {isLoading ? 'Verifying...' : 'Verify and continue'}
              </Button>

              <div className="vg-verify__resend-row">
                {countdown > 0 ? (
                  <>
                    <span className="vg-verify__resend-label-disabled">Resend OTP</span>
                    <span className="vg-verify__countdown-text">in {countdown}s</span>
                  </>
                ) : (
                  <button
                    type="button"
                    className="vg-verify__resend-btn"
                    onClick={handleResendOtp}
                    disabled={isResending}
                  >
                    {isResending ? 'Sending...' : 'Resend OTP'}
                  </button>
                )}
              </div>
            </form>
          </AuthCard>
        </div>
      </div>
    </div>
  );
};
