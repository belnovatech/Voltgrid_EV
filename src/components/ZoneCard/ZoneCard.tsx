import React from 'react';
import { ZoneItem } from '../../types/demo';
import { Card } from '../Card/Card';
import './ZoneCard.css';

interface ZoneCardProps {
  zone: ZoneItem;
}

export const ZoneCard: React.FC<ZoneCardProps> = ({ zone }) => {
  return (
    <Card className="vg-zone-card" padding="md" variant="interactive">
      <div className="vg-zone-card__header">
        <h3 className="vg-zone-card__city">{zone.city}</h3>
        <p className="vg-zone-card__hub">{zone.hubName}</p>
      </div>
      <div className="vg-zone-card__distance">
        {zone.distanceKm} km away
      </div>
    </Card>
  );
};
