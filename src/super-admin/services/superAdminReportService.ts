import { ReportType, WorkflowFilters } from '../types/superAdmin';
import { superAdminDataService } from './superAdminDataService';
import { superAdminAuditService } from './superAdminAuditService';

export interface ReportColumn {
  key: string;
  label: string;
  isNumeric?: boolean;
  isCurrency?: boolean;
}

export interface GeneratedReport {
  type: ReportType;
  title: string;
  generatedAt: string;
  filterSummary: string;
  columns: ReportColumn[];
  rows: Record<string, any>[];
  summaryTotals: Record<string, any>;
}

class SuperAdminReportService {
  public async generateReport(type: ReportType, filters: WorkflowFilters): Promise<GeneratedReport> {
    const areas = await superAdminDataService.fetchAreas();
    const admins = await superAdminDataService.fetchAdmins(filters.selectedAreaId);
    const customers = await superAdminDataService.fetchCustomers({
      areaId: filters.selectedAreaId,
      adminId: filters.selectedAdminId,
    });
    const transactions = await superAdminDataService.fetchTransactions({
      areaId: filters.selectedAreaId,
      adminId: filters.selectedAdminId,
    });
    const settlements = await superAdminDataService.fetchSettlements({
      areaId: filters.selectedAreaId,
      adminId: filters.selectedAdminId,
    });

    const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const areaName =
      filters.selectedAreaId !== 'ALL'
        ? areas.find((a) => a.id === filters.selectedAreaId)?.name || filters.selectedAreaId
        : 'All Regional Hubs';
    const adminName =
      filters.selectedAdminId !== 'ALL'
        ? admins.find((a) => a.id === filters.selectedAdminId)?.name || filters.selectedAdminId
        : 'All Area Admins';

    const filterSummary = `Area: ${areaName} | Admin: ${adminName} | Preset: ${filters.datePreset}`;

    let report: GeneratedReport;

    switch (type) {
      case 'admin_performance': {
        const columns: ReportColumn[] = [
          { key: 'adminId', label: 'Admin ID' },
          { key: 'name', label: 'Admin Name' },
          { key: 'assignedAreas', label: 'Assigned Areas' },
          { key: 'status', label: 'Status' },
          { key: 'totalCustomers', label: 'Customers', isNumeric: true },
          { key: 'totalCollections', label: 'Gross Collections (₹)', isCurrency: true },
          { key: 'businessReceipts', label: 'Receipts Verified (₹)', isCurrency: true },
          { key: 'commission', label: 'Commission (₹)', isCurrency: true },
          { key: 'outstanding', label: 'Outstanding Balance (₹)', isCurrency: true },
        ];
        const rows = admins.map((adm) => ({
          adminId: adm.id,
          name: adm.name,
          assignedAreas: adm.assignedAreaNames.join(', '),
          status: adm.status,
          totalCustomers: adm.totalCustomers,
          totalCollections: adm.totalCustomerCollectionsINR,
          businessReceipts: adm.actualBusinessReceiptsINR,
          commission: adm.totalCommissionEarnedINR,
          outstanding: adm.outstandingSettlementINR,
        }));
        const summaryTotals = {
          totalCustomers: rows.reduce((s, r) => s + r.totalCustomers, 0),
          totalCollections: rows.reduce((s, r) => s + r.totalCollections, 0),
          businessReceipts: rows.reduce((s, r) => s + r.businessReceipts, 0),
          commission: rows.reduce((s, r) => s + r.commission, 0),
          outstanding: rows.reduce((s, r) => s + r.outstanding, 0),
        };
        report = {
          type,
          title: 'Admin Operational & Financial Performance Report',
          generatedAt: nowStr,
          filterSummary,
          columns,
          rows,
          summaryTotals,
        };
        break;
      }

      case 'area_performance': {
        const columns: ReportColumn[] = [
          { key: 'code', label: 'Area Code' },
          { key: 'name', label: 'Area Name' },
          { key: 'city', label: 'City' },
          { key: 'totalChargers', label: 'Chargers', isNumeric: true },
          { key: 'totalCustomers', label: 'Total Customers', isNumeric: true },
          { key: 'collections', label: 'Collections (₹)', isCurrency: true },
          { key: 'receipts', label: 'Verified Receipts (₹)', isCurrency: true },
          { key: 'outstanding', label: 'Outstanding (₹)', isCurrency: true },
          { key: 'growthRate', label: 'Growth Rate (%)', isNumeric: true },
        ];
        const rows = areas.map((a) => ({
          code: a.code,
          name: a.name,
          city: a.city,
          totalChargers: a.totalChargers,
          totalCustomers: a.totalCustomers,
          collections: a.totalCustomerCollectionsINR,
          receipts: a.actualBusinessReceiptsINR,
          outstanding: a.outstandingSettlementsINR,
          growthRate: `${a.growthRatePercent}%`,
        }));
        const summaryTotals = {
          totalChargers: rows.reduce((s, r) => s + r.totalChargers, 0),
          totalCustomers: rows.reduce((s, r) => s + r.totalCustomers, 0),
          collections: rows.reduce((s, r) => s + r.collections, 0),
          receipts: rows.reduce((s, r) => s + r.receipts, 0),
          outstanding: rows.reduce((s, r) => s + r.outstanding, 0),
        };
        report = {
          type,
          title: 'Regional Area & Network Infrastructure Performance',
          generatedAt: nowStr,
          filterSummary,
          columns,
          rows,
          summaryTotals,
        };
        break;
      }

      case 'customer_growth': {
        const columns: ReportColumn[] = [
          { key: 'id', label: 'Customer ID' },
          { key: 'name', label: 'Customer Name' },
          { key: 'areaName', label: 'Area' },
          { key: 'adminName', label: 'Assigned Admin' },
          { key: 'registrationDate', label: 'Registration Date' },
          { key: 'status', label: 'Account Status' },
          { key: 'totalSessions', label: 'Total Sessions', isNumeric: true },
          { key: 'totalPaid', label: 'Amount Paid (₹)', isCurrency: true },
        ];
        const rows = customers.map((c) => ({
          id: c.id,
          name: c.name,
          areaName: c.areaName,
          adminName: c.assignedAdminName,
          registrationDate: c.registrationDate,
          status: c.status,
          totalSessions: c.totalSessions,
          totalPaid: c.totalAmountPaidINR,
        }));
        const summaryTotals = {
          totalCustomers: rows.length,
          totalSessions: rows.reduce((s, r) => s + r.totalSessions, 0),
          totalPaid: rows.reduce((s, r) => s + r.totalPaid, 0),
        };
        report = {
          type,
          title: 'Customer Onboarding & Growth Report',
          generatedAt: nowStr,
          filterSummary,
          columns,
          rows,
          summaryTotals,
        };
        break;
      }

      case 'customer_payments': {
        const columns: ReportColumn[] = [
          { key: 'txnId', label: 'Txn ID' },
          { key: 'reference', label: 'Reference No' },
          { key: 'date', label: 'Date & Time' },
          { key: 'customer', label: 'Customer' },
          { key: 'area', label: 'Area' },
          { key: 'admin', label: 'Admin' },
          { key: 'method', label: 'Method' },
          { key: 'amount', label: 'Amount (₹)', isCurrency: true },
          { key: 'status', label: 'Status' },
        ];
        const rows = transactions.map((t) => ({
          txnId: t.id,
          reference: t.referenceNumber,
          date: t.date,
          customer: t.customerName,
          area: t.areaName,
          admin: t.adminName,
          method: t.paymentMethod,
          amount: t.amountINR,
          status: t.transactionStatus,
        }));
        const summaryTotals = {
          totalPayments: rows.length,
          totalAmount: rows.reduce((s, r) => s + r.amount, 0),
        };
        report = {
          type,
          title: 'Customer Payments & Session Receipts Ledger',
          generatedAt: nowStr,
          filterSummary,
          columns,
          rows,
          summaryTotals,
        };
        break;
      }

      case 'admin_collections': {
        const columns: ReportColumn[] = [
          { key: 'adminId', label: 'Admin ID' },
          { key: 'adminName', label: 'Admin Name' },
          { key: 'areas', label: 'Hubs' },
          { key: 'grossCollections', label: 'Gross Collected (₹)', isCurrency: true },
          { key: 'commission', label: 'Commission Deducted (₹)', isCurrency: true },
          { key: 'netPayable', label: 'Net Payable to Business (₹)', isCurrency: true },
          { key: 'settled', label: 'Verified Settlements (₹)', isCurrency: true },
          { key: 'outstanding', label: 'Current Balance (₹)', isCurrency: true },
        ];
        const rows = admins.map((adm) => {
          const net = adm.totalCustomerCollectionsINR - adm.refundsAndReversalsINR - adm.totalCommissionEarnedINR;
          return {
            adminId: adm.id,
            adminName: adm.name,
            areas: adm.assignedAreaNames.join(', '),
            grossCollections: adm.totalCustomerCollectionsINR,
            commission: adm.totalCommissionEarnedINR,
            netPayable: net,
            settled: adm.actualBusinessReceiptsINR,
            outstanding: adm.outstandingSettlementINR,
          };
        });
        const summaryTotals = {
          grossCollections: rows.reduce((s, r) => s + r.grossCollections, 0),
          commission: rows.reduce((s, r) => s + r.commission, 0),
          netPayable: rows.reduce((s, r) => s + r.netPayable, 0),
          settled: rows.reduce((s, r) => s + r.settled, 0),
          outstanding: rows.reduce((s, r) => s + r.outstanding, 0),
        };
        report = {
          type,
          title: 'Area Admin Collections & Commission Audit',
          generatedAt: nowStr,
          filterSummary,
          columns,
          rows,
          summaryTotals,
        };
        break;
      }

      case 'business_settlements': {
        const columns: ReportColumn[] = [
          { key: 'batch', label: 'Batch No' },
          { key: 'admin', label: 'Admin' },
          { key: 'area', label: 'Area' },
          { key: 'period', label: 'Period' },
          { key: 'gross', label: 'Gross Collections (₹)', isCurrency: true },
          { key: 'net', label: 'Net Payable (₹)', isCurrency: true },
          { key: 'received', label: 'Receipts Verified (₹)', isCurrency: true },
          { key: 'balance', label: 'Outstanding Balance (₹)', isCurrency: true },
          { key: 'utr', label: 'Bank UTR' },
          { key: 'status', label: 'Status' },
        ];
        const rows = settlements.map((s) => ({
          batch: s.batchNumber,
          admin: s.adminName,
          area: s.areaName,
          period: `${s.periodStartDate} to ${s.periodEndDate}`,
          gross: s.grossCollectionsINR,
          net: s.netAmountPayableToBusinessINR,
          received: s.verifiedAmountReceivedINR,
          balance: s.outstandingBalanceINR,
          utr: s.paymentReferenceUTR || '—',
          status: s.status,
        }));
        const summaryTotals = {
          gross: rows.reduce((s, r) => s + r.gross, 0),
          net: rows.reduce((s, r) => s + r.net, 0),
          received: rows.reduce((s, r) => s + r.received, 0),
          balance: rows.reduce((s, r) => s + r.balance, 0),
        };
        report = {
          type,
          title: 'Verified Business Settlements & Bank Credit Register',
          generatedAt: nowStr,
          filterSummary,
          columns,
          rows,
          summaryTotals,
        };
        break;
      }

      case 'outstanding_balances': {
        const columns: ReportColumn[] = [
          { key: 'adminId', label: 'Admin ID' },
          { key: 'adminName', label: 'Admin Name' },
          { key: 'area', label: 'Area' },
          { key: 'outstandingSettlement', label: 'Outstanding Settlement (₹)', isCurrency: true },
          { key: 'pendingCustomers', label: 'Uncollected Customer Debt (₹)', isCurrency: true },
          { key: 'dueDate', label: 'Settlement Due Date' },
          { key: 'bankDetails', label: 'Settlement Bank' },
        ];
        const rows = admins
          .filter((a) => a.outstandingSettlementINR > 0 || a.pendingCustomerPaymentsINR > 0)
          .map((adm) => ({
            adminId: adm.id,
            adminName: adm.name,
            area: adm.assignedAreaNames[0] || 'State Hub',
            outstandingSettlement: adm.outstandingSettlementINR,
            pendingCustomers: adm.pendingCustomerPaymentsINR,
            dueDate: adm.settlementDueDate,
            bankDetails: `${adm.bankDetails.bankName} (${adm.bankDetails.accountNumberMasked})`,
          }));
        const summaryTotals = {
          outstandingSettlement: rows.reduce((s, r) => s + r.outstandingSettlement, 0),
          pendingCustomers: rows.reduce((s, r) => s + r.pendingCustomers, 0),
        };
        report = {
          type,
          title: 'Outstanding Business Settlements & Overdue Balances',
          generatedAt: nowStr,
          filterSummary,
          columns,
          rows,
          summaryTotals,
        };
        break;
      }

      case 'refunds_failed': {
        const columns: ReportColumn[] = [
          { key: 'txnId', label: 'Txn ID' },
          { key: 'date', label: 'Date' },
          { key: 'admin', label: 'Admin' },
          { key: 'customer', label: 'Customer' },
          { key: 'type', label: 'Type' },
          { key: 'amount', label: 'Amount (₹)', isCurrency: true },
          { key: 'status', label: 'Status' },
          { key: 'notes', label: 'Audit Reason / Error' },
        ];
        const rows = transactions
          .filter((t) => t.transactionStatus === 'Refunded' || t.transactionStatus === 'Failed' || t.type === 'Refund')
          .map((t) => ({
            txnId: t.id,
            date: t.date,
            admin: t.adminName,
            customer: t.customerName,
            type: t.type,
            amount: t.amountINR,
            status: t.transactionStatus,
            notes: t.notes || 'Transaction reversal / interrupted cycle',
          }));
        const summaryTotals = {
          totalCount: rows.length,
          totalAmount: rows.reduce((s, r) => s + r.amount, 0),
        };
        report = {
          type,
          title: 'Refunds, Chargebacks & Failed Charging Transactions',
          generatedAt: nowStr,
          filterSummary,
          columns,
          rows,
          summaryTotals,
        };
        break;
      }

      case 'monthly_financial':
      default: {
        const columns: ReportColumn[] = [
          { key: 'metric', label: 'Financial Reconciliation Component' },
          { key: 'oct2026', label: 'Current Period Oct 2026 (₹)', isCurrency: true },
          { key: 'sep2026', label: 'Prior Period Sep 2026 (₹)', isCurrency: true },
          { key: 'delta', label: 'Variance (%)' },
        ];
        const rows = [
          {
            metric: 'Gross Customer Collections (Wallets & Sessions)',
            oct2026: 2950000,
            sep2026: 2620000,
            delta: '+12.6%',
          },
          {
            metric: '(-) Refunds, Disputes & Connector Tripping Reversals',
            oct2026: 14700,
            sep2026: 18200,
            delta: '-19.2%',
          },
          {
            metric: '(-) Applicable Admin Regional Commissions (avg 4.9%)',
            oct2026: 143825,
            sep2026: 127500,
            delta: '+12.8%',
          },
          {
            metric: '(=) Net Amount Payable to Business',
            oct2026: 2791475,
            sep2026: 2474300,
            delta: '+12.8%',
          },
          {
            metric: '(-) Verified Business Settlements Received in Bank',
            oct2026: 2642510,
            sep2026: 2360000,
            delta: '+12.0%',
          },
          {
            metric: '(=) Net Outstanding Admin Settlements (Pending Transfer)',
            oct2026: 148965,
            sep2026: 114300,
            delta: '+30.3%',
          },
          {
            metric: 'Uncollected Customer Balances (Spot Debt)',
            oct2026: 28400,
            sep2026: 34100,
            delta: '-16.7%',
          },
        ];
        report = {
          type: 'monthly_financial',
          title: 'Monthly Executive Financial Reconciliation Ledger',
          generatedAt: nowStr,
          filterSummary,
          columns,
          rows,
          summaryTotals: {},
        };
        break;
      }
    }

    superAdminAuditService.logAction({
      action: `Generated Business Report: ${report.title}`,
      actionType: 'EXPORT',
      module: 'Reports',
      details: filterSummary,
    });

    return report;
  }

  /**
   * Export generated report to CSV RFC-4180
   */
  public exportReportToCsv(report: GeneratedReport): void {
    const headers = report.columns.map((c) => `"${c.label.replace(/"/g, '""')}"`).join(',');
    const dataLines = report.rows.map((row) => {
      return report.columns
        .map((col) => {
          const val = row[col.key] !== undefined && row[col.key] !== null ? String(row[col.key]) : '';
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(',');
    });

    const csvContent = [
      `"Eway to Your EVs - ${report.title.replace(/"/g, '""')}"`,
      `"Generated: ${report.generatedAt}"`,
      `"Scope: ${report.filterSummary.replace(/"/g, '""')}"`,
      '',
      headers,
      ...dataLines,
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${report.type}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    superAdminAuditService.logAction({
      action: `Exported CSV Report: ${report.title}`,
      actionType: 'EXPORT',
      module: 'Reports',
      details: `Downloaded CSV with ${report.rows.length} rows.`,
    });
  }
}

export const superAdminReportService = new SuperAdminReportService();
