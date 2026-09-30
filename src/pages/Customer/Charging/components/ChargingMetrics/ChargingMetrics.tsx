import React from 'react';
import './ChargingMetrics.css';

interface ChargingMetricsProps {
  durationSeconds: number;
  currentCost: number;
  ratePerKwh: number;
  walletRemaining: number;
}

export const ChargingMetrics: React.FC<ChargingMetricsProps> = ({
  durationSeconds,
  currentCost,
  ratePerKwh,
  walletRemaining,
}) => {
  const mins = Math.floor(durationSeconds / 60);
  const secs = durationSeconds % 60;
  const durationFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <>
      {/* 3 Metric Cards */}
      <div className="voltgrid-charging-metrics-grid">
        <div className="voltgrid-charging-metric-card">
          <span className="voltgrid-charging-metric-card__val">
            {durationFormatted}
          </span>
          <span className="voltgrid-charging-metric-card__label">Duration</span>
        </div>

        <div className="voltgrid-charging-metric-card">
          <span className="voltgrid-charging-metric-card__val voltgrid-charging-metric-card__val--lime">
            ₹{Math.round(currentCost)}
          </span>
          <span className="voltgrid-charging-metric-card__label">Current Cost</span>
        </div>

        <div className="voltgrid-charging-metric-card">
          <span className="voltgrid-charging-metric-card__val voltgrid-charging-metric-card__val--cyan">
            ₹{ratePerKwh}/kWh
          </span>
          <span className="voltgrid-charging-metric-card__label">Rate</span>
        </div>
      </div>

      {/* Wallet Remaining Card */}
      <div className="voltgrid-charging-wallet-card">
        <span className="voltgrid-charging-wallet-card__label">
          Wallet Remaining
        </span>
        <span className="voltgrid-charging-wallet-card__val">
          ₹{Math.round(walletRemaining)}
        </span>
      </div>
    </>
  );
};
