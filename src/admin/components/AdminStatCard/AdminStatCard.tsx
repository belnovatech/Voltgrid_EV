import React from 'react';
import './AdminStatCard.css';

interface AdminStatCardProps {
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  value: string | number;
  label: string;
  subtext?: string;
  subtextColor?: string;
  variant?: 'default' | 'dark' | 'highlight' | 'warning';
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
  onClick?: () => void;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  icon,
  iconBg,
  iconColor,
  value,
  label,
  subtext,
  subtextColor,
  variant = 'default',
  trend,
  className = '',
  onClick,
}) => {
  return (
    <div
      className={`pg-admin-stat-card pg-admin-stat-card--${variant} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="pg-admin-stat-card__top">
        {icon && (
          <div
            className="pg-admin-stat-card__icon-wrap"
            style={{
              backgroundColor: iconBg || undefined,
              color: iconColor || undefined,
            }}
          >
            {icon}
          </div>
        )}
        {trend && (
          <span
            className={`pg-admin-stat-card__trend ${
              trend.isPositive ? 'pg-admin-stat-card__trend--up' : 'pg-admin-stat-card__trend--down'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      <div className="pg-admin-stat-card__body">
        <div className="pg-admin-stat-card__value">{value}</div>
        <div className="pg-admin-stat-card__label">{label}</div>
        {subtext && (
          <div
            className="pg-admin-stat-card__subtext"
            style={{ color: subtextColor || undefined }}
          >
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};
