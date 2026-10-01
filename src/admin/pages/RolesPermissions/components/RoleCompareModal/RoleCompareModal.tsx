import React, { useState } from 'react';
import { X, GitCompare, Check, Minus, AlertTriangle } from 'lucide-react';
import { AdminRolePermission, PermissionDefinition } from '../../../../types/admin';
import './RoleCompareModal.css';

interface RoleCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: AdminRolePermission[];
  initialRoleAId?: string;
  initialRoleBId?: string;
  permissionsCatalog: PermissionDefinition[];
}

export const RoleCompareModal: React.FC<RoleCompareModalProps> = ({
  isOpen,
  onClose,
  roles,
  initialRoleAId,
  initialRoleBId,
  permissionsCatalog,
}) => {
  const [roleAId, setRoleAId] = useState<string>(initialRoleAId || roles[0]?.id || '');
  const [roleBId, setRoleBId] = useState<string>(
    initialRoleBId || (roles.length > 1 ? roles[1].id : roles[0]?.id || '')
  );

  React.useEffect(() => {
    if (initialRoleAId) setRoleAId(initialRoleAId);
    if (initialRoleBId) setRoleBId(initialRoleBId);
  }, [initialRoleAId, initialRoleBId, isOpen]);

  if (!isOpen) return null;

  const roleA = roles.find((r) => r.id === roleAId) || roles[0];
  const roleB = roles.find((r) => r.id === roleBId) || (roles[1] || roles[0]);

  const categories = ['Grid Operations', 'Maintenance', 'Finance', 'Users', 'Security', 'Reporting'] as const;

  return (
    <div className="pg-modal-overlay" onClick={onClose}>
      <div
        className="pg-compare-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pg-compare-title"
      >
        <div className="pg-compare-modal__header">
          <div className="pg-compare-modal__title-wrap">
            <GitCompare className="w-4 h-4 text-indigo-500" />
            <div>
              <h3 id="pg-compare-title" className="pg-compare-modal__title">
                Role Permission Matrix Comparison
              </h3>
              <p className="pg-compare-modal__subtitle">
                Compare granted capabilities side-by-side to identify privilege variance.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="pg-compare-modal__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ROLE PICKERS HEADER */}
        <div className="pg-compare-selectors">
          <div className="pg-compare-col-header">
            <label className="pg-compare-lbl">First Role</label>
            <select
              className="pg-compare-select"
              value={roleAId}
              onChange={(e) => setRoleAId(e.target.value)}
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.permissions.length} perms)
                </option>
              ))}
            </select>
          </div>

          <div className="pg-compare-col-header">
            <label className="pg-compare-lbl">Second Role</label>
            <select
              className="pg-compare-select"
              value={roleBId}
              onChange={(e) => setRoleBId(e.target.value)}
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.permissions.length} perms)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* COMPARISON BODY */}
        <div className="pg-compare-body">
          {categories.map((category) => {
            const catPerms = permissionsCatalog.filter((p) => p.category === category);
            return (
              <div key={category} className="pg-compare-cat-group">
                <div className="pg-compare-cat-heading">{category}</div>
                <div className="pg-compare-table">
                  {catPerms.map((perm) => {
                    const hasA = roleA.permissions.includes(perm.code);
                    const hasB = roleB.permissions.includes(perm.code);
                    const isDiff = hasA !== hasB;

                    return (
                      <div
                        key={perm.id}
                        className={`pg-compare-row ${isDiff ? 'pg-compare-row--diff' : ''}`}
                      >
                        <div className="pg-compare-cell pg-compare-cell--meta">
                          <span className="pg-compare-perm-name">{perm.name}</span>
                          <span className="pg-compare-perm-code">{perm.code}</span>
                          {perm.isDangerous && (
                            <span className="pg-compare-danger-pill">
                              <AlertTriangle className="w-2.5 h-2.5 inline mr-1" /> High Impact
                            </span>
                          )}
                        </div>

                        <div className="pg-compare-cell pg-compare-cell--status">
                          {hasA ? (
                            <div className="pg-compare-check pg-compare-check--granted">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Granted</span>
                            </div>
                          ) : (
                            <div className="pg-compare-check pg-compare-check--none">
                              <Minus className="w-3 h-3 text-slate-300" />
                              <span>Denied</span>
                            </div>
                          )}
                        </div>

                        <div className="pg-compare-cell pg-compare-cell--status">
                          {hasB ? (
                            <div className="pg-compare-check pg-compare-check--granted">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Granted</span>
                            </div>
                          ) : (
                            <div className="pg-compare-check pg-compare-check--none">
                              <Minus className="w-3 h-3 text-slate-300" />
                              <span>Denied</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pg-compare-modal__footer">
          <button type="button" className="pg-btn pg-btn--primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

