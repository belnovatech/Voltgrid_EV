import {
  AdminZone,
  AdminChargingPoint,
  AdminUser,
  AdminVehicle,
  AdminChargingSession,
  AdminTariffPlan,
  AdminMaintenanceTicket,
  AdminAuditLog,
  AdminDashboardOverview,
} from '../types/admin';

const INITIAL_ZONES: AdminZone[] = [
  {
    id: 'zone_01',
    code: 'AP-Z01',
    name: 'Vijayawada Central',
    address: 'MG Road, Near Kanaka Durga Tem...',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    totalChargers: 10,
    availableChargers: 6,
    chargingCount: 3,
    reservedCount: 1,
    maintenanceCount: 0,
    powerCapacityKw: 1200,
    currentLoadKw: 420,
    todayRevenueINR: 42800,
    operatingHours: '24/7',
    contactNumber: '+91 86624 55110',
    status: 'Active',
  },
  {
    id: 'zone_02',
    code: 'AP-Z02',
    name: 'Visakhapatnam Port',
    address: 'Beach Road, Near Rushikonda...',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    totalChargers: 10,
    availableChargers: 4,
    chargingCount: 5,
    reservedCount: 0,
    maintenanceCount: 1,
    powerCapacityKw: 1500,
    currentLoadKw: 510,
    todayRevenueINR: 38500,
    operatingHours: '24/7',
    contactNumber: '+91 89125 77220',
    status: 'Active',
  },
  {
    id: 'zone_03',
    code: 'AP-Z03',
    name: 'Tirupati East Hub',
    address: 'Tiruchanur Road, Tirupati...',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    totalChargers: 10,
    availableChargers: 7,
    chargingCount: 2,
    reservedCount: 1,
    maintenanceCount: 0,
    powerCapacityKw: 1000,
    currentLoadKw: 380,
    todayRevenueINR: 51200,
    operatingHours: '24/7',
    contactNumber: '+91 87722 33440',
    status: 'Active',
  },
  {
    id: 'zone_04',
    code: 'AP-Z04',
    name: 'Guntur Smart City',
    address: 'Brodipet 4th Lane, Commercial Hub...',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    totalChargers: 10,
    availableChargers: 5,
    chargingCount: 4,
    reservedCount: 0,
    maintenanceCount: 1,
    powerCapacityKw: 800,
    currentLoadKw: 310,
    todayRevenueINR: 29600,
    operatingHours: '24/7',
    contactNumber: '+91 86322 11990',
    status: 'Active',
  },
  {
    id: 'zone_05',
    code: 'AP-Z05',
    name: 'Nellore NH-16 Hub',
    address: 'Mini Bypass Road, NH-16 Junction...',
    city: 'Nellore',
    state: 'Andhra Pradesh',
    totalChargers: 10,
    availableChargers: 8,
    chargingCount: 1,
    reservedCount: 1,
    maintenanceCount: 0,
    powerCapacityKw: 1000,
    currentLoadKw: 240,
    todayRevenueINR: 18900,
    operatingHours: '24/7',
    contactNumber: '+91 86123 44550',
    status: 'Active',
  },
  {
    id: 'zone_06',
    code: 'AP-Z06',
    name: 'Kurnool IT Park',
    address: 'Near Highway Junction, IT Corridor...',
    city: 'Kurnool',
    state: 'Andhra Pradesh',
    totalChargers: 10,
    availableChargers: 3,
    chargingCount: 6,
    reservedCount: 1,
    maintenanceCount: 0,
    powerCapacityKw: 800,
    currentLoadKw: 420,
    todayRevenueINR: 33700,
    operatingHours: '24/7',
    contactNumber: '+91 85182 66770',
    status: 'Active',
  },
  {
    id: 'zone_07',
    code: 'AP-Z07',
    name: 'Kakinada Smart Port',
    address: 'Main Road Port Gate, Kakinada...',
    city: 'Kakinada',
    state: 'Andhra Pradesh',
    totalChargers: 10,
    availableChargers: 8,
    chargingCount: 1,
    reservedCount: 1,
    maintenanceCount: 0,
    powerCapacityKw: 900,
    currentLoadKw: 180,
    todayRevenueINR: 22400,
    operatingHours: '24/7',
    contactNumber: '+91 88423 88110',
    status: 'Active',
  },
  {
    id: 'zone_08',
    code: 'AP-Z08',
    name: 'Rajahmundry Godavari Hub',
    address: 'Kotipalli Bus Stand, Godavari...',
    city: 'Rajahmundry',
    state: 'Andhra Pradesh',
    totalChargers: 10,
    availableChargers: 5,
    chargingCount: 3,
    reservedCount: 1,
    maintenanceCount: 1,
    powerCapacityKw: 900,
    currentLoadKw: 390,
    todayRevenueINR: 27100,
    operatingHours: '24/7',
    contactNumber: '+91 88324 55990',
    status: 'Active',
  },
];

const ZONES_DEF = [
  { code: 'AP-Z01', name: 'Vijayawada Central', city: 'Vijayawada' },
  { code: 'AP-Z02', name: 'Visakhapatnam Port', city: 'Visakhapatnam' },
  { code: 'AP-Z03', name: 'Tirupati East Hub', city: 'Tirupati' },
  { code: 'AP-Z04', name: 'Guntur Smart City', city: 'Guntur' },
  { code: 'AP-Z05', name: 'Nellore NH-16 Hub', city: 'Nellore' },
  { code: 'AP-Z06', name: 'Kurnool IT Park', city: 'Kurnool' },
  { code: 'AP-Z07', name: 'Rajahmundry Godavari Hub', city: 'Rajahmundry' },
  { code: 'AP-Z08', name: 'Amaravati Capital Zone', city: 'Amaravati' },
];

