import { ENV } from '../config/environment';
import { Vehicle } from '../types/dashboard';
import { DEMO_VEHICLES } from '../data/dashboardDemoData';
import { apiClient } from './apiClient';

class VehicleService {
  private activeVehicleId: string = DEMO_VEHICLES[0].id;

  async getUserVehicles(): Promise<Vehicle[]> {
    if (ENV.IS_DEMO_MODE) {
      await new Promise((res) => setTimeout(res, 200));
      return [...DEMO_VEHICLES];
    }
    return apiClient<Vehicle[]>('/vehicles');
  }

  async getSelectedVehicle(): Promise<Vehicle> {
    const vehicles = await this.getUserVehicles();
    const storedId = sessionStorage.getItem('vg_selected_vehicle_id') || this.activeVehicleId;
    return vehicles.find((v) => v.id === storedId) || vehicles[0];
  }

  async setSelectedVehicle(vehicleId: string): Promise<Vehicle> {
    this.activeVehicleId = vehicleId;
    sessionStorage.setItem('vg_selected_vehicle_id', vehicleId);
    return this.getSelectedVehicle();
  }
}

export const vehicleService = new VehicleService();
