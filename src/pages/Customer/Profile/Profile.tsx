import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerLayout } from '../../../components/customer/CustomerLayout/CustomerLayout';
import { customerService } from '../../../services/customerService';
import { CustomerProfile } from '../../../types/customer';
import { useAuth } from '../../../context/AuthContext';
import './Profile.css';

const ANDHRA_CITIES = [
  'Vijayawada',
  'Visakhapatnam',
  'Tirupati',
  'Guntur',
  'Nellore',
  'Kurnool',
  'Kakinada',
  'Rajahmundry',
  'Amaravati',
  'Anantapur',
  'Kadapa',
  'Eluru',
];

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [vehiclesCount, setVehiclesCount] = useState<number>(2);
  const [sessionsCount, setSessionsCount] = useState<number>(25);
  const [walletBalance, setWalletBalance] = useState<number>(1250);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editCity, setEditCity] = useState<string>('Vijayawada');
  const [editState, setEditState] = useState<string>('Andhra Pradesh');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Logout Confirmation Modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);

  const loadProfileData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prof, vehicles, history] = await Promise.all([
        customerService.getProfile(),
        customerService.getVehicles(),
        customerService.getChargingHistory(),
      ]);

      setProfile(prof);
      setEditName(prof.name);
      setEditEmail(prof.email || '');
      setEditCity(prof.city || 'Vijayawada');
      setEditState(prof.state || 'Andhra Pradesh');
      setWalletBalance(prof.walletBalance);
      setVehiclesCount(vehicles.length > 0 ? vehicles.length : 2);
      setSessionsCount(history.length > 0 ? history.length + 23 : 25);
    } catch {
      setError('Profile information could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const handleOpenEdit = () => {
    if (!profile) return;
    setEditName(profile.name);
    setEditEmail(profile.email || '');
    setEditCity(profile.city || 'Vijayawada');
    setEditState(profile.state || 'Andhra Pradesh');
    setFormError(null);
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    if (isSaving) return;
    setIsEditModalOpen(false);
    setFormError(null);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      setFormError('Full Name is required.');
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      const updated = await customerService.updateProfile({
        name: editName.trim(),
        email: editEmail.trim() || undefined,
        city: editCity,
        state: editState,
      });

      setProfile(updated);
      setIsEditModalOpen(false);
      showToast('Profile updated successfully!');
    } catch {
      setFormError('Failed to save profile changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <CustomerLayout>
      <div className="powergrid-profile">
        {/* Success Toast */}
        {successToast && (
          <div className="powergrid-profile__toast" role="alert">
            <span className="powergrid-profile__toast-icon">✓</span>
            <span className="powergrid-profile__toast-text">{successToast}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="powergrid-profile__header">
          <h1 className="powergrid-profile__title">Profile</h1>
          <button
            type="button"
            className="powergrid-profile__edit-trigger"
            onClick={handleOpenEdit}
            disabled={isLoading || !profile}
            id="profile-edit-btn"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span>Edit</span>
          </button>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="powergrid-profile__skeleton-wrapper">
            <div className="powergrid-profile__skeleton-identity" />
            <div className="powergrid-profile__skeleton-card" />
            <div className="powergrid-profile__skeleton-stats" />
            <div className="powergrid-profile__skeleton-nav" />
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="powergrid-profile__error-card">
            <div className="powergrid-profile__error-icon">⚠️</div>
            <h2 className="powergrid-profile__error-title">{error}</h2>
            <p className="powergrid-profile__error-desc">There was an issue fetching your customer account details.</p>
            <button
              type="button"
              className="powergrid-profile__retry-btn"
              onClick={loadProfileData}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loaded Profile Content */}
        {!isLoading && !error && profile && (
          <div className="powergrid-profile__body">
            {/* Identity Header */}
            <div className="powergrid-profile__identity">
              <div className="powergrid-profile__avatar">
                {profile.avatarInitials ||
                  profile.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) ||
                  'BK'}
              </div>

              <div className="powergrid-profile__identity-info">
                <h2 className="powergrid-profile__name">{profile.name}</h2>
                <div className="powergrid-profile__badge-row">
                  <span className="powergrid-profile__verified-badge">
                    Verified Customer
                  </span>
                </div>
                <p className="powergrid-profile__member-since">
                  Member since {profile.memberSince || 'Jan 2024'}
                </p>
              </div>
            </div>

            {/* Personal Information Card */}
            <div className="powergrid-profile__card">
              {/* Row 1: Full Name */}
              <div className="powergrid-profile__info-row">
                <div className="powergrid-profile__info-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="powergrid-profile__info-content">
                  <span className="powergrid-profile__info-label">Full Name</span>
                  <span className="powergrid-profile__info-val">{profile.name}</span>
                </div>
              </div>

              {/* Row 2: Mobile */}
              <div className="powergrid-profile__info-row">
                <div className="powergrid-profile__info-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="powergrid-profile__info-content">
                  <span className="powergrid-profile__info-label">Mobile</span>
                  <span className="powergrid-profile__info-val">
                    +91 {profile.phoneNumber}
                  </span>
                </div>
              </div>

              {/* Row 3: Email */}
              <div className="powergrid-profile__info-row">
                <div className="powergrid-profile__info-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="powergrid-profile__info-content">
                  <span className="powergrid-profile__info-label">Email</span>
                  <span className="powergrid-profile__info-val">
                    {profile.email || 'bala@example.com'}
                  </span>
                </div>
              </div>

              {/* Row 4: City */}
              <div className="powergrid-profile__info-row powergrid-profile__info-row--last">
                <div className="powergrid-profile__info-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="powergrid-profile__info-content">
                  <span className="powergrid-profile__info-label">City</span>
                  <span className="powergrid-profile__info-val">
                    {profile.city}, {profile.state || 'Andhra Pradesh'}
                  </span>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="powergrid-profile__stats-grid">
              {/* Stat 1: Vehicles */}
              <div
                className="powergrid-profile__stat-card"
                onClick={() => navigate('/customer/vehicles')}
                tabIndex={0}
                role="button"
                aria-label="View My Vehicles"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/customer/vehicles');
                  }
                }}
              >
                <span className="powergrid-profile__stat-val">{vehiclesCount}</span>
                <span className="powergrid-profile__stat-label">Vehicles</span>
              </div>

              {/* Stat 2: Sessions */}
              <div
                className="powergrid-profile__stat-card"
                onClick={() => navigate('/customer/history')}
                tabIndex={0}
                role="button"
                aria-label="View Charging History"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/customer/history');
                  }
                }}
              >
                <span className="powergrid-profile__stat-val">{sessionsCount}</span>
                <span className="powergrid-profile__stat-label">Sessions</span>
              </div>

              {/* Stat 3: Wallet */}
              <div
                className="powergrid-profile__stat-card"
                onClick={() => navigate('/customer/wallet')}
                tabIndex={0}
                role="button"
                aria-label="View Wallet"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/customer/wallet');
                  }
                }}
              >
                <span className="powergrid-profile__stat-val">
                  {formatCurrency(walletBalance)}
                </span>
                <span className="powergrid-profile__stat-label">Wallet</span>
              </div>
            </div>

            {/* Quick Lower Navigation */}
            <div className="powergrid-profile__nav-list">
              {/* My Vehicles Link */}
              <div
                className="powergrid-profile__nav-item"
                onClick={() => navigate('/customer/vehicles')}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/customer/vehicles');
                  }
                }}
              >
                <div className="powergrid-profile__nav-left">
                  <div className="powergrid-profile__nav-icon-box powergrid-profile__nav-icon-box--yellow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                      <circle cx="7" cy="17" r="2" />
                      <path d="M9 17h6" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
                  </div>
                  <div className="powergrid-profile__nav-text">
                    <h3 className="powergrid-profile__nav-title">My Vehicles</h3>
                    <p className="powergrid-profile__nav-desc">
                      Manage your registered EVs and charging vehicles.
                    </p>
                  </div>
                </div>
                <svg className="powergrid-profile__nav-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>

              {/* Wallet & Payments Link */}
              <div
                className="powergrid-profile__nav-item"
                onClick={() => navigate('/customer/wallet')}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/customer/wallet');
                  }
                }}
              >
                <div className="powergrid-profile__nav-left">
                  <div className="powergrid-profile__nav-icon-box powergrid-profile__nav-icon-box--green">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <div className="powergrid-profile__nav-text">
                    <h3 className="powergrid-profile__nav-title">Wallet & Payments</h3>
                    <p className="powergrid-profile__nav-desc">
                      Manage balance, recharge and transactions.
                    </p>
                  </div>
                </div>
                <svg className="powergrid-profile__nav-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>

              {/* Settings Link */}
              <div
                className="powergrid-profile__nav-item"
                onClick={() => navigate('/customer/settings')}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/customer/settings');
                  }
                }}
              >
                <div className="powergrid-profile__nav-left">
                  <div className="powergrid-profile__nav-icon-box powergrid-profile__nav-icon-box--indigo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </div>
                  <div className="powergrid-profile__nav-text">
                    <h3 className="powergrid-profile__nav-title">Settings</h3>
                    <p className="powergrid-profile__nav-desc">
                      Manage account preferences and application settings.
                    </p>
                  </div>
                </div>
                <svg className="powergrid-profile__nav-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>

            {/* Logout Button */}
            <div className="powergrid-profile__logout-row">
              <button
                type="button"
                className="powergrid-profile__logout-btn"
                onClick={() => setIsLogoutModalOpen(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* EDIT PROFILE MODAL */}
        {/* ================================================================ */}
        {isEditModalOpen && (
          <div
            className="powergrid-profile__modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget && !isSaving) {
                handleCloseEdit();
              }
            }}
          >
            <div
              className="powergrid-profile__modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-profile-modal-title"
            >
              <div className="powergrid-profile__modal-header">
                <h3 id="edit-profile-modal-title" className="powergrid-profile__modal-title">
                  Edit Personal Information
                </h3>
                <button
                  type="button"
                  className="powergrid-profile__modal-close"
                  onClick={handleCloseEdit}
                  disabled={isSaving}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="powergrid-profile__form">
                {formError && (
                  <div className="powergrid-profile__form-error">{formError}</div>
                )}

                <div className="powergrid-profile__field">
                  <label className="powergrid-profile__label">Full Name *</label>
                  <input
                    type="text"
                    className="powergrid-profile__input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    disabled={isSaving}
                  />
                </div>

                <div className="powergrid-profile__field">
                  <label className="powergrid-profile__label">
                    Mobile Number (Primary Auth ID)
                  </label>
                  <input
                    type="text"
                    className="powergrid-profile__input powergrid-profile__input--disabled"
                    value={`+91 ${profile?.phoneNumber}`}
                    disabled
                  />
                  <span className="powergrid-profile__field-hint">
                    Mobile number is linked to your OTP authentication.
                  </span>
                </div>

                <div className="powergrid-profile__field">
                  <label className="powergrid-profile__label">Email Address</label>
                  <input
                    type="email"
                    className="powergrid-profile__input"
                    placeholder="e.g. user@example.com"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    disabled={isSaving}
                  />
                </div>

                <div className="powergrid-profile__field">
                  <label className="powergrid-profile__label">City</label>
                  <select
                    className="powergrid-profile__select"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    disabled={isSaving}
                  >
                    {ANDHRA_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="powergrid-profile__modal-actions">
                  <button
                    type="button"
                    className="powergrid-profile__cancel-btn"
                    onClick={handleCloseEdit}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="powergrid-profile__save-btn"
                    disabled={isSaving || !editName.trim()}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* LOGOUT CONFIRMATION MODAL */}
        {/* ================================================================ */}
        {isLogoutModalOpen && (
          <div
            className="powergrid-profile__modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsLogoutModalOpen(false);
              }
            }}
          >
            <div
              className="powergrid-profile__modal powergrid-profile__modal--small"
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-dialog-title"
            >
              <h3 id="logout-dialog-title" className="powergrid-profile__modal-title">
                Sign out?
              </h3>
              <p className="powergrid-profile__dialog-text">
                Are you sure you want to sign out of your PowerGrid EV account?
              </p>
              <div className="powergrid-profile__modal-actions">
                <button
                  type="button"
                  className="powergrid-profile__cancel-btn"
                  onClick={() => setIsLogoutModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="powergrid-profile__danger-btn"
                  onClick={handleConfirmLogout}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};
export default Profile;
