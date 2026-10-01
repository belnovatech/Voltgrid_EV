import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  Users,
  KeyRound,
  History,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Edit3,
  UserPlus,
  GitCompare,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AdminRolePermission, RoleStaffMember, PermissionDefinition, AdminAuditLog } from '../../../../types/admin';
import './RoleDetailsDrawer.css';

interface RoleDetailsDrawerProps {
  role: AdminRolePermission | null;
  isOpen: boolean;
  onClose: () => void;
  staffMembers: RoleStaffMember[];
  permissionsCatalog: PermissionDefinition[];
  auditLogs: AdminAuditLog[];
  onEditRole: (role: AdminRolePermission) => void;
  onAssignStaff: (role: AdminRolePermission) => void;
  onCompareRole: (role: AdminRolePermission) => void;
  onDeleteRole: (role: AdminRolePermission) => void;
  onReassignMember?: (staff: RoleStaffMember) => void;
}

type TabType = 'permissions' | 'staff' | 'audit';

export const RoleDetailsDrawer: React.FC<RoleDetailsDrawerProps> = ({
  role,
  isOpen,
  onClose,
  staffMembers,
  permissionsCatalog,
  auditLogs,
  onEditRole,
  onAssignStaff,
  onCompareRole,
  onDeleteRole,
  onReassignMember,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('permissions');
  const [permSearch, setPermSearch] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !role) return null;

  const roleStaff = staffMembers.filter((s) => s.roleId === role.id);
  const roleAuditLogs = auditLogs.filter(
    (log) => log.target === role.name || log.recordId === role.id || log.details?.includes(role.name)
  );

  // Group permissions by category
  const categories = ['Grid Operations', 'Maintenance', 'Finance', 'Users', 'Security', 'Reporting'] as const;

  const filteredPermissions = permissionsCatalog.filter((p) => {
    const matchesSearch =
      permSearch === '' ||
      p.name.toLowerCase().includes(permSearch.toLowerCase()) ||
      p.code.toLowerCase().includes(permSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(permSearch.toLowerCase());
    return matchesSearch;
  });

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const getAccessBadgeClass = (level?: string) => {
    switch (level) {
      case 'Critical':
        return 'pg-drawer-badge--critical';
      case 'Elevated':
        return 'pg-drawer-badge--elevated';
      case 'Operational':
        return 'pg-drawer-badge--operational';
      case 'Audit':
        return 'pg-drawer-badge--audit';
      default:
        return 'pg-drawer-badge--standard';
    }
  };

  return (
    <div className="pg-drawer-overlay" onClick={onClose}>
      <aside
        className="pg-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pg-drawer-role-title"
      >
        {/* DRAWER HEADER */}
        <div className="pg-drawer__header">
          <div className="pg-drawer__header-main">
            <div className="pg-drawer__badge-row">
              {role.isSystem ? (
                <span className="pg-drawer__tag pg-drawer__tag--system">SYSTEM</span>
              ) : (
                <span className="pg-drawer__tag pg-drawer__tag--custom">CUSTOM</span>
              )}
              <span className={`pg-drawer__level-badge ${getAccessBadgeClass(role.accessLevel)}`}>
                {role.accessLevel || 'Standard'} Access
              </span>
              {role.isProtected && (
                <span className="pg-drawer__protected-pill" title="Protected system role">
                  <Lock className="w-2.5 h-2.5 inline mr-1" /> Protected
                </span>
              )}
            </div>

            <h2 id="pg-drawer-role-title" className="pg-drawer__title">
              {role.name}
            </h2>
            <div className="pg-drawer__code">{role.code || role.id}</div>
          </div>

          <button
            type="button"
            className="pg-drawer__close-btn"
            onClick={onClose}
            aria-label="Close details drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* DESCRIPTION */}
        <div className="pg-drawer__desc-box">
          <p className="pg-drawer__description">{role.description}</p>
        </div>

        {/* TABS */}
        <div className="pg-drawer__tabs" role="tablist">
          <button
            type="button"
            className={`pg-drawer__tab ${activeTab === 'permissions' ? 'pg-drawer__tab--active' : ''}`}
            onClick={() => setActiveTab('permissions')}
            role="tab"
            aria-selected={activeTab === 'permissions'}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Permissions ({role.permissions.length})</span>
          </button>

          <button
            type="button"
            className={`pg-drawer__tab ${activeTab === 'staff' ? 'pg-drawer__tab--active' : ''}`}
            onClick={() => setActiveTab('staff')}
            role="tab"
            aria-selected={activeTab === 'staff'}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Assigned Staff ({roleStaff.length})</span>
          </button>

          <button
            type="button"
            className={`pg-drawer__tab ${activeTab === 'audit' ? 'pg-drawer__tab--active' : ''}`}
            onClick={() => setActiveTab('audit')}
            role="tab"
            aria-selected={activeTab === 'audit'}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail ({roleAuditLogs.length})</span>
          </button>
        </div>

        {/* TAB BODY */}
        <div className="pg-drawer__body">
          {/* TAB 1: PERMISSIONS */}
          {activeTab === 'permissions' && (
            <div className="pg-drawer__perms-tab">
              <div className="pg-drawer__search-row">
                <div className="pg-drawer__perm-search">
                  <Search className="w-3 h-3 text-slate-400 pg-drawer__search-icon" />
                  <input
                    type="text"
                    className="pg-drawer__perm-input"
                    placeholder="Search capabilities..."
                    value={permSearch}
                    onChange={(e) => setPermSearch(e.target.value)}
                    aria-label="Filter permissions"
                  />
                  {permSearch && (
                    <button
                      type="button"
                      className="pg-drawer__perm-clear"
                      onClick={() => setPermSearch('')}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <div className="pg-drawer__category-list">
                {categories.map((category) => {
                  const catPerms = filteredPermissions.filter((p) => p.category === category);
                  if (catPerms.length === 0) return null;

                  const grantedCount = catPerms.filter((p) => role.permissions.includes(p.code)).length;
                  const isCollapsed = collapsedCategories[category];

                  return (
                    <div key={category} className="pg-drawer__category-card">
                      <button
                        type="button"
                        className="pg-drawer__category-head"
                        onClick={() => toggleCategory(category)}
                        aria-expanded={!isCollapsed}
                      >
                        <div className="pg-drawer__category-title-wrap">
                          <span className="pg-drawer__category-name">{category}</span>
                          <span className="pg-drawer__category-count">
                            {grantedCount} of {catPerms.length} Granted
                          </span>
                        </div>
                        {isCollapsed ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>

                      {!isCollapsed && (
                        <div className="pg-drawer__category-items">
                          {catPerms.map((perm) => {
                            const isGranted = role.permissions.includes(perm.code);
                            return (
                              <div
                                key={perm.id}
                                className={`pg-drawer__perm-row ${isGranted ? 'pg-drawer__perm-row--granted' : 'pg-drawer__perm-row--denied'}`}
                              >
                                <div className="pg-drawer__perm-status-col">
                                  {isGranted ? (
                                    <div className="pg-drawer__status-pill pg-drawer__status-pill--granted">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      <span>Granted</span>
                                    </div>
                                  ) : (
                                    <div className="pg-drawer__status-pill pg-drawer__status-pill--denied">
                                      <span>Not Assigned</span>
                                    </div>
                                  )}
                                </div>

                                <div className="pg-drawer__perm-meta-col">
                                  <div className="pg-drawer__perm-name-row">
                                    <span className="pg-drawer__perm-name">{perm.name}</span>
                                    {perm.isDangerous && (
                                      <span className="pg-drawer__danger-tag" title="High-impact capability">
                                        <AlertTriangle className="w-2.5 h-2.5 text-rose-500 inline mr-1" />
                                        High Impact
                                      </span>
                                    )}
                                  </div>
                                  <div className="pg-drawer__perm-code">{perm.code}</div>
                                  <p className="pg-drawer__perm-desc">{perm.description}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: STAFF MEMBERS */}
          {activeTab === 'staff' && (
            <div className="pg-drawer__staff-tab">
              <div className="pg-drawer__staff-header">
                <div>
                  <h3 className="pg-drawer__section-title">Employees with this Role</h3>
                  <p className="pg-drawer__section-sub">
                    {roleStaff.length} staff members actively assigned.
                  </p>
                </div>
                <button
                  type="button"
                  className="pg-drawer__btn-small pg-drawer__btn-small--primary"
                  onClick={() => onAssignStaff(role)}
                >
                  <UserPlus className="w-3 h-3 mr-1 inline" />
                  Assign Staff
                </button>
              </div>

              {roleStaff.length === 0 ? (
                <div className="pg-drawer__staff-empty">
                  <Users className="w-6 h-6 text-slate-300" />
                  <p>No employees are currently assigned to this role.</p>
                  <button
                    type="button"
                    className="pg-drawer__btn-small"
                    onClick={() => onAssignStaff(role)}
                  >
                    Assign First Employee
                  </button>
                </div>
              ) : (
                <div className="pg-drawer__staff-list">
                  {roleStaff.map((staff) => (
                    <div key={staff.id} className="pg-drawer__staff-card">
                      <div className="pg-drawer__staff-avatar">
                        {staff.avatar || staff.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="pg-drawer__staff-info">
                        <div className="pg-drawer__staff-name-row">
                          <span className="pg-drawer__staff-name">{staff.name}</span>
                          {staff.twoFactorEnabled ? (
                            <span className="pg-drawer__mfa-tag" title="Multi-factor authentication active">
                              <ShieldCheck className="w-2.5 h-2.5 text-emerald-600 inline mr-1" />
                              2FA Active
                            </span>
                          ) : (
                            <span className="pg-drawer__mfa-tag pg-drawer__mfa-tag--missing" title="2FA not configured">
                              2FA Missing
                            </span>
                          )}
                        </div>
                        <div className="pg-drawer__staff-email">{staff.email}</div>
                        <div className="pg-drawer__staff-dept">
                          {staff.department} · Assigned {staff.assignedAt}
                        </div>
                      </div>
                      {onReassignMember && (
                        <button
                          type="button"
                          className="pg-drawer__staff-reassign-btn"
                          onClick={() => onReassignMember(staff)}
                          title="Reassign to another role"
                        >
                          Change
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="pg-drawer__audit-tab">
              <div className="pg-drawer__audit-header">
                <h3 className="pg-drawer__section-title">Security Governance Audit Trail</h3>
                <p className="pg-drawer__section-sub">
                  Immutable chronological record of policy changes and staff assignments for this role.
                </p>
              </div>

              {roleAuditLogs.length === 0 ? (
                <div className="pg-drawer__audit-empty">
                  <Shield className="w-6 h-6 text-slate-300" />
                  <p>No recent administrative mutations logged for this role.</p>
                </div>
              ) : (
                <div className="pg-drawer__audit-timeline">
                  {roleAuditLogs.map((log) => (
                    <div key={log.id} className="pg-drawer__audit-item">
                      <div className="pg-drawer__audit-dot" />
                      <div className="pg-drawer__audit-content">
                        <div className="pg-drawer__audit-top">
                          <span className="pg-drawer__audit-action">{log.action}</span>
                          <span className="pg-drawer__audit-time">{log.timestamp}</span>
                        </div>
                        <p className="pg-drawer__audit-details">{log.details}</p>
                        <div className="pg-drawer__audit-actor">
                          Operator: <strong>{log.actor || log.adminName || 'Super Admin'}</strong> · IP: {log.ipAddress}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* DRAWER FOOTER */}
        <div className="pg-drawer__footer">
          <div className="pg-drawer__footer-left">
            <button
              type="button"
              className="pg-drawer__btn pg-drawer__btn--secondary"
              onClick={() => onCompareRole(role)}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare</span>
            </button>

            {!role.isSystem && !role.isProtected && (
              <button
                type="button"
                className="pg-drawer__btn pg-drawer__btn--danger"
                onClick={() => onDeleteRole(role)}
                title="Delete custom role"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>

          <div className="pg-drawer__footer-right">
            <button
              type="button"
              className="pg-drawer__btn pg-drawer__btn--secondary"
              onClick={() => onAssignStaff(role)}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Assign Staff</span>
            </button>

            <button
              type="button"
              className="pg-drawer__btn pg-drawer__btn--primary"
              onClick={() => onEditRole(role)}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Permissions</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

