import React, { useState, useEffect } from 'react';
import { X, Search, ShieldAlert, CheckSquare, Square } from 'lucide-react';
import { AdminRolePermission, PermissionDefinition, RoleStaffMember } from '../../../../types/admin';
import './RoleEditorModal.css';

interface RoleEditorModalProps {
  role: AdminRolePermission | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleId: string, updates: Partial<AdminRolePermission>) => Promise<void>;
  permissionsCatalog: PermissionDefinition[];
  staffMembers: RoleStaffMember[];
}

export const RoleEditorModal: React.FC<RoleEditorModalProps> = ({
  role,
  isOpen,
  onClose,
  onSave,
  permissionsCatalog,
  staffMembers,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [accessLevel, setAccessLevel] = useState<AdminRolePermission['accessLevel']>('Operational');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmStep, setShowConfirmStep] = useState(false);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description);
      setAccessLevel(role.accessLevel || 'Operational');
      setSelectedPermissions([...role.permissions]);
      setShowConfirmStep(false);
      setSearchQuery('');
    }
  }, [role, isOpen]);

  if (!isOpen || !role) return null;

  const roleStaff = staffMembers.filter((s) => s.roleId === role.id);
  const originalPermsSet = new Set(role.permissions);
  const currentPermsSet = new Set(selectedPermissions);

  const addedPerms = selectedPermissions.filter((p: string) => !originalPermsSet.has(p));
  const removedPerms = role.permissions.filter((p: string) => !currentPermsSet.has(p));

  const categories = ['Grid Operations', 'Maintenance', 'Finance', 'Users', 'Security', 'Reporting'] as const;

  const togglePermission = (code: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(code) ? prev.filter((p) => p !== code) : [...prev, code]
    );
  };

  const handleSelectAllCategory = (category: string) => {
    const catPermCodes = permissionsCatalog.filter((p) => p.category === category).map((p) => p.code);
    setSelectedPermissions((prev) => Array.from(new Set([...prev, ...catPermCodes])));
  };

  const handleClearCategory = (category: string) => {
    const catPermCodes = new Set(permissionsCatalog.filter((p) => p.category === category).map((p) => p.code));
    setSelectedPermissions((prev) => prev.filter((p) => !catPermCodes.has(p)));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSave(role.id, {
        name,
        description,
        accessLevel,
        permissions: selectedPermissions,
      });
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
        className="pg-role-editor-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pg-editor-title"
      >
        <div className="pg-role-editor-modal__header">
          <div>
            <div className="pg-role-editor-modal__eyebrow">POLICY CONFIGURATION</div>
            <h3 id="pg-editor-title" className="pg-role-editor-modal__title">
              Edit Role: {role.name}
            </h3>
          </div>
          <button
            type="button"
            className="pg-role-editor-modal__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!showConfirmStep ? (
          <div className="pg-role-editor-modal__content">
            {/* ROLE METADATA */}
            <div className="pg-role-editor-modal__meta-grid">
              <div className="pg-form-group">
                <label className="pg-form-label">Role Name</label>
                <input
                  type="text"
                  className="pg-form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={role.isProtected}
                />
              </div>

              <div className="pg-form-group">
                <label className="pg-form-label">Clearance Level</label>
                <select
                  className="pg-form-select"
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value as AdminRolePermission['accessLevel'])}
                  disabled={role.isProtected}
                >
                  <option value="Critical">Critical</option>
                  <option value="Elevated">Elevated</option>
                  <option value="Operational">Operational</option>
                  <option value="Audit">Audit</option>
                </select>
              </div>

              <div className="pg-form-group pg-form-group--full">
                <label className="pg-form-label">Policy Description</label>
                <textarea
                  className="pg-form-textarea"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* PERMISSION CHECKLIST */}
            <div className="pg-role-editor-modal__perms-section">
              <div className="pg-role-editor-modal__perms-bar">
                <div>
                  <h4 className="pg-role-editor-modal__section-heading">Granted Capabilities Matrix</h4>
                  <span className="pg-role-editor-modal__perms-count">
                    {selectedPermissions.length} of {permissionsCatalog.length} active
                  </span>
                </div>

                <div className="pg-role-editor-modal__search-wrap">
                  <Search className="w-3 h-3 text-slate-400" />
                  <input
                    type="text"
                    className="pg-role-editor-modal__search-input"
                    placeholder="Search permissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="pg-role-editor-modal__cat-list">
                {categories.map((category) => {
                  const catPerms = permissionsCatalog.filter(
                    (p) =>
                      p.category === category &&
                      (searchQuery === '' ||
                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.code.toLowerCase().includes(searchQuery.toLowerCase()))
                  );
                  if (catPerms.length === 0) return null;

                  const allCatSelected = catPerms.every((p) => selectedPermissions.includes(p.code));

                  return (
                    <div key={category} className="pg-role-editor-modal__cat-box">
                      <div className="pg-role-editor-modal__cat-top">
                        <span className="pg-role-editor-modal__cat-title">{category}</span>
                        <div className="pg-role-editor-modal__cat-actions">
                          <button
                            type="button"
                            className="pg-cat-btn"
                            onClick={() => (allCatSelected ? handleClearCategory(category) : handleSelectAllCategory(category))}
                          >
                            {allCatSelected ? 'Clear All' : 'Select All'}
                          </button>
                        </div>
                      </div>

                      <div className="pg-role-editor-modal__perm-grid">
                        {catPerms.map((perm) => {
                          const isChecked = selectedPermissions.includes(perm.code);
                          return (
                            <label
                              key={perm.id}
                              className={`pg-perm-check-item ${isChecked ? 'pg-perm-check-item--checked' : ''}`}
                            >
                              <input
                                type="checkbox"
                                className="pg-perm-check-input"
                                checked={isChecked}
                                onChange={() => togglePermission(perm.code)}
                              />
                              <div className="pg-perm-check-box">
                                {isChecked ? (
                                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Square className="w-3.5 h-3.5 text-slate-300" />
                                )}
                              </div>
                              <div className="pg-perm-check-label">
                                <div className="pg-perm-check-title-row">
                                  <span className="pg-perm-check-name">{perm.name}</span>
                                  {perm.isDangerous && (
                                    <span className="pg-perm-check-danger">High Impact</span>
                                  )}
                                </div>
                                <span className="pg-perm-check-code">{perm.code}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* CONFIRMATION / IMPACT REVIEW STEP */
          <div className="pg-role-editor-modal__content pg-role-editor-modal__confirm-view">
            <div className="pg-confirm-alert">
              <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <h4 className="pg-confirm-alert__title">Review Access Clearance Impact</h4>
                <p className="pg-confirm-alert__desc">
                  You are about to modify authorization boundaries for <strong>{role.name}</strong>. This policy update will immediately apply to all assigned staff members.
                </p>
              </div>
            </div>

            <div className="pg-impact-grid">
              <div className="pg-impact-card">
                <span className="pg-impact-card__val">{roleStaff.length}</span>
                <span className="pg-impact-card__lbl">Active Staff Affected</span>
              </div>
              <div className="pg-impact-card">
                <span className="pg-impact-card__val text-emerald-600">+{addedPerms.length}</span>
                <span className="pg-impact-card__lbl">Permissions Added</span>
              </div>
              <div className="pg-impact-card">
                <span className="pg-impact-card__val text-rose-600">-{removedPerms.length}</span>
                <span className="pg-impact-card__lbl">Permissions Revoked</span>
              </div>
            </div>

            {addedPerms.length > 0 && (
              <div className="pg-impact-list-box">
                <div className="pg-impact-list-title text-emerald-700">Capabilities to be Added (+{addedPerms.length}):</div>
                <div className="pg-impact-pills">
                  {addedPerms.map((p: string) => (
                    <span key={p} className="pg-impact-pill pg-impact-pill--add">+{p}</span>
                  ))}
                </div>
              </div>
            )}

            {removedPerms.length > 0 && (
              <div className="pg-impact-list-box">
                <div className="pg-impact-list-title text-rose-700">Capabilities to be Revoked (-{removedPerms.length}):</div>
                <div className="pg-impact-pills">
                  {removedPerms.map((p: string) => (
                    <span key={p} className="pg-impact-pill pg-impact-pill--remove">-{p}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODAL FOOTER */}
        <div className="pg-role-editor-modal__footer">
          {!showConfirmStep ? (
            <>
              <button type="button" className="pg-btn pg-btn--secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="pg-btn pg-btn--primary"
                onClick={() => setShowConfirmStep(true)}
              >
                Review Changes ({addedPerms.length + removedPerms.length} updates)
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="pg-btn pg-btn--secondary"
                onClick={() => setShowConfirmStep(false)}
                disabled={isSubmitting}
              >
                Back to Edit
              </button>
              <button
                type="button"
                className="pg-btn pg-btn--primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving Policy...' : 'Confirm & Apply Policy'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

