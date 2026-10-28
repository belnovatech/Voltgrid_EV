import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import './AppButton.css';

export interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled,
  icon,
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`app-btn app-btn--${variant} app-btn--${size} ${
        fullWidth ? 'app-btn--full-width' : ''
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="app-btn-spinner" />
      ) : (
        <>
          {icon && <span className="app-btn-icon">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
