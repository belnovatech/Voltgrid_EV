import { API_CONFIG } from './apiConfig';
import {
  CustomerDashboardData,
  CustomerProfile,
  CustomerVehicle,
  CustomerReservation,
  ChargingHistoryItem,
  CustomerNotification,
  SupportTicket,
} from '../types/customer';
import { apiClient } from './apiClient';
import { walletService } from './walletService';

const INITIAL_PROFILE: CustomerProfile = {
  id: 'usr_bala_01',
  name: 'Bala Krishna',
  phoneNumber: '8074407557',
  email: 'bala.krishna@voltgrid.ev',
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
    name: 'My Nexon EV',
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
    name: 'My Ola S1',
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
    stationName: 'Vijayawada Central Hub',
    city: 'Vijayawada',
    chargerId: 'CH-005',
    chargerType: '120 kW CCS2 Supercharger',
    powerKw: 120,
    vehicleName: 'Tata Nexon EV Max',
    vehiclePlate: 'AP 39 AB 1234',
    vehicleType: 'Car',
    date: 'Today',
    timeSlot: '04:00 PM - 05:00 PM',
    startTime: '16:00',
    durationMinutes: 60,
    durationText: '1h',
    estimatedCostINR: 280,
    status: 'upcoming',
    ratePerKWh: 12,
  },
];

const INITIAL_HISTORY: ChargingHistoryItem[] = [
  {
    id: 'ch-hist-01',
    stationName: 'Vijayawada Central Hub',
    city: 'Vijayawada',
    chargerId: 'CH-005',
    date: 'Yesterday, 11:06 AM',
    startTime: '11:06 AM',
    endTime: '11:48 AM',
    energyConsumedKWh: 31.5,
    durationMinutes: 42,
    ratePerKWh: 12,
    totalCostINR: 457.84,
    vehicleName: 'Tata Nexon EV Max',
    vehiclePlate: 'AP 39 AB 1234',
    vehicleType: 'Car',
    status: 'completed',
  },
  {
    id: 'ch-hist-02',
    stationName: 'Visakhapatnam Beach Road Point',
    city: 'Visakhapatnam',
    chargerId: 'CH-015',
    date: '22 Oct, 03:15 PM',
    startTime: '03:15 PM',
    endTime: '03:55 PM',
    energyConsumedKWh: 28.2,
    durationMinutes: 40,
    ratePerKWh: 12,
    totalCostINR: 395.2,
    vehicleName: 'Tata Nexon EV Max',
    vehiclePlate: 'AP 39 AB 1234',
    vehicleType: 'Car',
    status: 'completed',
  },
  {
    id: 'ch-hist-03',
    stationName: 'Guntur City Express Hub',
    city: 'Guntur',
    chargerId: 'CH-099',
    date: '18 Oct, 08:30 AM',
    startTime: '08:30 AM',
    endTime: '09:00 AM',
    energyConsumedKWh: 18.0,
    durationMinutes: 30,
    ratePerKWh: 12,
    totalCostINR: 252.0,
    vehicleName: 'Tata Nexon EV Max',
    vehiclePlate: 'AP 39 AB 1234',
    vehicleType: 'Car',
    status: 'completed',
  },
];

const INITIAL_NOTIFICATIONS: CustomerNotification[] = [
  {
    id: 'notif_01',
    title: 'Charging Complete',
    message: 'Your Nexon EV has reached 80% SoC at Vijayawada Central. 31.5 kWh delivered.',
    timestamp: 'Yesterday',
    isRead: false,
    type: 'charging',
    targetRoute: '/activity',
  },
  {
    id: 'notif_02',
    title: 'Upcoming Reservation',
    message: 'Charger CH-005 is reserved for you today at 04:00 PM.',
    timestamp: '2h ago',
    isRead: false,
    type: 'reservation',
    targetRoute: '/bookings',
  },
  {
    id: 'notif_03',
    title: 'Wallet Recharged',
    message: '₹1,000 has been credited to your Voltgrid Wallet.',
    timestamp: '3h ago',
    isRead: true,
    type: 'wallet',
    targetRoute: '/activity',
  },
];

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'SUP-10284',
    subject: 'Charger stopped at 82% SoC',
    category: 'Charging Issues',
    status: 'In Progress',
    stationName: 'Vijayawada Central Hub',
    chargerId: 'CH-005',
    description: 'The fast charger paused session at 82% battery level. Transaction #10040.',
    createdAt: '2024-12-15 11:20',
    lastUpdate: '2024-12-15 11:45',
    replies: [
      {
        id: 'rep_01',
        sender: 'customer',
        message: 'The fast charger stopped at 82% SoC unexpectedly. Transaction ID TXN-10040.',
        timestamp: '2024-12-15 11:20',
      },
      {
        id: 'rep_02',
        sender: 'support',
        message: 'Hello Bala Krishna, telemetry indicates thermal management throttling by vehicle BMS. System operated normally and safely.',
        timestamp: '2024-12-15 11:45',
      },
    ],
  },
];

