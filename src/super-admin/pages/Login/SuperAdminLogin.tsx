import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { superAdminAuthService } from '../../services/superAdminAuthService';
import '../../styles/super-admin.css';

export const SuperAdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();

  const [mode, setMode] = useState<'login' | 'initialize'>('login');
  const [email, setEmail] = useState<string>('superadmin@ewaytoyourevs.in');
  const [password, setPassword] = useState<string>('SuperAdmin@2026!');
  const [twoFactorPin, setTwoFactorPin] = useState<string>('123456');

  // Initialization form states
  const [initName, setInitName] = useState<string>('Executive Super Admin');
  const [initEmail, setInitEmail] = useState<string>('superadmin@ewaytoyourevs.in');
  const [initPassword, setInitPassword] = useState<string>('');
  const [initConfirmPassword, setInitConfirmPassword] = useState<string>('');
  const [initRecoveryPin, setInitRecoveryPin] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Extract return URL if any
  const query = new URLSearchParams(location.search);
  const redirectUrl = query.get('redirect') || '/super-admin/dashboard';

  useEffect(() => {
    // Check if already authenticated
    const session = superAdminAuthService.getActiveSession();
    if (session) {
      loginUser(session.user, session.token);
      navigate(redirectUrl, { replace: true });
    }
  }, [navigate, redirectUrl, loginUser]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await superAdminAuthService.login(email, password, twoFactorPin);
      loginUser(response.user, response.token);
      navigate(redirectUrl, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitializeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (initPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (initPassword !== initConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (initRecoveryPin.length !== 6) {
      setError('Recovery PIN must be 6 digits.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await superAdminAuthService.initializeMasterAccount({
        name: initName,
        email: initEmail,
        password: initPassword,
        recoveryPin: initRecoveryPin,
      });
      setSuccessMessage(res.message);
      setMode('login');
      setEmail(initEmail);
      setPassword(initPassword);
    } catch (err: any) {
      setError(err?.message || 'Initialization failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#050a14',
        backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(154, 230, 0, 0.08) 0%, transparent 60%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#f8fafc',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(12, 22, 38, 0.92)',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(16px)',
          padding: '36px 32px',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#0c1626',
              border: '1px solid rgba(154, 230, 0, 0.3)',
              boxShadow: '0 0 20px rgba(154, 230, 0, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              overflow: 'hidden',
            }}
          >
            <img src="/eway-logo.png" alt="Eway EV" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.02em', color: '#fff' }}>
            Executive Super Admin
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
            {mode === 'login'
              ? 'Authorized statewide management & audit portal'
              : 'Secure First-Time Master Account Setup'}
          </p>
        </div>

        {/* Feedback messages */}
        {error && (
          <div
            style={{
              padding: '12px 14px',
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '10px',
              color: '#f43f5e',
              fontSize: '0.8rem',
              marginBottom: '20px',
            }}
            role="alert"
          >
            {error}
          </div>
        )}

        {successMessage && (
          <div
            style={{
              padding: '12px 14px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '10px',
              color: '#10b981',
              fontSize: '0.8rem',
              marginBottom: '20px',
            }}
          >
            {successMessage}
          </div>
        )}

        {/* Login Mode */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', marginBottom: '6px' }}>
                  Super Admin Email
                </label>
                <input
                  type="email"
                  className="sa-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@ewaytoyourevs.in"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', marginBottom: '6px' }}>
                  Master Password
                </label>
                <input
                  type="password"
                  className="sa-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8' }}>
                    2FA Security Token / PIN
                  </label>
                  <span style={{ fontSize: '0.7rem', color: '#9ae600' }}>Demo: 123456</span>
                </div>
                <input
                  type="text"
                  className="sa-input"
                  maxLength={6}
                  value={twoFactorPin}
                  onChange={(e) => setTwoFactorPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-digit authenticator code"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="sa-btn sa-btn-primary"
                style={{ width: '100%', padding: '12px', marginTop: '8px', fontSize: '0.9rem' }}
              >
                {isLoading ? 'Verifying Credentials...' : 'Authenticate & Enter Dashboard'}
              </button>
            </div>
          </form>
        )}

        {/* First-Time Initialization Mode */}
        {mode === 'initialize' && (
          <form onSubmit={handleInitializeSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                  Full Executive Name
                </label>
                <input
                  type="text"
                  className="sa-input"
                  value={initName}
                  onChange={(e) => setInitName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                  Official Email
                </label>
                <input
                  type="email"
                  className="sa-input"
                  value={initEmail}
                  onChange={(e) => setInitEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                  New Master Password (min 8 chars)
                </label>
                <input
                  type="password"
                  className="sa-input"
                  value={initPassword}
                  onChange={(e) => setInitPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                  Confirm Master Password
                </label>
                <input
                  type="password"
                  className="sa-input"
                  value={initConfirmPassword}
                  onChange={(e) => setInitConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                  6-Digit Master Recovery PIN
                </label>
                <input
                  type="text"
                  className="sa-input"
                  maxLength={6}
                  value={initRecoveryPin}
                  onChange={(e) => setInitRecoveryPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 849201"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="sa-btn sa-btn-primary"
                style={{ width: '100%', padding: '12px', marginTop: '6px' }}
              >
                {isLoading ? 'Setting Up...' : 'Initialize Master Account'}
              </button>
            </div>
          </form>
        )}

        {/* Footer actions */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.775rem',
            color: '#64748b',
          }}
        >
          {mode === 'login' ? (
            <button
              type="button"
              onClick={() => {
                setMode('initialize');
                setError('');
              }}
              style={{ background: 'none', border: 'none', color: '#9ae600', cursor: 'pointer', padding: 0 }}
            >
              First-Time Initialization
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              style={{ background: 'none', border: 'none', color: '#9ae600', cursor: 'pointer', padding: 0 }}
            >
              Back to Sign In
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
          >
            ← Return to Eway Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
