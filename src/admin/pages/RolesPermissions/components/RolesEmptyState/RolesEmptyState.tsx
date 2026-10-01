import React from 'react';
import { ShieldOff, RefreshCw, Plus } from 'lucide-react';
import './RolesEmptyState.css';

interface RolesEmptyStateProps {
  hasFilters: boolean;
  onResetFilters: () => void;
  onCreateRole: () => void;
}

export const RolesEmptyState: React.FC<RolesEmptyStateProps> = ({
  hasFilters,
  onResetFilters,
  onCreateRole,
}) => {
  return (
    <div className="pg-roles-empty" role="region" aria-label="No roles found">
      <div className="pg-roles-empty__icon-wrap">
        <ShieldOff className="w-8 h-8 text-slate-400" />
      </div>

      <h3 className="pg-roles-empty__title">
        {hasFilters ? 'No Matching Security Roles' : 'No Security Roles Configured'}
      </h3>

      <p className="pg-roles-empty__desc">
        {hasFilters
          ? 'No roles matched your current search filters. Try modifying your search term or clearance filter.'
          : 'Create and configure customized security roles to govern staff authorization boundaries.'}
      </p>

      <div className="pg-roles-empty__actions">
        {hasFilters ? (
          <button
            type="button"
            className="pg-btn pg-btn--secondary"
            onClick={onResetFilters}
          >
            <RefreshCw className="w-4 h-4 mr-1 inline" />
            Clear All Filters
          </button>
        ) : (
          <button
            type="button"
            className="pg-btn pg-btn--primary"
            onClick={onCreateRole}
          >
            <Plus className="w-4 h-4 mr-1 inline" />
            Create First Role
          </button>
        )}
      </div>
    </div>
  );
};
