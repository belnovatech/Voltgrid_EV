import {
  SuperAdminArea,
  SuperAdminAdmin,
  SuperAdminCustomer,
  SuperAdminTransaction,
  SuperAdminSettlement,
  SuperAdminDashboardMetrics,
  WorkflowFilters,
} from '../types/superAdmin';
import { superAdminAuthService } from './superAdminAuthService';

const AREAS_KEY = 'vg_sa_areas_v1';
const ADMINS_KEY = 'vg_sa_admins_v1';
const CUSTOMERS_KEY = 'vg_sa_customers_v1';
const TRANSACTIONS_KEY = 'vg_sa_transactions_v1';
const SETTLEMENTS_KEY = 'vg_sa_settlements_v1';

// Seed authoritative data
const SEED_AREAS: SuperAdminArea[] = [
  {
    id: 'AP-Z01',
    code: 'AP-Z01',
    name: 'Vijayawada Central Hub',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    totalChargers: 10,
    assignedAdminIds: ['ADM-AP01'],
    assignedAdminNames: ['Ravi Kumar Varma'],
    totalCustomers: 48,
    activeCustomers: 42,
    newCustomers: 9,
    totalCustomerCollectionsINR: 428000,
    actualBusinessReceiptsINR: 385200,
    outstandingSettlementsINR: 21400,
    activeAdminsCount: 1,
    growthRatePercent: 14.8,
    status: 'Active',
  },
  {
    id: 'AP-Z02',
    code: 'AP-Z02',
    name: 'Visakhapatnam Port Terminal',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    totalChargers: 10,
    assignedAdminIds: ['ADM-AP02'],
    assignedAdminNames: ['Suresh Babu'],
    totalCustomers: 56,
    activeCustomers: 50,
    newCustomers: 12,
    totalCustomerCollectionsINR: 385000,
    actualBusinessReceiptsINR: 346500,
    outstandingSettlementsINR: 19250,
    activeAdminsCount: 1,
    growthRatePercent: 18.2,
    status: 'Active',
  },
  {
    id: 'AP-Z03',
    code: 'AP-Z03',
    name: 'Tirupati East Pilgrimage Hub',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    totalChargers: 10,
    assignedAdminIds: ['ADM-AP03'],
    assignedAdminNames: ['Anil Chowdary'],
    totalCustomers: 64,
    activeCustomers: 58,
    newCustomers: 15,
    totalCustomerCollectionsINR: 512000,
    actualBusinessReceiptsINR: 465920,
    outstandingSettlementsINR: 23040,
    activeAdminsCount: 1,
    growthRatePercent: 22.5,
    status: 'Active',
  },
  {
    id: 'AP-Z04',
    code: 'AP-Z04',
    name: 'Guntur Smart City Hub',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    totalChargers: 10,
    assignedAdminIds: ['ADM-AP04'],
    assignedAdminNames: ['Ramesh Naidu'],
    totalCustomers: 32,
    activeCustomers: 28,
    newCustomers: 6,
    totalCustomerCollectionsINR: 296000,
    actualBusinessReceiptsINR: 266400,
    outstandingSettlementsINR: 14800,
    activeAdminsCount: 1,
    growthRatePercent: 9.4,
    status: 'Active',
  },
  {
    id: 'AP-Z05',
    code: 'AP-Z05',
    name: 'Nellore NH-16 Corridor',
    city: 'Nellore',
    state: 'Andhra Pradesh',
    totalChargers: 10,
    assignedAdminIds: ['ADM-AP05'],
    assignedAdminNames: ['K. Venkatesh'],
    totalCustomers: 26,
    activeCustomers: 22,
    newCustomers: 5,
    totalCustomerCollectionsINR: 189000,
    actualBusinessReceiptsINR: 171990,
    outstandingSettlementsINR: 9450,
    activeAdminsCount: 1,
    growthRatePercent: 7.8,
    status: 'Active',
  },
  {
    id: 'AP-Z06',
    code: 'AP-Z06',
    name: 'Kurnool IT Park Hub',
    city: 'Kurnool',
    state: 'Andhra Pradesh',
    totalChargers: 10,
    assignedAdminIds: ['ADM-AP06'],
    assignedAdminNames: ['Srinivas Reddy'],
    totalCustomers: 38,
    activeCustomers: 34,
    newCustomers: 8,
    totalCustomerCollectionsINR: 337000,
    actualBusinessReceiptsINR: 303300,
    outstandingSettlementsINR: 16850,
    activeAdminsCount: 1,
    growthRatePercent: 12.1,
    status: 'Active',
  },
  {
    id: 'AP-Z07',
    code: 'AP-Z07',
    name: 'Kakinada Smart Port',
    city: 'Kakinada',
    state: 'Andhra Pradesh',
    totalChargers: 10,
    assignedAdminIds: ['ADM-AP02'],
    assignedAdminNames: ['Suresh Babu'],
    totalCustomers: 29,
    activeCustomers: 25,
    newCustomers: 4,
    totalCustomerCollectionsINR: 224000,
    actualBusinessReceiptsINR: 201600,
    outstandingSettlementsINR: 11200,
    activeAdminsCount: 1,
    growthRatePercent: 6.5,
    status: 'Active',
  },
  {
    id: 'AP-Z08',
    code: 'AP-Z08',
    name: 'Rajahmundry Godavari Hub',
    city: 'Rajahmundry',
    state: 'Andhra Pradesh',
    totalChargers: 10,
    assignedAdminIds: ['ADM-AP01'],
    assignedAdminNames: ['Ravi Kumar Varma'],
    totalCustomers: 35,
    activeCustomers: 31,
    newCustomers: 7,
    totalCustomerCollectionsINR: 271000,
    actualBusinessReceiptsINR: 243900,
    outstandingSettlementsINR: 13550,
    activeAdminsCount: 1,
    growthRatePercent: 10.3,
    status: 'Active',
  },
];

