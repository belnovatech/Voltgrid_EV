import React from 'react';
import './InlineAlert.css';

interface InlineAlertProps {
  type?: 'error' | 'warning' | 'success' | 'info';
  message: string;
}

export const InlineAlert: React.FC<InlineAlertProps> = ({
  type = 'error',
  message,
}) => {
  if (!message) return null;

  return (
    <div className={`vg-inline-alert vg-inline-alert--${type}`} role="alert">
      <svg
        className="vg-inline-alert__icon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span className="vg-inline-alert__text">{message}</span>
    </div>
  );
};
