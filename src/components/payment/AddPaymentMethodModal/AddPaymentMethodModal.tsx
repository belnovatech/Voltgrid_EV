import React, { useState, useMemo } from 'react';
import {
  CardBrand,
  SavedPaymentMethod,
} from '../../../types/payment';
import {
  detectCardBrand,
  validateLuhn,
  validateExpiry,
  validateUpiVpa,
  paymentGatewayService,
  POPULAR_BANKS,
} from '../../../services/paymentGatewayService';
import './AddPaymentMethodModal.css';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newMethod: SavedPaymentMethod) => void;
}

export const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'upi' | 'netbanking'>('card');

  // Card Form State
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardholderName, setCardholderName] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [setAsDefault, setSetAsDefault] = useState<boolean>(true);

  // UPI Form State
  const [upiVpa, setUpiVpa] = useState<string>('');

  // Net Banking State
  const [selectedBankCode, setSelectedBankCode] = useState<string>('HDFC');

  // UI & Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Live Card Brand Detection
  const detectedBrand: CardBrand = useMemo(() => {
    return detectCardBrand(cardNumber);
  }, [cardNumber]);

  // Format Card Number (adds space every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: '' }));
    }
  };

  // Format Card Expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setCardExpiry(raw);
    if (errors.cardExpiry) {
      setErrors((prev) => ({ ...prev, cardExpiry: '' }));
    }
  };

  // Validate Card Form
  const validateCard = (): boolean => {
    const newErrors: Record<string, string> = {};
    const digits = cardNumber.replace(/\D/g, '');

    if (!digits) {
      newErrors.cardNumber = 'Card number is required.';
    } else if (digits.length < 13 || !validateLuhn(digits)) {
      newErrors.cardNumber = 'Please enter a valid credit or debit card number.';
    }

    if (!cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required.';
    }

    const [mm, yy] = cardExpiry.split('/');
    if (!mm || !yy || !validateExpiry(mm, yy)) {
      newErrors.cardExpiry = 'Enter a valid expiry date (MM/YY).';
    }

    if (!cardCvv || cardCvv.length < 3 || cardCvv.length > 4) {
      newErrors.cardCvv = 'CVV must be 3 or 4 digits.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate UPI Form
  const validateUpi = (): boolean => {
    const newErrors: Record<string, string> = {};
    const clean = upiVpa.trim();
    if (!clean) {
      newErrors.upiVpa = 'UPI ID is required.';
    } else if (!validateUpiVpa(clean)) {
      newErrors.upiVpa = 'Invalid UPI ID format (e.g. mobile@upi or name@okbank).';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'card') {
      if (!validateCard()) return;
      setIsSubmitting(true);
      try {
        await new Promise((res) => setTimeout(res, 500));
        const [mm, yy] = cardExpiry.split('/');
        const newMethod = paymentGatewayService.addSavedCard({
          cardNumber,
          cardholderName: cardholderName.trim().toUpperCase(),
          expiryMonth: mm,
          expiryYear: yy,
          cvv: cardCvv,
          brand: detectedBrand,
          saveCard: true,
        });

        if (setAsDefault) {
          paymentGatewayService.setDefaultMethod(newMethod.id);
          newMethod.isDefault = true;
        }

        setIsSubmitting(false);
        onSuccess(newMethod);
        handleClose();
      } catch {
        setErrors({ general: 'Failed to save card. Please check your details.' });
        setIsSubmitting(false);
      }
    } else if (activeTab === 'upi') {
      if (!validateUpi()) return;
      setIsSubmitting(true);
      try {
        await new Promise((res) => setTimeout(res, 400));
        const newMethod = paymentGatewayService.addSavedUpi(upiVpa.trim().toLowerCase());
        if (setAsDefault) {
          paymentGatewayService.setDefaultMethod(newMethod.id);
          newMethod.isDefault = true;
        }
        setIsSubmitting(false);
        onSuccess(newMethod);
        handleClose();
      } catch {
        setErrors({ general: 'Failed to verify UPI address. Please try again.' });
        setIsSubmitting(false);
      }
    } else if (activeTab === 'netbanking') {
      setIsSubmitting(true);
      await new Promise((res) => setTimeout(res, 350));
      const bank = POPULAR_BANKS.find((b) => b.code === selectedBankCode);
      const newMethod: SavedPaymentMethod = {
        id: `spm_nb_${Date.now()}`,
        type: 'netbanking',
        title: `${bank?.name || 'HDFC Bank'} Net Banking`,
        subtitle: `Bank Code: ${selectedBankCode}`,
        isDefault: setAsDefault,
      };
      // Save to localStorage
      const existing = paymentGatewayService.getSavedMethods();
      existing.push(newMethod);
      if (setAsDefault) {
        paymentGatewayService.setDefaultMethod(newMethod.id);
      }
      setIsSubmitting(false);
      onSuccess(newMethod);
      handleClose();
    }
  };

  const handleClose = () => {
    setCardNumber('');
    setCardholderName('');
    setCardExpiry('');
    setCardCvv('');
    setUpiVpa('');
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const renderBrandBadge = () => {
    switch (detectedBrand) {
      case 'visa':
        return <span className="eway-apm__brand-pill eway-apm__brand-pill--visa">VISA</span>;
      case 'mastercard':
        return <span className="eway-apm__brand-pill eway-apm__brand-pill--mc">Mastercard</span>;
      case 'rupay':
        return <span className="eway-apm__brand-pill eway-apm__brand-pill--rupay">RuPay</span>;
      case 'amex':
        return <span className="eway-apm__brand-pill eway-apm__brand-pill--amex">AMEX</span>;
      default:
        return <span className="eway-apm__brand-pill eway-apm__brand-pill--card">💳 Card</span>;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="eway-apm-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="eway-apm-title"
    >
      <div className="eway-apm-modal">
        {/* Header */}
        <div className="eway-apm-header">
          <div className="eway-apm-header-left">
            <div className="eway-apm-logo-icon">
              <img src="/eway-logo.png" alt="Eway to Your EVs" />
            </div>
            <div>
              <span className="eway-apm-eyebrow">FAST & SECURE PAYMENT METHOD</span>
              <h2 id="eway-apm-title" className="eway-apm-title">
                Add New Payment Method
              </h2>
            </div>
          </div>
          <button
            type="button"
            className="eway-apm-close"
            onClick={handleClose}
            aria-label="Close dialog"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        {/* Method Switcher Tabs */}
        <div className="eway-apm-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'card'}
            className={`eway-apm-tab ${activeTab === 'card' ? 'eway-apm-tab--active' : ''}`}
            onClick={() => setActiveTab('card')}
          >
            <span className="eway-apm-tab-icon">💳</span>
            <span>Credit / Debit Card</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'upi'}
            className={`eway-apm-tab ${activeTab === 'upi' ? 'eway-apm-tab--active' : ''}`}
            onClick={() => setActiveTab('upi')}
          >
            <span className="eway-apm-tab-icon">📱</span>
            <span>UPI ID / VPA</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'netbanking'}
            className={`eway-apm-tab ${activeTab === 'netbanking' ? 'eway-apm-tab--active' : ''}`}
            onClick={() => setActiveTab('netbanking')}
          >
            <span className="eway-apm-tab-icon">🏦</span>
            <span>Net Banking</span>
          </button>
        </div>

        {errors.general && (
          <div className="eway-apm-alert eway-apm-alert--error" role="alert">
            <span>⚠️ {errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="eway-apm-body">
          {/* TAB 1: CARD FORM */}
          {activeTab === 'card' && (
            <div className="eway-apm-card-form">
              <div className="eway-apm-field">
                <label htmlFor="eway-apm-cardholder" className="eway-apm-label">
                  CARDHOLDER NAME
                </label>
                <input
                  id="eway-apm-cardholder"
                  type="text"
                  placeholder="e.g. BALA KRISHNA"
                  value={cardholderName}
                  onChange={(e) => {
                    setCardholderName(e.target.value.toUpperCase());
                    if (errors.cardholderName) {
                      setErrors((prev) => ({ ...prev, cardholderName: '' }));
                    }
                  }}
                  className={`eway-apm-input ${errors.cardholderName ? 'eway-apm-input--error' : ''}`}
                  autoComplete="cc-name"
                />
                {errors.cardholderName && (
                  <span className="eway-apm-error-msg">{errors.cardholderName}</span>
                )}
              </div>

              <div className="eway-apm-field">
                <div className="eway-apm-label-row">
                  <label htmlFor="eway-apm-cardnumber" className="eway-apm-label">
                    CARD NUMBER
                  </label>
                  {renderBrandBadge()}
                </div>
                <div className="eway-apm-input-wrap">
                  <input
                    id="eway-apm-cardnumber"
                    type="tel"
                    inputMode="numeric"
                    placeholder="4242 •••• •••• 4242"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className={`eway-apm-input ${errors.cardNumber ? 'eway-apm-input--error' : ''}`}
                    autoComplete="cc-number"
                  />
                  <span className="eway-apm-lock-icon" title="Secured with 256-bit encryption">
                    🔒
                  </span>
                </div>
                {errors.cardNumber && (
                  <span className="eway-apm-error-msg">{errors.cardNumber}</span>
                )}
              </div>

              <div className="eway-apm-row">
                <div className="eway-apm-field eway-apm-col">
                  <label htmlFor="eway-apm-expiry" className="eway-apm-label">
                    EXPIRY (MM/YY)
                  </label>
                  <input
                    id="eway-apm-expiry"
                    type="tel"
                    inputMode="numeric"
                    placeholder="MM / YY"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    className={`eway-apm-input ${errors.cardExpiry ? 'eway-apm-input--error' : ''}`}
                    autoComplete="cc-exp"
                  />
                  {errors.cardExpiry && (
                    <span className="eway-apm-error-msg">{errors.cardExpiry}</span>
                  )}
                </div>

                <div className="eway-apm-field eway-apm-col">
                  <label htmlFor="eway-apm-cvv" className="eway-apm-label">
                    CVV / CVC
                  </label>
                  <input
                    id="eway-apm-cvv"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="•••"
                    value={cardCvv}
                    onChange={(e) => {
                      setCardCvv(e.target.value.replace(/\D/g, ''));
                      if (errors.cardCvv) {
                        setErrors((prev) => ({ ...prev, cardCvv: '' }));
                      }
                    }}
                    className={`eway-apm-input ${errors.cardCvv ? 'eway-apm-input--error' : ''}`}
                    autoComplete="cc-csc"
                  />
                  {errors.cardCvv && (
                    <span className="eway-apm-error-msg">{errors.cardCvv}</span>
                  )}
                </div>
              </div>

              <div className="eway-apm-checkbox-row">
                <label className="eway-apm-checkbox-label">
                  <input
                    type="checkbox"
                    checked={setAsDefault}
                    onChange={(e) => setSetAsDefault(e.target.checked)}
                    className="eway-apm-checkbox"
                  />
                  <span>Set this as my default payment method</span>
                </label>
              </div>

              <div className="eway-apm-security-note">
                <span className="eway-apm-shield">🛡️</span>
                <p>
                  <strong>Zero Raw Storage:</strong> We tokenize card details using RBI-compliant
                  tokenization standards. Your CVV is never stored.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: UPI FORM */}
          {activeTab === 'upi' && (
            <div className="eway-apm-upi-form">
              <div className="eway-apm-field">
                <label htmlFor="eway-apm-upi" className="eway-apm-label">
                  ENTER UPI ID / VPA
                </label>
                <div className="eway-apm-input-wrap">
                  <input
                    id="eway-apm-upi"
                    type="text"
                    placeholder="e.g. mobile@okhdfcbank or yourname@upi"
                    value={upiVpa}
                    onChange={(e) => {
                      setUpiVpa(e.target.value);
                      if (errors.upiVpa) {
                        setErrors((prev) => ({ ...prev, upiVpa: '' }));
                      }
                    }}
                    className={`eway-apm-input ${errors.upiVpa ? 'eway-apm-input--error' : ''}`}
                  />
                </div>
                {errors.upiVpa && <span className="eway-apm-error-msg">{errors.upiVpa}</span>}
              </div>

              <div className="eway-apm-handle-pills">
                <span className="eway-apm-handle-title">Quick Handle:</span>
                {['@okhdfcbank', '@oksbi', '@paytm', '@ybl', '@icici'].map((handle) => (
                  <button
                    key={handle}
                    type="button"
                    className="eway-apm-handle-pill"
                    onClick={() => {
                      const prefix = upiVpa.split('@')[0] || 'yourname';
                      setUpiVpa(prefix + handle);
                      if (errors.upiVpa) setErrors((p) => ({ ...p, upiVpa: '' }));
                    }}
                  >
                    {handle}
                  </button>
                ))}
              </div>

              <div className="eway-apm-checkbox-row">
                <label className="eway-apm-checkbox-label">
                  <input
                    type="checkbox"
                    checked={setAsDefault}
                    onChange={(e) => setSetAsDefault(e.target.checked)}
                    className="eway-apm-checkbox"
                  />
                  <span>Set this UPI handle as default payment method</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: NET BANKING */}
          {activeTab === 'netbanking' && (
            <div className="eway-apm-nb-form">
              <label className="eway-apm-label">SELECT YOUR BANK</label>
              <div className="eway-apm-banks-grid">
                {POPULAR_BANKS.slice(0, 8).map((bank) => (
                  <button
                    key={bank.code}
                    type="button"
                    className={`eway-apm-bank-btn ${selectedBankCode === bank.code ? 'eway-apm-bank-btn--selected' : ''}`}
                    onClick={() => setSelectedBankCode(bank.code)}
                  >
                    <span className="eway-apm-bank-logo">🏛️</span>
                    <span className="eway-apm-bank-name">{bank.shortName}</span>
                  </button>
                ))}
              </div>

              <div className="eway-apm-checkbox-row" style={{ marginTop: '16px' }}>
                <label className="eway-apm-checkbox-label">
                  <input
                    type="checkbox"
                    checked={setAsDefault}
                    onChange={(e) => setSetAsDefault(e.target.checked)}
                    className="eway-apm-checkbox"
                  />
                  <span>Set this bank as default method</span>
                </label>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="eway-apm-footer">
            <button
              type="button"
              className="eway-apm-btn-cancel"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="eway-apm-btn-submit"
              disabled={isSubmitting}
              id="eway-save-payment-method-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="eway-apm-spinner" />
                  <span>Verifying & Saving...</span>
                </>
              ) : (
                <>
                  <span>✓ Save Payment Method</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentMethodModal;
