export interface AdminZone {
  id: string;
  code: string;
  name: string;
  address?: string;
  city: string;
  state: string;
  totalChargers: number;
  availableChargers: number;
  chargingCount: number;
  reservedCount?: number;
  maintenanceCount: number;
  powerCapacityKw: number;
  currentLoadKw: number;
  todayRevenueINR: number;
  operatingHours?: string;
  contactNumber?: string;
  status: 'Active' | 'Online' | 'Degraded' | 'Offline' | 'Inactive';
}

export interface AdminChargingPoint {
  id: string;
  pointCode?: string;
  stationName: string;
  zoneCode: string;
  zoneName?: string;
  city?: string;
  type?: string;
  chargerType?: string;
  connectorType: string;
  powerKw: number;
  status: 'Available' | 'Charging' | 'Reserved' | 'Maintenance';
  ratePerKWh?: number;
  utilizationPercent?: number;
  lastPingTime?: string;
  chargerNumber?: number | string;
  ocppId?: string;
  activeSession?: {
    sessionId: string;
    vehiclePlate: string;
    vehicleModel: string;
    energyDeliveredKWh: number;
    durationMinutes: number;
    currentCostINR: number;
    batteryLevel: number;
    driverName?: string;
  };
  lastMaintenanceDate?: string;
}

export interface AdminUser {
  id: string;
  userId?: string;
  name: string;
  phone?: string;
  phoneNumber?: string;
  email: string;
  city: string;
  walletBalance?: number;
  walletBalanceINR?: number;
  totalSessions: number;
  vehiclesCount?: number;
  isVerified?: boolean;
  status: 'Active' | 'Suspended' | 'Pending' | 'Inactive';
  registeredAt?: string;
  joinedAt?: string;
}

export interface AdminVehicle {
  id: string;
  ownerName: string;
  ownerPhone?: string;
  userId?: string;
  make?: string;
  manufacturer?: string;
  model: string;
  year?: number;
  licensePlate?: string;
  plateNumber?: string;
  type?: string;
  category?: string;
  connector?: string;
  portType?: string;
  batteryCapacityKWh: number;
  sessionsCount?: number;
  totalEnergyDeliveredKWh?: number;
  isVerified?: boolean;
  createdAt?: string;
}

export interface AdminReservation {
  id: string;
  reservationNumber?: string;
  customerName?: string;
  userName?: string;
  customerPhone?: string;
  userPhone?: string;
  zoneName?: string;
  stationName: string;
  chargerId?: string;
  pointCode?: string;
  vehiclePlate: string;
  scheduledStartTime?: string;
  date?: string;
  timeSlot?: string;
  durationMinutes: number;
  slotFeeINR?: number;
  status: 'Active' | 'Upcoming' | 'Completed' | 'Cancelled' | 'Confirmed';
  estimatedCostINR?: number;
  createdAt?: string;
}

export interface AdminChargingSession {
  id: string;
  sessionNumber?: string;
  customerName?: string;
  userName?: string;
  userId?: string;
  vehiclePlate?: string;
  vehicleModel?: string;
  vehicleType?: 'CAR' | 'BIKE' | 'BUS' | string;
  stationName: string;
  zoneCode?: string;
  chargerId?: string;
  pointCode?: string;
  startTime?: string;
  startedAt?: string;
  endTime?: string;
  durationMinutes: number;
  energyKWh?: number;
  energyDeliveredKWh?: number;
  startSoC?: number;
  currentSoC?: number;
  peakPowerKw?: number;
  totalAmountINR?: number;
  totalCostINR?: number;
  paymentStatus?: 'Paid' | 'Pending' | 'In Progress';
  status: 'Active' | 'In Progress' | 'Completed' | 'Interrupted' | 'Failed' | 'Faulted';
}

export interface AdminTariffPlan {
  id: string;
  name?: string;
  type?: string;
  vehicleType?: 'BIKE' | 'CAR' | 'BUS' | string;
  zoneCode: string;
  zoneName?: string;
  pricingType?: string;
  ratePerKWhINR?: number;
  standardRateINR?: number;
  peakRateINR?: number;
  peakRatePerKWhINR?: number;
  peakHoursWindow?: string;
  offPeakRateINR?: number;
  serviceFeeINR?: number;
  taxGstPercent?: number;
  minChargeINR?: number;
  effectiveFrom?: string;
  effectiveTo?: string;
  priority?: number;
  idleFeePerMinuteINR?: number;
  parkingFeePerHourINR?: number;
  status?: string;
  lastUpdated?: string;
}

