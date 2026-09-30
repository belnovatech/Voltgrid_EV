import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerVehicle } from '../../../../../types/customer';
import './VehicleSection.css';

interface VehicleSectionProps {
  vehicles: CustomerVehicle[];
  onAddVehicleClick: () => void;
  isLoading?: boolean;
}

export const VehicleSection: React.FC<VehicleSectionProps> = ({
  vehicles,
  onAddVehicleClick,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'Bike' | 'Car' | 'Bus'>('Car');

  const defaultVeh = vehicles.find((v) => v.isDefault) || vehicles[0];

  const pricingTiers = [
    { type: 'Bike' as const, rate: 8, label: 'BIKE', icon: '🛵' },
    { type: 'Car' as const, rate: 12, label: 'CAR', icon: '🚗' },
    { type: 'Bus' as const, rate: 18, label: 'BUS', icon: '🚌' },
  ];

  const activeRate = pricingTiers.find((t) => t.type === selectedCategory)?.rate ?? 12;

  return (
    <section className="pg-vsec" aria-labelledby="vsec-heading">
      <div className="pg-vsec__head">
        <h3 id="vsec-heading" className="pg-vsec__title">My Vehicles</h3>
        <button
          type="button"
          className="pg-vsec__manage-btn"
          onClick={() => navigate('/customer/vehicles')}
        >
          Manage ›
        </button>
      </div>

      {isLoading ? (
        <div className="pg-vsec__loading">Loading vehicles...</div>
      ) : vehicles.length === 0 ? (
        <div className="pg-vsec__empty">
          <p>No vehicles added yet.</p>
          <button type="button" className="pg-vsec__add-btn" onClick={onAddVehicleClick}>
            + Add Vehicle
          </button>
        </div>
      ) : (
        <div className="pg-vsec__list">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className={`pg-vsec__card ${v.isDefault ? 'pg-vsec__card--primary' : ''}`}
            >
              <div className="pg-vsec__card-icon-box">
                <span>{v.type === 'Bike' ? '🛵' : v.type === 'Bus' ? '🚌' : '🚗'}</span>
              </div>

              <div className="pg-vsec__card-info">
                <div className="pg-vsec__card-name-row">
                  <h4 className="pg-vsec__card-name">{v.name}</h4>
                  {v.isDefault && (
                    <span className="pg-vsec__primary-tag">Primary</span>
                  )}
                </div>
                <span className="pg-vsec__card-meta">
                  {v.type.toUpperCase()} · {v.model}
                </span>
                <span className="pg-vsec__card-rate">₹{v.ratePerKWh}/kWh</span>
              </div>

              <div className="pg-vsec__card-battery">
                <div className="pg-vsec__battery-header">
                  <span className="pg-vsec__battery-pct">{v.batteryPercentage}%</span>
                </div>
                <div className="pg-vsec__battery-track" aria-hidden="true">
                  <div
                    className="pg-vsec__battery-fill"
                    style={{
                      width: `${v.batteryPercentage}%`,
                      backgroundColor: v.batteryPercentage > 30 ? '#9ae600' : '#f59e0b',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Quick Add Vehicle Card */}
          <button
            type="button"
            className="pg-vsec__add-vehicle-card"
            onClick={onAddVehicleClick}
          >
            <span className="pg-vsec__add-plus">+</span>
            <span>Add New EV to Garage</span>
          </button>
        </div>
      )}

      {/* Your Charging Rate Card matching Section 15 & Screenshots */}
      <div className="pg-vsec__rate-card">
        <div className="pg-vsec__rate-header">
          <div>
            <span className="pg-vsec__rate-tag">YOUR CHARGING RATE</span>
            <div className="pg-vsec__rate-val">₹{activeRate}/kWh</div>
            <span className="pg-vsec__rate-veh">
              {defaultVeh ? `${defaultVeh.name} · ${defaultVeh.type.toUpperCase()}` : 'Tata Nexon EV · CAR'}
            </span>
          </div>
        </div>

        <div className="pg-vsec__rate-tiers">
          {pricingTiers.map((tier) => (
            <button
              key={tier.type}
              type="button"
              className={`pg-vsec__tier-chip ${selectedCategory === tier.type ? 'pg-vsec__tier-chip--active' : ''}`}
              onClick={() => setSelectedCategory(tier.type)}
            >
              <span className="pg-vsec__tier-price">₹{tier.rate}</span>
              <span className="pg-vsec__tier-label">{tier.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
