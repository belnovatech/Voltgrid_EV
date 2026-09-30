import React from 'react';
import { ChargerQRPayload } from '../../../../../types/charging';
import { CustomerReservation, CustomerVehicle } from '../../../../../types/customer';
import './ChargerFoundModal.css';

interface ChargerFoundModalProps {
  charger: ChargerQRPayload | null;
  reservation?: CustomerReservation | null;
  vehicles: CustomerVehicle[];
  selectedVehicleId: string;
  onSelectVehicle: (id: string) => void;
  onConfirmStart: () => void;
  onRescan: () => void;
  onClose: () => void;
}

export const ChargerFoundModal: React.FC<ChargerFoundModalProps> = ({
  charger,
  vehicles,
  selectedVehicleId,
  onConfirmStart,
  onRescan,
  onClose,
}) => {
  if (!charger) return null;

  const currentVehicle =
    vehicles.find((v) => v.id === selectedVehicleId) ||
    vehicles.find((v) => v.isDefault) ||
    vehicles[0] || {
      id: 'veh_def',
      name: 'Tata Nexon EV',
      model: 'Nexon EV Max',
      type: 'Car',
      licensePlate: 'AP-39-AB-1234',
      batteryCapacityKWh: 40.5,
      connector: 'CCS2',
      batteryPercentage: 22,
    };

  return (
    <div
      className="voltgrid-charger-found-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="voltgrid-charger-found-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="voltgrid-charger-found-header">
          <div className="voltgrid-charger-found-badge">
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
          <h2 className="voltgrid-charger-found-title">Charger Found</h2>
          <p className="voltgrid-charger-found-subtitle">
            Verified station point ready to initiate power flow
          </p>
        </div>

        {/* Body */}
        <div className="voltgrid-charger-found-body">
          {/* Charger Summary Card */}
          <div className="voltgrid-charger-card-summary">
            <div className="voltgrid-charger-card-summary__top">
              <div>
                <h3 className="voltgrid-charger-card-summary__station">
                  {charger.stationName}
                </h3>
                <p className="voltgrid-charger-card-summary__loc">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {charger.location}
                </p>
              </div>
              <span className="voltgrid-charger-card-summary__id-badge">
                {charger.chargerId}
              </span>
            </div>

            <div className="voltgrid-charger-card-summary__specs">
              <div className="voltgrid-charger-spec-item">
                <span className="voltgrid-charger-spec-item__label">Output Power</span>
                <span className="voltgrid-charger-spec-item__val">
                  ⚡ {charger.powerKw} kW
                </span>
              </div>
              <div className="voltgrid-charger-spec-item">
                <span className="voltgrid-charger-spec-item__label">Connector</span>
                <span className="voltgrid-charger-spec-item__val">
                  {charger.connectorType}
                </span>
              </div>
              <div className="voltgrid-charger-spec-item">
                <span className="voltgrid-charger-spec-item__label">Rate</span>
                <span className="voltgrid-charger-spec-item__val">
                  ₹{charger.ratePerKwh}/kWh
                </span>
              </div>
            </div>
          </div>

          {/* Connected Vehicle Preview */}
          <div className="voltgrid-charger-vehicle-preview">
            <div className="voltgrid-charger-vehicle-preview__left">
              <div className="voltgrid-charger-vehicle-preview__icon">
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
                <h4 className="voltgrid-charger-vehicle-preview__name">
                  {currentVehicle.name || currentVehicle.model}
                </h4>
                <p className="voltgrid-charger-vehicle-preview__plate">
                  {currentVehicle.licensePlate} · {currentVehicle.batteryCapacityKWh || 40.5} kWh
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="voltgrid-charger-found-actions">
          <button
            type="button"
            className="voltgrid-start-charging-btn"
            onClick={onConfirmStart}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>Start Charging</span>
          </button>

          <button
            type="button"
            className="voltgrid-rescan-btn"
            onClick={onRescan}
          >
            Scan Another Charger
          </button>
        </div>
      </div>
    </div>
  );
};