const SEED_ADMINS: SuperAdminAdmin[] = [
  {
    id: 'ADM-AP01',
    name: 'Ravi Kumar Varma',
    email: 'ravi.kumar@powergrid.in',
    phone: '+91 98480 11221',
    avatar: 'RK',
    assignedAreaIds: ['AP-Z01', 'AP-Z08'],
    assignedAreaNames: ['Vijayawada Central Hub', 'Rajahmundry Godavari Hub'],
    status: 'Active',
    commissionRatePercent: 5.0,
    totalCustomers: 83,
    activeCustomers: 73,
    newCustomers: 16,
    totalCustomerCollectionsINR: 699000,
    actualBusinessReceiptsINR: 629100,
    outstandingSettlementINR: 34950,
    totalCommissionEarnedINR: 34950,
    pendingCustomerPaymentsINR: 8500,
    refundsAndReversalsINR: 4200,
    settlementDueDate: '2026-11-05',
    bankDetails: {
      bankName: 'State Bank of India',
      accountNumberMasked: '•••• •••• 4410',
      ifsc: 'SBIN0001824',
    },
    lastActivity: '10 mins ago',
    joinedDate: '2024-01-15',
  },
  {
    id: 'ADM-AP02',
    name: 'Suresh Babu',
    email: 'suresh.babu@powergrid.in',
    phone: '+91 98480 22332',
    avatar: 'SB',
    assignedAreaIds: ['AP-Z02', 'AP-Z07'],
    assignedAreaNames: ['Visakhapatnam Port Terminal', 'Kakinada Smart Port'],
    status: 'Active',
    commissionRatePercent: 5.0,
    totalCustomers: 85,
    activeCustomers: 75,
    newCustomers: 16,
    totalCustomerCollectionsINR: 609000,
    actualBusinessReceiptsINR: 548100,
    outstandingSettlementINR: 30450,
    totalCommissionEarnedINR: 30450,
    pendingCustomerPaymentsINR: 6200,
    refundsAndReversalsINR: 3100,
    settlementDueDate: '2026-11-05',
    bankDetails: {
      bankName: 'HDFC Bank',
      accountNumberMasked: '•••• •••• 9812',
      ifsc: 'HDFC0000421',
    },
    lastActivity: '25 mins ago',
    joinedDate: '2024-02-01',
  },
  {
    id: 'ADM-AP03',
    name: 'Anil Chowdary',
    email: 'anil.chowdary@powergrid.in',
    phone: '+91 98480 33443',
    avatar: 'AC',
    assignedAreaIds: ['AP-Z03'],
    assignedAreaNames: ['Tirupati East Pilgrimage Hub'],
    status: 'Active',
    commissionRatePercent: 4.5,
    totalCustomers: 64,
    activeCustomers: 58,
    newCustomers: 15,
    totalCustomerCollectionsINR: 512000,
    actualBusinessReceiptsINR: 465920,
    outstandingSettlementINR: 23040,
    totalCommissionEarnedINR: 23040,
    pendingCustomerPaymentsINR: 4800,
    refundsAndReversalsINR: 1900,
    settlementDueDate: '2026-11-04',
    bankDetails: {
      bankName: 'ICICI Bank',
      accountNumberMasked: '•••• •••• 3301',
      ifsc: 'ICIC0000109',
    },
    lastActivity: '4 mins ago',
    joinedDate: '2024-02-15',
  },
  {
    id: 'ADM-AP04',
    name: 'Ramesh Naidu',
    email: 'ramesh.naidu@powergrid.in',
    phone: '+91 98480 44554',
    avatar: 'RN',
    assignedAreaIds: ['AP-Z04'],
    assignedAreaNames: ['Guntur Smart City Hub'],
    status: 'Active',
    commissionRatePercent: 5.0,
    totalCustomers: 32,
    activeCustomers: 28,
    newCustomers: 6,
    totalCustomerCollectionsINR: 296000,
    actualBusinessReceiptsINR: 266400,
    outstandingSettlementINR: 14800,
    totalCommissionEarnedINR: 14800,
    pendingCustomerPaymentsINR: 3200,
    refundsAndReversalsINR: 1200,
    settlementDueDate: '2026-11-06',
    bankDetails: {
      bankName: 'Axis Bank',
      accountNumberMasked: '•••• •••• 7714',
      ifsc: 'UTIB0000882',
    },
    lastActivity: '1 hour ago',
    joinedDate: '2024-03-01',
  },
  {
    id: 'ADM-AP05',
    name: 'K. Venkatesh',
    email: 'k.venkatesh@powergrid.in',
    phone: '+91 98480 55665',
    avatar: 'KV',
    assignedAreaIds: ['AP-Z05'],
    assignedAreaNames: ['Nellore NH-16 Corridor'],
    status: 'Active',
    commissionRatePercent: 5.0,
    totalCustomers: 26,
    activeCustomers: 22,
    newCustomers: 5,
    totalCustomerCollectionsINR: 189000,
    actualBusinessReceiptsINR: 171990,
    outstandingSettlementINR: 9450,
    totalCommissionEarnedINR: 9450,
    pendingCustomerPaymentsINR: 2100,
    refundsAndReversalsINR: 800,
    settlementDueDate: '2026-11-07',
    bankDetails: {
      bankName: 'Kotak Mahindra Bank',
      accountNumberMasked: '•••• •••• 5590',
      ifsc: 'KKBK0001201',
    },
    lastActivity: '3 hours ago',
    joinedDate: '2024-03-10',
  },
  {
    id: 'ADM-AP06',
    name: 'Srinivas Reddy',
    email: 'srinivas.reddy@powergrid.in',
    phone: '+91 98480 66776',
    avatar: 'SR',
    assignedAreaIds: ['AP-Z06'],
    assignedAreaNames: ['Kurnool IT Park Hub'],
    status: 'Active',
    commissionRatePercent: 5.0,
    totalCustomers: 38,
    activeCustomers: 34,
    newCustomers: 8,
    totalCustomerCollectionsINR: 337000,
    actualBusinessReceiptsINR: 303300,
    outstandingSettlementINR: 16850,
    totalCommissionEarnedINR: 16850,
    pendingCustomerPaymentsINR: 3600,
    refundsAndReversalsINR: 1500,
    settlementDueDate: '2026-11-05',
    bankDetails: {
      bankName: 'Punjab National Bank',
      accountNumberMasked: '•••• •••• 1289',
      ifsc: 'PUNB0004500',
    },
    lastActivity: '42 mins ago',
    joinedDate: '2024-03-20',
  },
];

