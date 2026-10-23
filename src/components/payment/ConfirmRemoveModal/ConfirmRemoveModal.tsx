import React from 'react';
import { SavedPaymentMethod } from '../../../types/payment';
import './ConfirmRemoveModal.css';

interface ConfirmRemoveModalProps {
  isOpen: boolean;
  method: SavedPaymentMethod | null;
  canRemoveDefault: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmRemoveModal: React.FC<ConfirmRemoveModalProps> = ({
  isOpen,
  method,
  canRemoveDefault,
  onConfirm,
  onClose,
}) => {
  if (!isOpen || !method) return null;

  const isDefaultMethod = method.isDefault;
  const isBlocked = isDefaultMethod && !canRemoveDefault;

  return (
    <div
      className="eway-crm-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="eway-crm-title"
    >
      <div className="eway-crm-modal">
        <div className="eway-crm-header">
          <div className="eway-crm-icon-wrap">
            <span>🗑️</span>
          </div>
          <div>
            <h3 id="eway-crm-title" className="eway-crm-title">
              Remove Payment Method
            </h3>
            <p className="eway-crm-subtitle">Confirm removal from your Eway account</p>
          </div>
        </div>

        <div className="eway-crm-body">
          <div className="eway-crm-card-preview">
            <span className="eway-crm-card-icon">
              {method.type === 'card' ? '💳' : '📱'}
            </span>
            <div className="eway-crm-card-info">
              <span className="eway-crm-card-title">{method.title}</span>
              <span className="eway-crm-card-sub">{method.subtitle}</span>
            </div>
            {method.isDefault && (
              <span className="eway-crm-default-badge">DEFAULT</span>
            )}
          </div>

          {isBlocked ? (
            <div className="eway-crm-alert eway-crm-alert--warning">
              <span className="eway-crm-alert-icon">⚠️</span>
              <p>
                <strong>Cannot Remove Default Method:</strong> This is currently set as your default
                charging payment method. Please designate another saved payment method as default
                first.
              </p>
            </div>
          ) : (
            <p className="eway-crm-text">
              Are you sure you want to remove this saved payment method? You will need to re-enter
              its details if you wish to use it again for instant EV charging sessions.
            </p>
          )}
        </div>

        <div className="eway-crm-footer">
          <button type="button" className="eway-crm-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          {!isBlocked && (
            <button
              type="button"
              className="eway-crm-btn-delete"
              onClick={onConfirm}
              id="confirm-remove-payment-method-btn"
            >
              Yes, Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmRemoveModal;
