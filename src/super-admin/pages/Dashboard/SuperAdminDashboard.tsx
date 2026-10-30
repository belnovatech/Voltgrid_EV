import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaAdminWorkflowBar } from '../../components/AreaAdminWorkflowBar/AreaAdminWorkflowBar';
import { SummaryCards } from '../../components/SummaryCards/SummaryCards';
import { BusinessInsights } from '../../components/BusinessInsights/BusinessInsights';
import { DashboardCharts } from '../../components/DashboardCharts/DashboardCharts';
import { useSuperAdmin } from '../../context/SuperAdminContext';

export const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { admins, areas, setSelectedAreaId, setSelectedAdminId } = useSuperAdmin();

  const formatINR = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Primary Workflow Selection Bar (Step 1 -> Step 5) */}
      <AreaAdminWorkflowBar />

      {/* 2. 12 Summary Metrics Cards */}
      <SummaryCards />

      {/* 3. Business Algorithmic Insights */}
      <BusinessInsights />

      {/* 4. Interactive Charts & Velocity Trends */}
      <DashboardCharts />

      {/* 5. Fast Operational Drilldown Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 20 }}>
        {/* Active Admins Quick Table */}
        <div className="sa-card">
          <div className="sa-card__header">
            <div>
              <h3 className="sa-card__title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sa-lime)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
                Active Regional Admins
              </h3>
              <p className="sa-card__subtitle">Click an admin to filter dashboard across all ledgers</p>
            </div>
            <button
              type="button"
              className="sa-btn sa-btn-secondary sa-btn-sm"
              onClick={() => navigate('/super-admin/admins')}
            >
              Manage Admins →
            </button>
          </div>

          <div className="sa-table-container">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Admin Name</th>
                  <th>Assigned Hub</th>
                  <th className="is-numeric">Customers</th>
                  <th className="is-numeric">Gross Collections</th>
                  <th className="is-numeric">Outstanding</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {admins.slice(0, 5).map((adm) => (
                  <tr
                    key={adm.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedAdminId(adm.id);
                    }}
                    title="Filter dashboard for this admin"
                  >
                    <td>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{adm.name}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--sa-text-dim)' }}>{adm.id}</div>
                    </td>
                    <td>{adm.assignedAreaNames[0] || 'State Hub'}</td>
                    <td className="is-numeric">{adm.totalCustomers}</td>
                    <td className="is-numeric" style={{ color: 'var(--sa-lime)', fontWeight: 700 }}>
                      {formatINR(adm.totalCustomerCollectionsINR)}
                    </td>
                    <td className="is-numeric" style={{ color: adm.outstandingSettlementINR > 0 ? 'var(--sa-amber)' : 'var(--sa-emerald)' }}>
                      {formatINR(adm.outstandingSettlementINR)}
                    </td>
                    <td>
                      <span className={`sa-status-badge sa-status-badge--${adm.status.toLowerCase()}`}>
                        {adm.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regional Hubs Overview */}
        <div className="sa-card">
          <div className="sa-card__header">
            <div>
              <h3 className="sa-card__title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sa-cyan)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
                Regional Areas & Hubs
              </h3>
              <p className="sa-card__subtitle">Click an area to isolate and drill down</p>
            </div>
            <button
              type="button"
              className="sa-btn sa-btn-secondary sa-btn-sm"
              onClick={() => navigate('/super-admin/areas')}
            >
              View All Areas →
            </button>
          </div>

          <div className="sa-table-container">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Area / City</th>
                  <th>Chargers</th>
                  <th className="is-numeric">Drivers</th>
                  <th className="is-numeric">Collections</th>
                  <th className="is-numeric">Receipts</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {areas.slice(0, 5).map((a) => (
                  <tr
                    key={a.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedAreaId(a.id)}
                    title="Filter dashboard for this area"
                  >
                    <td>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{a.name}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--sa-text-dim)' }}>
                        {a.code} · {a.city}
                      </div>
                    </td>
                    <td>{a.totalChargers} Fast DC</td>
                    <td className="is-numeric">{a.totalCustomers}</td>
                    <td className="is-numeric" style={{ color: 'var(--sa-lime)', fontWeight: 700 }}>
                      {formatINR(a.totalCustomerCollectionsINR)}
                    </td>
                    <td className="is-numeric" style={{ color: 'var(--sa-emerald)' }}>
                      {formatINR(a.actualBusinessReceiptsINR)}
                    </td>
                    <td>
                      <span className="sa-status-badge sa-status-badge--active">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
