import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled,
  className = '',
  ...rest
}) => {
  const classNames = [
    'vg-btn',
    `vg-btn--${variant}`,
    `vg-btn--${size}`,
    fullWidth ? 'vg-btn--full-width' : '',
    isLoading ? 'vg-btn--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="vg-btn__loading-container">
          <span className="vg-btn__spinner" aria-hidden="true" />
          <span className="vg-btn__text">{children}</span>
        </span>
      ) : (
        <span className="vg-btn__text">{children}</span>
      )}
    </button>
  );
};
