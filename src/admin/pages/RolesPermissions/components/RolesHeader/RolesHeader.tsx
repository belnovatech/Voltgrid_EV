import React from 'react';
import { RefreshCw, Download, Plus, ShieldCheck } from 'lucide-react';
import './RolesHeader.css';

interface RolesHeaderProps {
  totalRoles: number;
  activeStaffCount: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  onExport: () => void;
  onCreateRole: () => void;
  lastUpdated: string;
}

export const RolesHeader: React.FC<RolesHeaderProps> = ({
  totalRoles,
  activeStaffCount,
  isRefreshing,
  onRefresh,
  onExport,
  onCreateRole,
  lastUpdated,
}) => {
  return (
    <header className="pg-roles-header">
      <div className="pg-roles-header__main">
        <div className="pg-roles-header__title-row">
          <div className="pg-roles-header__icon-badge" aria-hidden="true">
            <ShieldCheck className="w-4 h-4 text-lime-400" />
          </div>
          <div>
            <div className="pg-roles-header__meta-top">
              <span className="pg-roles-header__live-tag">
                <span className="pg-roles-header__pulse-dot" />
                Access Control Operational
              </span>
              <span className="pg-roles-header__timestamp">
                Synced {lastUpdated}
              </span>
            </div>
            <h1 className="pg-roles-header__title">
              Roles & Access Control
              <span className="pg-roles-header__count-badge">{totalRoles} Roles · {activeStaffCount} Staff</span>
            </h1>
          </div>
        </div>
        <p className="pg-roles-header__subtitle">
          Manage role-based access control (RBAC), security clearance boundaries, and staff platform authorization across PowerGrid.
        </p>
      </div>

      <div className="pg-roles-header__actions">
        <button
          type="button"
          className="pg-roles-header__btn pg-roles-header__btn--secondary"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh role data"
          title="Refresh access control data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'pg-roles-spin' : ''}`} />
          <span className="pg-roles-header__btn-label">Refresh</span>
        </button>

        <button
          type="button"
          className="pg-roles-header__btn pg-roles-header__btn--secondary"
          onClick={onExport}
          aria-label="Export role access matrix"
          title="Export RBAC permission matrix (CSV)"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="pg-roles-header__btn-label">Export Matrix</span>
        </button>

        <button
          type="button"
          className="pg-roles-header__btn pg-roles-header__btn--primary"
          onClick={onCreateRole}
          aria-label="Create new custom security role"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Role</span>
        </button>
      </div>
    </header>
  );
};

