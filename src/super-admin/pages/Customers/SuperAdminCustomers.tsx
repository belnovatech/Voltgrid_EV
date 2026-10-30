import React, { useState, useEffect } from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { AreaAdminWorkflowBar } from '../../components/AreaAdminWorkflowBar/AreaAdminWorkflowBar';
import { superAdminDataService } from '../../services/superAdminDataService';
import { SuperAdminCustomer } from '../../types/superAdmin';

export const SuperAdminCustomers: React.FC = () => {
  const { filters, openCustomerModal } = useSuperAdmin();
  const [customers, setCustomers] = useState<SuperAdminCustomer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const list = await superAdminDataService.fetchCustomers({
          areaId: filters.selectedAreaId,
          adminId: filters.selectedAdminId,
          status: statusFilter,
          searchTerm: searchTerm,
        });
        setCustomers(list);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [filters.selectedAreaId, filters.selectedAdminId, statusFilter, searchTerm]);

  const formatINR = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const totalRegistered = customers.length;
  const activeCount = customers.filter((c) => c.status === 'Active').length;
  const pendingCount = customers.filter((c) => c.paymentStatus === 'Pending').length;
  const overdueCount = customers.filter((c) => c.paymentStatus === 'Overdue').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <AreaAdminWorkflowBar />

      {/* Customer Analytics KPI Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
        }}
      >
        <div className="sa-card" style={{ padding: '16px 20px' }}>
          <span className="sa-field-label">Filtered Customers</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
            {totalRegistered}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--sa-lime)' }}>
            {activeCount} Active Drivers
          </span>
        </div>

        <div className="sa-card" style={{ padding: '16px 20px' }}>
          <span className="sa-field-label">Pending Payments</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--sa-amber)', margin: '4px 0' }}>
            {pendingCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--sa-text-muted)' }}>
            Awaiting bank clearing
          </span>
        </div>

        <div className="sa-card" style={{ padding: '16px 20px' }}>
          <span className="sa-field-label">Overdue Debt</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--sa-rose)', margin: '4px 0' }}>
            {overdueCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--sa-text-muted)' }}>
            Requires admin follow-up
          </span>
        </div>

        <div className="sa-card" style={{ padding: '16px 20px' }}>
          <span className="sa-field-label">Driver Retention</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--sa-cyan)', margin: '4px 0' }}>
            94.6%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--sa-emerald)' }}>
            High repeat charging activity
          </span>
        </div>
      </div>

      {/* Customers Table */}
      <div className="sa-card">
        <div className="sa-card__header">
          <div>
            <h2 className="sa-card__title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sa-indigo)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              Registered EV Customers & Driver Ledger
            </h2>
            <p className="sa-card__subtitle">
              Click any customer row to open authorized profile, unmask privacy records, and audit session ledger
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
              <option value="Inactive">Inactive</option>
            </select>

            <input
              type="text"
              className="sa-input"
              style={{ width: '240px' }}
              placeholder="Search driver name, phone, plate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="sa-table-container">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Customer Name</th>
                <th>Registration Date</th>
                <th>Area / Hub</th>
                <th>Assigned Admin</th>
                <th>Status</th>
                <th className="is-numeric">Amount Paid</th>
                <th className="is-numeric">Outstanding</th>
                <th>Payment Status</th>
                <th>Last Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: '36px', color: 'var(--sa-text-muted)' }}>
                    Loading customer analytics...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: '36px', color: 'var(--sa-text-muted)' }}>
                    No customer accounts match the selected area, admin, or search criteria.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => openCustomerModal(c)}
                  >
                    <td>
                      <code style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '2px 6px', borderRadius: 4, color: 'var(--sa-cyan)' }}>
                        {c.id}
                      </code>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#ffffff' }}>{c.name}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--sa-text-muted)' }}>
                        {c.vehicleModel} · {c.vehiclePlate}
                      </div>
                    </td>
                    <td>{c.registrationDate}</td>
                    <td>{c.areaName}</td>
                    <td>
                      <span style={{ color: 'var(--sa-lime)', fontWeight: 600 }}>{c.assignedAdminName}</span>
                    </td>
                    <td>
                      <span className={`sa-status-badge sa-status-badge--${c.status.toLowerCase()}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="is-numeric" style={{ fontWeight: 800, color: 'var(--sa-lime)' }}>
                      {formatINR(c.totalAmountPaidINR)}
                    </td>
                    <td
                      className="is-numeric"
                      style={{
                        fontWeight: 700,
                        color: c.outstandingBalanceINR > 0 ? 'var(--sa-rose)' : 'var(--sa-text-dim)',
                      }}
                    >
                      {formatINR(c.outstandingBalanceINR)}
                    </td>
                    <td>
                      <span
                        className={`sa-status-badge ${
                          c.paymentStatus === 'Up to Date'
                            ? 'sa-status-badge--active'
                            : c.paymentStatus === 'Pending'
                            ? 'sa-status-badge--pending'
                            : 'sa-status-badge--suspended'
                        }`}
                      >
                        {c.paymentStatus}
                      </span>
                    </td>
                    <td>{c.lastPaymentDate}</td>
                    <td>
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCustomerModal(c);
                        }}
                      >
                        View Profile →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminCustomers;
