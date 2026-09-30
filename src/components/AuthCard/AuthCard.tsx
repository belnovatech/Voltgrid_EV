import React, { ReactNode } from 'react';
import './AuthCard.css';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerContent?: ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  children,
  footerContent,
}) => {
  return (
    <div className="vg-auth-card-container">
      <div className="vg-auth-card">
        <div className="vg-auth-card__logo-badge" aria-hidden="true">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>

        <h1 className="vg-auth-card__title">{title}</h1>
        <p className="vg-auth-card__subtitle">{subtitle}</p>

        <div className="vg-auth-card__content">
          {children}
        </div>
      </div>

      {footerContent && (
        <div className="vg-auth-card__footer">
          {footerContent}
        </div>
      )}
    </div>
  );
};
