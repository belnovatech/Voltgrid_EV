import React, { useState } from 'react';
import './AdminNotifications.css';

export const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 'notif_01',
      type: 'Alert',
      title: 'Zone AP-Z03 (Tirupati East) Peak Load Warning',
      message: 'Active load reached 82% of total substation rated capacity. Smart load shedding armed.',
      timestamp: '10 mins ago',
      isRead: false,
    },
    {
      id: 'notif_02',
      type: 'Maintenance',
      title: 'Technician Assigned to AP-Z01-CP08',
      message: 'Field Engineer Rajesh Varma dispatched for connector latch fault resolution.',
      timestamp: '45 mins ago',
      isRead: false,
    },
    {
      id: 'notif_03',
      type: 'Financial',
      title: 'Daily Wallet Settlement Executed',
      message: '₹12,480 settled with partner payment gateway accounts successfully.',
      timestamp: '2 hours ago',
      isRead: true,
    },
    {
      id: 'notif_04',
      type: 'Security',
      title: 'New Admin Login Detected',
      message: 'Super Admin authenticated from authorized Andhra Pradesh state network.',
      timestamp: 'Today, 09:00 AM',
      isRead: true,
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="pg-admin-notif">
      <div className="pg-admin-notif__header">
        <div>
          <h1 className="pg-admin-notif__title">Admin Notifications & Alerts</h1>
          <p className="pg-admin-notif__subtitle">
            System health alerts, grid power anomalies, and operational broadcasts
          </p>
        </div>
        <button type="button" className="pg-admin-notif__btn" onClick={markAllRead}>
          Mark all as read
        </button>
      </div>

      <div className="pg-admin-notif__list">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`pg-admin-notif__item ${!n.isRead ? 'pg-admin-notif__item--unread' : ''}`}
          >
            <div className={`pg-admin-notif__icon pg-admin-notif__icon--${n.type.toLowerCase()}`}>
              {n.type === 'Alert' && '⚠️'}
              {n.type === 'Maintenance' && '🔧'}
              {n.type === 'Financial' && '💰'}
              {n.type === 'Security' && '🛡️'}
            </div>
            <div className="pg-admin-notif__body">
              <div className="pg-admin-notif__item-header">
                <span className="pg-admin-notif__item-title">{n.title}</span>
                <span className="pg-admin-notif__time">{n.timestamp}</span>
              </div>
              <p className="pg-admin-notif__msg">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminNotifications;
