import React, { useState, useEffect } from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { AreaAdminWorkflowBar } from '../../components/AreaAdminWorkflowBar/AreaAdminWorkflowBar';
import { superAdminReportService, GeneratedReport } from '../../services/superAdminReportService';
import { ReportType } from '../../types/superAdmin';

export const SuperAdminReports: React.FC = () => {
  const { filters } = useSuperAdmin();
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('admin_performance');
  const [reportData, setReportData] = useState<GeneratedReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const loadReport = async () => {
      setIsLoading(true);
      try {
        const res = await superAdminReportService.generateReport(selectedReportType, filters);
        setReportData(res);
      } finally {
        setIsLoading(false);
      }
    };
    loadReport();
  }, [selectedReportType, filters]);

  const reportOptions: { type: ReportType; label: string; desc: string }[] = [
    { type: 'admin_performance', label: '1. Admin Performance', desc: 'Collections, commissions, and customer counts by admin' },
    { type: 'area_performance', label: '2. Area Performance', desc: 'Regional infrastructure throughput and growth rates' },
    { type: 'customer_growth', label: '3. Customer Growth', desc: 'Driver registrations, vehicle models, and session volume' },
    { type: 'customer_payments', label: '4. Customer Payments', desc: 'Granular session charges, wallet topups, and methods' },
    { type: 'admin_collections', label: '5. Admin Collections', desc: 'Gross collected funds vs net business entitlement' },
    { type: 'business_settlements', label: '6. Business Settlements', desc: 'Bank UTR clearance records and verified credits' },
    { type: 'outstanding_balances', label: '7. Outstanding Balances', desc: 'Overdue admin tranches and uncollected driver debt' },
    { type: 'refunds_failed', label: '8. Refunds & Failed Payments', desc: 'Disputed sessions, connector trips, and chargebacks' },
    { type: 'monthly_financial', label: '9. Monthly Financial Summary', desc: 'Audited monthly reconciliation ledger and variances' },
  ];

  const handleExportCsv = () => {
    if (reportData) {
      superAdminReportService.exportReportToCsv(reportData);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredRows = (reportData?.rows || []).filter((row) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return Object.values(row).some((val) => String(val).toLowerCase().includes(term));
  });

  const formatValue = (val: any, col: any) => {
    if (val === undefined || val === null) return '—';
    if (col.isCurrency && typeof val === 'number') {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    }
    return String(val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <AreaAdminWorkflowBar />

      {/* Report Selection Strip */}
      <div className="sa-card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span className="sa-field-label">Select Authoritative Business Report (9 Standard Reports)</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--sa-lime)' }}>Strict Server Authorization Enforced</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 10,
          }}
        >
          {reportOptions.map((opt) => (
            <button
              key={opt.type}
              type="button"
              className={`sa-btn ${
                selectedReportType === opt.type ? 'sa-btn-primary' : 'sa-btn-secondary'
              }`}
              style={{
                justifyContent: 'flex-start',
                textAlign: 'left',
                padding: '10px 14px',
                height: 'auto',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
              onClick={() => setSelectedReportType(opt.type)}
            >
              <span style={{ fontWeight: 800 }}>{opt.label}</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 500, marginTop: 2 }}>
                {opt.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Report Results */}
      <div className="sa-card">
        <div className="sa-card__header" style={{ flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h2 className="sa-card__title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sa-lime)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              {reportData?.title || 'Business Report'}
            </h2>
            <p className="sa-card__subtitle">
              Generated at: <strong>{reportData?.generatedAt}</strong> · Scope: {reportData?.filterSummary}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              type="text"
              className="sa-input"
              style={{ width: '200px' }}
              placeholder="Search table rows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button
              type="button"
              className="sa-btn sa-btn-primary sa-btn-sm"
              onClick={handleExportCsv}
              disabled={isLoading || !reportData}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download CSV
            </button>

            <button
              type="button"
              className="sa-btn sa-btn-secondary sa-btn-sm"
              onClick={handlePrint}
              disabled={isLoading || !reportData}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print Report
            </button>
          </div>
        </div>

        {/* Report Table */}
        <div className="sa-table-container">
          <table className="sa-table">
            <thead>
              <tr>
                {reportData?.columns.map((col) => (
                  <th key={col.key} className={col.isNumeric || col.isCurrency ? 'is-numeric' : ''}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={reportData?.columns.length || 6} style={{ textAlign: 'center', padding: '36px', color: 'var(--sa-text-muted)' }}>
                    Generating verified report ledger...
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={reportData?.columns.length || 6} style={{ textAlign: 'center', padding: '36px', color: 'var(--sa-text-muted)' }}>
                    No records match the active criteria.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {reportData?.columns.map((col) => (
                      <td
                        key={col.key}
                        className={col.isNumeric || col.isCurrency ? 'is-numeric' : ''}
                        style={{
                          fontWeight: col.isCurrency ? 700 : undefined,
                          color: col.isCurrency ? 'var(--sa-lime)' : undefined,
                        }}
                      >
                        {formatValue(row[col.key], col)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>

            {/* Summary Totals Row */}
            {reportData && Object.keys(reportData.summaryTotals).length > 0 && (
              <tfoot>
                <tr style={{ background: 'var(--sa-bg-surface-elevated)', borderTop: '2px solid var(--sa-border-active)' }}>
                  {reportData.columns.map((col, idx) => {
                    const totalVal = reportData.summaryTotals[col.key];
                    if (idx === 0) {
                      return (
                        <td key={col.key} style={{ fontWeight: 800, color: '#fff' }}>
                          SUMMARY TOTALS:
                        </td>
                      );
                    }
                    if (totalVal !== undefined) {
                      return (
                        <td
                          key={col.key}
                          className="is-numeric"
                          style={{
                            fontWeight: 800,
                            color: col.isCurrency ? 'var(--sa-lime)' : '#ffffff',
                          }}
                        >
                          {formatValue(totalVal, col)}
                        </td>
                      );
                    }
                    return <td key={col.key}>—</td>;
                  })}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminReports;
