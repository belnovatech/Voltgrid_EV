import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Lock, Users, Eye, Edit3, UserPlus } from 'lucide-react';
import { AdminRolePermission, RoleStaffMember } from '../../../../types/admin';
import './RoleTable.css';

interface RoleTableProps {
  roles: AdminRolePermission[];
  staffMembers: RoleStaffMember[];
  onViewDetails: (role: AdminRolePermission) => void;
  onEditRole: (role: AdminRolePermission) => void;
  onAssignStaff: (role: AdminRolePermission) => void;
}

export const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  staffMembers,
  onViewDetails,
  onEditRole,
  onAssignStaff,
}) => {
  const getAccessBadge = (level?: string) => {
    switch (level) {
      case 'Critical':
        return <span className="pg-role-pill pg-role-pill--critical"><ShieldAlert className="w-2.5 h-2.5 mr-1 inline" />Critical</span>;
      case 'Elevated':
        return <span className="pg-role-pill pg-role-pill--elevated"><Shield className="w-2.5 h-2.5 mr-1 inline" />Elevated</span>;
      case 'Operational':
        return <span className="pg-role-pill pg-role-pill--operational"><ShieldCheck className="w-2.5 h-2.5 mr-1 inline" />Operational</span>;
      case 'Audit':
        return <span className="pg-role-pill pg-role-pill--audit"><Lock className="w-2.5 h-2.5 mr-1 inline" />Audit</span>;
      default:
        return <span className="pg-role-pill pg-role-pill--standard">Standard</span>;
    }
  };

  return (
    <div className="pg-role-table-container">
      <div className="pg-role-table-scroll">
        <table className="pg-role-table" aria-label="Role & Access Control Table">
          <thead>
            <tr>
              <th className="pg-role-table__th" style={{ width: '28%' }}>Role Name</th>
              <th className="pg-role-table__th" style={{ width: '12%' }}>Type</th>
              <th className="pg-role-table__th" style={{ width: '16%' }}>Clearance Level</th>
              <th className="pg-role-table__th" style={{ width: '14%' }}>Assigned Staff</th>
              <th className="pg-role-table__th" style={{ width: '12%' }}>Permissions</th>
              <th className="pg-role-table__th" style={{ width: '10%' }}>Modified</th>
              <th className="pg-role-table__th" style={{ width: '8%', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => {
              const assigned = staffMembers.filter((s) => s.roleId === role.id);
              return (
                <tr key={role.id} className="pg-role-table__tr">
                  <td className="pg-role-table__td">
                    <div className="pg-role-table__role-cell">
                      <div className="pg-role-table__icon-wrap">
                        {role.accessLevel === 'Critical' ? (
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                        ) : role.isSystem ? (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Shield className="w-3.5 h-3.5 text-blue-500" />
                        )}
                      </div>
                      <div className="pg-role-table__name-col">
                        <button
                          type="button"
                          className="pg-role-table__role-name-btn"
                          onClick={() => onViewDetails(role)}
                        >
                          {role.name}
                        </button>
                        <div className="pg-role-table__role-code">{role.code || role.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="pg-role-table__td">
                    {role.isSystem ? (
                      <span className="pg-role-table__type-badge pg-role-table__type-badge--system">System</span>
                    ) : (
                      <span className="pg-role-table__type-badge pg-role-table__type-badge--custom">Custom</span>
                    )}
                  </td>

                  <td className="pg-role-table__td">
                    {getAccessBadge(role.accessLevel)}
                  </td>

                  <td className="pg-role-table__td">
                    <div className="pg-role-table__staff-cell">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span className="pg-role-table__staff-count">{assigned.length} Staff</span>
                    </div>
                  </td>

                  <td className="pg-role-table__td">
                    <span className="pg-role-table__perms-count">
                      {role.permissions.length} Granted
                    </span>
                  </td>

                  <td className="pg-role-table__td">
                    <span className="pg-role-table__date">{role.lastModified || '2026-10-01'}</span>
                  </td>

                  <td className="pg-role-table__td" style={{ textAlign: 'right' }}>
                    <div className="pg-role-table__actions">
                      <button
                        type="button"
                        className="pg-role-table__action-btn"
                        onClick={() => onViewDetails(role)}
                        title="View role details"
                        aria-label={`View ${role.name}`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        className="pg-role-table__action-btn"
                        onClick={() => onAssignStaff(role)}
                        title="Assign staff"
                        aria-label={`Assign staff to ${role.name}`}
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        className="pg-role-table__action-btn"
                        onClick={() => onEditRole(role)}
                        title="Edit permissions"
                        aria-label={`Edit ${role.name}`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

