import React, { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerSidebar } from '../CustomerSidebar/CustomerSidebar';
import { customerService } from '../../../services/customerService';
import { CustomerProfile } from '../../../types/customer';
import './CustomerLayout.css';

interface CustomerLayoutProps {
  children: ReactNode;
  dark?: boolean;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children, dark = false }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CustomerProfile>({
    id: 'usr_bala_01',
    name: 'Bala Krishna',
    phoneNumber: '8074407557',
    email: 'bala@example.com',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    walletBalance: 1250,
    avatarInitials: 'BK',
    isProfileComplete: true,
  });
  const [unreadCount, setUnreadCount] = useState<number>(2);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  useEffect(() => {
    customerService.getProfile().then(setProfile);
    
    const fetchUnread = () => {
      customerService.getNotifications().then((notifs) => {
        setUnreadCount(notifs.filter((n) => !n.isRead).length);
      });
    };

    fetchUnread();
    window.addEventListener('powergrid_notifications_updated', fetchUnread);
    return () => {
      window.removeEventListener('powergrid_notifications_updated', fetchUnread);
    };
  }, []);

  // Lock body scroll when mobile navigation drawer is open
  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileNavOpen]);

  return (
    <div className={`powergrid-customer-shell ${dark ? 'powergrid-customer-shell--dark' : ''}`}>
      {/* Off-canvas mobile backdrop */}
      {isMobileNavOpen && (
        <div
          className="powergrid-customer-shell__backdrop"
          onClick={() => setIsMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Permanently Fixed Customer Sidebar */}
      <CustomerSidebar
        profile={profile}
        unreadCount={unreadCount}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Scrollable Area */}
      <div className="powergrid-customer-shell__main-wrapper">
        {/* Mobile Top App Header */}
        <header className="powergrid-customer-shell__mobile-header">
          <button
            type="button"
            className="powergrid-customer-shell__hamburger"
            onClick={() => setIsMobileNavOpen(true)}
            aria-label="Open menu"
            id="customer-mobile-menu-btn"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="powergrid-customer-shell__mobile-brand">
            <span className="powergrid-customer-shell__mobile-brand-name">PowerGrid</span>
          </div>

          <button
            type="button"
            className="powergrid-customer-shell__mobile-notif"
            onClick={() => navigate('/customer/notifications')}
            aria-label="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && <span className="powergrid-customer-shell__mobile-notif-dot" />}
          </button>
        </header>

        {/* Page Content View */}
        <main className="powergrid-customer-shell__content" role="main">
          {children}
        </main>
      </div>
    </div>
  );
};
export default CustomerLayout;
