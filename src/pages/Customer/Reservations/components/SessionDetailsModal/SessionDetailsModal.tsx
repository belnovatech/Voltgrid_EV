import React from 'react';
import { CustomerReservation } from '../../../../../types/customer';
import './SessionDetailsModal.css';

interface SessionDetailsModalProps {
  reservation: CustomerReservation | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenLiveScreen: (reservation: CustomerReservation) => void;
}

export const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({
  reservation,
  isOpen,
  onClose,
  onOpenLiveScreen,
}) => {
  if (!isOpen || !reservation) return null;

  const estimatedCost =
    reservation.estimatedCostINR ||
    Math.round((reservation.ratePerKWh || 12) * ((reservation.powerKw || 60) / 2));

  return (
    <div
      className="voltgrid-session-details-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="voltgrid-session-details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="voltgrid-session-details-header">
          <div className="voltgrid-session-details-header__left">
            <div className="voltgrid-session-details-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div>
              <h3 className="voltgrid-session-details-title">
                Active Charging Session
              </h3>
              <p className="voltgrid-session-details-sub">
                Session in progress at {reservation.stationName}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="voltgrid-session-details-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="voltgrid-session-details-body">
          {/* Station Banner */}
          <div className="voltgrid-session-station-banner">
            <div>
              <h4 className="voltgrid-session-station-banner__title">
                {reservation.stationName} · {reservation.chargerId || 'CH-028'}
              </h4>
              <p className="voltgrid-session-station-banner__loc">
                {reservation.city}, Andhra Pradesh
              </p>
            </div>
            <span className="voltgrid-session-status-badge">
              ● Active
            </span>
          </div>

          {/* Connected Vehicle Card */}
          <div className="voltgrid-session-vehicle-card">
            <div className="voltgrid-session-vehicle-card__icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <div>
              <h4 className="voltgrid-session-vehicle-card__name">
                {reservation.vehicleName || 'Tata Nexon EV'}
              </h4>
              <p className="voltgrid-session-vehicle-card__meta">
                {reservation.vehiclePlate || 'AP 16 BK 1204'} · {reservation.chargerType}
              </p>
            </div>
          </div>

          {/* Grid Stats */}
          <div className="voltgrid-session-grid">
            <div className="voltgrid-session-grid-item">
              <span className="voltgrid-session-grid-item__label">
                Power Output
              </span>
              <span className="voltgrid-session-grid-item__val voltgrid-session-grid-item__val--lime">
                ⚡ {reservation.powerKw} kW
              </span>
            </div>

            <div className="voltgrid-session-grid-item">
              <span className="voltgrid-session-grid-item__label">
                Rate / kWh
              </span>
              <span className="voltgrid-session-grid-item__val voltgrid-session-grid-item__val--cyan">
                ₹{reservation.ratePerKWh}/kWh
              </span>
            </div>

            <div className="voltgrid-session-grid-item">
              <span className="voltgrid-session-grid-item__label">
                Scheduled Slot
              </span>
              <span className="voltgrid-session-grid-item__val">
                {reservation.startTime || reservation.timeSlot}
              </span>
            </div>

            <div className="voltgrid-session-grid-item">
              <span className="voltgrid-session-grid-item__label">
                Est. Session Cost
              </span>
              <span className="voltgrid-session-grid-item__val voltgrid-session-grid-item__val--lime">
                ~₹{estimatedCost}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="voltgrid-session-details-actions">
          <button
            type="button"
            className="voltgrid-session-live-btn"
            onClick={() => onOpenLiveScreen(reservation)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>Open Live Charging Screen</span>
          </button>

          <button
            type="button"
            className="voltgrid-session-close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
