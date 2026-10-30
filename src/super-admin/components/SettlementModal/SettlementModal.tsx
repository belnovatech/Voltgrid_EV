import React, { useState } from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import { superAdminDataService } from '../../services/superAdminDataService';
import { superAdminAuditService } from '../../services/superAdminAuditService';

export const SettlementModal: React.FC = () => {
  const { selectedSettlementModal, closeSettlementModal, refreshData } = useSuperAdmin();

  const [utrNumber, setUtrNumber] = useState<string>('');
  const [amountInput, setAmountInput] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!selectedSettlementModal) return null;

  const s = selectedSettlementModal;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!utrNumber.trim() || utrNumber.length < 8) {
      setError('Please provide a valid 8-16 character Bank UTR reference number.');
      return;
    }

    const parsedAmount = parseFloat(amountInput) || s.outstandingBalanceINR;
    if (parsedAmount <= 0) {
      setError('Settlement amount must be greater than zero.');
      return;
    }

    if (parsedAmount > s.outstandingBalanceINR) {
      setError(`Amount cannot exceed the current outstanding balance of ₹${s.outstandingBalanceINR.toLocaleString()}.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await superAdminDataService.verifySettlement(s.id, utrNumber.trim().toUpperCase(), parsedAmount, notes.trim());

      superAdminAuditService.logAction({
        action: 'Verified Business Settlement Remittance',
        actionType: 'SETTLEMENT',
        module: 'Settlements',
        targetResource: `${s.batchNumber} (${s.adminName})`,
        details: `Recorded Bank UTR #${utrNumber.toUpperCase()} for ₹${parsedAmount.toLocaleString()}. Reconciled with business bank ledger.`,
      });

      await refreshData();
      closeSettlementModal();
    } catch (err: any) {
      setError(err?.message || 'Failed to verify settlement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatINR = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="sa-modal-backdrop" onClick={closeSettlementModal}>
      <div className="sa-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="sa-modal-header">
          <div>
            <h3 className="sa-modal-title">Verify & Process Business Settlement</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--sa-text-muted)' }}>
              Batch: <strong style={{ color: 'var(--sa-lime)' }}>{s.batchNumber}</strong> · Admin: {s.adminName}
            </span>
          </div>
          <button type="button" className="sa-modal-close" onClick={closeSettlementModal}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleVerify}>
          <div className="sa-modal-body">
            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  borderRadius: 'var(--sa-radius-md)',
                  color: 'var(--sa-rose)',
                  fontSize: '0.8rem',
                }}
              >
                {error}
              </div>
            )}

            {/* Reconciliation Snapshot */}
            <div
              style={{
                background: 'var(--sa-bg-surface-elevated)',
                border: '1px solid var(--sa-border)',
                borderRadius: 'var(--sa-radius-md)',
                padding: '16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
              }}
            >
              <div>
                <span className="sa-field-label">Gross Collections</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', display: 'block', marginTop: 4 }}>
                  {formatINR(s.grossCollectionsINR)}
                </span>
              </div>
              <div>
                <span className="sa-field-label">Net Payable</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--sa-cyan)', display: 'block', marginTop: 4 }}>
                  {formatINR(s.netAmountPayableToBusinessINR)}
                </span>
              </div>
              <div>
                <span className="sa-field-label">Outstanding Balance</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--sa-amber)', display: 'block', marginTop: 4 }}>
                  {formatINR(s.outstandingBalanceINR)}
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="sa-field-group">
              <label htmlFor="sa-utr-input" className="sa-field-label">
                <span>Bank UTR Reference Number</span>
                <span style={{ color: 'var(--sa-lime)' }}>*</span>
              </label>
              <input
                id="sa-utr-input"
                type="text"
                className="sa-input"
                placeholder="e.g. SBIN0048192801 or HDFC0019283711"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                required
              />
            </div>

            <div className="sa-field-group">
              <label htmlFor="sa-amt-input" className="sa-field-label">
                <span>Verified Remittance Amount (₹)</span>
                <span style={{ color: 'var(--sa-text-dim)' }}>(Leave empty to settle full balance)</span>
              </label>
              <input
                id="sa-amt-input"
                type="number"
                className="sa-input"
                placeholder={`Full remaining balance: ${s.outstandingBalanceINR}`}
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
              />
            </div>

            <div className="sa-field-group">
              <label htmlFor="sa-notes-input" className="sa-field-label">
                <span>Auditor Verification Notes</span>
              </label>
              <textarea
                id="sa-notes-input"
                className="sa-input"
                rows={2}
                placeholder="e.g. Verified with SBI corporate bank account statement on 28 Oct 2026."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="sa-modal-footer">
            <button
              type="button"
              className="sa-btn sa-btn-secondary"
              onClick={closeSettlementModal}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="sa-btn sa-btn-primary"
              disabled={isSubmitting || s.outstandingBalanceINR === 0}
            >
              {isSubmitting ? 'Recording Settlement...' : 'Authorize & Verify Settlement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