const INITIAL_CHARGERS: AdminChargingPoint[] = (() => {
  const list: AdminChargingPoint[] = [];
  let chargerIndex = 1;

  // Patterns per zone (10 chargers per zone: 6 Available, 2 Charging, 1 Reserved, 1 Maintenance)
  const zoneProfiles = [
    // Slot 1
    { power: 120, conn: 'CCS2', type: 'DC', status: 'Available' as const, note: '' },
    // Slot 2
    {
      power: 60,
      conn: 'Type 2',
      type: 'DC',
      status: 'Charging' as const,
      driver: 'Bala Krishna',
      kwh: 23.5,
      min: 23,
      cost: 121,
    },
    // Slot 3
    { power: 150, conn: 'CCS2', type: 'DC', status: 'Reserved' as const, note: 'Reserved slot active' },
    // Slot 4
    { power: 50, conn: 'CHAdeMO', type: 'AC', status: 'Maintenance' as const, note: 'Under maintenance' },
    // Slot 5
    { power: 120, conn: 'CCS2', type: 'DC', status: 'Available' as const, note: '' },
    // Slot 6
    { power: 60, conn: 'Type 2', type: 'DC', status: 'Available' as const, note: '' },
    // Slot 7
    {
      power: 120,
      conn: 'CCS2',
      type: 'DC',
      status: 'Charging' as const,
      driver: 'Bala Krishna',
      kwh: 15.7,
      min: 38,
      cost: 209,
    },
    // Slot 8
    { power: 60, conn: 'Type 2', type: 'DC', status: 'Available' as const, note: '' },
    // Slot 9
    { power: 150, conn: 'CCS2', type: 'DC', status: 'Available' as const, note: '' },
    // Slot 10
    { power: 50, conn: 'CHAdeMO', type: 'AC', status: 'Available' as const, note: '' },
  ];

  ZONES_DEF.forEach((zone, zIdx) => {
    zoneProfiles.forEach((prof, pIdx) => {
      const idNum = String(chargerIndex).padStart(3, '0');
      const pointId = `CH-${idNum}`;
      const ocppId = `OCPP-${zone.code}-${String(pIdx + 1).padStart(2, '0')}`;

      // Variations for different zones
      let status = prof.status;
      let driver = prof.driver || 'Bala Krishna';
      let kwh = prof.kwh || 18.4;
      let min = prof.min || 25;
      let cost = prof.cost || 195;

      if (zIdx === 1 && pIdx === 1) {
        kwh = 8.6;
        min = 16;
        cost = 391;
      }

      list.push({
        id: pointId,
        pointCode: pointId,
        stationName: `${zone.name}`,
        zoneCode: zone.code,
        zoneName: zone.name,
        city: zone.city,
        type: prof.type,
        chargerType: prof.type === 'DC' ? 'DC (Fast)' : 'AC (Standard)',
        connectorType: prof.conn,
        powerKw: prof.power,
        status: status,
        ratePerKWh: prof.power >= 120 ? 14 : 12,
        utilizationPercent: status === 'Charging' ? 88 : status === 'Available' ? 0 : 45,
        lastPingTime: status === 'Charging' ? 'Just now' : '2 min ago',
        chargerNumber: pIdx + 1,
        ocppId: ocppId,
        activeSession:
          status === 'Charging'
            ? {
                sessionId: `SES-${9900 + chargerIndex}`,
                vehiclePlate: `AP ${20 + zIdx} EV ${1000 + chargerIndex}`,
                vehicleModel: prof.power >= 120 ? 'Tata Nexon EV Max' : 'MG ZS EV',
                energyDeliveredKWh: kwh,
                durationMinutes: min,
                currentCostINR: cost,
                batteryLevel: 65,
                driverName: driver,
              }
            : undefined,
        lastMaintenanceDate: '2024-12-01',
      });

      chargerIndex++;
    });
  });

  return list;
})();

const INITIAL_USERS: AdminUser[] = [
  {
    id: 'U001',
    userId: 'U001',
    name: 'Bala Krishna',
    phoneNumber: '9876543210',
    phone: '+91 9876543210',
    email: 'bala@example.com',
    city: 'Vijayawada',
    vehiclesCount: 2,
    totalSessions: 25,
    walletBalance: 1250,
    walletBalanceINR: 1250,
    joinedAt: '2024-01-15',
    registeredAt: '2024-01-15',
    status: 'Active',
    isVerified: true,
  },
  {
    id: 'U002',
    userId: 'U002',
    name: 'Priya Lakshmi',
    phoneNumber: '9876543211',
    phone: '+91 9876543211',
    email: 'priya@example.com',
    city: 'Visakhapatnam',
    vehiclesCount: 1,
    totalSessions: 12,
    walletBalance: 840,
    walletBalanceINR: 840,
    joinedAt: '2024-02-20',
    registeredAt: '2024-02-20',
    status: 'Active',
    isVerified: true,
  },
  {
    id: 'U003',
    userId: 'U003',
    name: 'Ravi Teja',
    phoneNumber: '9876543212',
    phone: '+91 9876543212',
    email: 'ravi@example.com',
    city: 'Tirupati',
    vehiclesCount: 1,
    totalSessions: 24,
    walletBalance: 320,
    walletBalanceINR: 320,
    joinedAt: '2024-03-10',
    registeredAt: '2024-03-10',
    status: 'Active',
    isVerified: true,
  },
  {
    id: 'U004',
    userId: 'U004',
    name: 'APSRRTC Fleet',
    phoneNumber: '9876543213',
    phone: '+91 9876543213',
    email: 'fleet@apsrtc.gov.in',
    city: 'Vijayawada',
    vehiclesCount: 1,
    totalSessions: 91,
    walletBalance: 15000,
    walletBalanceINR: 15000,
    joinedAt: '2023-11-01',
    registeredAt: '2023-11-01',
    status: 'Active',
    isVerified: true,
  },
  {
    id: 'U005',
    userId: 'U005',
    name: 'Srinivas Rao',
    phoneNumber: '9876543214',
    phone: '+91 9876543214',
    email: 'srinivas@example.com',
    city: 'Guntur',
    vehiclesCount: 1,
    totalSessions: 8,
    walletBalance: 600,
    walletBalanceINR: 600,
    joinedAt: '2024-04-05',
    registeredAt: '2024-04-05',
    status: 'Active',
    isVerified: true,
  },
  {
    id: 'U006',
    userId: 'U006',
    name: 'Kavitha Reddy',
    phoneNumber: '9876543215',
    phone: '+91 9876543215',
    email: 'kavitha@example.com',
    city: 'Kurnool',
    vehiclesCount: 1,
    totalSessions: 15,
    walletBalance: 950,
    walletBalanceINR: 950,
    joinedAt: '2024-01-30',
    registeredAt: '2024-01-30',
    status: 'Inactive',
    isVerified: false,
  },
];

