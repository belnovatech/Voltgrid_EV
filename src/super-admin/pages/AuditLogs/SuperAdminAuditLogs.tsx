import React, { useState, useEffect } from 'react';
import { superAdminAuditService } from '../../services/superAdminAuditService';
import { SuperAdminAuditLog } from '../../types/superAdmin';

export const SuperAdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<SuperAdminAuditLog[]>([]);
  const [moduleFilter, setModuleFilter] = useState<string>('ALL');
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const list = superAdminAuditService.getLogs({
      module: moduleFilter,
      actionType: actionTypeFilter,
      searchTerm,
    });
    setLogs(list);
  }, [moduleFilter, actionTypeFilter, searchTerm]);

  const handleExportAuditTrail = () => {
    const headers = [
      'Log ID',
      'Timestamp',
      'Actor',
      'Role',
      'Action',
      'Module',
      'Action Type',
      'Target Resource',
      'Details',
      'IP Address',
      'Status',
    ];

    const rows = logs.map((l) => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.actor}"`,
      `"${l.actorRole}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.module}"`,
      `"${l.actionType}"`,
      `"${(l.targetResource || '').replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.ipAddress}"`,
      `"${l.status}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `super_admin_audit_trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="sa-card">
        <div className="sa-card__header" style={{ flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h2 className="sa-card__title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sa-lime)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Immutable Executive Audit Trail
            </h2>
            <p className="sa-card__subtitle">
              Chronological cryptographic log of executive authorizations, financial adjustments, settlement changes, and security events
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              className="sa-select"
              style={{ width: '140px' }}
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
            >
              <option value="ALL">All Modules</option>
              <option value="Auth">Auth & Sessions</option>
              <option value="Settlements">Settlements</option>
              <option value="Customers">Customer Data</option>
              <option value="Admins">Admin Accounts</option>
              <option value="Reports">Report Exports</option>
              <option value="Security">Security Policies</option>
            </select>

            <select
              className="sa-select"
              style={{ width: '140px' }}
              value={actionTypeFilter}
              onChange={(e) => setActionTypeFilter(e.target.value)}
            >
              <option value="ALL">All Action Types</option>
              <option value="LOGIN">LOGIN</option>
              <option value="LOGOUT">LOGOUT</option>
              <option value="SETTLEMENT">SETTLEMENT</option>
              <option value="CUSTOMER_DATA">CUSTOMER_DATA</option>
              <option value="EXPORT">EXPORT</option>
              <option value="SECURITY">SECURITY</option>
            </select>

            <input
              type="text"
              className="sa-input"
              style={{ width: '220px' }}
              placeholder="Search actions, targets, details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button
              type="button"
              className="sa-btn sa-btn-secondary sa-btn-sm"
              onClick={handleExportAuditTrail}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export Audit CSV
            </button>
          </div>
        </div>

        <div className="sa-table-container">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Action & Details</th>
                <th>Module</th>
                <th>Target Resource</th>
                <th>IP Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--sa-text-muted)' }}>
                    No audit log records match the search filter.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <code style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '2px 6px', borderRadius: 4, color: 'var(--sa-cyan)' }}>
                        {log.id}
                      </code>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: '#fff' }}>{log.timestamp}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>{log.actor}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--sa-lime)' }}>{log.actorRole}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>{log.action}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--sa-text-muted)', marginTop: 2, maxWidth: '420px', whiteSpace: 'normal' }}>
                        {log.details}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.725rem',
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: 'rgba(255, 255, 255, 0.06)',
                          color: 'var(--sa-text)',
                        }}
                      >
                        {log.module}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--sa-text-dim)' }}>
                        {log.targetResource || '—'}
                      </span>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.75rem', color: 'var(--sa-text-muted)' }}>
                        {log.ipAddress}
                      </code>
                    </td>
                    <td>
                      <span
                        className={`sa-status-badge ${
                          log.status === 'Success'
                            ? 'sa-status-badge--success'
                            : log.status === 'Warning'
                            ? 'sa-status-badge--pending'
                            : 'sa-status-badge--suspended'
                        }`}
                      >
                        {log.status}
                      </span>
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

export default SuperAdminAuditLogs;
