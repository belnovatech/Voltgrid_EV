import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { superAdminAuthService } from '../../services/superAdminAuthService';

interface SuperAdminHeaderProps {
  onToggleMobileMenu: () => void;
  pageTitle: string;
}

export const SuperAdminHeader: React.FC<SuperAdminHeaderProps> = ({
  onToggleMobileMenu,
  pageTitle,
}) => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [currentDateStr, setCurrentDateStr] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateStr(
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      );
    };
    updateTime();
  }, []);

  const handleLogout = () => {
    superAdminAuthService.logout('Header logout clicked');
    logoutUser();
    navigate('/super-admin/login');
  };

  return (
    <header className="sa-header">
      <div className="sa-header__left">
        <button
          type="button"
          className="sa-header__mobile-menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Open navigation menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="sa-header__title-group">
          <h1 className="sa-header__page-title">{pageTitle}</h1>
          <span className="sa-header__welcome">
            Welcome, <strong>{user?.name || 'Super Admin'}</strong> · Executive Analytics Console
          </span>
        </div>
      </div>

      <div className="sa-header__right">
        <div className="sa-header__badge-role">
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sa-lime)' }} />
          SUPER_ADMIN
        </div>

        <div className="sa-header__date-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{currentDateStr}</span>
        </div>

        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="sa-header__notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="System Alerts & Notifications"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="sa-header__notif-indicator" />
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '48px',
                width: '320px',
                background: 'var(--sa-bg-surface-elevated)',
                border: '1px solid var(--sa-border-active)',
                borderRadius: 'var(--sa-radius-md)',
                boxShadow: 'var(--sa-shadow-card)',
                padding: '16px',
                zIndex: 200,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>Priority System Alerts</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--sa-lime)' }}>3 Pending</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: '0.775rem', padding: '8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 6, borderLeft: '3px solid var(--sa-amber)' }}>
                  <strong>Settlement Batch STL-2024-002:</strong> Partial ₹2.89L received from Ravi Kumar Varma.
                </div>
                <div style={{ fontSize: '0.775rem', padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 6, borderLeft: '3px solid var(--sa-emerald)' }}>
                  <strong>High Growth:</strong> Tirupati East Hub crossed ₹5.12L in collections (+22.5%).
                </div>
                <div style={{ fontSize: '0.775rem', padding: '8px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: 6, borderLeft: '3px solid var(--sa-cyan)' }}>
                  <strong>Reconciliation:</strong> Weekly bank settlement verification cycle open.
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="sa-btn sa-btn-secondary sa-btn-sm"
          title="Sign Out"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};
