import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { AdminVehicle } from '../../types/admin';
import { AdminDataTable, Column } from '../../components/AdminDataTable/AdminDataTable';
import './AdminVehicles.css';

export const AdminVehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [filtered, setFiltered] = useState<AdminVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getVehicles();
      setVehicles(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    const q = term.toLowerCase();
    setFiltered(
      vehicles.filter(
        (v) =>
          (v.plateNumber || v.licensePlate || '').toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          (v.make || v.manufacturer || '').toLowerCase().includes(q) ||
          v.ownerName.toLowerCase().includes(q)
      )
    );
  };

  const columns: Column<AdminVehicle>[] = [
    {
      key: 'plateNumber',
      header: 'License Plate',
      render: (v) => <span className="pg-admin-veh__plate">{v.plateNumber || v.licensePlate}</span>,
      width: '140px',
    },
    {
      key: 'model',
      header: 'Vehicle Info',
      render: (v) => (
        <div>
          <div className="pg-admin-veh__model">{v.make || v.manufacturer} {v.model} {v.year ? `(${v.year})` : ''}</div>
          <span className="pg-admin-veh__category">{v.category || v.type}</span>
        </div>
      ),
    },
    {
      key: 'ownerName',
      header: 'Registered Owner',
      render: (v) => (
        <div>
          <div className="pg-admin-veh__owner">{v.ownerName}</div>
          <span className="pg-admin-veh__owner-id">{v.userId}</span>
        </div>
      ),
    },
    {
      key: 'batteryCapacityKWh',
      header: 'Battery & Port',
      render: (v) => (
        <div>
          <div>{v.batteryCapacityKWh} kWh</div>
          <span className="pg-admin-veh__port">{v.portType}</span>
        </div>
      ),
    },
    {
      key: 'totalEnergyDeliveredKWh',
      header: 'Total Delivered',
      render: (v) => <strong>{v.totalEnergyDeliveredKWh} kWh</strong>,
    },
    {
      key: 'isVerified',
      header: 'Verification',
      render: (v) => (
        <span className={`pg-admin-veh__badge ${v.isVerified ? 'pg-admin-veh__badge--verified' : ''}`}>
          {v.isVerified ? '✓ Verified' : 'Pending'}
        </span>
      ),
    },
  ];

  return (
    <div className="pg-admin-veh">
      <div className="pg-admin-veh__header">
        <div>
          <h1 className="pg-admin-veh__title">Registered EV Fleet</h1>
          <p className="pg-admin-veh__subtitle">
            Overview of all EV passenger cars, taxis, and fleet vehicles on PowerGrid
          </p>
        </div>
      </div>

      <AdminDataTable
        columns={columns}
        data={filtered}
        keyExtractor={(v) => v.id}
        isLoading={isLoading}
        searchPlaceholder="Search license plate, make, model or owner..."
        onSearch={handleSearch}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};
export default AdminVehicles;
