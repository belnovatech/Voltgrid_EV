import React from 'react';
import './FilterChips.css';

interface FilterChipsProps {
  selectedVehicle: 'All' | 'Car' | 'Bike' | 'Bus';
  onSelectVehicle: (type: 'All' | 'Car' | 'Bike' | 'Bus') => void;
  carRate?: number;
  onOpenAdvancedFilters?: () => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  selectedVehicle,
  onSelectVehicle,
  carRate = 12,
  onOpenAdvancedFilters,
}) => {
  return (
    <div className="pg-fchips-container">
      <div className="pg-fchips" role="tablist" aria-label="Vehicle and charging filters">
        {/* ALL */}
        <button
          type="button"
          className={`pg-fchip ${selectedVehicle === 'All' ? 'pg-fchip--active' : ''}`}
          onClick={() => onSelectVehicle('All')}
          role="tab"
          aria-selected={selectedVehicle === 'All'}
        >
          <span>ALL</span>
        </button>

        {/* CAR with dynamic price */}
        <button
          type="button"
          className={`pg-fchip ${selectedVehicle === 'Car' ? 'pg-fchip--active' : ''}`}
          onClick={() => onSelectVehicle('Car')}
          role="tab"
          aria-selected={selectedVehicle === 'Car'}
        >
          <span className="pg-fchip__icon">🚗</span>
          <span>CAR</span>
          <span className="pg-fchip__rate">₹{carRate}</span>
        </button>

        {/* BIKE */}
        <button
          type="button"
          className={`pg-fchip ${selectedVehicle === 'Bike' ? 'pg-fchip--active' : ''}`}
          onClick={() => onSelectVehicle('Bike')}
          role="tab"
          aria-selected={selectedVehicle === 'Bike'}
        >
          <span className="pg-fchip__icon">🛵</span>
          <span>BIKE</span>
        </button>

        {/* BUS */}
        <button
          type="button"
          className={`pg-fchip ${selectedVehicle === 'Bus' ? 'pg-fchip--active' : ''}`}
          onClick={() => onSelectVehicle('Bus')}
          role="tab"
          aria-selected={selectedVehicle === 'Bus'}
        >
          <span className="pg-fchip__icon">🚌</span>
          <span>BUS</span>
        </button>

        {/* Advanced Filters Button */}
        <button
          type="button"
          className="pg-fchip pg-fchip--filters-btn"
          onClick={onOpenAdvancedFilters}
          aria-label="Open advanced filter options"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
};
