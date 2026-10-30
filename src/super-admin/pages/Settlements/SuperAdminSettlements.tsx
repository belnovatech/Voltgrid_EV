import React, { useState, useEffect } from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { AreaAdminWorkflowBar } from '../../components/AreaAdminWorkflowBar/AreaAdminWorkflowBar';
import { superAdminDataService } from '../../services/superAdminDataService';
import { SuperAdminSettlement } from '../../types/superAdmin';

export const SuperAdminSettlements: React.FC = () => {
  const { filters, metrics, openSettlementModal } = useSuperAdmin();
  const [settlements, setSettlements] = useState<SuperAdminSettlement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const list = await superAdminDataService.fetchSettlements({
          areaId: filters.selectedAreaId,
          adminId: filters.selectedAdminId,
          status: statusFilter,
        });
        setSettlements(list);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [filters.selectedAreaId, filters.selectedAdminId, statusFilter]);

  const formatINR = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const collections = metrics?.totalSuccessfulCustomerCollectionsINR || 0;
  const refunds = metrics?.refundsAndReversalsINR || 0;
  const commissions = metrics?.adminCommissionsINR || 0;
  const netPayable = collections - refunds - commissions;
  const verifiedReceipts = metrics?.actualBusinessReceiptsINR || 0;
  const outstandingSettlement = Math.max(0, netPayable - verifiedReceipts);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <AreaAdminWorkflowBar />

      {/* Financial Reconciliation Formula Card */}
      <div className="sa-card" style={{ borderLeft: '4px solid var(--sa-lime)' }}>
        <div className="sa-card__header">
          <div>
            <h2 className="sa-card__title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sa-lime)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Authoritative Business Reconciliation Engine
            </h2>
            <p className="sa-card__subtitle">
              Mathematical reconciliation of gross collections, contractual commissions, refunds, verified receipts, and outstanding debt
            </p>
          </div>
          <span className="sa-status-badge sa-status-badge--verified">
            Audit-Grade Model Active
          </span>
        </div>

        {/* Step-by-step formula breakdown */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            background: 'var(--sa-bg-surface-elevated)',
            padding: '20px',
            borderRadius: 'var(--sa-radius-md)',
            border: '1px solid var(--sa-border)',
          }}
        >
          {/* Card A: Customer Collections */}
          <div>
            <span className="sa-field-label">A. Customer Collections</span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--sa-lime)', marginTop: 4 }}>
              {formatINR(collections)}
            </div>
            <span style={{ fontSize: '0.725rem', color: 'var(--sa-text-dim)' }}>
              Gross driver payments
            </span>
          </div>

          {/* Card B: Refunds & Reversals */}
          <div>
            <span className="sa-field-label">B. (-) Refunds & Reversals</span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--sa-rose)', marginTop: 4 }}>
              -{formatINR(refunds)}
            </div>
            <span style={{ fontSize: '0.725rem', color: 'var(--sa-text-dim)' }}>
              Deducted trips & disputes
            </span>
          </div>

          {/* Card C: Admin Commission */}
          <div>
            <span className="sa-field-label">C. (-) Admin Commission</span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--sa-indigo)', marginTop: 4 }}>
              -{formatINR(commissions)}
            </div>
            <span style={{ fontSize: '0.725rem', color: 'var(--sa-text-dim)' }}>
              Contractual regional cut (4.5% - 5%)
            </span>
          </div>

          {/* Card D: Net Amount Payable */}
          <div>
            <span className="sa-field-label">D. (=) Net Payable to Business</span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--sa-cyan)', marginTop: 4 }}>
              {formatINR(netPayable)}
            </div>
            <span style={{ fontSize: '0.725rem', color: 'var(--sa-text-dim)' }}>
              A − B − C
            </span>
          </div>

          {/* Card E: Verified Receipts */}
          <div>
            <span className="sa-field-label">E. (-) Verified Bank Receipts</span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--sa-emerald)', marginTop: 4 }}>
              {formatINR(verifiedReceipts)}
            </div>
            <span style={{ fontSize: '0.725rem', color: 'var(--sa-text-dim)' }}>
              Received in current account
            </span>
          </div>

          {/* Card F: Outstanding Settlement */}
          <div>
            <span className="sa-field-label">F. (=) Outstanding Settlements</span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--sa-amber)', marginTop: 4 }}>
              {formatINR(outstandingSettlement)}
            </div>
            <span style={{ fontSize: '0.725rem', color: 'var(--sa-text-dim)' }}>
              D − E (Pending Transfer)
            </span>
          </div>
        </div>
      </div>

      {/* Settlement Batches Table */}
      <div className="sa-card">
        <div className="sa-card__header">
          <div>
            <h3 className="sa-card__title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sa-emerald)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              Regional Settlement Batches & Bank Credit Records
            </h3>
            <p className="sa-card__subtitle">
              Verify UTR reference numbers, approve bank credit reconciliation, and record immutable settlement adjustments
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <select
              className="sa-select"
              style={{ width: '160px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Processing">Processing</option>
            </select>
          </div>
        </div>

        <div className="sa-table-container">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Batch Number</th>
                <th>Admin Name</th>
                <th>Area / Hub</th>
                <th>Period</th>
                <th className="is-numeric">Gross Collections</th>
                <th className="is-numeric">Commission</th>
                <th className="is-numeric">Net Payable</th>
                <th className="is-numeric">Verified Receipts</th>
                <th className="is-numeric">Outstanding</th>
                <th>Bank UTR Reference</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={12} style={{ textAlign: 'center', padding: '36px', color: 'var(--sa-text-muted)' }}>
                    Loading settlement batches...
                  </td>
                </tr>
              ) : settlements.length === 0 ? (
                <tr>
                  <td colSpan={12} style={{ textAlign: 'center', padding: '36px', color: 'var(--sa-text-muted)' }}>
                    No settlement records found for this area or admin selection.
                  </td>
                </tr>
              ) : (
                settlements.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <code style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '2px 6px', borderRadius: 4, color: 'var(--sa-cyan)' }}>
                        {s.batchNumber}
                      </code>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#ffffff' }}>{s.adminName}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--sa-text-muted)' }}>{s.adminId}</div>
                    </td>
                    <td>{s.areaName}</td>
                    <td>
                      <span style={{ fontSize: '0.775rem', color: 'var(--sa-text-muted)' }}>
                        {s.periodStartDate} to {s.periodEndDate}
                      </span>
                    </td>
                    <td className="is-numeric" style={{ fontWeight: 800, color: 'var(--sa-lime)' }}>
                      {formatINR(s.grossCollectionsINR)}
                    </td>
                    <td className="is-numeric" style={{ color: 'var(--sa-indigo)' }}>
                      -{formatINR(s.commissionDeductedINR)}
                    </td>
                    <td className="is-numeric" style={{ fontWeight: 700, color: 'var(--sa-cyan)' }}>
                      {formatINR(s.netAmountPayableToBusinessINR)}
                    </td>
                    <td className="is-numeric" style={{ fontWeight: 700, color: 'var(--sa-emerald)' }}>
                      {formatINR(s.verifiedAmountReceivedINR)}
                    </td>
                    <td
                      className="is-numeric"
                      style={{
                        fontWeight: 800,
                        color: s.outstandingBalanceINR > 0 ? 'var(--sa-amber)' : 'var(--sa-emerald)',
                      }}
                    >
                      {formatINR(s.outstandingBalanceINR)}
                    </td>
                    <td>
                      {s.paymentReferenceUTR ? (
                        <span style={{ fontFamily: 'monospace', color: '#fff', fontSize: '0.8rem' }}>
                          {s.paymentReferenceUTR}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--sa-text-dim)', fontStyle: 'italic' }}>
                          Pending UTR
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`sa-status-badge ${
                          s.status === 'Verified'
                            ? 'sa-status-badge--verified'
                            : s.status === 'Pending Review'
                            ? 'sa-status-badge--pending'
                            : 'sa-status-badge--processing'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="sa-btn sa-btn-primary sa-btn-sm"
                        onClick={() => openSettlementModal(s)}
                        title="Verify or update remittance"
                      >
                        {s.outstandingBalanceINR === 0 ? 'View Ledger' : 'Verify Remittance'}
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

export default SuperAdminSettlements;
