import React, { useState } from 'react';
import './AdminRolesPermissions.css';

export const AdminRolesPermissions: React.FC = () => {
  const [roles] = useState([
    {
      id: 'role_01',
      name: 'Super Admin',
      description: 'Complete unrestricted access across state grid telemetry, financials, tariffs, and access control.',
      usersCount: 2,
      permissions: ['ALL_PERMISSIONS', 'MANAGE_GRID', 'TARIFF_EDIT', 'AUDIT_LOGS', 'USER_MANAGEMENT'],
    },
    {
      id: 'role_02',
      name: 'Zone Operations Manager',
      description: 'Supervises charging points, live sessions, connector status, and load shedding per zone.',
      usersCount: 8,
      permissions: ['VIEW_ZONES', 'RESTART_CHARGER', 'DISPATCH_MAINTENANCE', 'VIEW_SESSIONS'],
    },
    {
      id: 'role_03',
      name: 'Field Service Engineer',
      description: 'Handles hardware maintenance tickets, OCPP diagnostics, and field physical checks.',
      usersCount: 14,
      permissions: ['VIEW_MAINTENANCE', 'UPDATE_TICKET', 'HARDWARE_TEST'],
    },
    {
      id: 'role_04',
      name: 'Financial Auditor',
      description: 'Read-only access to wallet transactions, daily revenue settlements, and tax reporting.',
      usersCount: 3,
      permissions: ['VIEW_REVENUE', 'EXPORT_REPORTS', 'VIEW_TARIFFS'],
    },
  ]);

  return (
    <div className="pg-admin-roles">
      <div className="pg-admin-roles__header">
        <div>
          <h1 className="pg-admin-roles__title">Roles & Access Permissions</h1>
          <p className="pg-admin-roles__subtitle">
            Configure role-based access control (RBAC), security clearance, and employee privileges
          </p>
        </div>
      </div>

      <div className="pg-admin-roles__grid">
        {roles.map((r) => (
          <div key={r.id} className="pg-admin-roles__card">
            <div className="pg-admin-roles__card-top">
              <span className="pg-admin-roles__role-tag">{r.name}</span>
              <span className="pg-admin-roles__users-badge">{r.usersCount} Active Staff</span>
            </div>

            <p className="pg-admin-roles__desc">{r.description}</p>

            <div className="pg-admin-roles__perms-title">Granted Capabilities:</div>
            <div className="pg-admin-roles__perms-list">
              {r.permissions.map((p) => (
                <span key={p} className="pg-admin-roles__perm-pill">
                  ✓ {p}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminRolesPermissions;
