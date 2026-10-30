import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SuperAdminProvider } from '../../context/SuperAdminContext';
import { SuperAdminSidebar } from '../SuperAdminSidebar/SuperAdminSidebar';
import { SuperAdminHeader } from '../SuperAdminHeader/SuperAdminHeader';
import { CustomerProfileModal } from '../CustomerModal/CustomerProfileModal';
import { SettlementModal } from '../SettlementModal/SettlementModal';
import '../../styles/super-admin.css';

export const SuperAdminLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const location = useLocation();

  // Determine current page title based on route
  const getPageTitle = (pathname: string) => {
    if (pathname.includes('/areas')) return 'Regional Areas Management';
    if (pathname.includes('/admins')) return 'Admin Management & Operations';
    if (pathname.includes('/customers')) return 'Customer Directory & Analytics';
    if (pathname.includes('/payments')) return 'Financial Collections & Payments';
    if (pathname.includes('/settlements')) return 'Business Settlements & Reconciliation';
    if (pathname.includes('/reports')) return 'Business & Audit Reports';
    if (pathname.includes('/audit-logs')) return 'Immutable Security Audit Trail';
    if (pathname.includes('/settings')) return 'Security & Access Policies';
    return 'Executive Business Dashboard';
  };

  return (
    <SuperAdminProvider>
      <div className="sa-layout">
        {/* Mobile Backdrop */}
        {isMobileOpen && (
          <div
            className="sa-modal-backdrop"
            style={{ zIndex: 99 }}
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <SuperAdminSidebar
          isCollapsed={isCollapsed}
          isMobileOpen={isMobileOpen}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        {/* Main Content Area */}
        <div
          className={`sa-main-wrap ${
            isCollapsed ? 'sa-main-wrap--collapsed' : ''
          }`}
        >
          <SuperAdminHeader
            onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
            pageTitle={getPageTitle(location.pathname)}
          />

          <main className="sa-content">
            <Outlet />
          </main>
        </div>

        {/* Global Modals */}
        <CustomerProfileModal />
        <SettlementModal />
      </div>
    </SuperAdminProvider>
  );
};

export default SuperAdminLayout;
