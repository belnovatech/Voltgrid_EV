import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { AreaAdminWorkflowBar } from '../../components/AreaAdminWorkflowBar/AreaAdminWorkflowBar';

export const SuperAdminAreas: React.FC = () => {
  const navigate = useNavigate();
  const { areas, setSelectedAreaId } = useSuperAdmin();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredAreas = areas.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.assignedAdminNames.some((adm) => adm.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatINR = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const handleAreaClick = (areaId: string) => {
    setSelectedAreaId(areaId);
    navigate('/super-admin/dashboard');
  };

  const handleDrilldownAdmins = (areaId: string) => {
    setSelectedAreaId(areaId);
    navigate('/super-admin/admins');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <AreaAdminWorkflowBar />

      <div className="sa-card">
        <div className="sa-card__header">
          <div>
            <h2 className="sa-card__title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sa-cyan)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
              Regional Operational Areas & Grid Hubs
            </h2>
            <p className="sa-card__subtitle">
              Andhra Pradesh EV corridor telemetry, assigned operational admins, customer density, and revenue realization
            </p>
          </div>

          <div style={{ width: '280px' }}>
            <input
              type="text"
              className="sa-input"
              placeholder="Search areas, cities or admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="sa-table-container">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Area Name</th>
                <th>Area ID</th>
                <th>Assigned Admins</th>
                <th className="is-numeric">Total Customers</th>
                <th className="is-numeric">New Customers</th>
                <th className="is-numeric">Successful Collections</th>
                <th className="is-numeric">Business Receipts</th>
                <th className="is-numeric">Outstanding Settlements</th>
                <th>Active Admins</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAreas.map((area) => (
                <tr key={area.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: '#ffffff' }}>{area.name}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--sa-text-muted)' }}>
                      {area.city}, {area.state} · {area.totalChargers} Chargers
                    </div>
                  </td>
                  <td>
                    <code style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '2px 6px', borderRadius: 4, color: 'var(--sa-cyan)' }}>
                      {area.code}
                    </code>
                  </td>
                  <td>
                    {area.assignedAdminNames.map((admName, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-block',
                          background: 'rgba(154, 230, 0, 0.1)',
                          border: '1px solid rgba(154, 230, 0, 0.2)',
                          color: 'var(--sa-lime)',
                          padding: '2px 8px',
                          borderRadius: 'var(--sa-radius-pill)',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          marginRight: 4,
                        }}
                      >
                        {admName}
                      </span>
                    ))}
                  </td>
                  <td className="is-numeric" style={{ fontWeight: 700 }}>
                    {area.totalCustomers}
                  </td>
                  <td className="is-numeric" style={{ color: 'var(--sa-lime)' }}>
                    +{area.newCustomers}
                  </td>
                  <td className="is-numeric" style={{ fontWeight: 800, color: 'var(--sa-lime)' }}>
                    {formatINR(area.totalCustomerCollectionsINR)}
                  </td>
                  <td className="is-numeric" style={{ fontWeight: 700, color: 'var(--sa-emerald)' }}>
                    {formatINR(area.actualBusinessReceiptsINR)}
                  </td>
                  <td className="is-numeric" style={{ fontWeight: 700, color: area.outstandingSettlementsINR > 0 ? 'var(--sa-amber)' : 'var(--sa-text-dim)' }}>
                    {formatINR(area.outstandingSettlementsINR)}
                  </td>
                  <td>
                    <span className="sa-status-badge sa-status-badge--active">
                      {area.activeAdminsCount} Online
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        onClick={() => handleAreaClick(area.id)}
                        title="Analyze Area in Dashboard"
                      >
                        Analyze Area
                      </button>
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        onClick={() => handleDrilldownAdmins(area.id)}
                        title="View Area Admins"
                      >
                        Admins ({area.assignedAdminIds.length}) →
                      </button>
                    </div>
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

export default SuperAdminAreas;
