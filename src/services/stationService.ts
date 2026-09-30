import { ENV } from '../config/environment';

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

export const CITY_COORDINATES: Record<string, StationLocation & { zoom: number; region: string }> = {
  Hyderabad: { lat: 17.3850, lng: 78.4867, zoom: 12, region: 'Telangana' },
  'Banjara Hills': { lat: 17.4156, lng: 78.4357, zoom: 14, region: 'Hyderabad' },
  'Hitech City': { lat: 17.4504, lng: 78.3808, zoom: 14, region: 'Hyderabad' },
  Gachibowli: { lat: 17.4401, lng: 78.3489, zoom: 14, region: 'Hyderabad' },
  Madhapur: { lat: 17.4334, lng: 78.3866, zoom: 14, region: 'Hyderabad' },
  'Jubilee Hills': { lat: 17.4319, lng: 78.4073, zoom: 14, region: 'Hyderabad' },
  Secunderabad: { lat: 17.4399, lng: 78.4983, zoom: 13, region: 'Hyderabad' },
  Shamshabad: { lat: 17.2403, lng: 78.4294, zoom: 13, region: 'Hyderabad' },

  Vijayawada: { lat: 16.5062, lng: 80.6480, zoom: 13, region: 'Andhra Pradesh' },
  'MG Road': { lat: 16.5085, lng: 80.6420, zoom: 14, region: 'Vijayawada' },
  'Benz Circle': { lat: 16.5020, lng: 80.6550, zoom: 14, region: 'Vijayawada' },
  Amaravati: { lat: 16.5131, lng: 80.5158, zoom: 13, region: 'Andhra Pradesh' },
  Guntur: { lat: 16.3067, lng: 80.4365, zoom: 13, region: 'Andhra Pradesh' },
  Visakhapatnam: { lat: 17.6868, lng: 83.2185, zoom: 12, region: 'Andhra Pradesh' },
  Tirupati: { lat: 13.6288, lng: 79.4192, zoom: 13, region: 'Andhra Pradesh' },
  Kurnool: { lat: 15.8281, lng: 78.0373, zoom: 12, region: 'Andhra Pradesh' },
  Nellore: { lat: 14.4426, lng: 79.9865, zoom: 12, region: 'Andhra Pradesh' },
  Rajahmundry: { lat: 17.0005, lng: 81.8040, zoom: 12, region: 'Andhra Pradesh' },
  Kakinada: { lat: 16.9891, lng: 82.2475, zoom: 12, region: 'Andhra Pradesh' },
};