const INITIAL_VEHICLES: AdminVehicle[] = [
  {
    id: 'veh_01',
    ownerName: 'Bala Krishna',
    ownerPhone: '8074407557',
    manufacturer: 'Tata Motors',
    model: 'Nexon EV Max',
    licensePlate: 'AP-39-AB-1234',
    type: 'Car',
    connector: 'CCS2',
    batteryCapacityKWh: 40.5,
    sessionsCount: 18,
    createdAt: '2024-01-15',
  },
  {
    id: 'veh_02',
    ownerName: 'Bala Krishna',
    ownerPhone: '8074407557',
    manufacturer: 'Ola Electric',
    model: 'S1 Pro Gen2',
    licensePlate: 'AP-39-CD-5678',
    type: 'Bike',
    connector: 'Type 2',
    batteryCapacityKWh: 4.0,
    sessionsCount: 7,
    createdAt: '2024-02-20',
  },
  {
    id: 'veh_03',
    ownerName: 'Ravi Teja Sharma',
    ownerPhone: '9848012345',
    manufacturer: 'MG Motor',
    model: 'ZS EV Long Range',
    licensePlate: 'AP-31-EV-4422',
    type: 'Car',
    connector: 'CCS2',
    batteryCapacityKWh: 50.3,
    sessionsCount: 34,
    createdAt: '2024-02-10',
  },
  {
    id: 'veh_04',
    ownerName: 'Andhra State Fleet Co.',
    ownerPhone: '9988776655',
    manufacturer: 'Olectra',
    model: 'K9 Electric Coach',
    licensePlate: 'AP-16-Z-9901',
    type: 'Bus',
    connector: 'CCS2',
    batteryCapacityKWh: 180.0,
    sessionsCount: 65,
    createdAt: '2024-03-01',
  },
];

const INITIAL_SESSIONS: AdminChargingSession[] = [
  {
    id: 'SES-001',
    sessionNumber: 'SES-001',
    customerName: 'Bala Krishna',
    userName: 'Bala Krishna',
    userId: 'U001',
    vehiclePlate: 'AP-39-AB-1234',
    vehicleModel: 'Tata Nexon EV',
    vehicleType: 'CAR',
    stationName: 'Vijayawada Central Hub',
    zoneCode: 'AP-Z01',
    chargerId: 'CH-027',
    startTime: '2024-12-15 10:24',
    startedAt: '2024-12-15 10:24',
    durationMinutes: 42,
    energyKWh: 31.5,
    energyDeliveredKWh: 31.5,
    totalAmountINR: 457.84,
    totalCostINR: 457.84,
    status: 'Completed',
    paymentStatus: 'Paid',
  },
  {
    id: 'SES-002',
    sessionNumber: 'SES-002',
    customerName: 'Ravi Teja',
    userName: 'Ravi Teja',
    userId: 'U003',
    vehiclePlate: 'AP-16-BK-1204',
    vehicleModel: 'Ather 450X',
    vehicleType: 'BIKE',
    stationName: 'Tirupati East Hub',
    zoneCode: 'AP-Z03',
    chargerId: 'CH-031',
    startTime: '2024-12-15 09:00',
    startedAt: '2024-12-15 09:00',
    durationMinutes: 45,
    energyKWh: 3.2,
    energyDeliveredKWh: 3.2,
    totalAmountINR: 36.11,
    totalCostINR: 36.11,
    status: 'Completed',
    paymentStatus: 'Paid',
  },
  {
    id: 'SES-003',
    sessionNumber: 'SES-003',
    customerName: 'APSRTC Fleet',
    userName: 'APSRTC Fleet',
    userId: 'U004',
    vehiclePlate: 'AP-16-Z-9901',
    vehicleModel: 'APSRTC E-Bus',
    vehicleType: 'BUS',
    stationName: 'Guntur Smart City',
    zoneCode: 'AP-Z04',
    chargerId: 'CH-041',
    startTime: '2024-12-15 08:00',
    startedAt: '2024-12-15 08:00',
    durationMinutes: 90,
    energyKWh: 142.8,
    energyDeliveredKWh: 142.8,
    totalAmountINR: 3093.28,
    totalCostINR: 3093.28,
    status: 'Completed',
    paymentStatus: 'Paid',
  },
  {
    id: 'SES-004',
    sessionNumber: 'SES-004',
    customerName: 'Priya Lakshmi',
    userName: 'Priya Lakshmi',
    userId: 'U002',
    vehiclePlate: 'AP-31-EV-4422',
    vehicleModel: 'MG ZS EV',
    vehicleType: 'CAR',
    stationName: 'Visakhapatnam Port',
    zoneCode: 'AP-Z02',
    chargerId: 'CH-012',
    startTime: '2024-12-14 15:30',
    startedAt: '2024-12-14 15:30',
    durationMinutes: 50,
    energyKWh: 28.4,
    energyDeliveredKWh: 28.4,
    totalAmountINR: 413.88,
    totalCostINR: 413.88,
    status: 'Completed',
    paymentStatus: 'Paid',
  },
  {
    id: 'SES-005',
    sessionNumber: 'SES-005',
    customerName: 'Bala Krishna',
    userName: 'Bala Krishna',
    userId: 'U001',
    vehiclePlate: 'AP-39-CD-5678',
    vehicleModel: 'Ola S1 Pro',
    vehicleType: 'BIKE',
    stationName: 'Vijayawada Central Hub',
    zoneCode: 'AP-Z01',
    chargerId: 'CH-003',
    startTime: '2024-12-14 07:15',
    startedAt: '2024-12-14 07:15',
    durationMinutes: 45,
    energyKWh: 3.8,
    energyDeliveredKWh: 3.8,
    totalAmountINR: 41.78,
    totalCostINR: 41.78,
    status: 'Completed',
    paymentStatus: 'Paid',
  },
  {
    id: 'SES-006',
    sessionNumber: 'SES-006',
    customerName: 'Srinivas Rao',
    userName: 'Srinivas Rao',
    userId: 'U005',
    vehiclePlate: 'AP-07-EV-8821',
    vehicleModel: 'Hyundai Kona EV',
    vehicleType: 'CAR',
    stationName: 'Amaravati Capital Secretariat',
    zoneCode: 'AP-Z08',
    chargerId: 'CH-001',
    startTime: '2024-12-16 14:10',
    startedAt: '2024-12-16 14:10',
    durationMinutes: 28,
    energyKWh: 15.2,
    energyDeliveredKWh: 15.2,
    totalAmountINR: 0.0,
    totalCostINR: 0.0,
    status: 'Active',
    paymentStatus: 'In Progress',
  },
];

