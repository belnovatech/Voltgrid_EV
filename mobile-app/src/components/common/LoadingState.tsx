import React from 'react';
import './LoadingState.css';

interface LoadingStateProps {
  message?: string;
  fullscreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading EV services...',
  fullscreen = false,
}) => {
  return (
    <div className={`loading-state ${fullscreen ? 'loading-state--fullscreen' : ''}`}>
      <div className="loading-ring" />
      <p className="loading-state-message">{message}</p>
    </div>
  );
};
