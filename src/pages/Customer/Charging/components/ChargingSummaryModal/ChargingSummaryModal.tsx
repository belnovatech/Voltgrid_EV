import React from 'react';
import { ChargingSummaryData } from '../../../../../types/charging';
import './ChargingSummaryModal.css';

interface ChargingSummaryModalProps {
  summary: ChargingSummaryData | null;
  onDone: () => void;
  onViewHistory: () => void;
}

export const ChargingSummaryModal: React.FC<ChargingSummaryModalProps> = ({
  summary,
  onDone,
  onViewHistory,
}) => {
  if (!summary) return null;

  return (
    <div
      className="voltgrid-summary-backdrop"
      onClick={onDone}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="voltgrid-summary-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="voltgrid-summary-header">
          <div className="voltgrid-summary-badge">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="voltgrid-summary-title">Charging Complete</h2>
          <span className="voltgrid-summary-status">
            ✓ Session completed successfully
          </span>
        </div>

        {/* Body */}
        <div className="voltgrid-summary-body">
          {/* Station & Charger banner */}
          <div className="voltgrid-summary-station-card">
            <div>
              <h4 className="voltgrid-summary-station-card__name">
                {summary.stationName}
              </h4>
              <p className="voltgrid-summary-station-card__loc">
                {summary.location}
              </p>
            </div>
            <span className="voltgrid-summary-station-card__badge">
              {summary.chargerId}
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="voltgrid-summary-grid">
            <div className="voltgrid-summary-item">
              <span className="voltgrid-summary-item__label">
                Energy Delivered
              </span>
              <span className="voltgrid-summary-item__val voltgrid-summary-item__val--lime">
                {summary.energyDeliveredKwh.toFixed(1)} kWh
              </span>
            </div>

            <div className="voltgrid-summary-item">
              <span className="voltgrid-summary-item__label">Duration</span>
              <span className="voltgrid-summary-item__val">
                {summary.durationFormatted}
              </span>
            </div>

            <div className="voltgrid-summary-item">
              <span className="voltgrid-summary-item__label">Total Cost</span>
              <span className="voltgrid-summary-item__val voltgrid-summary-item__val--lime">
                ₹{summary.totalCost.toFixed(2)}
              </span>
            </div>

            <div className="voltgrid-summary-item">
              <span className="voltgrid-summary-item__label">Rate</span>
              <span className="voltgrid-summary-item__val voltgrid-summary-item__val--cyan">
                ₹{summary.ratePerKwh}/kWh
              </span>
            </div>

            <div className="voltgrid-summary-item">
              <span className="voltgrid-summary-item__label">Vehicle</span>
              <span className="voltgrid-summary-item__val">
                {summary.vehicleName}
              </span>
            </div>

            <div className="voltgrid-summary-item">
              <span className="voltgrid-summary-item__label">Final Battery</span>
              <span className="voltgrid-summary-item__val voltgrid-summary-item__val--lime">
                {summary.finalBatteryPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="voltgrid-summary-actions">
          <button
            type="button"
            className="voltgrid-summary-done-btn"
            onClick={onDone}
          >
            Done
          </button>
          <button
            type="button"
            className="voltgrid-summary-history-btn"
            onClick={onViewHistory}
          >
            View Charging History
          </button>
        </div>
      </div>
    </div>
  );
};