const ALL_STATIONS: EVStation[] = [
  // HYDERABAD STATIONS
  {
    id: 'st-hyd-01',
    name: 'Hyderabad Central Hub',
    address: 'Road No 1, Banjara Hills, Hyderabad',
    city: 'Hyderabad',
    zone: 'Banjara Hills Core',
    lat: 17.4156,
    lng: 78.4357,
    distanceKm: 1.2,
    travelTimeMin: 4,
    powerKw: 120,
    connectorType: 'CCS2',
    vehicleTypes: ['Car', 'Bus'],
    ratePerKWh: 12,
    availableChargers: 6,
    totalChargers: 10,
    status: 'available',
    amenities: ['24x7 Cafe', 'Restrooms', 'Free Wi-Fi', 'Security CCTV'],
    operatingHours: 'Open 24/7',
    chargers: [
      { id: 'h1', name: 'Gun 1 (Hyper DC)', powerKw: 120, connector: 'CCS2', status: 'available', currentRateINR: 12 },
      { id: 'h2', name: 'Gun 2 (Hyper DC)', powerKw: 120, connector: 'CCS2', status: 'available', currentRateINR: 12 },
      { id: 'h3', name: 'Gun 3 (Fast DC)', powerKw: 60, connector: 'CCS2', status: 'available', currentRateINR: 12 },
      { id: 'h4', name: 'Gun 4 (Type 2)', powerKw: 22, connector: 'Type 2', status: 'available', currentRateINR: 8 },
      { id: 'h5', name: 'Gun 5 (Type 2)', powerKw: 22, connector: 'Type 2', status: 'available', currentRateINR: 8 },
      { id: 'h6', name: 'Gun 6 (Hyper DC)', powerKw: 120, connector: 'CCS2', status: 'available', currentRateINR: 12 },
      { id: 'h7', name: 'Gun 7 (Fast DC)', powerKw: 60, connector: 'CCS2', status: 'charging', currentRateINR: 12 },
      { id: 'h8', name: 'Gun 8 (Fast DC)', powerKw: 60, connector: 'CCS2', status: 'charging', currentRateINR: 12 },
      { id: 'h9', name: 'Gun 9 (Heavy Fleet)', powerKw: 150, connector: 'CCS2', status: 'charging', currentRateINR: 18 },
      { id: 'h10', name: 'Gun 10 (Heavy Fleet)', powerKw: 150, connector: 'CCS2', status: 'charging', currentRateINR: 18 },
    ],
  },
  {
    id: 'st-hyd-02',
    name: 'Hitech City Supercharger',
    address: 'Cyber Towers, Hitech City, Hyderabad',
    city: 'Hyderabad',
    zone: 'Cyber Gateway',
    lat: 17.4504,
    lng: 78.3808,
    distanceKm: 2.8,
    travelTimeMin: 7,
    powerKw: 150,
    connectorType: 'CCS2',
    vehicleTypes: ['Car', 'Bike', 'Bus'],
    ratePerKWh: 12,
    availableChargers: 8,
    totalChargers: 12,
    status: 'available',
    amenities: ['Tech Lounge', 'Food Court', 'Coffee Shop', 'High-Speed Wi-Fi'],
    operatingHours: 'Open 24/7',
    chargers: [],
  },
  {
    id: 'st-hyd-03',
    name: 'Gachibowli Financial Hub',
    address: 'Financial District, Gachibowli, Hyderabad',
    city: 'Hyderabad',
    zone: 'Financial District',
    lat: 17.4401,
    lng: 78.3489,
    distanceKm: 4.5,
    travelTimeMin: 11,
    powerKw: 180,
    connectorType: 'CCS2',
    vehicleTypes: ['Car', 'Bus'],
    ratePerKWh: 12,
    availableChargers: 5,
    totalChargers: 8,
    status: 'partial',
    amenities: ['Executive Rest Pods', 'EV Service Station', 'EV Lounge'],
    operatingHours: 'Open 24/7',
    chargers: [],
  },
  {
    id: 'st-hyd-04',
    name: 'Madhapur Metro Fast Bay',
    address: 'Near Inorbit Mall, Madhapur, Hyderabad',
    city: 'Hyderabad',
    zone: 'Madhapur Metro',
    lat: 17.4334,
    lng: 78.3866,
    distanceKm: 3.2,
    travelTimeMin: 8,
    powerKw: 60,
    connectorType: 'CCS2',
    vehicleTypes: ['Car', 'Bike'],
    ratePerKWh: 12,
    availableChargers: 4,
    totalChargers: 6,
    status: 'partial',
    amenities: ['Shopping Access', 'Mall Restrooms'],
    operatingHours: '06:00 AM - 11:30 PM',
    chargers: [],
  },
  {
    id: 'st-hyd-05',
    name: 'Jubilee Hills Energy Bay',
    address: 'Road No 36, Jubilee Hills, Hyderabad',
    city: 'Hyderabad',
    zone: 'Jubilee Hills Core',
    lat: 17.4319,
    lng: 78.4073,
    distanceKm: 2.1,
    travelTimeMin: 5,
    powerKw: 120,
    connectorType: 'CCS2',
    vehicleTypes: ['Car'],
    ratePerKWh: 12,
    availableChargers: 3,
    totalChargers: 6,
    status: 'partial',
    amenities: ['Valet Charging', 'Coffee Lounge'],
    operatingHours: 'Open 24/7',
    chargers: [],
  },
  {
    id: 'st-hyd-06',
    name: 'Secunderabad Station Hub',
    address: 'Clock Tower Road, Secunderabad',
    city: 'Hyderabad',
    zone: 'Secunderabad Hub',
    lat: 17.4399,
    lng: 78.4983,
    distanceKm: 6.4,
    travelTimeMin: 15,
    powerKw: 60,
    connectorType: 'CCS2',
    vehicleTypes: ['Car', 'Bike'],
    ratePerKWh: 12,
    availableChargers: 0,
    totalChargers: 6,
    status: 'full',
    waitTimeMin: 18,
    amenities: ['Transit Lounge', 'Railway Connectivity'],
    operatingHours: 'Open 24/7',
    chargers: [],
  },
  {
    id: 'st-hyd-07',
    name: 'Rajiv Gandhi Airport Hyper Point',
    address: 'Airport Approach Road, Shamshabad, Hyderabad',
    city: 'Hyderabad',
    zone: 'Airport Expressway',
    lat: 17.2403,
    lng: 78.4294,
    distanceKm: 18.5,
    travelTimeMin: 22,
    powerKw: 180,
    connectorType: 'CCS2',
    vehicleTypes: ['Car', 'Bus'],
    ratePerKWh: 12,
    availableChargers: 10,
    totalChargers: 12,
    status: 'available',
    amenities: ['Airport Valet', '24x7 Food Court', 'Airline Lounge'],
    operatingHours: 'Open 24/7',
    chargers: [],
  },

  // VIJAYAWADA STATIONS
  {
    id: 'st-vja-01',
    name: 'Vijayawada Central Hub',
    address: 'MG Road, Vijayawada',
    city: 'Vijayawada',
    zone: 'MG Road Corridor',
    lat: 16.5085,
    lng: 80.6420,
    distanceKm: 1.2,
    travelTimeMin: 4,
    powerKw: 120,
    connectorType: 'CCS2',
    vehicleTypes: ['Car', 'Bus'],
    ratePerKWh: 12,
    availableChargers: 6,
    totalChargers: 10,
    status: 'available',
    amenities: ['24x7 Cafe', 'Restrooms', 'Free Wi-Fi', 'Security CCTV'],
    operatingHours: 'Open 24/7',
    chargers: [
      { id: 'c1', name: 'Gun 1 (Hyper DC)', powerKw: 120, connector: 'CCS2', status: 'available', currentRateINR: 12 },
      { id: 'c2', name: 'Gun 2 (Hyper DC)', powerKw: 120, connector: 'CCS2', status: 'available', currentRateINR: 12 },
      { id: 'c3', name: 'Gun 3 (Fast DC)', powerKw: 60, connector: 'CCS2', status: 'charging', currentRateINR: 12 },
      { id: 'c4', name: 'Gun 4 (Fast DC)', powerKw: 60, connector: 'CCS2', status: 'available', currentRateINR: 12 },
      { id: 'c5', name: 'Gun 5 (Type 2)', powerKw: 22, connector: 'Type 2', status: 'available', currentRateINR: 8 },
      { id: 'c6', name: 'Gun 6 (Type 2)', powerKw: 22, connector: 'Type 2', status: 'available', currentRateINR: 8 },
      { id: 'c7', name: 'Gun 7 (Type 2)', powerKw: 22, connector: 'Type 2', status: 'charging', currentRateINR: 8 },
      { id: 'c8', name: 'Gun 8 (Hyper DC)', powerKw: 120, connector: 'CCS2', status: 'available', currentRateINR: 12 },
      { id: 'c9', name: 'Gun 9 (Heavy Fleet)', powerKw: 150, connector: 'CCS2', status: 'charging', currentRateINR: 18 },
      { id: 'c10', name: 'Gun 10 (Heavy Fleet)', powerKw: 150, connector: 'CCS2', status: 'charging', currentRateINR: 18 },
    ],
  },
  {
    id: 'st-vja-02',
    name: 'Benz Circle Fast Hub',
    address: 'Ring Road, Benz Circle, Vijayawada',
    city: 'Vijayawada',
    zone: 'Benz Circle Hub',
    lat: 16.5020,
    lng: 80.6550,
    distanceKm: 2.1,
    travelTimeMin: 6,
    powerKw: 60,
    connectorType: 'CCS2',
    vehicleTypes: ['Car', 'Bike'],
    ratePerKWh: 12,
    availableChargers: 5,
    totalChargers: 10,
    status: 'partial',
    amenities: ['Shopping Mall Access', 'Coffee Shop'],
    operatingHours: '06:00 AM - 11:30 PM',
    chargers: [],
  },
  {
    id: 'st-vja-03',
    name: 'Autonagar Heavy Charging Bay',
    address: 'Industrial Estate, Autonagar, Vijayawada',
    city: 'Vijayawada',
    zone: 'Autonagar Industrial',
    lat: 16.4850,
    lng: 80.6720,
    distanceKm: 4.5,
    travelTimeMin: 11,
    powerKw: 150,
    connectorType: 'CCS2',
    vehicleTypes: ['Bus', 'Car'],
    ratePerKWh: 12,
    availableChargers: 0,
    totalChargers: 10,
    status: 'full',
    waitTimeMin: 18,
    amenities: ['Fleet Workshop', 'Driver Lounge', 'Restrooms'],
    operatingHours: 'Open 24/7',
    chargers: [],
  },
  {
    id: 'st-vja-04',
    name: 'Bhavani Island Gateway Point',
    address: 'Gollapudi Bypass, Vijayawada',
    city: 'Vijayawada',
    zone: 'Krishna Riverside',
    lat: 16.5290,
    lng: 80.5890,
    distanceKm: 6.2,
    travelTimeMin: 13,
    powerKw: 60,
    connectorType: 'CCS2',
    vehicleTypes: ['Car', 'Bike'],
    ratePerKWh: 12,
    availableChargers: 4,
    totalChargers: 6,
    status: 'partial',
    amenities: ['Boating Resort View', 'Restaurant'],
    operatingHours: '07:00 AM - 10:00 PM',
    chargers: [],
  },

  // AMARAVATI STATIONS
  {
    id: 'st-amr-01',
    name: 'Amaravati Capital Station',
    address: 'Capital Region, Amaravati',
    city: 'Amaravati',
    zone: 'Secretariat Zone',
    lat: 16.5160,
    lng: 80.5280,
    distanceKm: 3.8,
    travelTimeMin: 9,
    powerKw: 150,
    connectorType: 'CCS2',
    vehicleTypes: ['Car', 'Bike', 'Bus'],
    ratePerKWh: 12,
    availableChargers: 7,
    totalChargers: 10,
    status: 'partial',
    amenities: ['Government Lounge', 'Restrooms', 'Solar Shaded Parking'],
    operatingHours: 'Open 24/7',
    chargers: [],
  },
  {
    id: 'st-amr-02',
    name: 'Secretariat Executive Fast Point',
    address: 'Velagapudi Corridor, Amaravati',
    city: 'Amaravati',
    zone: 'Secretariat Core',
    lat: 16.5360,
    lng: 80.5480,
    distanceKm: 5.1,
    travelTimeMin: 10,
    powerKw: 120,
    connectorType: 'CCS2',
    vehicleTypes: ['Car', 'Bus'],
    ratePerKWh: 12,
    availableChargers: 4,
    totalChargers: 6,
    status: 'partial',
    amenities: ['Secure Parking', 'Restrooms'],
    operatingHours: 'Open 24/7',
    chargers: [],
  },

  // TIRUPATI STATIONS
  {
    id: 'st-tpt-01',
    name: 'Tirupati East Hub',
    address: 'Alipiri Road, Tirupati',
    city: 'Tirupati',
    zone: 'Alipiri Foothills',
    lat: 13.6340,
    lng: 79.4280,
    distanceKm: 5.4,
    travelTimeMin: 12,
    powerKw: 120,
    connectorType: 'CCS2',
    vehicleTypes: ['Car', 'Bus'],
    ratePerKWh: 12,
    availableChargers: 4,
    totalChargers: 10,
    status: 'partial',
    amenities: ['Pilgrim Rest Area', 'Water ATM', 'Food Court'],
    operatingHours: 'Open 24/7',
    chargers: [],
  },
  {
    id: 'st-tpt-02',
    name: 'Renigunta Highway Supercharger',
    address: 'Tirupati Airport Highway, Renigunta',
    city: 'Tirupati',
    zone: 'Airport Corridor',
    lat: 13.6520,
    lng: 79.5120,
    distanceKm: 9.8,
    travelTimeMin: 16,
    powerKw: 150,
    connectorType: 'CCS2',
    vehicleTypes: ['Car', 'Bus'],
    ratePerKWh: 12,
    availableChargers: 6,
    totalChargers: 8,
    status: 'available',
    amenities: ['Airport Diner', 'Restrooms'],
    operatingHours: 'Open 24/7',
    chargers: [],
  },

  // GUNTUR STATIONS
  {
    id: 'st-gtr-01',
    name: 'Guntur Highway Supercharger',
    address: 'NH16 Bypass, Guntur',
    city: 'Guntur',
    zone: 'NH16 Expressway',
    lat: 16.3150,
    lng: 80.4450,
    distanceKm: 8.2,
    travelTimeMin: 15,
    powerKw: 180,
    connectorType: 'CCS2',
    vehicleTypes: ['Car', 'Bus'],
    ratePerKWh: 12,
    availableChargers: 9,
    totalChargers: 10,
    status: 'available',
    amenities: ['Highway Diner', 'Driver Rest Pods', 'EV Service Station'],
    operatingHours: 'Open 24/7',
    chargers: [],
  },
  {
    id: 'st-gtr-02',
    name: 'Brodipet City Point',
    address: 'Main Road, Brodipet, Guntur',
    city: 'Guntur',
    zone: 'Brodipet Commercial',
    lat: 16.3080,
    lng: 80.4320,
    distanceKm: 3.4,
    travelTimeMin: 8,
    powerKw: 60,
    connectorType: 'CCS2',
    vehicleTypes: ['Car', 'Bike'],
    ratePerKWh: 12,
    availableChargers: 3,
    totalChargers: 6,
    status: 'partial',
    amenities: ['Shopping Area', 'Restrooms'],
    operatingHours: '06:00 AM - 11:00 PM',
    chargers: [],
  },

  // VISAKHAPATNAM STATIONS
  {
    id: 'st-vsp-01',
    name: 'Visakhapatnam Port Station',
    address: 'Beach Road, Visakhapatnam',
    city: 'Visakhapatnam',
    zone: 'Beach Road Zone',
    lat: 17.6950,
    lng: 83.2280,
    distanceKm: 6.7,
    travelTimeMin: 14,
    powerKw: 120,
    connectorType: 'CCS2',
    vehicleTypes: ['Car', 'Bus'],
    ratePerKWh: 12,
    availableChargers: 3,
    totalChargers: 10,
    status: 'partial',
    amenities: ['Scenic Sea View', 'EV Lounge', 'Wi-Fi'],
    operatingHours: 'Open 24/7',
    chargers: [],
  },
  {
    id: 'st-vsp-02',
    name: 'Gajuwaka Industrial Hub',
    address: 'Steel Plant Road, Gajuwaka, Visakhapatnam',
    city: 'Visakhapatnam',
    zone: 'Gajuwaka Industrial',
    lat: 17.6820,
    lng: 83.1780,
    distanceKm: 12.4,
    travelTimeMin: 20,
    powerKw: 150,
    connectorType: 'CCS2',
    vehicleTypes: ['Bus', 'Car'],
    ratePerKWh: 12,
    availableChargers: 6,
    totalChargers: 8,
    status: 'available',
    amenities: ['Fleet Parking', 'Driver Restrooms'],
    operatingHours: 'Open 24/7',
    chargers: [],
  },
];

