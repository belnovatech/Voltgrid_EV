import React from 'react';
import { EVStation } from '../../../../../services/stationService';
import './StationCard.css';

interface StationCardProps {
  station: EVStation;
  isSelected: boolean;
  onSelect: (stationId: string) => void;
  onDetails: (station: EVStation) => void;
  onReserve: (station: EVStation) => void;
  onDirections: (station: EVStation) => void;
  onNotifyMe: (station: EVStation) => void;
}

export const StationCard: React.FC<StationCardProps> = ({
  station,
  isSelected,
  onSelect,
  onDetails,
  onReserve,
  onDirections,
  onNotifyMe,
}) => {
  const isFull = station.availableChargers === 0 || station.status === 'full';

  return (
    <div
      className={`pg-scard ${isSelected ? 'pg-scard--selected' : ''}`}
      onClick={() => onSelect(station.id)}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelect(station.id);
      }}
    >
      <div className="pg-scard__top">
        <div className="pg-scard__icon-badge" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>

        <div className="pg-scard__main-info">
          <div className="pg-scard__header-row">
            <h3 className="pg-scard__name">{station.name}</h3>
            <span className="pg-scard__rate">₹{station.ratePerKWh}/kWh</span>
          </div>

          <p className="pg-scard__address">{station.address}</p>

          <div className="pg-scard__meta-row">
            <span className="pg-scard__meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{station.distanceKm} km</span>
            </span>

            <span className="pg-scard__meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{station.travelTimeMin} min</span>
            </span>

            <span className="pg-scard__meta-item">
              <span>{station.powerKw} kW · {station.connectorType}</span>
            </span>
          </div>

          {/* Availability Badge */}
          <div className="pg-scard__avail-row">
            <span
              className={`pg-scard__avail-badge ${
                isFull
                  ? 'pg-scard__avail-badge--full'
                  : 'pg-scard__avail-badge--available'
              }`}
            >
              {isFull
                ? `Full · ${station.waitTimeMin || 18}m wait`
                : `${station.availableChargers}/${station.totalChargers} Available`}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Buttons matching Screenshot */}
      <div className="pg-scard__actions" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="pg-scard__btn pg-scard__btn--details"
          onClick={() => onDetails(station)}
        >
          Details
        </button>

        <button
          type="button"
          className="pg-scard__btn pg-scard__btn--directions"
          onClick={() => onDirections(station)}
          title="Get Directions"
          aria-label={`Get directions to ${station.name}`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
        </button>

        {isFull ? (
          <button
            type="button"
            className="pg-scard__btn pg-scard__btn--notify"
            onClick={() => onNotifyMe(station)}
          >
            Notify Me
          </button>
        ) : (
          <button
            type="button"
            className="pg-scard__btn pg-scard__btn--reserve"
            onClick={() => onReserve(station)}
          >
            Reserve
          </button>
        )}
      </div>
    </div>
  );
};
