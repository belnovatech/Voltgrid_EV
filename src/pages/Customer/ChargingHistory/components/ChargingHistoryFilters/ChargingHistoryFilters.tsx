import React from 'react';
import './ChargingHistoryFilters.css';

interface ChargingHistoryFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenMoreFilters: () => void;
  hasActiveAdvancedFilters: boolean;
}

const TABS = ['All', 'Completed', 'Active', 'CAR', 'BIKE', 'BUS'];

export const ChargingHistoryFilters: React.FC<ChargingHistoryFiltersProps> = ({
  activeTab,
  onTabChange,
  onOpenMoreFilters,
  hasActiveAdvancedFilters,
}) => {
  return (
    <div className="powergrid-history-filters">
      <div className="powergrid-history-filters__tabs">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              className={`powergrid-history-filters__tab ${
                isActive ? 'powergrid-history-filters__tab--active' : ''
              }`}
              onClick={() => onTabChange(tab)}
              aria-pressed={isActive}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={`powergrid-history-filters__more-btn ${
          hasActiveAdvancedFilters ? 'powergrid-history-filters__more-btn--active' : ''
        }`}
        onClick={onOpenMoreFilters}
        aria-label="Open advanced filters"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        <span>More Filters</span>
        {hasActiveAdvancedFilters && (
          <span className="powergrid-history-filters__active-dot" />
        )}
      </button>
    </div>
  );
};
