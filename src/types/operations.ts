export interface OperationsSummary {
  totalChargers: number;
  totalZones: number;
  totalCities: number;
  availableChargers: number;
  activeSessions: number;
  todayRevenueINR: number;
  region: string;
}

export interface ChargerStatusItem {
  id: string;
  stationName: string;
  city: string;
  zone: string;
  powerKw: number;
  status: 'available' | 'charging' | 'offline' | 'maintenance';
  currentRateINR: number;
  activeSessionDurationMin?: number;
}
