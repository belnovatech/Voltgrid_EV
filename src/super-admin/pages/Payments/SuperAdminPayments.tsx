import React, { useState, useEffect } from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { AreaAdminWorkflowBar } from '../../components/AreaAdminWorkflowBar/AreaAdminWorkflowBar';
import { superAdminDataService } from '../../services/superAdminDataService';
import { superAdminAuditService } from '../../services/superAdminAuditService';
import { SuperAdminTransaction } from '../../types/superAdmin';

export const SuperAdminPayments: React.FC = () => {
  const { filters } = useSuperAdmin();
  const [transactions, setTransactions] = useState<SuperAdminTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const list = await superAdminDataService.fetchTransactions({
          areaId: filters.selectedAreaId,
          adminId: filters.selectedAdminId,
          status: statusFilter,
          searchTerm: searchTerm,
        });
        setTransactions(list);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [filters.selectedAreaId, filters.selectedAdminId, statusFilter, searchTerm]);

  const filteredTxns = transactions.filter((t) => {
    const matchesMethod = methodFilter === 'ALL' || t.paymentMethod === methodFilter;
    return matchesMethod;
  });

  const formatINR = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const handleExportCsv = () => {
    const headers = [
      'Transaction ID',
      'Reference Number',
      'Date',
      'Customer',
      'Assigned Admin',
      'Area',
      'Type',
      'Amount (INR)',
      'Payment Method',
      'Transaction Status',
      'Settlement Status',
      'Settlement Due Date',
    ];

    const rows = filteredTxns.map((t) => [
      `"${t.id}"`,
      `"${t.referenceNumber}"`,
      `"${t.date}"`,
      `"${t.customerName}"`,
      `"${t.adminName}"`,
      `"${t.areaName}"`,
      `"${t.type}"`,
      `"${t.amountINR}"`,
      `"${t.paymentMethod}"`,
      `"${t.transactionStatus}"`,
      `"${t.settlementStatus}"`,
      `"${t.settlementDueDate}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `customer_payments_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    superAdminAuditService.logAction({
      action: 'Exported Financial Transactions CSV',
      actionType: 'EXPORT',
      module: 'Reports',
      details: `Exported ${filteredTxns.length} payment records.`,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <AreaAdminWorkflowBar />

      <div className="sa-card">
        <div className="sa-card__header">
          <div>
            <h2 className="sa-card__title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sa-lime)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              Customer Collections & Financial Transactions Ledger
            </h2>
            <p className="sa-card__subtitle">
              Auditable records of charging sessions, wallet topups, and payment reversals across regional admin zones
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              className="sa-select"
              style={{ width: '140px' }}
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
            >
              <option value="ALL">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="Card">Debit/Credit Card</option>
              <option value="Net Banking">Net Banking / RTGS</option>
              <option value="Wallet">Smart Wallet</option>
            </select>

            <select
              className="sa-select"
              style={{ width: '140px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
              <option value="Failed">Failed</option>
            </select>

            <input
              type="text"
              className="sa-input"
              style={{ width: '220px' }}
              placeholder="Search reference, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button
              type="button"
              className="sa-btn sa-btn-secondary sa-btn-sm"
              onClick={handleExportCsv}
              title="Download CSV report"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        <div className="sa-table-container">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Reference No</th>
                <th>Date & Time</th>
                <th>Customer</th>
                <th>Assigned Admin</th>
                <th>Area / Hub</th>
                <th>Type</th>
                <th className="is-numeric">Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Settlement Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={12} style={{ textAlign: 'center', padding: '36px', color: 'var(--sa-text-muted)' }}>
                    Loading financial transactions...
                  </td>
                </tr>
              ) : filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan={12} style={{ textAlign: 'center', padding: '36px', color: 'var(--sa-text-muted)' }}>
                    No financial transaction records match the active filters.
                  </td>
                </tr>
              ) : (
                filteredTxns.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <code style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '2px 6px', borderRadius: 4, color: 'var(--sa-cyan)' }}>
                        {t.id}
                      </code>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{t.referenceNumber}</div>
                    </td>
                    <td>{t.date}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>{t.customerName}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--sa-text-dim)' }}>{t.customerId}</div>
                    </td>
                    <td>
                      <span style={{ color: 'var(--sa-lime)', fontWeight: 600 }}>{t.adminName}</span>
                    </td>
                    <td>{t.areaName}</td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: t.type === 'Refund' ? 'var(--sa-rose)' : 'var(--sa-text)' }}>
                        {t.type}
                      </span>
                    </td>
                    <td
                      className="is-numeric"
                      style={{
                        fontWeight: 800,
                        color: t.type === 'Refund' ? 'var(--sa-rose)' : 'var(--sa-lime)',
                      }}
                    >
                      {t.type === 'Refund' ? `-${formatINR(t.amountINR)}` : formatINR(t.amountINR)}
                    </td>
                    <td>
                      <span style={{ color: 'var(--sa-text-muted)', fontWeight: 600 }}>{t.paymentMethod}</span>
                    </td>
                    <td>
                      <span
                        className={`sa-status-badge ${
                          t.transactionStatus === 'Success'
                            ? 'sa-status-badge--success'
                            : t.transactionStatus === 'Pending'
                            ? 'sa-status-badge--pending'
                            : t.transactionStatus === 'Refunded'
                            ? 'sa-status-badge--refunded'
                            : 'sa-status-badge--failed'
                        }`}
                      >
                        {t.transactionStatus}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`sa-status-badge ${
                          t.settlementStatus === 'Settled'
                            ? 'sa-status-badge--verified'
                            : t.settlementStatus === 'Pending Settlement'
                            ? 'sa-status-badge--pending'
                            : 'sa-status-badge--suspended'
                        }`}
                      >
                        {t.settlementStatus}
                      </span>
                    </td>
                    <td>{t.settlementDueDate}</td>
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

export default SuperAdminPayments;
