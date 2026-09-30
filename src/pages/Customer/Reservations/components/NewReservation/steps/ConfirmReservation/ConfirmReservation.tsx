import React from 'react';
import { ReservationDraft } from '../../../../hooks/useReservationFlow';
import './ConfirmReservation.css';

interface ConfirmReservationProps {
  draft: ReservationDraft;
  walletBalance: number;
  isSubmitting: boolean;
  error: string | null;
  onConfirm: () => void;
  onBack: () => void;
}

export const ConfirmReservation: React.FC<ConfirmReservationProps> = ({
  draft,
  walletBalance,
  isSubmitting,
  error,
  onConfirm,
  onBack,
}) => {
  const isBalanceLow = walletBalance < draft.estimatedCostINR;

  return (
    <div className="pg-step-confirm">
      <div className="pg-step-confirm__card">
        <div className="pg-step-confirm__grid">
          <div className="pg-step-confirm__row">
            <span className="pg-step-confirm__label">Station</span>
            <span className="pg-step-confirm__value">{draft.station?.name}</span>
          </div>

          <div className="pg-step-confirm__row">
            <span className="pg-step-confirm__label">Charger</span>
            <span className="pg-step-confirm__value">
              {draft.charger?.code || 'CH-001'} · {draft.charger?.powerKw} kW ({draft.charger?.connector})
            </span>
          </div>

          <div className="pg-step-confirm__row">
            <span className="pg-step-confirm__label">Vehicle</span>
            <span className="pg-step-confirm__value">
              {draft.vehicle?.name} · {draft.vehicle?.type?.toUpperCase()}
            </span>
          </div>

          <div className="pg-step-confirm__row">
            <span className="pg-step-confirm__label">Date</span>
            <span className="pg-step-confirm__value">{draft.date}</span>
          </div>

          <div className="pg-step-confirm__row">
            <span className="pg-step-confirm__label">Time</span>
            <span className="pg-step-confirm__value">{draft.startTime}</span>
          </div>

          <div className="pg-step-confirm__row">
            <span className="pg-step-confirm__label">Duration</span>
            <span className="pg-step-confirm__value">
              {draft.durationMinutes} minutes ({draft.durationText})
            </span>
          </div>

          <div className="pg-step-confirm__row">
            <span className="pg-step-confirm__label">Rate</span>
            <span className="pg-step-confirm__value">₹{draft.ratePerKWh}/kWh</span>
          </div>

          <div className="pg-step-confirm__row pg-step-confirm__row--highlight">
            <span className="pg-step-confirm__label">Est. Cost</span>
            <span className="pg-step-confirm__value pg-step-confirm__value--cost">
              ~₹{draft.estimatedCostINR}
            </span>
          </div>

          <div className="pg-step-confirm__row">
            <span className="pg-step-confirm__label">Wallet Balance</span>
            <span className={`pg-step-confirm__value ${isBalanceLow ? 'pg-step-confirm__value--low' : ''}`}>
              ₹{walletBalance.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="pg-step-confirm__row">
            <span className="pg-step-confirm__label">Grace Period</span>
            <span className="pg-step-confirm__value">15 minutes</span>
          </div>
        </div>

        <div className="pg-step-confirm__notice">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>Your charger will be held for 15 minutes after the reservation start time.</span>
        </div>

        {error && <div className="pg-step-confirm__error">{error}</div>}

        <div className="pg-step-confirm__actions">
          <button
            type="button"
            className="pg-step-confirm__back-btn"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Back
          </button>
          <button
            type="button"
            className="pg-step-confirm__submit-btn"
            onClick={onConfirm}
            disabled={isSubmitting || isBalanceLow}
          >
            {isSubmitting ? (
              <>
                <span className="pg-step-confirm__btn-spinner" />
                <span>Confirming...</span>
              </>
            ) : (
              <span>Confirm Reservation</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
