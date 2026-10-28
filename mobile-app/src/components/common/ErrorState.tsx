import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { AppButton } from './AppButton';
import './ErrorState.css';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Unable to load content. Please check your network and try again.',
  onRetry,
  retryLabel = 'Try Again',
}) => {
  return (
    <div className="error-state">
      <div className="error-state-icon">
        <AlertTriangle size={26} />
      </div>
      <h3 className="error-state-title">{title}</h3>
      <p className="error-state-message">{message}</p>
      {onRetry && (
        <AppButton variant="secondary" size="md" icon={<RefreshCw size={16} />} onClick={onRetry}>
          {retryLabel}
        </AppButton>
      )}
    </div>
  );
};
