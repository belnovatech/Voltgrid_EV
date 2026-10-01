import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import './RolesErrorState.css';

interface RolesErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const RolesErrorState: React.FC<RolesErrorStateProps> = ({
  message = 'We encountered an issue retrieving the latest identity, roles and permission policies.',
  onRetry,
}) => {
  return (
    <div className="pg-roles-error" role="alert">
      <div className="pg-roles-error__icon-wrap">
        <AlertCircle className="w-8 h-8 text-rose-500" />
      </div>

      <h3 className="pg-roles-error__title">Unable to Load Access Configuration</h3>
      <p className="pg-roles-error__desc">{message}</p>

      <button
        type="button"
        className="pg-btn pg-btn--primary"
        onClick={onRetry}
      >
        <RefreshCw className="w-4 h-4 mr-1 inline" />
        Retry Loading
      </button>
    </div>
  );
};