const INITIAL_TARIFFS: AdminTariffPlan[] = [
  {
    id: 'T-001',
    name: 'Global Bike Base Rate',
    type: 'Per kWh',
    vehicleType: 'BIKE',
    zoneCode: 'Global',
    zoneName: 'Global Scope',
    pricingType: 'Per kWh',
    ratePerKWhINR: 8.0,
    standardRateINR: 8.0,
    serviceFeeINR: 5.0,
    taxGstPercent: 18.0,
    minChargeINR: 10.0,
    effectiveFrom: '2024-01-01',
    effectiveTo: '2024-12-31',
    priority: 3,
    status: 'Active',
    lastUpdated: '2024-12-01',
  },
  {
    id: 'T-002',
    name: 'Global Car Base Rate',
    type: 'Per kWh',
    vehicleType: 'CAR',
    zoneCode: 'Global',
    zoneName: 'Global Scope',
    pricingType: 'Per kWh',
    ratePerKWhINR: 12.0,
    standardRateINR: 12.0,
    serviceFeeINR: 10.0,
    taxGstPercent: 18.0,
    minChargeINR: 20.0,
    effectiveFrom: '2024-01-01',
    effectiveTo: '2024-12-31',
    priority: 3,
    status: 'Active',
    lastUpdated: '2024-12-01',
  },
  {
    id: 'T-003',
    name: 'Global Bus Base Rate',
    type: 'Per kWh',
    vehicleType: 'BUS',
    zoneCode: 'Global',
    zoneName: 'Global Scope',
    pricingType: 'Per kWh',
    ratePerKWhINR: 18.0,
    standardRateINR: 18.0,
    serviceFeeINR: 50.0,
    taxGstPercent: 18.0,
    minChargeINR: 100.0,
    effectiveFrom: '2024-01-01',
    effectiveTo: '2024-12-31',
    priority: 3,
    status: 'Active',
    lastUpdated: '2024-12-01',
  },
  {
    id: 'T-004',
    name: 'Tirupati Zone Car Override',
    type: 'Per kWh',
    vehicleType: 'CAR',
    zoneCode: 'AP-Z03',
    zoneName: 'Tirupati East Hub',
    pricingType: 'Per kWh',
    ratePerKWhINR: 14.0,
    standardRateINR: 14.0,
    serviceFeeINR: 10.0,
    taxGstPercent: 18.0,
    minChargeINR: 20.0,
    effectiveFrom: '2024-06-01',
    effectiveTo: '2024-12-31',
    priority: 2,
    status: 'Active',
    lastUpdated: '2024-12-05',
  },
];

const INITIAL_MAINTENANCE: AdminMaintenanceTicket[] = [
  {
    id: 'MNT-401',
    chargerId: 'CH-030',
    stationName: 'Nellore Highway Rest Stop',
    zoneCode: 'AP-Z06',
    faultCode: 'OCPP_CONNECTOR_LOCK_FAIL',
    severity: 'High',
    description: 'Connector lock solenoid actuation failed on Gun #2.',
    reportedAt: '2024-12-15 08:30',
    status: 'In Progress',
    assignedTechnician: 'K. Venkatesh (Nellore Zone)',
  },
  {
    id: 'MNT-402',
    chargerId: 'CH-028',
    stationName: 'Tirupati East Hub',
    zoneCode: 'AP-Z03',
    faultCode: 'TEMP_SENSOR_HIGH_TRIP',
    severity: 'Medium',
    description: 'Ambient heatsink temperature exceeded 65C during 60kW DC session.',
    reportedAt: '2024-12-14 14:20',
    status: 'Open',
    assignedTechnician: 'S. Ramana (Tirupati Hub)',
  },
];

