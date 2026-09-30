import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../services/adminService';
import { AdminChargingPoint, AdminZone } from '../../types/admin';
import './AdminChargingPoints.css';

type ViewMode = 'table' | 'grid';
type StatusFilter = 'ALL' | 'Available' | 'Charging' | 'Reserved' | 'Maintenance';

interface AddChargerForm {
  pointCode: string;
  zoneCode: string;
  chargerNumber: string;
  type: string;
  powerKw: string;
  connectorType: string;
  ocppId: string;
}

const INITIAL_FORM: AddChargerForm = {
  pointCode: '',
  zoneCode: '',
  chargerNumber: '1',
  type: 'DC (Fast)',
  powerKw: '120 kW',
  connectorType: 'CCS2',
  ocppId: '',
};

export const AdminChargingPoints: React.FC = () => {
  const [points, setPoints] = useState<AdminChargingPoint[]>([]);
  const [zones, setZones] = useState<AdminZone[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<AdminChargingPoint | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);

  const [formData, setFormData] = useState<AddChargerForm>(INITIAL_FORM);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [chargersData, zonesData] = await Promise.all([
        adminService.getChargingPoints(),
        adminService.getZones(),
      ]);
      setPoints(chargersData);
      setZones(zonesData);
    } catch (err) {
      console.error('Failed to load charging points data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Compute counts based on all loaded points
  const counts = useMemo(() => {
    return {
      all: points.length,
      available: points.filter((p) => p.status === 'Available').length,
      charging: points.filter((p) => p.status === 'Charging').length,
      reserved: points.filter((p) => p.status === 'Reserved').length,
      maintenance: points.filter((p) => p.status === 'Maintenance').length,
    };
  }, [points]);

  // Single data flow: filter based on status & zone
  const filteredPoints = useMemo(() => {
    return points.filter((p) => {
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchesZone = selectedZone === 'ALL' || p.zoneCode === selectedZone;
      return matchesStatus && matchesZone;
    });
  }, [points, statusFilter, selectedZone]);

  const handleOpenAddModal = () => {
    const nextNum = points.length + 1;
    const nextCode = `CH-${String(nextNum).padStart(3, '0')}`;
    const defaultZone = zones.length > 0 ? zones[0].code : 'AP-Z01';
    setFormData({
      pointCode: nextCode,
      zoneCode: defaultZone,
      chargerNumber: '1',
      type: 'DC (Fast)',
      powerKw: '120 kW',
      connectorType: 'CCS2',
      ocppId: `OCPP-${defaultZone}-01`,
    });
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setFormError(null);
  };

  const handleZoneChangeInModal = (zoneCode: string) => {
    setFormData((prev) => ({
      ...prev,
      zoneCode,
      ocppId: `OCPP-${zoneCode}-${String(prev.chargerNumber || '01').padStart(2, '0')}`,
    }));
  };

  const handleChargerNumChange = (num: string) => {
    setFormData((prev) => ({
      ...prev,
      chargerNumber: num,
      ocppId: `OCPP-${prev.zoneCode || 'AP-Z01'}-${String(num || '01').padStart(2, '0')}`,
    }));
  };

  const handleSubmitAddCharger = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.pointCode.trim()) {
      setFormError('Charger ID is required.');
      return;
    }
    if (!formData.zoneCode) {
      setFormError('Please select a zone.');
      return;
    }
    if (!formData.ocppId.trim()) {
      setFormError('OCPP ID is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const powerNumeric = parseInt(formData.powerKw.replace(/\D/g, ''), 10) || 120;
      const typeCategory = formData.type.includes('AC') ? 'AC' : 'DC';
      const matchedZone = zones.find((z) => z.code === formData.zoneCode);

      const created = await adminService.createChargingPoint({
        id: formData.pointCode.trim(),
        pointCode: formData.pointCode.trim(),
        zoneCode: formData.zoneCode,
        zoneName: matchedZone?.name || 'Vijayawada Central',
        stationName: matchedZone?.name || 'Vijayawada Central Hub',
        city: matchedZone?.city || 'Vijayawada',
        type: typeCategory,
        chargerType: formData.type,
        powerKw: powerNumeric,
        connectorType: formData.connectorType,
        status: 'Available',
        chargerNumber: parseInt(formData.chargerNumber, 10) || 1,
        ocppId: formData.ocppId.trim(),
      });

      setPoints((prev) => [created, ...prev]);
      setIsAddModalOpen(false);
      setSuccessMessage(`Charger ${created.pointCode} created successfully!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to add charger. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewPoint = (point: AdminChargingPoint) => {
    setSelectedPoint(point);
    setIsDetailModalOpen(true);
  };

  const zoneOptions = [
    { code: 'ALL', label: 'All Zones' },
    { code: 'AP-Z01', label: 'AP-Z01 · Vijayawada' },
    { code: 'AP-Z02', label: 'AP-Z02 · Visakhapatnam' },
    { code: 'AP-Z03', label: 'AP-Z03 · Tirupati' },
    { code: 'AP-Z04', label: 'AP-Z04 · Guntur' },
    { code: 'AP-Z05', label: 'AP-Z05 · Nellore' },
    { code: 'AP-Z06', label: 'AP-Z06 · Kurnool' },
    { code: 'AP-Z07', label: 'AP-Z07 · Rajahmundry' },
    { code: 'AP-Z08', label: 'AP-Z08 · Amaravati' },
  ];

  const getSelectedZoneLabel = () => {
    const found = zoneOptions.find((z) => z.code === selectedZone);
    return found ? found.label : 'All Zones';
  };

  return (
    <div className="pg-admin-charging-points-page">
      {/* Toast feedback */}
      {successMessage && (
        <div className="pg-admin-charging-points-toast">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {successMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="pg-admin-charging-points-header">
        <div>
          <h1 className="pg-admin-charging-points-title">Charging Points</h1>
          <p className="pg-admin-charging-points-subtitle">
            {points.length} total chargers across 8 zones
          </p>
        </div>

        <div className="pg-admin-charging-points-header-actions">
          {/* Table / Grid View Toggle */}
          <div className="pg-admin-charging-points-view-toggle">
            <button
              type="button"
              className={`pg-admin-charging-points-view-toggle-button ${
                viewMode === 'table' ? 'pg-admin-charging-points-view-toggle-button--active' : ''
              }`}
              onClick={() => setViewMode('table')}
              aria-label="Table View"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
              <span>Table</span>
            </button>
            <button
              type="button"
              className={`pg-admin-charging-points-view-toggle-button ${
                viewMode === 'grid' ? 'pg-admin-charging-points-view-toggle-button--active' : ''
              }`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>Grid</span>
            </button>
          </div>

          {/* Add Charger Button */}
          <button
            type="button"
            className="pg-admin-charging-points-add-button"
            onClick={handleOpenAddModal}
            aria-label="Add Charger"
          >
            <span className="pg-admin-charging-points-add-plus">+</span>
            <span>Add Charger</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="pg-admin-charging-points-filter-bar">
        {/* Status Filter Pills */}
        <div className="pg-admin-charging-points-filter-group">
          <button
            type="button"
            className={`pg-admin-charging-points-filter ${
              statusFilter === 'ALL' ? 'pg-admin-charging-points-filter--active' : ''
            }`}
            onClick={() => setStatusFilter('ALL')}
          >
            All <span className="pg-admin-charging-points-filter-count">{counts.all}</span>
          </button>
          <button
            type="button"
            className={`pg-admin-charging-points-filter ${
              statusFilter === 'Available' ? 'pg-admin-charging-points-filter--active' : ''
            }`}
            onClick={() => setStatusFilter('Available')}
          >
            Available <span className="pg-admin-charging-points-filter-count">{counts.available}</span>
          </button>
          <button
            type="button"
            className={`pg-admin-charging-points-filter ${
              statusFilter === 'Charging' ? 'pg-admin-charging-points-filter--active' : ''
            }`}
            onClick={() => setStatusFilter('Charging')}
          >
            Charging <span className="pg-admin-charging-points-filter-count">{counts.charging}</span>
          </button>
          <button
            type="button"
            className={`pg-admin-charging-points-filter ${
              statusFilter === 'Reserved' ? 'pg-admin-charging-points-filter--active' : ''
            }`}
            onClick={() => setStatusFilter('Reserved')}
          >
            Reserved <span className="pg-admin-charging-points-filter-count">{counts.reserved}</span>
          </button>
          <button
            type="button"
            className={`pg-admin-charging-points-filter ${
              statusFilter === 'Maintenance' ? 'pg-admin-charging-points-filter--active' : ''
            }`}
            onClick={() => setStatusFilter('Maintenance')}
          >
            Maintenance <span className="pg-admin-charging-points-filter-count">{counts.maintenance}</span>
          </button>
        </div>

        {/* Zone Dropdown */}
        <div className="pg-admin-charging-points-zone-wrapper">
          <button
            type="button"
            className="pg-admin-charging-points-zone-trigger"
            onClick={() => setZoneDropdownOpen(!zoneDropdownOpen)}
            aria-expanded={zoneDropdownOpen}
          >
            <span>{getSelectedZoneLabel()}</span>
            <svg
              className={`pg-admin-charging-points-zone-chevron ${zoneDropdownOpen ? 'pg-admin-charging-points-zone-chevron--open' : ''}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {zoneDropdownOpen && (
            <>
              <div
                className="pg-admin-charging-points-zone-backdrop"
                onClick={() => setZoneDropdownOpen(false)}
              />
              <div className="pg-admin-charging-points-zone-menu">
                {zoneOptions.map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    className={`pg-admin-charging-points-zone-item ${
                      selectedZone === opt.code ? 'pg-admin-charging-points-zone-item--active' : ''
                    }`}
                    onClick={() => {
                      setSelectedZone(opt.code);
                      setZoneDropdownOpen(false);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="pg-admin-charging-points-loading">
          <div className="pg-admin-charging-points-spinner" />
          <p>Loading charging points...</p>
        </div>
      ) : filteredPoints.length === 0 ? (
        <div className="pg-admin-charging-points-empty">
          <div className="pg-admin-charging-points-empty-icon">⚡</div>
          <h3>No Charging Points Found</h3>
          <p>No chargers match your current status or zone filters.</p>
          <button
            type="button"
            className="pg-admin-charging-points-reset-btn"
            onClick={() => {
              setStatusFilter('ALL');
              setSelectedZone('ALL');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW (Desktop Table + Mobile Cards) */
        <div className="pg-admin-charging-points-table-container">
          {/* Desktop Table View */}
          <div className="pg-admin-charging-points-table-shell">
            <table className="pg-admin-charging-points-table">
              <thead>
                <tr>
                  <th>CHARGER ID</th>
                  <th>ZONE</th>
                  <th>TYPE</th>
                  <th>POWER</th>
                  <th>CONNECTOR</th>
                  <th>STATUS</th>
                  <th>CURRENT SESSION</th>
                  <th>LAST ACTIVITY</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredPoints.map((point) => {
                  const isCharging = point.status === 'Charging';
                  return (
                    <tr key={point.id}>
                      {/* CHARGER ID */}
                      <td>
                        <span className="pg-admin-charging-points-id-text">{point.pointCode || point.id}</span>
                      </td>

                      {/* ZONE */}
                      <td>
                        <div className="pg-admin-charging-points-zone-cell">
                          <span className="pg-admin-charging-points-zone-code">{point.zoneCode}</span>
                          <span className="pg-admin-charging-points-zone-name">{point.city || point.zoneName || 'Vijayawada'}</span>
                        </div>
                      </td>

                      {/* TYPE */}
                      <td>
                        <span
                          className={`pg-admin-charging-points-type-badge ${
                            point.type === 'DC'
                              ? 'pg-admin-charging-points-type-badge--dc'
                              : 'pg-admin-charging-points-type-badge--ac'
                          }`}
                        >
                          {point.type || 'DC'}
                        </span>
                      </td>

                      {/* POWER */}
                      <td>
                        <span className="pg-admin-charging-points-power-text">{point.powerKw} kW</span>
                      </td>

                      {/* CONNECTOR */}
                      <td>
                        <span className="pg-admin-charging-points-connector-text">{point.connectorType}</span>
                      </td>

                      {/* STATUS */}
                      <td>
                        <span
                          className={`pg-admin-charging-points-status-pill pg-admin-charging-points-status--${point.status.toLowerCase()}`}
                        >
                          <span className="pg-admin-charging-points-status-dot" />
                          <span>{point.status}</span>
                        </span>
                      </td>

                      {/* CURRENT SESSION */}
                      <td>
                        {isCharging && point.activeSession ? (
                          <div className="pg-admin-charging-points-session-cell">
                            <span className="pg-admin-charging-points-session-driver">
                              {point.activeSession.driverName || 'Bala Krishna'}
                            </span>
                            <span className="pg-admin-charging-points-session-metrics">
                              {point.activeSession.energyDeliveredKWh} kWh · {point.activeSession.durationMinutes}m · ₹{point.activeSession.currentCostINR}
                            </span>
                          </div>
                        ) : (
                          <span className="pg-admin-charging-points-dash">—</span>
                        )}
                      </td>

                      {/* LAST ACTIVITY */}
                      <td>
                        <span className="pg-admin-charging-points-last-act">
                          {point.lastPingTime || '2 min ago'}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="pg-admin-charging-points-actions-group">
                          <button
                            type="button"
                            className="pg-admin-charging-points-action-btn"
                            title="View Charger Details"
                            aria-label={`View ${point.pointCode || point.id}`}
                            onClick={() => handleViewPoint(point)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="pg-admin-charging-points-action-btn"
                            title="Edit Charger"
                            aria-label={`Edit ${point.pointCode || point.id}`}
                            onClick={() => handleViewPoint(point)}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards (Rendered on mobile < 768px in Table Mode) */}
          <div className="pg-admin-charging-points-mobile-list">
            {filteredPoints.map((point) => {
              const isCharging = point.status === 'Charging';
              return (
                <div key={point.id} className="pg-admin-charging-points-mobile-card">
                  <div className="pg-admin-charging-points-mobile-header">
                    <span className="pg-admin-charging-points-id-text">{point.pointCode || point.id}</span>
                    <span
                      className={`pg-admin-charging-points-status-pill pg-admin-charging-points-status--${point.status.toLowerCase()}`}
                    >
                      <span className="pg-admin-charging-points-status-dot" />
                      <span>{point.status}</span>
                    </span>
                  </div>

                  <div className="pg-admin-charging-points-mobile-power-line">
                    <strong>{point.powerKw} kW</strong> · {point.connectorType}
                  </div>

                  <div className="pg-admin-charging-points-mobile-details">
                    <div className="pg-admin-charging-points-mobile-row">
                      <span className="pg-admin-charging-points-mobile-label">Zone</span>
                      <span className="pg-admin-charging-points-mobile-val">{point.zoneCode} · {point.city || point.zoneName}</span>
                    </div>
                    <div className="pg-admin-charging-points-mobile-row">
                      <span className="pg-admin-charging-points-mobile-label">Type</span>
                      <span className="pg-admin-charging-points-mobile-val">{point.type} ({point.chargerType || 'Fast'})</span>
                    </div>
                    {isCharging && point.activeSession ? (
                      <div className="pg-admin-charging-points-mobile-row">
                        <span className="pg-admin-charging-points-mobile-label">Session</span>
                        <div className="pg-admin-charging-points-mobile-val" style={{ textAlign: 'right' }}>
                          <div>{point.activeSession.driverName || 'Bala Krishna'}</div>
                          <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                            {point.activeSession.energyDeliveredKWh} kWh · {point.activeSession.durationMinutes}m · ₹{point.activeSession.currentCostINR}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="pg-admin-charging-points-mobile-row">
                        <span className="pg-admin-charging-points-mobile-label">Session</span>
                        <span className="pg-admin-charging-points-mobile-val">—</span>
                      </div>
                    )}
                  </div>

                  <div className="pg-admin-charging-points-mobile-actions">
                    <button
                      type="button"
                      className="pg-admin-charging-points-mobile-btn"
                      onClick={() => handleViewPoint(point)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="pg-admin-charging-points-mobile-btn pg-admin-charging-points-mobile-btn--primary"
                      onClick={() => handleViewPoint(point)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* GRID VIEW (Desktop 5-Columns + Responsive Grid) */
        <div className="pg-admin-charging-points-grid">
          {filteredPoints.map((point) => {
            const isCharging = point.status === 'Charging';
            const isReserved = point.status === 'Reserved';
            const isMaintenance = point.status === 'Maintenance';

            return (
              <div
                key={point.id}
                className={`pg-admin-charging-points-grid-card pg-admin-charging-points-grid-card--${point.status.toLowerCase()}`}
                onClick={() => handleViewPoint(point)}
              >
                {/* Header: Charger ID + Status */}
                <div className="pg-admin-charging-points-grid-card-header">
                  <span className="pg-admin-charging-points-grid-card-id">{point.pointCode || point.id}</span>
                  <span
                    className={`pg-admin-charging-points-status-pill pg-admin-charging-points-status--${point.status.toLowerCase()}`}
                  >
                    <span className="pg-admin-charging-points-status-dot" />
                    <span>{point.status}</span>
                  </span>
                </div>

                {/* Power & Connector */}
                <div className="pg-admin-charging-points-grid-card-power">
                  {point.powerKw} kW · {point.connectorType}
                </div>

                {/* Dynamic Status / Session Info */}
                <div className="pg-admin-charging-points-grid-card-session">
                  {isCharging && point.activeSession ? (
                    <div className="pg-admin-charging-points-grid-session-info">
                      <div className="pg-admin-charging-points-grid-driver">
                        {point.activeSession.driverName || 'Bala Krishna'}
                      </div>
                      <div className="pg-admin-charging-points-grid-metrics">
                        <span>{point.activeSession.energyDeliveredKWh} kWh</span>
                        <span>{point.activeSession.durationMinutes}m</span>
                        <span>₹{point.activeSession.currentCostINR}</span>
                      </div>
                    </div>
                  ) : isReserved ? (
                    <div className="pg-admin-charging-points-grid-note pg-admin-charging-points-grid-note--reserved">
                      Reserved slot active
                    </div>
                  ) : isMaintenance ? (
                    <div className="pg-admin-charging-points-grid-note pg-admin-charging-points-grid-note--maintenance">
                      Under maintenance
                    </div>
                  ) : (
                    <div className="pg-admin-charging-points-grid-note pg-admin-charging-points-grid-note--available">
                      {/* Empty spacer for clean alignment */}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD CHARGING POINT MODAL */}
      {isAddModalOpen && (
        <div className="pg-admin-charging-point-modal-overlay">
          <div className="pg-admin-charging-point-modal" role="dialog" aria-modal="true" aria-labelledby="add-charger-title">
            {/* Modal Header */}
            <div className="pg-admin-charging-point-modal-header">
              <h2 id="add-charger-title" className="pg-admin-charging-point-modal-title">
                Add Charging Point
              </h2>
              <button
                type="button"
                className="pg-admin-charging-point-modal-close"
                onClick={handleCloseAddModal}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Error banner */}
            {formError && (
              <div className="pg-admin-charging-point-modal-error">
                {formError}
              </div>
            )}

            {/* Form */}
            <form className="pg-admin-charging-point-modal-form" onSubmit={handleSubmitAddCharger}>
              {/* Row 1: Charger ID & Zone */}
              <div className="pg-admin-charging-point-modal-field">
                <label className="pg-admin-charging-point-modal-label">Charger ID</label>
                <input
                  type="text"
                  className="pg-admin-charging-point-modal-input"
                  placeholder="CH-081"
                  value={formData.pointCode}
                  onChange={(e) => setFormData({ ...formData, pointCode: e.target.value })}
                  required
                />
              </div>

              <div className="pg-admin-charging-point-modal-field">
                <label className="pg-admin-charging-point-modal-label">Zone</label>
                <select
                  className="pg-admin-charging-point-modal-select"
                  value={formData.zoneCode}
                  onChange={(e) => handleZoneChangeInModal(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Zone</option>
                  <option value="AP-Z01">AP-Z01 · Vijayawada</option>
                  <option value="AP-Z02">AP-Z02 · Visakhapatnam</option>
                  <option value="AP-Z03">AP-Z03 · Tirupati</option>
                  <option value="AP-Z04">AP-Z04 · Guntur</option>
                  <option value="AP-Z05">AP-Z05 · Nellore</option>
                  <option value="AP-Z06">AP-Z06 · Kurnool</option>
                  <option value="AP-Z07">AP-Z07 · Rajahmundry</option>
                  <option value="AP-Z08">AP-Z08 · Amaravati</option>
                </select>
              </div>

              {/* Row 2: Charger Number & Type */}
              <div className="pg-admin-charging-point-modal-field">
                <label className="pg-admin-charging-point-modal-label">Charger Number</label>
                <input
                  type="number"
                  className="pg-admin-charging-point-modal-input"
                  placeholder="1"
                  min="1"
                  value={formData.chargerNumber}
                  onChange={(e) => handleChargerNumChange(e.target.value)}
                  required
                />
              </div>

              <div className="pg-admin-charging-point-modal-field">
                <label className="pg-admin-charging-point-modal-label">Type</label>
                <select
                  className="pg-admin-charging-point-modal-select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="DC (Fast)">DC (Fast)</option>
                  <option value="AC (Standard)">AC (Standard)</option>
                  <option value="DC (Ultra-Fast 150kW)">DC (Ultra-Fast 150kW)</option>
                </select>
              </div>

              {/* Row 3: Power (kW) & Connector */}
              <div className="pg-admin-charging-point-modal-field">
                <label className="pg-admin-charging-point-modal-label">Power (kW)</label>
                <select
                  className="pg-admin-charging-point-modal-select"
                  value={formData.powerKw}
                  onChange={(e) => setFormData({ ...formData, powerKw: e.target.value })}
                  required
                >
                  <option value="120 kW">120 kW</option>
                  <option value="60 kW">60 kW</option>
                  <option value="150 kW">150 kW</option>
                  <option value="50 kW">50 kW</option>
                  <option value="22 kW">22 kW</option>
                </select>
              </div>

              <div className="pg-admin-charging-point-modal-field">
                <label className="pg-admin-charging-point-modal-label">Connector</label>
                <select
                  className="pg-admin-charging-point-modal-select"
                  value={formData.connectorType}
                  onChange={(e) => setFormData({ ...formData, connectorType: e.target.value })}
                  required
                >
                  <option value="CCS2">CCS2</option>
                  <option value="Type 2">Type 2</option>
                  <option value="CHAdeMO">CHAdeMO</option>
                  <option value="GB/T">GB/T</option>
                </select>
              </div>

              {/* Row 4: OCPP ID (Full width) */}
              <div className="pg-admin-charging-point-modal-field pg-admin-charging-point-modal-field--full">
                <label className="pg-admin-charging-point-modal-label">OCPP ID</label>
                <input
                  type="text"
                  className="pg-admin-charging-point-modal-input"
                  placeholder="OCPP-AP-Z01-01"
                  value={formData.ocppId}
                  onChange={(e) => setFormData({ ...formData, ocppId: e.target.value })}
                  required
                />
              </div>

              {/* Submit Button (Full width) */}
              <button
                type="submit"
                className="pg-admin-charging-point-modal-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Adding...</span>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>Add Charger</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL / VIEW MODAL */}
      {isDetailModalOpen && selectedPoint && (
        <div className="pg-admin-charging-point-modal-overlay">
          <div className="pg-admin-charging-point-modal pg-admin-charging-point-modal--detail" role="dialog">
            <div className="pg-admin-charging-point-modal-header">
              <div>
                <h2 className="pg-admin-charging-point-modal-title">
                  {selectedPoint.pointCode || selectedPoint.id} Details
                </h2>
                <p className="pg-admin-cp-detail-sub">{selectedPoint.stationName} ({selectedPoint.zoneCode})</p>
              </div>
              <button
                type="button"
                className="pg-admin-charging-point-modal-close"
                onClick={() => setIsDetailModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="pg-admin-cp-detail-grid">
              <div className="pg-admin-cp-detail-item">
                <span className="pg-admin-cp-detail-label">Status</span>
                <span className={`pg-admin-charging-points-status-pill pg-admin-charging-points-status--${selectedPoint.status.toLowerCase()}`}>
                  <span className="pg-admin-charging-points-status-dot" />
                  <span>{selectedPoint.status}</span>
                </span>
              </div>
              <div className="pg-admin-cp-detail-item">
                <span className="pg-admin-cp-detail-label">Power & Plug</span>
                <span className="pg-admin-cp-detail-val">{selectedPoint.powerKw} kW · {selectedPoint.connectorType}</span>
              </div>
              <div className="pg-admin-cp-detail-item">
                <span className="pg-admin-cp-detail-label">OCPP ID</span>
                <span className="pg-admin-cp-detail-val">{selectedPoint.ocppId || `OCPP-${selectedPoint.zoneCode}-01`}</span>
              </div>
              <div className="pg-admin-cp-detail-item">
                <span className="pg-admin-cp-detail-label">Rate / kWh</span>
                <span className="pg-admin-cp-detail-val">₹{selectedPoint.ratePerKWh || 12} / kWh</span>
              </div>
              <div className="pg-admin-cp-detail-item">
                <span className="pg-admin-cp-detail-label">Last Ping</span>
                <span className="pg-admin-cp-detail-val">{selectedPoint.lastPingTime || '2 min ago'}</span>
              </div>
              <div className="pg-admin-cp-detail-item">
                <span className="pg-admin-cp-detail-label">City / State</span>
                <span className="pg-admin-cp-detail-val">{selectedPoint.city || 'Vijayawada'}, Andhra Pradesh</span>
              </div>

              {selectedPoint.status === 'Charging' && selectedPoint.activeSession && (
                <div className="pg-admin-cp-detail-session-box">
                  <h4>Active Charging Session</h4>
                  <div className="pg-admin-cp-detail-session-row">
                    <span>Driver Name:</span>
                    <strong>{selectedPoint.activeSession.driverName || 'Bala Krishna'}</strong>
                  </div>
                  <div className="pg-admin-cp-detail-session-row">
                    <span>Vehicle Plate:</span>
                    <strong>{selectedPoint.activeSession.vehiclePlate}</strong>
                  </div>
                  <div className="pg-admin-cp-detail-session-row">
                    <span>Energy Delivered:</span>
                    <strong>{selectedPoint.activeSession.energyDeliveredKWh} kWh</strong>
                  </div>
                  <div className="pg-admin-cp-detail-session-row">
                    <span>Duration:</span>
                    <strong>{selectedPoint.activeSession.durationMinutes} minutes</strong>
                  </div>
                  <div className="pg-admin-cp-detail-session-row">
                    <span>Current Cost:</span>
                    <strong>₹{selectedPoint.activeSession.currentCostINR}</strong>
                  </div>
                </div>
              )}
            </div>

            <div className="pg-admin-cp-detail-actions">
              <button
                type="button"
                className="pg-admin-cp-detail-close-btn"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChargingPoints;
