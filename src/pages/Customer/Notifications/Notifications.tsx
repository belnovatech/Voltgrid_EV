import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerLayout } from '../../../components/customer/CustomerLayout/CustomerLayout';
import { customerService } from '../../../services/customerService';
import { CustomerNotification } from '../../../types/customer';
import './Notifications.css';

type FilterType = 'all' | 'unread' | 'charging' | 'reservation' | 'wallet' | 'alert';

export const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await customerService.getNotifications();
      setNotifications(res);
    } catch {
      setError('Unable to load notifications.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      if (activeFilter === 'unread') return !notif.isRead;
      if (activeFilter === 'charging') return notif.type === 'charging';
      if (activeFilter === 'reservation') return notif.type === 'reservation';
      if (activeFilter === 'wallet') return notif.type === 'wallet';
      if (activeFilter === 'alert') return notif.type === 'alert' || notif.type === 'system';
      return true;
    });
  }, [notifications, activeFilter]);

  const handleMarkAllRead = async () => {
    await customerService.markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = async (notif: CustomerNotification) => {
    if (!notif.isRead) {
      await customerService.markNotificationAsRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );
    }

    if (notif.targetRoute) {
      navigate(notif.targetRoute);
    }
  };

  const getNotificationVisual = (notif: CustomerNotification) => {
    const type = notif.type;
    const titleLower = notif.title.toLowerCase();

    if (type === 'charging') {
      return {
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        ),
        iconBgClass: 'powergrid-notifications__icon--cyan',
      };
    }

    if (type === 'reservation') {
      return {
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        ),
        iconBgClass: 'powergrid-notifications__icon--mint',
      };
    }

    if (type === 'wallet') {
      return {
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        ),
        iconBgClass: 'powergrid-notifications__icon--green',
      };
    }

    if (titleLower.includes('wrench') || titleLower.includes('online') || titleLower.includes('charger')) {
      return {
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        ),
        iconBgClass: 'powergrid-notifications__icon--orange',
      };
    }

    // Default alert/warning
    return {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      iconBgClass: 'powergrid-notifications__icon--yellow',
    };
  };

  return (
    <CustomerLayout>
      <div className="powergrid-notifications">
        {/* Header with Title, Count and Mark All Read */}
        <div className="powergrid-notifications__header">
          <div className="powergrid-notifications__header-left">
            <h1 className="powergrid-notifications__title">Notifications</h1>
            <p className="powergrid-notifications__subtitle">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              className="powergrid-notifications__mark-all-btn"
              onClick={handleMarkAllRead}
              id="notifications-mark-all-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="powergrid-notifications__filters" role="tablist" aria-label="Notification Filters">
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'all'}
            className={`powergrid-notifications__filter ${
              activeFilter === 'all' ? 'powergrid-notifications__filter--active' : ''
            }`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'unread'}
            className={`powergrid-notifications__filter ${
              activeFilter === 'unread' ? 'powergrid-notifications__filter--active' : ''
            }`}
            onClick={() => setActiveFilter('unread')}
          >
            Unread
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'charging'}
            className={`powergrid-notifications__filter ${
              activeFilter === 'charging' ? 'powergrid-notifications__filter--active' : ''
            }`}
            onClick={() => setActiveFilter('charging')}
          >
            Charging
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'reservation'}
            className={`powergrid-notifications__filter ${
              activeFilter === 'reservation' ? 'powergrid-notifications__filter--active' : ''
            }`}
            onClick={() => setActiveFilter('reservation')}
          >
            Reservation
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'wallet'}
            className={`powergrid-notifications__filter ${
              activeFilter === 'wallet' ? 'powergrid-notifications__filter--active' : ''
            }`}
            onClick={() => setActiveFilter('wallet')}
          >
            Wallet
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'alert'}
            className={`powergrid-notifications__filter ${
              activeFilter === 'alert' ? 'powergrid-notifications__filter--active' : ''
            }`}
            onClick={() => setActiveFilter('alert')}
          >
            Alert
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="powergrid-notifications__skeleton-list">
            <div className="powergrid-notifications__skeleton-card" />
            <div className="powergrid-notifications__skeleton-card" />
            <div className="powergrid-notifications__skeleton-card" />
            <div className="powergrid-notifications__skeleton-card" />
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="powergrid-notifications__error-state">
            <div className="powergrid-notifications__error-icon">⚠️</div>
            <h3 className="powergrid-notifications__error-title">{error}</h3>
            <p className="powergrid-notifications__error-desc">Please try refreshing your connection.</p>
            <button
              type="button"
              className="powergrid-notifications__retry-btn"
              onClick={loadNotifications}
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredNotifications.length === 0 && (
          <div className="powergrid-notifications__empty-state">
            <div className="powergrid-notifications__empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <h3 className="powergrid-notifications__empty-title">
              {activeFilter === 'unread' ? "You're all caught up!" : 'No notifications yet'}
            </h3>
            <p className="powergrid-notifications__empty-desc">
              {activeFilter === 'unread'
                ? 'There are no unread notifications right now.'
                : 'Live notifications regarding charging, reservations, and wallet will appear here.'}
            </p>
          </div>
        )}

        {/* Loaded Notification List */}
        {!isLoading && !error && filteredNotifications.length > 0 && (
          <div className="powergrid-notifications__list" role="list">
            {filteredNotifications.map((notif) => {
              const visual = getNotificationVisual(notif);
              return (
                <div
                  key={notif.id}
                  role="listitem"
                  className={`powergrid-notifications__item ${
                    !notif.isRead ? 'powergrid-notifications__item--unread' : ''
                  }`}
                  onClick={() => handleNotificationClick(notif)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleNotificationClick(notif);
                    }
                  }}
                >
                  {/* Left Type Icon */}
                  <div
                    className={`powergrid-notifications__icon-box ${visual.iconBgClass}`}
                    aria-hidden="true"
                  >
                    {visual.icon}
                  </div>

                  {/* Middle Content */}
                  <div className="powergrid-notifications__content">
                    <div className="powergrid-notifications__top-row">
                      <h3 className="powergrid-notifications__item-title">{notif.title}</h3>
                      <div className="powergrid-notifications__time-group">
                        <span className="powergrid-notifications__time">{notif.timestamp}</span>
                        {!notif.isRead && (
                          <span
                            className="powergrid-notifications__unread-dot"
                            aria-label="Unread notification"
                          />
                        )}
                      </div>
                    </div>
                    <p className="powergrid-notifications__message">{notif.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};
export default Notifications;
