import React from 'react';
import { NearbyStationItem } from '../NearbyStations/NearbyStations';
import './StationDetailsModal.css';

interface StationDetailsModalProps {
  station: NearbyStationItem | null;
  onClose: () => void;
  onReserve: (station: NearbyStationItem) => void;
}

export const StationDetailsModal: React.FC<StationDetailsModalProps> = ({
  station,
  onClose,
  onReserve,
}) => {
  if (!station) return null;

  return (
    <div className="pg-smodal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pg-smodal" onClick={(e) => e.stopPropagation()}>
        <div className="pg-smodal__header">
          <div>
            <span className="pg-smodal__tag">POWERGRID FAST CHARGING HUB</span>
            <h2 className="pg-smodal__title">{station.name}</h2>
            <p className="pg-smodal__sub">
              📍 {station.address || `${station.city}, Andhra Pradesh`}
            </p>
          </div>
          <button
            type="button"
            className="pg-smodal__close-btn"
            onClick={onClose}
            aria-label="Close details"
          >
            ✕
          </button>
        </div>

        <div className="pg-smodal__body">
          <div className="pg-smodal__stats-row">
            <div className="pg-smodal__stat-card">
              <span className="pg-smodal__stat-label">Power Rating</span>
              <span className="pg-smodal__stat-val">{station.powerKw} kW DC</span>
            </div>
            <div className="pg-smodal__stat-card">
              <span className="pg-smodal__stat-label">Availability</span>
              <span className="pg-smodal__stat-val pg-smodal__stat-val--green">
                {station.availablePoints}/{station.totalPoints} Free
              </span>
            </div>
            <div className="pg-smodal__stat-card">
              <span className="pg-smodal__stat-label">Applicable Rate</span>
              <span className="pg-smodal__stat-val">₹{station.ratePerKWh}/kWh</span>
            </div>
          </div>

          <div className="pg-smodal__section">
            <h4 className="pg-smodal__section-title">Supported Connectors & Plugs</h4>
            <div className="pg-smodal__connectors">
              <div className="pg-smodal__connector-chip">
                <span className="pg-smodal__plug-icon">🔌</span>
                <div>
                  <strong>CCS Type 2</strong>
                  <span>High-speed DC Fast (Up to {station.powerKw} kW)</span>
                </div>
              </div>
              <div className="pg-smodal__connector-chip">
                <span className="pg-smodal__plug-icon">⚡</span>
                <div>
                  <strong>Type 2 AC</strong>
                  <span>Standard AC Charger (22 kW)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pg-smodal__section">
            <h4 className="pg-smodal__section-title">Station Amenities & Hours</h4>
            <div className="pg-smodal__amenities">
              <span className="pg-smodal__amenity">🕒 Open 24/7</span>
              <span className="pg-smodal__amenity">☕ Cafe & Restrooms</span>
              <span className="pg-smodal__amenity">📶 High Speed Wi-Fi</span>
              <span className="pg-smodal__amenity">🛡️ 24x7 CCTV Security</span>
            </div>
          </div>
        </div>

        <div className="pg-smodal__footer">
          <button
            type="button"
            className="pg-smodal__cancel-btn"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="pg-smodal__reserve-btn"
            onClick={() => {
              onClose();
              onReserve(station);
            }}
          >
            Reserve Slot Now
          </button>
        </div>
      </div>
    </div>
  );
};
