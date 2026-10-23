export type PaymentMethodCategory = 'card' | 'upi' | 'wallet' | 'netbanking' | 'saved';

export type CardBrand = 'visa' | 'mastercard' | 'rupay' | 'amex' | 'maestro' | 'unknown';

export interface CardDetails {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  brand: CardBrand;
  saveCard?: boolean;
}

export type UpiSubMethod = 'vpa' | 'qr' | 'intent';

export interface UpiDetails {
  subMethod: UpiSubMethod;
  vpa?: string;
  selectedApp?: 'gpay' | 'phonepe' | 'paytm' | 'bhim';
}

export interface DigitalWalletDetails {
  provider: 'apple_pay' | 'google_pay' | 'amazon_pay' | 'paytm_wallet' | 'mobikwik';
}

export interface NetBankingDetails {
  bankCode: string;
  bankName: string;
}

export interface SavedPaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking';
  title: string;
  subtitle: string;
  brand?: CardBrand;
  last4?: string;
  expiry?: string;
  vpa?: string;
  bankCode?: string;
  isDefault?: boolean;
}

export type PaymentStatus = 'idle' | 'validating' | 'authorizing' | 'otp_required' | 'verifying' | 'success' | 'failed' | 'cancelled';

export interface PaymentOrderSummary {
  baseAmountINR: number;
  convenienceFeeINR: number;
  gstINR: number;
  discountINR: number;
  totalPayableINR: number;
  currency: string;
  description: string;
  orderType: 'wallet_topup' | 'reservation' | 'charging_session';
  referenceMetadata?: Record<string, unknown>;
}

export interface PaymentIntent {
  id: string;
  amountINR: number;
  currency: string;
  idempotencyKey: string;
  orderSummary: PaymentOrderSummary;
  customer: {
    id: string;
    name: string;
    phone: string;
    email?: string;
  };
  createdAt: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  transactionId: string;
  gatewayReferenceId: string;
  amountINR: number;
  currency: string;
  paymentMethod: string;
  paymentDetailsSummary: string;
  timestamp: string;
  orderId: string;
  idempotencyKey: string;
  signature?: string;
  receiptNumber: string;
  errorMessage?: string;
  errorCode?: string;
}

export interface AuthoritativeLedgerRecord {
  id: string;
  referenceId: string;
  gatewayReferenceId?: string;
  type: 'recharge' | 'charging' | 'refund' | 'credit' | 'debit';
  title: string;
  description: string;
  amountINR: number;
  balanceBeforeINR: number;
  balanceAfterINR: number;
  date: string;
  isoDate: string;
  status: 'Success' | 'Pending' | 'Failed';
  paymentMethod: string;
  category: 'wallet_topup' | 'charging_fee' | 'reservation_fee' | 'cancellation_refund';
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  metadata?: {
    stationName?: string;
    chargerId?: string;
    kwh?: number;
    duration?: string;
    cardBrand?: string;
    cardLast4?: string;
    upiId?: string;
    bankName?: string;
  };
}