const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'A-0001',
    actor: 'Super Admin',
    adminName: 'Super Admin',
    adminRole: 'Administrator',
    adminEmail: 'admin@powergrid.in',
    role: 'Super Admin',
    actorRole: 'Administrator',
    action: 'Updated CAR charging tariff from ₹10/kWh to ₹12/kWh',
    actionType: 'Updated',
    module: 'Pricing',
    target: 'TARIFF-CAR-001',
    record: 'TARIFF-CAR-001',
    recordId: 'TARIFF-CAR-001',
    details: 'Base vehicle rate adjusted for AP-Z01 & Global scopes to reflect peak power market tariffs.',
    ipAddress: '192.168.1.10',
    device: 'Chrome / Mac',
    timestamp: '2024-12-15 10:30:22',
    dateOnly: '2024-12-15',
    timeOnly: '10:30:22',
    previousValue: '₹10/kWh (Service: ₹5, GST: 18%)',
    newValue: '₹12/kWh (Service: ₹10, GST: 18%)',
    severity: 'Notice',
    status: 'Success',
  },
  {
    id: 'A-0002',
    actor: 'Operations Lead',
    adminName: 'Operations Lead',
    adminRole: 'Grid Controller',
    adminEmail: 'ops.lead@powergrid.in',
    role: 'Operations Lead',
    actorRole: 'Grid Controller',
    action: 'Marked CH-027 as Maintenance',
    actionType: 'Marked Maintenance',
    module: 'Chargers',
    target: 'CH-027',
    record: 'CH-027',
    recordId: 'CH-027',
    details: 'Triggered preventive maintenance lockout following OCPP cable interlock error on connector #2.',
    ipAddress: '103.24.128.12',
    device: 'Firefox / Linux',
    timestamp: '2024-12-15 09:15:44',
    dateOnly: '2024-12-15',
    timeOnly: '09:15:44',
    previousValue: 'Status: Available',
    newValue: 'Status: Maintenance',
    severity: 'Warning',
    status: 'Success',
  },
  {
    id: 'A-0003',
    actor: 'Super Admin',
    adminName: 'Super Admin',
    adminRole: 'Administrator',
    adminEmail: 'admin@powergrid.in',
    role: 'Super Admin',
    actorRole: 'Administrator',
    action: 'Approved refund of ₹457.84 for SES-001',
    actionType: 'Refunded',
    module: 'Payments',
    target: 'TXN-10037',
    record: 'TXN-10037',
    recordId: 'TXN-10037',
    details: 'Manual session debit rollback credited back to Driver Rajesh Kumar wallet balance.',
    ipAddress: '192.168.1.10',
    device: 'Chrome / Mac',
    timestamp: '2024-12-14 16:20:11',
    dateOnly: '2024-12-14',
    timeOnly: '16:20:11',
    previousValue: 'Wallet: ₹392.16',
    newValue: 'Wallet: ₹850.00 (+₹457.84 Refund)',
    severity: 'Notice',
    status: 'Success',
  },
  {
    id: 'A-0004',
    actor: 'Support Engineer',
    adminName: 'Support Engineer',
    adminRole: 'Customer Operations',
    adminEmail: 'support@powergrid.in',
    role: 'Support Engineer',
    actorRole: 'Customer Operations',
    action: 'Created support ticket for user U001',
    actionType: 'Created',
    module: 'Support',
    target: 'TCK-8821',
    record: 'TCK-8821',
    recordId: 'TCK-8821',
    details: 'Opened priority ticket for RFID card activation and KYC verification re-submission.',
    ipAddress: '49.207.198.54',
    device: 'Edge / Windows',
    timestamp: '2024-12-14 14:05:30',
    dateOnly: '2024-12-14',
    timeOnly: '14:05:30',
    previousValue: 'KYC: Pending Verification',
    newValue: 'Ticket TCK-8821 Dispatched',
    severity: 'Info',
    status: 'Success',
  },
  {
    id: 'A-0005',
    actor: 'Super Admin',
    adminName: 'Super Admin',
    adminRole: 'Administrator',
    adminEmail: 'admin@powergrid.in',
    role: 'Super Admin',
    actorRole: 'Administrator',
    action: 'Created new Zone AP-Z08 Amaravati Capital Zone',
    actionType: 'Created',
    module: 'Zones',
    target: 'AP-Z08',
    record: 'AP-Z08',
    recordId: 'AP-Z08',
    details: 'Configured new geographic cluster with 10 High-Power DC Fast Chargers & 900kW capacity.',
    ipAddress: '192.168.1.10',
    device: 'Chrome / Mac',
    timestamp: '2024-12-13 11:45:00',
    dateOnly: '2024-12-13',
    timeOnly: '11:45:00',
    previousValue: 'Total Zones: 7',
    newValue: 'Total Zones: 8 (AP-Z08 Active)',
    severity: 'Notice',
    status: 'Success',
  },
  {
    id: 'A-0006',
    actor: 'Billing Manager',
    adminName: 'Billing Manager',
    adminRole: 'Finance & Accounts',
    adminEmail: 'billing@powergrid.in',
    role: 'Billing Manager',
    actorRole: 'Finance & Accounts',
    action: 'Settled daily GST tax ledger for AP-Z01 to AP-Z08',
    actionType: 'Approved',
    module: 'Payments',
    target: 'GST-DEC-12',
    record: 'GST-DEC-12',
    recordId: 'GST-DEC-12',
    details: 'Reconciliation of ₹24,850 GST component verified against Razorpay merchant ledger.',
    ipAddress: '103.24.128.9',
    device: 'Safari / macOS',
    timestamp: '2024-12-12 18:30:15',
    dateOnly: '2024-12-12',
    timeOnly: '18:30:15',
    previousValue: 'Status: Unreconciled',
    newValue: 'Status: Settled & Signed',
    severity: 'Info',
    status: 'Success',
  },
  {
    id: 'A-0007',
    actor: 'Security Daemon',
    adminName: 'Security Daemon',
    adminRole: 'Automated Sentinel',
    adminEmail: 'security-bot@powergrid.in',
    role: 'Security Daemon',
    actorRole: 'Automated Sentinel',
    action: 'Blocked 5 consecutive invalid admin login attempts',
    actionType: 'Changed Status',
    module: 'Security',
    target: 'IP 185.220.101.5',
    record: 'SEC-BAN-409',
    recordId: 'SEC-BAN-409',
    details: 'Brute-force mitigation triggered temporary 24-hour IP firewall ban.',
    ipAddress: '185.220.101.5',
    device: 'Unknown / CLI',
    timestamp: '2024-12-12 03:12:49',
    dateOnly: '2024-12-12',
    timeOnly: '03:12:49',
    previousValue: 'Firewall: Allowed',
    newValue: 'Firewall: Drop (24h Ban)',
    severity: 'Critical',
    status: 'Warning',
  },
  {
    id: 'A-0008',
    actor: 'Operations Lead',
    adminName: 'Operations Lead',
    adminRole: 'Grid Controller',
    adminEmail: 'ops.lead@powergrid.in',
    role: 'Operations Lead',
    actorRole: 'Grid Controller',
    action: 'Executed remote reboot on OCPP controller CH-014',
    actionType: 'Reboot',
    module: 'Chargers',
    target: 'CH-014',
    record: 'CH-014',
    recordId: 'CH-014',
    details: 'Remote soft-reset issued to restore heartbeat telemetry signal.',
    ipAddress: '103.24.128.12',
    device: 'Firefox / Linux',
    timestamp: '2024-12-11 15:40:02',
    dateOnly: '2024-12-11',
    timeOnly: '15:40:02',
    previousValue: 'Telemetry: Latency High (>45s)',
    newValue: 'Telemetry: Active Ping (42ms)',
    severity: 'Info',
    status: 'Success',
  },
];

