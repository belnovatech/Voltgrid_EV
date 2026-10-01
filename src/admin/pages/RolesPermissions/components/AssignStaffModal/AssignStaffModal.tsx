import React, { useState } from 'react';
import { X, Search, Users, UserCheck, ShieldCheck } from 'lucide-react';
import { AdminRolePermission, RoleStaffMember } from '../../../../types/admin';
import './AssignStaffModal.css';

interface AssignStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: AdminRolePermission | null;
  roles: AdminRolePermission[];
  staffMembers: RoleStaffMember[];
  onAssign: (staffId: string, roleId: string) => Promise<void>;
}

export const AssignStaffModal: React.FC<AssignStaffModalProps> = ({
  isOpen,
  onClose,
  targetRole,
  roles,
  staffMembers,
  onAssign,
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(targetRole ? targetRole.id : roles[0]?.id || '');
  const [searchStaff, setSearchStaff] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (targetRole) {
      setSelectedRoleId(targetRole.id);
    }
  }, [targetRole, isOpen]);

  if (!isOpen) return null;

  const currentRole = roles.find((r) => r.id === selectedRoleId) || targetRole;

  const filteredStaff = staffMembers.filter(
    (s) =>
      searchStaff === '' ||
      s.name.toLowerCase().includes(searchStaff.toLowerCase()) ||
      s.email.toLowerCase().includes(searchStaff.toLowerCase()) ||
      s.department.toLowerCase().includes(searchStaff.toLowerCase())
  );

  const handleConfirmAssignment = async () => {
    if (!selectedStaffId || !selectedRoleId) return;
    setIsSubmitting(true);
    try {
      await onAssign(selectedStaffId, selectedRoleId);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pg-modal-overlay" onClick={onClose}>
      <div
        className="pg-assign-staff-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pg-assign-title"
      >
        <div className="pg-assign-staff-modal__header">
          <div>
            <h3 id="pg-assign-title" className="pg-assign-staff-modal__title">
              Assign Staff Member to Role
            </h3>
            <p className="pg-assign-staff-modal__subtitle">
              Grant or reassign administrative security clearance to team members.
            </p>
          </div>
          <button
            type="button"
            className="pg-assign-staff-modal__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="pg-assign-staff-modal__body">
          {/* TARGET ROLE SELECTOR */}
          <div className="pg-form-group" style={{ marginBottom: '12px' }}>
            <label className="pg-form-label">Select Target Role Clearance</label>
            <select
              className="pg-form-select"
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.accessLevel} · {r.permissions.length} perms)
                </option>
              ))}
            </select>
          </div>

          {currentRole && (
            <div className="pg-assign-role-preview">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div>
                <div className="pg-assign-role-preview__name">{currentRole.name}</div>
                <div className="pg-assign-role-preview__desc">{currentRole.description}</div>
              </div>
            </div>
          )}

          {/* STAFF SEARCH & LIST */}
          <div className="pg-form-group">
            <label className="pg-form-label">Select Employee</label>
            <div className="pg-assign-search-box">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                className="pg-assign-search-input"
                placeholder="Search employee name, email or zone..."
                value={searchStaff}
                onChange={(e) => setSearchStaff(e.target.value)}
              />
            </div>
          </div>

          <div className="pg-assign-staff-list">
            {filteredStaff.map((staff) => {
              const isSelected = selectedStaffId === staff.id;
              const isAlreadyInRole = staff.roleId === selectedRoleId;

              return (
                <div
                  key={staff.id}
                  className={`pg-assign-staff-item ${isSelected ? 'pg-assign-staff-item--selected' : ''}`}
                  onClick={() => setSelectedStaffId(staff.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="pg-assign-staff-avatar">
                    {staff.avatar || staff.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="pg-assign-staff-meta">
                    <div className="pg-assign-staff-name-row">
                      <span className="pg-assign-staff-name">{staff.name}</span>
                      {isAlreadyInRole && (
                        <span className="pg-assign-staff-current-tag">Already in this Role</span>
                      )}
                    </div>
                    <div className="pg-assign-staff-email">{staff.email} · {staff.department}</div>
                    <div className="pg-assign-staff-current-role">Current: <strong>{staff.roleName}</strong></div>
                  </div>
                  <div className="pg-assign-staff-radio">
                    {isSelected ? (
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <div className="pg-radio-circle" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pg-assign-staff-modal__footer">
          <button
            type="button"
            className="pg-btn pg-btn--secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="pg-btn pg-btn--primary"
            onClick={handleConfirmAssignment}
            disabled={!selectedStaffId || isSubmitting}
          >
            <Users className="w-3.5 h-3.5 mr-1 inline" />
            {isSubmitting ? 'Assigning...' : 'Confirm Role Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
};

