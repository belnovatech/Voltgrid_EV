import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerService } from '../../../services/customerService';
import './CompleteProfile.css';

const ANDHRA_PRADESH_CITIES = [
  'Vijayawada',
  'Visakhapatnam',
  'Tirupati',
  'Guntur',
  'Nellore',
  'Kurnool',
  'Kakinada',
  'Rajahmundry',
  'Amaravati',
];

export const CompleteProfile: React.FC = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState<string>('Bala Krishna');
  const [email, setEmail] = useState<string>('bala@example.com');
  const [city, setCity] = useState<string>('Vijayawada');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleStartCharging = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setIsLoading(true);
    try {
      await customerService.updateProfile({
        name: fullName.trim(),
        email: email.trim() || undefined,
        city,
        state: 'Andhra Pradesh',
      });

      navigate('/customer/dashboard');
    } catch {
      setError('Unable to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pg-cprof-page">
      <div className="pg-cprof-container">
        {/* Top Check Icon */}
        <div className="pg-cprof-header">
          <div className="pg-cprof-badge" aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0f172a"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="pg-cprof-title">Complete Profile</h1>
          <p className="pg-cprof-subtitle">Almost there! Set up your profile.</p>
        </div>

        {/* Card Form */}
        <div className="pg-cprof-card">
          <form onSubmit={handleStartCharging} noValidate>
            {error && (
              <div className="pg-cprof-error" role="alert">
                <span>{error}</span>
              </div>
            )}

            <div className="pg-cprof-field">
              <label htmlFor="pg-fullname-input" className="pg-cprof-label">
                Full Name
              </label>
              <input
                id="pg-fullname-input"
                type="text"
                placeholder="Bala Krishna"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (error) setError('');
                }}
                disabled={isLoading}
                className="pg-cprof-input"
                required
              />
            </div>

            <div className="pg-cprof-field">
              <label htmlFor="pg-email-input" className="pg-cprof-label">
                Email (optional)
              </label>
              <input
                id="pg-email-input"
                type="email"
                placeholder="bala@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="pg-cprof-input"
              />
            </div>

            {/* Custom City Selector matching Screenshot 2 & 3 */}
            <div className="pg-cprof-field">
              <label className="pg-cprof-label">City</label>
              <div className="pg-cprof-select-wrapper">
                <button
                  type="button"
                  className={`pg-cprof-select-btn ${isDropdownOpen ? 'pg-cprof-select-btn--open' : ''}`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-haspopup="listbox"
                  aria-expanded={isDropdownOpen}
                >
                  <span>{city}</span>
                  <svg
                    className={`pg-cprof-chevron ${isDropdownOpen ? 'pg-cprof-chevron--open' : ''}`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="pg-cprof-dropdown" role="listbox">
                    {ANDHRA_PRADESH_CITIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`pg-cprof-dropdown-item ${city === c ? 'pg-cprof-dropdown-item--selected' : ''}`}
                        onClick={() => {
                          setCity(c);
                          setIsDropdownOpen(false);
                        }}
                        role="option"
                        aria-selected={city === c}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="pg-cprof-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Start Charging'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
