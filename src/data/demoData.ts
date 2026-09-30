import { VehiclePricing, FeatureItem, ZoneItem } from '../types/demo';

export const VEHICLE_PRICING_DATA: VehiclePricing[] = [
  {
    id: 'bike',
    type: 'Bike',
    rateText: 'from ₹8/kWh',
    unit: '₹8/kWh',
    iconName: 'bike',
  },
  {
    id: 'car',
    type: 'Car',
    rateText: 'from ₹12/kWh',
    unit: '₹12/kWh',
    iconName: 'car',
  },
  {
    id: 'bus',
    type: 'Bus',
    rateText: 'from ₹18/kWh',
    unit: '₹18/kWh',
    iconName: 'bus',
  },
];

export const FEATURES_DATA: FeatureItem[] = [
  {
    id: 'find-zone',
    title: 'Find a zone',
    description: 'Live availability, distance and ETA for every charging zone.',
    iconName: 'location',
  },
  {
    id: 'vehicle-pricing',
    title: 'Vehicle-based pricing',
    description: 'Your selected vehicle decides the applicable rate.',
    iconName: 'rupee',
  },
  {
    id: 'scan-start',
    title: 'Scan and start',
    description: 'Reserve a point, scan the QR at the charger and start.',
    iconName: 'qr',
  },
  {
    id: 'live-monitoring',
    title: 'Live monitoring',
    description: 'Watch energy, battery and cost update in real time.',
    iconName: 'monitoring',
  },
];

export const LIVE_ZONES_DATA: ZoneItem[] = [
  {
    id: 'zone-1',
    city: 'Vijayawada',
    hubName: 'Benz Circle Hub',
    distanceKm: 2.4,
  },
  {
    id: 'zone-2',
    city: 'Guntur',
    hubName: 'Brodipet Energy Point',
    distanceKm: 31.2,
  },
  {
    id: 'zone-3',
    city: 'Amaravati',
    hubName: 'Secretariat Zone',
    distanceKm: 38.6,
  },
  {
    id: 'zone-4',
    city: 'Visakhapatnam',
    hubName: 'Beach Road Zone',
    distanceKm: 348.1,
  },
  {
    id: 'zone-5',
    city: 'Tirupati',
    hubName: 'Alipiri Charge Park',
    distanceKm: 388.4,
  },
  {
    id: 'zone-6',
    city: 'Nellore',
    hubName: 'Trunk Road Zone',
    distanceKm: 274.5,
  },
  {
    id: 'zone-7',
    city: 'Kakinada',
    hubName: 'Port Logistics Zone',
    distanceKm: 168.9,
  },
  {
    id: 'zone-8',
    city: 'Rajahmundry',
    hubName: 'Godavari Bridge Zone',
    distanceKm: 148.2,
  },
];
