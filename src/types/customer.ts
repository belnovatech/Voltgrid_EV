export interface CustomerProfile {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  city: string;
  state: string;
  walletBalance: number;
  avatarInitials: string;
  isProfileComplete: boolean;
  memberSince?: string;
  isVerified?: boolean;
}

export interface CustomerVehicle {
  id: string;
  name: string;
  manufacturer?: string;
  model: string;
  type: 'Car' | 'Bike' | 'Bus';
  licensePlate: string;
  batteryCapacityKWh?: number;
  connector?: 'CCS2' | 'Type 2' | 'GB/T' | 'CHAdeMO';
  chargingSessionsCount?: number;
  batteryPercentage: number;
  isDefault: boolean;
  ratePerKWh: number;
  createdAt?: string;
}

export interface CustomerReservation {
  id: string;
  stationId?: string;
  stationName: string;
  city: string;
  chargerId?: string;
  chargerType: string;
  powerKw: number;
  vehicleName?: string;
  vehiclePlate?: string;
  vehicleType?: 'Car' | 'Bike' | 'Bus';
  date: string;
  timeSlot: string;
  startTime?: string;
  durationMinutes?: number;
  durationText?: string;
  estimatedCostINR?: number;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  ratePerKWh: number;
  createdAt?: string;
}

export interface ChargingHistoryItem {
  id: string;
  stationName: string;
  stationAddress?: string;
  city: string;
  chargerId?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  energyConsumedKWh: number;
  durationMinutes: number;
  ratePerKWh?: number;
  totalCostINR: number;
  vehicleName: string;
  vehiclePlate?: string;
  vehicleType?: 'Car' | 'Bike' | 'Bus';
  status: 'completed' | 'active' | 'failed' | 'cancelled' | 'interrupted';
}

export interface WalletTransaction {
  id: string;
  type: 'recharge' | 'charging' | 'refund' | 'credit' | 'debit';
  title?: string;
  description?: string;
  amountINR: number;
  date: string;
  status: 'Success' | 'Pending' | 'Failed' | 'successful' | 'pending' | 'failed' | 'Cancelled';
  balanceAfterINR?: number;
  paymentMethod?: string;
}

export interface CustomerNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'charging' | 'wallet' | 'reservation' | 'alert' | 'system';
  targetRoute?: string;
  entityId?: string;
}

export interface TicketReply {
  id: string;
  sender: 'customer' | 'support';
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  description?: string;
  stationName?: string;
  chargerId?: string;
  status: 'Open' | 'In Progress' | 'Waiting for Customer' | 'Resolved' | 'Closed' | 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  lastUpdate: string;
  replies?: TicketReply[];
}

export interface CustomerDashboardData {
  profile: CustomerProfile;
  walletBalance: number;
  activeSession: {
    stationName: string;
    energyKWh: number;
    durationMin: number;
    currentCostINR: number;
    batteryLevel: number;
  } | null;
  lastCharging: {
    amountINR: number;
    energyKWh: number;
    durationMin: number;
  } | null;
  totalEnergyThisMonthKWh: number;
  vehicles: CustomerVehicle[];
  nearbyStations: {
    id: string;
    name: string;
    city: string;
    distanceKm: number;
    availablePoints: number;
    totalPoints: number;
    powerKw: number;
    ratePerKWh: number;
  }[];
  unreadNotificationsCount: number;
}
