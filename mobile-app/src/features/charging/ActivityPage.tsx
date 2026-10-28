import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Zap,
  Square,
  Clock,
  BatteryCharging,
  Plus,
  Wallet,
  CheckCircle,
  X,
  CreditCard,
  History,
} from 'lucide-react';
import { chargingSessionService } from '../../services/chargingSessionService';
import { walletService } from '../../services/walletService';
import { customerService } from '../../services/customerService';
import { ChargingSession, ChargingSummaryData, ChargerQRPayload } from '../../types/charging';
import { ChargingHistoryItem, CustomerVehicle } from '../../types/customer';
import { AppHeader } from '../../components/layout/AppHeader';
import { AppButton } from '../../components/common/AppButton';
import './ActivityPage.css';

const CATALOG_CHARGERS: ChargerQRPayload[] = [
  {
    chargerId: 'CH-005',
    stationId: 'st-01',
    stationName: 'Vijayawada Central Hub',
    location: 'MG Road, Vijayawada',
    connectorType: 'CCS2',
    powerKw: 120,
    ratePerKwh: 12,
  },
  {
    chargerId: 'CH-027',
    stationId: 'st-04',
    stationName: 'Tirupati East Energy Hub',
    location: 'Alipiri Road, Tirupati',
    connectorType: 'CCS2',
    powerKw: 120,
    ratePerKwh: 12,
  },
  {
    chargerId: 'CH-015',
    stationId: 'st-03',
    stationName: 'Visakhapatnam Port Supercharger',
    location: 'Beach Road, Visakhapatnam',
    connectorType: 'CCS2',
    powerKw: 150,
    ratePerKwh: 14,
  },
];

