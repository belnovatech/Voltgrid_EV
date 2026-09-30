import React from 'react';
import { ChargingHistoryItem } from '../../../../../types/customer';
import './ChargingSessionCard.css';

interface ChargingSessionCardProps {
  session: ChargingHistoryItem;
}

export const ChargingSessionCard: React.FC<ChargingSessionCardProps> = ({ session }) => {
  const isCompleted = session.status === 'completed';
  const isActive = session.status === 'active';

  return (
    <div className="powergrid-session-card">
      <div className="powergrid-session-card__left">
        <div
          className={`powergrid-session-card__icon-box ${
            isActive ? 'powergrid-session-card__icon-box--active' : ''
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>

        <div className="powergrid-session-card__info">
          <div className="powergrid-session-card__title-row">
            <h3 className="powergrid-session-card__station">{session.stationName}</h3>
          </div>

          <p className="powergrid-session-card__sub">
            {session.chargerId ? `${session.chargerId} · ` : ''}
            {session.vehicleName}
            {session.vehicleType ? ` · ${session.vehicleType.toUpperCase()}` : ''}
          </p>

          <div className="powergrid-session-card__meta">
            <span className="powergrid-session-card__meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              {session.energyConsumedKWh} kWh
            </span>

            <span className="powergrid-session-card__meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {session.durationMinutes}m
            </span>

            <span className="powergrid-session-card__meta-item">
              ₹{session.ratePerKWh || 12}/kWh
            </span>

            <span className="powergrid-session-card__meta-item powergrid-session-card__meta-item--date">
              {session.date}
            </span>
          </div>
        </div>
      </div>

      <div className="powergrid-session-card__right">
        <span className="powergrid-session-card__cost">₹{session.totalCostINR.toFixed(2)}</span>
        <span
          className={`powergrid-session-card__status-pill powergrid-session-card__status-pill--${session.status}`}
        >
          {isCompleted ? 'Completed' : isActive ? 'Active' : session.status}
        </span>
      </div>
    </div>
  );
};
