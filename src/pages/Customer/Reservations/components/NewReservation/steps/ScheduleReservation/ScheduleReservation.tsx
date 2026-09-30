import React from 'react';
import { ReservationDraft } from '../../../../hooks/useReservationFlow';
import './ScheduleReservation.css';

interface ScheduleReservationProps {
  draft: ReservationDraft;
  onUpdateSchedule: (updates: {
    date?: string;
    startTime?: string;
    durationMinutes?: number;
    durationText?: string;
  }) => void;
  onProceed: () => void;
}

const DURATION_OPTIONS = [
  { text: '30m', minutes: 30 },
  { text: '1h', minutes: 60 },
  { text: '1.5h', minutes: 90 },
  { text: '2h', minutes: 120 },
];

export const ScheduleReservation: React.FC<ScheduleReservationProps> = ({
  draft,
  onUpdateSchedule,
  onProceed,
}) => {
  const minDate = new Date().toISOString().split('T')[0];

  const handleDurationClick = (opt: { text: string; minutes: number }) => {
    onUpdateSchedule({
      durationMinutes: opt.minutes,
      durationText: opt.text,
    });
  };

  return (
    <div className="pg-step-schedule">
      <div className="pg-step-schedule__form">
        {/* Date Field */}
        <div className="pg-step-schedule__field">
          <label className="pg-step-schedule__label" htmlFor="res-date">
            Date
          </label>
          <div className="pg-step-schedule__input-wrap">
            <input
              id="res-date"
              type="date"
              className="pg-step-schedule__input"
              value={draft.date}
              min={minDate}
              onChange={(e) => onUpdateSchedule({ date: e.target.value })}
            />
          </div>
        </div>

        {/* Start Time Field */}
        <div className="pg-step-schedule__field">
          <label className="pg-step-schedule__label" htmlFor="res-time">
            Start Time
          </label>
          <div className="pg-step-schedule__input-wrap">
            <input
              id="res-time"
              type="time"
              className="pg-step-schedule__input"
              value={draft.startTime}
              onChange={(e) => onUpdateSchedule({ startTime: e.target.value })}
            />
          </div>
        </div>

        {/* Duration Options */}
        <div className="pg-step-schedule__field">
          <label className="pg-step-schedule__label">Duration</label>
          <div className="pg-step-schedule__durations">
            {DURATION_OPTIONS.map((opt) => {
              const isSelected = draft.durationMinutes === opt.minutes;
              return (
                <button
                  key={opt.text}
                  type="button"
                  className={`pg-step-schedule__duration-btn ${
                    isSelected ? 'pg-step-schedule__duration-btn--active' : ''
                  }`}
                  onClick={() => handleDurationClick(opt)}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cost Estimate Card */}
        <div className="pg-step-schedule__cost-card">
          <div className="pg-step-schedule__cost-label">Cost Estimate</div>
          <div className="pg-step-schedule__cost-val">~₹{draft.estimatedCostINR}</div>
          <div className="pg-step-schedule__cost-sub">
            Based on ₹{draft.ratePerKWh}/kWh × {draft.durationMinutes} min · Actual cost depends on energy used
          </div>
        </div>

        {/* Submit Review Button */}
        <button
          type="button"
          className="pg-step-schedule__submit-btn"
          onClick={onProceed}
        >
          Review Booking
        </button>
      </div>
    </div>
  );
};
