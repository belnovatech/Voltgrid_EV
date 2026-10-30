import React, { useState } from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { superAdminAuditService } from '../../services/superAdminAuditService';

export const CustomerProfileModal: React.FC = () => {
  const { selectedCustomerModal, closeCustomerModal } = useSuperAdmin();
  const [isPIIUnmasked, setIsPIIUnmasked] = useState<boolean>(false);

  if (!selectedCustomerModal) return null;

  const c = selectedCustomerModal;

  const handleTogglePII = () => {
    if (!isPIIUnmasked) {
      superAdminAuditService.logAction({
        action: 'Unmasked Sensitive Customer PII',
        actionType: 'CUSTOMER_DATA',
        module: 'Customers',
        targetResource: `${c.id} (${c.name})`,
        details: 'Decrypted customer phone number and email for executive verification.',
      });
      setIsPIIUnmasked(true);
    } else {
      setIsPIIUnmasked(false);
    }
  };

  const formatINR = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="sa-modal-backdrop" onClick={closeCustomerModal}>
      <div className="sa-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="sa-modal-header">
          <div>
            <h3 className="sa-modal-title">Customer Authorized Profile</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--sa-text-muted)' }}>
              Unique ID: <strong style={{ color: 'var(--sa-lime)' }}>{c.id}</strong> · Area: {c.areaName}
            </span>
          </div>
          <button type="button" className="sa-modal-close" onClick={closeCustomerModal}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="sa-modal-body">
          {/* Identity & Status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              background: 'var(--sa-bg-surface-elevated)',
              borderRadius: 'var(--sa-radius-md)',
              border: '1px solid var(--sa-border)',
            }}
          >
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                {c.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--sa-text-muted)', marginTop: 2 }}>
                Registered on {c.registrationDate} · Assigned Admin: <strong>{c.assignedAdminName}</strong>
              </div>
            </div>
            <span
              className={`sa-status-badge sa-status-badge--${c.status.toLowerCase()}`}
            >
              {c.status}
            </span>
          </div>

          {/* Privacy Protection Banner */}
          <div
            style={{
              padding: '12px 16px',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--sa-radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sa-indigo)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>
                  Privacy Controls (PII Masking Active)
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--sa-text-muted)' }}>
                  {isPIIUnmasked
                    ? 'Sensitive data currently unmasked. Action recorded in audit logs.'
                    : 'Personal phone numbers and contact emails are encrypted.'}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="sa-btn sa-btn-secondary sa-btn-sm"
              onClick={handleTogglePII}
            >
              {isPIIUnmasked ? 'Mask PII' : 'Unmask Contact Details'}
            </button>
          </div>

          {/* Contact Details */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
            }}
          >
            <div className="sa-card" style={{ padding: '12px 16px' }}>
              <span className="sa-field-label">Mobile Number</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginTop: 4 }}>
                {isPIIUnmasked ? c.phone : '•••• ••' + c.phone.slice(-4)}
              </span>
            </div>
            <div className="sa-card" style={{ padding: '12px 16px' }}>
              <span className="sa-field-label">Email Address</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginTop: 4 }}>
                {isPIIUnmasked
                  ? c.email
                  : c.email.slice(0, 3) + '••••@' + c.email.split('@')[1]}
              </span>
            </div>
          </div>

          {/* Vehicle & Energy Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
            }}
          >
            <div className="sa-card" style={{ padding: '14px' }}>
              <span className="sa-field-label">Vehicle Registered</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginTop: 4 }}>
                {c.vehicleModel}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--sa-cyan)', fontWeight: 700 }}>
                {c.vehiclePlate}
              </span>
            </div>
            <div className="sa-card" style={{ padding: '14px' }}>
              <span className="sa-field-label">Total Charging Sessions</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: 4 }}>
                {c.totalSessions}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--sa-text-muted)' }}>
                {c.energyConsumedKWh.toFixed(1)} kWh delivered
              </span>
            </div>
            <div className="sa-card" style={{ padding: '14px' }}>
              <span className="sa-field-label">Payment Balance Status</span>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: c.outstandingBalanceINR > 0 ? 'var(--sa-rose)' : 'var(--sa-emerald)',
                  marginTop: 4,
                }}
              >
                {c.outstandingBalanceINR > 0 ? formatINR(c.outstandingBalanceINR) : 'Settled (₹0)'}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--sa-text-muted)' }}>
                Status: {c.paymentStatus}
              </span>
            </div>
          </div>

          {/* Financial Summary */}
          <div
            style={{
              background: 'var(--sa-bg-surface-elevated)',
              border: '1px solid var(--sa-border)',
              borderRadius: 'var(--sa-radius-md)',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--sa-text-muted)' }}>
                Lifetime Collections Contributed
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--sa-lime)' }}>
                {formatINR(c.totalAmountPaidINR)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--sa-text-muted)' }}>
                Last Payment Recorded
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                {c.lastPaymentDate}
              </div>
            </div>
          </div>
        </div>

        <div className="sa-modal-footer">
          <button type="button" className="sa-btn sa-btn-secondary" onClick={closeCustomerModal}>
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
