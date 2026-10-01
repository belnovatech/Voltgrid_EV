import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import './RolesToast.css';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface RolesToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const RolesToast: React.FC<RolesToastProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        onDismiss(toasts[0].id);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="pg-roles-toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`pg-roles-toast pg-roles-toast--${toast.type}`}>
          <div className="pg-roles-toast__icon">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-500" />}
          </div>
          <div className="pg-roles-toast__content">
            <div className="pg-roles-toast__title">{toast.title}</div>
            {toast.description && <div className="pg-roles-toast__desc">{toast.description}</div>}
          </div>
          <button
            type="button"
            className="pg-roles-toast__close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
