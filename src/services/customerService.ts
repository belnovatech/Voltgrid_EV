import { ENV } from '../config/environment';
import {
  CustomerDashboardData,
  CustomerProfile,
  CustomerVehicle,
  CustomerReservation,
  ChargingHistoryItem,
  WalletTransaction,
  CustomerNotification,
  SupportTicket,
} from '../types/customer';
import { apiClient } from './apiClient';

const INITIAL_PROFILE: CustomerProfile = {
  id: 'usr_bala_01',
  name: 'Bala Krishna',
  phoneNumber: '8074407557',
  email: 'bala@example.com',
  city: 'Vijayawada',
  state: 'Andhra Pradesh',
  walletBalance: 1250,
  avatarInitials: 'BK',
  isProfileComplete: true,
  memberSince: 'Jan 2024',
  isVerified: true,
};

const INITIAL_VEHICLES: CustomerVehicle[] = [
  {
    id: 'veh_01',
    name: 'My Nexon',
    manufacturer: 'Tata Motors',
    model: 'Nexon EV Max',
    type: 'Car',
    licensePlate: 'AP-39-AB-1234',
    batteryCapacityKWh: 40.5,
    connector: 'CCS2',
    chargingSessionsCount: 18,
    batteryPercentage: 68,
    isDefault: true,
    ratePerKWh: 12,
  },
  {
    id: 'veh_02',
    name: 'My Ola',
    manufacturer: 'Ola Electric',
    model: 'S1 Pro',
    type: 'Bike',
    licensePlate: 'AP-39-CD-5678',
    batteryCapacityKWh: 4,
    connector: 'Type 2',
    chargingSessionsCount: 7,
    batteryPercentage: 92,
    isDefault: false,
    ratePerKWh: 8,
  },
];

const INITIAL_RESERVATIONS: CustomerReservation[] = [
  {
    id: 'res_01',
    stationId: 'st-vja-01',
    stationName: 'Vijayawada Central',
    city: 'Vijayawada',
    chargerId: 'CH-005',
    chargerType: '120 kW CCS2',
    powerKw: 120,
    vehicleName: 'Tata Nexon EV',
    vehiclePlate: 'AP 16 EV 9088',
    vehicleType: 'Car',
    date: '2024-12-16',
    timeSlot: '14:00 - 15:00',
    startTime: '14:00',
    durationMinutes: 60,
    durationText: '1h',
    estimatedCostINR: 72,
    status: 'upcoming',
    ratePerKWh: 12,
  },
  {
    id: 'res_02',
    stationId: 'st-vsp-01',
    stationName: 'Visakhapatnam Port',
    city: 'Visakhapatnam',
    chargerId: 'CH-015',
    chargerType: '120 kW CCS2',
    powerKw: 120,
    vehicleName: 'MG ZS EV',
    vehiclePlate: 'AP 31 EV 4422',
    vehicleType: 'Car',
    date: '2024-12-16',
    timeSlot: '10:00 - 10:45',
    startTime: '10:00',
    durationMinutes: 45,
    durationText: '45m',
    estimatedCostINR: 54,
    status: 'upcoming',
    ratePerKWh: 12,
  },
  {
    id: 'res_03',
    stationId: 'st-tpt-01',
    stationName: 'Tirupati East Hub',
    city: 'Tirupati',
    chargerId: 'CH-028',
    chargerType: '60 kW CCS2',
    powerKw: 60,
    vehicleName: 'Ather 450X',
    vehiclePlate: 'AP 16 BK 1204',
    vehicleType: 'Bike',
    date: '2024-12-15',
    timeSlot: '12:00 - 12:30',
    startTime: '12:00',
    durationMinutes: 30,
    durationText: '30m',
    estimatedCostINR: 16,
    status: 'active',
    ratePerKWh: 8,
  },
  {
    id: 'res_04',
    stationId: 'st-amr-01',
    stationName: 'Amaravati Capital',
    city: 'Amaravati',
    chargerId: 'CH-001',
    chargerType: '150 kW CCS2',
    powerKw: 150,
    vehicleName: 'Tata Nexon EV',
    vehiclePlate: 'AP 16 EV 9088',
    vehicleType: 'Car',
    date: '2024-12-14',
    timeSlot: '16:00 - 17:00',
    startTime: '16:00',
    durationMinutes: 60,
    durationText: '1h',
    estimatedCostINR: 72,
    status: 'completed',
    ratePerKWh: 12,
  },
];

