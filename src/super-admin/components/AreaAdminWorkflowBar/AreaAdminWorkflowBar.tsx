import React from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';

export const AreaAdminWorkflowBar: React.FC = () => {
  const {
    filters,
    areas,
    admins,
    setSelectedAreaId,
    setSelectedAdminId,
    setDatePreset,
    setSearchTerm,
    resetFilters,
  } = useSuperAdmin();

  const selectedAreaObj = areas.find((a) => a.id === filters.selectedAreaId);
  const selectedAdminObj = admins.find((adm) => adm.id === filters.selectedAdminId);

  return (
    <div className="sa-workflow-bar">
      <div className="sa-workflow-bar__header">
        <div className="sa-workflow-bar__title-wrap">
          <span className="sa-workflow-bar__step-pill">Primary Workflow</span>
          <h2 className="sa-workflow-bar__heading">
            Area-Wise Admin Selection & Financial Drill-Down
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div className="sa-workflow-bar__active-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>
              Area:{' '}
              <strong style={{ color: '#fff' }}>
                {selectedAreaObj ? selectedAreaObj.name : 'All Regional Areas (Statewide)'}
              </strong>
            </span>
          </div>

          <div className="sa-workflow-bar__active-badge" style={{ borderColor: 'rgba(154, 230, 0, 0.3)', color: 'var(--sa-lime)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>
              Admin:{' '}
              <strong style={{ color: '#fff' }}>
                {selectedAdminObj ? selectedAdminObj.name : 'All Area Admins (Combined)'}
              </strong>
            </span>
          </div>
        </div>
      </div>

      <div className="sa-workflow-bar__controls">
        {/* Step 1: Select Area */}
        <div className="sa-field-group">
          <label htmlFor="sa-select-area" className="sa-field-label">
            <span>Step 1: Select Area</span>
            <span style={{ color: 'var(--sa-lime)' }}>*</span>
          </label>
          <select
            id="sa-select-area"
            className="sa-select"
            value={filters.selectedAreaId}
            onChange={(e) => setSelectedAreaId(e.target.value)}
          >
            <option value="ALL">All Areas (Statewide Network)</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.code} — {a.name} ({a.city})
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Select Admin */}
        <div className="sa-field-group">
          <label htmlFor="sa-select-admin" className="sa-field-label">
            <span>Step 2: Select Admin</span>
            {filters.selectedAreaId !== 'ALL' && (
              <span style={{ fontSize: '0.65rem', color: 'var(--sa-cyan)' }}>
                ({admins.length} assigned to area)
              </span>
            )}
          </label>
          <select
            id="sa-select-admin"
            className="sa-select"
            value={filters.selectedAdminId}
            onChange={(e) => setSelectedAdminId(e.target.value)}
          >
            <option value="ALL">
              {filters.selectedAreaId === 'ALL'
                ? 'All Admins (Statewide Operations)'
                : `All Admins in ${selectedAreaObj?.city || 'Selected Area'}`}
            </option>
            {admins.map((adm) => (
              <option key={adm.id} value={adm.id}>
                {adm.name} ({adm.id}) — {adm.status}
              </option>
            ))}
          </select>
        </div>

        {/* Step 3: Date Preset & Filter */}
        <div className="sa-field-group">
          <label className="sa-field-label">
            <span>Step 3: Period Preset</span>
          </label>
          <div className="sa-preset-group">
            {(['7D', '30D', '90D', 'YTD'] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                className={`sa-preset-btn ${
                  filters.datePreset === preset ? 'sa-preset-btn--active' : ''
                }`}
                onClick={() => setDatePreset(preset)}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Filters */}
        <button
          type="button"
          className="sa-btn-reset"
          onClick={resetFilters}
          title="Reset to default statewide view"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Quick Search */}
      <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <svg
            style={{ position: 'absolute', left: 12, top: 11, color: 'var(--sa-text-dim)' }}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="sa-input"
            style={{ paddingLeft: 36 }}
            placeholder="Quick search customers, admin IDs, transaction references, or vehicle plates..."
            value={filters.searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
