import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../AdminSidebar/AdminSidebar';
import { AdminMobileHeader } from '../AdminMobileHeader/AdminMobileHeader';
import '../../styles/admin-theme.css';
import '../../styles/admin-layout.css';
import '../../styles/admin-responsive.css';
import './AdminLayout.css';

export const AdminLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen]);

  return (
    <div className="pg-admin-layout">
      {/* Mobile Top Header */}
      <AdminMobileHeader onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)} />

      {/* Backdrop overlay for mobile drawer */}
      {isMobileSidebarOpen && (
        <div
          className="pg-admin-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Fixed Desktop / Off-canvas Mobile Sidebar */}
      <AdminSidebar
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="pg-admin-main-wrapper">
        <main className="pg-admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