class AdminService {
  private zones = [...INITIAL_ZONES];
  private chargers = [...INITIAL_CHARGERS];
  private users = [...INITIAL_USERS];
  private vehicles = [...INITIAL_VEHICLES];
  private sessions = [...INITIAL_SESSIONS];
  private tariffs = [...INITIAL_TARIFFS];
  private maintenance = [...INITIAL_MAINTENANCE];
  private auditLogs = [...INITIAL_AUDIT_LOGS];

  constructor() {
    const savedZones = sessionStorage.getItem('vg_admin_zones');
    if (savedZones) {
      try {
        this.zones = JSON.parse(savedZones);
      } catch {
        // use default
      }
    }
    const savedChargers = sessionStorage.getItem('vg_admin_chargers');
    if (savedChargers) {
      try {
        this.chargers = JSON.parse(savedChargers);
      } catch {
        // use default
      }
    }
    const savedTariffs = sessionStorage.getItem('vg_admin_tariffs');
    if (savedTariffs) {
      try {
        this.tariffs = JSON.parse(savedTariffs);
      } catch {
        // use default
      }
    }
    const savedMaintenance = sessionStorage.getItem('vg_admin_maintenance');
    if (savedMaintenance) {
      try {
        this.maintenance = JSON.parse(savedMaintenance);
      } catch {
        // use default
      }
    }
  }

  async getDashboardOverview(): Promise<AdminDashboardOverview> {
    await new Promise((res) => setTimeout(res, 200));

    return {
      totalZones: 8,
      totalChargingPoints: 80,
      availablePoints: 49,
      chargingPoints: 23,
      reservedPoints: 5,
      maintenancePoints: 3,
      todayRevenueINR: 12480,
      todayRevenueGrowthPercent: 18,
      activeSessionsCount: 14,
      activeSessionsLiveValueINR: 4920,
      energyDeliveredTodayKWh: 892,
      monthlyRevenueINR: 156000,
      revenueTrend: [
        { month: 'Jul', revenue: 98000, energyKWh: 7800 },
        { month: 'Aug', revenue: 114000, energyKWh: 9100 },
        { month: 'Sep', revenue: 128000, energyKWh: 10200 },
        { month: 'Oct', revenue: 139000, energyKWh: 11100 },
        { month: 'Nov', revenue: 148000, energyKWh: 11900 },
        { month: 'Dec', revenue: 156000, energyKWh: 12480 },
      ],
      vehicleDistribution: [
        { category: '4W Passenger Cars', count: 540, percentage: 62 },
        { category: 'Commercial Fleets & Taxis', count: 210, percentage: 24 },
        { category: '2W & 3W EVs', count: 122, percentage: 14 },
      ],
      zonesSummary: this.zones,
    };
  }

  async getZones(): Promise<AdminZone[]> {
    return [...this.zones];
  }

  async getChargingPoints(): Promise<AdminChargingPoint[]> {
    return [...this.chargers];
  }

  async getUsers(): Promise<AdminUser[]> {
    return [...this.users];
  }

  async getVehicles(): Promise<AdminVehicle[]> {
    return [...this.vehicles];
  }

  async getChargingSessions(): Promise<AdminChargingSession[]> {
    return [...this.sessions];
  }

  async getTariffs(): Promise<AdminTariffPlan[]> {
    return [...this.tariffs];
  }

  async getMaintenanceTickets(): Promise<AdminMaintenanceTicket[]> {
    return [...this.maintenance];
  }

  async getAuditLogs(): Promise<AdminAuditLog[]> {
    return [...this.auditLogs];
  }

  async createZone(newZone: Partial<AdminZone>): Promise<AdminZone> {
    await new Promise((res) => setTimeout(res, 400));
    const created: AdminZone = {
      id: `zone_${Date.now()}`,
      code: newZone.code || `AP-Z0${this.zones.length + 1}`,
      name: newZone.name || 'New AP Hub',
      address: newZone.address || 'Andhra Pradesh',
      city: newZone.city || 'Vijayawada',
      state: newZone.state || 'Andhra Pradesh',
      totalChargers: newZone.totalChargers || 10,
      availableChargers: newZone.availableChargers ?? 10,
      chargingCount: newZone.chargingCount ?? 0,
      reservedCount: newZone.reservedCount ?? 0,
      maintenanceCount: newZone.maintenanceCount ?? 0,
      powerCapacityKw: newZone.powerCapacityKw || 1000,
      currentLoadKw: newZone.currentLoadKw || 0,
      todayRevenueINR: newZone.todayRevenueINR || 0,
      operatingHours: newZone.operatingHours || '24/7',
      contactNumber: newZone.contactNumber || '+91 86600 00000',
      status: (newZone.status as 'Active') || 'Active',
    };
    this.zones.push(created);
    sessionStorage.setItem('vg_admin_zones', JSON.stringify(this.zones));
    return created;
  }

