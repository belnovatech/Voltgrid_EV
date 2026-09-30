import {
  ChargingSession,
  ChargingSummaryData,
  ChargerQRPayload,
} from '../types/charging';
import { CustomerReservation, CustomerVehicle } from '../types/customer';
import { customerService } from './customerService';

const SESSION_STORAGE_KEY = 'vg_active_charging_session';
const SUMMARY_STORAGE_KEY = 'vg_latest_charging_summary';

type SessionListener = (session: ChargingSession | null) => void;

class ChargingSessionService {
  private activeSession: ChargingSession | null = null;
  private listeners: Set<SessionListener> = new Set();
  private intervalId: number | null = null;

  constructor() {
    this.restoreSession();
  }

  private restoreSession() {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed: ChargingSession = JSON.parse(saved);
        if (parsed && parsed.status === 'CHARGING') {
          this.activeSession = parsed;
          this.startSimulationTimer();
        }
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
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.activeSession));
    } else {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
    this.listeners.forEach((listener) => listener(this.activeSession));
  }

  public getActiveSession(): ChargingSession | null {
    return this.activeSession;
  }

  public hasActiveSession(): boolean {
    return !!this.activeSession && this.activeSession.status === 'CHARGING';
  }

  /**
   * Start a new charging session starting strictly from ZERO
   */
  public async startSession(params: {
    charger: ChargerQRPayload;
    vehicle?: CustomerVehicle;
    reservation?: CustomerReservation;
  }): Promise<ChargingSession> {
    // Stop any existing session
    this.stopSimulationTimer();

    const profile = await customerService.getProfile();
    const vehicles = await customerService.getVehicles();
    
    // Determine vehicle
    let selectedVehicle = params.vehicle;
    if (!selectedVehicle && params.reservation?.vehicleName) {
      selectedVehicle = vehicles.find(
        (v) => v.name.toLowerCase() === params.reservation?.vehicleName?.toLowerCase() ||
               v.licensePlate === params.reservation?.vehiclePlate
      );
    }
    if (!selectedVehicle) {
      selectedVehicle = vehicles.find((v) => v.isDefault) || vehicles[0] || {
        id: 'veh_def',
        name: 'Tata Nexon EV',
        model: 'Nexon EV Max',
        type: 'Car',
        licensePlate: 'AP-39-AB-1234',
        batteryCapacityKWh: 40.5,
        connector: 'CCS2',
        batteryPercentage: 22,
        isDefault: true,
        ratePerKWh: 12,
      };
    }

    const initialWallet = profile.walletBalance || 1000;
    const startSoc = selectedVehicle.batteryPercentage || 20;

    const newSession: ChargingSession = {
      sessionId: `SES-${Date.now().toString().slice(-6)}`,
      reservationId: params.reservation?.id,
      chargerId: params.charger.chargerId,
      stationId: params.charger.stationId,
      stationName: params.charger.stationName,
      location: params.charger.location,
      vehicleName: selectedVehicle.name || selectedVehicle.model || 'Tata Nexon EV',
      vehiclePlate: selectedVehicle.licensePlate,
      vehicleBatteryCapacityKWh: selectedVehicle.batteryCapacityKWh || 40.5,
      vehicleStartBatteryPercentage: startSoc,
      connectorType: params.charger.connectorType || 'CCS2',
      powerKw: params.charger.powerKw || 120,
      ratePerKwh: params.charger.ratePerKwh || 12,
      energyDeliveredKwh: 0,
      durationSeconds: 0,
      currentCost: 0,
      walletRemaining: initialWallet,
      initialWalletBalance: initialWallet,
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

    // Simulation tick every 1000ms
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

  /**
   * Internal tick to increment charging parameters dynamically
   */
  private tick() {
    if (!this.activeSession || this.activeSession.status !== 'CHARGING') {
      this.stopSimulationTimer();
      return;
    }

    const session = { ...this.activeSession };
    session.durationSeconds += 1;

    // Realistic demo energy accumulation:
    // Power (kW) charging dynamic rate with slight random variance
    // In demo mode: increment energy smoothly so user sees live numbers count up
    // e.g. ~0.05 to 0.1 kWh per second simulation rate for clear visual progression
    const baseIncrement = (session.powerKw / 3600) * 1.8; // accelerated demo simulation
    const variation = (Math.random() * 0.02 - 0.01);
    const stepEnergy = Math.max(0.01, baseIncrement + variation);

    session.energyDeliveredKwh = Number((session.energyDeliveredKwh + stepEnergy).toFixed(2));
    session.currentCost = Number((session.energyDeliveredKwh * session.ratePerKwh).toFixed(2));
    session.walletRemaining = Math.max(0, Number((session.initialWalletBalance - session.currentCost).toFixed(2)));

    // Battery calculation
    const addedSoc = (session.energyDeliveredKwh / (session.vehicleBatteryCapacityKWh || 40.5)) * 100;
    session.batteryPercentage = Math.min(100, Math.round(session.vehicleStartBatteryPercentage + addedSoc));

    this.activeSession = session;
    this.notify();
  }

  /**
   * Stop the active session and generate final summary
   */
  public async stopSession(): Promise<ChargingSummaryData | null> {
    this.stopSimulationTimer();

    if (!this.activeSession) {
      return this.getLatestSummary();
    }

    const session = { ...this.activeSession };
    session.status = 'COMPLETED';
    session.stoppedAt = new Date().toISOString();

    const hours = Math.floor(session.durationSeconds / 3600);
    const mins = Math.floor((session.durationSeconds % 3600) / 60);
    const secs = session.durationSeconds % 60;
    const durationFormatted =
      hours > 0
        ? `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
        : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const summary: ChargingSummaryData = {
      sessionId: session.sessionId,
      chargerId: session.chargerId,
      stationName: session.stationName,
      location: session.location,
      vehicleName: session.vehicleName,
      vehiclePlate: session.vehiclePlate,
      energyDeliveredKwh: session.energyDeliveredKwh,
      durationSeconds: session.durationSeconds,
      durationFormatted,
      totalCost: session.currentCost,
      ratePerKwh: session.ratePerKwh,
      walletRemaining: session.walletRemaining,
      startedAt: session.startedAt,
      stoppedAt: session.stoppedAt,
      finalBatteryPercentage: session.batteryPercentage,
    };

    // Save summary to session storage
    sessionStorage.setItem(SUMMARY_STORAGE_KEY, JSON.stringify(summary));

    // Deduct cost and save history in customer service
    try {
      await customerService.updateProfile({ walletBalance: session.walletRemaining });
      if (session.reservationId) {
        // mark reservation completed
        const reservations = await customerService.getReservations();
        const target = reservations.find((r) => r.id === session.reservationId);
        if (target) {
          target.status = 'completed';
        }
      }
    } catch {
      // ignore
    }

    this.activeSession = null;
    this.notify();

    return summary;
  }

  public getLatestSummary(): ChargingSummaryData | null {
    try {
      const saved = sessionStorage.getItem(SUMMARY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  public clearSummary() {
    sessionStorage.removeItem(SUMMARY_STORAGE_KEY);
  }
}

export const chargingSessionService = new ChargingSessionService();
