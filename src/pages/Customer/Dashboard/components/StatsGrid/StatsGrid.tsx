import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerDashboardData } from '../../../../../types/customer';
import { formatCurrencyINR } from '../../../../../utils/dashboardHelpers';
import './StatsGrid.css';

interface StatsGridProps {
  data: CustomerDashboardData | null;
  isLoading?: boolean;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ data, isLoading = false }) => {
  const navigate = useNavigate();
  const walletBalance = data?.walletBalance ?? 1250;
  const activeSession = data?.activeSession;
  const lastCharging = data?.lastCharging;
  const totalEnergy = data?.totalEnergyThisMonthKWh ?? 148;

  return (
    <section className="pg-sgrid" aria-label="Charging and Wallet Metrics">
      {/* 1. Wallet Balance (Dark Card) */}
      <div
        className="pg-sgrid__card pg-sgrid__card--dark"
        onClick={() => navigate('/customer/wallet')}
        role="button"
        tabIndex={0}
        aria-label="View Wallet details"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            navigate('/customer/wallet');
          }
        }}
      >
        <div className="pg-sgrid__icon-wrap pg-sgrid__icon-wrap--dark" aria-hidden="true">
          <span className="pg-sgrid__rupee-sym">₹</span>
        </div>
        <div className="pg-sgrid__val">
          {isLoading ? '...' : formatCurrencyINR(walletBalance).replace('.00', '')}
        </div>
        <div className="pg-sgrid__label">Wallet Balance</div>
        <div className="pg-sgrid__status pg-sgrid__status--lime">Available</div>
      </div>

      {/* 2. Active Session */}
      <div
        className="pg-sgrid__card"
        onClick={() => navigate('/customer/charging')}
        role="button"
        tabIndex={0}
        aria-label="View Charging Session"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            navigate('/customer/charging');
          }
        }}
      >
        <div className="pg-sgrid__icon-wrap" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <div className="pg-sgrid__val">
          {isLoading ? '...' : activeSession ? 'Charging' : 'None'}
        </div>
        <div className="pg-sgrid__label">Active Session</div>
        <div className="pg-sgrid__sub">
          {activeSession ? `${activeSession.energyKWh} kWh · ${activeSession.batteryLevel}%` : 'No active charging'}
        </div>
      </div>

      {/* 3. Last Charging */}
      <div
        className="pg-sgrid__card"
        onClick={() => navigate('/customer/history')}
        role="button"
        tabIndex={0}
        aria-label="View Charging History"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            navigate('/customer/history');
          }
        }}
      >
        <div className="pg-sgrid__icon-wrap" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748b"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="6" width="14" height="12" rx="2" />
            <polygon points="22 8 16 12 22 16 22 8" />
          </svg>
        </div>
        <div className="pg-sgrid__val">
          {isLoading ? '...' : lastCharging ? `₹${lastCharging.amountINR}` : '—'}
        </div>
        <div className="pg-sgrid__label">Last Charging</div>
        <div className="pg-sgrid__sub">
          {lastCharging ? `${lastCharging.energyKWh} kWh · ${lastCharging.durationMin} min` : 'No charging history yet'}
        </div>
      </div>

      {/* 4. Total Energy */}
      <div
        className="pg-sgrid__card"
        onClick={() => navigate('/customer/history')}
        role="button"
        tabIndex={0}
        aria-label="View Energy Consumption History"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            navigate('/customer/history');
          }
        }}
      >
        <div className="pg-sgrid__icon-wrap" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ae600"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <div className="pg-sgrid__val">
          {isLoading ? '...' : `${totalEnergy} kWh`}
        </div>
        <div className="pg-sgrid__label">Total Energy</div>
        <div className="pg-sgrid__sub">This month</div>
      </div>
    </section>
  );
};
