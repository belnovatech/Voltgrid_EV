import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { AreaAdminWorkflowBar } from '../../components/AreaAdminWorkflowBar/AreaAdminWorkflowBar';
import { superAdminDataService } from '../../services/superAdminDataService';
import { superAdminAuditService } from '../../services/superAdminAuditService';

export const SuperAdminAdmins: React.FC = () => {
  const navigate = useNavigate();
  const { admins, setSelectedAdminId, refreshData } = useSuperAdmin();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredAdmins = admins.filter((adm) => {
    const matchesSearch =
      adm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adm.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adm.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adm.phone.includes(searchTerm) ||
      adm.assignedAreaNames.some((n) => n.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || adm.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatINR = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const handleToggleStatus = async (adminId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await superAdminDataService.updateAdminStatus(adminId, nextStatus as any);
      superAdminAuditService.logAction({
        action: `Admin Account Status Changed: ${adminId}`,
        actionType: 'ADMIN_MOD',
        module: 'Admins',
        targetResource: adminId,
        details: `Changed account status from ${currentStatus} to ${nextStatus}.`,
      });
      await refreshData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <AreaAdminWorkflowBar />

      <div className="sa-card">
        <div className="sa-card__header">
          <div>
            <h2 className="sa-card__title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sa-lime)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Assigned Area Admins & Performance Analytics
            </h2>
            <p className="sa-card__subtitle">
              Manage operations managers, track customer collections, commission entitlements, and verified business settlements
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <select
              className="sa-select"
              style={{ width: '150px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Pending">Pending</option>
            </select>

            <input
              type="text"
              className="sa-input"
              style={{ width: '220px' }}
              placeholder="Search admin name, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="sa-table-container">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Admin ID</th>
                <th>Admin Name</th>
                <th>Assigned Area(s)</th>
                <th>Contact Info</th>
                <th>Account Status</th>
                <th className="is-numeric">Customers</th>
                <th className="is-numeric">New Drivers</th>
                <th className="is-numeric">Gross Collections</th>
                <th className="is-numeric">Verified Receipts</th>
                <th className="is-numeric">Outstanding</th>
                <th className="is-numeric">Commission</th>
                <th>Last Activity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((adm) => (
                <tr key={adm.id}>
                  <td>
                    <code style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '2px 6px', borderRadius: 4, color: 'var(--sa-lime)', fontWeight: 700 }}>
                      {adm.id}
                    </code>
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, color: '#ffffff' }}>{adm.name}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--sa-text-muted)' }}>
                      Joined {adm.joinedDate}
                    </div>
                  </td>
                  <td>
                    {adm.assignedAreaNames.map((areaName, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-block',
                          background: 'rgba(6, 182, 212, 0.1)',
                          border: '1px solid rgba(6, 182, 212, 0.2)',
                          color: 'var(--sa-cyan)',
                          padding: '2px 8px',
                          borderRadius: 'var(--sa-radius-pill)',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          marginRight: 4,
                        }}
                      >
                        {areaName}
                      </span>
                    ))}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', color: '#fff' }}>{adm.phone}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--sa-text-dim)' }}>{adm.email}</div>
                  </td>
                  <td>
                    <span className={`sa-status-badge sa-status-badge--${adm.status.toLowerCase()}`}>
                      {adm.status}
                    </span>
                  </td>
                  <td className="is-numeric" style={{ fontWeight: 700 }}>
                    {adm.totalCustomers}{' '}
                    <span style={{ fontSize: '0.7rem', color: 'var(--sa-text-muted)' }}>
                      ({adm.activeCustomers} act.)
                    </span>
                  </td>
                  <td className="is-numeric" style={{ color: 'var(--sa-lime)', fontWeight: 700 }}>
                    +{adm.newCustomers}
                  </td>
                  <td className="is-numeric" style={{ fontWeight: 800, color: 'var(--sa-lime)' }}>
                    {formatINR(adm.totalCustomerCollectionsINR)}
                  </td>
                  <td className="is-numeric" style={{ fontWeight: 700, color: 'var(--sa-emerald)' }}>
                    {formatINR(adm.actualBusinessReceiptsINR)}
                  </td>
                  <td className="is-numeric" style={{ fontWeight: 700, color: adm.outstandingSettlementINR > 0 ? 'var(--sa-amber)' : 'var(--sa-text-dim)' }}>
                    {formatINR(adm.outstandingSettlementINR)}
                  </td>
                  <td className="is-numeric" style={{ color: 'var(--sa-indigo)', fontWeight: 700 }}>
                    {formatINR(adm.totalCommissionEarnedINR)}{' '}
                    <span style={{ fontSize: '0.7rem', color: 'var(--sa-text-muted)' }}>
                      ({adm.commissionRatePercent}%)
                    </span>
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--sa-text-muted)' }}>
                    {adm.lastActivity}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'nowrap' }}>
                      <button
                        type="button"
                        className="sa-btn sa-btn-primary sa-btn-sm"
                        onClick={() => {
                          setSelectedAdminId(adm.id);
                          navigate('/super-admin/dashboard');
                        }}
                        title="Analyze Admin Performance"
                      >
                        Analyze
                      </button>
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        onClick={() => {
                          setSelectedAdminId(adm.id);
                          navigate('/super-admin/customers');
                        }}
                        title="View Customers for this Admin"
                      >
                        Customers
                      </button>
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        onClick={() => {
                          setSelectedAdminId(adm.id);
                          navigate('/super-admin/settlements');
                        }}
                        title="View Settlements for this Admin"
                      >
                        Settlements
                      </button>
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        style={{ color: adm.status === 'Active' ? 'var(--sa-rose)' : 'var(--sa-emerald)' }}
                        onClick={() => handleToggleStatus(adm.id, adm.status)}
                        title={adm.status === 'Active' ? 'Suspend Admin Access' : 'Activate Admin Access'}
                      >
                        {adm.status === 'Active' ? 'Suspend' : 'Activate'}
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

export default SuperAdminAdmins;
