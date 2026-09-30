import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { operationsService } from '../../services/operationsService';
import { OperationsSummary, ChargerStatusItem } from '../../types/operations';
import { formatCurrencyINR } from '../../utils/dashboardHelpers';
import './AdminOperations.css';

export const AdminOperations: React.FC = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<OperationsSummary | null>(null);
  const [chargers, setChargers] = useState<ChargerStatusItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sumData, chData] = await Promise.all([
        operationsService.getOperationsSummary(),
        operationsService.getChargerStatuses(),
      ]);
      setSummary(sumData);
      setChargers(chData);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSignOut = () => {
    logoutUser();
    navigate('/login');
  };

  const filteredChargers = chargers.filter((c) => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  return (
    <div className="pg-ops-center-page">
      {/* Header */}
      <header className="pg-ops-header">
        <div className="container pg-ops-header__container">
          <div className="pg-ops-header__left">
            <div className="pg-ops-header__brand">
              <div className="pg-ops-header__logo-icon" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
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
              <span className="pg-ops-header__brand-name">PowerGrid</span>
            </div>

            <div className="pg-ops-header__badge">
              <span>Operations Center</span>
            </div>

            <div className="pg-ops-header__telemetry">
              <span className="pg-ops-header__pulse-dot" />
              <span>Live Grid Telemetry</span>
            </div>
          </div>

          <div className="pg-ops-header__right">
            <div className="pg-ops-header__user-info">
              <span className="pg-ops-header__user-name">{user?.name || 'Operations Lead'}</span>
              <span className="pg-ops-header__user-role">Administrator</span>
            </div>

            <button
              type="button"
              className="pg-ops-header__signout-btn"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container pg-ops-main">
        {/* KPI Grid */}
        <section className="pg-ops-kpis" aria-label="Operations Overview">
          <div className="pg-ops-kpi-card">
            <span className="pg-ops-kpi-card__label">Total Network Chargers</span>
            <span className="pg-ops-kpi-card__value">
              {isLoading ? '...' : summary?.totalChargers ?? 80}
            </span>
            <span className="pg-ops-kpi-card__sub">8 Zones · Andhra Pradesh</span>
          </div>

          <div className="pg-ops-kpi-card">
            <span className="pg-ops-kpi-card__label">Available Chargers</span>
            <span className="pg-ops-kpi-card__value pg-ops-kpi-card__value--lime">
              {isLoading ? '...' : summary?.availableChargers ?? 56}
            </span>
            <span className="pg-ops-kpi-card__sub">70% Fleet Readiness</span>
          </div>

          <div className="pg-ops-kpi-card">
            <span className="pg-ops-kpi-card__label">Active Charging Sessions</span>
            <span className="pg-ops-kpi-card__value pg-ops-kpi-card__value--cyan">
              {isLoading ? '...' : summary?.activeSessions ?? 14}
            </span>
            <span className="pg-ops-kpi-card__sub">Peak load: 1.2 MW</span>
          </div>

          <div className="pg-ops-kpi-card">
            <span className="pg-ops-kpi-card__label">Today's Revenue</span>
            <span className="pg-ops-kpi-card__value">
              {isLoading ? '...' : formatCurrencyINR(summary?.todayRevenueINR ?? 12480)}
            </span>
            <span className="pg-ops-kpi-card__sub">+18% vs yesterday</span>
          </div>
        </section>

        {/* Chargers Management Grid */}
        <section className="pg-ops-chargers-section">
          <div className="pg-ops-section-header">
            <div>
              <h2 className="pg-ops-section-title">Live Charging Points</h2>
              <p className="pg-ops-section-subtitle">
                Monitor status, power output, and live customer charging sessions across hubs.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="pg-ops-filters">
              {['all', 'available', 'charging'].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`pg-ops-filter-btn ${filterStatus === status ? 'pg-ops-filter-btn--active' : ''}`}
                  onClick={() => setFilterStatus(status)}
                >
                  {status === 'all' ? 'All Units' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}

              <button
                type="button"
                className="pg-ops-refresh-btn"
                onClick={loadData}
                title="Refresh live data"
              >
                ↻ Refresh
              </button>
            </div>
          </div>

          <div className="pg-ops-chargers-grid">
            {filteredChargers.map((ch) => (
              <div key={ch.id} className="pg-ops-charger-card">
                <div className="pg-ops-charger-card__top">
                  <div>
                    <h3 className="pg-ops-charger-card__name">{ch.stationName}</h3>
                    <p className="pg-ops-charger-card__zone">
                      {ch.city} · {ch.zone}
                    </p>
                  </div>
                  <span className={`pg-ops-status-tag pg-ops-status-tag--${ch.status}`}>
                    {ch.status === 'available' ? '✓ Available' : '⚡ Charging'}
                  </span>
                </div>

                <div className="pg-ops-charger-card__bottom">
                  <div className="pg-ops-charger-spec">
                    <span className="pg-ops-spec-label">Capacity</span>
                    <span className="pg-ops-spec-val">{ch.powerKw} kW DC</span>
                  </div>
                  <div className="pg-ops-charger-spec">
                    <span className="pg-ops-spec-label">Rate</span>
                    <span className="pg-ops-spec-val">₹{ch.currentRateINR}/kWh</span>
                  </div>
                  {ch.activeSessionDurationMin && (
                    <div className="pg-ops-charger-spec">
                      <span className="pg-ops-spec-label">Session</span>
                      <span className="pg-ops-spec-val pg-ops-spec-val--cyan">
                        {ch.activeSessionDurationMin} min
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
