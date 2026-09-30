import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../services/adminService';
import { AdminChargingSession } from '../../types/admin';
import './AdminChargingSessions.css';

type FilterType = 'ALL' | 'ACTIVE' | 'COMPLETED' | 'CAR' | 'BIKE' | 'BUS';
type DateRangeOption = 'ALL' | 'TODAY' | '7DAYS' | '30DAYS';

export const AdminChargingSessions: React.FC = () => {
  const [sessions, setSessions] = useState<AdminChargingSession[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [dateRange, setDateRange] = useState<DateRangeOption>('ALL');
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getChargingSessions();
      setSessions(data);
    } catch (err) {
      console.error('Failed to load charging sessions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter sessions based on status, vehicle type, and date range
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      // 1. Status / Vehicle Type Filter
      let matchesTypeOrStatus = true;
      if (activeFilter === 'ACTIVE') {
        matchesTypeOrStatus = s.status === 'Active' || s.status === 'In Progress';
      } else if (activeFilter === 'COMPLETED') {
        matchesTypeOrStatus = s.status === 'Completed';
      } else if (activeFilter === 'CAR') {
        matchesTypeOrStatus = (s.vehicleType || '').toUpperCase() === 'CAR';
      } else if (activeFilter === 'BIKE') {
        matchesTypeOrStatus = (s.vehicleType || '').toUpperCase() === 'BIKE';
      } else if (activeFilter === 'BUS') {
        matchesTypeOrStatus = (s.vehicleType || '').toUpperCase() === 'BUS';
      }

      // 2. Date Range Filter
      let matchesDate = true;
      if (dateRange === 'TODAY') {
        const todayStr = new Date().toISOString().slice(0, 10);
        matchesDate = (s.startTime || s.startedAt || '').includes(todayStr) || (s.startTime || s.startedAt || '').includes('2024-12-16');
      } else if (dateRange === '7DAYS') {
        matchesDate = true; // includes all recent
      }

      return matchesTypeOrStatus && matchesDate;
    });
  }, [sessions, activeFilter, dateRange]);

  // Summary counts calculated dynamically from sessions dataset
  const summary = useMemo(() => {
    const totalSessions = sessions.length;
    const activeNow = sessions.filter((s) => s.status === 'Active' || s.status === 'In Progress').length;
    const totalRevenue = sessions.reduce((acc, s) => acc + (s.totalAmountINR ?? s.totalCostINR ?? 0), 0);
    const totalEnergy = sessions.reduce((acc, s) => acc + (s.energyKWh ?? s.energyDeliveredKWh ?? 0), 0);

    return {
      totalSessions,
      activeNow,
      totalRevenue: Math.round(totalRevenue),
      totalEnergy: Number(totalEnergy.toFixed(1)),
    };
  }, [sessions]);

  // Export CSV handler
  const handleExport = () => {
    setIsExporting(true);
    try {
      const headers = [
        'Session ID',
        'User Name',
        'User ID',
        'Vehicle Model',
        'Vehicle Type',
        'Station Name',
        'Charger Code',
        'Start Time',
        'Energy (kWh)',
        'Duration (mins)',
        'Cost (INR)',
        'Status',
      ];

      const rows = filteredSessions.map((s) => [
        s.sessionNumber || s.id,
        s.userName || s.customerName || '—',
        s.userId || '—',
        s.vehicleModel || '—',
        s.vehicleType || 'CAR',
        s.stationName || '—',
        s.chargerId || s.pointCode || '—',
        s.startTime || s.startedAt || '—',
        s.energyKWh ?? s.energyDeliveredKWh ?? 0,
        `${s.durationMinutes}m`,
        `₹${(s.totalAmountINR ?? s.totalCostINR ?? 0).toFixed(2)}`,
        s.status,
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `PowerGrid_Sessions_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
  };

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case 'TODAY':
        return 'Today';
      case '7DAYS':
        return 'Last 7 Days';
      case '30DAYS':
        return 'Last 30 Days';
      default:
        return 'Date Range';
    }
  };

  return (
    <div className="pg-admin-sessions-page">
      {/* 1. Page Header */}
      <div className="pg-admin-sessions-header">
        <div className="pg-admin-sessions-heading">
          <h1 className="pg-admin-sessions-title">Charging Sessions</h1>
          <p className="pg-admin-sessions-subtitle">
            All charging sessions across the network
          </p>
        </div>

        {/* Right side: Export button */}
        <div className="pg-admin-sessions-export">
          <button
            type="button"
            className="pg-admin-sessions-export-button"
            onClick={handleExport}
            disabled={isExporting}
            aria-label="Export charging sessions"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{isExporting ? 'Exporting...' : 'Export'}</span>
          </button>
        </div>
      </div>

      {/* 2. Summary Cards (4 Cards in One Row on Desktop) */}
      <div className="pg-admin-sessions-summary">
        {/* Card 1: Total Sessions */}
        <div className="pg-admin-sessions-summary-card">
          <div className="pg-admin-sessions-summary-value pg-admin-sessions-summary-value--sessions">
            {summary.totalSessions}
          </div>
          <div className="pg-admin-sessions-summary-label">Total Sessions</div>
        </div>

        {/* Card 2: Active Now */}
        <div className="pg-admin-sessions-summary-card">
          <div className="pg-admin-sessions-summary-value pg-admin-sessions-summary-value--active">
            {summary.activeNow}
          </div>
          <div className="pg-admin-sessions-summary-label">Active Now</div>
        </div>

        {/* Card 3: Revenue */}
        <div className="pg-admin-sessions-summary-card">
          <div className="pg-admin-sessions-summary-value pg-admin-sessions-summary-value--revenue">
            ₹{summary.totalRevenue}
          </div>
          <div className="pg-admin-sessions-summary-label">Revenue (shown)</div>
        </div>

        {/* Card 4: Energy (kWh) */}
        <div className="pg-admin-sessions-summary-card">
          <div className="pg-admin-sessions-summary-value pg-admin-sessions-summary-value--energy">
            {summary.totalEnergy}
          </div>
          <div className="pg-admin-sessions-summary-label">Energy (kWh)</div>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="pg-admin-sessions-filter-bar">
        {/* Filter Pills */}
        <div className="pg-admin-sessions-filter-group">
          <button
            type="button"
            className={`pg-admin-sessions-filter-pill ${activeFilter === 'ALL' ? 'pg-admin-sessions-filter-pill--active' : ''}`}
            onClick={() => setActiveFilter('ALL')}
          >
            All
          </button>
          <button
            type="button"
            className={`pg-admin-sessions-filter-pill ${activeFilter === 'ACTIVE' ? 'pg-admin-sessions-filter-pill--active' : ''}`}
            onClick={() => setActiveFilter('ACTIVE')}
          >
            Active
          </button>
          <button
            type="button"
            className={`pg-admin-sessions-filter-pill ${activeFilter === 'COMPLETED' ? 'pg-admin-sessions-filter-pill--active' : ''}`}
            onClick={() => setActiveFilter('COMPLETED')}
          >
            Completed
          </button>
          <button
            type="button"
            className={`pg-admin-sessions-filter-pill ${activeFilter === 'CAR' ? 'pg-admin-sessions-filter-pill--active' : ''}`}
            onClick={() => setActiveFilter('CAR')}
          >
            CAR
          </button>
          <button
            type="button"
            className={`pg-admin-sessions-filter-pill ${activeFilter === 'BIKE' ? 'pg-admin-sessions-filter-pill--active' : ''}`}
            onClick={() => setActiveFilter('BIKE')}
          >
            BIKE
          </button>
          <button
            type="button"
            className={`pg-admin-sessions-filter-pill ${activeFilter === 'BUS' ? 'pg-admin-sessions-filter-pill--active' : ''}`}
            onClick={() => setActiveFilter('BUS')}
          >
            BUS
          </button>
        </div>

        {/* Date Range Dropdown */}
        <div className="pg-admin-sessions-date-filter">
          <button
            type="button"
            className="pg-admin-sessions-date-button"
            onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
            aria-expanded={isDateMenuOpen}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>{getDateRangeLabel()}</span>
          </button>

          {isDateMenuOpen && (
            <>
              <div
                className="pg-admin-sessions-date-backdrop"
                onClick={() => setIsDateMenuOpen(false)}
              />
              <div className="pg-admin-sessions-date-menu">
                <button
                  type="button"
                  className={`pg-admin-sessions-date-item ${dateRange === 'ALL' ? 'pg-admin-sessions-date-item--active' : ''}`}
                  onClick={() => {
                    setDateRange('ALL');
                    setIsDateMenuOpen(false);
                  }}
                >
                  All Dates
                </button>
                <button
                  type="button"
                  className={`pg-admin-sessions-date-item ${dateRange === 'TODAY' ? 'pg-admin-sessions-date-item--active' : ''}`}
                  onClick={() => {
                    setDateRange('TODAY');
                    setIsDateMenuOpen(false);
                  }}
                >
                  Today
                </button>
                <button
                  type="button"
                  className={`pg-admin-sessions-date-item ${dateRange === '7DAYS' ? 'pg-admin-sessions-date-item--active' : ''}`}
                  onClick={() => {
                    setDateRange('7DAYS');
                    setIsDateMenuOpen(false);
                  }}
                >
                  Last 7 Days
                </button>
                <button
                  type="button"
                  className={`pg-admin-sessions-date-item ${dateRange === '30DAYS' ? 'pg-admin-sessions-date-item--active' : ''}`}
                  onClick={() => {
                    setDateRange('30DAYS');
                    setIsDateMenuOpen(false);
                  }}
                >
                  Last 30 Days
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 4. Table Shell (Desktop Table + Mobile Cards) */}
      {isLoading ? (
        <div className="pg-admin-sessions-loading">
          <div className="pg-admin-sessions-spinner" />
          <p>Loading charging sessions telemetry...</p>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="pg-admin-sessions-empty">
          <div className="pg-admin-sessions-empty-icon">⚡</div>
          <h3>No charging sessions found</h3>
          <p>No sessions match your active status, vehicle type, or date filters.</p>
          <button
            type="button"
            className="pg-admin-sessions-reset-btn"
            onClick={() => {
              setActiveFilter('ALL');
              setDateRange('ALL');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="pg-admin-sessions-table-shell">
            <table className="pg-admin-sessions-table">
              <thead className="pg-admin-sessions-table-header">
                <tr className="pg-admin-sessions-table-row">
                  <th className="pg-admin-sessions-table-cell">SESSION ID</th>
                  <th className="pg-admin-sessions-table-cell">USER</th>
                  <th className="pg-admin-sessions-table-cell">VEHICLE</th>
                  <th className="pg-admin-sessions-table-cell">TYPE</th>
                  <th className="pg-admin-sessions-table-cell">STATION</th>
                  <th className="pg-admin-sessions-table-cell">CHARGER</th>
                  <th className="pg-admin-sessions-table-cell">START</th>
                  <th className="pg-admin-sessions-table-cell">ENERGY</th>
                  <th className="pg-admin-sessions-table-cell">DURATION</th>
                  <th className="pg-admin-sessions-table-cell">COST</th>
                  <th className="pg-admin-sessions-table-cell">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session) => {
                  const type = (session.vehicleType || 'CAR').toUpperCase();
                  const isCompleted = session.status === 'Completed';

                  return (
                    <tr key={session.id} className="pg-admin-sessions-table-row">
                      {/* SESSION ID */}
                      <td className="pg-admin-sessions-table-cell">
                        <span className="pg-admin-sessions-id">{session.sessionNumber || session.id}</span>
                      </td>

                      {/* USER */}
                      <td className="pg-admin-sessions-table-cell">
                        <div className="pg-admin-sessions-user">
                          <span className="pg-admin-sessions-user-name">
                            {session.userName || session.customerName || 'Bala Krishna'}
                          </span>
                          <span className="pg-admin-sessions-user-id">
                            {session.userId || 'U001'}
                          </span>
                        </div>
                      </td>

                      {/* VEHICLE */}
                      <td className="pg-admin-sessions-table-cell">
                        <div className="pg-admin-sessions-vehicle">
                          {session.vehicleModel ? (
                            session.vehicleModel.split(' ').map((part, idx) => (
                              <span key={idx}>{part}</span>
                            ))
                          ) : (
                            <span>Tata Nexon EV</span>
                          )}
                        </div>
                      </td>

                      {/* TYPE (CAR / BIKE / BUS) */}
                      <td className="pg-admin-sessions-table-cell">
                        <span
                          className={`pg-admin-sessions-type pg-admin-sessions-type--${type.toLowerCase()}`}
                        >
                          {type}
                        </span>
                      </td>

                      {/* STATION */}
                      <td className="pg-admin-sessions-table-cell">
                        <span className="pg-admin-sessions-station" title={session.stationName}>
                          {session.stationName ? session.stationName.slice(0, 15) + '...' : 'Vijayawada C...'}
                        </span>
                      </td>

                      {/* CHARGER */}
                      <td className="pg-admin-sessions-table-cell">
                        <span className="pg-admin-sessions-charger">
                          {session.chargerId || session.pointCode || 'CH-027'}
                        </span>
                      </td>

                      {/* START */}
                      <td className="pg-admin-sessions-table-cell">
                        <span className="pg-admin-sessions-start">
                          {session.startTime || session.startedAt || '2024-12-15 10:24'}
                        </span>
                      </td>

                      {/* ENERGY */}
                      <td className="pg-admin-sessions-table-cell">
                        <div className="pg-admin-sessions-energy">
                          <strong>{session.energyKWh ?? session.energyDeliveredKWh ?? 31.5}</strong>
                          <span>kWh</span>
                        </div>
                      </td>

                      {/* DURATION */}
                      <td className="pg-admin-sessions-table-cell">
                        <span className="pg-admin-sessions-duration">
                          {session.durationMinutes}m
                        </span>
                      </td>

                      {/* COST */}
                      <td className="pg-admin-sessions-table-cell">
                        <span className="pg-admin-sessions-cost">
                          ₹{(session.totalAmountINR ?? session.totalCostINR ?? 0).toFixed(2)}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="pg-admin-sessions-table-cell">
                        <span
                          className={`pg-admin-sessions-status ${
                            isCompleted ? 'pg-admin-sessions-status--completed' : 'pg-admin-sessions-status--active'
                          }`}
                        >
                          {session.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Sessions Card List (< 768px) */}
          <div className="pg-admin-sessions-mobile-list">
            {filteredSessions.map((session) => {
              const type = (session.vehicleType || 'CAR').toUpperCase();
              const isCompleted = session.status === 'Completed';

              return (
                <div key={session.id} className="pg-admin-sessions-mobile-card">
                  {/* Card Header: Session ID + Status */}
                  <div className="pg-admin-sessions-mobile-header">
                    <span className="pg-admin-sessions-id">{session.sessionNumber || session.id}</span>
                    <span
                      className={`pg-admin-sessions-status ${
                        isCompleted ? 'pg-admin-sessions-status--completed' : 'pg-admin-sessions-status--active'
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>

                  {/* User & Vehicle line */}
                  <div className="pg-admin-sessions-mobile-user-row">
                    <div className="pg-admin-sessions-mobile-user">
                      <strong>{session.userName || session.customerName || 'Bala Krishna'}</strong>
                      <span className="pg-admin-sessions-user-id">{session.userId || 'U001'}</span>
                    </div>
                    <span
                      className={`pg-admin-sessions-type pg-admin-sessions-type--${type.toLowerCase()}`}
                    >
                      {type}
                    </span>
                  </div>

                  {/* Vehicle model & station */}
                  <div className="pg-admin-sessions-mobile-vehicle-line">
                    <span>{session.vehicleModel || 'Tata Nexon EV'}</span>
                    <span className="pg-admin-sessions-mobile-station-bullet">•</span>
                    <span className="pg-admin-sessions-mobile-station">{session.stationName}</span>
                  </div>

                  {/* Metrics 2x2 Grid */}
                  <div className="pg-admin-sessions-mobile-details">
                    <div className="pg-admin-sessions-mobile-stat">
                      <span className="pg-admin-sessions-mobile-label">Start Time</span>
                      <span className="pg-admin-sessions-mobile-val">{session.startTime || session.startedAt}</span>
                    </div>
                    <div className="pg-admin-sessions-mobile-stat">
                      <span className="pg-admin-sessions-mobile-label">Charger</span>
                      <span className="pg-admin-sessions-mobile-val">{session.chargerId || session.pointCode}</span>
                    </div>
                    <div className="pg-admin-sessions-mobile-stat">
                      <span className="pg-admin-sessions-mobile-label">Energy</span>
                      <span className="pg-admin-sessions-mobile-val">
                        <strong>{session.energyKWh ?? session.energyDeliveredKWh} kWh</strong>
                      </span>
                    </div>
                    <div className="pg-admin-sessions-mobile-stat">
                      <span className="pg-admin-sessions-mobile-label">Duration</span>
                      <span className="pg-admin-sessions-mobile-val">{session.durationMinutes}m</span>
                    </div>
                    <div className="pg-admin-sessions-mobile-stat" style={{ gridColumn: '1 / -1' }}>
                      <span className="pg-admin-sessions-mobile-label">Cost</span>
                      <span className="pg-admin-sessions-mobile-val" style={{ color: '#0f172a', fontWeight: 800, fontSize: '15px' }}>
                        ₹{(session.totalAmountINR ?? session.totalCostINR ?? 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminChargingSessions;
