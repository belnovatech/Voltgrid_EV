import React from 'react';
import './AdminMobileHeader.css';

interface AdminMobileHeaderProps {
  onToggleSidebar: () => void;
  title?: string;
}

export const AdminMobileHeader: React.FC<AdminMobileHeaderProps> = ({
  onToggleSidebar,
}) => {
  return (
    <header className="pg-admin-mobile-header">
      <button
        type="button"
        className="pg-admin-mobile-header__hamburger"
        onClick={onToggleSidebar}
        aria-label="Open Admin Navigation Menu"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className="pg-admin-mobile-header__brand">
        <div className="pg-admin-mobile-header__logo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <span className="pg-admin-mobile-header__title">PowerGrid <span className="pg-admin-mobile-header__tag">Admin</span></span>
      </div>

      <div className="pg-admin-mobile-header__action">
        <span className="pg-admin-mobile-header__badge">AP Network</span>
      </div>
    </header>
  );
};