// Helper: compute distance in KM between 2 GPS coordinates
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

class StationService {
  private stations: EVStation[] = [...ALL_STATIONS];

  async getStations(filters?: {
    search?: string;
    city?: string;
    centerLat?: number;
    centerLng?: number;
    radiusKm?: number;
    vehicleType?: 'Car' | 'Bike' | 'Bus' | 'All';
    minPowerKw?: number;
  }): Promise<EVStation[]> {
    if (ENV.IS_DEMO_MODE) {
      await new Promise((res) => setTimeout(res, 120));

      let results = [...this.stations];
      const q = filters?.search?.toLowerCase().trim();

      // If center coordinates are provided, compute dynamic distance and filter by radius if applicable
      if (filters?.centerLat !== undefined && filters?.centerLng !== undefined) {
        const cLat = filters.centerLat;
        const cLng = filters.centerLng;
        const radius = filters.radiusKm || 45; // 45km radius by default

        results = results
          .map((st) => {
            const dist = getDistanceKm(cLat, cLng, st.lat, st.lng);
            return {
              ...st,
              distanceKm: dist,
              travelTimeMin: Math.max(2, Math.round(dist * 2.8)),
            };
          })
          .filter((st) => st.distanceKm <= radius || (q && (st.name.toLowerCase().includes(q) || st.city.toLowerCase().includes(q))))
          .sort((a, b) => a.distanceKm - b.distanceKm);
      } else if (q) {
        results = results.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.city.toLowerCase().includes(q) ||
            s.address.toLowerCase().includes(q) ||
            s.zone.toLowerCase().includes(q)
        );
      }

      if (filters?.city && filters.city !== 'All') {
        results = results.filter((s) => s.city.toLowerCase() === filters.city!.toLowerCase());
      }

      if (filters?.vehicleType && filters.vehicleType !== 'All') {
        results = results.filter((s) => s.vehicleTypes.includes(filters.vehicleType as 'Car' | 'Bike' | 'Bus'));
      }

      if (filters?.minPowerKw) {
        results = results.filter((s) => s.powerKw >= filters.minPowerKw!);
      }

      return results;
    }

