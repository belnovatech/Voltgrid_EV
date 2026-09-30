import { ENV } from '../config/environment';
import { DashboardSummary, NearbyZone } from '../types/dashboard';
import { DEMO_DASHBOARD_SUMMARY, DEMO_NEARBY_ZONES } from '../data/dashboardDemoData';
import { vehicleService } from './vehicleService';
import { apiClient } from './apiClient';

class DashboardService {
  async getDashboardSummary(): Promise<DashboardSummary> {
    if (ENV.IS_DEMO_MODE) {
      // Simulate realistic API latency
      await new Promise((res) => setTimeout(res, 350));
      const currentVehicle = await vehicleService.getSelectedVehicle();
      return {
        ...DEMO_DASHBOARD_SUMMARY,
        currentVehicle,
      };
    }
    return apiClient<DashboardSummary>('/dashboard/summary');
  }

  async getNearbyZones(): Promise<NearbyZone[]> {
    if (ENV.IS_DEMO_MODE) {
      await new Promise((res) => setTimeout(res, 250));
      return [...DEMO_NEARBY_ZONES];
    }
    return apiClient<NearbyZone[]>('/zones/nearby');
  }

  async getWalletBalance(): Promise<number> {
    if (ENV.IS_DEMO_MODE) {
      return DEMO_DASHBOARD_SUMMARY.walletBalance;
    }
    const res = await apiClient<{ balance: number }>('/wallet/balance');
    return res.balance;
  }
}

export const dashboardService = new DashboardService();
