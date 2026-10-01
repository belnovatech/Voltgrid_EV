import React from 'react';
import './RolesSkeleton.css';

export const RolesSkeleton: React.FC = () => {
  return (
    <div className="pg-roles-skeleton" aria-label="Loading security roles...">
      {/* HEADER SKELETON */}
      <div className="pg-roles-skeleton__header">
        <div className="pg-roles-skeleton__title-box">
          <div className="pg-roles-skeleton__block pg-roles-skeleton__icon" />
          <div>
            <div className="pg-roles-skeleton__block pg-roles-skeleton__tag" />
            <div className="pg-roles-skeleton__block pg-roles-skeleton__title" />
          </div>
        </div>
        <div className="pg-roles-skeleton__actions">
          <div className="pg-roles-skeleton__block pg-roles-skeleton__btn" />
          <div className="pg-roles-skeleton__block pg-roles-skeleton__btn" />
        </div>
      </div>

      {/* KPIS SKELETON */}
      <div className="pg-roles-skeleton__kpi-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="pg-roles-skeleton__kpi-card">
            <div className="pg-roles-skeleton__block pg-roles-skeleton__kpi-top" />
            <div className="pg-roles-skeleton__block pg-roles-skeleton__kpi-mid" />
            <div className="pg-roles-skeleton__block pg-roles-skeleton__kpi-bot" />
          </div>
        ))}
      </div>

      {/* TOOLBAR SKELETON */}
      <div className="pg-roles-skeleton__toolbar">
        <div className="pg-roles-skeleton__block pg-roles-skeleton__search" />
        <div className="pg-roles-skeleton__block pg-roles-skeleton__filter" />
        <div className="pg-roles-skeleton__block pg-roles-skeleton__filter" />
      </div>

      {/* CARDS SKELETON */}
      <div className="pg-roles-skeleton__cards-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="pg-roles-skeleton__card">
            <div className="pg-roles-skeleton__block pg-roles-skeleton__card-head" />
            <div className="pg-roles-skeleton__block pg-roles-skeleton__card-desc" />
            <div className="pg-roles-skeleton__block pg-roles-skeleton__card-meta" />
            <div className="pg-roles-skeleton__block pg-roles-skeleton__card-chips" />
            <div className="pg-roles-skeleton__block pg-roles-skeleton__card-foot" />
          </div>
        ))}
      </div>
    </div>
  );
};
