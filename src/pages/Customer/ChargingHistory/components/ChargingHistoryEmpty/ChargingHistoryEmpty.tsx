import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ChargingHistoryEmpty.css';

interface ChargingHistoryEmptyProps {
  isFiltered: boolean;
  onResetFilters: () => void;
}

export const ChargingHistoryEmpty: React.FC<ChargingHistoryEmptyProps> = ({
  isFiltered,
  onResetFilters,
}) => {
  const navigate = useNavigate();

  if (isFiltered) {
    return (
      <div className="powergrid-history-empty">
        <div className="powergrid-history-empty__icon">🔍</div>
        <h3 className="powergrid-history-empty__title">No sessions match your filters</h3>
        <p className="powergrid-history-empty__desc">
          Try adjusting your filter selection or clear the active search parameters.
        </p>
        <button
          type="button"
          className="powergrid-history-empty__btn"
          onClick={onResetFilters}
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="powergrid-history-empty">
      <div className="powergrid-history-empty__icon">⚡</div>
      <h3 className="powergrid-history-empty__title">No charging sessions yet</h3>
      <p className="powergrid-history-empty__desc">
        Once you plug in and charge your EV at any PowerGrid station, your session history and tax invoices will appear here.
      </p>
      <button
        type="button"
        className="powergrid-history-empty__btn"
        onClick={() => navigate('/customer/map')}
      >
        Find Nearby Chargers
      </button>
    </div>
  );
};
