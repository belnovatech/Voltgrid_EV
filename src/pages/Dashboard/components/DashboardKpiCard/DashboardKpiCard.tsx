import React, { ReactNode } from 'react';
import './DashboardKpiCard.css';

interface DashboardKpiCardProps {
  icon: 'wallet' | 'rupee' | 'location';
  label: string;
  value: ReactNode;
  isLoading?: boolean;
}

export const DashboardKpiCard: React.FC<DashboardKpiCardProps> = ({
  icon,
  label,
  value,
  isLoading = false,
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'wallet':
        return (
          <svg
            className="vg-kpi-card__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2" y="4" width="20" height="16" rx="3" />
            <path d="M16 12h2" />
            <path d="M2 10h20" />
          </svg>
        );
      case 'rupee':
        return (
          <svg
            className="vg-kpi-card__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 3h12" />
            <path d="M6 8h12" />
            <path d="M6 13l8.5 8" />
            <path d="M6 13h3a4 4 0 0 0 0-8" />
          </svg>
        );
      case 'location':
        return (
          <svg
            className="vg-kpi-card__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="vg-kpi-card vg-kpi-card--skeleton" aria-busy="true">
        <div className="vg-kpi-card__icon-box vg-skeleton-item" />
        <div className="vg-kpi-card__label vg-skeleton-text-sm" />
        <div className="vg-kpi-card__value vg-skeleton-text-lg" />
      </div>
    );
  }

  return (
    <div className="vg-kpi-card">
      <div className="vg-kpi-card__icon-box">
        {renderIcon()}
      </div>
      <p className="vg-kpi-card__label">{label}</p>
      <div className="vg-kpi-card__value">{value}</div>
    </div>
  );
};
