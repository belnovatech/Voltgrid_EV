import React from 'react';
import './ChargingHistoryHeader.css';

interface ChargingHistoryHeaderProps {
  totalCount: number;
  isExporting: boolean;
  onExport: () => void;
}

export const ChargingHistoryHeader: React.FC<ChargingHistoryHeaderProps> = ({
  totalCount,
  isExporting,
  onExport,
}) => {
  return (
    <div className="powergrid-history-header">
      <div className="powergrid-history-header__left">
        <h1 className="powergrid-history-header__title">Charging History</h1>
        <p className="powergrid-history-header__subtitle">
          {totalCount} {totalCount === 1 ? 'session' : 'sessions'}
        </p>
      </div>

      <button
        type="button"
        className="powergrid-history-header__export-btn"
        onClick={onExport}
        disabled={isExporting}
        aria-label="Export charging history to Excel workbook"
      >
        {isExporting ? (
          <>
            <span className="powergrid-history-header__spinner" />
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export</span>
          </>
        )}
      </button>
    </div>
  );
};
