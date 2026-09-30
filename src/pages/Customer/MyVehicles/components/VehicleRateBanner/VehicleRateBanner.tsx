import React from 'react';
import './VehicleRateBanner.css';

export const VehicleRateBanner: React.FC = () => {
  return (
    <div className="pg-rate-banner">
      <div className="pg-rate-banner__content">
        <div className="pg-rate-banner__left">
          <span className="pg-rate-banner__title">SAMPLE CHARGING RATES</span>
          
          <div className="pg-rate-banner__rates">
            <div className="pg-rate-banner__item">
              <div className="pg-rate-banner__icon-wrap pg-rate-banner__icon-wrap--bike">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="5.5" cy="17.5" r="3.5" />
                  <circle cx="18.5" cy="17.5" r="3.5" />
                  <path d="M15 6h-3l-3 7h10l-2-7z" />
                  <path d="M12 17v-4l-3-3" />
                </svg>
              </div>
              <span className="pg-rate-banner__text">
                <strong>BIKE:</strong> ₹8/kWh
              </span>
            </div>

            <div className="pg-rate-banner__item">
              <div className="pg-rate-banner__icon-wrap pg-rate-banner__icon-wrap--car">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.5l1.5-3h8l1.5 3H19a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M5 17a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2" />
                  <circle cx="7.5" cy="13.5" r="1.5" />
                  <circle cx="16.5" cy="13.5" r="1.5" />
                </svg>
              </div>
              <span className="pg-rate-banner__text">
                <strong>CAR:</strong> ₹12/kWh
              </span>
            </div>

            <div className="pg-rate-banner__item">
              <div className="pg-rate-banner__icon-wrap pg-rate-banner__icon-wrap--bus">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="4" y="3" width="16" height="16" rx="2" />
                  <path d="M4 11h16" />
                  <circle cx="8" cy="15" r="1.5" />
                  <circle cx="16" cy="15" r="1.5" />
                </svg>
              </div>
              <span className="pg-rate-banner__text">
                <strong>BUS:</strong> ₹18/kWh
              </span>
            </div>
          </div>
        </div>

        <div className="pg-rate-banner__sub">
          Demo pricing · Admin configurable
        </div>
      </div>
    </div>
  );
};
