import React, { useState } from 'react';
import { superAdminAuthService } from '../../services/superAdminAuthService';

export const SuperAdminSettings: React.FC = () => {
  const config = superAdminAuthService.getSecurityConfig();

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await superAdminAuthService.changePassword(currentPassword, newPassword);
      setSuccess(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err?.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: '900px' }}>
      <div className="sa-card">
        <div className="sa-card__header">
          <div>
            <h2 className="sa-card__title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sa-lime)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Executive Security & Access Policies
            </h2>
            <p className="sa-card__subtitle">
              Cryptographic master credential controls, session timeouts, and role isolation
            </p>
          </div>
          <span className="sa-status-badge sa-status-badge--verified">
            Initialized & Protected
          </span>
        </div>

        {/* Master Account Info */}
        <div
          style={{
            background: 'var(--sa-bg-surface-elevated)',
            border: '1px solid var(--sa-border)',
            borderRadius: 'var(--sa-radius-md)',
            padding: '16px',
            marginBottom: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
          }}
        >
          <div>
            <span className="sa-field-label">Super Admin Name</span>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: 4 }}>
              {config.name}
            </div>
          </div>
          <div>
            <span className="sa-field-label">Primary Executive Email</span>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--sa-cyan)', marginTop: 4 }}>
              {config.email}
            </div>
          </div>
          <div>
            <span className="sa-field-label">Two-Factor Authentication</span>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--sa-lime)', marginTop: 4 }}>
              {config.twoFactorEnabled ? 'Enabled (Active)' : 'Disabled'}
            </div>
          </div>
          <div>
            <span className="sa-field-label">Session Idle Timeout</span>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--sa-amber)', marginTop: 4 }}>
              45 Minutes (Auto-Lock)
            </div>
          </div>
        </div>

        {/* Password Update Form */}
        <div style={{ borderTop: '1px solid var(--sa-border)', paddingTop: 20 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: '0 0 14px 0' }}>
            Update Master Executive Password
          </h3>

          {error && (
            <div
              style={{
                padding: '10px 14px',
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: 'var(--sa-radius-md)',
                color: 'var(--sa-rose)',
                fontSize: '0.8rem',
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                padding: '10px 14px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--sa-radius-md)',
                color: 'var(--sa-emerald)',
                fontSize: '0.8rem',
                marginBottom: 16,
              }}
            >
              {success}
            </div>
          )}

          <form onSubmit={handlePasswordChange}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              <div className="sa-field-group">
                <label className="sa-field-label">Current Password</label>
                <input
                  type="password"
                  className="sa-input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <div className="sa-field-group">
                <label className="sa-field-label">New Password (min 8 chars)</label>
                <input
                  type="password"
                  className="sa-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <div className="sa-field-group">
                <label className="sa-field-label">Confirm New Password</label>
                <input
                  type="password"
                  className="sa-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="sa-btn sa-btn-primary"
              disabled={isLoading}
              style={{ marginTop: 16 }}
            >
              {isLoading ? 'Hashing & Updating...' : 'Update Password with Salted Hash'}
            </button>
          </form>
        </div>
      </div>

      {/* Regional Commission Policy Details */}
      <div className="sa-card">
        <h3 className="sa-card__title" style={{ marginBottom: 12 }}>
          Contractual Commission Structure Overview
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--sa-text-muted)', lineHeight: 1.6, margin: 0 }}>
          Area Admins operate under contracted service level agreements:
          <br />• <strong>AP-Z01 to AP-Z02, AP-Z04, AP-Z06 to AP-Z08:</strong> 5.0% commission on gross successful customer collections.
          <br />• <strong>AP-Z03 (Tirupati Hub):</strong> 4.5% commission rate based on high pilgrimage traffic volume.
          <br />• <strong>AP-Z05 (Nellore Corridor):</strong> 5.0% commission rate with dedicated NH-16 uptime bonus.
          <br />Settlements are reconciled bi-monthly (15th & end of month). Outstanding admin remittances are due within 7 days of reconciliation.
        </p>
      </div>
    </div>
  );
};

export default SuperAdminSettings;
