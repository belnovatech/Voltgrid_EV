import React from 'react';
import { FeatureItem } from '../../types/demo';
import { Card } from '../Card/Card';
import './FeatureCard.css';

interface FeatureCardProps {
  feature: FeatureItem;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  const renderIcon = () => {
    switch (feature.iconName) {
      case 'location':
        return (
          <svg
            className="vg-feature-card__icon"
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
      case 'rupee':
        return (
          <svg
            className="vg-feature-card__icon"
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
      case 'qr':
        return (
          <svg
            className="vg-feature-card__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
        );
      case 'monitoring':
        return (
          <svg
            className="vg-feature-card__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="vg-feature-card" padding="lg">
      <div className="vg-feature-card__icon-box">
        {renderIcon()}
      </div>
      <h3 className="vg-feature-card__title">{feature.title}</h3>
      <p className="vg-feature-card__desc">{feature.description}</p>
    </Card>
  );
};
