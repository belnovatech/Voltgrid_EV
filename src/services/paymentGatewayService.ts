import {
  CardBrand,
  CardDetails,
  UpiDetails,
  DigitalWalletDetails,
  NetBankingDetails,
  SavedPaymentMethod,
  PaymentIntent,
  PaymentVerificationResult,
} from '../types/payment';

export interface BankOption {
  code: string;
  name: string;
  popular?: boolean;
  shortName: string;
}

export const POPULAR_BANKS: BankOption[] = [
  { code: 'HDFC', name: 'HDFC Bank', popular: true, shortName: 'HDFC' },
  { code: 'ICICI', name: 'ICICI Bank', popular: true, shortName: 'ICICI' },
  { code: 'SBI', name: 'State Bank of India', popular: true, shortName: 'SBI' },
  { code: 'AXIS', name: 'Axis Bank', popular: true, shortName: 'Axis' },
  { code: 'KOTAK', name: 'Kotak Mahindra Bank', popular: true, shortName: 'Kotak' },
  { code: 'PNB', name: 'Punjab National Bank', popular: true, shortName: 'PNB' },
  { code: 'BOB', name: 'Bank of Baroda', popular: false, shortName: 'BOB' },
  { code: 'CANARA', name: 'Canara Bank', popular: false, shortName: 'Canara' },
  { code: 'INDUSIND', name: 'IndusInd Bank', popular: false, shortName: 'IndusInd' },
  { code: 'YES', name: 'YES Bank', popular: false, shortName: 'YES' },
  { code: 'IDFC', name: 'IDFC FIRST Bank', popular: false, shortName: 'IDFC First' },
  { code: 'UNION', name: 'Union Bank of India', popular: false, shortName: 'Union' },
];

const SAVED_METHODS_STORAGE_KEY = 'vg_saved_payment_methods';
const IDEMPOTENCY_STORE_KEY = 'vg_idempotency_keys';

const DEFAULT_SAVED_METHODS: SavedPaymentMethod[] = [
  {
    id: 'spm_card_01',
    type: 'card',
    brand: 'visa',
    last4: '4242',
    title: 'HDFC Bank Regalia Credit Card',
    subtitle: 'Expires 08/28',
    expiry: '08/28',
    isDefault: true,
  },
  {
    id: 'spm_card_02',
    type: 'card',
    brand: 'mastercard',
    last4: '8812',
    title: 'ICICI Coral Debit Card',
    subtitle: 'Expires 11/27',
    expiry: '11/27',
    isDefault: false,
  },
  {
    id: 'spm_upi_01',
    type: 'upi',
    vpa: 'bala@okhdfcbank',
    title: 'Google Pay (UPI)',
    subtitle: 'bala@okhdfcbank',
    isDefault: false,
  },
];

/**
 * Detect card brand from card number prefix
 */
export function detectCardBrand(cardNumber: string): CardBrand {
  const clean = cardNumber.replace(/\D/g, '');
  if (/^4/.test(clean)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(clean)) return 'mastercard';
  if (/^6(0|5|44|45|52)/.test(clean) || /^508[5-9]/.test(clean) || /^6521/.test(clean)) return 'rupay';
  if (/^3[47]/.test(clean)) return 'amex';
  if (/^(5018|5020|5038|5893|6304|6759|6761|6762|6763)/.test(clean)) return 'maestro';
  return 'unknown';
}

/**
 * Validates card number using standard Luhn algorithm
 */
export function validateLuhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits.charAt(i), 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n = (n % 10) + 1;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

/**
 * Validates card expiry MM/YY
 */
export function validateExpiry(monthStr: string, yearStr: string): boolean {
  const month = parseInt(monthStr, 10);
  let year = parseInt(yearStr, 10);
  if (isNaN(month) || isNaN(year) || month < 1 || month > 12) return false;

  if (yearStr.length === 2) {
    year += 2000;
  }

  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth() + 1;

  if (year < curYear) return false;
  if (year === curYear && month < curMonth) return false;
  if (year > curYear + 25) return false;

  return true;
}

/**
 * Validates UPI VPA syntax (e.g. name@bank)
 */
export function validateUpiVpa(vpa: string): boolean {
  if (!vpa || typeof vpa !== 'string') return false;
  const regex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  return regex.test(vpa.trim());
}

