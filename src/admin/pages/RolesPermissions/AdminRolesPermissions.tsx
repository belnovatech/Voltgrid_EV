import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import {
  AdminRolePermission,
  RoleStaffMember,
  PermissionDefinition,
  AdminAuditLog,
} from '../../types/admin';
import { RolesHeader } from './components/RolesHeader/RolesHeader';
import { AccessSummary } from './components/AccessSummary/AccessSummary';
import { AccessHealth } from './components/AccessHealth/AccessHealth';
import { RoleFilters } from './components/RoleFilters/RoleFilters';
import { RoleCard } from './components/RoleCard/RoleCard';
import { RoleTable } from './components/RoleTable/RoleTable';
import { RoleDetailsDrawer } from './components/RoleDetailsDrawer/RoleDetailsDrawer';
import { RoleEditorModal } from './components/RoleEditorModal/RoleEditorModal';
import { CreateRoleModal } from './components/CreateRoleModal/CreateRoleModal';
import { AssignStaffModal } from './components/AssignStaffModal/AssignStaffModal';
import { RoleCompareModal } from './components/RoleCompareModal/RoleCompareModal';
import { RolesMobileFilters } from './components/RolesMobileFilters/RolesMobileFilters';
import { RolesSkeleton } from './components/RolesSkeleton/RolesSkeleton';
import { RolesEmptyState } from './components/RolesEmptyState/RolesEmptyState';
import { RolesErrorState } from './components/RolesErrorState/RolesErrorState';
import { RolesToast, ToastMessage } from './components/RolesToast/RolesToast';
import './AdminRolesPermissions.css';

