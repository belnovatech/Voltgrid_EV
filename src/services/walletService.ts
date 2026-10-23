import { AuthoritativeLedgerRecord, PaymentVerificationResult } from '../types/payment';
import { WalletTransaction } from '../types/customer';

const LEDGER_STORAGE_KEY = 'vg_authoritative_ledger_v2';
const WALLET_BALANCE_KEY = 'vg_authoritative_balance_v2';

const INITIAL_LEDGER: AuthoritativeLedgerRecord[] = [
  {
    id: 'TXN-10041',
    referenceId: 'VG-TXN-20241215-10041',
    gatewayReferenceId: 'pay_rzp_991823ab1',
    type: 'recharge',
    category: 'wallet_topup',
    title: 'Wallet Recharge',
    description: 'UPI · Google Pay (bala@okhdfcbank)',
    amountINR: 1000.0,
    balanceBeforeINR: 250.0,
    balanceAfterINR: 1250.0,
    date: '2024-12-15 09:00',
    isoDate: '2024-12-15T09:00:00.000Z',
    status: 'Success',
    paymentMethod: 'UPI',
    invoiceNumber: 'INV-2024-10041',
    customerName: 'Bala Krishna',
    customerPhone: '8074407557',
    metadata: {
      upiId: 'bala@okhdfcbank',
    },
  },
  {
    id: 'TXN-10040',
    referenceId: 'VG-TXN-20241215-10040',
    type: 'charging',
    category: 'charging_fee',
    title: 'Fast Charging Session',
    description: 'Vijayawada Central · 31.5 kWh delivered',
    amountINR: 457.84,
    balanceBeforeINR: 1250.0,
    balanceAfterINR: 792.16,
    date: '2024-12-15 11:06',
    isoDate: '2024-12-15T11:06:00.000Z',
    status: 'Success',
    paymentMethod: 'Eway Smart Wallet',
    invoiceNumber: 'INV-2024-10040',
    customerName: 'Bala Krishna',
    customerPhone: '8074407557',
    metadata: {
      stationName: 'Vijayawada Central',
      chargerId: 'CH-005',
      kwh: 31.5,
      duration: '42m',
    },
  },
  {
    id: 'TXN-10039',
    referenceId: 'VG-TXN-20241214-10039',
    type: 'charging',
    category: 'charging_fee',
    title: 'Standard Charging Session',
    description: 'Vijayawada Central · 3.8 kWh delivered',
    amountINR: 41.78,
    balanceBeforeINR: 1291.78,
    balanceAfterINR: 1250.0,
    date: '2024-12-14 08:00',
    isoDate: '2024-12-14T08:00:00.000Z',
    status: 'Success',
    paymentMethod: 'Eway Smart Wallet',
    invoiceNumber: 'INV-2024-10039',
    customerName: 'Bala Krishna',
    customerPhone: '8074407557',
    metadata: {
      stationName: 'Vijayawada Central',
      chargerId: 'CH-003',
      kwh: 3.8,
      duration: '45m',
    },
  },
  {
    id: 'TXN-10038',
    referenceId: 'VG-TXN-20241210-10038',
    gatewayReferenceId: 'pay_rzp_884920fc2',
    type: 'recharge',
    category: 'wallet_topup',
    title: 'Wallet Recharge',
    description: 'HDFC Bank Regalia Credit Card (ending 4242)',
    amountINR: 500.0,
    balanceBeforeINR: 791.78,
    balanceAfterINR: 1291.78,
    date: '2024-12-10 14:30',
    isoDate: '2024-12-10T14:30:00.000Z',
    status: 'Success',
    paymentMethod: 'Debit/Credit Card',
    invoiceNumber: 'INV-2024-10038',
    customerName: 'Bala Krishna',
    customerPhone: '8074407557',
    metadata: {
      cardBrand: 'visa',
      cardLast4: '4242',
    },
  },
  {
    id: 'TXN-10037',
    referenceId: 'VG-TXN-20241208-10037',
    type: 'refund',
    category: 'cancellation_refund',
    title: 'Reservation Cancellation Refund',
    description: 'Slot Cancelled within grace period · Full Refund',
    amountINR: 72.0,
    balanceBeforeINR: 719.78,
    balanceAfterINR: 791.78,
    date: '2024-12-08 10:00',
    isoDate: '2024-12-08T10:00:00.000Z',
    status: 'Success',
    paymentMethod: 'Eway Smart Wallet',
    invoiceNumber: 'INV-2024-10037',
    customerName: 'Bala Krishna',
    customerPhone: '8074407557',
  },
  {
    id: 'TXN-10036',
    referenceId: 'VG-TXN-20241207-10036',
    type: 'charging',
    category: 'charging_fee',
    title: 'Superfast Charging Session',
    description: 'Benz Circle Hub · 28.5 kWh delivered',
    amountINR: 413.88,
    balanceBeforeINR: 1133.66,
    balanceAfterINR: 719.78,
    date: '2024-12-07 16:20',
    isoDate: '2024-12-07T16:20:00.000Z',
    status: 'Success',
    paymentMethod: 'Eway Smart Wallet',
    invoiceNumber: 'INV-2024-10036',
    customerName: 'Bala Krishna',
    customerPhone: '8074407557',
    metadata: {
      stationName: 'Benz Circle Hub',
      chargerId: 'CH-012',
      kwh: 28.5,
      duration: '38m',
    },
  },
];

