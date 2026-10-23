import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerDashboardData } from '../../../../../types/customer';
import './SmartAIInsights.css';

interface SmartAIInsightsProps {
  data: CustomerDashboardData | null;
  isLoading?: boolean;
}

export const SmartAIInsights: React.FC<SmartAIInsightsProps> = ({ data }) => {
  const navigate = useNavigate();

  const primaryVehicle = data?.vehicles?.[0];
  const batteryPct = primaryVehicle?.batteryPercentage ?? 68;
  const estimatedRange = Math.round((batteryPct / 100) * 312);

  return (
    <section className="eway-ai-insights" aria-label="Eway AI Insights and Quick Actions">
      <div className="eway-ai-insights__container">
        {/* Left Side: Intelligent Recommendation */}
        <div className="eway-ai-insights__content">
          <div className="eway-ai-insights__tag-row">
            <span className="eway-ai-insights__badge">
              <span className="eway-ai-insights__badge-dot" />
              EWAY AI INTELLIGENCE · RANGE & TARIFF ADVISOR
            </span>
            <span className="eway-ai-insights__telemetry-badge">Real-time Grid Sync</span>
          </div>

          <h3 className="eway-ai-insights__headline">
            Optimal Range for {primaryVehicle?.name || 'Tata Nexon EV Max'}
          </h3>

          <p className="eway-ai-insights__description">
            Current battery at <strong>{batteryPct}%</strong> (~<strong>{estimatedRange} km</strong> range). Off-peak green tariffs active across Andhra Pradesh hubs. High-speed 120kW DC charging recommended before long-distance highway transit.
          </p>

          <div className="eway-ai-insights__metrics">
            <div className="eway-ai-insights__metric-chip">
              <span className="eway-ai-insights__metric-label">Recommended Limit</span>
              <span className="eway-ai-insights__metric-val">80% Health Opt.</span>
            </div>
            <div className="eway-ai-insights__metric-chip">
              <span className="eway-ai-insights__metric-label">Estimated Range</span>
              <span className="eway-ai-insights__metric-val">{estimatedRange} km</span>
            </div>
            <div className="eway-ai-insights__metric-chip eway-ai-insights__metric-chip--cyan">
              <span className="eway-ai-insights__metric-label">Green Tariff</span>
              <span className="eway-ai-insights__metric-val">Save 12% Off-Peak</span>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action Command Center */}
        <div className="eway-ai-insights__actions-panel">
          <span className="eway-ai-insights__actions-title">QUICK ACTIONS</span>

          <div className="eway-ai-insights__actions-grid">
            <button
              type="button"
              className="eway-ai-insights__action-btn eway-ai-insights__action-btn--primary"
              onClick={() => navigate('/customer/charging')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>Scan & Charge</span>
            </button>

            <button
              type="button"
              className="eway-ai-insights__action-btn"
              onClick={() => navigate('/customer/wallet')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <span>Add Money</span>
            </button>

            <button
              type="button"
              className="eway-ai-insights__action-btn"
              onClick={() => navigate('/customer/chargers')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Find Stations</span>
            </button>

            <button
              type="button"
              className="eway-ai-insights__action-btn"
              onClick={() => navigate('/customer/reservations')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Reservations</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default SmartAIInsights;