const SEED_CUSTOMERS: SuperAdminCustomer[] = [
  {
    id: 'CUST-1001',
    name: 'Bala Krishna',
    phone: '+91 80744 07557',
    email: 'bala.krishna@gmail.com',
    areaId: 'AP-Z01',
    areaName: 'Vijayawada Central Hub',
    assignedAdminId: 'ADM-AP01',
    assignedAdminName: 'Ravi Kumar Varma',
    registrationDate: '2024-01-15',
    status: 'Active',
    totalAmountPaidINR: 18450,
    outstandingBalanceINR: 0,
    lastPaymentDate: '2026-10-27',
    vehicleModel: 'Tata Nexon EV Max',
    vehiclePlate: 'AP-39-AB-1234',
    totalSessions: 42,
    energyConsumedKWh: 890.4,
    paymentStatus: 'Up to Date',
  },
  {
    id: 'CUST-1002',
    name: 'P. Lakshmi',
    phone: '+91 98765 43211',
    email: 'lakshmi.p@yahoo.co.in',
    areaId: 'AP-Z02',
    areaName: 'Visakhapatnam Port Terminal',
    assignedAdminId: 'ADM-AP02',
    assignedAdminName: 'Suresh Babu',
    registrationDate: '2024-02-10',
    status: 'Active',
    totalAmountPaidINR: 24600,
    outstandingBalanceINR: 0,
    lastPaymentDate: '2026-10-28',
    vehicleModel: 'MG ZS EV Long Range',
    vehiclePlate: 'AP-31-EV-4422',
    totalSessions: 58,
    energyConsumedKWh: 1240.2,
    paymentStatus: 'Up to Date',
  },
  {
    id: 'CUST-1003',
    name: 'Ravi Teja Sharma',
    phone: '+91 98765 43212',
    email: 'raviteja.s@outlook.com',
    areaId: 'AP-Z03',
    areaName: 'Tirupati East Pilgrimage Hub',
    assignedAdminId: 'ADM-AP03',
    assignedAdminName: 'Anil Chowdary',
    registrationDate: '2024-03-05',
    status: 'Active',
    totalAmountPaidINR: 9800,
    outstandingBalanceINR: 450,
    lastPaymentDate: '2026-10-24',
    vehicleModel: 'Ather 450X Gen3',
    vehiclePlate: 'AP-16-BK-1204',
    totalSessions: 34,
    energyConsumedKWh: 185.6,
    paymentStatus: 'Pending',
  },
  {
    id: 'CUST-1004',
    name: 'Andhra State Fleet Co.',
    phone: '+91 99887 76655',
    email: 'fleet.ops@apsrtc.ap.gov.in',
    areaId: 'AP-Z01',
    areaName: 'Vijayawada Central Hub',
    assignedAdminId: 'ADM-AP01',
    assignedAdminName: 'Ravi Kumar Varma',
    registrationDate: '2023-11-01',
    status: 'Active',
    totalAmountPaidINR: 215000,
    outstandingBalanceINR: 6500,
    lastPaymentDate: '2026-10-26',
    vehicleModel: 'Olectra K9 Electric Coach',
    vehiclePlate: 'AP-16-Z-9901',
    totalSessions: 142,
    energyConsumedKWh: 8940.0,
    paymentStatus: 'Pending',
  },
  {
    id: 'CUST-1005',
    name: 'Srinivas Rao G',
    phone: '+91 98765 43214',
    email: 'srinivas.rao@gmail.com',
    areaId: 'AP-Z04',
    areaName: 'Guntur Smart City Hub',
    assignedAdminId: 'ADM-AP04',
    assignedAdminName: 'Ramesh Naidu',
    registrationDate: '2024-04-05',
    status: 'Active',
    totalAmountPaidINR: 7600,
    outstandingBalanceINR: 0,
    lastPaymentDate: '2026-10-25',
    vehicleModel: 'Mahindra XUV400',
    vehiclePlate: 'AP-07-CD-3091',
    totalSessions: 19,
    energyConsumedKWh: 380.0,
    paymentStatus: 'Up to Date',
  },
  {
    id: 'CUST-1006',
    name: 'Kavitha Reddy',
    phone: '+91 98765 43215',
    email: 'kavitha.reddy@techm.com',
    areaId: 'AP-Z06',
    areaName: 'Kurnool IT Park Hub',
    assignedAdminId: 'ADM-AP06',
    assignedAdminName: 'Srinivas Reddy',
    registrationDate: '2024-01-30',
    status: 'Inactive',
    totalAmountPaidINR: 4200,
    outstandingBalanceINR: 850,
    lastPaymentDate: '2026-09-12',
    vehicleModel: 'Hyundai Kona Electric',
    vehiclePlate: 'AP-21-EF-8812',
    totalSessions: 11,
    energyConsumedKWh: 210.5,
    paymentStatus: 'Overdue',
  },
  {
    id: 'CUST-1007',
    name: 'Dr. Mohan Varma',
    phone: '+91 98490 88210',
    email: 'dr.mohan@apolloap.in',
    areaId: 'AP-Z02',
    areaName: 'Visakhapatnam Port Terminal',
    assignedAdminId: 'ADM-AP02',
    assignedAdminName: 'Suresh Babu',
    registrationDate: '2024-05-18',
    status: 'Active',
    totalAmountPaidINR: 31200,
    outstandingBalanceINR: 0,
    lastPaymentDate: '2026-10-28',
    vehicleModel: 'Kia EV6 GT-Line',
    vehiclePlate: 'AP-31-ZZ-0007',
    totalSessions: 62,
    energyConsumedKWh: 1560.8,
    paymentStatus: 'Up to Date',
  },
  {
    id: 'CUST-1008',
    name: 'Chaitanya Krishna',
    phone: '+91 94401 55321',
    email: 'chaitanya.k@godavari.org',
    areaId: 'AP-Z08',
    areaName: 'Rajahmundry Godavari Hub',
    assignedAdminId: 'ADM-AP01',
    assignedAdminName: 'Ravi Kumar Varma',
    registrationDate: '2024-06-01',
    status: 'Active',
    totalAmountPaidINR: 12400,
    outstandingBalanceINR: 0,
    lastPaymentDate: '2026-10-27',
    vehicleModel: 'Ola S1 Pro Gen2',
    vehiclePlate: 'AP-05-MN-4491',
    totalSessions: 38,
    energyConsumedKWh: 245.0,
    paymentStatus: 'Up to Date',
  },
  {
    id: 'CUST-1009',
    name: 'M. Sudhakar',
    phone: '+91 98481 99012',
    email: 'sudhakar.m@kakinada.net',
    areaId: 'AP-Z07',
    areaName: 'Kakinada Smart Port',
    assignedAdminId: 'ADM-AP02',
    assignedAdminName: 'Suresh Babu',
    registrationDate: '2024-06-15',
    status: 'Active',
    totalAmountPaidINR: 15600,
    outstandingBalanceINR: 0,
    lastPaymentDate: '2026-10-26',
    vehicleModel: 'BYD Atto 3',
    vehiclePlate: 'AP-04-GH-1290',
    totalSessions: 29,
    energyConsumedKWh: 780.0,
    paymentStatus: 'Up to Date',
  },
  {
    id: 'CUST-1010',
    name: 'V. Rajesh Kumar',
    phone: '+91 98482 33451',
    email: 'rajesh.v@nellorenh.com',
    areaId: 'AP-Z05',
    areaName: 'Nellore NH-16 Corridor',
    assignedAdminId: 'ADM-AP05',
    assignedAdminName: 'K. Venkatesh',
    registrationDate: '2024-07-01',
    status: 'Active',
    totalAmountPaidINR: 8900,
    outstandingBalanceINR: 0,
    lastPaymentDate: '2026-10-25',
    vehicleModel: 'Tata Tiago EV',
    vehiclePlate: 'AP-26-KL-7788',
    totalSessions: 22,
    energyConsumedKWh: 340.2,
    paymentStatus: 'Up to Date',
  },
];

