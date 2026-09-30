export interface Vehicle {
  id: string;
  name: string;
  type: 'Car' | 'Bike' | 'Bus';
  ratePerKWh: number;
  batteryPercentage: number;
  iconEmoji: string;
  licensePlate?: string;
}

export interface NearbyZone {
  id: string;
  name: string;
  city: string;
  distanceKm: number;
  etaMinutes: number;
  status: 'available' | 'busy' | 'unavailable' | 'maintenance';
  availablePointsCount?: number;
}

export interface DashboardSummary {
  walletBalance: number;
  availablePointsNearby: number;
  currentVehicle: Vehicle;
  nearbyZones: NearbyZone[];
}
