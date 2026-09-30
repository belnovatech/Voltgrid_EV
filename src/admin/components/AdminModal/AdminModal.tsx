import React, { useEffect } from 'react';
import './AdminModal.css';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '560px',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="pg-admin-modal-overlay" onClick={onClose}>
      <div
        className="pg-admin-modal"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pg-admin-modal__header">
          <h3 className="pg-admin-modal__title">{title}</h3>
          <button
            type="button"
            className="pg-admin-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="pg-admin-modal__content">{children}</div>
        {footer && <div className="pg-admin-modal__footer">{footer}</div>}
      </div>
    </div>
  );
};