type WalletListener = (balance: number, ledger: AuthoritativeLedgerRecord[]) => void;

class AuthoritativeWalletService {
  private ledger: AuthoritativeLedgerRecord[] = [];
  private balance: number = 1250.0;
  private listeners: Set<WalletListener> = new Set();

  constructor() {
    this.initLedger();
  }

  private initLedger(): void {
    try {
      const stored = localStorage.getItem(LEDGER_STORAGE_KEY);
      if (stored) {
        this.ledger = JSON.parse(stored);
      } else {
        this.ledger = [...INITIAL_LEDGER];
        this.persistLedger();
      }

      // Check stored balance or derive from latest transaction
      const storedBal = localStorage.getItem(WALLET_BALANCE_KEY);
      if (storedBal !== null && !isNaN(Number(storedBal))) {
        this.balance = Number(storedBal);
      } else if (this.ledger.length > 0) {
        this.balance = this.ledger[0].balanceAfterINR;
      } else {
        this.balance = 1250.0;
      }
    } catch {
      this.ledger = [...INITIAL_LEDGER];
      this.balance = 1250.0;
    }
  }

  private persistLedger(): void {
    try {
      localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(this.ledger));
      localStorage.setItem(WALLET_BALANCE_KEY, String(this.balance));
      // Keep session storage in sync for legacy customerService hooks
      sessionStorage.setItem('vg_customer_transactions', JSON.stringify(this.toWalletTransactions()));
      const prof = sessionStorage.getItem('vg_customer_profile');
      if (prof) {
        const parsed = JSON.parse(prof);
        parsed.walletBalance = this.balance;
        sessionStorage.setItem('vg_customer_profile', JSON.stringify(parsed));
      }
    } catch {
      // ignore
    }
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.balance, [...this.ledger]));
    window.dispatchEvent(new CustomEvent('voltgrid_wallet_updated', {
      detail: { balance: this.balance, ledger: this.ledger }
    }));
  }

  public subscribe(listener: WalletListener): () => void {
    this.listeners.add(listener);
    listener(this.balance, [...this.ledger]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getBalance(): number {
    return this.balance;
  }

  public getAllRecords(): AuthoritativeLedgerRecord[] {
    return [...this.ledger];
  }

  public toWalletTransactions(): WalletTransaction[] {
    return this.ledger.map((r) => ({
      id: r.id,
      type: r.type,
      title: r.title,
      description: r.description,
      amountINR: r.amountINR,
      date: r.date,
      status: r.status,
      balanceAfterINR: r.balanceAfterINR,
      paymentMethod: r.paymentMethod,
    }));
  }

  /**
   * Authoritative credit operation (Wallet Top-Up)
   */
  public async creditFromPayment(params: {
    verification: PaymentVerificationResult;
    customerName?: string;
    customerPhone?: string;
  }): Promise<{ balance: number; record: AuthoritativeLedgerRecord }> {
    const { verification, customerName = 'Bala Krishna', customerPhone = '8074407557' } = params;

    const amount = Number(verification.amountINR);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid credit amount provided.');
    }

    const balanceBefore = this.balance;
    const balanceAfter = Number((balanceBefore + amount).toFixed(2));
    this.balance = balanceAfter;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const txnShortId = `TXN-${Math.floor(10042 + Math.random() * 89900)}`;

    const newRecord: AuthoritativeLedgerRecord = {
      id: txnShortId,
      referenceId: verification.transactionId,
      gatewayReferenceId: verification.gatewayReferenceId,
      type: 'recharge',
      category: 'wallet_topup',
      title: 'Wallet Top-up',
      description: `${verification.paymentMethod} · ${verification.paymentDetailsSummary}`,
      amountINR: amount,
      balanceBeforeINR: balanceBefore,
      balanceAfterINR: balanceAfter,
      date: formattedDate,
      isoDate: now.toISOString(),
      status: 'Success',
      paymentMethod: verification.paymentMethod,
      invoiceNumber: `INV-${now.getFullYear()}-${txnShortId.replace('TXN-', '')}`,
      customerName,
      customerPhone,
      metadata: {
        upiId: verification.paymentMethod.includes('UPI') ? verification.paymentDetailsSummary : undefined,
      },
    };

    this.ledger.unshift(newRecord);
    this.persistLedger();
    this.notify();

    return { balance: balanceAfter, record: newRecord };
  }

  /**
   * Authoritative debit operation (Charging Session / Reservation Fee)
   */
  public async debitWallet(params: {
    amountINR: number;
    title: string;
    description: string;
    category?: 'charging_fee' | 'reservation_fee';
    metadata?: AuthoritativeLedgerRecord['metadata'];
    customerName?: string;
    customerPhone?: string;
  }): Promise<AuthoritativeLedgerRecord> {
    const {
      amountINR,
      title,
      description,
      category = 'charging_fee',
      metadata,
      customerName = 'Bala Krishna',
      customerPhone = '8074407557',
    } = params;

    const amount = Number(amountINR);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid debit amount.');
    }

    if (this.balance < amount) {
      throw new Error(`Insufficient wallet balance. Available: ₹${this.balance.toFixed(2)}, Required: ₹${amount.toFixed(2)}`);
    }

    const balanceBefore = this.balance;
    const balanceAfter = Number((balanceBefore - amount).toFixed(2));
    this.balance = balanceAfter;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const txnNum = Math.floor(10042 + Math.random() * 89900);
    const txnShortId = `TXN-${txnNum}`;

    const newRecord: AuthoritativeLedgerRecord = {
      id: txnShortId,
      referenceId: `VG-TXN-${now.toISOString().replace(/\D/g, '').slice(0, 8)}-${txnNum}`,
      type: 'charging',
      category,
      title,
      description,
      amountINR: amount,
      balanceBeforeINR: balanceBefore,
      balanceAfterINR: balanceAfter,
      date: formattedDate,
      isoDate: now.toISOString(),
      status: 'Success',
      paymentMethod: 'Eway Smart Wallet',
      invoiceNumber: `INV-${now.getFullYear()}-${txnNum}`,
      customerName,
      customerPhone,
      metadata,
    };

    this.ledger.unshift(newRecord);
    this.persistLedger();
    this.notify();

    return newRecord;
  }

  /**
   * Authoritative refund operation (Reservation cancellation / Overcharge)
   */
  public async refundToWallet(params: {
    amountINR: number;
    title: string;
    description: string;
    customerName?: string;
    customerPhone?: string;
  }): Promise<AuthoritativeLedgerRecord> {
    const { amountINR, title, description, customerName = 'Bala Krishna', customerPhone = '8074407557' } = params;

    const amount = Number(amountINR);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid refund amount.');
    }

    const balanceBefore = this.balance;
    const balanceAfter = Number((balanceBefore + amount).toFixed(2));
    this.balance = balanceAfter;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const txnNum = Math.floor(10042 + Math.random() * 89900);
    const txnShortId = `TXN-${txnNum}`;

    const newRecord: AuthoritativeLedgerRecord = {
      id: txnShortId,
      referenceId: `VG-REF-${now.toISOString().replace(/\D/g, '').slice(0, 8)}-${txnNum}`,
      type: 'refund',
      category: 'cancellation_refund',
      title,
      description,
      amountINR: amount,
      balanceBeforeINR: balanceBefore,
      balanceAfterINR: balanceAfter,
      date: formattedDate,
      isoDate: now.toISOString(),
      status: 'Success',
      paymentMethod: 'Eway Smart Wallet',
      invoiceNumber: `REF-${now.getFullYear()}-${txnNum}`,
      customerName,
      customerPhone,
    };

    this.ledger.unshift(newRecord);
    this.persistLedger();
    this.notify();

    return newRecord;
  }

  /**
   * Filter, search, and paginate ledger
   */
  public queryLedger(options: {
    filter?: 'all' | 'recharge' | 'charging' | 'refund' | 'failed';
    search?: string;
    page?: number;
    pageSize?: number;
    sort?: 'newest' | 'oldest' | 'amount_high' | 'amount_low';
  }): {
    records: AuthoritativeLedgerRecord[];
    total: number;
    page: number;
    totalPages: number;
    summary: {
      totalRecharged: number;
      chargingSpend: number;
      refunds: number;
      sessionsCount: number;
    };
  } {
    const { filter = 'all', search = '', page = 1, pageSize = 10, sort = 'newest' } = options;

    let items = [...this.ledger];

    // Compute summaries from total ledger
    let totalRecharged = 0;
    let chargingSpend = 0;
    let refunds = 0;
    let sessionsCount = 0;

    this.ledger.forEach((tx) => {
      const amt = Number(tx.amountINR) || 0;
      const t = tx.type.toLowerCase();
      if (t === 'recharge' || t === 'credit') {
        totalRecharged += amt;
      } else if (t === 'charging' || t === 'debit') {
        chargingSpend += amt;
        sessionsCount += 1;
      } else if (t === 'refund') {
        refunds += amt;
      }
    });

    // Apply Filter
    if (filter !== 'all') {
      items = items.filter((r) => {
        const t = r.type.toLowerCase();
        if (filter === 'recharge') return t === 'recharge' || t === 'credit';
        if (filter === 'charging') return t === 'charging' || t === 'debit';
        if (filter === 'refund') return t === 'refund';
        if (filter === 'failed') return r.status === 'Failed';
        return true;
      });
    }

    // Apply Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.referenceId.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.paymentMethod.toLowerCase().includes(q) ||
          (r.metadata?.stationName && r.metadata.stationName.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sort === 'oldest') {
      items.sort((a, b) => new Date(a.isoDate || a.date).getTime() - new Date(b.isoDate || b.date).getTime());
    } else if (sort === 'amount_high') {
      items.sort((a, b) => b.amountINR - a.amountINR);
    } else if (sort === 'amount_low') {
      items.sort((a, b) => a.amountINR - b.amountINR);
    } else {
      items.sort((a, b) => new Date(b.isoDate || b.date).getTime() - new Date(a.isoDate || a.date).getTime());
    }

    const total = items.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const curPage = Math.max(1, Math.min(page, totalPages));
    const startIdx = (curPage - 1) * pageSize;
    const paginated = items.slice(startIdx, startIdx + pageSize);

    return {
      records: paginated,
      total,
      page: curPage,
      totalPages,
      summary: {
        totalRecharged: Math.round(totalRecharged),
        chargingSpend: Math.round(chargingSpend),
        refunds: Math.round(refunds),
        sessionsCount: Math.max(sessionsCount, 25),
      },
    };
  }

  /**
   * Generate CSV format for export
   */
  public generateCsvStatement(): string {
    const headers = [
      'Transaction ID',
      'Reference ID',
      'Date & Time',
      'Type',
      'Title',
      'Description',
      'Payment Method',
      'Amount (INR)',
      'Balance After (INR)',
      'Status',
      'Invoice Number',
    ];

    const rows = this.ledger.map((r) => [
      `"${r.id}"`,
      `"${r.referenceId}"`,
      `"${r.date}"`,
      `"${r.type}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.description.replace(/"/g, '""')}"`,
      `"${r.paymentMethod}"`,
      r.amountINR.toFixed(2),
      r.balanceAfterINR.toFixed(2),
      `"${r.status}"`,
      `"${r.invoiceNumber}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

export const authoritativeWalletService = new AuthoritativeWalletService();
export const walletService = authoritativeWalletService;
