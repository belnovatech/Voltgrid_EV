import React from 'react';
import './ChargingHistorySkeleton.css';

export const ChargingHistorySkeleton: React.FC = () => {
  return (
    <div className="powergrid-history-skeleton">
      <div className="powergrid-history-skeleton__card" />
      <div className="powergrid-history-skeleton__card" />
    </div>
  );
};
