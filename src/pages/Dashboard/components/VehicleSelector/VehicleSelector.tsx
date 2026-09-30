import React, { useState, useRef, useEffect } from 'react';
import { Vehicle } from '../../../../types/dashboard';
import './VehicleSelector.css';

interface VehicleSelectorProps {
  currentVehicle: Vehicle;
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  disabled?: boolean;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  currentVehicle,
  vehicles,
  onSelectVehicle,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (veh: Vehicle) => {
    onSelectVehicle(veh);
    setIsOpen(false);
  };

  return (
    <div className="vg-vehicle-selector" ref={dropdownRef}>
      <button
        type="button"
        className={`vg-vehicle-selector__trigger ${isOpen ? 'vg-vehicle-selector__trigger--open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select vehicle. Currently selected: ${currentVehicle.name}`}
        disabled={disabled}
      >
        <span className="vg-vehicle-selector__emoji" aria-hidden="true">
          {currentVehicle.iconEmoji || '🚗'}
        </span>
        <span className="vg-vehicle-selector__name">{currentVehicle.name}</span>
        <svg
          className={`vg-vehicle-selector__chevron ${isOpen ? 'vg-vehicle-selector__chevron--open' : ''}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="vg-vehicle-selector__dropdown" role="listbox">
          <div className="vg-vehicle-selector__dropdown-header">
            <span>Your Vehicles</span>
          </div>
          <div className="vg-vehicle-selector__list">
            {vehicles.map((v) => {
              const isSelected = v.id === currentVehicle.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  className={`vg-vehicle-selector__item ${isSelected ? 'vg-vehicle-selector__item--selected' : ''}`}
                  onClick={() => handleSelect(v)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="vg-vehicle-selector__item-emoji" aria-hidden="true">
                    {v.iconEmoji}
                  </span>
                  <div className="vg-vehicle-selector__item-info">
                    <span className="vg-vehicle-selector__item-name">{v.name}</span>
                    <span className="vg-vehicle-selector__item-meta">
                      {v.type} · ₹{v.ratePerKWh}/kWh · {v.batteryPercentage}% battery
                    </span>
                  </div>
                  {isSelected && (
                    <svg
                      className="vg-vehicle-selector__check"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