    return this.stations;
  }

  async getStationById(id: string): Promise<EVStation | null> {
    const st = this.stations.find((s) => s.id === id);
    return st || null;
  }

  async getChargersByStationId(stationId: string): Promise<ChargingPoint[]> {
    if (ENV.IS_DEMO_MODE) {
      await new Promise((res) => setTimeout(res, 100));
    }
    const station = this.stations.find((s) => s.id === stationId);
    if (!station) return [];

    if (station.chargers && station.chargers.length > 0) {
      return station.chargers.map((c, i) => ({
        ...c,
        code: c.code || `CH-${String(i + 1).padStart(3, '0')}`,
      }));
    }

    // Generate authentic chargers based on station specs and total/available count
    const total = station.totalChargers || 6;
    const available = station.availableChargers;
    const chargers: ChargingPoint[] = [];

    for (let i = 1; i <= total; i++) {
      let status: 'available' | 'charging' | 'reserved' | 'offline' = 'available';
      if (i <= available) {
        status = 'available';
      } else if (i === available + 1) {
        status = 'charging';
      } else if (i === available + 2) {
        status = 'reserved';
      } else {
        status = (i % 2 === 0 ? 'charging' : 'reserved');
      }

      const isType2 = i > 4 && station.vehicleTypes.includes('Bike');
      chargers.push({
        id: `${station.id}-ch-${i}`,
        code: `CH-${String(i).padStart(3, '0')}`,
        name: `Charger ${i}`,
        powerKw: isType2 ? 22 : station.powerKw,
        connector: isType2 ? 'Type 2' : 'CCS2',
        status,
        currentRateINR: station.ratePerKWh,
      });
    }

    return chargers;
  }

  async geocode(query: string): Promise<{ name: string; lat: number; lng: number; zoom: number } | null> {
    const clean = query.trim().toLowerCase();
    if (!clean) return null;

    // Fast dictionary lookup
    for (const [cityName, info] of Object.entries(CITY_COORDINATES)) {
      if (clean.includes(cityName.toLowerCase()) || cityName.toLowerCase().includes(clean)) {
        return { name: cityName, lat: info.lat, lng: info.lng, zoom: info.zoom };
      }
    }

    // Try online OpenStreetMap Nominatim with fast timeout
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', India')}&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          return {
            name: data[0].display_name.split(',')[0],
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            zoom: 13,
          };
        }
      }
    } catch {
      // Fallback
    }

    // If query matches any station, return that station's location
    const matchedStation = this.stations.find((s) =>
      s.name.toLowerCase().includes(clean) || s.address.toLowerCase().includes(clean) || s.zone.toLowerCase().includes(clean)
    );
    if (matchedStation) {
      return {
        name: matchedStation.city,
        lat: matchedStation.lat,
        lng: matchedStation.lng,
        zoom: 14,
      };
    }

    return null;
  }
}

export const stationService = new StationService();