const SEED_TRANSACTIONS: SuperAdminTransaction[] = [
  {
    id: 'TXN-5001',
    referenceNumber: 'VG-REC-20261028-001',
    date: '2026-10-28 14:10',
    isoDate: '2026-10-28T14:10:00.000Z',
    adminId: 'ADM-AP01',
    adminName: 'Ravi Kumar Varma',
    areaId: 'AP-Z01',
    areaName: 'Vijayawada Central Hub',
    customerId: 'CUST-1001',
    customerName: 'Bala Krishna',
    amountINR: 1200,
    type: 'Wallet Topup',
    paymentMethod: 'UPI',
    transactionStatus: 'Success',
    settlementStatus: 'Settled',
    adminCommissionINR: 60,
    netPayableToBusinessINR: 1140,
    settlementDueDate: '2026-11-05',
    notes: 'Google Pay UPI Verified',
  },
  {
    id: 'TXN-5002',
    referenceNumber: 'VG-REC-20261028-002',
    date: '2026-10-28 13:45',
    isoDate: '2026-10-28T13:45:00.000Z',
    adminId: 'ADM-AP02',
    adminName: 'Suresh Babu',
    areaId: 'AP-Z02',
    areaName: 'Visakhapatnam Port Terminal',
    customerId: 'CUST-1007',
    customerName: 'Dr. Mohan Varma',
    amountINR: 950,
    type: 'Charging Session',
    paymentMethod: 'Card',
    transactionStatus: 'Success',
    settlementStatus: 'Settled',
    adminCommissionINR: 47.5,
    netPayableToBusinessINR: 902.5,
    settlementDueDate: '2026-11-05',
    notes: 'HDFC Visa Platinum Tap & Pay',
  },
  {
    id: 'TXN-5003',
    referenceNumber: 'VG-REC-20261028-003',
    date: '2026-10-28 11:20',
    isoDate: '2026-10-28T11:20:00.000Z',
    adminId: 'ADM-AP03',
    adminName: 'Anil Chowdary',
    areaId: 'AP-Z03',
    areaName: 'Tirupati East Pilgrimage Hub',
    customerId: 'CUST-1003',
    customerName: 'Ravi Teja Sharma',
    amountINR: 450,
    type: 'Charging Session',
    paymentMethod: 'Wallet',
    transactionStatus: 'Pending',
    settlementStatus: 'Pending Settlement',
    adminCommissionINR: 20.25,
    netPayableToBusinessINR: 429.75,
    settlementDueDate: '2026-11-04',
    notes: 'Wallet auto-debit pending bank retry',
  },
  {
    id: 'TXN-5004',
    referenceNumber: 'VG-REC-20261027-004',
    date: '2026-10-27 16:30',
    isoDate: '2026-10-27T16:30:00.000Z',
    adminId: 'ADM-AP01',
    adminName: 'Ravi Kumar Varma',
    areaId: 'AP-Z01',
    areaName: 'Vijayawada Central Hub',
    customerId: 'CUST-1004',
    customerName: 'Andhra State Fleet Co.',
    amountINR: 8500,
    type: 'Collection',
    paymentMethod: 'Net Banking',
    transactionStatus: 'Success',
    settlementStatus: 'Settled',
    adminCommissionINR: 425,
    netPayableToBusinessINR: 8075,
    settlementDueDate: '2026-11-05',
    notes: 'Corporate RTGS settlement credit',
  },
  {
    id: 'TXN-5005',
    referenceNumber: 'VG-REC-20261027-005',
    date: '2026-10-27 10:15',
    isoDate: '2026-10-27T10:15:00.000Z',
    adminId: 'ADM-AP04',
    adminName: 'Ramesh Naidu',
    areaId: 'AP-Z04',
    areaName: 'Guntur Smart City Hub',
    customerId: 'CUST-1005',
    customerName: 'Srinivas Rao G',
    amountINR: 680,
    type: 'Charging Session',
    paymentMethod: 'UPI',
    transactionStatus: 'Success',
    settlementStatus: 'Settled',
    adminCommissionINR: 34,
    netPayableToBusinessINR: 646,
    settlementDueDate: '2026-11-06',
  },
  {
    id: 'TXN-5006',
    referenceNumber: 'VG-REC-20261026-006',
    date: '2026-10-26 15:40',
    isoDate: '2026-10-26T15:40:00.000Z',
    adminId: 'ADM-AP02',
    adminName: 'Suresh Babu',
    areaId: 'AP-Z02',
    areaName: 'Visakhapatnam Port Terminal',
    customerId: 'CUST-1002',
    customerName: 'P. Lakshmi',
    amountINR: 350,
    type: 'Refund',
    paymentMethod: 'UPI',
    transactionStatus: 'Refunded',
    settlementStatus: 'Non-Settled',
    adminCommissionINR: -17.5,
    netPayableToBusinessINR: -332.5,
    settlementDueDate: '2026-11-05',
    notes: 'Session interrupted due to connector trip. Approved refund.',
  },
  {
    id: 'TXN-5007',
    referenceNumber: 'VG-REC-20261026-007',
    date: '2026-10-26 12:00',
    isoDate: '2026-10-26T12:00:00.000Z',
    adminId: 'ADM-AP06',
    adminName: 'Srinivas Reddy',
    areaId: 'AP-Z06',
    areaName: 'Kurnool IT Park Hub',
    customerId: 'CUST-1006',
    customerName: 'Kavitha Reddy',
    amountINR: 850,
    type: 'Charging Session',
    paymentMethod: 'Card',
    transactionStatus: 'Failed',
    settlementStatus: 'Non-Settled',
    adminCommissionINR: 0,
    netPayableToBusinessINR: 0,
    settlementDueDate: '2026-11-05',
    notes: 'Card authorization failure (do not honor)',
  },
  {
    id: 'TXN-5008',
    referenceNumber: 'VG-REC-20261025-008',
    date: '2026-10-25 09:30',
    isoDate: '2026-10-25T09:30:00.000Z',
    adminId: 'ADM-AP05',
    adminName: 'K. Venkatesh',
    areaId: 'AP-Z05',
    areaName: 'Nellore NH-16 Corridor',
    customerId: 'CUST-1010',
    customerName: 'V. Rajesh Kumar',
    amountINR: 720,
    type: 'Charging Session',
    paymentMethod: 'UPI',
    transactionStatus: 'Success',
    settlementStatus: 'Settled',
    adminCommissionINR: 36,
    netPayableToBusinessINR: 684,
    settlementDueDate: '2026-11-07',
  },
  {
    id: 'TXN-5009',
    referenceNumber: 'VG-REC-20261024-009',
    date: '2026-10-24 17:15',
    isoDate: '2026-10-24T17:15:00.000Z',
    adminId: 'ADM-AP01',
    adminName: 'Ravi Kumar Varma',
    areaId: 'AP-Z08',
    areaName: 'Rajahmundry Godavari Hub',
    customerId: 'CUST-1008',
    customerName: 'Chaitanya Krishna',
    amountINR: 520,
    type: 'Wallet Topup',
    paymentMethod: 'UPI',
    transactionStatus: 'Success',
    settlementStatus: 'Settled',
    adminCommissionINR: 26,
    netPayableToBusinessINR: 494,
    settlementDueDate: '2026-11-05',
  },
  {
    id: 'TXN-5010',
    referenceNumber: 'VG-REC-20261024-010',
    date: '2026-10-24 14:00',
    isoDate: '2026-10-24T14:00:00.000Z',
    adminId: 'ADM-AP02',
    adminName: 'Suresh Babu',
    areaId: 'AP-Z07',
    areaName: 'Kakinada Smart Port',
    customerId: 'CUST-1009',
    customerName: 'M. Sudhakar',
    amountINR: 1100,
    type: 'Charging Session',
    paymentMethod: 'Card',
    transactionStatus: 'Success',
    settlementStatus: 'Settled',
    adminCommissionINR: 55,
    netPayableToBusinessINR: 1045,
    settlementDueDate: '2026-11-05',
  },
];

