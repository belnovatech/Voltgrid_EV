export interface SuperAdminArea {
  id: string; // e.g. 'AP-Z01'
  code: string; // 'AP-Z01'
  name: string; // 'Vijayawada Central'
  city: string;
  state: string;
  totalChargers: number;
  assignedAdminIds: string[];
  assignedAdminNames: string[];
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  totalCustomerCollectionsINR: number;
  actualBusinessReceiptsINR: number;
  outstandingSettlementsINR: number;
  activeAdminsCount: number;
  growthRatePercent: number;
  status: 'Active' | 'Degraded' | 'Offline';
}

export interface SuperAdminAdmin {
  id: string; // e.g. 'ADM-AP01'
  name: string;
  email: string;
  phone: string;
  avatar: string;
  assignedAreaIds: string[];
  assignedAreaNames: string[];
  status: 'Active' | 'Suspended' | 'Pending';
  commissionRatePercent: number; // e.g. 5.0%
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  totalCustomerCollectionsINR: number;
  actualBusinessReceiptsINR: number;
  outstandingSettlementINR: number;
  totalCommissionEarnedINR: number;
  pendingCustomerPaymentsINR: number;
  refundsAndReversalsINR: number;
  settlementDueDate: string;
  bankDetails: {
    bankName: string;
    accountNumberMasked: string;
    ifsc: string;
  };
  lastActivity: string;
  joinedDate: string;
}

export interface SuperAdminCustomer {
  id: string; // e.g. 'CUST-1001'
  name: string;
  phone: string;
  email: string;
  areaId: string;
  areaName: string;
  assignedAdminId: string;
  assignedAdminName: string;
  registrationDate: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  totalAmountPaidINR: number;
  outstandingBalanceINR: number;
  lastPaymentDate: string;
  vehicleModel: string;
  vehiclePlate: string;
  totalSessions: number;
  energyConsumedKWh: number;
  paymentStatus: 'Up to Date' | 'Pending' | 'Overdue';
}

export interface SuperAdminTransaction {
  id: string; // e.g. 'TXN-5001'
  referenceNumber: string;
  date: string;
  isoDate: string;
  adminId: string;
  adminName: string;
  areaId: string;
  areaName: string;
  customerId: string;
  customerName: string;
  amountINR: number;
  type: 'Collection' | 'Charging Session' | 'Wallet Topup' | 'Refund' | 'Reversal';
  paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Wallet';
  transactionStatus: 'Success' | 'Pending' | 'Failed' | 'Refunded' | 'Reversed';
  settlementStatus: 'Settled' | 'Pending Settlement' | 'In Escrow' | 'Non-Settled';
  adminCommissionINR: number;
  netPayableToBusinessINR: number;
  settlementDueDate: string;
  notes?: string;
  settlementBatchId?: string;
}

export interface SuperAdminSettlement {
  id: string; // e.g. 'STL-2024-001'
  batchNumber: string;
  adminId: string;
  adminName: string;
  areaId: string;
  areaName: string;
  periodStartDate: string;
  periodEndDate: string;
  grossCollectionsINR: number;
  refundsDeductedINR: number;
  commissionDeductedINR: number;
  otherAdjustmentsINR: number;
  netAmountPayableToBusinessINR: number;
  verifiedAmountReceivedINR: number;
  outstandingBalanceINR: number;
  status: 'Verified' | 'Pending Review' | 'Disputed' | 'Processing';
  paymentReferenceUTR?: string;
  settlementDate?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface SuperAdminDashboardMetrics {
  totalAreas: number;
  totalAdmins: number;
  activeAdmins: number;
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  totalSuccessfulCustomerCollectionsINR: number;
  actualBusinessReceiptsINR: number;
  outstandingAdminSettlementsINR: number;
  pendingCustomerPaymentsINR: number;
  refundsAndReversalsINR: number;
  adminCommissionsINR: number;
  // Period comparisons vs previous period
  periodComparison: {
    collectionsGrowthPercent: number;
    receiptsGrowthPercent: number;
    customerGrowthPercent: number;
    settlementChangePercent: number;
  };
}

export interface SuperAdminAuditLog {
  id: string;
  timestamp: string;
  isoDate: string;
  actor: string;
  actorRole: string;
  action: string;
  actionType: 'LOGIN' | 'LOGOUT' | 'SECURITY' | 'SETTLEMENT' | 'CUSTOMER_DATA' | 'ADMIN_MOD' | 'EXPORT';
  module: 'Auth' | 'Settlements' | 'Admins' | 'Customers' | 'Reports' | 'Security';
  targetResource?: string;
  details: string;
  ipAddress: string;
  status: 'Success' | 'Failed' | 'Warning';
}

export type ReportType =
  | 'admin_performance'
  | 'area_performance'
  | 'customer_growth'
  | 'customer_payments'
  | 'admin_collections'
  | 'business_settlements'
  | 'outstanding_balances'
  | 'refunds_failed'
  | 'monthly_financial';

export interface WorkflowFilters {
  selectedAreaId: string; // 'ALL' or specific area ID
  selectedAdminId: string; // 'ALL' or specific admin ID
  startDate: string;
  endDate: string;
  datePreset: '7D' | '30D' | '90D' | 'YTD' | 'CUSTOM';
  searchTerm: string;
}
