import { EVStation, ChargingPoint } from '../types/station';

const STATIONS_DATA: EVStation[] = [
  {
    id: 'st-01',
    name: 'Vijayawada Central Hub',
    address: 'MG Road, Near Benz Circle, Vijayawada',
    city: 'Vijayawada',
    zone: 'Andhra Pradesh Central',
    lat: 16.5062,
    lng: 80.6480,
    distanceKm: 2.4,
    travelTimeMin: 7,
    powerKw: 120,
    connectorType: 'CCS2 / Type 2',
    vehicleTypes: ['Car', 'Bike'],
    ratePerKWh: 12,
    availableChargers: 4,
    totalChargers: 6,
    status: 'available',
    waitTimeMin: 0,
    operatingHours: '24/7 Always Open',
    amenities: ['Cafe & Lounge', 'Restrooms', 'Free Wi-Fi', 'EV Accessories', 'Security 24/7'],
    chargers: [
      { id: 'CH-005', code: 'CH-005', name: 'Supercharger A1', powerKw: 120, connector: 'CCS2', status: 'available', currentRateINR: 12 },
      { id: 'CH-006', code: 'CH-006', name: 'Supercharger A2', powerKw: 120, connector: 'CCS2', status: 'available', currentRateINR: 12 },
      { id: 'CH-007', code: 'CH-007', name: 'Fast Charger B1', powerKw: 60, connector: 'CCS2', status: 'charging', currentRateINR: 12 },
      { id: 'CH-008', code: 'CH-008', name: 'Fast Charger B2', powerKw: 60, connector: 'CCS2', status: 'available', currentRateINR: 12 },
      { id: 'CH-009', code: 'CH-009', name: 'AC Fast C1', powerKw: 22, connector: 'Type 2', status: 'available', currentRateINR: 8 },
      { id: 'CH-010', code: 'CH-010', name: 'AC Fast C2', powerKw: 22, connector: 'Type 2', status: 'reserved', currentRateINR: 8 },
    ],
  },
  {
    id: 'st-02',
    name: 'MG Road Energy Park',
    address: 'Opp. Trendset Mall, Vijayawada',
    city: 'Vijayawada',
    zone: 'Andhra Pradesh Central',
    lat: 16.5085,
    lng: 80.6420,
    distanceKm: 4.8,
    travelTimeMin: 12,
    powerKw: 60,
    connectorType: 'CCS2',
    vehicleTypes: ['Car'],
    ratePerKWh: 12,
    availableChargers: 2,
    totalChargers: 4,
    status: 'partial',
    waitTimeMin: 10,
    operatingHours: '06:00 AM - 11:00 PM',
    amenities: ['Shopping Mall', 'Food Court', 'Restrooms'],
    chargers: [
      { id: 'CH-011', code: 'CH-011', name: 'Bay 1', powerKw: 60, connector: 'CCS2', status: 'available', currentRateINR: 12 },
      { id: 'CH-012', code: 'CH-012', name: 'Bay 2', powerKw: 60, connector: 'CCS2', status: 'available', currentRateINR: 12 },
      { id: 'CH-013', code: 'CH-013', name: 'Bay 3', powerKw: 60, connector: 'CCS2', status: 'charging', currentRateINR: 12 },
      { id: 'CH-014', code: 'CH-014', name: 'Bay 4', powerKw: 60, connector: 'CCS2', status: 'offline', currentRateINR: 12 },
    ],
  },
  {
    id: 'st-03',
    name: 'Visakhapatnam Port Supercharger',
    address: 'Beach Road, Harbour View, Visakhapatnam',
    city: 'Visakhapatnam',
    zone: 'Coastal AP',
    lat: 17.6868,
    lng: 83.2185,
    distanceKm: 18.5,
    travelTimeMin: 35,
    powerKw: 150,
    connectorType: 'CCS2 / CHAdeMO',
    vehicleTypes: ['Car', 'Bus'],
    ratePerKWh: 14,
    availableChargers: 3,
    totalChargers: 4,
    status: 'available',
    waitTimeMin: 0,
    operatingHours: '24/7 Always Open',
    amenities: ['Oceanfront Cafe', 'Rest Area', '24/7 Security'],
    chargers: [
      { id: 'CH-015', code: 'CH-015', name: 'Port Ultra 1', powerKw: 150, connector: 'CCS2', status: 'available', currentRateINR: 14 },
      { id: 'CH-016', code: 'CH-016', name: 'Port Ultra 2', powerKw: 150, connector: 'CCS2', status: 'available', currentRateINR: 14 },
      { id: 'CH-017', code: 'CH-017', name: 'Port Fast 3', powerKw: 60, connector: 'CCS2', status: 'available', currentRateINR: 12 },
      { id: 'CH-018', code: 'CH-018', name: 'Port Fast 4', powerKw: 60, connector: 'CHAdeMO', status: 'charging', currentRateINR: 12 },
    ],
  },
  {
    id: 'st-04',
    name: 'Tirupati East Temple Energy Hub',
    address: 'Alipiri Road, Foothills, Tirupati',
    city: 'Tirupati',
    zone: 'Rayalaseema',
    lat: 13.6288,
    lng: 79.4192,
    distanceKm: 42.0,
    travelTimeMin: 65,
    powerKw: 120,
    connectorType: 'CCS2',
    vehicleTypes: ['Car', 'Bike'],
    ratePerKWh: 12,
    availableChargers: 4,
    totalChargers: 6,
    status: 'available',
    waitTimeMin: 0,
    operatingHours: '24/7 Always Open',
    amenities: ['Pilgrim Lounge', 'Water Dispenser', 'EV Quick Wash', 'Restrooms'],
    chargers: [
      { id: 'CH-027', code: 'CH-027', name: 'Tirupati DC-1', powerKw: 120, connector: 'CCS2', status: 'available', currentRateINR: 12 },
      { id: 'CH-028', code: 'CH-028', name: 'Tirupati DC-2', powerKw: 60, connector: 'CCS2', status: 'available', currentRateINR: 8 },
      { id: 'CH-029', code: 'CH-029', name: 'Tirupati DC-3', powerKw: 120, connector: 'CCS2', status: 'available', currentRateINR: 12 },
      { id: 'CH-030', code: 'CH-030', name: 'Tirupati AC-1', powerKw: 22, connector: 'Type 2', status: 'available', currentRateINR: 8 },
    ],
  },
  {
    id: 'st-05',
    name: 'Guntur City Express Hub',
    address: 'Brodipet Main Road, Guntur',
    city: 'Guntur',
    zone: 'Andhra Pradesh Central',
    lat: 16.3067,
    lng: 80.4365,
    distanceKm: 31.2,
    travelTimeMin: 45,
    powerKw: 60,
    connectorType: 'CCS2 / Type 2',
    vehicleTypes: ['Car', 'Bike'],
    ratePerKWh: 12,
    availableChargers: 3,
    totalChargers: 4,
    status: 'available',
    waitTimeMin: 0,
    operatingHours: '06:00 AM - 11:30 PM',
    amenities: ['Coffee Shop', 'Pharmacy', 'ATM'],
    chargers: [
      { id: 'CH-099', code: 'CH-099', name: 'Express 1', powerKw: 60, connector: 'CCS2', status: 'available', currentRateINR: 12 },
      { id: 'CH-100', code: 'CH-100', name: 'Express 2', powerKw: 60, connector: 'CCS2', status: 'available', currentRateINR: 12 },
      { id: 'CH-101', code: 'CH-101', name: 'Express 3', powerKw: 22, connector: 'Type 2', status: 'available', currentRateINR: 8 },
      { id: 'CH-102', code: 'CH-102', name: 'Express 4', powerKw: 22, connector: 'Type 2', status: 'charging', currentRateINR: 8 },
    ],
  },
];

