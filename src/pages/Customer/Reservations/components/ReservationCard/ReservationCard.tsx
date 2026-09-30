import React from 'react';
import { CustomerReservation } from '../../../../../types/customer';
import './ReservationCard.css';

interface ReservationCardProps {
  reservation: CustomerReservation;
  onStartCharging: (id: string) => void;
  onCancel: (id: string) => void;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onStartCharging,
  onCancel,
}) => {
  const isUpcoming = reservation.status === 'upcoming';
  const isActive = reservation.status === 'active';

  return (
    <div className="pg-res-card">
      <div className="pg-res-card__main">
        {/* Left Icon */}
        <div
          className={`pg-res-card__icon-wrap ${
            isActive ? 'pg-res-card__icon-wrap--active' : 'pg-res-card__icon-wrap--default'
          }`}
        >
          {isActive ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          )}
        </div>

        {/* Center Details */}
        <div className="pg-res-card__info">
          <div className="pg-res-card__header-line">
            <h3 className="pg-res-card__station">{reservation.stationName}</h3>
            <span className={`pg-res-card__status-badge pg-res-card__status-badge--${reservation.status}`}>
              {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
            </span>
          </div>

          <p className="pg-res-card__sub">
            {reservation.chargerId || reservation.chargerType}
            {reservation.vehicleName ? ` · ${reservation.vehicleName}` : ''}
          </p>

          <div className="pg-res-card__meta">
            <span className="pg-res-card__meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {reservation.date}
            </span>

            <span className="pg-res-card__meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {reservation.startTime || reservation.timeSlot}
            </span>

            {reservation.durationText && (
              <span className="pg-res-card__meta-item">{reservation.durationText}</span>
            )}

            <span className="pg-res-card__meta-item pg-res-card__meta-item--cost">
              ~₹{reservation.estimatedCostINR || Math.round(reservation.ratePerKWh * 6)}
            </span>
          </div>

          {/* Action Buttons for upcoming reservations */}
          {isUpcoming && (
            <div className="pg-res-card__actions">
              <button
                type="button"
                className="pg-res-card__start-btn"
                onClick={() => onStartCharging(reservation.id)}
              >
                Start Charging
              </button>
              <button
                type="button"
                className="pg-res-card__cancel-btn"
                onClick={() => onCancel(reservation.id)}
              >
                Cancel
              </button>
            </div>
          )}

          {isActive && (
            <div className="pg-res-card__actions">
              <button
                type="button"
                className="pg-res-card__start-btn"
                onClick={() => onStartCharging(reservation.id)}
              >
                View Session
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
