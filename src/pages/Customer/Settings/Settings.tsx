import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerLayout } from '../../../components/customer/CustomerLayout/CustomerLayout';
import { customerService } from '../../../services/customerService';
import { CustomerProfile } from '../../../types/customer';
import './Settings.css';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  // Preference States
  const [smsNotifs, setSmsNotifs] = useState<boolean>(true);
  const [pushNotifs, setPushNotifs] = useState<boolean>(true);
  const [emailInvoices, setEmailInvoices] = useState<boolean>(true);
  const [autoStopBattery, setAutoStopBattery] = useState<number>(90);
  const [language, setLanguage] = useState<string>('English');
  const [gstin, setGstin] = useState<string>('37AAACP1234F1Z5');
  const [companyName, setCompanyName] = useState<string>('Krishna EV Mobility');

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    customerService.getProfile().then(setProfile);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((res) => setTimeout(res, 400));
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  return (
    <CustomerLayout>
      <div className="powergrid-settings">
        <div className="powergrid-settings__header">
          <div>
            <h1 className="powergrid-settings__title">Settings & Preferences</h1>
            <p className="powergrid-settings__subtitle">
              Manage your EV charging parameters, notification channels, and tax billing.
            </p>
          </div>
        </div>

        {isSaved && (
          <div className="powergrid-settings__success-alert">
            ✓ Preferences and settings saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="powergrid-settings__form">
          {/* SECTION 1: CHARGING PREFERENCES */}
          <div className="powergrid-settings__card">
            <div className="powergrid-settings__card-header">
              <div className="powergrid-settings__card-icon-box powergrid-settings__card-icon-box--cyan">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div>
                <h3 className="powergrid-settings__card-title">Charging Battery Limit</h3>
                <p className="powergrid-settings__card-desc">
                  Automatically stop DC Fast Charging at selected target to optimize battery longevity.
                </p>
              </div>
            </div>

            <div className="powergrid-settings__battery-row">
              {[80, 85, 90, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`powergrid-settings__battery-btn ${
                    autoStopBattery === val ? 'powergrid-settings__battery-btn--active' : ''
                  }`}
                  onClick={() => setAutoStopBattery(val)}
                >
                  <span className="powergrid-settings__battery-num">{val}%</span>
                  <span className="powergrid-settings__battery-sub">
                    {val === 80 ? 'Recommended' : val === 100 ? 'Full Range' : 'Standard'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 2: ALERTS & NOTIFICATIONS */}
          <div className="powergrid-settings__card">
            <div className="powergrid-settings__card-header">
              <div className="powergrid-settings__card-icon-box powergrid-settings__card-icon-box--green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <div>
                <h3 className="powergrid-settings__card-title">Alerts & Notifications</h3>
                <p className="powergrid-settings__card-desc">
                  Choose how you want to receive session milestone and wallet balance updates.
                </p>
              </div>
            </div>

            <div className="powergrid-settings__toggles-list">
              <label className="powergrid-settings__toggle-item">
                <div className="powergrid-settings__toggle-text">
                  <span className="powergrid-settings__toggle-title">SMS Milestone Alerts</span>
                  <span className="powergrid-settings__toggle-desc">
                    Receive SMS alerts when battery reaches 80% or charging completes on +91 {profile?.phoneNumber || '8074407557'}.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={smsNotifs}
                  onChange={(e) => setSmsNotifs(e.target.checked)}
                  className="powergrid-settings__toggle-switch"
                />
              </label>

              <label className="powergrid-settings__toggle-item">
                <div className="powergrid-settings__toggle-text">
                  <span className="powergrid-settings__toggle-title">In-App Push Notifications</span>
                  <span className="powergrid-settings__toggle-desc">
                    Instant updates on reservation start times, wallet auto-debits, and station availability.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={pushNotifs}
                  onChange={(e) => setPushNotifs(e.target.checked)}
                  className="powergrid-settings__toggle-switch"
                />
              </label>

              <label className="powergrid-settings__toggle-item">
                <div className="powergrid-settings__toggle-text">
                  <span className="powergrid-settings__toggle-title">Email Invoices & GST Receipts</span>
                  <span className="powergrid-settings__toggle-desc">
                    Automatically email PDF tax invoice after every completed session.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={emailInvoices}
                  onChange={(e) => setEmailInvoices(e.target.checked)}
                  className="powergrid-settings__toggle-switch"
                />
              </label>
            </div>
          </div>

          {/* SECTION 3: B2B TAX & GST INVOICING */}
          <div className="powergrid-settings__card">
            <div className="powergrid-settings__card-header">
              <div className="powergrid-settings__card-icon-box powergrid-settings__card-icon-box--indigo">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div>
                <h3 className="powergrid-settings__card-title">Commercial GST & Tax Details</h3>
                <p className="powergrid-settings__card-desc">
                  Invoices will be issued with these details for input tax credit (ITC).
                </p>
              </div>
            </div>

            <div className="powergrid-settings__fields-grid">
              <div className="powergrid-settings__field">
                <label className="powergrid-settings__label">Company / Registered Name</label>
                <input
                  type="text"
                  className="powergrid-settings__input"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corp India"
                />
              </div>

              <div className="powergrid-settings__field">
                <label className="powergrid-settings__label">GSTIN Identification Number</label>
                <input
                  type="text"
                  className="powergrid-settings__input"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  placeholder="e.g. 37AAACP1234F1Z5"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: LANGUAGE & REGION */}
          <div className="powergrid-settings__card">
            <div className="powergrid-settings__card-header">
              <div className="powergrid-settings__card-icon-box powergrid-settings__card-icon-box--yellow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <div>
                <h3 className="powergrid-settings__card-title">Language & Regional Preferences</h3>
                <p className="powergrid-settings__card-desc">
                  Select your preferred language for notifications and invoices.
                </p>
              </div>
            </div>

            <div className="powergrid-settings__lang-row">
              {['English', 'Telugu (తెలుగు)', 'Hindi (हिंदी)'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={`powergrid-settings__lang-btn ${
                    language === lang ? 'powergrid-settings__lang-btn--active' : ''
                  }`}
                  onClick={() => setLanguage(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 5: SUPPORT SHORTCUT */}
          <div className="powergrid-settings__support-shortcut">
            <div>
              <h4 className="powergrid-settings__support-title">Need Help with Account Configuration?</h4>
              <p className="powergrid-settings__support-desc">
                Visit our Support Center or contact our 24x7 roadside assist helpline.
              </p>
            </div>
            <button
              type="button"
              className="powergrid-settings__support-btn"
              onClick={() => navigate('/customer/support')}
            >
              Open Support Center
            </button>
          </div>

          {/* Save Action */}
          <div className="powergrid-settings__actions">
            <button
              type="submit"
              className="powergrid-settings__save-btn"
              disabled={isSaving}
            >
              {isSaving ? 'Saving Preferences...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
};
export default Settings;