class StationService {
  private stations: EVStation[] = [...STATIONS_DATA];

  async getStations(): Promise<EVStation[]> {
    await new Promise((res) => setTimeout(res, 200));
    return [...this.stations];
  }

  async getStationById(id: string): Promise<EVStation | null> {
    const s = this.stations.find((item) => item.id === id);
    return s ? { ...s } : null;
  }

  async searchStations(params: {
    query?: string;
    city?: string;
    connector?: string;
    minPower?: number;
    vehicleType?: 'Car' | 'Bike' | 'Bus';
  }): Promise<EVStation[]> {
    await new Promise((res) => setTimeout(res, 150));
    let list = [...this.stations];

    if (params.query) {
      const q = params.query.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q)
      );
    }

    if (params.city && params.city !== 'All') {
      list = list.filter((s) => s.city.toLowerCase() === params.city?.toLowerCase());
    }

    if (params.connector && params.connector !== 'All') {
      list = list.filter((s) => s.connectorType.includes(params.connector!));
    }

    if (params.minPower) {
      list = list.filter((s) => s.powerKw >= params.minPower!);
    }

    if (params.vehicleType) {
      list = list.filter((s) => s.vehicleTypes.includes(params.vehicleType!));
    }

    return list;
  }
}

export const stationService = new StationService();
