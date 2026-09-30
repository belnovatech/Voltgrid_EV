import React from 'react';
import { EVStation, ChargingPoint } from '../../../../../../../services/stationService';
import './SelectCharger.css';

interface SelectChargerProps {
  station: EVStation | null;
  chargers: ChargingPoint[];
  selectedCharger: ChargingPoint | null;
  isLoading: boolean;
  onSelectCharger: (charger: ChargingPoint) => void;
}

export const SelectCharger: React.FC<SelectChargerProps> = ({
  station,
  chargers,
  selectedCharger,
  isLoading,
  onSelectCharger,
}) => {
  if (isLoading) {
    return (
      <div className="pg-step-charger__loading">
        <div className="pg-step-charger__spinner" />
        <p>Loading available chargers for {station?.name}...</p>
      </div>
    );
  }

  return (
    <div className="pg-step-charger">
      {station && (
        <div className="pg-step-charger__subtitle">
          Available chargers at {station.name}
        </div>
      )}

      <div className="pg-step-charger__list">
        {chargers.map((ch) => {
          const isSelected = selectedCharger?.id === ch.id;
          const isAvailable = ch.status === 'available';

          return (
            <button
              key={ch.id}
              type="button"
              className={`pg-step-charger__card ${
                isSelected ? 'pg-step-charger__card--selected' : ''
              } ${!isAvailable ? 'pg-step-charger__card--disabled' : ''}`}
              onClick={() => isAvailable && onSelectCharger(ch)}
              disabled={!isAvailable}
              aria-label={`${ch.code || ch.name} - ${ch.powerKw} kW - ${ch.status}`}
            >
              <div className="pg-step-charger__icon-wrap">
                <svg
                  className="pg-step-charger__icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>

              <div className="pg-step-charger__info">
                <h4 className="pg-step-charger__title">
                  {ch.code || 'CH-001'} · {ch.powerKw} kW · {ch.connector}
                </h4>
                <div>
                  <span
                    className={`pg-step-charger__status-pill pg-step-charger__status-pill--${ch.status}`}
                  >
                    {ch.status.charAt(0).toUpperCase() + ch.status.slice(1)}
                  </span>
                </div>
              </div>

              {isAvailable && (
                <div className="pg-step-charger__chevron">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
