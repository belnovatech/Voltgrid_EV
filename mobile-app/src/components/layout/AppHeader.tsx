import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AppHeader.css';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showNotifications?: boolean;
  hasUnread?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showNotifications = true,
  hasUnread = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const getInitials = () => {
    if (user?.name) {
      const parts = user.name.split(' ');
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return user.name.slice(0, 2).toUpperCase();
    }
    return 'EV';
  };

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="app-header-left">
          {showBack ? (
            <button className="app-header-back-btn" onClick={handleBack} aria-label="Go Back">
              <ChevronLeft size={22} />
            </button>
          ) : (
            <div className="app-header-brand" onClick={() => navigate('/home')}>
              <img src="/assets/voltgrid-ev-logo.png" alt="Voltgrid EV" className="app-header-logo" />
              <span className="app-header-title">
                VOLT<span className="app-header-title-accent">GRID</span>
              </span>
            </div>
          )}
          {showBack && title && <span className="app-header-title">{title}</span>}
        </div>

        <div className="app-header-actions">
          {showNotifications && (
            <button
              className="app-header-icon-btn"
              onClick={() => navigate('/notifications')}
              aria-label="Notifications"
            >
              <Bell size={20} />
              {hasUnread && <span className="app-header-badge" />}
            </button>
          )}

          <div
            className="app-header-avatar"
            onClick={() => navigate('/profile')}
            style={{ cursor: 'pointer' }}
            title={user?.name || 'My Profile'}
          >
            {getInitials()}
          </div>
        </div>
      </div>
    </header>
  );
};