/**
 * Payment Gateway Service implementation
 */
class PaymentGatewayService {
  private savedMethods: SavedPaymentMethod[] = [];
  private processedIdempotencyKeys: Set<string> = new Set();

  constructor() {
    this.loadSavedMethods();
    this.loadIdempotencyKeys();
  }

  private loadSavedMethods(): void {
    try {
      const stored = localStorage.getItem(SAVED_METHODS_STORAGE_KEY);
      if (stored) {
        this.savedMethods = JSON.parse(stored);
      } else {
        this.savedMethods = [...DEFAULT_SAVED_METHODS];
        this.persistSavedMethods();
      }
    } catch {
      this.savedMethods = [...DEFAULT_SAVED_METHODS];
    }
  }

  private persistSavedMethods(): void {
    try {
      localStorage.setItem(SAVED_METHODS_STORAGE_KEY, JSON.stringify(this.savedMethods));
    } catch {
      // storage unavailable
    }
  }

  private loadIdempotencyKeys(): void {
    try {
      const stored = sessionStorage.getItem(IDEMPOTENCY_STORE_KEY);
      if (stored) {
        this.processedIdempotencyKeys = new Set(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }

  private registerIdempotencyKey(key: string): void {
    this.processedIdempotencyKeys.add(key);
    try {
      sessionStorage.setItem(
        IDEMPOTENCY_STORE_KEY,
        JSON.stringify(Array.from(this.processedIdempotencyKeys))
      );
    } catch {
      // ignore
    }
  }

  public getSavedMethods(): SavedPaymentMethod[] {
    return [...this.savedMethods];
  }

  public addSavedCard(card: CardDetails): SavedPaymentMethod {
    const cleanDigits = card.cardNumber.replace(/\D/g, '');
    const last4 = cleanDigits.slice(-4) || '1234';
    const brand = card.brand || detectCardBrand(card.cardNumber);
    const brandTitle = brand.charAt(0).toUpperCase() + brand.slice(1);

    const newMethod: SavedPaymentMethod = {
      id: `spm_card_${Date.now()}`,
      type: 'card',
      brand,
      last4,
      title: `${brandTitle} ending in ${last4}`,
      subtitle: `Expires ${card.expiryMonth}/${card.expiryYear}`,
      expiry: `${card.expiryMonth}/${card.expiryYear}`,
      isDefault: this.savedMethods.length === 0,
    };

    // Prevent duplicates
    const exists = this.savedMethods.some(
      (m) => m.type === 'card' && m.last4 === last4 && m.brand === brand
    );
    if (!exists) {
      this.savedMethods.push(newMethod);
      this.persistSavedMethods();
    }
    return newMethod;
  }

  public addSavedUpi(vpa: string): SavedPaymentMethod {
    const cleanVpa = vpa.trim().toLowerCase();
    const newMethod: SavedPaymentMethod = {
      id: `spm_upi_${Date.now()}`,
      type: 'upi',
      vpa: cleanVpa,
      title: 'UPI Virtual Payment Address',
      subtitle: cleanVpa,
      isDefault: this.savedMethods.length === 0,
    };

    const exists = this.savedMethods.some((m) => m.type === 'upi' && m.vpa === cleanVpa);
    if (!exists) {
      this.savedMethods.push(newMethod);
      this.persistSavedMethods();
    }
    return newMethod;
  }

  public setDefaultMethod(id: string): boolean {
    let found = false;
    this.savedMethods = this.savedMethods.map((m) => {
      if (m.id === id) {
        found = true;
        return { ...m, isDefault: true };
      }
      return { ...m, isDefault: false };
    });
    if (found) {
      this.persistSavedMethods();
    }
    return found;
  }

  public deleteSavedMethod(id: string): boolean {
    const toDelete = this.savedMethods.find((m) => m.id === id);
    const wasDefault = toDelete?.isDefault;
    const prevLen = this.savedMethods.length;
    this.savedMethods = this.savedMethods.filter((m) => m.id !== id);
    if (this.savedMethods.length < prevLen) {
      if (wasDefault && this.savedMethods.length > 0) {
        this.savedMethods[0].isDefault = true;
      }
      this.persistSavedMethods();
      return true;
    }
    return false;
  }

  /**
   * Generates a unique, server-compliant idempotency key
   */
  public generateIdempotencyKey(prefix: string = 'vg_idem'): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Process payment through configured provider / sandbox
   */
  public async processPayment(params: {
    intent: PaymentIntent;
    methodType: 'card' | 'upi' | 'wallet' | 'netbanking' | 'saved';
    details: {
      card?: CardDetails;
      upi?: UpiDetails;
      digitalWallet?: DigitalWalletDetails;
      netBanking?: NetBankingDetails;
      savedMethodId?: string;
    };
    simulateFailure?: boolean;
    failureReason?: string;
  }): Promise<PaymentVerificationResult> {
    const { intent, methodType, details, simulateFailure, failureReason } = params;

    // 1. Idempotency Check
    if (this.processedIdempotencyKeys.has(intent.idempotencyKey)) {
      throw new Error('Duplicate payment request detected. This transaction was already processed.');
    }

    // 2. Gateway execution delay
    await new Promise((resolve) => setTimeout(resolve, 850));

    // 3. Failure simulation
    if (simulateFailure) {
      throw new Error(failureReason || 'Card issuer declined the transaction. Please try another method.');
    }

    // 4. Resolve method details summary
    let methodSummary = '';
    let methodName = '';

    if (methodType === 'card' && details.card) {
      const brand = details.card.brand || detectCardBrand(details.card.cardNumber);
      const last4 = details.card.cardNumber.replace(/\D/g, '').slice(-4);
      methodName = `${brand.toUpperCase()} Card`;
      methodSummary = `${brand.toUpperCase()} ending in ${last4}`;

      if (details.card.saveCard) {
        this.addSavedCard(details.card);
      }
    } else if (methodType === 'upi' && details.upi) {
      methodName = 'UPI';
      if (details.upi.subMethod === 'vpa') {
        methodSummary = details.upi.vpa || 'UPI Payment';
        if (details.upi.vpa) {
          this.addSavedUpi(details.upi.vpa);
        }
      } else if (details.upi.subMethod === 'qr') {
        methodSummary = 'Dynamic QR Code Payment';
      } else {
        methodSummary = `${details.upi.selectedApp?.toUpperCase() || 'UPI App'} Intent`;
      }
    } else if (methodType === 'wallet' && details.digitalWallet) {
      const prov = details.digitalWallet.provider;
      methodName = 'Digital Wallet';
      methodSummary =
        prov === 'apple_pay'
          ? 'Apple Pay'
          : prov === 'google_pay'
          ? 'Google Pay'
          : prov === 'amazon_pay'
          ? 'Amazon Pay'
          : 'Paytm Wallet';
    } else if (methodType === 'netbanking' && details.netBanking) {
      methodName = 'Net Banking';
      methodSummary = `${details.netBanking.bankName} (${details.netBanking.bankCode})`;
    } else if (methodType === 'saved' && details.savedMethodId) {
      const found = this.savedMethods.find((m) => m.id === details.savedMethodId);
      if (found) {
        methodName = found.type === 'card' ? 'Saved Card' : 'Saved UPI';
        methodSummary = found.title;
      } else {
        methodName = 'Saved Payment Method';
        methodSummary = 'Saved Account';
      }
    } else {
      methodName = 'Eway EV Payment';
      methodSummary = 'Electronic Payment';
    }

    // 5. Generate verified receipt and transaction credentials
    const txnNum = Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toISOString().replace(/\D/g, '').slice(0, 8);
    const transactionId = `VG-TXN-${dateStr}-${txnNum}`;
    const gatewayReferenceId = `pay_rzp_${Math.random().toString(36).substring(2, 12)}`;
    const receiptNumber = `RCP-${dateStr}-${Math.floor(1000 + Math.random() * 9000)}`;

    this.registerIdempotencyKey(intent.idempotencyKey);

    return {
      success: true,
      transactionId,
      gatewayReferenceId,
      amountINR: intent.amountINR,
      currency: intent.currency || 'INR',
      paymentMethod: methodName,
      paymentDetailsSummary: methodSummary,
      timestamp: new Date().toISOString(),
      orderId: intent.id,
      idempotencyKey: intent.idempotencyKey,
      signature: `sig_${Math.random().toString(36).substring(2, 16)}`,
      receiptNumber,
    };
  }
}

export const paymentGatewayService = new PaymentGatewayService();
