import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, Eye, EyeOff, ShieldCheck, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { AppButton } from '../../components/common/AppButton';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { API_CONFIG } from '../../services/apiConfig';
import { parseErrorMessage } from '../../services/errorHandler';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [mode, setMode] = useState<'otp' | 'password'>('otp');
  const [phoneNumber, setPhoneNumber] = useState('8074407557');
  const [countryCode] = useState('+91');
  const [otpStep, setOtpStep] = useState<'input_phone' | 'input_otp'>('input_phone');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('driver@voltgrid.ev');
  const [password, setPassword] = useState('driver1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [demoHint, setDemoHint] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    if (cleanPhone.length !== API_CONFIG.PHONE_LENGTH) {
      setErrorMessage(`Please enter a valid ${API_CONFIG.PHONE_LENGTH}-digit phone number.`);
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.sendOtp({
        countryCode,
        phoneNumber: cleanPhone,
        role: 'customer',
      });
      setOtpStep('input_otp');
      if (res.demoOtpHint) {
        setDemoHint(`Demo OTP: ${res.demoOtpHint}`);
      }
    } catch (err) {
      setErrorMessage(parseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== API_CONFIG.OTP_LENGTH) {
      setErrorMessage(`Please enter the ${API_CONFIG.OTP_LENGTH}-digit verification code.`);
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.verifyOtp({
        countryCode,
        phoneNumber: phoneNumber.trim(),
        otp: cleanOtp,
        role: 'customer',
      });
      if (res.token && res.user) {
        loginUser(res.user, res.token);
        navigate('/home', { replace: true });
      }
    } catch (err) {
      setErrorMessage(parseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.loginWithCredentials({
        email: email.trim(),
        password,
        role: 'customer',
      });
      if (res.token && res.user) {
        loginUser(res.user, res.token);
        navigate('/home', { replace: true });
      }
    } catch (err) {
      setErrorMessage(parseErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="login-logo-wrapper">
            <img src="/assets/voltgrid-ev-logo.png" alt="Voltgrid EV" className="login-logo" />
          </div>
          <h1 className="login-title">
            VOLT<span className="login-title-accent">GRID</span> EV
          </h1>
          <p className="login-subtitle">High-speed EV Charging & Intelligent Driver Mobility</p>
        </div>

        {/* Card */}
        <div className="login-card">
          {/* Switch tabs */}
          <div className="login-tabs">
            <button
              type="button"
              className={`login-tab ${mode === 'otp' ? 'login-tab--active' : ''}`}
              onClick={() => {
                setMode('otp');
                setErrorMessage(null);
              }}
            >
              Mobile OTP
            </button>
            <button
              type="button"
              className={`login-tab ${mode === 'password' ? 'login-tab--active' : ''}`}
              onClick={() => {
                setMode('password');
                setErrorMessage(null);
              }}
            >
              Password
            </button>
          </div>

          {errorMessage && (
            <div className="login-error-banner" style={{ marginBottom: '16px' }}>
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {demoHint && mode === 'otp' && otpStep === 'input_otp' && (
            <div
              className="login-demo-hint"
              style={{ marginBottom: '16px', cursor: 'pointer' }}
              onClick={() => setOtp(API_CONFIG.DEMO_OTP)}
              title="Click to fill demo code"
            >
              🔑 {demoHint} (Tap to auto-fill)
            </div>
          )}

          {/* OTP Mode */}
          {mode === 'otp' && (
            <>
              {otpStep === 'input_phone' ? (
                <form className="login-form" onSubmit={handleSendOtp}>
                  <div className="form-group">
                    <label className="form-label">Driver Mobile Number</label>
                    <div className="form-input-wrapper">
                      <span className="form-input-prefix">{countryCode}</span>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="10-digit mobile number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        autoFocus
                      />
                    </div>
                  </div>

                  <AppButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isLoading}
                    icon={<ArrowRight size={18} />}
                  >
                    Get Verification Code
                  </AppButton>
                </form>
              ) : (
                <form className="login-form" onSubmit={handleVerifyOtp}>
                  <div className="form-group">
                    <label className="form-label">Enter 6-Digit Code</label>
                    <div className="form-input-wrapper">
                      <div className="form-input-icon">
                        <ShieldCheck size={20} color="var(--color-neon-green)" />
                      </div>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="••••••"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        autoFocus
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      color: 'var(--color-text-muted)',
                      marginTop: '-4px',
                    }}
                  >
                    <span>Sent to {countryCode} {phoneNumber}</span>
                    <button
                      type="button"
                      onClick={() => setOtpStep('input_phone')}
                      style={{ color: 'var(--color-cyan)', textDecoration: 'underline' }}
                    >
                      Change
                    </button>
                  </div>

                  <AppButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isLoading}
                    icon={<ArrowRight size={18} />}
                  >
                    Sign In & Drive
                  </AppButton>
                </form>
              )}
            </>
          )}

          {/* Password Mode */}
          {mode === 'password' && (
            <form className="login-form" onSubmit={handlePasswordLogin}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="form-input-wrapper">
                  <div className="form-input-icon">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="driver@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="form-input-wrapper">
                  <div className="form-input-icon">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="form-input-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="login-remember-row">
                <label className="login-checkbox-label">
                  <input
                    type="checkbox"
                    className="login-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember this device</span>
                </label>
                <span style={{ color: 'var(--color-cyan)', fontSize: '11px' }}>Driver Portal</span>
              </div>

              <AppButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                icon={<ArrowRight size={18} />}
              >
                Sign In
              </AppButton>
            </form>
          )}
        </div>

        <p className="login-footer-note">
          Secured with end-to-end encrypted mobility credentials.<br />
          <span className="login-footer-accent">Voltgrid EV Driver Experience</span>
        </p>
      </div>
    </div>
  );
};
