import { useState, useEffect, useCallback } from 'react';
import { EVStation, ChargingPoint, stationService } from '../../../../services/stationService';
import { customerService } from '../../../../services/customerService';
import { CustomerVehicle, CustomerReservation, CustomerProfile } from '../../../../types/customer';

export interface ReservationDraft {
  station: EVStation | null;
  charger: ChargingPoint | null;
  vehicle: CustomerVehicle | null;
  date: string;
  startTime: string;
  durationMinutes: number;
  durationText: string;
  ratePerKWh: number;
  estimatedCostINR: number;
}

export const useReservationFlow = (onSuccessCallback?: (res: CustomerReservation) => void) => {
  const [step, setStep] = useState<number>(1);
  const [stations, setStations] = useState<EVStation[]>([]);
  const [chargers, setChargers] = useState<ChargingPoint[]>([]);
  const [vehicles, setVehicles] = useState<CustomerVehicle[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(1250);

  const [isLoadingStations, setIsLoadingStations] = useState<boolean>(true);
  const [isLoadingChargers, setIsLoadingChargers] = useState<boolean>(false);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [createdReservation, setCreatedReservation] = useState<CustomerReservation | null>(null);

  // Initial date formatted as YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  const [draft, setDraft] = useState<ReservationDraft>({
    station: null,
    charger: null,
    vehicle: null,
    date: todayStr,
    startTime: '14:00',
    durationMinutes: 90,
    durationText: '1.5h',
    ratePerKWh: 12,
    estimatedCostINR: 180,
  });

  // Calculate estimated cost dynamically based on duration and rate
  const computeEstimatedCost = useCallback((durationMins: number, rate: number) => {
    const hours = durationMins / 60;
    const estKWh = Math.round(hours * 10 * 10) / 10;
    const cost = Math.round(estKWh * rate);
    return Math.max(30, cost);
  }, []);

  // Fetch initial stations and vehicles
  useEffect(() => {
    setIsLoadingStations(true);
    stationService.getStations()
      .then((data: EVStation[]) => {
        setStations(data);
        setIsLoadingStations(false);
      })
      .catch(() => {
        setError('Failed to load stations. Please check your network.');
        setIsLoadingStations(false);
      });

    setIsLoadingVehicles(true);
    customerService.getVehicles()
      .then((data: CustomerVehicle[]) => {
        setVehicles(data);
        if (data.length > 0) {
          const defaultVeh = data.find((v: CustomerVehicle) => v.isDefault) || data[0];
          setDraft((prev) => ({
            ...prev,
            vehicle: defaultVeh,
            ratePerKWh: defaultVeh.ratePerKWh || 12,
            estimatedCostINR: computeEstimatedCost(prev.durationMinutes, defaultVeh.ratePerKWh || 12),
          }));
        }
        setIsLoadingVehicles(false);
      })
      .catch(() => {
        setIsLoadingVehicles(false);
      });

    customerService.getProfile().then((p: CustomerProfile) => {
      if (p?.walletBalance !== undefined) {
        setWalletBalance(p.walletBalance);
      }
    });
  }, [computeEstimatedCost]);

  // Load chargers when station is selected
  const handleSelectStation = useCallback(async (st: EVStation) => {
    if (st.availableChargers === 0 && st.status === 'full') {
      setError('This station is currently full. Please select another station.');
      return;
    }
    setError(null);
    setDraft((prev) => {
      const rate = prev.vehicle?.ratePerKWh || st.ratePerKWh || 12;
      return {
        ...prev,
        station: st,
        charger: null,
        ratePerKWh: rate,
        estimatedCostINR: computeEstimatedCost(prev.durationMinutes, rate),
      };
    });

    setIsLoadingChargers(true);
    try {
      const chList = await stationService.getChargersByStationId(st.id);
      setChargers(chList);
    } catch {
      setError('Unable to load chargers for this station.');
    } finally {
      setIsLoadingChargers(false);
    }

    setStep(2);
  }, [computeEstimatedCost]);

  // Select charger
  const handleSelectCharger = useCallback((ch: ChargingPoint) => {
    if (ch.status !== 'available') {
      return;
    }
    setError(null);
    setDraft((prev) => ({
      ...prev,
      charger: ch,
    }));
    setStep(3);
  }, []);

  // Select vehicle
  const handleSelectVehicle = useCallback((veh: CustomerVehicle) => {
    setError(null);
    const rate = veh.ratePerKWh || draft.station?.ratePerKWh || 12;
    setDraft((prev) => ({
      ...prev,
      vehicle: veh,
      ratePerKWh: rate,
      estimatedCostINR: computeEstimatedCost(prev.durationMinutes, rate),
    }));
    setStep(4);
  }, [draft.station, computeEstimatedCost]);

  // Update schedule
  const handleUpdateSchedule = useCallback((updates: {
    date?: string;
    startTime?: string;
    durationMinutes?: number;
    durationText?: string;
  }) => {
    setError(null);
    setDraft((prev) => {
      const durationMins = updates.durationMinutes !== undefined ? updates.durationMinutes : prev.durationMinutes;
      const rate = prev.ratePerKWh;
      const cost = computeEstimatedCost(durationMins, rate);
      return {
        ...prev,
        ...updates,
        estimatedCostINR: cost,
      };
    });
  }, [computeEstimatedCost]);

  // Proceed to confirm (Step 5)
  const handleProceedToConfirm = useCallback(() => {
    if (!draft.station || !draft.charger || !draft.vehicle) {
      setError('Please complete all previous selections first.');
      return;
    }
    if (!draft.date || !draft.startTime) {
      setError('Please select a valid date and start time.');
      return;
    }
    setError(null);
    setStep(5);
  }, [draft]);

  // Submit reservation to backend
  const handleConfirmReservation = useCallback(async () => {
    if (!draft.station || !draft.charger || !draft.vehicle) {
      setError('Reservation draft is incomplete.');
      return;
    }
    if (walletBalance < draft.estimatedCostINR) {
      setError(`Insufficient wallet balance (₹${walletBalance}). Please top up at least ₹${draft.estimatedCostINR - walletBalance} in Wallet.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newRes = await customerService.createReservation({
        stationId: draft.station.id,
        stationName: draft.station.name,
        city: draft.station.city,
        chargerId: draft.charger.code || draft.charger.id,
        chargerType: `${draft.charger.powerKw} kW ${draft.charger.connector}`,
        powerKw: draft.charger.powerKw,
        vehicleName: draft.vehicle.name,
        vehiclePlate: draft.vehicle.licensePlate,
        vehicleType: draft.vehicle.type,
        date: draft.date,
        timeSlot: `${draft.startTime} (${draft.durationText})`,
        startTime: draft.startTime,
        durationMinutes: draft.durationMinutes,
        durationText: draft.durationText,
        estimatedCostINR: draft.estimatedCostINR,
        ratePerKWh: draft.ratePerKWh,
        createdAt: new Date().toISOString(),
      });

      setCreatedReservation(newRes);
      setStep(6);
      if (onSuccessCallback) {
        onSuccessCallback(newRes);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to confirm reservation. Please try again.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [draft, walletBalance, onSuccessCallback]);

  // Navigate back
  const handleGoBack = useCallback(() => {
    setError(null);
    if (step > 1 && step < 6) {
      setStep((prev) => prev - 1);
    }
  }, [step]);

  // Reset / Discard
  const handleReset = useCallback(() => {
    setStep(1);
    setError(null);
    setCreatedReservation(null);
    setDraft({
      station: null,
      charger: null,
      vehicle: vehicles.find((v) => v.isDefault) || vehicles[0] || null,
      date: todayStr,
      startTime: '14:00',
      durationMinutes: 90,
      durationText: '1.5h',
      ratePerKWh: 12,
      estimatedCostINR: 180,
    });
  }, [vehicles, todayStr]);

  return {
    step,
    setStep,
    draft,
    stations,
    chargers,
    vehicles,
    walletBalance,
    isLoadingStations,
    isLoadingChargers,
    isLoadingVehicles,
    isSubmitting,
    error,
    createdReservation,
    handleSelectStation,
    handleSelectCharger,
    handleSelectVehicle,
    handleUpdateSchedule,
    handleProceedToConfirm,
    handleConfirmReservation,
    handleGoBack,
    handleReset,
  };
};
