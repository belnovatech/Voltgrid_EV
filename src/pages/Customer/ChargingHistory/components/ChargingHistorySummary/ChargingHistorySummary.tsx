import React from 'react';
import './ChargingHistorySummary.css';

interface ChargingHistorySummaryProps {
  totalSessions: number;
  totalEnergy: number;
  totalSpent: number;
  avgDuration: number;
}

export const ChargingHistorySummary: React.FC<ChargingHistorySummaryProps> = ({
  totalSessions,
  totalEnergy,
  totalSpent,
  avgDuration,
}) => {
  return (
    <div className="powergrid-history-summary">
      <div className="powergrid-history-summary__card">
        <div className="powergrid-history-summary__value">{totalSessions}</div>
        <div className="powergrid-history-summary__label">Total Sessions</div>
      </div>

      <div className="powergrid-history-summary__card">
        <div className="powergrid-history-summary__value">{totalEnergy} kWh</div>
        <div className="powergrid-history-summary__label">Energy Used</div>
      </div>

      <div className="powergrid-history-summary__card">
        <div className="powergrid-history-summary__value">₹{totalSpent.toFixed(2)}</div>
        <div className="powergrid-history-summary__label">Total Spent</div>
      </div>

      <div className="powergrid-history-summary__card">
        <div className="powergrid-history-summary__value">{avgDuration} min</div>
        <div className="powergrid-history-summary__label">Avg Duration</div>
      </div>
    </div>
  );
};
