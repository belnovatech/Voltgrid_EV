import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../../components/BackButton/BackButton';
import { AuthCard } from '../../components/AuthCard/AuthCard';
import { PhoneInput } from '../../components/PhoneInput/PhoneInput';
import { Button } from '../../components/Button/Button';
import { InlineAlert } from '../../components/InlineAlert/InlineAlert';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { validatePhoneNumber } from '../../utils/validation';
import { ENV } from '../../config/environment';
import { ApiError } from '../../services/apiClient';
import './SignIn.css';

export const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { setPendingAuth, pendingPhoneNumber } = useAuth();

  const [phone, setPhone] = useState<string>(pendingPhoneNumber || '');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = validatePhoneNumber(phone);
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
      });

      setPendingAuth(ENV.COUNTRY_CODE, normalizedPhone);
      navigate('/verify-otp');
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

  const demoFooter = ENV.IS_DEMO_MODE ? (
    <p className="vg-signin__demo-hint">
      Demo OTP is <strong>{ENV.DEMO_OTP}</strong>
    </p>
  ) : null;

  return (
    <div className="vg-auth-page">
      <div className="container vg-auth-page__container">
        <div className="vg-auth-page__nav-row">
          <BackButton to="/" />
        </div>

        <div className="vg-auth-page__center-box">
          <AuthCard
            title="Sign in to VoltGrid"
            subtitle="We'll send a one-time password to your mobile."
            footerContent={demoFooter}
          >
            <form onSubmit={handleSubmit} noValidate>
              <InlineAlert type="error" message={error} />

              <PhoneInput
                value={phone}
                onChange={(val) => {
                  setPhone(val);
                  if (error) setError('');
                }}
                disabled={isLoading}
                placeholder="98765 43210"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          </AuthCard>
        </div>
      </div>
    </div>
  );
};
