import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  MapPin,
  Calendar,
  Wallet,
  Car,
  BatteryCharging,
  ChevronRight,
  QrCode,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { customerService } from '../../services/customerService';
import { chargingSessionService } from '../../services/chargingSessionService';
import { walletService } from '../../services/walletService';
import { CustomerDashboardData, CustomerVehicle } from '../../types/customer';
import { ChargingSession } from '../../types/charging';
import { AppHeader } from '../../components/layout/AppHeader';
import { AppButton } from '../../components/common/AppButton';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState<CustomerDashboardData | null>(null);
  const [activeSession, setActiveSession] = useState<ChargingSession | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(() => walletService.getBalance());
  const [primaryVehicle, setPrimaryVehicle] = useState<CustomerVehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await customerService.getDashboardData();
      setDashboardData(data);
      const vehicles = await customerService.getVehicles();
      const primary = vehicles.find((v) => v.isDefault) || vehicles[0] || null;
      setPrimaryVehicle(primary);
    } catch (err) {
      setError('Unable to load EV dashboard. Please check connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const unsubSession = chargingSessionService.subscribe((session) => {
      setActiveSession(session);
    });

    const unsubWallet = walletService.subscribe((bal) => {
      setWalletBalance(bal);
    });

    return () => {
      unsubSession();
      unsubWallet();
    };
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <AppHeader />
        <LoadingState message="Connecting to Voltgrid EV Grid..." />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="dashboard-page">
        <AppHeader />
        <ErrorState message={error || 'Failed to fetch dashboard'} onRetry={fetchDashboard} />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <AppHeader hasUnread={dashboardData.unreadNotificationsCount > 0} />

      <main className="dashboard-content">
        {/* Driver Greeting */}
        <section className="greeting-section">
          <div className="greeting-text-group">
            <span className="greeting-time">{getGreeting()}</span>
            <h1 className="greeting-name">{user?.name || dashboardData.profile.name || 'EV Driver'}</h1>
          </div>

          <button
            className="wallet-badge-btn"
            onClick={() => navigate('/activity')}
            title="Voltgrid Wallet Balance"
          >
            <Wallet size={16} />
            <span>₹{walletBalance.toLocaleString('en-IN')}</span>
          </button>
        </section>

        {/* HERO CARD: Live Charging Session OR Standby Charger Finder */}
        {activeSession && activeSession.status === 'CHARGING' ? (
          <section className="active-charging-hero">
            <div className="hero-tag-row">
              <div className="live-indicator">
                <span className="live-pulse-ring" />
                <span>CHARGING LIVE</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--color-cyan)', fontWeight: 'bold' }}>
                {activeSession.powerKw} kW DC Supercharger
              </span>
            </div>

            <h2 className="hero-station-title">{activeSession.stationName}</h2>
            <p className="hero-vehicle-subtitle">
              {activeSession.vehicleName} · Connector {activeSession.connectorType}
            </p>

            <div className="hero-metrics-grid">
              <div className="hero-metric">
                <span className="hero-metric-label">Battery SoC</span>
                <span className="hero-metric-val hero-metric-val--green">
                  {activeSession.batteryPercentage}%
                </span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Delivered</span>
                <span className="hero-metric-val hero-metric-val--cyan">
                  {activeSession.energyDeliveredKwh} kWh
                </span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Current Cost</span>
                <span className="hero-metric-val">₹{activeSession.currentCost.toFixed(2)}</span>
              </div>
            </div>

            <AppButton
              variant="primary"
              size="md"
              fullWidth
              icon={<Zap size={18} />}
              onClick={() => navigate('/activity')}
            >
              Monitor Live Session
            </AppButton>
          </section>
        ) : (
          <section className="standby-card">
            <div className="standby-icon-box">
              <Zap size={26} />
            </div>
            <div className="standby-content">
              <h2 className="standby-title">Ready to Charge?</h2>
              <p className="standby-subtitle">Scan any Voltgrid EV QR or find nearby stations</p>
            </div>
            <AppButton
              variant="primary"
              size="sm"
              icon={<QrCode size={16} />}
              onClick={() => navigate('/activity')}
            >
              Start
            </AppButton>
          </section>
        )}

        {/* Quick Actions Grid */}
        <section>
          <div className="section-title" style={{ marginBottom: '12px' }}>
            <span>Quick Actions</span>
          </div>

          <div className="quick-actions-grid">
            <button className="quick-action-btn" onClick={() => navigate('/activity')}>
              <div className="quick-action-icon quick-action-icon--green">
                <QrCode size={20} />
              </div>
              <span className="quick-action-label">Scan & Charge</span>
            </button>

            <button className="quick-action-btn" onClick={() => navigate('/explore')}>
              <div className="quick-action-icon quick-action-icon--cyan">
                <MapPin size={20} />
              </div>
              <span className="quick-action-label">Find Station</span>
            </button>

            <button className="quick-action-btn" onClick={() => navigate('/bookings')}>
              <div className="quick-action-icon quick-action-icon--purple">
                <Calendar size={20} />
              </div>
              <span className="quick-action-label">Book Slot</span>
            </button>

            <button className="quick-action-btn" onClick={() => navigate('/activity')}>
              <div className="quick-action-icon quick-action-icon--amber">
                <Wallet size={20} />
              </div>
              <span className="quick-action-label">Wallet</span>
            </button>
          </div>
        </section>

        {/* Primary Vehicle Snapshot */}
        {primaryVehicle && (
          <section>
            <div className="section-title" style={{ marginBottom: '12px' }}>
              <span>My Primary EV</span>
              <span className="section-link" onClick={() => navigate('/profile')}>
                Manage
              </span>
            </div>

            <div className="vehicle-snapshot-card">
              <div className="vehicle-info-group">
                <div className="vehicle-icon-ring">
                  <Car size={24} />
                </div>
                <div>
                  <div className="vehicle-name">{primaryVehicle.name}</div>
                  <div className="vehicle-plate">
                    {primaryVehicle.licensePlate} · {primaryVehicle.connector || 'CCS2'}
                  </div>
                </div>
              </div>

              <div className="battery-badge">
                <BatteryCharging size={16} />
                <span>{primaryVehicle.batteryPercentage}%</span>
              </div>
            </div>
          </section>
        )}

        {/* Nearby Stations */}
        <section>
          <div className="section-title" style={{ marginBottom: '12px' }}>
            <span>Nearby Stations</span>
            <span className="section-link" onClick={() => navigate('/explore')}>
              View All
            </span>
          </div>

          <div className="nearby-stations-list">
            {dashboardData.nearbyStations.map((st) => (
              <div
                key={st.id}
                className="station-mini-card"
                onClick={() => navigate('/explore')}
              >
                <div className="station-mini-info">
                  <div className="station-mini-name">{st.name}</div>
                  <div className="station-mini-meta">
                    <span>{st.distanceKm} km</span>
                    <span>•</span>
                    <span>{st.powerKw} kW DC</span>
                    <span>•</span>
                    <span className="station-status-pill">
                      {st.availablePoints}/{st.totalPoints} Available
                    </span>
                  </div>
                </div>
                <div className="station-mini-action">
                  <ChevronRight size={18} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
