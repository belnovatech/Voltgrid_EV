import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CustomerProfile } from '../../../types/customer';
import { useAuth } from '../../../context/AuthContext';
import { formatCurrencyINR } from '../../../utils/dashboardHelpers';
import './CustomerSidebar.css';

interface CustomerSidebarProps {
  profile: CustomerProfile;
  unreadCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const CustomerSidebar: React.FC<CustomerSidebarProps> = ({
  profile,
  unreadCount = 2,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/customer/dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      to: '/customer/chargers',
      label: 'Find Chargers',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      to: '/customer/reservations',
      label: 'Reservations',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      to: '/customer/vehicles',
      label: 'My Vehicles',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <path d="M9 17h6" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      ),
    },
    {
      to: '/customer/history',
      label: 'Charging History',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      to: '/customer/wallet',
      label: 'Wallet',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
    },
    {
      to: '/customer/notifications',
      label: 'Notifications',
      badge: unreadCount > 0 ? unreadCount : undefined,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
    {
      to: '/customer/support',
      label: 'Support',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`powergrid-customer-sidebar ${
        isOpenMobile ? 'powergrid-customer-sidebar--open-mobile' : ''
      }`}
      aria-label="Customer Navigation Sidebar"
    >
      {/* 1. BRAND HEADER (FIXED TOP) */}
      <div className="powergrid-customer-sidebar__brand">
        <div className="powergrid-customer-sidebar__brand-badge" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#060d19"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <div className="powergrid-customer-sidebar__brand-text">
          <span className="powergrid-customer-sidebar__brand-name">PowerGrid</span>
          <span className="powergrid-customer-sidebar__brand-sub">EV Charging</span>
        </div>

        {isOpenMobile && (
          <button
            type="button"
            className="powergrid-customer-sidebar__close-mobile"
            onClick={onCloseMobile}
            aria-label="Close navigation"
          >
            ✕
          </button>
        )}
      </div>

      {/* 2. NAVIGATION LINKS (SCROLLABLE INTERNALLY IF NEEDED) */}
      <nav className="powergrid-customer-sidebar__nav" aria-label="Customer Portal Navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `powergrid-customer-sidebar__nav-item ${
                isActive ? 'powergrid-customer-sidebar__nav-item--active' : ''
              }`
            }
            onClick={() => onCloseMobile && onCloseMobile()}
          >
            <span className="powergrid-customer-sidebar__nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="powergrid-customer-sidebar__nav-label">{item.label}</span>
            {item.badge !== undefined && (
              <span className="powergrid-customer-sidebar__badge-pill">{item.badge}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* 3. BOTTOM ACCOUNT SECTION (ANCHORED BOTTOM) */}
      <div className="powergrid-customer-sidebar__account" ref={profileMenuRef}>
        {/* Profile Popover Menu */}
        {isProfileMenuOpen && (
          <div className="powergrid-customer-sidebar__profile-popup" role="menu">
            <button
              type="button"
              className="powergrid-customer-sidebar__popup-item"
              role="menuitem"
              onClick={() => {
                setIsProfileMenuOpen(false);
                onCloseMobile && onCloseMobile();
                navigate('/customer/profile');
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Profile</span>
            </button>

            <button
              type="button"
              className="powergrid-customer-sidebar__popup-item"
              role="menuitem"
              onClick={() => {
                setIsProfileMenuOpen(false);
                onCloseMobile && onCloseMobile();
                navigate('/customer/settings');
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>Settings</span>
            </button>

            <div className="powergrid-customer-sidebar__popup-divider" />

            <button
              type="button"
              className="powergrid-customer-sidebar__popup-item powergrid-customer-sidebar__popup-item--logout"
              role="menuitem"
              onClick={handleLogout}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* User Card Trigger Button */}
        <button
          type="button"
          className="powergrid-customer-sidebar__user-btn"
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          aria-haspopup="menu"
          aria-expanded={isProfileMenuOpen}
          aria-label="User profile menu"
        >
          <div className="powergrid-customer-sidebar__avatar">
            {profile.avatarInitials || 'BK'}
          </div>
          <div className="powergrid-customer-sidebar__user-meta">
            <span className="powergrid-customer-sidebar__user-name">{profile.name}</span>
            <span className="powergrid-customer-sidebar__user-wallet">
              {formatCurrencyINR(profile.walletBalance).replace('.00', '')} wallet
            </span>
          </div>
          <svg
            className={`powergrid-customer-sidebar__user-arrow ${
              isProfileMenuOpen ? 'powergrid-customer-sidebar__user-arrow--open' : ''
            }`}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </aside>
  );
};
export default CustomerSidebar;
