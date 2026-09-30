import React from 'react';
import './AvailabilityBadge.css';

interface AvailabilityBadgeProps {
  status?: 'available' | 'busy' | 'unavailable' | 'maintenance';
  label?: string;
}

export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({
  status = 'available',
  label,
}) => {
  const getStatusLabel = () => {
    if (label) return label;
    switch (status) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      case 'unavailable':
        return 'Unavailable';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Available';
    }
  };

  return (
    <div className={`vg-avail-badge vg-avail-badge--${status}`} role="status">
      <svg
        className="vg-avail-badge__icon"
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
        <circle cx="12" cy="12" r="10" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
      <span className="vg-avail-badge__text">{getStatusLabel()}</span>
    </div>
  );
};
