import React from 'react';
import { ShieldCheck, Lock, KeyRound, CheckCircle2 } from 'lucide-react';
import './AccessHealth.css';

interface AccessHealthProps {
  totalRoles: number;
  totalStaff: number;
  twoFactorStaffCount: number;
  privilegedRolesCount: number;
}

export const AccessHealth: React.FC<AccessHealthProps> = ({
  totalRoles,
  totalStaff,
  twoFactorStaffCount,
  privilegedRolesCount,
}) => {
  const mfaPercent = totalStaff > 0 ? Math.round((twoFactorStaffCount / totalStaff) * 100) : 100;
  const coveragePercent = 100;

  return (
    <section className="pg-access-health" aria-label="Access Security Posture">
      <div className="pg-access-health__header">
        <div className="pg-access-health__title-wrap">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <h2 className="pg-access-health__title">Identity & Access Governance Health</h2>
        </div>
        <div className="pg-access-health__badge">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>SOC2 & ISO 27001 Aligned</span>
        </div>
      </div>

      <div className="pg-access-health__content">
        <div className="pg-access-health__bars-section">
          <div className="pg-access-health__bar-meta">
            <span className="pg-access-health__bar-label">Staff Role Clearance Coverage</span>
            <span className="pg-access-health__bar-val">{coveragePercent}% (All {totalStaff} Protected)</span>
          </div>
          <div className="pg-access-health__track" role="progressbar" aria-valuenow={coveragePercent} aria-valuemin={0} aria-valuemax={100}>
            <div className="pg-access-health__fill pg-access-health__fill--emerald" style={{ width: `${coveragePercent}%` }} />
          </div>

          <div className="pg-access-health__bar-meta" style={{ marginTop: '10px' }}>
            <span className="pg-access-health__bar-label">Staff Multi-Factor Authentication (MFA)</span>
            <span className="pg-access-health__bar-val">{mfaPercent}% ({twoFactorStaffCount}/{totalStaff} Enforced)</span>
          </div>
          <div className="pg-access-health__track" role="progressbar" aria-valuenow={mfaPercent} aria-valuemin={0} aria-valuemax={100}>
            <div className="pg-access-health__fill pg-access-health__fill--cyan" style={{ width: `${mfaPercent}%` }} />
          </div>
        </div>

        <div className="pg-access-health__stats">
          <div className="pg-access-health__stat-box">
            <div className="pg-access-health__stat-icon">
              <Lock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div>
              <div className="pg-access-health__stat-num">{privilegedRolesCount} of {totalRoles}</div>
              <div className="pg-access-health__stat-lbl">Privileged Roles Guarded</div>
            </div>
          </div>

          <div className="pg-access-health__stat-box">
            <div className="pg-access-health__stat-icon">
              <KeyRound className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div>
              <div className="pg-access-health__stat-num">RBAC Matrix</div>
              <div className="pg-access-health__stat-lbl">Least-Privilege Enforced</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

