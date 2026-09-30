import React, { useState } from 'react';
import { AdvancedFiltersState } from '../../hooks/useChargingHistory';
import './MoreFiltersModal.css';

interface MoreFiltersModalProps {
  filters: AdvancedFiltersState;
  onClose: () => void;
  onApply: (filters: AdvancedFiltersState) => void;
  onReset: () => void;
}

export const MoreFiltersModal: React.FC<MoreFiltersModalProps> = ({
  filters,
  onClose,
  onApply,
  onReset,
}) => {
  const [localFilters, setLocalFilters] = useState<AdvancedFiltersState>({ ...filters });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  return (
    <div className="powergrid-filter-modal__overlay" onClick={onClose}>
      <div className="powergrid-filter-modal__card" onClick={(e) => e.stopPropagation()}>
        <div className="powergrid-filter-modal__header">
          <h3 className="powergrid-filter-modal__title">Filter Sessions</h3>
          <button
            type="button"
            className="powergrid-filter-modal__close-btn"
            onClick={onClose}
            aria-label="Close filter modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleApply} className="powergrid-filter-modal__form">
          <div className="powergrid-filter-modal__row">
            <div className="powergrid-filter-modal__col">
              <label className="powergrid-filter-modal__label">From Date</label>
              <input
                type="date"
                className="powergrid-filter-modal__input"
                value={localFilters.startDate}
                onChange={(e) =>
                  setLocalFilters((prev) => ({ ...prev, startDate: e.target.value }))
                }
              />
            </div>
            <div className="powergrid-filter-modal__col">
              <label className="powergrid-filter-modal__label">To Date</label>
              <input
                type="date"
                className="powergrid-filter-modal__input"
                value={localFilters.endDate}
                onChange={(e) =>
                  setLocalFilters((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="powergrid-filter-modal__col">
            <label className="powergrid-filter-modal__label">Station Name</label>
            <input
              type="text"
              className="powergrid-filter-modal__input"
              placeholder="e.g. Vijayawada Central"
              value={localFilters.stationName}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, stationName: e.target.value }))
              }
            />
          </div>

          <div className="powergrid-filter-modal__col">
            <label className="powergrid-filter-modal__label">Vehicle Model</label>
            <input
              type="text"
              className="powergrid-filter-modal__input"
              placeholder="e.g. Nexon EV, Ola"
              value={localFilters.vehicleName}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, vehicleName: e.target.value }))
              }
            />
          </div>

          <div className="powergrid-filter-modal__actions">
            <button
              type="button"
              className="powergrid-filter-modal__reset-btn"
              onClick={handleReset}
            >
              Reset Filters
            </button>
            <button
              type="submit"
              className="powergrid-filter-modal__apply-btn"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
