import React, { useState, useEffect } from 'react';
import { AdminReservation } from '../../types/admin';
import { AdminDataTable, Column } from '../../components/AdminDataTable/AdminDataTable';
import './AdminReservations.css';

export const AdminReservations: React.FC = () => {
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [filtered, setFiltered] = useState<AdminReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate simulated AP network reservations based on sessions
    const dummyReservations: AdminReservation[] = [
      {
        id: 'res_01',
        reservationNumber: 'PG-RES-84920',
        userName: 'Praveen Kumar',
        userPhone: '+91 98480 11223',
        stationName: 'Vijayawada Central Fast Charging',
        pointCode: 'AP-Z01-CP04',
        vehiclePlate: 'AP 16 CK 9921',
        scheduledStartTime: 'Today, 04:00 PM',
        durationMinutes: 45,
        slotFeeINR: 50,
        status: 'Confirmed',
        createdAt: 'Today, 02:15 PM',
      },
      {
        id: 'res_02',
        reservationNumber: 'PG-RES-84921',
        userName: 'Lakshmi Narayana',
        userPhone: '+91 94401 22334',
        stationName: 'Amaravati Capital Secretariat Hub',
        pointCode: 'AP-Z04-CP02',
        vehiclePlate: 'AP 39 EE 1004',
        scheduledStartTime: 'Today, 05:30 PM',
        durationMinutes: 60,
        slotFeeINR: 50,
        status: 'Confirmed',
        createdAt: 'Today, 01:40 PM',
      },
      {
        id: 'res_03',
        reservationNumber: 'PG-RES-84919',
        userName: 'Divya Sri',
        userPhone: '+91 89190 33445',
        stationName: 'Beach Road Supercharge Hub',
        pointCode: 'AP-Z02-CP05',
        vehiclePlate: 'AP 31 AB 1234',
        scheduledStartTime: 'Today, 03:30 PM',
        durationMinutes: 30,
        slotFeeINR: 50,
        status: 'Active',
        createdAt: 'Today, 11:20 AM',
      },
      {
        id: 'res_04',
        reservationNumber: 'PG-RES-84915',
        userName: 'Srinivas Rao',
        userPhone: '+91 98850 44556',
        stationName: 'Tirupati Alipiri Foothills Station',
        pointCode: 'AP-Z03-CP01',
        vehiclePlate: 'AP 03 BY 8844',
        scheduledStartTime: 'Today, 01:00 PM',
        durationMinutes: 45,
        slotFeeINR: 50,
        status: 'Completed',
        createdAt: 'Today, 09:00 AM',
      },
      {
        id: 'res_05',
        reservationNumber: 'PG-RES-84910',
        userName: 'Kalyan Chakravarthy',
        userPhone: '+91 97000 55667',
        stationName: 'Kakinada Smart City Port Station',
        pointCode: 'AP-Z06-CP08',
        vehiclePlate: 'AP 05 TD 5050',
        scheduledStartTime: 'Today, 12:00 PM',
        durationMinutes: 30,
        slotFeeINR: 50,
        status: 'Cancelled',
        createdAt: 'Yesterday',
      },
    ];
    setReservations(dummyReservations);
    setFiltered(dummyReservations);
    setIsLoading(false);
  }, []);

  const handleSearch = (term: string) => {
    const q = term.toLowerCase();
    setFiltered(
      reservations.filter(
        (r) =>
          (r.reservationNumber || r.id).toLowerCase().includes(q) ||
          (r.userName || r.customerName || '').toLowerCase().includes(q) ||
          r.stationName.toLowerCase().includes(q) ||
          (r.pointCode || r.chargerId || '').toLowerCase().includes(q) ||
          r.vehiclePlate.toLowerCase().includes(q)
      )
    );
  };

  const columns: Column<AdminReservation>[] = [
    {
      key: 'reservationNumber',
      header: 'Booking ID',
      render: (r) => <span className="pg-admin-res__code">{r.reservationNumber || r.id}</span>,
      width: '140px',
    },
    {
      key: 'userName',
      header: 'Customer',
      render: (r) => (
        <div>
          <div className="pg-admin-res__user">{r.userName || r.customerName}</div>
          <span className="pg-admin-res__phone">{r.userPhone || r.customerPhone}</span>
        </div>
      ),
    },
    {
      key: 'stationName',
      header: 'Station & Slot',
      render: (r) => (
        <div>
          <div className="pg-admin-res__station">{r.stationName}</div>
          <span className="pg-admin-res__slot">{r.pointCode || r.chargerId}</span>
        </div>
      ),
    },
    {
      key: 'vehiclePlate',
      header: 'Vehicle',
      render: (r) => <span className="pg-admin-res__plate">{r.vehiclePlate}</span>,
    },
    {
      key: 'scheduledStartTime',
      header: 'Time & Duration',
      render: (r) => (
        <div>
          <div>{r.scheduledStartTime}</div>
          <span className="pg-admin-res__duration">{r.durationMinutes} mins slot</span>
        </div>
      ),
    },
    {
      key: 'slotFeeINR',
      header: 'Fee',
      render: (r) => <span className="pg-admin-res__fee">₹{r.slotFeeINR}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <span className={`pg-admin-res__badge pg-admin-res__badge--${r.status.toLowerCase()}`}>
          ● {r.status}
        </span>
      ),
    },
  ];

  return (
    <div className="pg-admin-res">
      <div className="pg-admin-res__header">
        <div>
          <h1 className="pg-admin-res__title">Slot Reservations (5 Upcoming)</h1>
          <p className="pg-admin-res__subtitle">
            Manage advance driver bookings, hold timers, and slot occupancy
          </p>
        </div>
      </div>

      <AdminDataTable
        columns={columns}
        data={filtered}
        keyExtractor={(r) => r.id}
        isLoading={isLoading}
        searchPlaceholder="Search reservation ID, driver, vehicle plate..."
        onSearch={handleSearch}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};
export default AdminReservations;
