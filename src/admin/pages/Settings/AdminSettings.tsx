import React, { useState } from 'react';
import './AdminSettings.css';

export const AdminSettings: React.FC = () => {
  const [networkName, setNetworkName] = useState('PowerGrid Andhra Pradesh EV Network');
  const [autoShedding, setAutoShedding] = useState(true);
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState(15);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="pg-admin-set">
      <div className="pg-admin-set__header">
        <div>
          <h1 className="pg-admin-set__title">Global Network Settings</h1>
          <p className="pg-admin-set__subtitle">
            Configure system parameters, OCPP timeouts, smart grid balancing thresholds, and alerts
          </p>
        </div>
      </div>

      <div className="pg-admin-set__card">
        <form onSubmit={handleSave} className="pg-admin-set__form">
          <div className="pg-admin-set__field">
            <label className="pg-admin-set__label">Network Title</label>
            <input
              type="text"
              className="pg-admin-set__input"
              value={networkName}
              onChange={(e) => setNetworkName(e.target.value)}
            />
            <span className="pg-admin-set__hint">
              Displayed on public charging locator apps and government DISCOM dashboards.
            </span>
          </div>

          <div className="pg-admin-set__field">
            <label className="pg-admin-set__label">OCPP Reservation Grace Period (Minutes)</label>
            <input
              type="number"
              className="pg-admin-set__input"
              value={sessionTimeoutMins}
              onChange={(e) => setSessionTimeoutMins(Number(e.target.value))}
              min={5}
              max={60}
            />
            <span className="pg-admin-set__hint">
              Slots are auto-released if driver does not plug in within this window.
            </span>
          </div>

          <div className="pg-admin-set__toggle-field">
            <div className="pg-admin-set__toggle-info">
              <span className="pg-admin-set__toggle-title">Smart Grid Load Balancing & Peak Shedding</span>
              <span className="pg-admin-set__hint">
                Automatically throttle charger kW when zone substation exceeds 85% rated capacity.
              </span>
            </div>
            <label className="pg-admin-set__switch">
              <input
                type="checkbox"
                checked={autoShedding}
                onChange={(e) => setAutoShedding(e.target.checked)}
              />
              <span className="pg-admin-set__slider" />
            </label>
          </div>

          <div className="pg-admin-set__actions">
            {isSaved && (
              <span className="pg-admin-set__saved-msg">✓ Settings saved successfully</span>
            )}
            <button type="submit" className="pg-admin-set__btn">
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AdminSettings;