export const ActivityPage: React.FC = () => {
  const location = useLocation();

  const [activeSession, setActiveSession] = useState<ChargingSession | null>(null);
  const [history, setHistory] = useState<ChargingHistoryItem[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(() => walletService.getBalance());
  const [vehicles, setVehicles] = useState<CustomerVehicle[]>([]);
  const [selectedChargerId, setSelectedChargerId] = useState<string>('CH-005');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  // Top-up Modal State
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(1000);
  const [isTopUpSubmitting, setIsTopUpSubmitting] = useState(false);

  // Summary Modal State
  const [summaryData, setSummaryData] = useState<ChargingSummaryData | null>(null);

  useEffect(() => {
    const unsubSession = chargingSessionService.subscribe((s) => {
      setActiveSession(s);
    });
    const unsubWallet = walletService.subscribe((bal) => {
      setWalletBalance(bal);
    });

    const loadData = async () => {
      const [hist, vehs] = await Promise.all([
        customerService.getChargingHistory(),
        customerService.getVehicles(),
      ]);
      setHistory(hist);
      setVehicles(vehs);
      if (vehs.length > 0) {
        const def = vehs.find((v) => v.isDefault) || vehs[0];
        setSelectedVehicleId(def.id);
      }
    };
    loadData();

    // Check if charger passed from other screen
    const state = location.state as { preselectCharger?: ChargerQRPayload; reservation?: unknown } | null;
    if (state?.preselectCharger) {
      handleDirectStart(state.preselectCharger);
    }

    return () => {
      unsubSession();
      unsubWallet();
    };
  }, [location.state]);

  const handleDirectStart = async (ch: ChargerQRPayload) => {
    if (activeSession && activeSession.status === 'CHARGING') return;
    const veh = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
    await chargingSessionService.startSession({
      charger: ch,
      vehicle: veh,
    });
  };

  const handleStartFromSelector = async () => {
    const ch = CATALOG_CHARGERS.find((c) => c.chargerId === selectedChargerId) || CATALOG_CHARGERS[0];
    await handleDirectStart(ch);
  };

  const handleStopCharging = async () => {
    if (window.confirm('Do you want to stop the charging session?')) {
      const summary = await chargingSessionService.stopSession();
      setSummaryData(summary);
      const updatedHistory = await customerService.getChargingHistory();
      setHistory(updatedHistory);
    }
  };

  const handleTopUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTopUpSubmitting(true);
    try {
      await walletService.topUp(topUpAmount, 'UPI · Instant');
      setIsTopUpOpen(false);
    } finally {
      setIsTopUpSubmitting(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SVG Gauge Math
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const currentSoc = activeSession ? activeSession.batteryPercentage : 0;
  const strokeDashoffset = circumference - (currentSoc / 100) * circumference;

  return (
    <div className="activity-page">
      <AppHeader title="Charging & Activity" />

      <main className="activity-content">
        {/* If session is charging: LIVE MONITOR */}
        {activeSession && activeSession.status === 'CHARGING' ? (
          <div className="live-session-container">
            <div className="live-badge-glow">
              <span className="live-pulse-ring" />
              <span>LIVE CHARGING SESSION</span>
            </div>

            <div className="soc-gauge-wrapper">
              <svg className="soc-svg" viewBox="0 0 180 180">
                <circle className="soc-track" cx="90" cy="90" r={radius} />
                <circle
                  className="soc-progress"
                  cx="90"
                  cy="90"
                  r={radius}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="soc-inner-info">
                <span className="soc-percentage">{activeSession.batteryPercentage}%</span>
                <span className="soc-label">Battery SoC</span>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '2px' }}>
                {activeSession.stationName}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                {activeSession.vehicleName} · {activeSession.chargerId} ({activeSession.powerKw} kW DC)
              </p>
            </div>

            <div className="live-stats-3col">
              <div className="live-stat-cell">
                <span className="live-stat-label">Energy</span>
                <span className="live-stat-val" style={{ color: 'var(--color-cyan)' }}>
                  {activeSession.energyDeliveredKwh} kWh
                </span>
              </div>
              <div className="live-stat-cell">
                <span className="live-stat-label">Duration</span>
                <span className="live-stat-val">{formatDuration(activeSession.durationSeconds)}</span>
              </div>
              <div className="live-stat-cell">
                <span className="live-stat-label">Current Cost</span>
                <span className="live-stat-val" style={{ color: 'var(--color-neon-green)' }}>
                  ₹{activeSession.currentCost.toFixed(2)}
                </span>
              </div>
            </div>

            <AppButton
              variant="danger"
              size="lg"
              fullWidth
              icon={<Square size={18} fill="currentColor" />}
              onClick={handleStopCharging}
            >
              Stop Charging Session
            </AppButton>
          </div>
        ) : (
          /* When NOT charging: Launcher & Wallet */
          <>
            {/* Quick Charge Launcher */}
            <div className="quick-charge-launcher">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={20} color="var(--color-neon-green)" />
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
                  Start Fast Charging
                </h2>
              </div>

              <div className="form-group">
                <label className="form-label">Select Charger Bay</label>
                <div className="form-input-wrapper">
                  <select
                    className="form-input"
                    value={selectedChargerId}
                    onChange={(e) => setSelectedChargerId(e.target.value)}
                    style={{ background: 'transparent', color: '#fff' }}
                  >
                    {CATALOG_CHARGERS.map((c) => (
                      <option key={c.chargerId} value={c.chargerId} style={{ background: '#071B32' }}>
                        {c.chargerId} — {c.stationName} ({c.powerKw}kW)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Select Vehicle</label>
                <div className="form-input-wrapper">
                  <select
                    className="form-input"
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    style={{ background: 'transparent', color: '#fff' }}
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id} style={{ background: '#071B32' }}>
                        {v.name} ({v.licensePlate})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <AppButton
                variant="primary"
                size="lg"
                fullWidth
                icon={<Zap size={18} />}
                onClick={handleStartFromSelector}
              >
                Connect & Begin Charging
              </AppButton>
            </div>

            {/* Wallet Card */}
            <div className="wallet-card">
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  Voltgrid Smart Wallet
                </span>
                <div className="wallet-balance-num">₹{walletBalance.toLocaleString('en-IN')}</div>
              </div>
              <AppButton
                variant="secondary"
                size="sm"
                icon={<Plus size={16} />}
                onClick={() => setIsTopUpOpen(true)}
              >
                Top Up
              </AppButton>
            </div>
          </>
        )}

        {/* Charging History */}
        <section style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <History size={18} color="var(--color-cyan)" />
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff' }}>Charging History</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {history.map((item) => (
              <div key={item.id} className="history-item-card">
                <div className="history-item-left">
                  <div className="history-icon-box">
                    <BatteryCharging size={20} />
                  </div>
                  <div>
                    <div className="history-station-name">{item.stationName}</div>
                    <div className="history-date">
                      {item.date} · {item.durationMinutes} mins · {item.vehicleName}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="history-cost">₹{item.totalCostINR.toFixed(2)}</div>
                  <div className="history-kwh">{item.energyConsumedKWh} kWh</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Top-Up Sheet Modal */}
      {isTopUpOpen && (
        <div className="modal-overlay" onClick={() => setIsTopUpOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title-row">
              <h3 className="modal-title">Recharge Voltgrid Wallet</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsTopUpOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleTopUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
                  Quick Amounts
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[500, 1000, 2000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className={`filter-chip ${topUpAmount === amt ? 'filter-chip--active' : ''}`}
                      style={{ textAlign: 'center', padding: '12px 0', fontSize: '14px' }}
                      onClick={() => setTopUpAmount(amt)}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <div
                  style={{
                    backgroundColor: 'var(--color-bg-deep)',
                    padding: '12px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <CreditCard size={20} color="var(--color-neon-green)" />
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>UPI · Instant Sandbox Mode</span>
                </div>
              </div>

              <AppButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isTopUpSubmitting}
                icon={<CheckCircle size={18} />}
              >
                Add ₹{topUpAmount} to Wallet
              </AppButton>
            </form>
          </div>
        </div>
      )}

      {/* Summary Receipt Modal */}
      {summaryData && (
        <div className="modal-overlay" onClick={() => setSummaryData(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <CheckCircle size={48} color="var(--color-neon-green)" style={{ marginBottom: '8px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>Charging Finished!</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Session receipt for {summaryData.stationName}
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-bg-deep)',
                padding: '16px',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                fontSize: '13px',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Energy Delivered:</span>
                <strong style={{ color: 'var(--color-cyan)' }}>{summaryData.energyDeliveredKwh} kWh</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Duration:</span>
                <strong>{summaryData.durationFormatted}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Battery SoC:</span>
                <strong style={{ color: 'var(--color-neon-green)' }}>{summaryData.finalBatteryPercentage}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #183C66', paddingTop: '8px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Total Cost:</span>
                <strong style={{ fontSize: '16px', color: 'var(--color-neon-green)' }}>
                  ₹{summaryData.totalCost.toFixed(2)}
                </strong>
              </div>
            </div>

            <AppButton variant="primary" size="lg" fullWidth onClick={() => setSummaryData(null)}>
              Done
            </AppButton>
          </div>
        </div>
      )}
    </div>
  );
};
