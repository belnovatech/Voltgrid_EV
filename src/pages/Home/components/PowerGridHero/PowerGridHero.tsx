import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OperationsSummary } from '../../../../types/operations';
import './PowerGridHero.css';

interface PowerGridHeroProps {
  summary: OperationsSummary;
  isLoading?: boolean;
}

export const PowerGridHero: React.FC<PowerGridHeroProps> = ({
  summary,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login?role=customer');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="pg-hero">
      {/* Top Header / Branding */}
      <header className="pg-hero__header">
        <div className="pg-hero__brand">
          <div className="pg-hero__logo-icon" aria-hidden="true">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span className="pg-hero__brand-name">PowerGrid</span>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="pg-hero__body">
        {/* Status / Location Badge */}
        <div className="pg-hero__badge" role="status">
          <span className="pg-hero__badge-dot" aria-hidden="true" />
          <span>
            {isLoading
              ? 'Loading network...'
              : `${summary.totalChargers} Charging Points · ${summary.totalZones} Zones · ${summary.region}`}
          </span>
        </div>

        {/* Primary Hero Heading */}
        <h1 className="pg-hero__heading">
          Power Your<br />
          <span className="pg-hero__heading-accent">Journey.</span>
        </h1>

        {/* Description */}
        <p className="pg-hero__description">
          Find, reserve and charge your EV at trusted<br className="pg-hero__desc-br" />
          charging stations across Andhra Pradesh. Intelligent<br className="pg-hero__desc-br" />
          charging, simplified.
        </p>

        {/* CTA Actions */}
        <div className="pg-hero__actions">
          <button
            type="button"
            className="pg-hero__cta-primary"
            onClick={handleGetStarted}
          >
            <span>Get Started</span>
            <span className="pg-hero__cta-arrow" aria-hidden="true">→</span>
          </button>

          <button
            type="button"
            className="pg-hero__cta-secondary"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>

        {/* Statistics Row */}
        <div className="pg-hero__stats" aria-label="Network Statistics">
          <div className="pg-hero__stat-item">
            <span className="pg-hero__stat-number">
              {isLoading ? '...' : summary.totalChargers}
            </span>
            <span className="pg-hero__stat-label">Chargers</span>
          </div>

          <div className="pg-hero__stat-item">
            <span className="pg-hero__stat-number">
              {isLoading ? '...' : summary.totalZones}
            </span>
            <span className="pg-hero__stat-label">Zones</span>
          </div>

          <div className="pg-hero__stat-item">
            <span className="pg-hero__stat-number">
              {isLoading ? '...' : `${summary.totalCities}+`}
            </span>
            <span className="pg-hero__stat-label">Cities</span>
          </div>
        </div>
      </div>

      {/* Bottom Infrastructure Assurance */}
      <footer className="pg-hero__footer">
        <div className="pg-hero__security-tag">
          <svg
            className="pg-hero__security-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Secure · Reliable · Enterprise-grade EV Infrastructure</span>
        </div>
      </footer>
    </div>
  );
};
