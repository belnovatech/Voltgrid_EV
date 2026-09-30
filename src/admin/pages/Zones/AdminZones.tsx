import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { AdminZone } from '../../types/admin';
import './AdminZones.css';

export const AdminZones: React.FC = () => {
  const [zones, setZones] = useState<AdminZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingZone, setViewingZone] = useState<AdminZone | null>(null);

  // Form State for Add Zone
  const [formData, setFormData] = useState({
    code: 'AP-Z09',
    name: '',
    city: '',
    operatingHours: '24/7',
    address: '',
    contactNumber: '',
  });
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getZones();
      setZones(data);
      // Compute next Zone Code for default
      setFormData((prev) => ({
        ...prev,
        code: `AP-Z0${data.length + 1 > 9 ? data.length + 1 : '0' + (data.length + 1)}`.slice(0, 6),
      }));
    } catch (err) {
      console.error('Failed to load zones', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setFormError('');
    setFormData({
      code: `AP-Z0${zones.length + 1}`,
      name: '',
      city: '',
      operatingHours: '24/7',
      address: '',
      contactNumber: '',
    });
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    if (!isSubmitting) {
      setIsAddModalOpen(false);
      setFormError('');
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleCreateZoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.code.trim()) {
      setFormError('Zone ID is required (e.g. AP-Z09).');
      return;
    }
    if (!formData.name.trim()) {
      setFormError('Zone Name is required.');
      return;
    }
    if (!formData.city.trim()) {
      setFormError('City is required.');
      return;
    }
    if (!formData.address.trim()) {
      setFormError('Address is required.');
      return;
    }
    if (!formData.contactNumber.trim()) {
      setFormError('Contact Number is required.');
      return;
    }

    // Check duplicate code
    if (zones.some((z) => z.code.toLowerCase() === formData.code.trim().toLowerCase())) {
      setFormError(`Zone ID ${formData.code} already exists.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await adminService.createZone({
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        operatingHours: formData.operatingHours.trim() || '24/7',
        contactNumber: formData.contactNumber.trim(),
        totalChargers: 10,
        availableChargers: 10,
        chargingCount: 0,
        reservedCount: 0,
        maintenanceCount: 0,
        todayRevenueINR: 0,
        status: 'Active',
      });

      setZones((prev) => [...prev, created]);
      setIsAddModalOpen(false);
      setSuccessMessage(`Zone ${created.code} (${created.name}) created successfully!`);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setFormError('Unable to create zone. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pg-admin-zones">
      {/* 1. PAGE HEADER */}
      <div className="pg-admin-zones-header">
        <div className="pg-admin-zones-header__info">
          <h1 className="pg-admin-zones-title">Zone Management</h1>
          <p className="pg-admin-zones-subtitle">
            {zones.length} charging zones across Andhra Pradesh
          </p>
        </div>

        <button
          type="button"
          className="pg-admin-zones-add-button"
          onClick={handleOpenAddModal}
          aria-label="Add New Zone"
        >
          <span className="pg-admin-zones-add-button__plus">+</span>
          <span>Add Zone</span>
        </button>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="pg-admin-zones-success-banner" role="status">
          <span>✓ {successMessage}</span>
        </div>
      )}

      {/* 2. DESKTOP & TABLET TABLE SHELL */}
      <div className="pg-admin-zones-table-shell">
        <table className="pg-admin-zones-table">
          <thead className="pg-admin-zones-table-head">
            <tr>
              <th className="pg-admin-zones-th">ZONE ID</th>
              <th className="pg-admin-zones-th">NAME</th>
              <th className="pg-admin-zones-th">CITY</th>
              <th className="pg-admin-zones-th pg-admin-zones-th--center">AVAILABLE</th>
              <th className="pg-admin-zones-th pg-admin-zones-th--center">CHARGING</th>
              <th className="pg-admin-zones-th pg-admin-zones-th--center">RESERVED</th>
              <th className="pg-admin-zones-th pg-admin-zones-th--center">MAINT.</th>
              <th className="pg-admin-zones-th">REVENUE</th>
              <th className="pg-admin-zones-th">STATUS</th>
              <th className="pg-admin-zones-th pg-admin-zones-th--center">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={10} className="pg-admin-zones-loading">
                  <div className="pg-admin-zones-spinner" />
                  <span>Loading zones telemetry...</span>
                </td>
              </tr>
            ) : (
              zones.map((zone) => (
                <tr key={zone.id} className="pg-admin-zones-table-row">
                  {/* Zone ID */}
                  <td className="pg-admin-zones-table-cell pg-admin-zones-id">
                    {zone.code}
                  </td>

                  {/* Name + Address */}
                  <td className="pg-admin-zones-table-cell pg-admin-zones-name">
                    <div className="pg-admin-zones-name-box">
                      <span className="pg-admin-zones-name-title">{zone.name}</span>
                      {zone.address && (
                        <div className="pg-admin-zones-address-box">
                          <span className="pg-admin-zones-address-pin" aria-hidden="true">•</span>
                          <span className="pg-admin-zones-address-text">{zone.address}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* City */}
                  <td className="pg-admin-zones-table-cell pg-admin-zones-city">
                    {zone.city}
                  </td>

                  {/* Available */}
                  <td className="pg-admin-zones-table-cell pg-admin-zones-availability pg-admin-zones-td--center">
                    <span className="pg-admin-zones-avail-green">{zone.availableChargers}</span>
                    <span className="pg-admin-zones-avail-total">/{zone.totalChargers}</span>
                  </td>

                  {/* Charging */}
                  <td className="pg-admin-zones-table-cell pg-admin-zones-charging pg-admin-zones-td--center">
                    {zone.chargingCount}
                  </td>

                  {/* Reserved */}
                  <td className="pg-admin-zones-table-cell pg-admin-zones-reserved pg-admin-zones-td--center">
                    {zone.reservedCount ?? 0}
                  </td>

                  {/* Maintenance */}
                  <td className="pg-admin-zones-table-cell pg-admin-zones-maintenance pg-admin-zones-td--center">
                    {zone.maintenanceCount}
                  </td>

                  {/* Revenue */}
                  <td className="pg-admin-zones-table-cell pg-admin-zones-revenue">
                    ₹{zone.todayRevenueINR.toLocaleString('en-IN')}
                  </td>

                  {/* Status */}
                  <td className="pg-admin-zones-table-cell pg-admin-zones-status">
                    <span className="pg-admin-zones-status-badge pg-admin-zones-status-badge--active">
                      {zone.status === 'Online' ? 'Active' : zone.status}
                    </span>
                  </td>

                  {/* Actions (View + Edit Icons) */}
                  <td className="pg-admin-zones-table-cell pg-admin-zones-actions pg-admin-zones-td--center">
                    <div className="pg-admin-zones-action-icons">
                      <button
                        type="button"
                        className="pg-admin-zones-action-btn"
                        onClick={() => setViewingZone(zone)}
                        aria-label={`View ${zone.code} telemetry`}
                        title="View Details"
                      >
                        {/* Eye Icon */}
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        className="pg-admin-zones-action-btn"
                        onClick={() => setViewingZone(zone)}
                        aria-label={`Edit ${zone.code}`}
                        title="Edit Zone"
                      >
                        {/* Edit Pen Icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 3. MOBILE RESPONSIVE ZONE CARDS (< 768px) */}
      <div className="pg-admin-zones-mobile-list">
        {zones.map((zone) => (
          <div key={zone.id} className="pg-admin-zones-mobile-card">
            <div className="pg-admin-zones-mobile-header">
              <div>
                <span className="pg-admin-zones-mobile-id">{zone.code}</span>
                <h3 className="pg-admin-zones-mobile-name">{zone.name}</h3>
                <span className="pg-admin-zones-mobile-city">{zone.city}</span>
              </div>
              <span className="pg-admin-zones-status-badge pg-admin-zones-status-badge--active">
                {zone.status === 'Online' ? 'Active' : zone.status}
              </span>
            </div>

            {zone.address && (
              <p className="pg-admin-zones-mobile-address">{zone.address}</p>
            )}

            <div className="pg-admin-zones-mobile-grid">
              <div className="pg-admin-zones-mobile-stat">
                <span className="pg-admin-zones-mobile-stat__label">Available</span>
                <span className="pg-admin-zones-mobile-stat__val pg-admin-zones-avail-green">
                  {zone.availableChargers}/{zone.totalChargers}
                </span>
              </div>

              <div className="pg-admin-zones-mobile-stat">
                <span className="pg-admin-zones-mobile-stat__label">Charging</span>
                <span className="pg-admin-zones-mobile-stat__val pg-admin-zones-charging">
                  {zone.chargingCount}
                </span>
              </div>

              <div className="pg-admin-zones-mobile-stat">
                <span className="pg-admin-zones-mobile-stat__label">Reserved</span>
                <span className="pg-admin-zones-mobile-stat__val pg-admin-zones-reserved">
                  {zone.reservedCount ?? 0}
                </span>
              </div>

              <div className="pg-admin-zones-mobile-stat">
                <span className="pg-admin-zones-mobile-stat__label">Maint.</span>
                <span className="pg-admin-zones-mobile-stat__val pg-admin-zones-maintenance">
                  {zone.maintenanceCount}
                </span>
              </div>
            </div>

            <div className="pg-admin-zones-mobile-footer">
              <div className="pg-admin-zones-mobile-revenue">
                <span className="pg-admin-zones-mobile-rev-label">Revenue:</span>
                <span className="pg-admin-zones-mobile-rev-val">
                  ₹{zone.todayRevenueINR.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pg-admin-zones-mobile-actions">
                <button
                  type="button"
                  className="pg-admin-zones-mobile-action-btn"
                  onClick={() => setViewingZone(zone)}
                >
                  View Telemetry
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. ADD NEW ZONE MODAL (SCREENSHOT 2) */}
      {isAddModalOpen && (
        <div
          className="pg-admin-zone-modal-overlay"
          onClick={handleCloseAddModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pg-admin-zone-modal-title"
        >
          <div
            className="pg-admin-zone-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pg-admin-zone-modal-header">
              <h2 id="pg-admin-zone-modal-title" className="pg-admin-zone-modal-title">
                Add New Zone
              </h2>
              <button
                type="button"
                className="pg-admin-zone-modal-close"
                onClick={handleCloseAddModal}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateZoneSubmit} className="pg-admin-zone-modal-form" noValidate>
              {formError && (
                <div className="pg-admin-zone-modal-error" role="alert">
                  {formError}
                </div>
              )}

              {/* 2-Column Row 1: Zone ID + Zone Name */}
              <div className="pg-admin-zone-modal-grid-row">
                <div className="pg-admin-zone-modal-field">
                  <label htmlFor="pg-zone-code" className="pg-admin-zone-modal-label">
                    Zone ID
                  </label>
                  <input
                    id="pg-zone-code"
                    type="text"
                    name="code"
                    className="pg-admin-zone-modal-input"
                    placeholder="AP-Z09"
                    value={formData.code}
                    onChange={handleFormChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="pg-admin-zone-modal-field">
                  <label htmlFor="pg-zone-name" className="pg-admin-zone-modal-label">
                    Zone Name
                  </label>
                  <input
                    id="pg-zone-name"
                    type="text"
                    name="name"
                    className="pg-admin-zone-modal-input"
                    placeholder="City Hub Name"
                    value={formData.name}
                    onChange={handleFormChange}
                    disabled={isSubmitting}
                    autoFocus
                  />
                </div>
              </div>

              {/* 2-Column Row 2: City + Operating Hours */}
              <div className="pg-admin-zone-modal-grid-row">
                <div className="pg-admin-zone-modal-field">
                  <label htmlFor="pg-zone-city" className="pg-admin-zone-modal-label">
                    City
                  </label>
                  <input
                    id="pg-zone-city"
                    type="text"
                    name="city"
                    className="pg-admin-zone-modal-input"
                    placeholder="Vijayawada"
                    value={formData.city}
                    onChange={handleFormChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="pg-admin-zone-modal-field">
                  <label htmlFor="pg-zone-hours" className="pg-admin-zone-modal-label">
                    Operating Hours
                  </label>
                  <input
                    id="pg-zone-hours"
                    type="text"
                    name="operatingHours"
                    className="pg-admin-zone-modal-input"
                    placeholder="24/7"
                    value={formData.operatingHours}
                    onChange={handleFormChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Full Width Row 3: Address */}
              <div className="pg-admin-zone-modal-field">
                <label htmlFor="pg-zone-address" className="pg-admin-zone-modal-label">
                  Address
                </label>
                <input
                  id="pg-zone-address"
                  type="text"
                  name="address"
                  className="pg-admin-zone-modal-input"
                  placeholder="Full address"
                  value={formData.address}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                />
              </div>

              {/* Full Width Row 4: Contact Number */}
              <div className="pg-admin-zone-modal-field">
                <label htmlFor="pg-zone-contact" className="pg-admin-zone-modal-label">
                  Contact Number
                </label>
                <input
                  id="pg-zone-contact"
                  type="text"
                  name="contactNumber"
                  className="pg-admin-zone-modal-input"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.contactNumber}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Button (PowerGrid Lime Accent) */}
              <button
                type="submit"
                className="pg-admin-zone-modal-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Zone...' : 'Create Zone'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. VIEW TELEMETRY MODAL */}
      {viewingZone && (
        <div
          className="pg-admin-zone-modal-overlay"
          onClick={() => setViewingZone(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="pg-admin-zone-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pg-admin-zone-modal-header">
              <h2 className="pg-admin-zone-modal-title">
                {viewingZone.code} — {viewingZone.name}
              </h2>
              <button
                type="button"
                className="pg-admin-zone-modal-close"
                onClick={() => setViewingZone(null)}
              >
                ✕
              </button>
            </div>

            <div className="pg-admin-zone-telemetry-content">
              <div className="pg-admin-zone-telemetry-item">
                <span className="pg-admin-zone-telemetry-label">Location Address</span>
                <span className="pg-admin-zone-telemetry-value">
                  {viewingZone.address || `${viewingZone.name}, ${viewingZone.city}`}
                </span>
              </div>

              <div className="pg-admin-zone-telemetry-row">
                <div className="pg-admin-zone-telemetry-item">
                  <span className="pg-admin-zone-telemetry-label">City / State</span>
                  <span className="pg-admin-zone-telemetry-value">{viewingZone.city}, {viewingZone.state}</span>
                </div>
                <div className="pg-admin-zone-telemetry-item">
                  <span className="pg-admin-zone-telemetry-label">Operating Hours</span>
                  <span className="pg-admin-zone-telemetry-value">{viewingZone.operatingHours || '24/7'}</span>
                </div>
              </div>

              <div className="pg-admin-zone-telemetry-row">
                <div className="pg-admin-zone-telemetry-item">
                  <span className="pg-admin-zone-telemetry-label">Charger Slots</span>
                  <span className="pg-admin-zone-telemetry-value">
                    {viewingZone.availableChargers}/{viewingZone.totalChargers} Available
                  </span>
                </div>
                <div className="pg-admin-zone-telemetry-item">
                  <span className="pg-admin-zone-telemetry-label">Live Active Charging</span>
                  <span className="pg-admin-zone-telemetry-value" style={{ color: '#06b6d4' }}>
                    {viewingZone.chargingCount} Sessions
                  </span>
                </div>
              </div>

              <div className="pg-admin-zone-telemetry-row">
                <div className="pg-admin-zone-telemetry-item">
                  <span className="pg-admin-zone-telemetry-label">Grid Capacity</span>
                  <span className="pg-admin-zone-telemetry-value">{viewingZone.powerCapacityKw} kW Max</span>
                </div>
                <div className="pg-admin-zone-telemetry-item">
                  <span className="pg-admin-zone-telemetry-label">Active Load</span>
                  <span className="pg-admin-zone-telemetry-value">{viewingZone.currentLoadKw} kW Active</span>
                </div>
              </div>

              <div className="pg-admin-zone-telemetry-row">
                <div className="pg-admin-zone-telemetry-item">
                  <span className="pg-admin-zone-telemetry-label">Today's Revenue</span>
                  <span className="pg-admin-zone-telemetry-value" style={{ color: '#059669', fontWeight: 700 }}>
                    ₹{viewingZone.todayRevenueINR.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="pg-admin-zone-telemetry-item">
                  <span className="pg-admin-zone-telemetry-label">Zone Status</span>
                  <span className="pg-admin-zones-status-badge pg-admin-zones-status-badge--active">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminZones;
