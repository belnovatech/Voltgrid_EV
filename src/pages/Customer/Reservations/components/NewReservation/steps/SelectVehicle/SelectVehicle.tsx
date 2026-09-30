import React from 'react';
import { CustomerVehicle } from '../../../../../../../types/customer';
import './SelectVehicle.css';

interface SelectVehicleProps {
  vehicles: CustomerVehicle[];
  selectedVehicle: CustomerVehicle | null;
  isLoading: boolean;
  onSelectVehicle: (vehicle: CustomerVehicle) => void;
}

export const SelectVehicle: React.FC<SelectVehicleProps> = ({
  vehicles,
  selectedVehicle,
  isLoading,
  onSelectVehicle,
}) => {
  if (isLoading) {
    return (
      <div className="pg-step-vehicle__loading">
        <div className="pg-step-vehicle__spinner" />
        <p>Loading your registered vehicles...</p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="pg-step-vehicle__empty">
        <p>No vehicles registered in your garage yet.</p>
      </div>
    );
  }

  return (
    <div className="pg-step-vehicle">
      <div className="pg-step-vehicle__list">
        {vehicles.map((veh) => {
          const isSelected = selectedVehicle?.id === veh.id;
          const isBike = veh.type.toLowerCase() === 'bike';

          return (
            <button
              key={veh.id}
              type="button"
              className={`pg-step-vehicle__card ${
                isSelected ? 'pg-step-vehicle__card--selected' : ''
              }`}
              onClick={() => onSelectVehicle(veh)}
              aria-label={`Select ${veh.name} - ${veh.licensePlate}`}
            >
              <div className="pg-step-vehicle__icon-wrap">
                {isBike ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="5.5" cy="17.5" r="3.5" />
                    <circle cx="18.5" cy="17.5" r="3.5" />
                    <path d="M15 6h-3l-3 7h10l-2-7z" />
                    <path d="M12 17v-4l-3-3" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.5l1.5-3h8l1.5 3H19a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M5 17a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2" />
                    <circle cx="7.5" cy="13.5" r="1.5" />
                    <circle cx="16.5" cy="13.5" r="1.5" />
                  </svg>
                )}
              </div>

              <div className="pg-step-vehicle__info">
                <h4 className="pg-step-vehicle__name">{veh.name}</h4>
                <p className="pg-step-vehicle__meta">
                  {veh.licensePlate} · {veh.batteryPercentage}% battery
                </p>
              </div>

              <div className="pg-step-vehicle__rate-side">
                <span className="pg-step-vehicle__rate">₹{veh.ratePerKWh || 12}/kWh</span>
                <span className="pg-step-vehicle__type">{veh.type.toUpperCase()}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