export interface AdminWalletTransaction {
  id: string;
  transactionRef?: string;
  customerName?: string;
  userName?: string;
  customerPhone?: string;
  userId?: string;
  type: 'Recharge' | 'Session Debit' | 'Refund' | 'Topup' | 'SessionDebit' | 'ReservationFee';
  amountINR: number;
  paymentMethod?: string;
  paymentGateway?: string;
  gatewayTxnId?: string;
  timestamp: string;
  status: 'Success' | 'Pending' | 'Failed' | 'Completed';
}

export interface AdminMaintenanceTicket {
  id: string;
  ticketCode?: string;
  chargerId?: string;
  pointCode?: string;
  stationName: string;
  zoneCode?: string;
  faultCode?: string;
  issueDescription?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description?: string;
  reportedAt: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  assignedTechnician?: string;
  technicianAssigned?: string;
  technicianContact?: string;
}

export interface AdminAuditLog {
  id: string;
  actor?: string;
  actorEmail?: string;
  adminName?: string;
  adminRole?: string;
  adminEmail?: string;
  adminAvatar?: string;
  role?: string;
  actorRole?: string;
  action: string;
  actionType?: 'Created' | 'Updated' | 'Deleted' | 'Approved' | 'Rejected' | 'Marked Maintenance' | 'Changed Status' | 'Refunded' | 'Login' | 'Reboot' | string;
  module?: 'Pricing' | 'Chargers' | 'Payments' | 'Support' | 'Zones' | 'Users' | 'Security' | string;
  target?: string;
  targetResource?: string;
  record?: string;
  recordId?: string;
  details?: string;
  ipAddress: string;
  device?: string;
  timestamp: string;
  timeOnly?: string;
  dateOnly?: string;
  previousValue?: string;
  newValue?: string;
  severity?: 'Info' | 'Notice' | 'Warning' | 'Critical';
  status?: 'Success' | 'Warning' | 'Failed';
}

export interface AdminRolePermission {
  id: string;
  name: string;
  userCount?: number;
  description: string;
  permissions: string[];
  lastModified?: string;
}

export interface AdminDashboardOverview {
  totalZones: number;
  totalChargingPoints: number;
  availablePoints: number;
  chargingPoints: number;
  reservedPoints: number;
  maintenancePoints: number;
  todayRevenueINR: number;
  todayRevenueGrowthPercent: number;
  activeSessionsCount: number;
  activeSessionsLiveValueINR: number;
  energyDeliveredTodayKWh: number;
  monthlyRevenueINR: number;
  revenueTrend: { month: string; revenue: number; energyKWh: number }[];
  vehicleDistribution: { category: string; count: number; percentage: number }[];
  zonesSummary: AdminZone[];
}

export interface AdminZonePerformance {
  zoneCode: string;
  zoneName?: string;
  sessions: number;
  energyKWh: number;
  revenueINR: number;
  utilizationPercent: number;
  performance: 'High' | 'Moderate' | 'Low';
}

export interface AdminVehicleCategoryReport {
  category: 'CAR' | 'BIKE' | 'BUS';
  sessions: number;
  energyKWh: number;
  revenueINR: number;
  progressPercent: number;
}

export interface AdminMonthlyReportMetric {
  month: string;
  revenueINR: number;
  energyKWh: number;
  carSessions: number;
  bikeSessions: number;
  busSessions: number;
}

export interface AdminReportsData {
  period: string;
  startDate: string;
  endDate: string;
  monthlyMetrics: AdminMonthlyReportMetric[];
  vehicleCategories: AdminVehicleCategoryReport[];
  zonePerformance: AdminZonePerformance[];
  summary: {
    totalRevenueINR: number;
    totalEnergyKWh: number;
    totalSessions: number;
    avgUtilizationPercent: number;
  };
}

