import React from 'react';
import { EVStation, ChargingPoint } from '../../../../../services/stationService';
import './StationDetailsDrawer.css';

interface StationDetailsDrawerProps {
  station: EVStation | null;
  onClose: () => void;
  onReserve: (station: EVStation) => void;
  onDirections: (station: EVStation) => void;
}

export const StationDetailsDrawer: React.FC<StationDetailsDrawerProps> = ({
  station,
  onClose,
  onReserve,
  onDirections,
}) => {
  if (!station) return null;

  const isFull = station.availableChargers === 0 || station.status === 'full';

  return (
    <div className="pg-sdrawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pg-sdrawer" onClick={(e) => e.stopPropagation()}>
        <div className="pg-sdrawer__header">
          <div>
            <span className="pg-sdrawer__tag">POWERGRID FAST CHARGING STATION</span>
            <h2 className="pg-sdrawer__title">{station.name}</h2>
            <p className="pg-sdrawer__address">📍 {station.address}</p>
          </div>
          <button
            type="button"
            className="pg-sdrawer__close-btn"
            onClick={onClose}
            aria-label="Close drawer"
          >
            ✕
          </button>
        </div>

        <div className="pg-sdrawer__body">
          {/* Quick Metrics */}
          <div className="pg-sdrawer__metrics">
            <div className="pg-sdrawer__metric">
              <span className="pg-sdrawer__metric-label">Max Power</span>
              <span className="pg-sdrawer__metric-val">{station.powerKw} kW DC</span>
            </div>
            <div className="pg-sdrawer__metric">
              <span className="pg-sdrawer__metric-label">Live Availability</span>
              <span className={`pg-sdrawer__metric-val ${isFull ? 'pg-sdrawer__metric-val--red' : 'pg-sdrawer__metric-val--green'}`}>
                {isFull ? 'Full' : `${station.availableChargers}/${station.totalChargers} Free`}
              </span>
            </div>
            <div className="pg-sdrawer__metric">
              <span className="pg-sdrawer__metric-label">Rate</span>
              <span className="pg-sdrawer__metric-val">₹{station.ratePerKWh}/kWh</span>
            </div>
          </div>

          {/* Individual Charging Guns / Plugs */}
          {station.chargers.length > 0 && (
            <div className="pg-sdrawer__section">
              <h4 className="pg-sdrawer__section-heading">Live Charging Guns ({station.chargers.length})</h4>
              <div className="pg-sdrawer__guns-list">
                {station.chargers.map((ch: ChargingPoint) => (
                  <div key={ch.id} className="pg-sdrawer__gun-item">
                    <div className="pg-sdrawer__gun-left">
                      <span className="pg-sdrawer__gun-icon">🔌</span>
                      <div>
                        <strong>{ch.name}</strong>
                        <span>{ch.powerKw} kW · {ch.connector}</span>
                      </div>
                    </div>
                    <span className={`pg-sdrawer__gun-status pg-sdrawer__gun-status--${ch.status}`}>
                      {ch.status === 'available' ? 'Available' : 'Charging'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities & Operating Hours */}
          <div className="pg-sdrawer__section">
            <h4 className="pg-sdrawer__section-heading">Operating Hours & Amenities</h4>
            <div className="pg-sdrawer__hours-box">
              <span>🕒 {station.operatingHours}</span>
            </div>
            <div className="pg-sdrawer__amenities-wrap">
              {station.amenities.map((am: string, i: number) => (
                <span key={i} className="pg-sdrawer__amenity-tag">
                  ✓ {am}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pg-sdrawer__footer">
          <button
            type="button"
            className="pg-sdrawer__dir-btn"
            onClick={() => onDirections(station)}
          >
            Get Directions
          </button>
          {!isFull && (
            <button
              type="button"
              className="pg-sdrawer__reserve-btn"
              onClick={() => {
                onClose();
                onReserve(station);
              }}
            >
              Reserve Slot
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
