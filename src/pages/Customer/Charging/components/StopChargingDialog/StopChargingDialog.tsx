import React from 'react';
import { ChargingSession } from '../../../../../types/charging';
import './StopChargingDialog.css';

interface StopChargingDialogProps {
  isOpen: boolean;
  session: ChargingSession | null;
  onContinue: () => void;
  onConfirmStop: () => void;
}

export const StopChargingDialog: React.FC<StopChargingDialogProps> = ({
  isOpen,
  session,
  onContinue,
  onConfirmStop,
}) => {
  if (!isOpen || !session) return null;

  const mins = Math.floor(session.durationSeconds / 60);
  const secs = session.durationSeconds % 60;
  const durationFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div
      className="voltgrid-stop-dialog-backdrop"
      onClick={onContinue}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="voltgrid-stop-dialog-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="voltgrid-stop-dialog-header">
          <div className="voltgrid-stop-dialog-icon">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" />
            </svg>
          </div>
          <h3 className="voltgrid-stop-dialog-title">Stop Charging?</h3>
          <p className="voltgrid-stop-dialog-text">
            Are you sure you want to stop this charging session? Power delivery will cease and your final invoice will be generated.
          </p>
        </div>

        {/* Current Snapshot */}
        <div className="voltgrid-stop-dialog-summary">
          <div className="voltgrid-stop-summary-item">
            <span className="voltgrid-stop-summary-item__label">Energy</span>
            <span className="voltgrid-stop-summary-item__val">
              {session.energyDeliveredKwh.toFixed(1)} kWh
            </span>
          </div>
          <div className="voltgrid-stop-summary-item">
            <span className="voltgrid-stop-summary-item__label">Duration</span>
            <span className="voltgrid-stop-summary-item__val">{durationFormatted}</span>
          </div>
          <div className="voltgrid-stop-summary-item">
            <span className="voltgrid-stop-summary-item__label">Cost</span>
            <span className="voltgrid-stop-summary-item__val">
              ₹{Math.round(session.currentCost)}
            </span>
          </div>
        </div>

        <div className="voltgrid-stop-dialog-actions">
          <button
            type="button"
            className="voltgrid-stop-btn-danger"
            onClick={onConfirmStop}
          >
            Stop Charging
          </button>
          <button
            type="button"
            className="voltgrid-stop-btn-cancel"
            onClick={onContinue}
          >
            Continue Charging
          </button>
        </div>
      </div>
    </div>
  );
};