  async createChargingPoint(newPoint: Partial<AdminChargingPoint>): Promise<AdminChargingPoint> {
    await new Promise((res) => setTimeout(res, 400));
    const pointId = newPoint.pointCode || newPoint.id || `CH-${String(this.chargers.length + 1).padStart(3, '0')}`;
    const zone = this.zones.find((z) => z.code === newPoint.zoneCode) || {
      name: newPoint.zoneName || 'Vijayawada Central',
      city: newPoint.city || 'Vijayawada',
    };

    const created: AdminChargingPoint = {
      id: pointId,
      pointCode: pointId,
      stationName: newPoint.stationName || zone.name,
      zoneCode: newPoint.zoneCode || 'AP-Z01',
      zoneName: newPoint.zoneName || zone.name,
      city: newPoint.city || zone.city,
      type: newPoint.type || 'DC',
      chargerType: newPoint.chargerType || 'DC (Fast)',
      connectorType: newPoint.connectorType || 'CCS2',
      powerKw: Number(newPoint.powerKw) || 120,
      status: (newPoint.status as 'Available') || 'Available',
      ratePerKWh: (Number(newPoint.powerKw) || 120) >= 120 ? 14 : 12,
      utilizationPercent: 0,
      lastPingTime: 'Just now',
      chargerNumber: newPoint.chargerNumber || this.chargers.length + 1,
      ocppId: newPoint.ocppId || `OCPP-${newPoint.zoneCode || 'AP-Z01'}-${String(this.chargers.length + 1).padStart(2, '0')}`,
    };

    this.chargers.unshift(created);
    sessionStorage.setItem('vg_admin_chargers', JSON.stringify(this.chargers));
    return created;
  }

  async updateChargingPoint(id: string, updates: Partial<AdminChargingPoint>): Promise<AdminChargingPoint> {
    await new Promise((res) => setTimeout(res, 300));
    const idx = this.chargers.findIndex((c) => c.id === id || c.pointCode === id);
    if (idx === -1) {
      throw new Error('Charging point not found');
    }
    this.chargers[idx] = { ...this.chargers[idx], ...updates };
    sessionStorage.setItem('vg_admin_chargers', JSON.stringify(this.chargers));
    return this.chargers[idx];
  }

