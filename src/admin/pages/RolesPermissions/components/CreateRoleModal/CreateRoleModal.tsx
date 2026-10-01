import React, { useState } from 'react';
import { X, Plus, Shield, CheckSquare, Square } from 'lucide-react';
import { AdminRolePermission, PermissionDefinition } from '../../../../types/admin';
import './CreateRoleModal.css';

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newRole: Partial<AdminRolePermission>) => Promise<void>;
  existingRoles: AdminRolePermission[];
  permissionsCatalog: PermissionDefinition[];
}

export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  existingRoles,
  permissionsCatalog,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [accessLevel, setAccessLevel] = useState<AdminRolePermission['accessLevel']>('Operational');
  const [templateRoleId, setTemplateRoleId] = useState<string>('blank');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'VIEW_ZONES',
    'VIEW_SESSIONS',
    'VIEW_REPORTS',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTemplateChange = (roleId: string) => {
    setTemplateRoleId(roleId);
    if (roleId === 'blank') {
      setSelectedPermissions(['VIEW_ZONES', 'VIEW_SESSIONS']);
    } else {
      const found = existingRoles.find((r) => r.id === roleId);
      if (found) {
        setSelectedPermissions([...found.permissions]);
        setAccessLevel(found.accessLevel || 'Operational');
      }
    }
  };

  const togglePermission = (code: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(code) ? prev.filter((p) => p !== code) : [...prev, code]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please provide a descriptive role title.');
      return;
    }
    if (selectedPermissions.length === 0) {
      setFormError('Please grant at least one platform permission.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      await onCreate({
        name: name.trim(),
        description: description.trim() || `Custom administrative clearance for ${name.trim()}.`,
        accessLevel,
        type: 'Custom',
        permissions: selectedPermissions,
        isSystem: false,
        isProtected: false,
        status: 'Active',
      });
      setName('');
      setDescription('');
      onClose();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Unable to create role.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pg-modal-overlay" onClick={onClose}>
      <div
        className="pg-create-role-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pg-create-role-title"
      >
        <div className="pg-create-role-modal__header">
          <div className="pg-create-role-modal__header-title-wrap">
            <div className="pg-create-role-modal__icon-wrap">
              <Shield className="w-4 h-4 text-lime-400" />
            </div>
            <div>
              <h3 id="pg-create-role-title" className="pg-create-role-modal__title">
                Create Custom Security Role
              </h3>
              <p className="pg-create-role-modal__subtitle">
                Define a tailored role-based access policy and assign platform capabilities.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="pg-create-role-modal__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pg-create-role-modal__form">
          <div className="pg-create-role-modal__body">
            {formError && (
              <div className="pg-create-role-modal__error-alert">
                {formError}
              </div>
            )}

            <div className="pg-create-role-modal__grid">
              <div className="pg-form-group">
                <label className="pg-form-label">
                  Role Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  className="pg-form-input"
                  placeholder="e.g. Regional Fleet Coordinator"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="pg-form-group">
                <label className="pg-form-label">Clone From Template</label>
                <select
                  className="pg-form-select"
                  value={templateRoleId}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                >
                  <option value="blank">Blank Policy (Minimal)</option>
                  {existingRoles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.permissions.length} perms)
                    </option>
                  ))}
                </select>
              </div>

              <div className="pg-form-group">
                <label className="pg-form-label">Access Clearance Level</label>
                <select
                  className="pg-form-select"
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value as AdminRolePermission['accessLevel'])}
                >
                  <option value="Operational">Operational Access</option>
                  <option value="Elevated">Elevated Clearance</option>
                  <option value="Audit">Audit & Governance</option>
                  <option value="Critical">Critical (System-Wide)</option>
                </select>
              </div>

              <div className="pg-form-group pg-form-group--full">
                <label className="pg-form-label">Policy Scope & Purpose</label>
                <textarea
                  className="pg-form-textarea"
                  rows={2}
                  placeholder="Describe the operational boundaries and duties..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="pg-create-role-modal__perms-section">
              <div className="pg-create-role-modal__perms-header">
                <span className="pg-create-role-modal__perms-title">
                  Select Granted Permissions ({selectedPermissions.length} selected)
                </span>
              </div>

              <div className="pg-create-role-modal__perms-grid">
                {permissionsCatalog.map((perm) => {
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
                        <span className="pg-perm-check-code">{perm.category} · {perm.code}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pg-create-role-modal__footer">
            <button
              type="button"
              className="pg-btn pg-btn--secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pg-btn pg-btn--primary"
              disabled={isSubmitting}
            >
              <Plus className="w-3.5 h-3.5 mr-1 inline" />
              {isSubmitting ? 'Creating Role...' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