const SEED_SETTLEMENTS: SuperAdminSettlement[] = [
  {
    id: 'STL-2024-001',
    batchNumber: 'VG-STL-AP01-202610A',
    adminId: 'ADM-AP01',
    adminName: 'Ravi Kumar Varma',
    areaId: 'AP-Z01',
    areaName: 'Vijayawada Central Hub',
    periodStartDate: '2026-10-01',
    periodEndDate: '2026-10-15',
    grossCollectionsINR: 360000,
    refundsDeductedINR: 2000,
    commissionDeductedINR: 18000,
    otherAdjustmentsINR: 0,
    netAmountPayableToBusinessINR: 340000,
    verifiedAmountReceivedINR: 340000,
    outstandingBalanceINR: 0,
    status: 'Verified',
    paymentReferenceUTR: 'SBIN0048192801',
    settlementDate: '2026-10-17',
    verifiedBy: 'Super Admin Executive',
    verifiedAt: '2026-10-17 11:30:00',
    notes: 'Reconciled with SBI Current Account credit.',
  },
  {
    id: 'STL-2024-002',
    batchNumber: 'VG-STL-AP01-202610B',
    adminId: 'ADM-AP01',
    adminName: 'Ravi Kumar Varma',
    areaId: 'AP-Z01',
    areaName: 'Vijayawada Central Hub',
    periodStartDate: '2026-10-16',
    periodEndDate: '2026-10-28',
    grossCollectionsINR: 339000,
    refundsDeductedINR: 2200,
    commissionDeductedINR: 16950,
    otherAdjustmentsINR: 0,
    netAmountPayableToBusinessINR: 319850,
    verifiedAmountReceivedINR: 289100,
    outstandingBalanceINR: 30750,
    status: 'Processing',
    paymentReferenceUTR: 'SBIN0048339102',
    settlementDate: '2026-10-28',
    notes: 'Partial tranche ₹2,89,100 received. Balance ₹30,750 expected by Nov 5.',
  },
  {
    id: 'STL-2024-003',
    batchNumber: 'VG-STL-AP02-202610A',
    adminId: 'ADM-AP02',
    adminName: 'Suresh Babu',
    areaId: 'AP-Z02',
    areaName: 'Visakhapatnam Port Terminal',
    periodStartDate: '2026-10-01',
    periodEndDate: '2026-10-15',
    grossCollectionsINR: 310000,
    refundsDeductedINR: 1500,
    commissionDeductedINR: 15500,
    otherAdjustmentsINR: 0,
    netAmountPayableToBusinessINR: 293000,
    verifiedAmountReceivedINR: 293000,
    outstandingBalanceINR: 0,
    status: 'Verified',
    paymentReferenceUTR: 'HDFC0019283711',
    settlementDate: '2026-10-18',
    verifiedBy: 'Super Admin Executive',
    verifiedAt: '2026-10-18 14:15:00',
  },
  {
    id: 'STL-2024-004',
    batchNumber: 'VG-STL-AP02-202610B',
    adminId: 'ADM-AP02',
    adminName: 'Suresh Babu',
    areaId: 'AP-Z02',
    areaName: 'Visakhapatnam Port Terminal',
    periodStartDate: '2026-10-16',
    periodEndDate: '2026-10-28',
    grossCollectionsINR: 299000,
    refundsDeductedINR: 1600,
    commissionDeductedINR: 14950,
    otherAdjustmentsINR: 0,
    netAmountPayableToBusinessINR: 282450,
    verifiedAmountReceivedINR: 255100,
    outstandingBalanceINR: 27350,
    status: 'Pending Review',
    settlementDate: '2026-10-28',
    notes: 'Awaiting bank clearance proof for remainder.',
  },
  {
    id: 'STL-2024-005',
    batchNumber: 'VG-STL-AP03-202610A',
    adminId: 'ADM-AP03',
    adminName: 'Anil Chowdary',
    areaId: 'AP-Z03',
    areaName: 'Tirupati East Pilgrimage Hub',
    periodStartDate: '2026-10-01',
    periodEndDate: '2026-10-28',
    grossCollectionsINR: 512000,
    refundsDeductedINR: 1900,
    commissionDeductedINR: 23040,
    otherAdjustmentsINR: 0,
    netAmountPayableToBusinessINR: 487060,
    verifiedAmountReceivedINR: 464020,
    outstandingBalanceINR: 23040,
    status: 'Pending Review',
    settlementDate: '2026-10-28',
  },
  {
    id: 'STL-2024-006',
    batchNumber: 'VG-STL-AP04-202610A',
    adminId: 'ADM-AP04',
    adminName: 'Ramesh Naidu',
    areaId: 'AP-Z04',
    areaName: 'Guntur Smart City Hub',
    periodStartDate: '2026-10-01',
    periodEndDate: '2026-10-28',
    grossCollectionsINR: 296000,
    refundsDeductedINR: 1200,
    commissionDeductedINR: 14800,
    otherAdjustmentsINR: 0,
    netAmountPayableToBusinessINR: 280000,
    verifiedAmountReceivedINR: 265200,
    outstandingBalanceINR: 14800,
    status: 'Pending Review',
    settlementDate: '2026-10-28',
  },
  {
    id: 'STL-2024-007',
    batchNumber: 'VG-STL-AP05-202610A',
    adminId: 'ADM-AP05',
    adminName: 'K. Venkatesh',
    areaId: 'AP-Z05',
    areaName: 'Nellore NH-16 Corridor',
    periodStartDate: '2026-10-01',
    periodEndDate: '2026-10-28',
    grossCollectionsINR: 189000,
    refundsDeductedINR: 800,
    commissionDeductedINR: 9450,
    otherAdjustmentsINR: 0,
    netAmountPayableToBusinessINR: 178750,
    verifiedAmountReceivedINR: 169300,
    outstandingBalanceINR: 9450,
    status: 'Pending Review',
    settlementDate: '2026-10-28',
  },
  {
    id: 'STL-2024-008',
    batchNumber: 'VG-STL-AP06-202610A',
    adminId: 'ADM-AP06',
    adminName: 'Srinivas Reddy',
    areaId: 'AP-Z06',
    areaName: 'Kurnool IT Park Hub',
    periodStartDate: '2026-10-01',
    periodEndDate: '2026-10-28',
    grossCollectionsINR: 337000,
    refundsDeductedINR: 1500,
    commissionDeductedINR: 16850,
    otherAdjustmentsINR: 0,
    netAmountPayableToBusinessINR: 318650,
    verifiedAmountReceivedINR: 301800,
    outstandingBalanceINR: 16850,
    status: 'Pending Review',
    settlementDate: '2026-10-28',
  },
];