  async deleteChargingPoint(id: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 300));
    this.chargers = this.chargers.filter((c) => c.id !== id && c.pointCode !== id);
    sessionStorage.setItem('vg_admin_chargers', JSON.stringify(this.chargers));
    return true;
  }

  async createTariff(newTariff: Partial<AdminTariffPlan>): Promise<AdminTariffPlan> {
    await new Promise((res) => setTimeout(res, 350));
    const tariffId = newTariff.id || `T-00${this.tariffs.length + 1}`;
    const created: AdminTariffPlan = {
      id: tariffId,
      name: newTariff.name || `${newTariff.zoneCode || 'Global'} ${newTariff.vehicleType || 'EV'} Rate`,
      type: newTariff.type || 'Per kWh',
      vehicleType: newTariff.vehicleType || 'CAR',
      zoneCode: newTariff.zoneCode || 'Global',
      zoneName: newTariff.zoneName || (newTariff.zoneCode === 'Global' ? 'Global Scope' : 'Zone Scope'),
      pricingType: newTariff.pricingType || 'Per kWh',
      ratePerKWhINR: Number(newTariff.ratePerKWhINR) || 12.0,
      standardRateINR: Number(newTariff.ratePerKWhINR) || 12.0,
      serviceFeeINR: Number(newTariff.serviceFeeINR) || 10.0,
      taxGstPercent: Number(newTariff.taxGstPercent) || 18.0,
      minChargeINR: Number(newTariff.minChargeINR) || 20.0,
      effectiveFrom: newTariff.effectiveFrom || '2024-01-01',
      effectiveTo: newTariff.effectiveTo || '2024-12-31',
      priority: newTariff.priority || (newTariff.zoneCode === 'Global' ? 3 : 2),
      status: newTariff.status || 'Active',
      lastUpdated: new Date().toISOString().slice(0, 10),
    };
    this.tariffs.push(created);
    sessionStorage.setItem('vg_admin_tariffs', JSON.stringify(this.tariffs));
    return created;
  }

  async updateTariff(id: string, updates: Partial<AdminTariffPlan>): Promise<AdminTariffPlan> {
    await new Promise((res) => setTimeout(res, 300));
    const idx = this.tariffs.findIndex((t) => t.id === id);
    if (idx === -1) {
      throw new Error('Tariff rule not found');
    }
    this.tariffs[idx] = {
      ...this.tariffs[idx],
      ...updates,
      lastUpdated: new Date().toISOString().slice(0, 10),
    };
    sessionStorage.setItem('vg_admin_tariffs', JSON.stringify(this.tariffs));
    return this.tariffs[idx];
  }

  async deleteTariff(id: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 300));
    this.tariffs = this.tariffs.filter((t) => t.id !== id);
    sessionStorage.setItem('vg_admin_tariffs', JSON.stringify(this.tariffs));
    return true;
  }

  async getReportsData(
    period: string = '6M',
    startDate: string = '2024-07-01',
    endDate: string = '2024-12-31'
  ): Promise<import('../types/admin').AdminReportsData> {
    await new Promise((res) => setTimeout(res, 250));

    // Multiplier based on period
    let factor = 1.0;
    let months: string[] = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (period === '7D') {
      factor = 0.25;
      months = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
    } else if (period === '30D') {
      factor = 0.55;
      months = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    } else if (period === '3M') {
      factor = 0.75;
      months = ['Oct', 'Nov', 'Dec'];
    } else if (period === '6M') {
      factor = 1.0;
      months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    } else if (period === '1Y') {
      factor = 1.8;
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }

    const baseMonthly: { [key: string]: { rev: number; kwh: number; car: number; bike: number; bus: number } } = {
      Jan: { rev: 45000, kwh: 3200, car: 110, bike: 60, bus: 20 },
      Feb: { rev: 52000, kwh: 3600, car: 125, bike: 70, bus: 22 },
      Mar: { rev: 61000, kwh: 4000, car: 140, bike: 80, bus: 25 },
      Apr: { rev: 68000, kwh: 4300, car: 150, bike: 85, bus: 28 },
      May: { rev: 74000, kwh: 4500, car: 160, bike: 90, bus: 30 },
      Jun: { rev: 78000, kwh: 4650, car: 165, bike: 92, bus: 32 },
      Jul: { rev: 82000, kwh: 4800, car: 170, bike: 95, bus: 35 },
      Aug: { rev: 96000, kwh: 5500, car: 200, bike: 110, bus: 40 },
      Sep: { rev: 112000, kwh: 6400, car: 230, bike: 130, bus: 45 },
      Oct: { rev: 128000, kwh: 7200, car: 270, bike: 150, bus: 55 },
      Nov: { rev: 144000, kwh: 8300, car: 300, bike: 170, bus: 62 },
      Dec: { rev: 160000, kwh: 9600, car: 342, bike: 198, bus: 72 },
      'Day 1': { rev: 12000, kwh: 850, car: 35, bike: 20, bus: 8 },
      'Day 2': { rev: 14500, kwh: 980, car: 42, bike: 24, bus: 9 },
      'Day 3': { rev: 16200, kwh: 1100, car: 48, bike: 28, bus: 10 },
      'Day 4': { rev: 18400, kwh: 1250, car: 52, bike: 30, bus: 12 },
      'Day 5': { rev: 21000, kwh: 1400, car: 58, bike: 35, bus: 14 },
      'Day 6': { rev: 23500, kwh: 1580, car: 64, bike: 38, bus: 15 },
      'Day 7': { rev: 26800, kwh: 1750, car: 70, bike: 42, bus: 16 },
      'Week 1': { rev: 32000, kwh: 2100, car: 75, bike: 45, bus: 15 },
      'Week 2': { rev: 36500, kwh: 2450, car: 85, bike: 50, bus: 18 },
      'Week 3': { rev: 41000, kwh: 2750, car: 95, bike: 58, bus: 20 },
      'Week 4': { rev: 48500, kwh: 3200, car: 110, bike: 65, bus: 24 },
    };

    const monthlyMetrics = months.map((m) => {
      const base = baseMonthly[m] || { rev: 80000, kwh: 5000, car: 180, bike: 100, bus: 30 };
      return {
        month: m,
        revenueINR: Math.round(base.rev),
        energyKWh: Math.round(base.kwh),
        carSessions: Math.round(base.car),
        bikeSessions: Math.round(base.bike),
        busSessions: Math.round(base.bus),
      };
    });

    const vehicleCategories: import('../types/admin').AdminVehicleCategoryReport[] = [
      {
        category: 'CAR',
        sessions: Math.round(342 * factor),
        energyKWh: Math.round(5840 * factor),
        revenueINR: Math.round(70080 * factor),
        progressPercent: 72,
      },
      {
        category: 'BIKE',
        sessions: Math.round(198 * factor),
        energyKWh: Math.round(892 * factor),
        revenueINR: Math.round(7136 * factor),
        progressPercent: 44,
      },
      {
        category: 'BUS',
        sessions: Math.round(72 * factor),
        energyKWh: Math.round(7840 * factor),
        revenueINR: Math.round(141120 * factor),
        progressPercent: 18,
      },
    ];

    const baseZones = [
      { zoneCode: 'AP-Z01', zoneName: 'Vijayawada Central', sessions: 187, energyKWh: 3403, revenueINR: 42800, utilizationPercent: 68, performance: 'Moderate' as const },
      { zoneCode: 'AP-Z02', zoneName: 'Visakhapatnam Port', sessions: 163, energyKWh: 2967, revenueINR: 38500, utilizationPercent: 54, performance: 'Moderate' as const },
      { zoneCode: 'AP-Z03', zoneName: 'Tirupati East Hub', sessions: 214, energyKWh: 3895, revenueINR: 51200, utilizationPercent: 72, performance: 'High' as const },
      { zoneCode: 'AP-Z04', zoneName: 'Guntur Smart City', sessions: 132, energyKWh: 2402, revenueINR: 29600, utilizationPercent: 61, performance: 'Moderate' as const },
      { zoneCode: 'AP-Z05', zoneName: 'Nellore NH-16 Hub', sessions: 87, energyKWh: 1583, revenueINR: 18900, utilizationPercent: 34, performance: 'Low' as const },
      { zoneCode: 'AP-Z06', zoneName: 'Kurnool IT Park', sessions: 154, energyKWh: 2803, revenueINR: 33700, utilizationPercent: 78, performance: 'High' as const },
      { zoneCode: 'AP-Z07', zoneName: 'Kakinada Smart Port', sessions: 61, energyKWh: 1110, revenueINR: 12400, utilizationPercent: 22, performance: 'Low' as const },
      { zoneCode: 'AP-Z08', zoneName: 'Rajahmundry Godavari Hub', sessions: 194, energyKWh: 3531, revenueINR: 44100, utilizationPercent: 65, performance: 'Moderate' as const },
    ];

    const zonePerformance = baseZones.map((z) => {
      const sessions = Math.round(z.sessions * factor);
      const energyKWh = Math.round(z.energyKWh * factor);
      const revenueINR = Math.round(z.revenueINR * factor);
      return {
        ...z,
        sessions,
        energyKWh,
        revenueINR,
      };
    });

    const totalRevenueINR = zonePerformance.reduce((acc, z) => acc + z.revenueINR, 0);
    const totalEnergyKWh = zonePerformance.reduce((acc, z) => acc + z.energyKWh, 0);
    const totalSessions = zonePerformance.reduce((acc, z) => acc + z.sessions, 0);
    const avgUtilizationPercent = Math.round(
      zonePerformance.reduce((acc, z) => acc + z.utilizationPercent, 0) / zonePerformance.length
    );

    return {
      period,
      startDate,
      endDate,
      monthlyMetrics,
      vehicleCategories,
      zonePerformance,
      summary: {
        totalRevenueINR,
        totalEnergyKWh,
        totalSessions,
        avgUtilizationPercent,
      },
    };
  }
}

export const adminService = new AdminService();

