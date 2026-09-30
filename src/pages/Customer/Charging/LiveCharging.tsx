import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CustomerLayout } from '../../../components/customer/CustomerLayout/CustomerLayout';
import { chargingSessionService } from '../../../services/chargingSessionService';
import { customerService } from '../../../services/customerService';
import {
  ChargingSession,
  ChargingSummaryData,
  ChargerQRPayload,
} from '../../../types/charging';
import { CustomerReservation, CustomerVehicle } from '../../../types/customer';
import { ChargingProgressRing } from './components/ChargingProgressRing/ChargingProgressRing';
import { ChargingMetrics } from './components/ChargingMetrics/ChargingMetrics';
import { ChargingVehicleCard } from './components/ChargingVehicleCard/ChargingVehicleCard';
import { ChargingStationCard } from './components/ChargingStationCard/ChargingStationCard';
import { StopChargingDialog } from './components/StopChargingDialog/StopChargingDialog';
import { ChargingSummaryModal } from './components/ChargingSummaryModal/ChargingSummaryModal';
import { QRScannerModal } from './components/QRScannerModal/QRScannerModal';
import { ChargerFoundModal } from './components/ChargerFoundModal/ChargerFoundModal';
import './LiveCharging.css';

export const LiveCharging: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] = useState<ChargingSession | null>(null);
  const [summary, setSummary] = useState<ChargingSummaryData | null>(null);
  const [isStopDialogOpen, setIsStopDialogOpen] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [detectedCharger, setDetectedCharger] = useState<ChargerQRPayload | null>(null);
  const [vehicles, setVehicles] = useState<CustomerVehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  // Check navigation state for incoming start request (from Reservations or Dashboard)
  const incomingReservation = (location.state as { reservation?: CustomerReservation })?.reservation;

  useEffect(() => {
    // Load vehicles
    customerService.getVehicles().then((vehs) => {
      setVehicles(vehs);
      if (vehs.length > 0) {
        setSelectedVehicleId(vehs.find((v) => v.isDefault)?.id || vehs[0].id);
      }
    });

    // Subscribe to charging session service
    const unsubscribe = chargingSessionService.subscribe((current) => {
      setSession(current);
    });

    // Check if a completed summary is waiting to be shown
    const lastSummary = chargingSessionService.getLatestSummary();
    if (!chargingSessionService.hasActiveSession() && lastSummary) {
      setSummary(lastSummary);
    }

    // If navigated with startScan flag, open scanner immediately
    if ((location.state as { openScanner?: boolean })?.openScanner) {
      setIsScannerOpen(true);
    }

    return () => {
      unsubscribe();
    };
  }, [location.state]);

  const handleChargerDetected = (charger: ChargerQRPayload) => {
    setIsScannerOpen(false);
    setDetectedCharger(charger);
  };

  const handleConfirmStartCharging = async () => {
    if (!detectedCharger) return;

    const chosenVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
    const newSession = await chargingSessionService.startSession({
      charger: detectedCharger,
      vehicle: chosenVehicle,
      reservation: incomingReservation,
    });

    setDetectedCharger(null);
    setSession(newSession);
    setSummary(null);
  };

  const handleConfirmStopSession = async () => {
    setIsStopDialogOpen(false);
    const finalSummary = await chargingSessionService.stopSession();
    if (finalSummary) {
      setSummary(finalSummary);
    }
  };

  const handleDoneSummary = () => {
    chargingSessionService.clearSummary();
    setSummary(null);
    navigate('/customer/reservations');
  };

  const handleViewHistory = () => {
    chargingSessionService.clearSummary();
    setSummary(null);
    navigate('/customer/history');
  };

  return (
    <CustomerLayout dark={true}>
      <div className="voltgrid-charging-page">
        {session && (
          <div className="voltgrid-charging-container">
            {/* Header: Live Charging Session & Charger Title */}
            <header className="voltgrid-charging-header">
              <div className="voltgrid-charging-header__left">
                <span className="voltgrid-charging-header__sub">
                  Live Charging Session
                </span>
                <h1 className="voltgrid-charging-header__title">
                  {session.chargerId} · {session.stationName}
                </h1>
              </div>

              <div className="voltgrid-charging-status-badge">
                <span className="voltgrid-charging-status-badge__dot" />
                <span>CHARGING</span>
              </div>
            </header>

            {/* Main Center Area */}
            <main className="voltgrid-charging-main">
              {/* Circular Progress Ring */}
              <ChargingProgressRing
                energyDeliveredKwh={session.energyDeliveredKwh}
                powerKw={session.powerKw}
                batteryPercentage={session.batteryPercentage}
              />

              {/* Dynamic Info Cards Stack */}
              <div className="voltgrid-charging-stack">
                {/* 3 Metric Cards + Wallet */}
                <ChargingMetrics
                  durationSeconds={session.durationSeconds}
                  currentCost={session.currentCost}
                  ratePerKwh={session.ratePerKwh}
                  walletRemaining={session.walletRemaining}
                />

                {/* Connected Vehicle Card */}
                <ChargingVehicleCard
                  vehicleName={session.vehicleName}
                  vehicleBatteryCapacityKWh={session.vehicleBatteryCapacityKWh}
                  connectorType={session.connectorType}
                  batteryPercentage={session.batteryPercentage}
                />

                {/* Station Location Card */}
                <ChargingStationCard
                  stationName={session.stationName}
                  chargerId={session.chargerId}
                  location={session.location}
                />

                {/* Pulsing Energy Transfer Bars */}
                <div className="voltgrid-charging-power-bars" aria-hidden="true">
                  <div className="voltgrid-charging-power-bar" />
                  <div className="voltgrid-charging-power-bar" />
                  <div className="voltgrid-charging-power-bar" />
                  <div className="voltgrid-charging-power-bar" />
                  <div className="voltgrid-charging-power-bar" />
                </div>

                {/* Stop Charging Button */}
                <div className="voltgrid-stop-charging-action-wrap">
                  <button
                    type="button"
                    className="voltgrid-stop-charging-trigger-btn"
                    onClick={() => setIsStopDialogOpen(true)}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                    </svg>
                    <span>Stop Charging</span>
                  </button>
                </div>
              </div>
            </main>
          </div>
        )}

        {/* Empty / Idle State when no session is active */}
        {!session && (
          <div className="voltgrid-charging-empty">
            <div className="voltgrid-charging-empty__icon">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h2 className="voltgrid-charging-empty__title">Ready to Charge</h2>
            <p className="voltgrid-charging-empty__text">
              Scan the QR code on any PowerGrid station or select an upcoming reservation to initiate high-speed charging.
            </p>
            <button
              type="button"
              className="voltgrid-charging-scan-btn"
              onClick={() => setIsScannerOpen(true)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
              <span>Scan QR Code to Charge</span>
            </button>
          </div>
        )}

        {/* Modals & Dialogs */}
        <QRScannerModal
          isOpen={isScannerOpen}
          reservation={incomingReservation}
          onClose={() => setIsScannerOpen(false)}
          onChargerDetected={handleChargerDetected}
        />

        <ChargerFoundModal
          charger={detectedCharger}
          reservation={incomingReservation}
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={setSelectedVehicleId}
          onConfirmStart={handleConfirmStartCharging}
          onRescan={() => {
            setDetectedCharger(null);
            setIsScannerOpen(true);
          }}
          onClose={() => setDetectedCharger(null)}
        />

        <StopChargingDialog
          isOpen={isStopDialogOpen}
          session={session}
          onContinue={() => setIsStopDialogOpen(false)}
          onConfirmStop={handleConfirmStopSession}
        />

        <ChargingSummaryModal
          summary={summary}
          onDone={handleDoneSummary}
          onViewHistory={handleViewHistory}
        />
      </div>
    </CustomerLayout>
  );
};
export default LiveCharging;