const INITIAL_HISTORY: ChargingHistoryItem[] = [
  {
    id: 'hist_01',
    stationName: 'Vijayawada Central',
    stationAddress: 'MG Road, Vijayawada',
    city: 'Vijayawada',
    chargerId: 'CH-027',
    vehicleName: 'Tata Nexon EV',
    vehiclePlate: 'AP-39-AB-1234',
    vehicleType: 'Car',
    energyConsumedKWh: 31.5,
    durationMinutes: 42,
    ratePerKWh: 12,
    totalCostINR: 457.84,
    date: '2024-12-15',
    startTime: '14:20',
    endTime: '15:02',
    status: 'completed',
  },
  {
    id: 'hist_02',
    stationName: 'Vijayawada Central',
    stationAddress: 'MG Road, Vijayawada',
    city: 'Vijayawada',
    chargerId: 'CH-003',
    vehicleName: 'Ola S1 Pro',
    vehiclePlate: 'AP-39-CD-5678',
    vehicleType: 'Bike',
    energyConsumedKWh: 3.8,
    durationMinutes: 45,
    ratePerKWh: 8,
    totalCostINR: 41.78,
    date: '2024-12-14',
    startTime: '10:15',
    endTime: '11:00',
    status: 'completed',
  },
];

const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'TXN-10041',
    type: 'recharge',
    title: 'Wallet Recharge',
    description: 'UPI · Google Pay',
    amountINR: 1000.0,
    date: '2024-12-15 09:00',
    status: 'Success',
    balanceAfterINR: 1250.0,
    paymentMethod: 'UPI',
  },
  {
    id: 'TXN-10040',
    type: 'charging',
    title: 'Charging Session',
    description: 'Vijayawada Central · 31.5 kWh',
    amountINR: 457.84,
    date: '2024-12-15 11:06',
    status: 'Success',
    balanceAfterINR: 792.16,
    paymentMethod: 'Wallet',
  },
  {
    id: 'TXN-10039',
    type: 'charging',
    title: 'Charging Session',
    description: 'Vijayawada Central · 3.8 kWh',
    amountINR: 41.78,
    date: '2024-12-14 08:00',
    status: 'Success',
    balanceAfterINR: 1250.0,
    paymentMethod: 'Wallet',
  },
  {
    id: 'TXN-10038',
    type: 'recharge',
    title: 'Wallet Recharge',
    description: 'Debit Card · HDFC Bank',
    amountINR: 500.0,
    date: '2024-12-10 14:30',
    status: 'Success',
    balanceAfterINR: 1291.78,
    paymentMethod: 'Debit/Credit Card',
  },
  {
    id: 'TXN-10037',
    type: 'refund',
    title: 'Reservation Refund',
    description: 'Cancelled Slot Refund',
    amountINR: 72.0,
    date: '2024-12-08 10:00',
    status: 'Success',
    balanceAfterINR: 791.78,
    paymentMethod: 'UPI',
  },
  {
    id: 'TXN-10036',
    type: 'charging',
    title: 'Charging Session',
    description: 'Benz Circle Hub · 28.5 kWh',
    amountINR: 413.88,
    date: '2024-12-07 16:20',
    status: 'Success',
    balanceAfterINR: 719.78,
    paymentMethod: 'Wallet',
  },
];

