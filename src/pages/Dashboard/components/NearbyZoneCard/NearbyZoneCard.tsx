import React from 'react';
import { NearbyZone } from '../../../../types/dashboard';
import { AvailabilityBadge } from '../AvailabilityBadge/AvailabilityBadge';
import { formatZoneMeta } from '../../../../utils/dashboardHelpers';
import './NearbyZoneCard.css';

interface NearbyZoneCardProps {
  zone?: NearbyZone;
  isLoading?: boolean;
  onSelect?: (zone: NearbyZone) => void;
}

export const NearbyZoneCard: React.FC<NearbyZoneCardProps> = ({
  zone,
  isLoading = false,
  onSelect,
}) => {
  if (isLoading || !zone) {
    return (
      <div className="vg-nearby-zone-card vg-nearby-zone-card--skeleton" aria-busy="true">
        <div className="vg-nearby-zone-card__info">
          <div className="vg-skeleton-text-title" />
          <div className="vg-skeleton-text-sub" />
        </div>
        <div className="vg-skeleton-badge" />
      </div>
    );
  }

  return (
    <div
      className="vg-nearby-zone-card"
      onClick={() => onSelect && onSelect(zone)}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className="vg-nearby-zone-card__info">
        <h3 className="vg-nearby-zone-card__name">{zone.name}</h3>
        <p className="vg-nearby-zone-card__meta">
          {formatZoneMeta(zone.city, zone.distanceKm, zone.etaMinutes)}
        </p>
      </div>

      <div className="vg-nearby-zone-card__badge-wrapper">
        <AvailabilityBadge status={zone.status} />
      </div>
    </div>
  );
};
