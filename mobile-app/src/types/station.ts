export interface StationLocation {
  lat: number;
  lng: number;
}

export interface ChargingPoint {
  id: string;
  code?: string;
  name: string;
  powerKw: number;
  connector: 'CCS2' | 'Type 2' | 'GB/T' | 'CHAdeMO';
  status: 'available' | 'charging' | 'reserved' | 'offline';
  currentRateINR: number;
}

export interface EVStation {
  id: string;
  name: string;
  address: string;
  city: string;
  zone: string;
  lat: number;
  lng: number;
  distanceKm: number;
  travelTimeMin: number;
  powerKw: number;
  connectorType: string;
  vehicleTypes: ('Car' | 'Bike' | 'Bus')[];
  ratePerKWh: number;
  availableChargers: number;
  totalChargers: number;
  status: 'available' | 'partial' | 'full';
  waitTimeMin?: number;
  chargers: ChargingPoint[];
  amenities: string[];
  operatingHours: string;
}