const INITIAL_NOTIFICATIONS: CustomerNotification[] = [
  {
    id: 'notif_01',
    title: 'Charging Complete',
    message: 'Your Tata Nexon EV has finished charging. 31.5 kWh delivered.',
    timestamp: '2h ago',
    isRead: false,
    type: 'charging',
    targetRoute: '/customer/history',
  },
  {
    id: 'notif_02',
    title: 'Reservation Reminder',
    message: 'Your reservation at Vijayawada Central starts in 15 minutes.',
    timestamp: '3h ago',
    isRead: false,
    type: 'reservation',
    targetRoute: '/customer/reservations',
  },
  {
    id: 'notif_03',
    title: 'Wallet Recharged',
    message: '₹1,000 has been added to your wallet. New balance: ₹1,250',
    timestamp: '5h ago',
    isRead: true,
    type: 'wallet',
    targetRoute: '/customer/wallet',
  },
  {
    id: 'notif_04',
    title: 'Wallet Balance Low',
    message: 'Your wallet balance is below ₹200. Add money to continue charging.',
    timestamp: '1d ago',
    isRead: true,
    type: 'alert',
    targetRoute: '/customer/wallet',
  },
  {
    id: 'notif_05',
    title: 'Charger Back Online',
    message: 'CH-027 at Vijayawada Central is now operational.',
    timestamp: '2d ago',
    isRead: true,
    type: 'alert',
    targetRoute: '/customer/chargers',
  },
];

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'SUP-10284',
    subject: 'Charger stopped unexpectedly during 120kW session',
    category: 'Charging Issues',
    status: 'In Progress',
    stationName: 'Vijayawada Central',
    chargerId: 'CH-005',
    description: 'The high-speed charger stopped charging at 82% SoC unexpectedly. Transaction ID TXN-10040.',
    createdAt: '2024-12-15 11:20',
    lastUpdate: '2024-12-15 11:45',
    replies: [
      {
        id: 'rep_01',
        sender: 'customer',
        message: 'The high-speed charger stopped charging at 82% SoC unexpectedly. Transaction ID TXN-10040.',
        timestamp: '2024-12-15 11:20',
      },
      {
        id: 'rep_02',
        sender: 'support',
        message: 'Hello Bala Krishna, our telemetry indicates thermal cut-off triggered safely by vehicle BMS. We have recalibrated the unit and credited ₹50 wallet compensation.',
        timestamp: '2024-12-15 11:45',
      },
    ],
  },
  {
    id: 'SUP-10192',
    subject: 'GST Invoice revision for November sessions',
    category: 'Wallet & Payments',
    status: 'Resolved',
    description: 'Need B2B revised invoice with company GSTIN updated for tax compliance.',
    createdAt: '2024-12-05 14:10',
    lastUpdate: '2024-12-06 09:30',
    replies: [
      {
        id: 'rep_03',
        sender: 'customer',
        message: 'Need B2B revised invoice with company GSTIN updated for tax compliance.',
        timestamp: '2024-12-05 14:10',
      },
      {
        id: 'rep_04',
        sender: 'support',
        message: 'Revised GST tax invoice has been sent to your registered email address.',
        timestamp: '2024-12-06 09:30',
      },
    ],
  },
];

class CustomerService {
  private profile: CustomerProfile = { ...INITIAL_PROFILE };
  private vehicles: CustomerVehicle[] = [...INITIAL_VEHICLES];
  private reservations: CustomerReservation[] = [...INITIAL_RESERVATIONS];
  private history: ChargingHistoryItem[] = [...INITIAL_HISTORY];
  private transactions: WalletTransaction[] = [...INITIAL_TRANSACTIONS];
  private notifications: CustomerNotification[] = [...INITIAL_NOTIFICATIONS];
  private tickets: SupportTicket[] = [...INITIAL_TICKETS];

  constructor() {
    // Check if session storage has updated profile
    const saved = sessionStorage.getItem('vg_customer_profile');
    if (saved) {
      try {
        this.profile = JSON.parse(saved);
      } catch {
        // use default
      }
    }

    const savedVehicles = sessionStorage.getItem('vg_customer_vehicles');
    if (savedVehicles) {
      try {
        this.vehicles = JSON.parse(savedVehicles);
      } catch {
        // use default
      }
    }
    const savedTransactions = sessionStorage.getItem('vg_customer_transactions');
    if (savedTransactions) {
      try {
        this.transactions = JSON.parse(savedTransactions);
      } catch {
        // use default
      }
    }

    const savedReservations = sessionStorage.getItem('vg_customer_reservations');
    if (savedReservations) {
      try {
        this.reservations = JSON.parse(savedReservations);
      } catch {
        // use default
      }
    }

    const savedHistory = sessionStorage.getItem('vg_customer_history');
    if (savedHistory) {
      try {
        this.history = JSON.parse(savedHistory);
      } catch {
        // use default
      }
    }

    const savedNotifications = sessionStorage.getItem('vg_customer_notifications');
    if (savedNotifications) {
      try {
        this.notifications = JSON.parse(savedNotifications);
      } catch {
        // use default
      }
    }

    const savedTickets = sessionStorage.getItem('vg_customer_tickets');
    if (savedTickets) {
      try {
        this.tickets = JSON.parse(savedTickets);
      } catch {
        // use default
      }
    }
  }

  private notifyNotifChange() {
    sessionStorage.setItem('vg_customer_notifications', JSON.stringify(this.notifications));
    window.dispatchEvent(new CustomEvent('powergrid_notifications_updated'));
  }

