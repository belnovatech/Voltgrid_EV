import React from 'react';
import './AdvancedFiltersModal.css';

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  minPowerKw: number;
  onMinPowerChange: (kw: number) => void;
  onlyAvailable: boolean;
  onOnlyAvailableChange: (val: boolean) => void;
  selectedConnector: string;
  onConnectorChange: (conn: string) => void;
  onReset: () => void;
}

export const AdvancedFiltersModal: React.FC<AdvancedFiltersModalProps> = ({
  isOpen,
  onClose,
  minPowerKw,
  onMinPowerChange,
  onlyAvailable,
  onOnlyAvailableChange,
  selectedConnector,
  onConnectorChange,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="pg-afmodal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pg-afmodal" onClick={(e) => e.stopPropagation()}>
        <div className="pg-afmodal__header">
          <h3 className="pg-afmodal__title">Filter Charging Stations</h3>
          <button
            type="button"
            className="pg-afmodal__close"
            onClick={onClose}
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>

        <div className="pg-afmodal__body">
          {/* Minimum Power */}
          <div className="pg-afmodal__section">
            <label className="pg-afmodal__label">Minimum Charging Speed</label>
            <div className="pg-afmodal__chips">
              {[0, 50, 100, 150].map((kw) => (
                <button
                  key={kw}
                  type="button"
                  className={`pg-afmodal__chip ${minPowerKw === kw ? 'pg-afmodal__chip--active' : ''}`}
                  onClick={() => onMinPowerChange(kw)}
                >
                  {kw === 0 ? 'Any Speed' : `${kw}+ kW Fast`}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="pg-afmodal__section">
            <label className="pg-afmodal__label">Real-time Availability</label>
            <div className="pg-afmodal__toggle-row">
              <div>
                <strong>Only Available Stations</strong>
                <p>Hide stations that are currently at 100% capacity.</p>
              </div>
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => onOnlyAvailableChange(e.target.checked)}
                className="pg-afmodal__checkbox"
              />
            </div>
          </div>

          {/* Connector Type */}
          <div className="pg-afmodal__section">
            <label className="pg-afmodal__label">Connector Standard</label>
            <select
              value={selectedConnector}
              onChange={(e) => onConnectorChange(e.target.value)}
              className="pg-afmodal__select"
            >
              <option value="All">All Connectors (CCS2, Type 2, GB/T)</option>
              <option value="CCS2">CCS Type 2 (DC Fast Gun)</option>
              <option value="Type 2">Type 2 AC (Destination Charger)</option>
            </select>
          </div>
        </div>

        <div className="pg-afmodal__footer">
          <button
            type="button"
            className="pg-afmodal__reset"
            onClick={() => {
              onReset();
              onClose();
            }}
          >
            Reset Filters
          </button>
          <button
            type="button"
            className="pg-afmodal__apply"
            onClick={onClose}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
