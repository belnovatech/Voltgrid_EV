import React, { useState } from 'react';
import { NearbyStationItem } from '../NearbyStations/NearbyStations';
import { customerService } from '../../../../../services/customerService';
import './ReserveModal.css';

interface ReserveModalProps {
  station: NearbyStationItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReserveModal: React.FC<ReserveModalProps> = ({
  station,
  onClose,
  onSuccess,
}) => {
  const [date, setDate] = useState<string>('Today');
  const [timeSlot, setTimeSlot] = useState<string>('11:30 AM - 12:00 PM');
  const [connector, setConnector] = useState<string>('CCS-2 (120 kW Fast)');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!station) return null;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await customerService.createReservation({
        stationName: station.name,
        city: station.city,
        chargerType: connector,
        powerKw: station.powerKw,
        date: date === 'Today' ? new Date().toISOString().split('T')[0] : date,
        timeSlot,
        ratePerKWh: station.ratePerKWh,
      });

      onSuccess();
    } catch {
      setError('Unable to reserve slot. Please try another time.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const slots = [
    '11:30 AM - 12:00 PM',
    '12:00 PM - 12:30 PM',
    '01:00 PM - 01:30 PM',
    '02:30 PM - 03:00 PM',
    '04:00 PM - 04:30 PM',
  ];

  return (
    <div className="pg-rmodal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pg-rmodal" onClick={(e) => e.stopPropagation()}>
        <div className="pg-rmodal__header">
          <div>
            <span className="pg-rmodal__tag">INSTANT RESERVATION</span>
            <h2 className="pg-rmodal__title">{station.name}</h2>
            <p className="pg-rmodal__sub">
              Guaranteed plug availability for your vehicle.
            </p>
          </div>
          <button
            type="button"
            className="pg-rmodal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleConfirm} className="pg-rmodal__form">
          {error && <div className="pg-rmodal__error">{error}</div>}

          <div className="pg-rmodal__field">
            <label>Select Date</label>
            <div className="pg-rmodal__chips">
              {['Today', 'Tomorrow'].map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`pg-rmodal__chip ${date === d ? 'pg-rmodal__chip--active' : ''}`}
                  onClick={() => setDate(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="pg-rmodal__field">
            <label>Select Time Slot (30 Mins Guaranteed)</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="pg-rmodal__select"
            >
              {slots.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="pg-rmodal__field">
            <label>Select Charger Connector</label>
            <select
              value={connector}
              onChange={(e) => setConnector(e.target.value)}
              className="pg-rmodal__select"
            >
              <option value="CCS-2 (120 kW Fast)">CCS-2 (120 kW DC Fast Gun)</option>
              <option value="Type-2 (22 kW AC)">Type-2 AC Gun</option>
            </select>
          </div>

          <div className="pg-rmodal__summary-card">
            <div className="pg-rmodal__summary-row">
              <span>Station Rate</span>
              <strong>₹{station.ratePerKWh}/kWh</strong>
            </div>
            <div className="pg-rmodal__summary-row">
              <span>Reservation Holding Fee</span>
              <strong className="pg-rmodal__free-tag">₹0 (Included in Wallet)</strong>
            </div>
          </div>

          <div className="pg-rmodal__footer">
            <button
              type="button"
              className="pg-rmodal__cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pg-rmodal__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
