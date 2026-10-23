import React, { useState } from 'react';
import { ReservationDraft } from '../../../../hooks/useReservationFlow';
import { PaymentModal } from '../../../../../../../components/payment/PaymentModal/PaymentModal';
import { authoritativeWalletService } from '../../../../../../../services/walletService';
import './ConfirmReservation.css';

interface ConfirmReservationProps {
  draft: ReservationDraft;
  walletBalance: number;
  isSubmitting: boolean;
  error: string | null;
  onConfirm: () => void;
  onBack: () => void;
}

export const ConfirmReservation: React.FC<ConfirmReservationProps> = ({
  draft,
  walletBalance,
  isSubmitting,
  error,
  onConfirm,
  onBack,
}) => {
  const [currentBal, setCurrentBal] = useState<number>(walletBalance);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentMode, setPaymentMode] = useState<'wallet_topup' | 'checkout'>('wallet_topup');

  const requiredAmount = draft.estimatedCostINR || 72;
  const isBalanceLow = currentBal < requiredAmount;
  const shortfall = Math.max(0, requiredAmount - currentBal);

  const handleOpenTopup = () => {
    setPaymentMode('wallet_topup');
    setIsPaymentModalOpen(true);
  };

  const handleOpenDirectPay = () => {
    setPaymentMode('checkout');
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    const updatedBal = authoritativeWalletService.getBalance();
    setCurrentBal(updatedBal);
    setIsPaymentModalOpen(false);

    // If direct checkout was completed, proceed to confirm reservation immediately
    if (paymentMode === 'checkout') {
      onConfirm();
    }
  };

  return (
    <div className="pg-step-confirm">
      <div className="pg-step-confirm__card">
        <div className="pg-step-confirm__grid">
          <div className="pg-step-confirm__row">
            <span className="pg-step-confirm__label">Station</span>
            <span className="pg-step-confirm__value">{draft.station?.name}</span>
          </div>

          <div className="pg-step-confirm__row">
            <span className="pg-step-confirm__label">Charger</span>
            <span className="pg-step-confirm__value">
              {draft.charger?.code || 'CH-001'} · {draft.charger?.powerKw} kW ({draft.charger?.connector})
            </span>
          </div>

          <div className="pg-step-confirm__row">
            <span className="pg-step-confirm__label">Vehicle</span>
            <span className="pg-step-confirm__value">
              {draft.vehicle?.name} · {draft.vehicle?.type?.toUpperCase()}
            </span>
          </div>

          <div className="pg-step-confirm__row">
            <span className="pg-step-confirm__label">Date</span>
            <span className="pg-step-confirm__value">{draft.date}</span>
          </div>

          <div className="pg-step-confirm__row">
            <span className="pg-step-confirm__label">Time</span>
            <span className="pg-step-confirm__value">{draft.startTime}</span>
          </div>

          <div className="pg-step-confirm__row">
            <span className="pg-step-confirm__label">Duration</span>
            <span className="pg-step-confirm__value">
              {draft.durationMinutes} minutes ({draft.durationText})
            </span>
          </div>

          <div className="pg-step-confirm__row">
            <span className="pg-step-confirm__label">Rate</span>
            <span className="pg-step-confirm__value">₹{draft.ratePerKWh}/kWh</span>
          </div>

          <div className="pg-step-confirm__row pg-step-confirm__row--highlight">
            <span className="pg-step-confirm__label">Est. Cost</span>
            <span className="pg-step-confirm__value pg-step-confirm__value--cost">
              ~₹{requiredAmount}
            </span>
          </div>

          <div className="pg-step-confirm__row">
            <span className="pg-step-confirm__label">Wallet Balance</span>
            <span className={`pg-step-confirm__value ${isBalanceLow ? 'pg-step-confirm__value--low' : ''}`}>
              ₹{currentBal.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="pg-step-confirm__row">
            <span className="pg-step-confirm__label">Grace Period</span>
            <span className="pg-step-confirm__value">15 minutes</span>
          </div>
        </div>

        {/* Low Balance Warning with Instant Top-up or Direct Pay CTAs */}
        {isBalanceLow && (
          <div className="pg-step-confirm__low-balance-box">
            <div className="pg-step-confirm__low-bal-header">
              <span className="pg-step-confirm__low-bal-icon">⚠️</span>
              <div>
                <strong className="pg-step-confirm__low-bal-title">Insufficient Wallet Balance</strong>
                <p className="pg-step-confirm__low-bal-desc">
                  You need at least ₹{requiredAmount} (Shortfall: ₹{shortfall.toFixed(2)}).
                </p>
              </div>
            </div>

            <div className="pg-step-confirm__low-bal-actions">
              <button
                type="button"
                className="pg-step-confirm__topup-btn"
                onClick={handleOpenTopup}
              >
                ⚡ Top Up Wallet (+₹{Math.max(250, Math.ceil(shortfall / 100) * 100)})
              </button>
              <button
                type="button"
                className="pg-step-confirm__direct-pay-btn"
                onClick={handleOpenDirectPay}
              >
                💳 Pay Directly (UPI / Card)
              </button>
            </div>
          </div>
        )}

        <div className="pg-step-confirm__notice">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>Your charger will be held for 15 minutes after the reservation start time.</span>
        </div>

        {error && <div className="pg-step-confirm__error">{error}</div>}

        <div className="pg-step-confirm__actions">
          <button
            type="button"
            className="pg-step-confirm__back-btn"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Back
          </button>
          <button
            type="button"
            className="pg-step-confirm__submit-btn"
            onClick={onConfirm}
            disabled={isSubmitting || isBalanceLow}
          >
            {isSubmitting ? (
              <>
                <span className="pg-step-confirm__btn-spinner" />
                <span>Confirming...</span>
              </>
            ) : (
              <span>Confirm via Wallet</span>
            )}
          </button>
        </div>
      </div>

      {/* Payment Modal for Topup or Direct Pay */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        mode={paymentMode}
        defaultAmount={paymentMode === 'checkout' ? requiredAmount : Math.max(250, Math.ceil(shortfall / 100) * 100)}
        orderTitle={paymentMode === 'checkout' ? 'Reserve Charger Slot' : 'Top Up Wallet for Reservation'}
        orderDescription={`${draft.station?.name || 'EV Station'} · ${draft.startTime} (${draft.durationText})`}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