class CustomerService {
  private profile: CustomerProfile = { ...INITIAL_PROFILE };
  private vehicles: CustomerVehicle[] = [...INITIAL_VEHICLES];
  private reservations: CustomerReservation[] = [...INITIAL_RESERVATIONS];
  private history: ChargingHistoryItem[] = [...INITIAL_HISTORY];
  private notifications: CustomerNotification[] = [...INITIAL_NOTIFICATIONS];
  private tickets: SupportTicket[] = [...INITIAL_TICKETS];

  constructor() {
    this.restore();
  }

  private restore() {
    try {
      const p = localStorage.getItem('vg_cust_profile');
      if (p) this.profile = JSON.parse(p);
      const v = localStorage.getItem('vg_cust_vehicles');
      if (v) this.vehicles = JSON.parse(v);
      const r = localStorage.getItem('vg_cust_res');
      if (r) this.reservations = JSON.parse(r);
      const n = localStorage.getItem('vg_cust_notifs');
      if (n) this.notifications = JSON.parse(n);
      const t = localStorage.getItem('vg_cust_tickets');
      if (t) this.tickets = JSON.parse(t);
    } catch {
      // defaults
    }
  }

  private persist() {
    try {
      localStorage.setItem('vg_cust_profile', JSON.stringify(this.profile));
      localStorage.setItem('vg_cust_vehicles', JSON.stringify(this.vehicles));
      localStorage.setItem('vg_cust_res', JSON.stringify(this.reservations));
      localStorage.setItem('vg_cust_notifs', JSON.stringify(this.notifications));
      localStorage.setItem('vg_cust_tickets', JSON.stringify(this.tickets));
    } catch {
      // fallback
    }
  }

  async getDashboardData(): Promise<CustomerDashboardData> {
    const bal = walletService.getBalance();
    const primaryVehicle = this.vehicles.find((v) => v.isDefault) || this.vehicles[0];

    if (API_CONFIG.IS_DEMO_MODE) {
      await new Promise((res) => setTimeout(res, 200));
      return {
        profile: { ...this.profile, walletBalance: bal },
        walletBalance: bal,
        activeSession: null,
        lastCharging: {
          amountINR: 457.84,
          energyKWh: 31.5,
          durationMin: 42,
        },
        totalEnergyThisMonthKWh: 148,
        vehicles: this.vehicles,
        nearbyStations: [
          {
            id: 'st-01',
            name: 'Vijayawada Central Hub',
            city: 'Vijayawada',
            distanceKm: 2.4,
            availablePoints: 4,
            totalPoints: 6,
            powerKw: 120,
            ratePerKWh: 12,
          },
          {
            id: 'st-02',
            name: 'MG Road Energy Park',
            city: 'Vijayawada',
            distanceKm: 4.8,
            availablePoints: 2,
            totalPoints: 4,
            powerKw: 60,
            ratePerKWh: 12,
          },
          {
            id: 'st-03',
            name: 'Benz Circle Fast Charger',
            city: 'Vijayawada',
            distanceKm: 3.1,
            availablePoints: 3,
            totalPoints: 4,
            powerKw: 150,
            ratePerKWh: 14,
          },
        ],
        unreadNotificationsCount: this.notifications.filter((n) => !n.isRead).length,
      };
    }

    return apiClient<CustomerDashboardData>('/customer/dashboard');
  }

