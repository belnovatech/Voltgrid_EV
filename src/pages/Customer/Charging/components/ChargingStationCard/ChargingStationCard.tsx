import React from 'react';

interface ChargingStationCardProps {
  stationName: string;
  chargerId: string;
  location: string;
}

export const ChargingStationCard: React.FC<ChargingStationCardProps> = ({
  stationName,
  chargerId,
  location,
}) => {
  return (
    <div className="voltgrid-charging-info-card">
      <div className="voltgrid-charging-info-card__left">
        <div className="voltgrid-charging-info-card__icon voltgrid-charging-info-card__icon--cyan">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div>
          <h4 className="voltgrid-charging-info-card__title">
            {stationName} · {chargerId}
          </h4>
          <p className="voltgrid-charging-info-card__subtitle">{location}</p>
        </div>
      </div>
    </div>
  );
};
