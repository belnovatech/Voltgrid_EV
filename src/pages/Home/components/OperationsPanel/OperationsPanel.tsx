import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { OperationsSummary } from '../../../../types/operations';
import { User } from '../../../../types/auth';
import { formatCurrencyINR } from '../../../../utils/dashboardHelpers';
import './OperationsPanel.css';

interface OperationsPanelProps {
  summary: OperationsSummary;
  isLoading?: boolean;
}

export const OperationsPanel: React.FC<OperationsPanelProps> = ({
  summary,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleAdminLogin = () => {
    const adminUser: User = {
      id: 'usr_super_admin',
      name: 'Super Admin',
      email: 'admin@powergrid.in',
      phoneNumber: '9999999999',
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    const token = `pg_admin_tok_${Date.now()}`;
    sessionStorage.setItem('vg_auth_token', token);
    sessionStorage.setItem('vg_user_info', JSON.stringify(adminUser));
    loginUser(adminUser, token);
    navigate('/admin/dashboard');
  };

  return (
    <aside className="pg-ops-panel" aria-label="Operations Center Command Panel">
      <div className="pg-ops-panel__card">
        <div className="pg-ops-panel__icon-box" aria-hidden="true">
          <svg
            className="pg-ops-panel__icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>

        <h2 className="pg-ops-panel__title">Operations Center</h2>
        <p className="pg-ops-panel__desc">
          Access the admin command center to manage infrastructure and monitor operations.
        </p>

        <button
          type="button"
          className="pg-ops-panel__login-btn"
          onClick={handleAdminLogin}
        >
          <span>Admin Login</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="pg-ops-panel__stats">
        <div className="pg-ops-panel__stat-row">
          <span className="pg-ops-panel__stat-label">Live Chargers</span>
          <span className="pg-ops-panel__stat-value pg-ops-panel__stat-value--lime">
            {isLoading ? '...' : `${summary.availableChargers} Available`}
          </span>
        </div>

        <div className="pg-ops-panel__stat-row">
          <span className="pg-ops-panel__stat-label">Active Sessions</span>
          <span className="pg-ops-panel__stat-value pg-ops-panel__stat-value--cyan">
            {isLoading ? '...' : `${summary.activeSessions} Charging`}
          </span>
        </div>

        <div className="pg-ops-panel__stat-row">
          <span className="pg-ops-panel__stat-label">Today Revenue</span>
          <span className="pg-ops-panel__stat-value pg-ops-panel__stat-value--white">
            {isLoading ? '...' : formatCurrencyINR(summary.todayRevenueINR).replace('.00', '')}
          </span>
        </div>
      </div>
    </aside>
  );
};