class SuperAdminDataService {
  private getAreas(): SuperAdminArea[] {
    const raw = localStorage.getItem(AREAS_KEY);
    if (!raw) {
      localStorage.setItem(AREAS_KEY, JSON.stringify(SEED_AREAS));
      return SEED_AREAS;
    }
    return JSON.parse(raw);
  }

  private getAdmins(): SuperAdminAdmin[] {
    const raw = localStorage.getItem(ADMINS_KEY);
    if (!raw) {
      localStorage.setItem(ADMINS_KEY, JSON.stringify(SEED_ADMINS));
      return SEED_ADMINS;
    }
    return JSON.parse(raw);
  }

  private getCustomers(): SuperAdminCustomer[] {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    if (!raw) {
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(SEED_CUSTOMERS));
      return SEED_CUSTOMERS;
    }
    return JSON.parse(raw);
  }

  private getTransactions(): SuperAdminTransaction[] {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (!raw) {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(SEED_TRANSACTIONS));
      return SEED_TRANSACTIONS;
    }
    return JSON.parse(raw);
  }

  private getSettlements(): SuperAdminSettlement[] {
    const raw = localStorage.getItem(SETTLEMENTS_KEY);
    if (!raw) {
      localStorage.setItem(SETTLEMENTS_KEY, JSON.stringify(SEED_SETTLEMENTS));
      return SEED_SETTLEMENTS;
    }
    return JSON.parse(raw);
  }

  private saveSettlements(settlements: SuperAdminSettlement[]): void {
    localStorage.setItem(SETTLEMENTS_KEY, JSON.stringify(settlements));
  }

  private saveAdmins(admins: SuperAdminAdmin[]): void {
    localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
  }

  /**
   * Fetch all Areas
   */
  public async fetchAreas(): Promise<SuperAdminArea[]> {
    superAdminAuthService.requireSuperAdminSession();
    return this.getAreas();
  }

  /**
   * Fetch Admins, optionally filtered by area
   */
  public async fetchAdmins(areaId?: string): Promise<SuperAdminAdmin[]> {
    superAdminAuthService.requireSuperAdminSession();
    const all = this.getAdmins();
    if (!areaId || areaId === 'ALL') {
      return all;
    }
    return all.filter((admin) => admin.assignedAreaIds.includes(areaId));
  }

  /**
   * Fetch Customers, filtered by area/admin
   */
  public async fetchCustomers(filters?: {
    areaId?: string;
    adminId?: string;
    searchTerm?: string;
    status?: string;
  }): Promise<SuperAdminCustomer[]> {
    superAdminAuthService.requireSuperAdminSession();
    let list = this.getCustomers();

    if (filters?.areaId && filters.areaId !== 'ALL') {
      list = list.filter((c) => c.areaId === filters.areaId);
    }
    if (filters?.adminId && filters.adminId !== 'ALL') {
      list = list.filter((c) => c.assignedAdminId === filters.adminId);
    }
    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter((c) => c.status === filters.status);
    }
    if (filters?.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.phone.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          c.id.toLowerCase().includes(term) ||
          c.vehiclePlate.toLowerCase().includes(term)
      );
    }
    return list;
  }

  /**
   * Fetch Transactions, filtered by area/admin
   */
  public async fetchTransactions(filters?: {
    areaId?: string;
    adminId?: string;
    status?: string;
    searchTerm?: string;
  }): Promise<SuperAdminTransaction[]> {
    superAdminAuthService.requireSuperAdminSession();
    let list = this.getTransactions();

    if (filters?.areaId && filters.areaId !== 'ALL') {
      list = list.filter((t) => t.areaId === filters.areaId);
    }
    if (filters?.adminId && filters.adminId !== 'ALL') {
      list = list.filter((t) => t.adminId === filters.adminId);
    }
    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter((t) => t.transactionStatus === filters.status);
    }
    if (filters?.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      list = list.filter(
        (t) =>
          t.id.toLowerCase().includes(term) ||
          t.referenceNumber.toLowerCase().includes(term) ||
          t.customerName.toLowerCase().includes(term) ||
          t.adminName.toLowerCase().includes(term) ||
          t.areaName.toLowerCase().includes(term)
      );
    }
    return list;
  }

  /**
   * Fetch Settlements, filtered by area/admin
   */
  public async fetchSettlements(filters?: {
    areaId?: string;
    adminId?: string;
    status?: string;
  }): Promise<SuperAdminSettlement[]> {
    superAdminAuthService.requireSuperAdminSession();
    let list = this.getSettlements();

    if (filters?.areaId && filters.areaId !== 'ALL') {
      list = list.filter((s) => s.areaId === filters.areaId);
    }
    if (filters?.adminId && filters.adminId !== 'ALL') {
      list = list.filter((s) => s.adminId === filters.adminId);
    }
    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter((s) => s.status === filters.status);
    }
    return list;
  }

  /**
   * Calculate high-level business analytics metrics adhering to active filters
   */
  public async calculateDashboardMetrics(filters: WorkflowFilters): Promise<SuperAdminDashboardMetrics> {
    superAdminAuthService.requireSuperAdminSession();

    const areas = this.getAreas();
    const admins = this.getAdmins();
    const customers = this.getCustomers();
    const transactions = this.getTransactions();
    const settlements = this.getSettlements();

    const { selectedAreaId, selectedAdminId } = filters;

    // Filter relevant subsets
    let activeAreas = areas;
    let activeAdmins = admins;
    let activeCustomers = customers;
    let activeTransactions = transactions;
    let activeSettlements = settlements;

    if (selectedAreaId && selectedAreaId !== 'ALL') {
      activeAreas = activeAreas.filter((a) => a.id === selectedAreaId);
      activeAdmins = activeAdmins.filter((adm) => adm.assignedAreaIds.includes(selectedAreaId));
      activeCustomers = activeCustomers.filter((c) => c.areaId === selectedAreaId);
      activeTransactions = activeTransactions.filter((t) => t.areaId === selectedAreaId);
      activeSettlements = activeSettlements.filter((s) => s.areaId === selectedAreaId);
    }

    if (selectedAdminId && selectedAdminId !== 'ALL') {
      activeAdmins = activeAdmins.filter((adm) => adm.id === selectedAdminId);
      activeCustomers = activeCustomers.filter((c) => c.assignedAdminId === selectedAdminId);
      activeTransactions = activeTransactions.filter((t) => t.adminId === selectedAdminId);
      activeSettlements = activeSettlements.filter((s) => s.adminId === selectedAdminId);
    }

    // Aggregations
    const totalAreasCount = activeAreas.length;
    const totalAdminsCount = activeAdmins.length;
    const activeAdminsCount = activeAdmins.filter((a) => a.status === 'Active').length;

    const totalCustomersCount = activeCustomers.length;
    const activeCustomersCount = activeCustomers.filter((c) => c.status === 'Active').length;
    // New customers in current period
    const newCustomersCount = activeAdmins.reduce((sum, a) => sum + a.newCustomers, 0);

    // Financial reconciliation values
    const totalCollections = activeAdmins.reduce((sum, a) => sum + a.totalCustomerCollectionsINR, 0);
    const actualReceipts = activeAdmins.reduce((sum, a) => sum + a.actualBusinessReceiptsINR, 0);
    const outstandingSettlements = activeAdmins.reduce((sum, a) => sum + a.outstandingSettlementINR, 0);
    const pendingCustomerPayments = activeAdmins.reduce((sum, a) => sum + a.pendingCustomerPaymentsINR, 0);
    const refundsAndReversals = activeAdmins.reduce((sum, a) => sum + a.refundsAndReversalsINR, 0);
    const adminCommissions = activeAdmins.reduce((sum, a) => sum + a.totalCommissionEarnedINR, 0);

    return {
      totalAreas: totalAreasCount,
      totalAdmins: totalAdminsCount,
      activeAdmins: activeAdminsCount,
      totalCustomers: totalCustomersCount,
      activeCustomers: activeCustomersCount,
      newCustomers: newCustomersCount,
      totalSuccessfulCustomerCollectionsINR: totalCollections,
      actualBusinessReceiptsINR: actualReceipts,
      outstandingAdminSettlementsINR: outstandingSettlements,
      pendingCustomerPaymentsINR: pendingCustomerPayments,
      refundsAndReversalsINR: refundsAndReversals,
      adminCommissionsINR: adminCommissions,
      periodComparison: {
        collectionsGrowthPercent: 12.4,
        receiptsGrowthPercent: 11.2,
        customerGrowthPercent: 15.8,
        settlementChangePercent: -4.2, // reduction in outstanding debt is good
      },
    };
  }

  /**
   * Verify and process business settlement
   */
  public async verifySettlement(
    settlementId: string,
    utrNumber: string,
    verifiedAmountINR: number,
    notes?: string
  ): Promise<SuperAdminSettlement> {
    const session = superAdminAuthService.requireSuperAdminSession();
    const settlements = this.getSettlements();
    const idx = settlements.findIndex((s) => s.id === settlementId);

    if (idx === -1) {
      throw new Error(`Settlement ${settlementId} not found.`);
    }

    const current = settlements[idx];
    const newVerified = current.verifiedAmountReceivedINR + verifiedAmountINR;
    const newOutstanding = Math.max(0, current.netAmountPayableToBusinessINR - newVerified);
    const newStatus = newOutstanding === 0 ? 'Verified' : 'Processing';

    const updated: SuperAdminSettlement = {
      ...current,
      paymentReferenceUTR: utrNumber,
      verifiedAmountReceivedINR: newVerified,
      outstandingBalanceINR: newOutstanding,
      status: newStatus,
      verifiedBy: session.user.name || 'Super Admin Executive',
      verifiedAt: new Date().toISOString(),
      notes: notes ? `${current.notes || ''} | ${notes}` : current.notes,
    };

    settlements[idx] = updated;
    this.saveSettlements(settlements);

    // Also update Admin record's outstanding
    const admins = this.getAdmins();
    const adminIdx = admins.findIndex((a) => a.id === current.adminId);
    if (adminIdx !== -1) {
      admins[adminIdx].actualBusinessReceiptsINR += verifiedAmountINR;
      admins[adminIdx].outstandingSettlementINR = Math.max(
        0,
        admins[adminIdx].outstandingSettlementINR - verifiedAmountINR
      );
      this.saveAdmins(admins);
    }

    return updated;
  }

  /**
   * Update Admin Account Status
   */
  public async updateAdminStatus(
    adminId: string,
    newStatus: 'Active' | 'Suspended' | 'Pending'
  ): Promise<SuperAdminAdmin> {
    superAdminAuthService.requireSuperAdminSession();
    const admins = this.getAdmins();
    const idx = admins.findIndex((a) => a.id === adminId);
    if (idx === -1) {
      throw new Error(`Admin ${adminId} not found.`);
    }

    admins[idx].status = newStatus;
    this.saveAdmins(admins);
    return admins[idx];
  }
}

export const superAdminDataService = new SuperAdminDataService();
