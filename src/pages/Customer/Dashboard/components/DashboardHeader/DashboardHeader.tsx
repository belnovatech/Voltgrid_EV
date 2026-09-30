import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerProfile } from '../../../../../types/customer';
import './DashboardHeader.css';

interface DashboardHeaderProps {
  profile: CustomerProfile | null;
  unreadCount?: number;
  isLoading?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  profile,
  unreadCount = 2,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="pg-dheader">
      <div className="pg-dheader__greeting-block">
        <span className="pg-dheader__sub-greeting">{getTimeGreeting()}</span>
        <h1 className="pg-dheader__user-title">
          {isLoading ? (
            <span className="pg-dheader__skeleton-name">Loading...</span>
          ) : (
            <>
              {profile?.name || 'Bala Krishna'} <span className="pg-dheader__wave" role="img" aria-label="wave">👋</span>
            </>
          )}
        </h1>
        <div className="pg-dheader__location">
          <svg
            className="pg-dheader__loc-icon"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="pg-dheader__loc-text">
            {profile?.city || 'Vijayawada'}, {profile?.state || 'Andhra Pradesh'}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="pg-dheader__notif-btn"
        onClick={() => navigate('/customer/notifications')}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && <span className="pg-dheader__notif-dot" />}
      </button>
    </div>
  );
};
