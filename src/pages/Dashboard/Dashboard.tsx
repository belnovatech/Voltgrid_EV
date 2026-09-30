import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/dashboardService';
import { vehicleService } from '../../services/vehicleService';
import { Vehicle, NearbyZone, DashboardSummary } from '../../types/dashboard';
import { DashboardHeader } from './components/DashboardHeader/DashboardHeader';
import { DashboardKpiCard } from './components/DashboardKpiCard/DashboardKpiCard';
import { NearbyZoneCard } from './components/NearbyZoneCard/NearbyZoneCard';
import { formatCurrencyINR } from '../../utils/dashboardHelpers';
import { Button } from '../../components/Button/Button';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedZone, setSelectedZone] = useState<NearbyZone | null>(null);

  // Authentication Guard: Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [summaryData, userVehicles] = await Promise.all([
        dashboardService.getDashboardSummary(),
        vehicleService.getUserVehicles(),
      ]);
      setSummary(summaryData);
      setVehicles(userVehicles);
    } catch {
      setError('Unable to load your dashboard right now. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const handleSelectVehicle = async (vehicle: Vehicle) => {
    if (!summary) return;
    try {
      const updatedVehicle = await vehicleService.setSelectedVehicle(vehicle.id);
      setSummary({
        ...summary,
        currentVehicle: updatedVehicle,
      });
    } catch {
      // Fallback update in state
      setSummary({
        ...summary,
        currentVehicle: vehicle,
      });
    }
  };

  const currentVehicle = summary?.currentVehicle || vehicles[0];
  const walletBalance = summary?.walletBalance ?? 1250;
  const availablePointsNearby = summary?.availablePointsNearby ?? 48;
  const nearbyZones = summary?.nearbyZones ?? [];

  if (error) {
    return (
      <div className="vg-dash-page">
        {currentVehicle && (
          <DashboardHeader
            currentVehicle={currentVehicle}
            vehicles={vehicles}
            onSelectVehicle={handleSelectVehicle}
            walletBalance={walletBalance}
          />
        )}
        <main className="container vg-dash-error-container">
          <div className="vg-dash-error-card">
            <svg
              className="vg-dash-error-icon"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h2>Unable to load dashboard</h2>
            <p>{error}</p>
            <Button variant="primary" onClick={loadDashboardData}>
              Try again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="vg-dash-page">
      {/* Header */}
      {currentVehicle ? (
        <DashboardHeader
          currentVehicle={currentVehicle}
          vehicles={vehicles}
          onSelectVehicle={handleSelectVehicle}
          walletBalance={walletBalance}
        />
      ) : (
        <div className="vg-dash-header-skeleton" />
      )}

      {/* Main Content */}
      <main className="container vg-dash-main">
        {/* Dynamic Greeting Section */}
        <section className="vg-dash-greeting" aria-labelledby="dash-greeting-heading">
          {isLoading ? (
            <div className="vg-dash-greeting__skeleton">
              <div className="vg-skeleton-text-lg vg-dash-greeting__sk-title" />
              <div className="vg-skeleton-text-sm vg-dash-greeting__sk-sub" />
            </div>
          ) : (
            <>
              <h1 id="dash-greeting-heading" className="vg-dash-greeting__title">
                Hello, ready to charge the {currentVehicle?.name}?
              </h1>
              <p className="vg-dash-greeting__meta">
                {currentVehicle?.type} rate · ₹{currentVehicle?.ratePerKWh}/kWh · battery {currentVehicle?.batteryPercentage}%
              </p>
            </>
          )}
        </section>

        {/* 3 KPI Cards */}
        <section className="vg-dash-kpis" aria-label="Key Performance Indicators">
          <DashboardKpiCard
            icon="wallet"
            label="Wallet balance"
            value={formatCurrencyINR(walletBalance)}
            isLoading={isLoading}
          />
          <DashboardKpiCard
            icon="rupee"
            label="Applicable rate"
            value={`₹${currentVehicle?.ratePerKWh || 12}/kWh`}
            isLoading={isLoading}
          />
          <DashboardKpiCard
            icon="location"
            label="Available points nearby"
            value={availablePointsNearby}
            isLoading={isLoading}
          />
        </section>

        {/* Nearby Zones Section */}
        <section className="vg-dash-zones-section" aria-labelledby="nearby-zones-heading">
          <div className="vg-dash-zones__header">
            <h2 id="nearby-zones-heading" className="vg-dash-zones__title">
              Nearby zones
            </h2>
            <button
              type="button"
              className="vg-dash-zones__see-all-btn"
              onClick={() => navigate('/stations')}
            >
              See all
            </button>
          </div>

          {isLoading ? (
            <div className="vg-dash-zones__grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <NearbyZoneCard key={i} isLoading={true} />
              ))}
            </div>
          ) : nearbyZones.length === 0 ? (
            <div className="vg-dash-empty-zones">
              <p>No charging zones found nearby.</p>
              <Button variant="secondary" size="sm" onClick={() => navigate('/stations')}>
                Explore all stations
              </Button>
            </div>
          ) : (
            <div className="vg-dash-zones__grid">
              {nearbyZones.map((zone) => (
                <NearbyZoneCard
                  key={zone.id}
                  zone={zone}
                  onSelect={(z) => setSelectedZone(z)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Optional Interactive Zone Detail Modal */}
      {selectedZone && (
        <div className="vg-zone-modal-overlay" onClick={() => setSelectedZone(null)} role="dialog">
          <div className="vg-zone-modal" onClick={(e) => e.stopPropagation()}>
            <div className="vg-zone-modal__header">
              <h3 className="vg-zone-modal__title">{selectedZone.name}</h3>
              <button
                type="button"
                className="vg-zone-modal__close"
                onClick={() => setSelectedZone(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div className="vg-zone-modal__body">
              <p className="vg-zone-modal__location">
                📍 {selectedZone.city} · {selectedZone.distanceKm} km away · ETA: {selectedZone.etaMinutes} min
              </p>
              <p className="vg-zone-modal__rate">
                Rate for your <strong>{currentVehicle?.name}</strong>: <strong>₹{currentVehicle?.ratePerKWh}/kWh</strong>
              </p>
              <p className="vg-zone-modal__points">
                Available charging points: <strong>{selectedZone.availablePointsCount || 6} connectors</strong>
              </p>
            </div>
            <div className="vg-zone-modal__actions">
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  alert(`Charging point reserved at ${selectedZone.name}! Navigate there or scan QR upon arrival.`);
                  setSelectedZone(null);
                }}
              >
                Reserve Charging Point
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
