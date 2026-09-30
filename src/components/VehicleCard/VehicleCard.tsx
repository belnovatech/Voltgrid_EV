import React from 'react';
import { VehiclePricing } from '../../types/demo';
import { Card } from '../Card/Card';
import './VehicleCard.css';

interface VehicleCardProps {
  vehicle: VehiclePricing;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const renderVehicleIcon = () => {
    switch (vehicle.iconName) {
      case 'bike':
        return (
          <span className="vg-vehicle-card__emoji" role="img" aria-label="Motorbike">
            🛵
          </span>
        );
      case 'car':
        return (
          <span className="vg-vehicle-card__emoji" role="img" aria-label="Car">
            🚗
          </span>
        );
      case 'bus':
        return (
          <span className="vg-vehicle-card__emoji" role="img" aria-label="Bus">
            🚌
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="vg-vehicle-card" padding="md" variant="interactive">
      <div className="vg-vehicle-card__icon-wrapper">
        {renderVehicleIcon()}
      </div>
      <div className="vg-vehicle-card__content">
        <h3 className="vg-vehicle-card__type">{vehicle.type}</h3>
        <p className="vg-vehicle-card__rate">{vehicle.rateText}</p>
      </div>
    </Card>
  );
};