  async getDashboardData(): Promise<CustomerDashboardData> {
    if (ENV.IS_DEMO_MODE) {
      await new Promise((res) => setTimeout(res, 200));
      return {
        profile: this.profile,
        walletBalance: this.profile.walletBalance,
        activeSession: null,
        lastCharging: {
          amountINR: 457,
          energyKWh: 31.5,
          durationMin: 42,
        },
        totalEnergyThisMonthKWh: 148,
        vehicles: this.vehicles,
        nearbyStations: [
          {
            id: 'st_01',
            name: 'Benz Circle Hub',
            city: 'Vijayawada',
            distanceKm: 2.4,
            availablePoints: 4,
            totalPoints: 6,
            powerKw: 60,
            ratePerKWh: 12,
          },
          {
            id: 'st_02',
            name: 'MG Road Energy Park',
            city: 'Vijayawada',
            distanceKm: 4.8,
            availablePoints: 2,
            totalPoints: 4,
            powerKw: 120,
            ratePerKWh: 12,
          },
          {
            id: 'st_03',
            name: 'Brodipet Energy Point',
            city: 'Guntur',
            distanceKm: 31.2,
            availablePoints: 3,
            totalPoints: 4,
            powerKw: 60,
            ratePerKWh: 12,
          },
        ],
        unreadNotificationsCount: this.notifications.filter((n) => !n.isRead).length,
      };
    }
    return apiClient<CustomerDashboardData>('/customer/dashboard');
  }

  async getProfile(): Promise<CustomerProfile> {
    return this.profile;
  }

  async updateProfile(updates: Partial<CustomerProfile>): Promise<CustomerProfile> {
    this.profile = {
      ...this.profile,
      ...updates,
      avatarInitials: updates.name
        ? updates.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : this.profile.avatarInitials,
      isProfileComplete: true,
    };
    sessionStorage.setItem('vg_customer_profile', JSON.stringify(this.profile));
    return this.profile;
  }

  async getVehicles(): Promise<CustomerVehicle[]> {
    return [...this.vehicles];
  }

  async addVehicle(veh: Omit<CustomerVehicle, 'id'>): Promise<CustomerVehicle> {
    const isFirst = this.vehicles.length === 0;
    const shouldBePrimary = veh.isDefault || isFirst;

    if (shouldBePrimary) {
      this.vehicles = this.vehicles.map((v) => ({ ...v, isDefault: false }));
    }

    const newVeh: CustomerVehicle = {
      ...veh,
      id: `veh_${Date.now()}`,
      isDefault: shouldBePrimary,
      chargingSessionsCount: veh.chargingSessionsCount ?? 0,
      batteryPercentage: veh.batteryPercentage ?? 100,
      createdAt: new Date().toISOString(),
    };

    this.vehicles.push(newVeh);
    sessionStorage.setItem('vg_customer_vehicles', JSON.stringify(this.vehicles));
    return newVeh;
  }

  async updateVehicle(id: string, updates: Partial<CustomerVehicle>): Promise<CustomerVehicle> {
    const idx = this.vehicles.findIndex((v) => v.id === id);
    if (idx === -1) {
      throw new Error('Vehicle not found.');
    }

    if (updates.isDefault) {
      this.vehicles = this.vehicles.map((v) => ({ ...v, isDefault: false }));
    }

    this.vehicles[idx] = {
      ...this.vehicles[idx],
      ...updates,
    };

    sessionStorage.setItem('vg_customer_vehicles', JSON.stringify(this.vehicles));
    return this.vehicles[idx];
  }

  async deleteVehicle(id: string): Promise<boolean> {
    const target = this.vehicles.find((v) => v.id === id);
    if (!target) return false;

    this.vehicles = this.vehicles.filter((v) => v.id !== id);

    // If deleted vehicle was primary and other vehicles exist, make first remaining vehicle primary
    if (target.isDefault && this.vehicles.length > 0) {
      this.vehicles[0].isDefault = true;
    }

    sessionStorage.setItem('vg_customer_vehicles', JSON.stringify(this.vehicles));
    return true;
  }

  async setPrimaryVehicle(id: string): Promise<boolean> {
    const exists = this.vehicles.some((v) => v.id === id);
    if (!exists) return false;

    this.vehicles = this.vehicles.map((v) => ({
      ...v,
      isDefault: v.id === id,
    }));

    sessionStorage.setItem('vg_customer_vehicles', JSON.stringify(this.vehicles));
    return true;
  }

  async getReservations(): Promise<CustomerReservation[]> {
    return [...this.reservations];
  }

