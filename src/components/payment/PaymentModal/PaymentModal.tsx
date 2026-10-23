import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  CardBrand,
  CardDetails,
  PaymentIntent,
  PaymentVerificationResult,
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
import { authoritativeWalletService } from '../../../services/walletService';
import './PaymentModal.css';

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (result: PaymentVerificationResult) => void;
  mode: 'wallet_topup' | 'checkout';
  defaultAmount?: number;
  orderTitle?: string;
  orderDescription?: string;
}

const PRESET_TOPUP_AMOUNTS = [100, 250, 500, 1000, 2000];
const MIN_AMOUNT = 50;
const MAX_AMOUNT = 25000;

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  mode = 'wallet_topup',
  defaultAmount = 500,
  orderTitle,
  orderDescription,
}) => {
  // Amount state
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [customAmountStr, setCustomAmountStr] = useState<string>('');
  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false);

  // Flow State
  const [step, setStep] = useState<'input' | 'processing' | 'otp' | 'success' | 'failed'>('input');
  const [activeCategory, setActiveCategory] = useState<'saved' | 'upi' | 'card' | 'netbanking'>('saved');

  // Saved Methods
  const [savedMethods, setSavedMethods] = useState<SavedPaymentMethod[]>([]);
  const [selectedSavedId, setSelectedSavedId] = useState<string>('');
  const [savedCvv, setSavedCvv] = useState<string>('');

  // New Card Form
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardholderName, setCardholderName] = useState<string>('BALA KRISHNA');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [saveCard, setSaveCard] = useState<boolean>(true);

  // UPI State
  const [upiSubMethod, setUpiSubMethod] = useState<'vpa' | 'qr' | 'intent'>('intent');
  const [upiVpa, setUpiVpa] = useState<string>('bala@okhdfcbank');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [qrTimer, setQrTimer] = useState<number>(300);

  // Net Banking State
  const [selectedBankCode, setSelectedBankCode] = useState<string>('HDFC');

  // Validation / Error State
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 3D Secure OTP State
  const [otpValue, setOtpValue] = useState<string>('');
  const [otpTimer, setOtpTimer] = useState<number>(30);

  // Result verification
  const [verifiedResult, setVerifiedResult] = useState<PaymentVerificationResult | null>(null);
  const currentIntentRef = useRef<PaymentIntent | null>(null);

  // Sync initial amount
  useEffect(() => {
    if (isOpen) {
      setAmount(defaultAmount);
      setIsCustomAmount(false);
      setCustomAmountStr('');
      setStep('input');
      setFormErrors({});
      setErrorMessage(null);
      setOtpValue('');
      setSavedCvv('');
      setQrTimer(300);

      const saved = paymentGatewayService.getSavedMethods();
      setSavedMethods(saved);
      if (saved.length > 0) {
        const defaultMethod = saved.find((m) => m.isDefault) || saved[0];
        setSelectedSavedId(defaultMethod.id);
        setActiveCategory('saved');
      } else {
        setActiveCategory('upi');
      }
    }
  }, [isOpen, defaultAmount]);

  // QR Timer countdown
  useEffect(() => {
    if (isOpen && activeCategory === 'upi' && upiSubMethod === 'qr' && step === 'input') {
      const interval = setInterval(() => {
        setQrTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, activeCategory, upiSubMethod, step]);

  // OTP Timer countdown
  useEffect(() => {
    if (step === 'otp') {
      const interval = setInterval(() => {
        setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Card brand detection
  const detectedBrand: CardBrand = useMemo(() => {
    return detectCardBrand(cardNumber);
  }, [cardNumber]);

  // Format Card Number input with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    if (formErrors.cardNumber) {
      setFormErrors((prev) => ({ ...prev, cardNumber: '' }));
    }
  };

  // Format Expiry MM / YY
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setCardExpiry(raw);
    if (formErrors.cardExpiry) {
      setFormErrors((prev) => ({ ...prev, cardExpiry: '' }));
    }
  };

  // Format Amount Custom input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    const parts = raw.split('.');
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;

    setCustomAmountStr(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      setAmount(parsed);
      if (parsed < MIN_AMOUNT) {
        setFormErrors((prev) => ({ ...prev, amount: `Minimum recharge amount is ₹${MIN_AMOUNT}.` }));
      } else if (parsed > MAX_AMOUNT) {
        setFormErrors((prev) => ({ ...prev, amount: `Maximum recharge limit is ₹${MAX_AMOUNT.toLocaleString('en-IN')}.` }));
      } else {
        setFormErrors((prev) => ({ ...prev, amount: '' }));
      }
    } else {
      setAmount(0);
    }
  };

  // Quick Preset select
  const handleSelectPreset = (val: number) => {
    setIsCustomAmount(false);
    setAmount(val);
    setCustomAmountStr('');
    setFormErrors((prev) => ({ ...prev, amount: '' }));
  };

  // Card validation check
  const validateCardForm = (): boolean => {
    const errors: Record<string, string> = {};
    const cleanDigits = cardNumber.replace(/\D/g, '');

    if (!cleanDigits) {
      errors.cardNumber = 'Card number is required.';
    } else if (cleanDigits.length < 13 || !validateLuhn(cleanDigits)) {
      errors.cardNumber = 'Please enter a valid credit or debit card number.';
    }

    if (!cardholderName.trim()) {
      errors.cardholderName = 'Cardholder name is required.';
    }

    const [mm, yy] = cardExpiry.split('/');
    if (!mm || !yy || !validateExpiry(mm, yy)) {
      errors.cardExpiry = 'Invalid expiry date (MM/YY).';
    }

    if (!cardCvv || cardCvv.length < 3 || cardCvv.length > 4) {
      errors.cardCvv = 'CVV must be 3 or 4 digits.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // UPI validation check
  const validateUpiForm = (): boolean => {
    if (upiSubMethod === 'vpa') {
      if (!upiVpa.trim() || !validateUpiVpa(upiVpa.trim())) {
        setFormErrors({ upiVpa: 'Please enter a valid UPI ID (e.g. yourname@okhdfcbank).' });
        return false;
      }
    }
    setFormErrors({});
    return true;
  };

  // Saved method check
  const validateSavedMethod = (): boolean => {
    const method = savedMethods.find((m) => m.id === selectedSavedId);
    if (!method) {
      setFormErrors({ saved: 'Please select a payment method.' });
      return false;
    }
    if (method.type === 'card' && (!savedCvv || savedCvv.length < 3)) {
      setFormErrors({ savedCvv: 'Please enter CVV for this card.' });
      return false;
    }
    setFormErrors({});
    return true;
  };

  // Start payment processing
  const handleInitiatePayment = async () => {
    // 1. Amount validation
    if (amount <= 0 || isNaN(amount)) {
      setFormErrors({ amount: 'Please enter a valid recharge amount.' });
      return;
    }
    if (mode === 'wallet_topup' && amount < MIN_AMOUNT) {
      setFormErrors({ amount: `Minimum recharge amount is ₹${MIN_AMOUNT}.` });
      return;
    }
    if (mode === 'wallet_topup' && amount > MAX_AMOUNT) {
      setFormErrors({ amount: `Maximum recharge amount is ₹${MAX_AMOUNT.toLocaleString('en-IN')}.` });
      return;
    }

    // 2. Validate current category
    if (activeCategory === 'card') {
      if (!validateCardForm()) return;
    } else if (activeCategory === 'upi') {
      if (!validateUpiForm()) return;
    } else if (activeCategory === 'saved') {
      if (!validateSavedMethod()) return;
    }

    setFormErrors({});
    setErrorMessage(null);

    // Build Payment Intent
    const intent: PaymentIntent = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      amountINR: amount,
      currency: 'INR',
      idempotencyKey: paymentGatewayService.generateIdempotencyKey(
        mode === 'wallet_topup' ? 'topup' : 'chkt'
      ),
      orderSummary: {
        baseAmountINR: amount,
        convenienceFeeINR: 0,
        gstINR: 0,
        discountINR: 0,
        totalPayableINR: amount,
        currency: 'INR',
        description: orderDescription || (mode === 'wallet_topup' ? 'Eway Smart Wallet Top-up' : 'Eway Reservation Payment'),
        orderType: mode === 'wallet_topup' ? 'wallet_topup' : 'reservation',
      },
      customer: {
        id: 'usr_bala_01',
        name: cardholderName || 'Bala Krishna',
        phone: '8074407557',
        email: 'bala@example.com',
      },
      createdAt: new Date().toISOString(),
    };
    currentIntentRef.current = intent;

    // Simulate 3D Secure OTP for cards
    if (activeCategory === 'card' || (activeCategory === 'saved' && savedMethods.find((m) => m.id === selectedSavedId)?.type === 'card')) {
      setStep('processing');
      setTimeout(() => {
        setStep('otp');
        setOtpTimer(30);
      }, 650);
    } else {
      setStep('processing');
      executeFinalGatewayCall();
    }
  };

  // Execute Gateway call
  const executeFinalGatewayCall = async () => {
    if (!currentIntentRef.current) return;
    const intent = currentIntentRef.current;

    try {
      let cardDetails: CardDetails | undefined;
      if (activeCategory === 'card') {
        const [mm, yy] = cardExpiry.split('/');
        cardDetails = {
          cardNumber,
          cardholderName,
          expiryMonth: mm,
          expiryYear: yy,
          cvv: cardCvv,
          brand: detectedBrand,
          saveCard,
        };
      }

      const result = await paymentGatewayService.processPayment({
        intent,
        methodType: activeCategory,
        details: {
          card: cardDetails,
          upi: activeCategory === 'upi' ? { subMethod: upiSubMethod, vpa: upiVpa, selectedApp: upiApp } : undefined,
          netBanking: activeCategory === 'netbanking' ? { bankCode: selectedBankCode, bankName: POPULAR_BANKS.find((b) => b.code === selectedBankCode)?.name || 'HDFC Bank' } : undefined,
          savedMethodId: activeCategory === 'saved' ? selectedSavedId : undefined,
        },
      });

      // Credit wallet if wallet top-up mode
      if (mode === 'wallet_topup') {
        await authoritativeWalletService.creditFromPayment({
          verification: result,
          customerName: intent.customer.name,
          customerPhone: intent.customer.phone,
        });
      }

      setVerifiedResult(result);
      setStep('success');
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment authorization failed. Please try again.';
      setErrorMessage(msg);
      setStep('failed');
    }
  };

  // Handle OTP Submission
  const handleVerifyOtp = () => {
    if (!otpValue || otpValue.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit OTP code sent to your mobile.');
      return;
    }
    setErrorMessage(null);
    setStep('processing');
    executeFinalGatewayCall();
  };

  if (!isOpen) return null;

  return (
    <div
      className="eway-pay-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== 'processing') {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="eway-pay-title"
    >
      <div className="eway-pay-container">
        {/* Modal Header */}
        <div className="eway-pay-header">
          <div className="eway-pay-header-brand">
            <div className="eway-pay-logo-icon">
              <img src="/eway-logo.png" alt="Eway to Your EVs" />
            </div>
            <div>
              <span className="eway-pay-eyebrow">
                {mode === 'wallet_topup' ? 'FAST & SECURE TOP-UP' : 'INSTANT CHECKOUT'}
              </span>
              <h2 id="eway-pay-title" className="eway-pay-title">
                {orderTitle || (mode === 'wallet_topup' ? 'Add Money to Eway Wallet' : 'Complete Reservation')}
              </h2>
            </div>
          </div>

          <div className="eway-pay-header-right">
            <div className="eway-pay-security-pill" title="256-Bit SSL Bank-Grade Encryption">
              <span className="eway-pay-shield">🔒</span>
              <span>256-Bit SSL</span>
            </div>
            {step !== 'processing' && (
              <button
                type="button"
                className="eway-pay-close-btn"
                onClick={onClose}
                aria-label="Close modal"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* STEP 1: INPUT FLOW */}
        {step === 'input' && (
          <div className="eway-pay-content-body">
            {/* Amount Selection Section */}
            {mode === 'wallet_topup' && (
              <div className="eway-pay-section eway-pay-section--amount">
                <div className="eway-pay-section-header">
                  <label className="eway-pay-section-label">Select Recharge Amount</label>
                  <span className="eway-pay-zero-fee-badge">
                    ✓ Instant Credit · Zero Convenience Fee
                  </span>
                </div>

                <div className="eway-pay-presets-row">
                  {PRESET_TOPUP_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className={`eway-pay-preset-chip ${!isCustomAmount && amount === amt ? 'eway-pay-preset-chip--active' : ''}`}
                      onClick={() => handleSelectPreset(amt)}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`eway-pay-preset-chip ${isCustomAmount ? 'eway-pay-preset-chip--active' : ''}`}
                    onClick={() => {
                      setIsCustomAmount(true);
                      setCustomAmountStr(amount ? amount.toString() : '');
                    }}
                  >
                    Custom
                  </button>
                </div>

                {isCustomAmount && (
                  <div className="eway-pay-custom-box">
                    <span className="eway-pay-currency-sign">₹</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      className="eway-pay-custom-input"
                      placeholder="Enter amount (min ₹50 - max ₹25,000)"
                      value={customAmountStr}
                      onChange={handleCustomAmountChange}
                      autoFocus
                    />
                  </div>
                )}

                {formErrors.amount && (
                  <div className="eway-pay-inline-error">{formErrors.amount}</div>
                )}
              </div>
            )}

            {/* Cost Breakdown Bar */}
            <div className="eway-pay-breakdown-card">
              <div className="eway-pay-breakdown-row">
                <span className="eway-pay-breakdown-label">Recharge Amount</span>
                <span className="eway-pay-breakdown-val">₹{amount.toFixed(2)}</span>
              </div>
              <div className="eway-pay-breakdown-row">
                <span className="eway-pay-breakdown-label">Convenience Fee</span>
                <span className="eway-pay-breakdown-val eway-pay-breakdown-val--free">FREE (₹0.00)</span>
              </div>
              <div className="eway-pay-breakdown-row eway-pay-breakdown-row--total">
                <span className="eway-pay-breakdown-label">Net Payable Total</span>
                <span className="eway-pay-breakdown-val eway-pay-breakdown-val--total">
                  ₹{amount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="eway-pay-method-tabs" role="tablist">
              {savedMethods.length > 0 && (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === 'saved'}
                  className={`eway-pay-tab-btn ${activeCategory === 'saved' ? 'eway-pay-tab-btn--active' : ''}`}
                  onClick={() => setActiveCategory('saved')}
                >
                  <span>⚡ Saved</span>
                  <span className="eway-pay-tab-count">{savedMethods.length}</span>
                </button>
              )}
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === 'upi'}
                className={`eway-pay-tab-btn ${activeCategory === 'upi' ? 'eway-pay-tab-btn--active' : ''}`}
                onClick={() => setActiveCategory('upi')}
              >
                <span>📱 UPI</span>
                <span className="eway-pay-tab-fast">Fastest</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === 'card'}
                className={`eway-pay-tab-btn ${activeCategory === 'card' ? 'eway-pay-tab-btn--active' : ''}`}
                onClick={() => setActiveCategory('card')}
              >
                <span>💳 Card</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === 'netbanking'}
                className={`eway-pay-tab-btn ${activeCategory === 'netbanking' ? 'eway-pay-tab-btn--active' : ''}`}
                onClick={() => setActiveCategory('netbanking')}
              >
                <span>🏦 Net Banking</span>
              </button>
            </div>

            {/* TAB: SAVED METHODS */}
            {activeCategory === 'saved' && (
              <div className="eway-pay-tab-body">
                <div className="eway-pay-saved-items">
                  {savedMethods.map((m) => {
                    const isSelected = selectedSavedId === m.id;
                    return (
                      <div
                        key={m.id}
                        className={`eway-pay-saved-item ${isSelected ? 'eway-pay-saved-item--selected' : ''}`}
                        onClick={() => setSelectedSavedId(m.id)}
                      >
                        <div className="eway-pay-radio-circle">
                          {isSelected && <div className="eway-pay-radio-inner" />}
                        </div>
                        <div className="eway-pay-saved-icon">
                          {m.type === 'card' ? '💳' : '📱'}
                        </div>
                        <div className="eway-pay-saved-text">
                          <div className="eway-pay-saved-title-row">
                            <span className="eway-pay-saved-title">{m.title}</span>
                            {m.isDefault && <span className="eway-pay-default-pill">DEFAULT</span>}
                          </div>
                          <span className="eway-pay-saved-sub">{m.subtitle}</span>
                        </div>
                        {isSelected && m.type === 'card' && (
                          <div
                            className="eway-pay-cvv-inline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <label className="eway-pay-cvv-label">CVV</label>
                            <input
                              type="password"
                              maxLength={4}
                              placeholder="•••"
                              className="eway-pay-cvv-input"
                              value={savedCvv}
                              onChange={(e) => setSavedCvv(e.target.value.replace(/\D/g, ''))}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {formErrors.savedCvv && (
                  <div className="eway-pay-inline-error">{formErrors.savedCvv}</div>
                )}
              </div>
            )}

            {/* TAB: UPI */}
            {activeCategory === 'upi' && (
              <div className="eway-pay-tab-body">
                <div className="eway-pay-upi-subnav">
                  <button
                    type="button"
                    className={`eway-pay-subnav-btn ${upiSubMethod === 'intent' ? 'eway-pay-subnav-btn--active' : ''}`}
                    onClick={() => setUpiSubMethod('intent')}
                  >
                    UPI Apps
                  </button>
                  <button
                    type="button"
                    className={`eway-pay-subnav-btn ${upiSubMethod === 'vpa' ? 'eway-pay-subnav-btn--active' : ''}`}
                    onClick={() => setUpiSubMethod('vpa')}
                  >
                    UPI ID / VPA
                  </button>
                  <button
                    type="button"
                    className={`eway-pay-subnav-btn ${upiSubMethod === 'qr' ? 'eway-pay-subnav-btn--active' : ''}`}
                    onClick={() => setUpiSubMethod('qr')}
                  >
                    QR Code
                  </button>
                </div>

                {upiSubMethod === 'intent' && (
                  <div className="eway-pay-upi-apps-grid">
                    {[
                      { id: 'gpay', name: 'Google Pay', icon: '🟢' },
                      { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
                      { id: 'paytm', name: 'Paytm', icon: '🔵' },
                      { id: 'bhim', name: 'BHIM UPI', icon: '🟠' },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        className={`eway-pay-upi-app-btn ${upiApp === app.id ? 'eway-pay-upi-app-btn--active' : ''}`}
                        onClick={() => setUpiApp(app.id as any)}
                      >
                        <span className="eway-pay-upi-app-icon">{app.icon}</span>
                        <span className="eway-pay-upi-app-name">{app.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {upiSubMethod === 'vpa' && (
                  <div className="eway-pay-vpa-box">
                    <label className="eway-pay-label">Enter Virtual Payment Address (VPA)</label>
                    <input
                      type="text"
                      className="eway-pay-input"
                      placeholder="e.g. mobile@okhdfcbank"
                      value={upiVpa}
                      onChange={(e) => {
                        setUpiVpa(e.target.value);
                        if (formErrors.upiVpa) setFormErrors((p) => ({ ...p, upiVpa: '' }));
                      }}
                    />
                    {formErrors.upiVpa && (
                      <div className="eway-pay-inline-error">{formErrors.upiVpa}</div>
                    )}
                  </div>
                )}

                {upiSubMethod === 'qr' && (
                  <div className="eway-pay-qr-box">
                    <div className="eway-pay-qr-graphic">
                      <svg width="120" height="120" viewBox="0 0 100 100" fill="#0B1B2A">
                        <rect x="10" y="10" width="30" height="30" fill="none" stroke="#0B1B2A" strokeWidth="6" />
                        <rect x="20" y="20" width="10" height="10" />
                        <rect x="60" y="10" width="30" height="30" fill="none" stroke="#0B1B2A" strokeWidth="6" />
                        <rect x="70" y="20" width="10" height="10" />
                        <rect x="10" y="60" width="30" height="30" fill="none" stroke="#0B1B2A" strokeWidth="6" />
                        <rect x="20" y="70" width="10" height="10" />
                        <circle cx="50" cy="50" r="10" fill="#159447" />
                      </svg>
                    </div>
                    <p className="eway-pay-qr-desc">
                      Scan with Google Pay, PhonePe, or BHIM to pay <strong>₹{amount.toFixed(2)}</strong>
                    </p>
                    <span className="eway-pay-qr-timer">Expires in: {Math.floor(qrTimer / 60)}:{(qrTimer % 60).toString().padStart(2, '0')}</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB: CARD */}
            {activeCategory === 'card' && (
              <div className="eway-pay-tab-body">
                <div className="eway-pay-card-fields">
                  <div className="eway-pay-field">
                    <label className="eway-pay-label">CARD NUMBER</label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="4242 •••• •••• 4242"
                      className="eway-pay-input"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                    />
                    {formErrors.cardNumber && (
                      <div className="eway-pay-inline-error">{formErrors.cardNumber}</div>
                    )}
                  </div>

                  <div className="eway-pay-row">
                    <div className="eway-pay-field eway-pay-col">
                      <label className="eway-pay-label">EXPIRY (MM/YY)</label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="MM / YY"
                        className="eway-pay-input"
                        value={cardExpiry}
                        onChange={handleCardExpiryChange}
                      />
                      {formErrors.cardExpiry && (
                        <div className="eway-pay-inline-error">{formErrors.cardExpiry}</div>
                      )}
                    </div>
                    <div className="eway-pay-field eway-pay-col">
                      <label className="eway-pay-label">CVV</label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="•••"
                        className="eway-pay-input"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      />
                      {formErrors.cardCvv && (
                        <div className="eway-pay-inline-error">{formErrors.cardCvv}</div>
                      )}
                    </div>
                  </div>

                  <div className="eway-pay-field">
                    <label className="eway-pay-label">CARDHOLDER NAME</label>
                    <input
                      type="text"
                      placeholder="BALA KRISHNA"
                      className="eway-pay-input"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                    />
                  </div>

                  <label className="eway-pay-checkbox-label">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="eway-pay-checkbox"
                    />
                    <span>Save card securely for instant 1-click charging & top-ups</span>
                  </label>
                </div>
              </div>
            )}

            {/* TAB: NET BANKING */}
            {activeCategory === 'netbanking' && (
              <div className="eway-pay-tab-body">
                <div className="eway-pay-nb-grid">
                  {POPULAR_BANKS.slice(0, 6).map((b) => (
                    <button
                      key={b.code}
                      type="button"
                      className={`eway-pay-nb-card ${selectedBankCode === b.code ? 'eway-pay-nb-card--active' : ''}`}
                      onClick={() => setSelectedBankCode(b.code)}
                    >
                      <span className="eway-pay-nb-icon">🏛️</span>
                      <span className="eway-pay-nb-name">{b.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="eway-pay-footer">
              <div className="eway-pay-footer-left">
                <span className="eway-pay-net-label">Net Payable</span>
                <span className="eway-pay-net-val">₹{amount.toFixed(2)}</span>
              </div>
              <button
                type="button"
                className="eway-pay-submit-btn"
                onClick={handleInitiatePayment}
                id="initiate-eway-payment-btn"
              >
                <span>Pay ₹{amount.toFixed(2)}</span>
                <span className="eway-pay-arrow">→</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP: PROCESSING */}
        {step === 'processing' && (
          <div className="eway-pay-state-screen">
            <div className="eway-pay-spinner-large" />
            <h3 className="eway-pay-state-title">Processing Secure Payment...</h3>
            <p className="eway-pay-state-desc">
              Contacting your payment provider. Please do not refresh or close this window.
            </p>
            <div className="eway-pay-security-note-mini">
              <span>🔒 256-Bit SSL Encrypted Session</span>
            </div>
          </div>
        )}

        {/* STEP: 3D SECURE OTP */}
        {step === 'otp' && (
          <div className="eway-pay-state-screen eway-pay-otp-screen">
            <div className="eway-pay-otp-badge">
              <span>3D Secure Verification</span>
            </div>
            <h3 className="eway-pay-state-title">Enter Bank OTP</h3>
            <p className="eway-pay-state-desc">
              We sent a 6-digit authentication code to your registered mobile number for ₹{amount.toFixed(2)}.
            </p>

            <div className="eway-pay-otp-input-wrap">
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="••••••"
                className="eway-pay-otp-input"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                autoFocus
              />
            </div>

            {errorMessage && <div className="eway-pay-inline-error">{errorMessage}</div>}

            <div className="eway-pay-otp-timer-row">
              {otpTimer > 0 ? (
                <span>Resend OTP code in <strong>{otpTimer}s</strong></span>
              ) : (
                <button
                  type="button"
                  className="eway-pay-resend-btn"
                  onClick={() => setOtpTimer(30)}
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="button"
              className="eway-pay-submit-btn eway-pay-submit-btn--full"
              onClick={handleVerifyOtp}
            >
              Verify & Authorize Payment
            </button>
          </div>
        )}

        {/* STEP: SUCCESS */}
        {step === 'success' && verifiedResult && (
          <div className="eway-pay-state-screen eway-pay-success-screen">
            <div className="eway-pay-success-icon">✓</div>
            <h3 className="eway-pay-state-title">Recharge Successful!</h3>
            <p className="eway-pay-state-desc">
              ₹{verifiedResult.amountINR.toFixed(2)} has been credited to your Eway Smart Wallet instantly.
            </p>

            <div className="eway-pay-receipt-mini">
              <div className="eway-pay-rec-row">
                <span>Transaction Ref</span>
                <strong>{verifiedResult.transactionId}</strong>
              </div>
              <div className="eway-pay-rec-row">
                <span>Payment Method</span>
                <strong>{verifiedResult.paymentMethod}</strong>
              </div>
              <div className="eway-pay-rec-row">
                <span>Gateway Ref</span>
                <strong>{verifiedResult.gatewayReferenceId}</strong>
              </div>
              <div className="eway-pay-rec-row eway-pay-rec-row--bal">
                <span>New Wallet Balance</span>
                <strong className="eway-pay-new-bal">
                  ₹{authoritativeWalletService.getBalance().toFixed(2)}
                </strong>
              </div>
            </div>

            <button
              type="button"
              className="eway-pay-submit-btn eway-pay-submit-btn--full"
              onClick={onClose}
            >
              Done · Return to Wallet
            </button>
          </div>
        )}

        {/* STEP: FAILED */}
        {step === 'failed' && (
          <div className="eway-pay-state-screen eway-pay-failed-screen">
            <div className="eway-pay-fail-icon">✕</div>
            <h3 className="eway-pay-state-title">Payment Authorization Failed</h3>
            <p className="eway-pay-state-desc">
              {errorMessage || 'Your payment provider was unable to process the transaction. Please try again.'}
            </p>
            <div className="eway-pay-failed-actions">
              <button
                type="button"
                className="eway-pay-btn-retry"
                onClick={() => setStep('input')}
              >
                Try Another Payment Method
              </button>
              <button
                type="button"
                className="eway-pay-btn-close-sec"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
