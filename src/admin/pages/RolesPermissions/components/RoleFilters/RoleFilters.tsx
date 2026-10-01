import React from 'react';
import { Search, SlidersHorizontal, LayoutGrid, List, ArrowUpDown, GitCompare, X } from 'lucide-react';
import './RoleFilters.css';

interface RoleFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedAccessLevel: string;
  onAccessLevelChange: (level: string) => void;
  selectedRoleType: string;
  onRoleTypeChange: (type: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'cards' | 'table';
  onViewModeChange: (mode: 'cards' | 'table') => void;
  onOpenCompare: () => void;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
  onResetFilters: () => void;
}

export const RoleFilters: React.FC<RoleFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedAccessLevel,
  onAccessLevelChange,
  selectedRoleType,
  onRoleTypeChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenCompare,
  onOpenMobileFilters,
  activeFilterCount,
  onResetFilters,
}) => {
  const hasActiveFilters = searchTerm !== '' || selectedAccessLevel !== 'ALL' || selectedRoleType !== 'ALL';

  return (
    <div className="pg-roles-toolbar" role="toolbar" aria-label="Role Directory Filters">
      <div className="pg-roles-toolbar__search">
        <Search className="w-3.5 h-3.5 pg-roles-toolbar__search-icon" />
        <input
          type="text"
          className="pg-roles-toolbar__search-input"
          placeholder="Search roles, permissions..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search roles"
        />
        {searchTerm && (
          <button
            type="button"
            className="pg-roles-toolbar__search-clear"
            onClick={() => onSearchChange('')}
            aria-label="Clear search query"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="pg-roles-toolbar__desktop-filters">
        <div className="pg-roles-toolbar__select-wrap">
          <select
            className="pg-roles-toolbar__select"
            value={selectedAccessLevel}
            onChange={(e) => onAccessLevelChange(e.target.value)}
            aria-label="Filter by Access Clearance"
          >
            <option value="ALL">All Access Levels</option>
            <option value="Critical">Critical</option>
            <option value="Elevated">Elevated</option>
            <option value="Operational">Operational</option>
            <option value="Audit">Audit</option>
          </select>
        </div>

        <div className="pg-roles-toolbar__select-wrap">
          <select
            className="pg-roles-toolbar__select"
            value={selectedRoleType}
            onChange={(e) => onRoleTypeChange(e.target.value)}
            aria-label="Filter by Role Type"
          >
            <option value="ALL">All Role Types</option>
            <option value="System">System Roles</option>
            <option value="Custom">Custom Roles</option>
          </select>
        </div>

        <div className="pg-roles-toolbar__select-wrap">
          <ArrowUpDown className="w-3 h-3 pg-roles-toolbar__sort-icon" />
          <select
            className="pg-roles-toolbar__select pg-roles-toolbar__select--sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort roles"
          >
            <option value="staff-desc">Most Staff</option>
            <option value="perms-desc">Most Permissions</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="recent">Recently Modified</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="pg-roles-toolbar__reset-btn"
            onClick={onResetFilters}
            title="Reset all filters"
          >
            Reset
          </button>
        )}
      </div>

      <div className="pg-roles-toolbar__actions-right">
        <button
          type="button"
          className="pg-roles-toolbar__compare-btn"
          onClick={onOpenCompare}
          title="Compare permissions across roles"
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span className="pg-roles-toolbar__btn-text">Compare Roles</span>
        </button>

        <div className="pg-roles-toolbar__view-switch" role="group" aria-label="View Mode">
          <button
            type="button"
            className={`pg-roles-toolbar__view-btn ${viewMode === 'cards' ? 'pg-roles-toolbar__view-btn--active' : ''}`}
            onClick={() => onViewModeChange('cards')}
            aria-label="Cards view"
            title="Cards view"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className={`pg-roles-toolbar__view-btn ${viewMode === 'table' ? 'pg-roles-toolbar__view-btn--active' : ''}`}
            onClick={() => onViewModeChange('table')}
            aria-label="Table view"
            title="Table view"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          className="pg-roles-toolbar__mobile-filter-btn"
          onClick={onOpenMobileFilters}
          aria-label="Open filter bottom sheet"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="pg-roles-toolbar__filter-count">{activeFilterCount}</span>
          )}
        </button>
      </div>
    </div>
  );
};