export const AdminRolesPermissions: React.FC = () => {
  // Primary datasets
  const [roles, setRoles] = useState<AdminRolePermission[]>([]);
  const [staffMembers, setStaffMembers] = useState<RoleStaffMember[]>([]);
  const [permissionsCatalog, setPermissionsCatalog] = useState<PermissionDefinition[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Filtering & View state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<string>('ALL');
  const [selectedRoleType, setSelectedRoleType] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('staff-desc');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modals & Drawers
  const [drawerRole, setDrawerRole] = useState<AdminRolePermission | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editorRole, setEditorRole] = useState<AdminRolePermission | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [assignRole, setAssignRole] = useState<AdminRolePermission | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);
    setLoadError(null);

    try {
      const [rolesData, staffData, permsData, auditData] = await Promise.all([
        adminService.getRoles(),
        adminService.getStaffMembers(),
        adminService.getPermissionsCatalog(),
        adminService.getAuditLogs(),
      ]);

      setRoles(rolesData);
      setStaffMembers(staffData);
      setPermissionsCatalog(permsData);
      setAuditLogs(auditData);

      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    } catch (err: unknown) {
      console.error('Failed to load RBAC data:', err);
      setLoadError(err instanceof Error ? err.message : 'Unable to connect to security service.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derived filtered & sorted roles
  const filteredRoles = useMemo(() => {
    return roles
      .filter((r) => {
        const matchesSearch =
          searchTerm === '' ||
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.code && r.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
          r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.permissions.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesAccessLevel =
          selectedAccessLevel === 'ALL' || r.accessLevel === selectedAccessLevel;

        const matchesRoleType =
          selectedRoleType === 'ALL' ||
          (selectedRoleType === 'System' && r.isSystem) ||
          (selectedRoleType === 'Custom' && !r.isSystem);

        return matchesSearch && matchesAccessLevel && matchesRoleType;
      })
      .sort((a, b) => {
        if (sortBy === 'staff-desc') {
          return (b.userCount || 0) - (a.userCount || 0);
        }
        if (sortBy === 'perms-desc') {
          return b.permissions.length - a.permissions.length;
        }
        if (sortBy === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'recent') {
          return (b.lastModified || '').localeCompare(a.lastModified || '');
        }
        return 0;
      });
  }, [roles, searchTerm, selectedAccessLevel, selectedRoleType, sortBy]);

  // KPIs
  const privilegedRolesCount = useMemo(
    () => roles.filter((r) => r.accessLevel === 'Critical' || r.accessLevel === 'Elevated').length,
    [roles]
  );

  const dangerousPermsCount = useMemo(
    () => permissionsCatalog.filter((p) => p.isDangerous).length,
    [permissionsCatalog]
  );

  const twoFactorStaffCount = useMemo(
    () => staffMembers.filter((s) => s.twoFactorEnabled).length,
    [staffMembers]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedAccessLevel !== 'ALL') count++;
    if (selectedRoleType !== 'ALL') count++;
    if (searchTerm !== '') count++;
    return count;
  }, [selectedAccessLevel, selectedRoleType, searchTerm]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedAccessLevel('ALL');
    setSelectedRoleType('ALL');
    setSortBy('staff-desc');
    addToast('info', 'Filters Cleared', 'Displaying all security roles.');
  };

  // Handlers for Drawer & Modals
  const handleOpenDrawer = (role: AdminRolePermission) => {
    setDrawerRole(role);
    setIsDrawerOpen(true);
  };

  const handleOpenEditor = (role: AdminRolePermission) => {
    setEditorRole(role);
    setIsEditorOpen(true);
  };

  const handleOpenAssign = (role: AdminRolePermission) => {
    setAssignRole(role);
    setIsAssignModalOpen(true);
  };

  const handleSaveRole = async (roleId: string, updates: Partial<AdminRolePermission>) => {
    try {
      const updated = await adminService.updateRole(roleId, updates);
      setRoles((prev) => prev.map((r) => (r.id === roleId ? updated : r)));
      if (drawerRole && drawerRole.id === roleId) {
        setDrawerRole(updated);
      }
      addToast('success', 'Role Policy Updated', `Successfully updated access clearance for ${updated.name}.`);
      loadData(true);
    } catch (err: unknown) {
      addToast('error', 'Update Failed', err instanceof Error ? err.message : 'Could not save role changes.');
    }
  };

  const handleCreateRole = async (newRole: Partial<AdminRolePermission>) => {
    try {
      const created = await adminService.createRole(newRole);
      setRoles((prev) => [created, ...prev]);
      addToast('success', 'Security Role Created', `Role "${created.name}" is now active in RBAC registry.`);
      loadData(true);
    } catch (err: unknown) {
      addToast('error', 'Role Creation Failed', err instanceof Error ? err.message : 'Could not create role.');
    }
  };

  const handleDeleteRole = async (role: AdminRolePermission) => {
    if (!window.confirm(`Permanently delete custom role "${role.name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await adminService.deleteRole(role.id);
      setRoles((prev) => prev.filter((r) => r.id !== role.id));
      setIsDrawerOpen(false);
      addToast('success', 'Role Deleted', `Custom role "${role.name}" was removed from the system.`);
      loadData(true);
    } catch (err: unknown) {
      addToast('error', 'Deletion Prevented', err instanceof Error ? err.message : 'Cannot delete protected role.');
    }
  };

  const handleAssignStaff = async (staffId: string, roleId: string) => {
    try {
      const updatedStaff = await adminService.assignStaffRole(staffId, roleId);
      setStaffMembers((prev) => prev.map((s) => (s.id === staffId ? updatedStaff : s)));
      addToast('success', 'Staff Member Reassigned', `${updatedStaff.name} is now cleared as ${updatedStaff.roleName}.`);
      loadData(true);
    } catch (err: unknown) {
      addToast('error', 'Assignment Failed', err instanceof Error ? err.message : 'Could not reassign staff member.');
    }
  };

  const handleExportCSV = () => {
    try {
      const headers = ['Role Name', 'Code', 'Type', 'Access Level', 'Staff Count', 'Granted Permissions', 'Last Modified'];
      const rows = roles.map((r) => [
        `"${r.name}"`,
        `"${r.code || r.id}"`,
        `"${r.type || (r.isSystem ? 'System' : 'Custom')}"`,
        `"${r.accessLevel || 'Standard'}"`,
        r.userCount || 0,
        `"${r.permissions.join(', ')}"`,
        `"${r.lastModified || '2026-10-01'}"`,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `powergrid_rbac_matrix_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast('info', 'Export Successful', 'RBAC permission matrix exported to CSV file.');
    } catch {
      addToast('error', 'Export Error', 'Unable to generate CSV export.');
    }
  };

  if (isLoading) {
    return (
      <div className="pg-admin-roles">
        <RolesSkeleton />
      </div>
    );
  }

  if (loadError && roles.length === 0) {
    return (
      <div className="pg-admin-roles">
        <RolesErrorState message={loadError} onRetry={() => loadData()} />
      </div>
    );
  }

  return (
    <div className="pg-admin-roles">
      {/* PAGE HEADER */}
      <RolesHeader
        totalRoles={roles.length}
        activeStaffCount={staffMembers.length}
        isRefreshing={isRefreshing}
        onRefresh={() => loadData(true)}
        onExport={handleExportCSV}
        onCreateRole={() => setIsCreateModalOpen(true)}
        lastUpdated={lastUpdated}
      />

      {/* ACCESS SUMMARY KPIS */}
      <AccessSummary
        totalRoles={roles.length}
        activeStaff={staffMembers.length}
        privilegedRoles={privilegedRolesCount}
        permissionGroupsCount={6}
        dangerousPermissionsCount={dangerousPermsCount}
        unassignedStaff={0}
        onFilterPrivileged={() => setSelectedAccessLevel('Critical')}
      />

      {/* IDENTITY & ACCESS HEALTH POSTURE */}
      <AccessHealth
        totalRoles={roles.length}
        totalStaff={staffMembers.length}
        twoFactorStaffCount={twoFactorStaffCount}
        privilegedRolesCount={privilegedRolesCount}
      />

      {/* FILTER & TOOLBAR */}
      <RoleFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedAccessLevel={selectedAccessLevel}
        onAccessLevelChange={setSelectedAccessLevel}
        selectedRoleType={selectedRoleType}
        onRoleTypeChange={setSelectedRoleType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
        activeFilterCount={activeFilterCount}
        onResetFilters={handleResetFilters}
      />

      {/* ROLE DIRECTORY: CARDS OR TABLE */}
      {filteredRoles.length === 0 ? (
        <RolesEmptyState
          hasFilters={activeFilterCount > 0}
          onResetFilters={handleResetFilters}
          onCreateRole={() => setIsCreateModalOpen(true)}
        />
      ) : viewMode === 'cards' ? (
        <div className="pg-admin-roles__cards-grid">
          {filteredRoles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              staffMembers={staffMembers}
              onViewDetails={handleOpenDrawer}
              onEditRole={handleOpenEditor}
              onAssignStaff={handleOpenAssign}
            />
          ))}
        </div>
      ) : (
        <RoleTable
          roles={filteredRoles}
          staffMembers={staffMembers}
          onViewDetails={handleOpenDrawer}
          onEditRole={handleOpenEditor}
          onAssignStaff={handleOpenAssign}
        />
      )}

      {/* ROLE DETAILS DRAWER */}
      <RoleDetailsDrawer
        role={drawerRole}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        staffMembers={staffMembers}
        permissionsCatalog={permissionsCatalog}
        auditLogs={auditLogs}
        onEditRole={handleOpenEditor}
        onAssignStaff={handleOpenAssign}
        onCompareRole={() => {
          setIsDrawerOpen(false);
          setIsCompareModalOpen(true);
        }}
        onDeleteRole={handleDeleteRole}
        onReassignMember={() => {
          setIsDrawerOpen(false);
          setIsAssignModalOpen(true);
        }}
      />

      {/* ROLE EDITOR MODAL */}
      <RoleEditorModal
        role={editorRole}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveRole}
        permissionsCatalog={permissionsCatalog}
        staffMembers={staffMembers}
      />

      {/* CREATE ROLE MODAL */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateRole}
        existingRoles={roles}
        permissionsCatalog={permissionsCatalog}
      />

      {/* ASSIGN STAFF MODAL */}
      <AssignStaffModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        targetRole={assignRole}
        roles={roles}
        staffMembers={staffMembers}
        onAssign={handleAssignStaff}
      />

      {/* ROLE COMPARISON MODAL */}
      <RoleCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        roles={roles}
        initialRoleAId={drawerRole?.id}
        permissionsCatalog={permissionsCatalog}
      />

      {/* MOBILE BOTTOM SHEET FILTERS */}
      <RolesMobileFilters
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        selectedAccessLevel={selectedAccessLevel}
        onAccessLevelChange={setSelectedAccessLevel}
        selectedRoleType={selectedRoleType}
        onRoleTypeChange={setSelectedRoleType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleResetFilters}
        onApply={() => setIsMobileFiltersOpen(false)}
      />

      {/* TOAST NOTIFICATION CONTAINER */}
      <RolesToast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
export default AdminRolesPermissions;
