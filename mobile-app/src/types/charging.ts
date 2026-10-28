export type ChargingSessionStatus =
  | 'IDLE'
  | 'STARTING'
  | 'CHARGING'
  | 'STOPPING'
  | 'COMPLETED'
  | 'CANCELLED';

export interface ChargerQRPayload {
  chargerId: string;
  stationId: string;
  stationName: string;
  location: string;
  connectorType: string;
  powerKw: number;
  ratePerKwh: number;
  isAvailable?: boolean;
  statusText?: string;
}

export interface ChargingSession {
  sessionId: string;
  reservationId?: string;
  chargerId: string;
  stationId: string;
  stationName: string;
  location: string;
  vehicleName: string;
  vehiclePlate?: string;
  vehicleBatteryCapacityKWh: number;
  vehicleStartBatteryPercentage: number;
  connectorType: string;
  powerKw: number;
  ratePerKwh: number;
  energyDeliveredKwh: number;
  durationSeconds: number;
  currentCost: number;
  walletRemaining: number;
  initialWalletBalance: number;
  batteryPercentage: number;
  status: ChargingSessionStatus;
  startedAt: string;
  stoppedAt?: string;
}

export interface ChargingSummaryData {
  sessionId: string;
  chargerId: string;
  stationName: string;
  location: string;
  vehicleName: string;
  vehiclePlate?: string;
  energyDeliveredKwh: number;
  durationSeconds: number;
  durationFormatted: string;
  totalCost: number;
  ratePerKwh: number;
  walletRemaining: number;
  startedAt: string;
  stoppedAt: string;
  finalBatteryPercentage: number;
}
