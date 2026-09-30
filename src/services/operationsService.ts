import { ENV } from '../config/environment';
import { OperationsSummary, ChargerStatusItem } from '../types/operations';
import { apiClient } from './apiClient';

const DEMO_OPERATIONS_SUMMARY: OperationsSummary = {
  totalChargers: 80,
  totalZones: 8,
  totalCities: 5,
  availableChargers: 56,
  activeSessions: 14,
  todayRevenueINR: 12480,
  region: 'Andhra Pradesh',
};

const DEMO_CHARGERS: ChargerStatusItem[] = [
  {
    id: 'ch-01',
    stationName: 'Benz Circle Hub - Fast 01',
    city: 'Vijayawada',
    zone: 'Benz Circle Hub',
    powerKw: 60,
    status: 'charging',
    currentRateINR: 12,
    activeSessionDurationMin: 22,
  },
  {
    id: 'ch-02',
    stationName: 'Benz Circle Hub - Fast 02',
    city: 'Vijayawada',
    zone: 'Benz Circle Hub',
    powerKw: 60,
    status: 'available',
    currentRateINR: 12,
  },
  {
    id: 'ch-03',
    stationName: 'Brodipet Energy Point - DC 01',
    city: 'Guntur',
    zone: 'Brodipet Energy Point',
    powerKw: 120,
    status: 'available',
    currentRateINR: 12,
  },
  {
    id: 'ch-04',
    stationName: 'Secretariat Zone - Hyper 01',
    city: 'Amaravati',
    zone: 'Secretariat Zone',
    powerKw: 150,
    status: 'charging',
    currentRateINR: 12,
    activeSessionDurationMin: 14,
  },
  {
    id: 'ch-05',
    stationName: 'Godavari Bridge Zone - AC 01',
    city: 'Rajahmundry',
    zone: 'Godavari Bridge Zone',
    powerKw: 22,
    status: 'available',
    currentRateINR: 8,
  },
  {
    id: 'ch-06',
    stationName: 'Beach Road Hub - DC 02',
    city: 'Visakhapatnam',
    zone: 'Beach Road Zone',
    powerKw: 120,
    status: 'charging',
    currentRateINR: 12,
    activeSessionDurationMin: 38,
  },
];

class OperationsService {
  async getOperationsSummary(): Promise<OperationsSummary> {
    if (ENV.IS_DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { ...DEMO_OPERATIONS_SUMMARY };
    }
    return apiClient<OperationsSummary>('/operations/summary');
  }

  async getChargerStatuses(): Promise<ChargerStatusItem[]> {
    if (ENV.IS_DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return [...DEMO_CHARGERS];
    }
    return apiClient<ChargerStatusItem[]>('/operations/chargers');
  }
}

export const operationsService = new OperationsService();
