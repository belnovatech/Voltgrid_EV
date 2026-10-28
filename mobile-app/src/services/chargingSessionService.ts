import { ChargingSession, ChargingSummaryData, ChargerQRPayload } from '../types/charging';
import { CustomerVehicle, CustomerReservation } from '../types/customer';
import { walletService } from './walletService';
import { customerService } from './customerService';

const SESSION_STORAGE_KEY = 'vg_mob_active_session';
const SUMMARY_STORAGE_KEY = 'vg_mob_latest_summary';

type SessionListener = (session: ChargingSession | null) => void;

class ChargingSessionService {
  private activeSession: ChargingSession | null = null;
  private latestSummary: ChargingSummaryData | null = null;
  private listeners: Set<SessionListener> = new Set();
  private intervalId: number | null = null;

  constructor() {
    this.restoreSession();
  }

  private restoreSession() {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed: ChargingSession = JSON.parse(saved);
        if (parsed && parsed.status === 'CHARGING') {
          this.activeSession = parsed;
          this.startSimulationTimer();
        }
      }
      const sum = localStorage.getItem(SUMMARY_STORAGE_KEY) || sessionStorage.getItem(SUMMARY_STORAGE_KEY);
      if (sum) {
        this.latestSummary = JSON.parse(sum);
      }
    } catch {
      this.activeSession = null;
    }
  }

  public subscribe(listener: SessionListener): () => void {
    this.listeners.add(listener);
    listener(this.activeSession);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    if (this.activeSession) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.activeSession));
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.activeSession));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
    this.listeners.forEach((listener) => listener(this.activeSession));
  }

  public getActiveSession(): ChargingSession | null {
    return this.activeSession;
  }

  public getLatestSummary(): ChargingSummaryData | null {
    return this.latestSummary;
  }

  public hasActiveSession(): boolean {
    return !!this.activeSession && this.activeSession.status === 'CHARGING';
  }

  public async startSession(params: {
    charger: ChargerQRPayload;
    vehicle?: CustomerVehicle;
    reservation?: CustomerReservation;
  }): Promise<ChargingSession> {
    this.stopSimulationTimer();

    const vehicles = await customerService.getVehicles();
    const selectedVehicle =
      params.vehicle ||
      vehicles.find((v) => v.isDefault) ||
      vehicles[0] || {
        id: 'veh_def',
        name: 'Tata Nexon EV Max',
        model: 'Nexon EV Max',
        type: 'Car' as const,
        licensePlate: 'AP 39 AB 1234',
        batteryCapacityKWh: 40.5,
        connector: 'CCS2' as const,
        batteryPercentage: 24,
        isDefault: true,
        ratePerKWh: 12,
      };

    const walletBal = walletService.getBalance();
    const startSoc = selectedVehicle.batteryPercentage || 24;

    const newSession: ChargingSession = {
      sessionId: `SES-${Date.now().toString().slice(-6)}`,
      reservationId: params.reservation?.id,
      chargerId: params.charger.chargerId,
      stationId: params.charger.stationId,
      stationName: params.charger.stationName,
      location: params.charger.location,
      vehicleName: selectedVehicle.name || selectedVehicle.model,
      vehiclePlate: selectedVehicle.licensePlate,
      vehicleBatteryCapacityKWh: selectedVehicle.batteryCapacityKWh || 40.5,
      vehicleStartBatteryPercentage: startSoc,
      connectorType: params.charger.connectorType || 'CCS2',
      powerKw: params.charger.powerKw || 120,
      ratePerKwh: params.charger.ratePerKwh || 12,
      energyDeliveredKwh: 0,
      durationSeconds: 0,
      currentCost: 0,
      walletRemaining: walletBal,
      initialWalletBalance: walletBal,
      batteryPercentage: startSoc,
      status: 'CHARGING',
      startedAt: new Date().toISOString(),
    };

    this.activeSession = newSession;
    this.notify();
    this.startSimulationTimer();

    return newSession;
  }

  private startSimulationTimer() {
    this.stopSimulationTimer();

    this.intervalId = window.setInterval(() => {
      this.tick();
    }, 1000);
  }

  private stopSimulationTimer() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tick() {
    if (!this.activeSession || this.activeSession.status !== 'CHARGING') {
      this.stopSimulationTimer();
      return;
    }

    const cur = this.activeSession;
    const duration = cur.durationSeconds + 1;

    // Delivery calculation: powerKw scaled for simulation (fast demonstration rate)
    // 1 second delivered = (powerKw / 3600) * 8 for responsive demo feedback
    const speedMultiplier = 12;
    const energyIncrement = (cur.powerKw / 3600) * speedMultiplier;
    const energy = Math.round((cur.energyDeliveredKwh + energyIncrement) * 100) / 100;

    const cost = Math.round(energy * cur.ratePerKwh * 100) / 100;
    const remainingWallet = Math.max(0, Math.round((cur.initialWalletBalance - cost) * 100) / 100);

    // Battery percentage calculation
    const addedSoc = (energy / cur.vehicleBatteryCapacityKWh) * 100;
    const newSoc = Math.min(100, Math.round(cur.vehicleStartBatteryPercentage + addedSoc));

    // Auto-stop conditions: battery reaches 100% or wallet empty
    if (newSoc >= 100 || (remainingWallet <= 0 && cur.initialWalletBalance > 0)) {
      this.stopSession();
      return;
    }

    this.activeSession = {
      ...cur,
      durationSeconds: duration,
      energyDeliveredKwh: energy,
      currentCost: cost,
      walletRemaining: remainingWallet,
      batteryPercentage: newSoc,
    };

    this.notify();
  }

  public async stopSession(): Promise<ChargingSummaryData> {
    this.stopSimulationTimer();

    if (!this.activeSession) {
      if (this.latestSummary) return this.latestSummary;
      throw new Error('No active charging session to stop.');
    }

    const s = this.activeSession;
    const stoppedAt = new Date().toISOString();

    const minutes = Math.floor(s.durationSeconds / 60);
    const seconds = s.durationSeconds % 60;
    const durationFormatted = `${minutes}m ${seconds}s`;

    const summary: ChargingSummaryData = {
      sessionId: s.sessionId,
      chargerId: s.chargerId,
      stationName: s.stationName,
      location: s.location,
      vehicleName: s.vehicleName,
      vehiclePlate: s.vehiclePlate,
      energyDeliveredKwh: s.energyDeliveredKwh,
      durationSeconds: s.durationSeconds,
      durationFormatted,
      totalCost: s.currentCost,
      ratePerKwh: s.ratePerKwh,
      walletRemaining: s.walletRemaining,
      startedAt: s.startedAt,
      stoppedAt,
      finalBatteryPercentage: s.batteryPercentage,
    };

    this.latestSummary = summary;
    localStorage.setItem(SUMMARY_STORAGE_KEY, JSON.stringify(summary));
    sessionStorage.setItem(SUMMARY_STORAGE_KEY, JSON.stringify(summary));

    // Deduct cost from wallet
    if (s.currentCost > 0) {
      walletService.debit(s.currentCost, `${s.stationName} · ${s.energyDeliveredKwh} kWh`);
    }

    // Add record to customer history
    await customerService.addChargingHistoryItem({
      id: `ch-${s.sessionId}`,
      stationName: s.stationName,
      city: s.location.split(',')[0],
      chargerId: s.chargerId,
      date: 'Just now',
      startTime: new Date(s.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date(stoppedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      energyConsumedKWh: s.energyDeliveredKwh,
      durationMinutes: Math.max(1, Math.round(s.durationSeconds / 60)),
      ratePerKWh: s.ratePerKwh,
      totalCostINR: s.currentCost,
      vehicleName: s.vehicleName,
      vehiclePlate: s.vehiclePlate,
      status: 'completed',
    });

    this.activeSession = null;
    this.notify();

    return summary;
  }
}

export const chargingSessionService = new ChargingSessionService();
