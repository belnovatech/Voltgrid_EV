import React from 'react';
import { useReservationFlow } from '../../hooks/useReservationFlow';
import { SelectStation } from './steps/SelectStation/SelectStation';
import { SelectCharger } from './steps/SelectCharger/SelectCharger';
import { SelectVehicle } from './steps/SelectVehicle/SelectVehicle';
import { ScheduleReservation } from './steps/ScheduleReservation/ScheduleReservation';
import { ConfirmReservation } from './steps/ConfirmReservation/ConfirmReservation';
import { SuccessReservation } from './steps/SuccessReservation/SuccessReservation';
import { CustomerReservation } from '../../../../../types/customer';
import './NewReservation.css';

interface NewReservationProps {
  onClose: () => void;
  onSuccess: (newReservation: CustomerReservation) => void;
}

const STEP_TITLES: Record<number, string> = {
  1: 'Select Station',
  2: 'Select Charger',
  3: 'Select Vehicle',
  4: 'Date & Time',
  5: 'Confirm Reservation',
  6: 'Reservation Confirmed',
};

export const NewReservation: React.FC<NewReservationProps> = ({ onClose, onSuccess }) => {
  const {
    step,
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
  } = useReservationFlow(onSuccess);

  const handleCloseAttempt = () => {
    if (step > 1 && step < 6) {
      if (window.confirm('Discard current reservation draft?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="pg-new-res">
      {/* Top Header */}
      <div className="pg-new-res__header">
        <div className="pg-new-res__header-top">
          <button
            type="button"
            className="pg-new-res__close-btn"
            onClick={handleCloseAttempt}
            aria-label="Close reservation wizard"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <h2 className="pg-new-res__step-title">{STEP_TITLES[step] || 'New Reservation'}</h2>
          {step > 1 && step < 6 && (
            <button
              type="button"
              className="pg-new-res__back-header-btn"
              onClick={handleGoBack}
              aria-label="Go back to previous step"
            >
              Back
            </button>
          )}
        </div>

        {/* 5-Step Segmented Progress Bar */}
        {step <= 5 && (
          <div className="pg-new-res__progress-wrap">
            <div className="pg-new-res__progress-bars">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`pg-new-res__progress-segment ${
                    s <= step ? 'pg-new-res__progress-segment--active' : ''
                  }`}
                />
              ))}
            </div>
            <div className="pg-new-res__step-count">Step {step} of 5</div>
          </div>
        )}
      </div>

      {/* Main Step Content Area */}
      <div className="pg-new-res__content">
        {step === 1 && (
          <SelectStation
            stations={stations}
            selectedStation={draft.station}
            isLoading={isLoadingStations}
            onSelectStation={handleSelectStation}
          />
        )}

        {step === 2 && (
          <SelectCharger
            station={draft.station}
            chargers={chargers}
            selectedCharger={draft.charger}
            isLoading={isLoadingChargers}
            onSelectCharger={handleSelectCharger}
          />
        )}

        {step === 3 && (
          <SelectVehicle
            vehicles={vehicles}
            selectedVehicle={draft.vehicle}
            isLoading={isLoadingVehicles}
            onSelectVehicle={handleSelectVehicle}
          />
        )}

        {step === 4 && (
          <ScheduleReservation
            draft={draft}
            onUpdateSchedule={handleUpdateSchedule}
            onProceed={handleProceedToConfirm}
          />
        )}

        {step === 5 && (
          <ConfirmReservation
            draft={draft}
            walletBalance={walletBalance}
            isSubmitting={isSubmitting}
            error={error}
            onConfirm={handleConfirmReservation}
            onBack={handleGoBack}
          />
        )}

        {step === 6 && createdReservation && (
          <SuccessReservation
            reservation={createdReservation}
            onViewReservations={onClose}
          />
        )}
      </div>
    </div>
  );
};