  async createReservation(res: Omit<CustomerReservation, 'id' | 'status'>): Promise<CustomerReservation> {
    const newReservation: CustomerReservation = {
      ...res,
      id: `res_${Date.now()}`,
      status: 'upcoming',
    };
    this.reservations.unshift(newReservation);
    sessionStorage.setItem('vg_customer_reservations', JSON.stringify(this.reservations));
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      title: 'Reservation Confirmed',
      message: `Your slot at ${res.stationName} (${res.timeSlot}) has been reserved.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'reservation',
      targetRoute: '/customer/reservations',
    });
    this.notifyNotifChange();
    return newReservation;
  }

  async cancelReservation(id: string): Promise<boolean> {
    this.reservations = this.reservations.map((r) =>
      r.id === id ? { ...r, status: 'cancelled' } : r
    );
    sessionStorage.setItem('vg_customer_reservations', JSON.stringify(this.reservations));
    return true;
  }

  async getChargingHistory(): Promise<ChargingHistoryItem[]> {
    return [...this.history];
  }

  async getWalletTransactions(): Promise<WalletTransaction[]> {
    return [...this.transactions];
  }

  async addMoney(amountINR: number, paymentMethod: string = 'UPI'): Promise<{ balance: number; transaction: WalletTransaction }> {
    // Simulate real gateway latency
    await new Promise((res) => setTimeout(res, 600));

    this.profile.walletBalance = Number((this.profile.walletBalance + amountINR).toFixed(2));
    
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const txnNumber = Math.floor(10042 + Math.random() * 89900);

    const newTxn: WalletTransaction = {
      id: `TXN-${txnNumber}`,
      type: 'recharge',
      title: 'Wallet Recharge',
      description: `${paymentMethod} · Successful Top-up`,
      amountINR: amountINR,
      date: formattedDate,
      status: 'Success',
      balanceAfterINR: this.profile.walletBalance,
      paymentMethod,
    };

    this.transactions.unshift(newTxn);
    sessionStorage.setItem('vg_customer_profile', JSON.stringify(this.profile));
    sessionStorage.setItem('vg_customer_transactions', JSON.stringify(this.transactions));
    
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      title: 'Wallet Recharged',
      message: `₹${amountINR.toLocaleString('en-IN')} has been added to your wallet. New balance: ₹${this.profile.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      timestamp: 'Just now',
      isRead: false,
      type: 'wallet',
      targetRoute: '/customer/wallet',
    });
    this.notifyNotifChange();

    return {
      balance: this.profile.walletBalance,
      transaction: newTxn,
    };
  }

  async getNotifications(): Promise<CustomerNotification[]> {
    return [...this.notifications];
  }

  async markNotificationAsRead(id: string): Promise<void> {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    this.notifyNotifChange();
  }

  async markAllNotificationsAsRead(): Promise<void> {
    this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
    this.notifyNotifChange();
  }

  async getSupportTickets(): Promise<SupportTicket[]> {
    return [...this.tickets];
  }

  async createSupportTicket(data: {
    subject: string;
    category: string;
    description: string;
    stationName?: string;
    chargerId?: string;
  }): Promise<SupportTicket> {
    await new Promise((res) => setTimeout(res, 400));
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const tckNumber = Math.floor(10285 + Math.random() * 89000);

    const tck: SupportTicket = {
      id: `SUP-${tckNumber}`,
      subject: data.subject,
      category: data.category,
      description: data.description,
      stationName: data.stationName,
      chargerId: data.chargerId,
      status: 'Open',
      createdAt: formattedDate,
      lastUpdate: 'Just now',
      replies: [
        {
          id: `rep_${Date.now()}`,
          sender: 'customer',
          message: data.description,
          timestamp: formattedDate,
        },
      ],
    };

    this.tickets.unshift(tck);
    sessionStorage.setItem('vg_customer_tickets', JSON.stringify(this.tickets));
    return tck;
  }

  async addTicketReply(ticketId: string, message: string): Promise<SupportTicket> {
    const idx = this.tickets.findIndex((t) => t.id === ticketId);
    if (idx === -1) throw new Error('Ticket not found');

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newReply = {
      id: `rep_${Date.now()}`,
      sender: 'customer' as const,
      message,
      timestamp: formattedDate,
    };

    const updatedTicket: SupportTicket = {
      ...this.tickets[idx],
      lastUpdate: 'Just now',
      status: this.tickets[idx].status === 'Resolved' || this.tickets[idx].status === 'Closed' ? 'Open' : this.tickets[idx].status,
      replies: [...(this.tickets[idx].replies || []), newReply],
    };

    this.tickets[idx] = updatedTicket;
    sessionStorage.setItem('vg_customer_tickets', JSON.stringify(this.tickets));
    return updatedTicket;
  }

  async updateTicketStatus(ticketId: string, status: SupportTicket['status']): Promise<SupportTicket> {
    const idx = this.tickets.findIndex((t) => t.id === ticketId);
    if (idx === -1) throw new Error('Ticket not found');

    this.tickets[idx] = {
      ...this.tickets[idx],
      status,
      lastUpdate: 'Just now',
    };
    sessionStorage.setItem('vg_customer_tickets', JSON.stringify(this.tickets));
    return this.tickets[idx];
  }
}

export const customerService = new CustomerService();
