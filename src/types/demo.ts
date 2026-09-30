export interface VehiclePricing {
  id: string;
  type: 'Bike' | 'Car' | 'Bus';
  rateText: string;
  unit: string;
  iconName: 'bike' | 'car' | 'bus';
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: 'location' | 'rupee' | 'qr' | 'monitoring';
}

export interface ZoneItem {
  id: string;
  city: string;
  hubName: string;
  distanceKm: number;
}
