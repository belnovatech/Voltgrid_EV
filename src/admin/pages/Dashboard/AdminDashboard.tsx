import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { AdminDashboardOverview } from '../../types/admin';
import './AdminDashboard.css';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminDashboardOverview | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [activeTooltipMonth, setActiveTooltipMonth] = useState<string>('Sep');

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const res = await adminService.getDashboardOverview();
      setData(res);
    } catch (err) {
      console.error('Failed to load admin overview', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }) +
          ' at ' +
          now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }).toLowerCase()
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // 12 Live Chargers Data
  const liveChargers = [
    { id: 'CH-001', status: 'Available', power: '120 kW · CCS2' },
    {
      id: 'CH-002',
      status: 'Charging',
      power: '60 kW · Type 2',
      driver: 'Bala Krishna',
      sessionInfo: '26.3 kWh  22m  ₹102',
    },
    {
      id: 'CH-003',
      status: 'Reserved',
      power: '150 kW · CCS2',
      note: 'Reserved slot active',
    },
    {
      id: 'CH-004',
      status: 'Maintenance',
      power: '50 kW · CHAdeMO',
      note: 'Under maintenance',
    },
    { id: 'CH-005', status: 'Available', power: '120 kW · CCS2' },
    { id: 'CH-006', status: 'Available', power: '60 kW · Type 2' },
    {
      id: 'CH-007',
      status: 'Charging',
      power: '120 kW · CCS2',
      driver: 'Bala Krishna',
      sessionInfo: '13.7 kWh  48m  ₹106',
    },
    { id: 'CH-008', status: 'Available', power: '60 kW · Type 2' },
    { id: 'CH-009', status: 'Available', power: '150 kW · CCS2' },
    { id: 'CH-010', status: 'Available', power: '50 kW · CHAdeMO' },
    { id: 'CH-011', status: 'Available', power: '120 kW · CCS2' },
    {
      id: 'CH-012',
      status: 'Charging',
      power: '60 kW · Type 2',
      driver: 'Bala Krishna',
      sessionInfo: '6.4 kWh  48m  ₹105',
    },
  ];

  // Zone Performance Bar Heights
  const zonePerformances = [
    { code: 'AP-Z01', percent: 68, color: '#a3e635' },
    { code: 'AP-Z02', percent: 53, color: '#a3e635' },
    { code: 'AP-Z03', percent: 72, color: '#06b6d4' },
    { code: 'AP-Z04', percent: 60, color: '#a3e635' },
    { code: 'AP-Z05', percent: 36, color: '#cbd5e1' },
    { code: 'AP-Z06', percent: 80, color: '#06b6d4' },
    { code: 'AP-Z07', percent: 24, color: '#cbd5e1' },
    { code: 'AP-Z08', percent: 64, color: '#a3e635' },
  ];

  // Zone Overview Table Data
  const zoneTableRows = [
    { code: 'AP-Z01', name: 'Vijayawada Central', city: 'Vijayawada', avail: 6, charging: 3, res: 1, maint: 0, rev: '₹42,800', status: 'Active' },
    { code: 'AP-Z02', name: 'Visakhapatnam Port', city: 'Visakhapatnam', avail: 4, charging: 5, res: 0, maint: 1, rev: '₹38,500', status: 'Active' },
    { code: 'AP-Z03', name: 'Tirupati East Hub', city: 'Tirupati', avail: 7, charging: 2, res: 1, maint: 0, rev: '₹51,200', status: 'Active' },
    { code: 'AP-Z04', name: 'Guntur Smart City', city: 'Guntur', avail: 5, charging: 4, res: 0, maint: 1, rev: '₹29,600', status: 'Active' },
    { code: 'AP-Z05', name: 'Nellore NH-16', city: 'Nellore', avail: 8, charging: 1, res: 1, maint: 0, rev: '₹18,900', status: 'Active' },
    { code: 'AP-Z06', name: 'Kurnool IT Park', city: 'Kurnool', avail: 3, charging: 6, res: 1, maint: 0, rev: '₹33,700', status: 'Active' },
  ];

  return (
    <div className="pg-admin-dashboard">
      {/* 1. ADMIN HEADER / LIVE INDICATOR */}
      <div className="pg-admin-dashboard__header">
        <div className="pg-admin-dashboard__header-left">
          <div className="pg-admin-dashboard__live-status">
            <span className="pg-admin-dashboard__live-dot" />
            <span className="pg-admin-dashboard__live-text">
              LIVE • {currentTime || '30 September 2026 at 3:02 pm'}
            </span>
          </div>
          <h1 className="pg-admin-dashboard__title">EV Operations Command Center</h1>
          <p className="pg-admin-dashboard__subtitle">
            Andhra Pradesh Charging Network · AP-Z01 to AP-Z08
          </p>
        </div>

        <button
          type="button"
          className={`pg-admin-dashboard__refresh-btn ${isRefreshing ? 'pg-admin-dashboard__refresh-btn--loading' : ''}`}
          onClick={loadData}
          disabled={isRefreshing}
          aria-label="Refresh Dashboard Metrics"
        >
          <svg
            className={`pg-admin-dashboard__refresh-icon ${isRefreshing ? 'pg-admin-spin' : ''}`}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {/* 2. TOP 6 KPI CARDS — ONE SINGLE ROW ON DESKTOP */}
      <div className="pg-admin-dashboard__primary-grid">
        {/* Card 1: Zones (Dark Navy Background with Lime Pin) */}
        <div
          className="pg-admin-dash-card pg-admin-dash-card--dark"
          onClick={() => navigate('/admin/zones')}
        >
          <div className="pg-admin-dash-card__top">
            <div className="pg-admin-dash-card__icon-badge pg-admin-dash-card__icon-badge--dark-zone">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
          </div>
          <div className="pg-admin-dash-card__number">{data?.totalZones ?? 8}</div>
          <div className="pg-admin-dash-card__label">Zones</div>
          <div className="pg-admin-dash-card__subtext">Andhra Pradesh</div>
        </div>

        {/* Card 2: Charging Points */}
        <div
          className="pg-admin-dash-card"
          onClick={() => navigate('/admin/charging-points')}
        >
          <div className="pg-admin-dash-card__top">
            <div className="pg-admin-dash-card__icon-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
          </div>
          <div className="pg-admin-dash-card__number">{data?.totalChargingPoints ?? 80}</div>
          <div className="pg-admin-dash-card__label">Charging Points</div>
          <div className="pg-admin-dash-card__subtext">8 zones × 10 pts</div>
        </div>

        {/* Card 3: Available */}
        <div
          className="pg-admin-dash-card"
          onClick={() => navigate('/admin/charging-points')}
        >
          <div className="pg-admin-dash-card__top">
            <div className="pg-admin-dash-card__icon-badge pg-admin-dash-card__icon-badge--available">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
          </div>
          <div className="pg-admin-dash-card__number">{data?.availablePoints ?? 49}</div>
          <div className="pg-admin-dash-card__label">Available</div>
          <div className="pg-admin-dash-card__subtext">61% utilization</div>
        </div>

        {/* Card 4: Charging */}
        <div
          className="pg-admin-dash-card"
          onClick={() => navigate('/admin/charging-sessions')}
        >
          <div className="pg-admin-dash-card__top">
            <div className="pg-admin-dash-card__icon-badge pg-admin-dash-card__icon-badge--charging">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
          </div>
          <div className="pg-admin-dash-card__number">{data?.chargingPoints ?? 23}</div>
          <div className="pg-admin-dash-card__label">Charging</div>
          <div className="pg-admin-dash-card__subtext">Active sessions</div>
        </div>

        {/* Card 5: Reserved */}
        <div
          className="pg-admin-dash-card"
          onClick={() => navigate('/admin/reservations')}
        >
          <div className="pg-admin-dash-card__top">
            <div className="pg-admin-dash-card__icon-badge pg-admin-dash-card__icon-badge--reserved">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
          </div>
          <div className="pg-admin-dash-card__number">{data?.reservedPoints ?? 5}</div>
          <div className="pg-admin-dash-card__label">Reserved</div>
          <div className="pg-admin-dash-card__subtext">Upcoming</div>
        </div>

        {/* Card 6: Maintenance */}
        <div
          className="pg-admin-dash-card"
          onClick={() => navigate('/admin/maintenance')}
        >
          <div className="pg-admin-dash-card__top">
            <div className="pg-admin-dash-card__icon-badge pg-admin-dash-card__icon-badge--maintenance">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
          </div>
          <div className="pg-admin-dash-card__number">{data?.maintenancePoints ?? 3}</div>
          <div className="pg-admin-dash-card__label">Maintenance</div>
          <div className="pg-admin-dash-card__subtext">Needs attention</div>
        </div>
      </div>

      {/* 3. SECONDARY FINANCIAL / OPERATIONAL 4 CARDS (ONE ROW ON DESKTOP) */}
      <div className="pg-admin-dashboard__financial-grid">
        {/* Card 1: Today Revenue */}
        <div className="pg-admin-dash-card pg-admin-dash-card--stat">
          <div className="pg-admin-dash-card__number pg-admin-dash-card__number--revenue">
            ₹{data?.todayRevenueINR ? data.todayRevenueINR.toLocaleString('en-IN') : '12,480'}
          </div>
          <div className="pg-admin-dash-card__label">Today Revenue</div>
          <div className="pg-admin-dash-card__subtext pg-admin-dash-card__subtext--growth">
            +{data?.todayRevenueGrowthPercent ?? 18}% vs yesterday
          </div>
        </div>

        {/* Card 2: Active Sessions */}
        <div className="pg-admin-dash-card pg-admin-dash-card--stat">
          <div className="pg-admin-dash-card__number pg-admin-dash-card__number--sessions">
            {data?.activeSessionsCount ?? 14}
          </div>
          <div className="pg-admin-dash-card__label">Active Sessions</div>
          <div className="pg-admin-dash-card__subtext">
            ₹{data?.activeSessionsLiveValueINR ? data.activeSessionsLiveValueINR.toLocaleString('en-IN') : '4,920'} running
          </div>
        </div>

        {/* Card 3: Energy Delivered */}
        <div className="pg-admin-dash-card pg-admin-dash-card--stat">
          <div className="pg-admin-dash-card__number">
            {data?.energyDeliveredTodayKWh ?? 892} <span className="pg-admin-dash-card__unit">kWh</span>
          </div>
          <div className="pg-admin-dash-card__label">Energy Delivered</div>
          <div className="pg-admin-dash-card__subtext">Today</div>
        </div>

        {/* Card 4: Monthly Revenue */}
        <div className="pg-admin-dash-card pg-admin-dash-card--stat">
          <div className="pg-admin-dash-card__number">₹1.56L</div>
          <div className="pg-admin-dash-card__label">Monthly Revenue</div>
          <div className="pg-admin-dash-card__subtext">Dec 2024</div>
        </div>
      </div>

      {/* 4. REVENUE TREND + VEHICLE CATEGORY */}
      <div className="pg-admin-dashboard__charts-grid">
        {/* Left: Revenue Trend */}
        <div className="pg-admin-chart-box">
          <div className="pg-admin-chart-box__header">
            <div>
              <h3 className="pg-admin-chart-box__title">Revenue Trend</h3>
              <p className="pg-admin-chart-box__subtitle">Last 6 months</p>
            </div>
            <div className="pg-admin-chart-box__growth-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2.5">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
          </div>

          <div className="pg-admin-trend-chart">
            {/* Y-Axis scale */}
            <div className="pg-admin-trend-chart__y-axis">
              <span>₹160k</span>
              <span>₹120k</span>
              <span>₹80k</span>
              <span>₹40k</span>
              <span>₹0k</span>
            </div>

            {/* SVG Plot Area */}
            <div className="pg-admin-trend-chart__plot-area">
              <svg
                className="pg-admin-trend-chart__svg"
                viewBox="0 0 600 180"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="pgRevenueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a3e635" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#a3e635" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="0" y1="20" x2="600" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="60" x2="600" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="140" x2="600" y2="140" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

                {/* Shaded Area */}
                <polygon
                  points="20,135 120,120 240,95 360,75 480,55 580,35 580,180 20,180"
                  fill="url(#pgRevenueGlow)"
                />

                {/* Upward Lime Trend Line */}
                <polyline
                  points="20,135 120,120 240,95 360,75 480,55 580,35"
                  fill="none"
                  stroke="#a3e635"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                <circle cx="20" cy="135" r="4" fill="#ffffff" stroke="#a3e635" strokeWidth="2.5" />
                <circle cx="120" cy="120" r="4" fill="#ffffff" stroke="#a3e635" strokeWidth="2.5" />
                <circle cx="240" cy="95" r="5" fill="#a3e635" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="360" cy="75" r="4" fill="#ffffff" stroke="#a3e635" strokeWidth="2.5" />
                <circle cx="480" cy="55" r="4" fill="#ffffff" stroke="#a3e635" strokeWidth="2.5" />
                <circle cx="580" cy="35" r="4" fill="#ffffff" stroke="#a3e635" strokeWidth="2.5" />

                {/* Sep Guideline */}
                <line x1="240" y1="10" x2="240" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />
              </svg>

              {/* September Tooltip from Screenshot */}
              <div className="pg-admin-trend-chart__tooltip" style={{ left: '38%', top: '48%' }}>
                <span className="pg-admin-trend-chart__tooltip-month">Sep</span>
                <span className="pg-admin-trend-chart__tooltip-rev">
                  Revenue : <strong style={{ color: '#84cc16' }}>₹1,08,700</strong>
                </span>
              </div>

              {/* X-Axis Months */}
              <div className="pg-admin-trend-chart__x-axis">
                <span className={activeTooltipMonth === 'Jul' ? 'active' : ''} onClick={() => setActiveTooltipMonth('Jul')}>Jul</span>
                <span className={activeTooltipMonth === 'Aug' ? 'active' : ''} onClick={() => setActiveTooltipMonth('Aug')}>Aug</span>
                <span className={activeTooltipMonth === 'Sep' ? 'active' : ''} onClick={() => setActiveTooltipMonth('Sep')}>Sep</span>
                <span className={activeTooltipMonth === 'Oct' ? 'active' : ''} onClick={() => setActiveTooltipMonth('Oct')}>Oct</span>
                <span className={activeTooltipMonth === 'Nov' ? 'active' : ''} onClick={() => setActiveTooltipMonth('Nov')}>Nov</span>
                <span className={activeTooltipMonth === 'Dec' ? 'active' : ''} onClick={() => setActiveTooltipMonth('Dec')}>Dec</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Vehicle Category (Pie Chart) */}
        <div className="pg-admin-chart-box">
          <div className="pg-admin-chart-box__header">
            <div>
              <h3 className="pg-admin-chart-box__title">Vehicle Category</h3>
              <p className="pg-admin-chart-box__subtitle">Session distribution</p>
            </div>
          </div>

          <div className="pg-admin-pie-container">
            {/* SVG Pie Chart matching Screenshot 2 */}
            <svg className="pg-admin-pie-svg" viewBox="0 0 200 200">
              {/* Cyan / Blue Slice (CAR ~56%) */}
              <path
                d="M 100 100 L 100 10 A 90 90 0 1 1 23 150 Z"
                fill="#00c8ff"
              />
              {/* Lime Green Slice (BIKE ~32%) */}
              <path
                d="M 100 100 L 23 150 A 90 90 0 0 1 15 80 Z"
                fill="#a3e635"
              />
              {/* Orange Slice (BUS ~12%) */}
              <path
                d="M 100 100 L 15 80 A 90 90 0 0 1 100 10 Z"
                fill="#ff9800"
              />
              <circle cx="100" cy="100" r="2" fill="#ffffff" />
            </svg>

            {/* Legend underneath */}
            <div className="pg-admin-pie-legend">
              <div className="pg-admin-pie-legend__row">
                <div className="pg-admin-pie-legend__left">
                  <span className="pg-admin-pie-legend__dot" style={{ backgroundColor: '#00c8ff' }} />
                  <span className="pg-admin-pie-legend__name">CAR</span>
                </div>
                <span className="pg-admin-pie-legend__val">342 sessions</span>
              </div>

              <div className="pg-admin-pie-legend__row">
                <div className="pg-admin-pie-legend__left">
                  <span className="pg-admin-pie-legend__dot" style={{ backgroundColor: '#a3e635' }} />
                  <span className="pg-admin-pie-legend__name">BIKE</span>
                </div>
                <span className="pg-admin-pie-legend__val">198 sessions</span>
              </div>

              <div className="pg-admin-pie-legend__row">
                <div className="pg-admin-pie-legend__left">
                  <span className="pg-admin-pie-legend__dot" style={{ backgroundColor: '#ff9800' }} />
                  <span className="pg-admin-pie-legend__name">BUS</span>
                </div>
                <span className="pg-admin-pie-legend__val">72 sessions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. ZONE PERFORMANCE BAR CHART */}
      <div className="pg-admin-zone-perf-card">
        <div className="pg-admin-zone-perf-card__header">
          <div>
            <h3 className="pg-admin-zone-perf-card__title">Zone Performance</h3>
            <p className="pg-admin-zone-perf-card__subtitle">Utilization across all zones</p>
          </div>
          <button
            type="button"
            className="pg-admin-zone-perf-card__link"
            onClick={() => navigate('/admin/zones')}
          >
            Manage Zones &gt;
          </button>
        </div>

        <div className="pg-admin-zone-bar-chart">
          {/* Y-Axis */}
          <div className="pg-admin-zone-bar-chart__y-axis">
            <span>80%</span>
            <span>60%</span>
            <span>40%</span>
            <span>20%</span>
            <span>0%</span>
          </div>

          {/* Bar Columns */}
          <div className="pg-admin-zone-bar-chart__bars">
            {zonePerformances.map((z) => (
              <div key={z.code} className="pg-admin-zone-bar-col">
                <div className="pg-admin-zone-bar-col__track">
                  <div
                    className="pg-admin-zone-bar-col__fill"
                    style={{
                      height: `${z.percent}%`,
                      backgroundColor: z.color,
                    }}
                  />
                </div>
                <span className="pg-admin-zone-bar-col__label">{z.code}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. LIVE CHARGER STATUS (FIRST 12 CHARGERS) */}
      <div className="pg-admin-chargers-section">
        <div className="pg-admin-chargers-section__header">
          <div>
            <h3 className="pg-admin-chargers-section__title">Live Charger Status</h3>
            <p className="pg-admin-chargers-section__subtitle">
              Real-time monitoring · First 12 chargers shown
            </p>
          </div>
          <button
            type="button"
            className="pg-admin-chargers-section__link"
            onClick={() => navigate('/admin/charging-points')}
          >
            View All 80 &gt;
          </button>
        </div>

        {/* 4-column desktop grid */}
        <div className="pg-admin-chargers-grid">
          {liveChargers.map((c) => {
            let statusClass = 'available';
            if (c.status === 'Charging') statusClass = 'charging';
            if (c.status === 'Reserved') statusClass = 'reserved';
            if (c.status === 'Maintenance') statusClass = 'maintenance';

            return (
              <div
                key={c.id}
                className={`pg-admin-charger-box pg-admin-charger-box--${statusClass}`}
                onClick={() => navigate('/admin/charging-points')}
              >
                <div className="pg-admin-charger-box__top">
                  <span className="pg-admin-charger-box__code">{c.id}</span>
                  <span className={`pg-admin-charger-box__badge pg-admin-charger-box__badge--${statusClass}`}>
                    ● {c.status}
                  </span>
                </div>

                <div className="pg-admin-charger-box__power">{c.power}</div>

                {c.driver && (
                  <div className="pg-admin-charger-box__driver-info">
                    <div className="pg-admin-charger-box__driver-name">{c.driver}</div>
                    <div className="pg-admin-charger-box__session-info">{c.sessionInfo}</div>
                  </div>
                )}

                {c.note && (
                  <div className={`pg-admin-charger-box__note pg-admin-charger-box__note--${statusClass}`}>
                    {c.note}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. ZONE OVERVIEW TABLE (SCREENSHOT 5) */}
      <div className="pg-admin-zone-overview-card">
        <div className="pg-admin-zone-overview-card__header">
          <h3 className="pg-admin-zone-overview-card__title">Zone Overview</h3>
          <button
            type="button"
            className="pg-admin-zone-overview-card__link"
            onClick={() => navigate('/admin/zones')}
          >
            View all zones &rarr;
          </button>
        </div>

        <div className="pg-admin-zone-table-wrap">
          <table className="pg-admin-zone-table">
            <thead>
              <tr>
                <th>ZONE</th>
                <th>CITY</th>
                <th>AVAILABLE</th>
                <th>CHARGING</th>
                <th>RESERVED</th>
                <th>MAINT.</th>
                <th>REVENUE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {zoneTableRows.map((row) => (
                <tr key={row.code}>
                  <td>
                    <div className="pg-admin-zone-cell">
                      <span className="pg-admin-zone-cell__code">{row.code}</span>
                      <span className="pg-admin-zone-cell__name">{row.name}</span>
                    </div>
                  </td>
                  <td>{row.city}</td>
                  <td>
                    <span className="pg-admin-num-pill pg-admin-num-pill--green">{row.avail}</span>
                  </td>
                  <td>
                    <span className="pg-admin-num-pill pg-admin-num-pill--blue">{row.charging}</span>
                  </td>
                  <td>
                    <span className="pg-admin-num-pill pg-admin-num-pill--orange">{row.res}</span>
                  </td>
                  <td>
                    <span className="pg-admin-num-pill pg-admin-num-pill--orange">{row.maint}</span>
                  </td>
                  <td className="pg-admin-zone-rev-cell">{row.rev}</td>
                  <td>
                    <span className="pg-admin-status-pill pg-admin-status-pill--active">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
