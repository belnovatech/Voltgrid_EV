import { Vehicle, NearbyZone, DashboardSummary } from '../types/dashboard';

export const DEMO_VEHICLES: Vehicle[] = [
  {
    id: 'veh-1',
    name: 'Tata Nexon EV',
    type: 'Car',
    ratePerKWh: 12,
    batteryPercentage: 38,
    iconEmoji: '🚗',
    licensePlate: 'AP 09 EV 4421',
  },
  {
    id: 'veh-2',
    name: 'MG ZS EV',
    type: 'Car',
    ratePerKWh: 12,
    batteryPercentage: 64,
    iconEmoji: '🚙',
    licensePlate: 'AP 16 EV 9088',
  },
  {
    id: 'veh-3',
    name: 'Ather 450X',
    type: 'Bike',
    ratePerKWh: 8,
    batteryPercentage: 82,
    iconEmoji: '🛵',
    licensePlate: 'AP 39 EV 1204',
  },
  {
    id: 'veh-4',
    name: 'Olectra Greentech Bus',
    type: 'Bus',
    ratePerKWh: 18,
    batteryPercentage: 45,
    iconEmoji: '🚌',
    licensePlate: 'AP 07 EV 7733',
  },
];

export const DEMO_NEARBY_ZONES: NearbyZone[] = [
  {
    id: 'benz-circle',
    name: 'Benz Circle Hub',
    city: 'Vijayawada',
    distanceKm: 2.4,
    etaMinutes: 7,
    status: 'available',
    availablePointsCount: 6,
  },
  {
    id: 'brodipet-energy',
    name: 'Brodipet Energy Point',
    city: 'Guntur',
    distanceKm: 31.2,
    etaMinutes: 44,
    status: 'available',
    availablePointsCount: 4,
  },
  {
    id: 'secretariat-zone',
    name: 'Secretariat Zone',
    city: 'Amaravati',
    distanceKm: 38.6,
    etaMinutes: 52,
    status: 'available',
    availablePointsCount: 8,
  },
  {
    id: 'godavari-bridge',
    name: 'Godavari Bridge Zone',
    city: 'Rajahmundry',
    distanceKm: 148.2,
    etaMinutes: 168,
    status: 'available',
    availablePointsCount: 4,
  },
];

export const DEMO_DASHBOARD_SUMMARY: DashboardSummary = {
  walletBalance: 1250.0,
  availablePointsNearby: 48,
  currentVehicle: DEMO_VEHICLES[0],
  nearbyZones: DEMO_NEARBY_ZONES,
};
