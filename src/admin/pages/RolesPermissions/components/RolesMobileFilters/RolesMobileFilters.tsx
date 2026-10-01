import React from 'react';
import { X, Check } from 'lucide-react';
import './RolesMobileFilters.css';

interface RolesMobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAccessLevel: string;
  onAccessLevelChange: (level: string) => void;
  selectedRoleType: string;
  onRoleTypeChange: (type: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onReset: () => void;
  onApply: () => void;
}

export const RolesMobileFilters: React.FC<RolesMobileFiltersProps> = ({
  isOpen,
  onClose,
  selectedAccessLevel,
  onAccessLevelChange,
  selectedRoleType,
  onRoleTypeChange,
  sortBy,
  onSortChange,
  onReset,
  onApply,
}) => {
  if (!isOpen) return null;

  return (
    <div className="pg-mobile-filters-overlay" onClick={onClose}>
      <div
        className="pg-mobile-filters-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pg-mobile-filters-title"
      >
        <div className="pg-mobile-filters-sheet__header">
          <h3 id="pg-mobile-filters-title" className="pg-mobile-filters-sheet__title">
            Filter Roles & Access
          </h3>
          <button
            type="button"
            className="pg-mobile-filters-sheet__close"
            onClick={onClose}
            aria-label="Close filters"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="pg-mobile-filters-sheet__body">
          {/* ACCESS LEVEL */}
          <div className="pg-mobile-filter-group">
            <label className="pg-mobile-filter-label">Access Clearance Level</label>
            <select
              className="pg-mobile-filter-select"
              value={selectedAccessLevel}
              onChange={(e) => onAccessLevelChange(e.target.value)}
            >
              <option value="ALL">All Access Levels</option>
              <option value="Critical">Critical</option>
              <option value="Elevated">Elevated</option>
              <option value="Operational">Operational</option>
              <option value="Audit">Audit</option>
            </select>
          </div>

          {/* ROLE TYPE */}
          <div className="pg-mobile-filter-group">
            <label className="pg-mobile-filter-label">Role Type</label>
            <select
              className="pg-mobile-filter-select"
              value={selectedRoleType}
              onChange={(e) => onRoleTypeChange(e.target.value)}
            >
              <option value="ALL">All Role Types</option>
              <option value="System">System Built-In</option>
              <option value="Custom">Custom Policies</option>
            </select>
          </div>

          {/* SORT */}
          <div className="pg-mobile-filter-group">
            <label className="pg-mobile-filter-label">Sort Directory By</label>
            <select
              className="pg-mobile-filter-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="staff-desc">Most Staff Assigned</option>
              <option value="perms-desc">Most Permissions</option>
              <option value="name-asc">Role Name (A-Z)</option>
              <option value="recent">Recently Modified</option>
            </select>
          </div>
        </div>

        <div className="pg-mobile-filters-sheet__footer">
          <button
            type="button"
            className="pg-btn pg-btn--secondary"
            onClick={onReset}
          >
            Reset Filters
          </button>
          <button
            type="button"
            className="pg-btn pg-btn--primary"
            onClick={onApply}
          >
            <Check className="w-3.5 h-3.5 mr-1 inline" />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

