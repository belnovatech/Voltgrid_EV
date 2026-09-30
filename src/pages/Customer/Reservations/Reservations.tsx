import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerLayout } from '../../../components/customer/CustomerLayout/CustomerLayout';
import { customerService } from '../../../services/customerService';
import { chargingSessionService } from '../../../services/chargingSessionService';
import { CustomerReservation, CustomerVehicle } from '../../../types/customer';
import { ChargerQRPayload } from '../../../types/charging';
import { ReservationCard } from './components/ReservationCard/ReservationCard';
import { NewReservation } from './components/NewReservation/NewReservation';
import { QRScannerModal } from '../Charging/components/QRScannerModal/QRScannerModal';
import { ChargerFoundModal } from '../Charging/components/ChargerFoundModal/ChargerFoundModal';
import { SessionDetailsModal } from './components/SessionDetailsModal/SessionDetailsModal';
import './Reservations.css';

export const Reservations: React.FC = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<CustomerReservation[]>([]);
  const [vehicles, setVehicles] = useState<CustomerVehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // QR Scanning & Charger Found States
  const [scanningReservation, setScanningReservation] = useState<CustomerReservation | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [detectedCharger, setDetectedCharger] = useState<ChargerQRPayload | null>(null);
  const [viewingSessionReservation, setViewingSessionReservation] = useState<CustomerReservation | null>(null);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const [res, vehs] = await Promise.all([
        customerService.getReservations(),
        customerService.getVehicles(),
      ]);
      setReservations(res);
      setVehicles(vehs);
      if (vehs.length > 0) {
        setSelectedVehicleId(vehs.find((v) => v.isDefault)?.id || vehs[0].id);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      await customerService.cancelReservation(id);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r))
      );
      setToastMessage('Reservation has been cancelled.');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleStartCharging = (id: string) => {
    const target = reservations.find((r) => r.id === id);
    if (!target) return;

    // If reservation is already active and session is running, navigate directly to live charging
    if (target.status === 'active' && chargingSessionService.hasActiveSession()) {
      navigate('/customer/charging');
      return;
    }

    // Otherwise open QR Scanner
    setScanningReservation(target);
    setIsScannerOpen(true);
  };

  const handleViewSession = (id: string) => {
    const target = reservations.find((r) => r.id === id);
    if (!target) return;

    // If an active session is currently running for this, navigate directly or open modal
    setViewingSessionReservation(target);
  };

  const handleOpenLiveFromSessionModal = async (res: CustomerReservation) => {
    setViewingSessionReservation(null);

    // If session is already running, navigate directly
    if (chargingSessionService.hasActiveSession()) {
      navigate('/customer/charging');
      return;
    }

    // Otherwise initialize session for this active reservation
    const chosenVehicle =
      vehicles.find((v) => v.name.toLowerCase() === res.vehicleName?.toLowerCase()) ||
      vehicles.find((v) => v.isDefault) ||
      vehicles[0];

    const chargerPayload: ChargerQRPayload = {
      chargerId: res.chargerId || 'CH-028',
      stationId: res.stationId || 'st-tpt-01',
      stationName: res.stationName,
      location: `${res.city}, Andhra Pradesh`,
      connectorType: res.chargerType.includes('CCS2') ? 'CCS2' : 'Type 2',
      powerKw: res.powerKw || 60,
      ratePerKwh: res.ratePerKWh || 8,
      isAvailable: true,
    };

    await chargingSessionService.startSession({
      charger: chargerPayload,
      vehicle: chosenVehicle,
      reservation: res,
    });

    navigate('/customer/charging');
  };

  const handleChargerDetected = (charger: ChargerQRPayload) => {
    setIsScannerOpen(false);
    setDetectedCharger(charger);
  };

  const handleConfirmStartCharging = async () => {
    if (!detectedCharger) return;

    const chosenVehicle =
      vehicles.find((v) => v.id === selectedVehicleId) ||
      vehicles.find((v) => v.isDefault) ||
      vehicles[0];

    await chargingSessionService.startSession({
      charger: detectedCharger,
      vehicle: chosenVehicle,
      reservation: scanningReservation || undefined,
    });

    // Update local reservation status to active
    if (scanningReservation) {
      setReservations((prev) =>
        prev.map((r) => (r.id === scanningReservation.id ? { ...r, status: 'active' } : r))
      );
    }

    setDetectedCharger(null);
    setScanningReservation(null);

    // Navigate to live charging screen
    navigate('/customer/charging');
  };

  const handleReservationCreated = (newRes: CustomerReservation) => {
    setReservations((prev) => [newRes, ...prev]);
    setToastMessage(`Reservation confirmed for ${newRes.stationName}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const upcomingCount = reservations.filter((r) => r.status === 'upcoming').length;

  if (isWizardOpen) {
    return (
      <CustomerLayout>
        <NewReservation
          onClose={() => setIsWizardOpen(false)}
          onSuccess={handleReservationCreated}
        />
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="pg-reservations-page">
        {toastMessage && (
          <div className="pg-reservations__toast" role="alert">
            <span>⚡ {toastMessage}</span>
          </div>
        )}

        {/* Header matching Screenshot 1 */}
        <div className="pg-reservations__header">
          <div className="pg-reservations__header-left">
            <h1 className="pg-reservations__title">Reservations</h1>
            <p className="pg-reservations__subtitle">{upcomingCount} upcoming</p>
          </div>

          <button
            type="button"
            className="pg-reservations__new-btn"
            onClick={() => setIsWizardOpen(true)}
            aria-label="Create new charging reservation"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>New Reservation</span>
          </button>
        </div>

        {/* Content list */}
        {isLoading ? (
          <div className="pg-reservations__loading">
            <div className="pg-reservations__spinner" />
            <p>Loading your reservations...</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="pg-reservations__empty">
            <div className="pg-reservations__empty-icon">📅</div>
            <h3>No reservations yet</h3>
            <p>Book guaranteed charging slots in advance at any PowerGrid hub.</p>
            <button
              type="button"
              className="pg-reservations__empty-cta"
              onClick={() => setIsWizardOpen(true)}
            >
              + Book Your First Slot
            </button>
          </div>
        ) : (
          <div className="pg-reservations__list">
            {reservations.map((res) => (
              <ReservationCard
                key={res.id}
                reservation={res}
                onStartCharging={handleStartCharging}
                onViewSession={handleViewSession}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}

        {/* Active Session Details Popup Modal */}
        <SessionDetailsModal
          isOpen={!!viewingSessionReservation}
          reservation={viewingSessionReservation}
          onClose={() => setViewingSessionReservation(null)}
          onOpenLiveScreen={handleOpenLiveFromSessionModal}
        />

        {/* QR Scanner & Confirmation Modals */}
        <QRScannerModal
          isOpen={isScannerOpen}
          reservation={scanningReservation}
          onClose={() => {
            setIsScannerOpen(false);
            setScanningReservation(null);
          }}
          onChargerDetected={handleChargerDetected}
        />

        <ChargerFoundModal
          charger={detectedCharger}
          reservation={scanningReservation}
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={setSelectedVehicleId}
          onConfirmStart={handleConfirmStartCharging}
          onRescan={() => {
            setDetectedCharger(null);
            setIsScannerOpen(true);
          }}
          onClose={() => {
            setDetectedCharger(null);
            setScanningReservation(null);
          }}
        />
      </div>
    </CustomerLayout>
  );
};
