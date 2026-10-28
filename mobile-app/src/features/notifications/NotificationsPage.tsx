import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Zap, Calendar, Wallet, AlertTriangle, CheckCheck } from 'lucide-react';
import { customerService } from '../../services/customerService';
import { CustomerNotification } from '../../types/customer';
import { AppHeader } from '../../components/layout/AppHeader';
import { AppButton } from '../../components/common/AppButton';
import { LoadingState } from '../../components/common/LoadingState';
import './NotificationsPage.css';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await customerService.getNotifications();
      setNotifications(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    await customerService.markAllNotificationsRead();
    await loadNotifications();
  };

  const handleCardClick = async (n: CustomerNotification) => {
    await customerService.markNotificationRead(n.id);
    await loadNotifications();
    if (n.targetRoute) {
      navigate(n.targetRoute);
    }
  };

  const getIcon = (type: CustomerNotification['type']) => {
    switch (type) {
      case 'charging':
        return <Zap size={20} color="var(--color-neon-green)" />;
      case 'reservation':
        return <Calendar size={20} color="var(--color-cyan)" />;
      case 'wallet':
        return <Wallet size={20} color="#fbbf24" />;
      default:
        return <AlertTriangle size={20} color="var(--color-cyan)" />;
    }
  };

  return (
    <div className="notifications-page">
      <AppHeader title="Driver Alerts" showBack showNotifications={false} />

      <main className="notifications-content">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <button
            type="button"
            onClick={handleMarkAllRead}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              color: 'var(--color-cyan)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <CheckCheck size={16} />
            <span>Mark all as read</span>
          </button>
        </div>

        {isLoading ? (
          <LoadingState message="Fetching driver alerts..." />
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)' }}>
            <Bell size={40} style={{ opacity: 0.4, marginBottom: '12px' }} />
            <p>No new notifications at this time.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`notif-card ${!n.isRead ? 'notif-card--unread' : ''}`}
              onClick={() => handleCardClick(n)}
              style={{ cursor: 'pointer' }}
            >
              {!n.isRead && <span className="notif-unread-dot" />}
              <div className="notif-icon-box">{getIcon(n.type)}</div>
              <div className="notif-body">
                <h4 className="notif-title">{n.title}</h4>
                <p className="notif-message">{n.message}</p>
                <span className="notif-timestamp">{n.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};
