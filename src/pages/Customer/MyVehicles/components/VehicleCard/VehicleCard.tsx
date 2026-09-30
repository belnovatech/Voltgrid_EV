import React from 'react';
import { CustomerVehicle } from '../../../../../types/customer';
import './VehicleCard.css';

interface VehicleCardProps {
  vehicle: CustomerVehicle;
  onEdit: (vehicle: CustomerVehicle) => void;
  onDelete: (vehicle: CustomerVehicle) => void;
  onSetPrimary: (id: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onEdit,
  onDelete,
  onSetPrimary,
}) => {
  const isBike = vehicle.type.toLowerCase() === 'bike';
  const isBus = vehicle.type.toLowerCase() === 'bus';

  const categoryBadgeClass = isBike
    ? 'pg-veh-card__badge--bike'
    : isBus
    ? 'pg-veh-card__badge--bus'
    : 'pg-veh-card__badge--car';

  const iconWrapClass = isBike
    ? 'pg-veh-card__icon-wrap--bike'
    : isBus
    ? 'pg-veh-card__icon-wrap--bus'
    : 'pg-veh-card__icon-wrap--car';

  return (
    <div className={`pg-veh-card ${vehicle.isDefault ? 'pg-veh-card--primary' : ''}`}>
      {/* Top Header */}
      <div className="pg-veh-card__header">
        <div className={`pg-veh-card__icon-wrap ${iconWrapClass}`}>
          {isBike ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="5.5" cy="17.5" r="3.5" />
              <circle cx="18.5" cy="17.5" r="3.5" />
              <path d="M15 6h-3l-3 7h10l-2-7z" />
              <path d="M12 17v-4l-3-3" />
            </svg>
          ) : isBus ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="3" width="16" height="16" rx="2" />
              <path d="M4 11h16" />
              <circle cx="8" cy="15" r="1.5" />
              <circle cx="16" cy="15" r="1.5" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.5l1.5-3h8l1.5 3H19a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M5 17a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2" />
              <circle cx="7.5" cy="13.5" r="1.5" />
              <circle cx="16.5" cy="13.5" r="1.5" />
            </svg>
          )}
        </div>

        <div className="pg-veh-card__title-group">
          <div className="pg-veh-card__name-line">
            <h3 className="pg-veh-card__name">{vehicle.name}</h3>
            <div className="pg-veh-card__badges">
              {vehicle.isDefault && (
                <span className="pg-veh-card__primary-badge">
                  <span className="pg-veh-card__star">☆</span> Primary
                </span>
              )}
              <span className={`pg-veh-card__type-badge ${categoryBadgeClass}`}>
                {vehicle.type.toUpperCase()}
              </span>
            </div>
          </div>
          <p className="pg-veh-card__model">
            {vehicle.manufacturer ? `${vehicle.manufacturer} · ` : ''}
            {vehicle.model}
          </p>
        </div>
      </div>

      {/* 2x2 Stats Grid */}
      <div className="pg-veh-card__stats-grid">
        <div className="pg-veh-card__stat-box">
          <span className="pg-veh-card__stat-label">Registration</span>
          <span className="pg-veh-card__stat-val">{vehicle.licensePlate}</span>
        </div>

        <div className="pg-veh-card__stat-box">
          <span className="pg-veh-card__stat-label">Battery</span>
          <span className="pg-veh-card__stat-val">
            {vehicle.batteryCapacityKWh || (isBike ? 4 : isBus ? 120 : 40.5)} kWh
          </span>
        </div>

        <div className="pg-veh-card__stat-box">
          <span className="pg-veh-card__stat-label">Connector</span>
          <span className="pg-veh-card__stat-val">{vehicle.connector || (isBike ? 'Type 2' : 'CCS2')}</span>
        </div>

        <div className="pg-veh-card__stat-box">
          <span className="pg-veh-card__stat-label">Sessions</span>
          <span className="pg-veh-card__stat-val">
            {vehicle.chargingSessionsCount ?? (isBike ? 7 : 18)} charges
          </span>
        </div>
      </div>

      {/* Dark Rate Bar */}
      <div className="pg-veh-card__rate-bar">
        <span className="pg-veh-card__rate-label">Your charging rate</span>
        <span className="pg-veh-card__rate-val">₹{vehicle.ratePerKWh || (isBike ? 8 : isBus ? 18 : 12)}/kWh</span>
      </div>

      {/* Action Footer */}
      <div className="pg-veh-card__footer">
        {!vehicle.isDefault ? (
          <>
            <button
              type="button"
              className="pg-veh-card__primary-btn"
              onClick={() => onSetPrimary(vehicle.id)}
            >
              Set Primary
            </button>
            <div className="pg-veh-card__icon-actions">
              <button
                type="button"
                className="pg-veh-card__action-btn"
                onClick={() => onEdit(vehicle)}
                aria-label={`Edit ${vehicle.name}`}
                title="Edit Vehicle"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                type="button"
                className="pg-veh-card__action-btn pg-veh-card__action-btn--delete"
                onClick={() => onDelete(vehicle)}
                aria-label={`Delete ${vehicle.name}`}
                title="Delete Vehicle"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="pg-veh-card__icon-actions pg-veh-card__icon-actions--right">
            <button
              type="button"
              className="pg-veh-card__action-btn"
              onClick={() => onEdit(vehicle)}
              aria-label={`Edit ${vehicle.name}`}
              title="Edit Vehicle"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              type="button"
              className="pg-veh-card__action-btn pg-veh-card__action-btn--delete"
              onClick={() => onDelete(vehicle)}
              aria-label={`Delete ${vehicle.name}`}
              title="Delete Vehicle"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
