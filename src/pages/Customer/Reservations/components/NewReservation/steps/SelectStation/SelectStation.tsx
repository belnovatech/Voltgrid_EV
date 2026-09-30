import React from 'react';
import { EVStation } from '../../../../../../../services/stationService';
import './SelectStation.css';

interface SelectStationProps {
  stations: EVStation[];
  selectedStation: EVStation | null;
  isLoading: boolean;
  onSelectStation: (station: EVStation) => void;
}

export const SelectStation: React.FC<SelectStationProps> = ({
  stations,
  selectedStation,
  isLoading,
  onSelectStation,
}) => {
  if (isLoading) {
    return (
      <div className="pg-step-station__loading">
        <div className="pg-step-station__spinner" />
        <p>Loading charging hubs near you...</p>
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="pg-step-station__empty">
        <p>No charging stations found in your region.</p>
      </div>
    );
  }

  return (
    <div className="pg-step-station">
      <div className="pg-step-station__list">
        {stations.map((st) => {
          const isSelected = selectedStation?.id === st.id;
          const isFull = st.availableChargers === 0 || st.status === 'full';

          return (
            <button
              key={st.id}
              type="button"
              className={`pg-step-station__card ${isSelected ? 'pg-step-station__card--selected' : ''} ${
                isFull ? 'pg-step-station__card--full' : ''
              }`}
              onClick={() => onSelectStation(st)}
              disabled={isFull}
              aria-label={`Select ${st.name}, ${st.availableChargers} free chargers`}
            >
              <div className="pg-step-station__badge">
                <span className="pg-step-station__badge-num">{st.availableChargers}</span>
              </div>

              <div className="pg-step-station__info">
                <div className="pg-step-station__title-row">
                  <h3 className="pg-step-station__name">{st.name}</h3>
                </div>
                <p className="pg-step-station__address">{st.address}</p>

                <div className="pg-step-station__meta">
                  <span className="pg-step-station__meta-item">{st.distanceKm} km</span>
                  <span className="pg-step-station__meta-item">{st.travelTimeMin} min</span>
                  <span className="pg-step-station__meta-item">{st.powerKw} kW</span>
                  <span
                    className={`pg-step-station__pill ${
                      isFull ? 'pg-step-station__pill--full' : 'pg-step-station__pill--free'
                    }`}
                  >
                    {isFull ? 'Full' : `${st.availableChargers} Free`}
                  </span>
                </div>
              </div>

              <div className="pg-step-station__chevron">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
