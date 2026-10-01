import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Lock, Users, ChevronRight, UserPlus, Edit3, Check } from 'lucide-react';
import { AdminRolePermission, RoleStaffMember } from '../../../../types/admin';
import './RoleCard.css';

interface RoleCardProps {
  role: AdminRolePermission;
  staffMembers: RoleStaffMember[];
  onViewDetails: (role: AdminRolePermission) => void;
  onEditRole: (role: AdminRolePermission) => void;
  onAssignStaff: (role: AdminRolePermission) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  role,
  staffMembers,
  onViewDetails,
  onEditRole,
  onAssignStaff,
}) => {
  const roleStaff = staffMembers.filter((s) => s.roleId === role.id);
  const totalPerms = role.permissions.length;
  const previewPerms = role.permissions.slice(0, 4);
  const remainingPerms = Math.max(0, totalPerms - 4);

  const getAccessLevelBadge = (level?: string) => {
    switch (level) {
      case 'Critical':
        return { label: 'CRITICAL', className: 'pg-role-badge--critical', icon: <ShieldAlert className="w-3 h-3" /> };
      case 'Elevated':
        return { label: 'ELEVATED', className: 'pg-role-badge--elevated', icon: <Shield className="w-3 h-3" /> };
      case 'Operational':
        return { label: 'OPERATIONAL', className: 'pg-role-badge--operational', icon: <ShieldCheck className="w-3 h-3" /> };
      case 'Audit':
        return { label: 'AUDIT', className: 'pg-role-badge--audit', icon: <Lock className="w-3 h-3" /> };
      default:
        return { label: 'STANDARD', className: 'pg-role-badge--standard', icon: <Shield className="w-3 h-3" /> };
    }
  };

  const levelBadge = getAccessLevelBadge(role.accessLevel);

  return (
    <div className={`pg-role-card pg-role-card--${(role.accessLevel || 'standard').toLowerCase()}`}>
      <div className="pg-role-card__header">
        <div className="pg-role-card__identity">
          <div className="pg-role-card__icon-wrap" aria-hidden="true">
            {role.accessLevel === 'Critical' ? (
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            ) : role.isSystem ? (
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            ) : (
              <Shield className="w-4 h-4 text-blue-500" />
            )}
          </div>
          <div>
            <div className="pg-role-card__name-row">
              <h3 className="pg-role-card__name">{role.name}</h3>
              {role.isSystem ? (
                <span className="pg-role-card__tag pg-role-card__tag--system" title="System default built-in role">
                  SYSTEM
                </span>
              ) : (
                <span className="pg-role-card__tag pg-role-card__tag--custom" title="Custom created role">
                  CUSTOM
                </span>
              )}
            </div>
            <span className="pg-role-card__code">{role.code || role.id}</span>
          </div>
        </div>

        <div className="pg-role-card__level-badge-wrap">
          <span className={`pg-role-card__level-badge ${levelBadge.className}`}>
            {levelBadge.icon}
            {levelBadge.label}
          </span>
        </div>
      </div>

      <p className="pg-role-card__description">{role.description}</p>

      <div className="pg-role-card__metrics-bar">
        <div className="pg-role-card__metric">
          <div className="pg-role-card__metric-label">Assigned Staff</div>
          <div className="pg-role-card__staff-preview">
            <div className="pg-role-card__avatars">
              {roleStaff.slice(0, 3).map((stf) => (
                <div key={stf.id} className="pg-role-card__avatar" title={`${stf.name} (${stf.email})`}>
                  {stf.avatar || stf.name.slice(0, 2).toUpperCase()}
                </div>
              ))}
            </div>
            <span className="pg-role-card__metric-val">
              <Users className="w-3 h-3 inline mr-1 text-slate-400" />
              {roleStaff.length} Staff
            </span>
          </div>
        </div>

        <div className="pg-role-card__metric pg-role-card__metric--perms">
          <div className="pg-role-card__metric-label">Permissions</div>
          <div className="pg-role-card__metric-val pg-role-card__metric-val--highlight">
            {totalPerms} Granted
          </div>
        </div>
      </div>

      <div className="pg-role-card__perms-section">
        <div className="pg-role-card__perms-header">Capabilities:</div>
        <div className="pg-role-card__perms-list">
          {previewPerms.map((perm: string) => (
            <span key={perm} className="pg-role-card__perm-chip">
              <Check className="w-2.5 h-2.5 text-emerald-500 mr-1 inline" />
              {perm.replace(/_/g, ' ')}
            </span>
          ))}
          {remainingPerms > 0 && (
            <button
              type="button"
              className="pg-role-card__perm-more"
              onClick={() => onViewDetails(role)}
              title="View full permission matrix"
            >
              +{remainingPerms} more
            </button>
          )}
        </div>
      </div>

      <div className="pg-role-card__footer">
        <div className="pg-role-card__actions-left">
          <button
            type="button"
            className="pg-role-card__btn pg-role-card__btn--view"
            onClick={() => onViewDetails(role)}
            aria-label={`View details for ${role.name}`}
          >
            <span>View Role</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pg-role-card__actions-right">
          <button
            type="button"
            className="pg-role-card__icon-btn"
            onClick={() => onAssignStaff(role)}
            title="Assign staff to this role"
            aria-label={`Assign staff to ${role.name}`}
          >
            <UserPlus className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            className="pg-role-card__icon-btn"
            onClick={() => onEditRole(role)}
            title="Edit role permissions"
            aria-label={`Edit ${role.name}`}
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

