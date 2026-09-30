import React from 'react';
import { CustomerReservation } from '../../../../../../../types/customer';
import './SuccessReservation.css';

interface SuccessReservationProps {
  reservation: CustomerReservation;
  onViewReservations: () => void;
}

export const SuccessReservation: React.FC<SuccessReservationProps> = ({
  reservation,
  onViewReservations,
}) => {
  return (
    <div className="pg-step-success">
      <div className="pg-step-success__icon-wrap">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h2 className="pg-step-success__title">Reservation Confirmed</h2>
      <p className="pg-step-success__subtitle">
        Your slot has been secured. Drive to the hub and plug in within the grace period.
      </p>

      <div className="pg-step-success__card">
        <div className="pg-step-success__station">{reservation.stationName}</div>
        <div className="pg-step-success__charger">{reservation.chargerId || reservation.chargerType}</div>

        <div className="pg-step-success__timing">
          <span>📅 {reservation.date}</span>
          <span>⏰ {reservation.timeSlot}</span>
        </div>

        <div className="pg-step-success__cost">~₹{reservation.estimatedCostINR || 180}</div>
      </div>

      <div className="pg-step-success__actions">
        <button
          type="button"
          className="pg-step-success__btn pg-step-success__btn--primary"
          onClick={onViewReservations}
        >
          View Reservations
        </button>
      </div>
    </div>
  );
};
