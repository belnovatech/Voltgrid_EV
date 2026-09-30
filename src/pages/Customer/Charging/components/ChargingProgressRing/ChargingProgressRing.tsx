import React from 'react';
import './ChargingProgressRing.css';

interface ChargingProgressRingProps {
  energyDeliveredKwh: number;
  powerKw: number;
  batteryPercentage: number;
}

export const ChargingProgressRing: React.FC<ChargingProgressRingProps> = ({
  energyDeliveredKwh,
  powerKw,
  batteryPercentage,
}) => {
  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  // Progress based on battery percentage or energy delivered
  const progressRatio = Math.min(1, Math.max(0.04, batteryPercentage / 100));
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="voltgrid-progress-ring-container">
      <div className="voltgrid-progress-ring-svg-wrap">
        <div className="voltgrid-progress-ring__pulse-halo" />

        <svg className="voltgrid-progress-ring-svg" viewBox="0 0 240 240">
          <defs>
            <linearGradient
              id="voltgridLimeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#9ae600" />
              <stop offset="70%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <circle
            className="voltgrid-progress-ring__track"
            cx="120"
            cy="120"
            r={radius}
          />

          {/* Active Progress Fill */}
          <circle
            className="voltgrid-progress-ring__fill"
            cx="120"
            cy="120"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        {/* Center Live Values */}
        <div className="voltgrid-progress-ring-center">
          <h1 className="voltgrid-progress-ring__value">
            {energyDeliveredKwh.toFixed(1)}
          </h1>
          <span className="voltgrid-progress-ring__label">kWh Delivered</span>
          <div className="voltgrid-progress-ring__power-badge">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>{powerKw} kW</span>
          </div>
        </div>
      </div>
    </div>
  );
};
