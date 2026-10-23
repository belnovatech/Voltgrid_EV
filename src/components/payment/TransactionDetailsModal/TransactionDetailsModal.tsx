import React, { useRef } from 'react';
import { AuthoritativeLedgerRecord } from '../../../types/payment';
import './TransactionDetailsModal.css';

interface TransactionDetailsModalProps {
  transaction: AuthoritativeLedgerRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  transaction,
  isOpen,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !transaction) return null;

  const isCredit =
    transaction.type === 'recharge' ||
    transaction.type === 'credit' ||
    transaction.type === 'refund';

  const handlePrint = () => {
    window.print();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div
      className="vg-tx-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="vg-tx-modal-title"
    >
      <div className="vg-tx-modal-container">
        {/* Modal Header */}
        <div className="vg-tx-modal-header">
          <div className="vg-tx-modal-header-left">
            <span className="vg-tx-modal-badge">Transaction Details</span>
            <h2 id="vg-tx-modal-title" className="vg-tx-modal-title">
              {transaction.referenceId || transaction.id}
            </h2>
          </div>
          <button
            type="button"
            className="vg-tx-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Printable Invoice / Details Content */}
        <div className="vg-tx-modal-body" ref={printRef}>
          {/* Main Hero Amount Card */}
          <div className="vg-tx-hero-card">
            <div className="vg-tx-hero-amount-wrap">
              <span className={`vg-tx-hero-amount ${isCredit ? 'vg-tx-hero-amount--credit' : 'vg-tx-hero-amount--debit'}`}>
                {isCredit ? '+' : '-'}₹{transaction.amountINR.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className="vg-tx-status-pill vg-tx-status-pill--success">
                ✓ {transaction.status}
              </span>
            </div>
            <p className="vg-tx-hero-subtitle">{transaction.title} · {transaction.description}</p>
          </div>

          {/* Key Metadata Grid */}
          <div className="vg-tx-meta-grid">
            <div className="vg-tx-meta-item">
              <span className="vg-tx-meta-label">Transaction ID</span>
              <div className="vg-tx-copyable-val">
                <span className="vg-tx-meta-val">{transaction.id}</span>
                <button
                  type="button"
                  className="vg-tx-copy-btn"
                  title="Copy ID"
                  onClick={() => copyToClipboard(transaction.id)}
                >
                  📋
                </button>
              </div>
            </div>

            <div className="vg-tx-meta-item">
              <span className="vg-tx-meta-label">Gateway Reference</span>
              <span className="vg-tx-meta-val">
                {transaction.gatewayReferenceId || 'Internal Ledger'}
              </span>
            </div>

            <div className="vg-tx-meta-item">
              <span className="vg-tx-meta-label">Date & Time</span>
              <span className="vg-tx-meta-val">{transaction.date}</span>
            </div>

            <div className="vg-tx-meta-item">
              <span className="vg-tx-meta-label">Payment Method</span>
              <span className="vg-tx-meta-val">{transaction.paymentMethod}</span>
            </div>

            <div className="vg-tx-meta-item">
              <span className="vg-tx-meta-label">Balance Before</span>
              <span className="vg-tx-meta-val">₹{transaction.balanceBeforeINR?.toFixed(2) ?? '—'}</span>
            </div>

            <div className="vg-tx-meta-item">
              <span className="vg-tx-meta-label">Balance After</span>
              <span className="vg-tx-meta-val vg-tx-meta-val--highlight">
                ₹{transaction.balanceAfterINR.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Service / Charging Details if available */}
          {transaction.metadata && (transaction.metadata.stationName || transaction.metadata.kwh) && (
            <div className="vg-tx-service-box">
              <h4 className="vg-tx-service-title">Charging Session Breakdown</h4>
              <div className="vg-tx-service-grid">
                {transaction.metadata.stationName && (
                  <div className="vg-tx-service-row">
                    <span>Charging Station</span>
                    <strong>{transaction.metadata.stationName}</strong>
                  </div>
                )}
                {transaction.metadata.chargerId && (
                  <div className="vg-tx-service-row">
                    <span>Charger ID</span>
                    <strong>{transaction.metadata.chargerId}</strong>
                  </div>
                )}
                {transaction.metadata.kwh && (
                  <div className="vg-tx-service-row">
                    <span>Energy Delivered</span>
                    <strong>{transaction.metadata.kwh} kWh</strong>
                  </div>
                )}
                {transaction.metadata.duration && (
                  <div className="vg-tx-service-row">
                    <span>Session Duration</span>
                    <strong>{transaction.metadata.duration}</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tax Invoice Info Box */}
          <div className="vg-tx-invoice-card">
            <div className="vg-tx-invoice-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src="/eway-logo.png"
                  alt="Eway to Your EVs"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <span className="vg-tx-inv-label">EWAY TO YOUR EVS · GST TAX INVOICE</span>
                  <p className="vg-tx-inv-num">{transaction.invoiceNumber}</p>
                </div>
              </div>
              <div className="vg-tx-gst-badge">GSTIN: 37AAACB2194Q1Z5</div>
            </div>

            <div className="vg-tx-inv-table">
              <div className="vg-tx-inv-tr">
                <span>Base Charge</span>
                <span>₹{(transaction.amountINR * 0.82).toFixed(2)}</span>
              </div>
              <div className="vg-tx-inv-tr">
                <span>CGST (9%)</span>
                <span>₹{(transaction.amountINR * 0.09).toFixed(2)}</span>
              </div>
              <div className="vg-tx-inv-tr">
                <span>SGST (9%)</span>
                <span>₹{(transaction.amountINR * 0.09).toFixed(2)}</span>
              </div>
              <div className="vg-tx-inv-tr vg-tx-inv-tr--total">
                <span>Total Paid (Inclusive of Taxes)</span>
                <span>₹{transaction.amountINR.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="vg-tx-modal-footer">
          <button type="button" className="vg-tx-btn-secondary" onClick={handlePrint}>
            <span>🖨️ Print / Download Tax Invoice</span>
          </button>
          <button type="button" className="vg-tx-btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
