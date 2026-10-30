import { SuperAdminAuditLog } from '../types/superAdmin';

const AUDIT_STORAGE_KEY = 'vg_super_admin_audit_logs_v1';

const INITIAL_AUDIT_LOGS: SuperAdminAuditLog[] = [
  {
    id: 'AUD-901',
    timestamp: '2026-10-28 14:45:10',
    isoDate: '2026-10-28T14:45:10.000Z',
    actor: 'Super Admin Executive',
    actorRole: 'SUPER_ADMIN',
    action: 'Executive Session Initialized',
    actionType: 'LOGIN',
    module: 'Auth',
    targetResource: 'System Console',
    details: 'Authenticated via 256-bit hash key from authorized subnet (192.168.0.5)',
    ipAddress: '192.168.0.5',
    status: 'Success',
  },
  {
    id: 'AUD-902',
    timestamp: '2026-10-27 18:20:00',
    isoDate: '2026-10-27T18:20:00.000Z',
    actor: 'Super Admin Executive',
    actorRole: 'SUPER_ADMIN',
    action: 'Verified Business Settlement Batch',
    actionType: 'SETTLEMENT',
    module: 'Settlements',
    targetResource: 'STL-2024-001 (Ravi Kumar Varma - AP-Z01)',
    details: 'UTR #SBIN0048192801 verified for ₹3,45,000. Reconciled with bank credit.',
    ipAddress: '192.168.0.5',
    status: 'Success',
  },
  {
    id: 'AUD-903',
    timestamp: '2026-10-26 11:15:32',
    isoDate: '2026-10-26T11:15:32.000Z',
    actor: 'Super Admin Executive',
    actorRole: 'SUPER_ADMIN',
    action: 'Customer Sensitive PII Unmasked',
    actionType: 'CUSTOMER_DATA',
    module: 'Customers',
    targetResource: 'CUST-1001 (Bala Krishna)',
    details: 'Phone and billing address temporarily decrypted for dispute investigation.',
    ipAddress: '192.168.0.5',
    status: 'Success',
  },
  {
    id: 'AUD-904',
    timestamp: '2026-10-25 16:30:15',
    isoDate: '2026-10-25T16:30:15.000Z',
    actor: 'Super Admin Executive',
    actorRole: 'SUPER_ADMIN',
    action: 'Exported Financial Reconciliation Report',
    actionType: 'EXPORT',
    module: 'Reports',
    targetResource: 'Monthly Financial Summary (Oct 2026)',
    details: 'Exported encrypted CSV containing 8 regional zone summaries.',
    ipAddress: '192.168.0.5',
    status: 'Success',
  },
];

class SuperAdminAuditService {
  private getStoredLogs(): SuperAdminAuditLog[] {
    try {
      const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
        return INITIAL_AUDIT_LOGS;
      }
      return JSON.parse(raw) as SuperAdminAuditLog[];
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  }

  private saveLogs(logs: SuperAdminAuditLog[]): void {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to persist audit log', e);
    }
  }

  public getLogs(filter?: {
    module?: string;
    actionType?: string;
    searchTerm?: string;
    startDate?: string;
    endDate?: string;
  }): SuperAdminAuditLog[] {
    let logs = this.getStoredLogs();

    if (!filter) return logs;

    if (filter.module && filter.module !== 'ALL') {
      logs = logs.filter((l) => l.module === filter.module);
    }

    if (filter.actionType && filter.actionType !== 'ALL') {
      logs = logs.filter((l) => l.actionType === filter.actionType);
    }

    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.action.toLowerCase().includes(term) ||
          l.details.toLowerCase().includes(term) ||
          (l.targetResource && l.targetResource.toLowerCase().includes(term)) ||
          l.actor.toLowerCase().includes(term)
      );
    }

    if (filter.startDate) {
      logs = logs.filter((l) => l.isoDate >= filter.startDate!);
    }

    if (filter.endDate) {
      logs = logs.filter((l) => l.isoDate <= filter.endDate!);
    }

    return logs;
  }

  public logAction(entry: {
    actor?: string;
    action: string;
    actionType: SuperAdminAuditLog['actionType'];
    module: SuperAdminAuditLog['module'];
    targetResource?: string;
    details: string;
    ipAddress?: string;
    status?: 'Success' | 'Failed' | 'Warning';
  }): SuperAdminAuditLog {
    const logs = this.getStoredLogs();
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const newLog: SuperAdminAuditLog = {
      id: `AUD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: formatted,
      isoDate: now.toISOString(),
      actor: entry.actor || 'Super Admin Executive',
      actorRole: 'SUPER_ADMIN',
      action: entry.action,
      actionType: entry.actionType,
      module: entry.module,
      targetResource: entry.targetResource,
      details: entry.details,
      ipAddress: entry.ipAddress || '192.168.0.5',
      status: entry.status || 'Success',
    };

    logs.unshift(newLog);
    // Keep last 500 audit entries
    const trimmed = logs.slice(0, 500);
    this.saveLogs(trimmed);
    return newLog;
  }

  public clearAllLogs(): void {
    localStorage.removeItem(AUDIT_STORAGE_KEY);
  }
}

export const superAdminAuditService = new SuperAdminAuditService();
