import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { AdminMaintenanceTicket } from '../../types/admin';
import { AdminDataTable, Column } from '../../components/AdminDataTable/AdminDataTable';
import './AdminMaintenance.css';

export const AdminMaintenance: React.FC = () => {
  const [tickets, setTickets] = useState<AdminMaintenanceTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getMaintenanceTickets();
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<AdminMaintenanceTicket>[] = [
    {
      key: 'ticketCode',
      header: 'Ticket ID',
      render: (t) => <span className="pg-admin-maint__code">{t.ticketCode}</span>,
      width: '130px',
    },
    {
      key: 'pointCode',
      header: 'Point & Station',
      render: (t) => (
        <div>
          <div className="pg-admin-maint__point">{t.pointCode}</div>
          <span className="pg-admin-maint__station">{t.stationName}</span>
        </div>
      ),
    },
    {
      key: 'issueDescription',
      header: 'Issue Description',
      render: (t) => <span>{t.issueDescription}</span>,
    },
    {
      key: 'severity',
      header: 'Severity',
      render: (t) => (
        <span className={`pg-admin-maint__sev pg-admin-maint__sev--${t.severity.toLowerCase()}`}>
          {t.severity}
        </span>
      ),
    },
    {
      key: 'technicianAssigned',
      header: 'Assigned Engineer',
      render: (t) => (
        <div>
          <div className="pg-admin-maint__tech">{t.technicianAssigned}</div>
          <span className="pg-admin-maint__team">{t.technicianContact}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Ticket Status',
      render: (t) => (
        <span className={`pg-admin-maint__status pg-admin-maint__status--${t.status.toLowerCase().replace(/\s+/g, '-')}`}>
          ● {t.status}
        </span>
      ),
    },
    {
      key: 'reportedAt',
      header: 'Reported At',
      render: (t) => <span className="pg-admin-maint__date">{t.reportedAt}</span>,
    },
  ];

  return (
    <div className="pg-admin-maint">
      <div className="pg-admin-maint__header">
        <div>
          <h1 className="pg-admin-maint__title">Field Maintenance & Diagnostics (3 Active)</h1>
          <p className="pg-admin-maint__subtitle">
            Manage field technician dispatch, hardware alerts, and emergency fault recovery
          </p>
        </div>
      </div>

      <AdminDataTable
        columns={columns}
        data={tickets}
        keyExtractor={(t) => t.id}
        isLoading={isLoading}
      />
    </div>
  );
};
export default AdminMaintenance;
