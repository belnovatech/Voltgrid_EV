import { WalletTransaction } from '../types/customer';

const WALLET_BALANCE_KEY = 'vg_mobile_wallet_balance';
const WALLET_TXNS_KEY = 'vg_mobile_wallet_txns';

const DEFAULT_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'TXN-10041',
    type: 'recharge',
    title: 'Wallet Recharge',
    description: 'UPI · Google Pay',
    amountINR: 1000.0,
    date: 'Today, 09:00 AM',
    status: 'Success',
    balanceAfterINR: 1250.0,
    paymentMethod: 'UPI',
  },
  {
    id: 'TXN-10040',
    type: 'charging',
    title: 'Fast Charging Session',
    description: 'Vijayawada Central · 31.5 kWh delivered',
    amountINR: 457.84,
    date: 'Yesterday, 11:06 AM',
    status: 'Success',
    balanceAfterINR: 792.16,
    paymentMethod: 'Voltgrid Wallet',
  },
  {
    id: 'TXN-10039',
    type: 'charging',
    title: 'Standard Charging Session',
    description: 'Vijayawada Central · 3.8 kWh delivered',
    amountINR: 45.6,
    date: '24 Oct, 04:30 PM',
    status: 'Success',
    balanceAfterINR: 1250.0,
    paymentMethod: 'Voltgrid Wallet',
  },
  {
    id: 'TXN-10038',
    type: 'recharge',
    title: 'Wallet Recharge',
    description: 'Credit Card (HDFC **** 8821)',
    amountINR: 500.0,
    date: '20 Oct, 02:15 PM',
    status: 'Success',
    balanceAfterINR: 1295.6,
    paymentMethod: 'Card',
  },
];

type WalletListener = (balance: number) => void;

class WalletService {
  private balance: number = 1250;
  private transactions: WalletTransaction[] = [...DEFAULT_TRANSACTIONS];
  private listeners: Set<WalletListener> = new Set();

  constructor() {
    this.restore();
  }

  private restore() {
    try {
      const savedBal = localStorage.getItem(WALLET_BALANCE_KEY) || sessionStorage.getItem(WALLET_BALANCE_KEY);
      if (savedBal !== null) {
        this.balance = parseFloat(savedBal);
      }
      const savedTxns = localStorage.getItem(WALLET_TXNS_KEY) || sessionStorage.getItem(WALLET_TXNS_KEY);
      if (savedTxns) {
        this.transactions = JSON.parse(savedTxns);
      }
    } catch {
      // Use defaults
    }
  }

  private persist() {
    try {
      localStorage.setItem(WALLET_BALANCE_KEY, this.balance.toString());
      sessionStorage.setItem(WALLET_BALANCE_KEY, this.balance.toString());
      localStorage.setItem(WALLET_TXNS_KEY, JSON.stringify(this.transactions));
      sessionStorage.setItem(WALLET_TXNS_KEY, JSON.stringify(this.transactions));
    } catch {
      // Fallback
    }
    this.listeners.forEach((l) => l(this.balance));
  }

  public subscribe(listener: WalletListener): () => void {
    this.listeners.add(listener);
    listener(this.balance);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getBalance(): number {
    return this.balance;
  }

  public getTransactions(): WalletTransaction[] {
    return [...this.transactions];
  }

  public async topUp(amountINR: number, paymentMethod: string = 'UPI'): Promise<{ balance: number; transaction: WalletTransaction }> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    this.balance = Math.round((this.balance + amountINR) * 100) / 100;

    const newTxn: WalletTransaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'recharge',
      title: 'Wallet Recharge',
      description: `${paymentMethod} Instant Top-up`,
      amountINR,
      date: 'Just now',
      status: 'Success',
      balanceAfterINR: this.balance,
      paymentMethod,
    };

    this.transactions.unshift(newTxn);
    this.persist();

    return { balance: this.balance, transaction: newTxn };
  }

  public debit(amountINR: number, description: string): boolean {
    if (this.balance < amountINR) {
      return false;
    }

    this.balance = Math.max(0, Math.round((this.balance - amountINR) * 100) / 100);

    const newTxn: WalletTransaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'charging',
      title: 'Charging Session Fee',
      description,
      amountINR,
      date: 'Just now',
      status: 'Success',
      balanceAfterINR: this.balance,
      paymentMethod: 'Voltgrid Wallet',
    };

    this.transactions.unshift(newTxn);
    this.persist();
    return true;
  }
}

export const walletService = new WalletService();
