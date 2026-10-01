import React from 'react';
import { Shield, Users, Lock, Layers, AlertTriangle, UserCheck } from 'lucide-react';
import './AccessSummary.css';

interface AccessSummaryProps {
  totalRoles: number;
  activeStaff: number;
  privilegedRoles: number;
  permissionGroupsCount: number;
  dangerousPermissionsCount: number;
  unassignedStaff: number;
  onFilterPrivileged?: () => void;
  onFilterActiveStaff?: () => void;
}

export const AccessSummary: React.FC<AccessSummaryProps> = ({
  totalRoles,
  activeStaff,
  privilegedRoles,
  permissionGroupsCount,
  dangerousPermissionsCount,
  unassignedStaff,
  onFilterPrivileged,
}) => {
  const kpis = [
    {
      id: 'roles',
      label: 'Configured Roles',
      value: String(totalRoles).padStart(2, '0'),
      subtext: `${totalRoles - 1} system · 1 custom`,
      icon: <Shield className="w-4 h-4 text-emerald-600" />,
      iconBg: '#ecfdf5',
      accent: 'emerald',
    },
    {
      id: 'staff',
      label: 'Active Staff Members',
      value: String(activeStaff).padStart(2, '0'),
      subtext: '100% role coverage',
      icon: <Users className="w-4 h-4 text-blue-600" />,
      iconBg: '#eff6ff',
      accent: 'blue',
    },
    {
      id: 'privileged',
      label: 'Privileged Roles',
      value: String(privilegedRoles).padStart(2, '0'),
      subtext: 'Requires MFA validation',
      icon: <Lock className="w-4 h-4 text-amber-600" />,
      iconBg: '#fffbeb',
      accent: 'amber',
      onClick: onFilterPrivileged,
    },
    {
      id: 'groups',
      label: 'Permission Domains',
      value: String(permissionGroupsCount).padStart(2, '0'),
      subtext: '25 granular capabilities',
      icon: <Layers className="w-4 h-4 text-indigo-600" />,
      iconBg: '#eef2ff',
      accent: 'indigo',
    },
    {
      id: 'dangerous',
      label: 'High-Impact Capabilities',
      value: String(dangerousPermissionsCount).padStart(2, '0'),
      subtext: 'Elevated platform risk',
      icon: <AlertTriangle className="w-4 h-4 text-rose-600" />,
      iconBg: '#fff1f2',
      accent: 'rose',
    },
    {
      id: 'unassigned',
      label: 'Unassigned Staff',
      value: String(unassignedStaff).padStart(2, '0'),
      subtext: 'Zero orphan accounts',
      icon: <UserCheck className="w-4 h-4 text-teal-600" />,
      iconBg: '#f0fdfa',
      accent: 'teal',
    },
  ];

  return (
    <section className="pg-access-summary" aria-label="Access Control Summary KPIs">
      <div className="pg-access-summary__grid">
        {kpis.map((kpi) => (
          <div
            key={kpi.id}
            className={`pg-access-summary__card pg-access-summary__card--${kpi.accent} ${kpi.onClick ? 'pg-access-summary__card--clickable' : ''}`}
            onClick={kpi.onClick}
            role={kpi.onClick ? 'button' : undefined}
            tabIndex={kpi.onClick ? 0 : undefined}
          >
            <div className="pg-access-summary__top">
              <div
                className="pg-access-summary__icon-box"
                style={{ backgroundColor: kpi.iconBg }}
                aria-hidden="true"
              >
                {kpi.icon}
              </div>
              <span className="pg-access-summary__value">{kpi.value}</span>
            </div>

            <div className="pg-access-summary__body">
              <div className="pg-access-summary__label">{kpi.label}</div>
              <div className="pg-access-summary__subtext">{kpi.subtext}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

