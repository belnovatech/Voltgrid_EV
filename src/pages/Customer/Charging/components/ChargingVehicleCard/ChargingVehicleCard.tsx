import React from 'react';

interface ChargingVehicleCardProps {
  vehicleName: string;
  vehicleBatteryCapacityKWh: number;
  connectorType: string;
  batteryPercentage: number;
}

export const ChargingVehicleCard: React.FC<ChargingVehicleCardProps> = ({
  vehicleName,
  vehicleBatteryCapacityKWh,
  connectorType,
  batteryPercentage,
}) => {
  // Determine how many of 4 segments are filled
  const filledSegments = Math.max(1, Math.min(4, Math.ceil(batteryPercentage / 25)));

  return (
    <div className="voltgrid-charging-info-card">
      <div className="voltgrid-charging-info-card__left">
        <div className="voltgrid-charging-info-card__icon">
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
          <h4 className="voltgrid-charging-info-card__title">{vehicleName}</h4>
          <p className="voltgrid-charging-info-card__subtitle">
            CAR · {vehicleBatteryCapacityKWh} kWh · {connectorType}
          </p>
        </div>
      </div>

      <div className="voltgrid-charging-soc-wrap">
        <div className="voltgrid-charging-soc-segments">
          {[1, 2, 3, 4].map((seg) => (
            <div
              key={seg}
              className={`voltgrid-charging-soc-segment ${
                seg <= filledSegments ? 'voltgrid-charging-soc-segment--active' : ''
              }`}
            />
          ))}
        </div>
        <span className="voltgrid-charging-soc-text">{batteryPercentage}%</span>
      </div>
    </div>
  );
};