  async getProfile(): Promise<CustomerProfile> {
    const bal = walletService.getBalance();
    return { ...this.profile, walletBalance: bal };
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
    };
    this.persist();
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
      chargingSessionsCount: 0,
      createdAt: new Date().toISOString(),
    };

    this.vehicles.push(newVeh);
    this.persist();
    return newVeh;
  }

  async updateVehicle(id: string, updates: Partial<CustomerVehicle>): Promise<CustomerVehicle> {
    const idx = this.vehicles.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error('Vehicle not found.');

    if (updates.isDefault) {
      this.vehicles = this.vehicles.map((v) => ({ ...v, isDefault: false }));
    }

    this.vehicles[idx] = { ...this.vehicles[idx], ...updates };
    this.persist();
    return this.vehicles[idx];
  }

  async deleteVehicle(id: string): Promise<boolean> {
    const target = this.vehicles.find((v) => v.id === id);
    if (!target) return false;

    this.vehicles = this.vehicles.filter((v) => v.id !== id);
    if (target.isDefault && this.vehicles.length > 0) {
      this.vehicles[0].isDefault = true;
    }
    this.persist();
    return true;
  }

  async setPrimaryVehicle(id: string): Promise<boolean> {
    const exists = this.vehicles.some((v) => v.id === id);
    if (!exists) return false;
    this.vehicles = this.vehicles.map((v) => ({
      ...v,
      isDefault: v.id === id,
    }));
    this.persist();
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
      createdAt: new Date().toISOString(),
    };
    this.reservations.unshift(newReservation);
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      title: 'Reservation Confirmed',
      message: `Charger slot at ${res.stationName} (${res.timeSlot}) is reserved.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'reservation',
      targetRoute: '/bookings',
    });
    this.persist();
    return newReservation;
  }

  async cancelReservation(id: string): Promise<boolean> {
    this.reservations = this.reservations.map((r) =>
      r.id === id ? { ...r, status: 'cancelled' as const } : r
    );
    this.persist();
    return true;
  }

  async getChargingHistory(): Promise<ChargingHistoryItem[]> {
    return [...this.history];
  }

  async addChargingHistoryItem(item: ChargingHistoryItem): Promise<void> {
    this.history.unshift(item);
    localStorage.setItem('vg_cust_history', JSON.stringify(this.history));
  }

  async getNotifications(): Promise<CustomerNotification[]> {
    return [...this.notifications];
  }

  async markNotificationRead(id: string): Promise<void> {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    this.persist();
  }

  async markAllNotificationsRead(): Promise<void> {
    this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }));
    this.persist();
  }

  async getSupportTickets(): Promise<SupportTicket[]> {
    return [...this.tickets];
  }

  async createSupportTicket(data: { subject: string; category: string; description: string; stationName?: string; chargerId?: string }): Promise<SupportTicket> {
    const newTicket: SupportTicket = {
      id: `SUP-${Math.floor(10000 + Math.random() * 90000)}`,
      subject: data.subject,
      category: data.category,
      description: data.description,
      stationName: data.stationName,
      chargerId: data.chargerId,
      status: 'Open',
      createdAt: 'Just now',
      lastUpdate: 'Just now',
      replies: [
        {
          id: `rep_${Date.now()}`,
          sender: 'customer',
          message: data.description,
          timestamp: 'Just now',
        },
      ],
    };
    this.tickets.unshift(newTicket);
    this.persist();
    return newTicket;
  }

  async replyTicket(ticketId: string, message: string): Promise<SupportTicket> {
    const idx = this.tickets.findIndex((t) => t.id === ticketId);
    if (idx === -1) throw new Error('Ticket not found.');

    const newReply = {
      id: `rep_${Date.now()}`,
      sender: 'customer' as const,
      message,
      timestamp: 'Just now',
    };

    const updated = {
      ...this.tickets[idx],
      lastUpdate: 'Just now',
      replies: [...(this.tickets[idx].replies || []), newReply],
    };

    this.tickets[idx] = updated;
    this.persist();
    return updated;
  }
}

export const customerService = new CustomerService();
