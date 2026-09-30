import React, { useState, useEffect } from 'react';
import { CustomerLayout } from '../../../components/customer/CustomerLayout/CustomerLayout';
import { customerService } from '../../../services/customerService';
import { CustomerReservation } from '../../../types/customer';
import { ReservationCard } from './components/ReservationCard/ReservationCard';
import { NewReservation } from './components/NewReservation/NewReservation';
import './Reservations.css';

export const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<CustomerReservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const res = await customerService.getReservations();
      setReservations(res);
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
    if (target) {
      setToastMessage(`Plugged into ${target.stationName} (${target.chargerId || target.chargerType}). Charging session started!`);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'active' } : r))
      );
      setTimeout(() => setToastMessage(null), 4000);
    }
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
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};
