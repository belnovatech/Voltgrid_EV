import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../services/adminService';
import { AdminTariffPlan, AdminZone } from '../../types/admin';
import './AdminPricing.css';

interface EditTariffForm {
  id: string;
  ratePerKWhINR: string;
  serviceFeeINR: string;
  taxGstPercent: string;
  minChargeINR: string;
  pricingType: string;
}

interface NewTariffForm {
  vehicleType: 'BIKE' | 'CAR' | 'BUS';
  zoneCode: string;
  pricingType: string;
  ratePerKWhINR: string;
  serviceFeeINR: string;
  taxGstPercent: string;
  minChargeINR: string;
  effectiveFrom: string;
  effectiveTo: string;
  priority: string;
  status: string;
}

const INITIAL_NEW_TARIFF: NewTariffForm = {
  vehicleType: 'CAR',
  zoneCode: 'Global',
  pricingType: 'Per kWh',
  ratePerKWhINR: '12',
  serviceFeeINR: '10',
  taxGstPercent: '18',
  minChargeINR: '20',
  effectiveFrom: '2024-01-01',
  effectiveTo: '2024-12-31',
  priority: '3',
  status: 'Active',
};

export const AdminPricing: React.FC = () => {
  const [tariffs, setTariffs] = useState<AdminTariffPlan[]>([]);
  const [zones, setZones] = useState<AdminZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Active Tariff modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTariff, setEditingTariff] = useState<AdminTariffPlan | null>(null);
  const [editFormData, setEditFormData] = useState<EditTariffForm>({
    id: '',
    ratePerKWhINR: '12',
    serviceFeeINR: '10',
    taxGstPercent: '18',
    minChargeINR: '20',
    pricingType: 'Per kWh',
  });
  const [editError, setEditError] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Create New Tariff modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState<NewTariffForm>(INITIAL_NEW_TARIFF);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tariffsData, zonesData] = await Promise.all([
        adminService.getTariffs(),
        adminService.getZones(),
      ]);
      setTariffs(tariffsData);
      setZones(zonesData);
    } catch (err) {
      console.error('Failed to load tariff data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract primary global matrix tariffs for BIKE, CAR, BUS
  const bikeTariff = useMemo(() => {
    return tariffs.find((t) => t.vehicleType === 'BIKE' && (t.zoneCode === 'Global' || t.zoneCode === 'GLOBAL')) || tariffs[0];
  }, [tariffs]);

  const carTariff = useMemo(() => {
    return tariffs.find((t) => t.vehicleType === 'CAR' && (t.zoneCode === 'Global' || t.zoneCode === 'GLOBAL')) || tariffs[1] || tariffs[0];
  }, [tariffs]);

  const busTariff = useMemo(() => {
    return tariffs.find((t) => t.vehicleType === 'BUS' && (t.zoneCode === 'Global' || t.zoneCode === 'GLOBAL')) || tariffs[2] || tariffs[0];
  }, [tariffs]);

  // Open Edit Modal for a specific tariff
  const handleOpenEditModal = (tariff: AdminTariffPlan) => {
    setEditingTariff(tariff);
    setEditFormData({
      id: tariff.id,
      ratePerKWhINR: String(tariff.ratePerKWhINR ?? tariff.standardRateINR ?? 12),
      serviceFeeINR: String(tariff.serviceFeeINR ?? 10),
      taxGstPercent: String(tariff.taxGstPercent ?? 18),
      minChargeINR: String(tariff.minChargeINR ?? 20),
      pricingType: tariff.pricingType || tariff.type || 'Per kWh',
    });
    setEditError(null);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTariff(null);
    setEditError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    const rate = parseFloat(editFormData.ratePerKWhINR);
    const fee = parseFloat(editFormData.serviceFeeINR);
    const gst = parseFloat(editFormData.taxGstPercent);
    const minCharge = parseFloat(editFormData.minChargeINR);

    if (isNaN(rate) || rate <= 0) {
      setEditError('Please enter a valid rate greater than 0.');
      return;
    }
    if (isNaN(fee) || fee < 0) {
      setEditError('Please enter a valid service fee (0 or greater).');
      return;
    }
    if (isNaN(gst) || gst < 0 || gst > 100) {
      setEditError('GST must be between 0% and 100%.');
      return;
    }
    if (isNaN(minCharge) || minCharge < 0) {
      setEditError('Please enter a valid minimum charge (0 or greater).');
      return;
    }

    setIsSavingEdit(true);
    try {
      if (!editingTariff) return;
      const updated = await adminService.updateTariff(editingTariff.id, {
        ratePerKWhINR: rate,
        standardRateINR: rate,
        serviceFeeINR: fee,
        taxGstPercent: gst,
        minChargeINR: minCharge,
        pricingType: editFormData.pricingType,
      });

      setTariffs((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setIsEditModalOpen(false);
      setToastMessage(`Tariff ${updated.id} (${updated.vehicleType || 'Rate'}) updated successfully.`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      setEditError(err.message || 'Failed to update tariff. Please try again.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setCreateFormData(INITIAL_NEW_TARIFF);
    setCreateError(null);
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateError(null);
  };

  const handleZoneScopeChange = (zoneCode: string) => {
    const priority = zoneCode === 'Global' ? '3' : '2';
    setCreateFormData((prev) => ({
      ...prev,
      zoneCode,
      priority,
    }));
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    const rate = parseFloat(createFormData.ratePerKWhINR);
    const fee = parseFloat(createFormData.serviceFeeINR);
    const gst = parseFloat(createFormData.taxGstPercent);
    const minCharge = parseFloat(createFormData.minChargeINR);

    if (isNaN(rate) || rate <= 0) {
      setCreateError('Please enter a valid rate greater than 0.');
      return;
    }
    if (isNaN(fee) || fee < 0) {
      setCreateError('Please enter a valid service fee (0 or greater).');
      return;
    }
    if (isNaN(gst) || gst < 0 || gst > 100) {
      setCreateError('GST must be between 0% and 100%.');
      return;
    }
    if (isNaN(minCharge) || minCharge < 0) {
      setCreateError('Please enter a valid minimum charge (0 or greater).');
      return;
    }

    setIsCreating(true);
    try {
      const matchedZone = zones.find((z) => z.code === createFormData.zoneCode);
      const zoneName = createFormData.zoneCode === 'Global' ? 'Global Scope' : matchedZone?.name || 'Zone Scope';

      const created = await adminService.createTariff({
        vehicleType: createFormData.vehicleType,
        zoneCode: createFormData.zoneCode,
        zoneName: zoneName,
        pricingType: createFormData.pricingType,
        ratePerKWhINR: rate,
        standardRateINR: rate,
        serviceFeeINR: fee,
        taxGstPercent: gst,
        minChargeINR: minCharge,
        effectiveFrom: createFormData.effectiveFrom,
        effectiveTo: createFormData.effectiveTo,
        priority: parseInt(createFormData.priority, 10) || (createFormData.zoneCode === 'Global' ? 3 : 2),
        status: createFormData.status,
      });

      setTariffs((prev) => [...prev, created]);
      setIsCreateModalOpen(false);
      setToastMessage(`New Tariff ${created.id} created successfully.`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create new tariff.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="pg-admin-pricing-page">
      {/* Toast notification */}
      {toastMessage && (
        <div className="pg-admin-pricing-toast">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Page Header */}
      <div className="pg-admin-pricing-header">
        <div className="pg-admin-pricing-heading">
          <h1 className="pg-admin-pricing-title">Charging Tariff Management</h1>
          <p className="pg-admin-pricing-subtitle">
            Configure vehicle-based pricing with zone overrides
          </p>
        </div>

        {/* Top Right: + New Tariff Button */}
        <button
          type="button"
          className="pg-admin-pricing-new-button"
          onClick={handleOpenCreateModal}
          aria-label="Create new tariff rule"
        >
          <span className="pg-admin-pricing-new-plus">+</span>
          <span>New Tariff</span>
        </button>
      </div>

      {/* 2. Warning Box */}
      <div className="pg-admin-pricing-alert" role="alert">
        <span className="pg-admin-pricing-alert-icon" aria-hidden="true">⚠</span>
        <div className="pg-admin-pricing-alert-text">
          All pricing shown is <strong>sample/demo data only</strong>. These are not actual operator rates.
        </div>
      </div>

      {/* 3. Global Pricing Matrix */}
      <div className="pg-admin-pricing-matrix">
        <div className="pg-admin-pricing-matrix-header">
          <h2 className="pg-admin-pricing-matrix-title">Global Pricing Matrix</h2>
          <p className="pg-admin-pricing-matrix-subtitle">
            Base rates applied across all zones unless overridden
          </p>
        </div>

        {/* 3 Vehicle Cards in 1 Row */}
        <div className="pg-admin-pricing-matrix-grid">
          {/* Card 1: BIKE */}
          <div className="pg-admin-pricing-vehicle-card pg-admin-pricing-vehicle-card--bike">
            <div className="pg-admin-pricing-vehicle-icon pg-admin-pricing-vehicle-icon--bike">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="18.5" cy="17.5" r="3.5" />
                <circle cx="5.5" cy="17.5" r="3.5" />
                <circle cx="15" cy="5" r="1" />
                <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
              </svg>
            </div>
            <div className="pg-admin-pricing-vehicle-rate">
              ₹{bikeTariff?.ratePerKWhINR ?? 8}<span>/kWh</span>
            </div>
            <div className="pg-admin-pricing-vehicle-label">BIKE</div>
            <div className="pg-admin-pricing-vehicle-meta">
              <div>Service: ₹{bikeTariff?.serviceFeeINR ?? 5}</div>
              <div>GST: {bikeTariff?.taxGstPercent ?? 18}%</div>
              <div>Min: ₹{bikeTariff?.minChargeINR ?? 10}</div>
            </div>
            {bikeTariff && (
              <button
                type="button"
                className="pg-admin-pricing-edit-rate"
                onClick={() => handleOpenEditModal(bikeTariff)}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
                <span>Edit Rate</span>
              </button>
            )}
          </div>

          {/* Card 2: CAR (Highlighted Dark Navy / Lime Accent) */}
          <div className="pg-admin-pricing-vehicle-card pg-admin-pricing-vehicle-card--car">
            <div className="pg-admin-pricing-vehicle-icon pg-admin-pricing-vehicle-icon--car">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#09131f" strokeWidth="2.4">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <div className="pg-admin-pricing-vehicle-rate pg-admin-pricing-vehicle-rate--lime">
              ₹{carTariff?.ratePerKWhINR ?? 12}<span>/kWh</span>
            </div>
            <div className="pg-admin-pricing-vehicle-label pg-admin-pricing-vehicle-label--white">CAR</div>
            <div className="pg-admin-pricing-vehicle-meta pg-admin-pricing-vehicle-meta--light">
              <div>Service: ₹{carTariff?.serviceFeeINR ?? 10}</div>
              <div>GST: {carTariff?.taxGstPercent ?? 18}%</div>
              <div>Min: ₹{carTariff?.minChargeINR ?? 20}</div>
            </div>
            {carTariff && (
              <button
                type="button"
                className="pg-admin-pricing-edit-rate pg-admin-pricing-edit-rate--lime"
                onClick={() => handleOpenEditModal(carTariff)}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
                <span>Edit Rate</span>
              </button>
            )}
          </div>

          {/* Card 3: BUS */}
          <div className="pg-admin-pricing-vehicle-card pg-admin-pricing-vehicle-card--bus">
            <div className="pg-admin-pricing-vehicle-icon pg-admin-pricing-vehicle-icon--bus">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="4" width="18" height="15" rx="2" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <circle cx="7" cy="15" r="1.5" />
                <circle cx="17" cy="15" r="1.5" />
                <line x1="6" y1="19" x2="6" y2="21" />
                <line x1="18" y1="19" x2="18" y2="21" />
              </svg>
            </div>
            <div className="pg-admin-pricing-vehicle-rate">
              ₹{busTariff?.ratePerKWhINR ?? 18}<span>/kWh</span>
            </div>
            <div className="pg-admin-pricing-vehicle-label">BUS</div>
            <div className="pg-admin-pricing-vehicle-meta">
              <div>Service: ₹{busTariff?.serviceFeeINR ?? 50}</div>
              <div>GST: {busTariff?.taxGstPercent ?? 18}%</div>
              <div>Min: ₹{busTariff?.minChargeINR ?? 100}</div>
            </div>
            {busTariff && (
              <button
                type="button"
                className="pg-admin-pricing-edit-rate"
                onClick={() => handleOpenEditModal(busTariff)}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
                <span>Edit Rate</span>
              </button>
            )}
          </div>
        </div>

        <div className="pg-admin-pricing-matrix-footer-note">
          Sample pricing · Admin configurable
        </div>
      </div>

      {/* 4. Pricing Priority Section */}
      <div className="pg-admin-pricing-priority">
        <h2 className="pg-admin-pricing-priority-title">Pricing Priority</h2>
        <div className="pg-admin-pricing-priority-flow">
          {/* Step 1 */}
          <div className="pg-admin-pricing-priority-step pg-admin-pricing-priority-step--dark">
            <div className="pg-admin-pricing-priority-step-title">1. Charger + Vehicle</div>
            <div className="pg-admin-pricing-priority-step-sub">Highest specificity</div>
          </div>

          <div className="pg-admin-pricing-priority-arrow" aria-hidden="true">→</div>

          {/* Step 2 */}
          <div className="pg-admin-pricing-priority-step pg-admin-pricing-priority-step--cyan">
            <div className="pg-admin-pricing-priority-step-title">2. Zone + Vehicle</div>
            <div className="pg-admin-pricing-priority-step-sub">Zone override</div>
          </div>

          <div className="pg-admin-pricing-priority-arrow" aria-hidden="true">→</div>

          {/* Step 3 */}
          <div className="pg-admin-pricing-priority-step pg-admin-pricing-priority-step--green">
            <div className="pg-admin-pricing-priority-step-title">3. Global + Vehicle</div>
            <div className="pg-admin-pricing-priority-step-sub">Base rate</div>
          </div>
        </div>

        <p className="pg-admin-pricing-priority-description">
          More specific pricing overrides general pricing. Charger-level tariffs take precedence over zone-level, which take precedence over global rates.
        </p>
      </div>

      {/* 5. All Tariff Rules Table */}
      <div className="pg-admin-pricing-rules">
        <h2 className="pg-admin-pricing-rules-title">All Tariff Rules</h2>

        {isLoading ? (
          <div className="pg-admin-pricing-loading">
            <div className="pg-admin-pricing-spinner" />
            <p>Loading tariff rules...</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="pg-admin-pricing-rules-table-shell">
              <table className="pg-admin-pricing-rules-table">
                <thead>
                  <tr className="pg-admin-pricing-rules-row">
                    <th className="pg-admin-pricing-rules-cell">ID</th>
                    <th className="pg-admin-pricing-rules-cell">VEHICLE</th>
                    <th className="pg-admin-pricing-rules-cell">ZONE</th>
                    <th className="pg-admin-pricing-rules-cell">TYPE</th>
                    <th className="pg-admin-pricing-rules-cell">RATE</th>
                    <th className="pg-admin-pricing-rules-cell">SERVICE</th>
                    <th className="pg-admin-pricing-rules-cell">GST</th>
                    <th className="pg-admin-pricing-rules-cell">EFFECTIVE</th>
                    <th className="pg-admin-pricing-rules-cell" style={{ textAlign: 'center' }}>PRIORITY</th>
                    <th className="pg-admin-pricing-rules-cell">STATUS</th>
                    <th className="pg-admin-pricing-rules-cell" style={{ textAlign: 'right' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {tariffs.map((tariff) => {
                    const isGlobal = tariff.zoneCode === 'Global' || tariff.zoneCode === 'GLOBAL';
                    const vType = (tariff.vehicleType || 'CAR').toUpperCase();

                    return (
                      <tr key={tariff.id} className="pg-admin-pricing-rules-row">
                        {/* ID */}
                        <td className="pg-admin-pricing-rules-cell">
                          <span className="pg-admin-pricing-rule-id">{tariff.id}</span>
                        </td>

                        {/* VEHICLE */}
                        <td className="pg-admin-pricing-rules-cell">
                          <div className="pg-admin-pricing-rule-vehicle">
                            <span className={`pg-admin-pricing-rule-vicon pg-admin-pricing-rule-vicon--${vType.toLowerCase()}`}>
                              {vType === 'BIKE' && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <circle cx="18.5" cy="17.5" r="3.5" /><circle cx="5.5" cy="17.5" r="3.5" />
                                  <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
                                </svg>
                              )}
                              {vType === 'CAR' && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                                  <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
                                </svg>
                              )}
                              {vType === 'BUS' && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <rect x="3" y="4" width="18" height="15" rx="2" />
                                  <circle cx="7" cy="15" r="1.5" /><circle cx="17" cy="15" r="1.5" />
                                </svg>
                              )}
                            </span>
                            <strong>{vType}</strong>
                          </div>
                        </td>

                        {/* ZONE */}
                        <td className="pg-admin-pricing-rules-cell">
                          <span
                            className={`pg-admin-pricing-zone-badge ${
                              isGlobal ? 'pg-admin-pricing-zone-badge--global' : 'pg-admin-pricing-zone-badge--override'
                            }`}
                          >
                            {tariff.zoneCode}
                          </span>
                        </td>

                        {/* TYPE */}
                        <td className="pg-admin-pricing-rules-cell">
                          <span className="pg-admin-pricing-rule-type">{tariff.pricingType || tariff.type || 'Per kWh'}</span>
                        </td>

                        {/* RATE */}
                        <td className="pg-admin-pricing-rules-cell">
                          <span className="pg-admin-pricing-rule-rate">
                            ₹{tariff.ratePerKWhINR ?? tariff.standardRateINR ?? 12}/kWh
                          </span>
                        </td>

                        {/* SERVICE */}
                        <td className="pg-admin-pricing-rules-cell">
                          <span className="pg-admin-pricing-rule-service">₹{tariff.serviceFeeINR ?? 10}</span>
                        </td>

                        {/* GST */}
                        <td className="pg-admin-pricing-rules-cell">
                          <span className="pg-admin-pricing-rule-gst">{tariff.taxGstPercent ?? 18}%</span>
                        </td>

                        {/* EFFECTIVE */}
                        <td className="pg-admin-pricing-rules-cell">
                          <span className="pg-admin-pricing-rule-effective">
                            {tariff.effectiveFrom || '2024-01-01'} → {tariff.effectiveTo || '2024-12-31'}
                          </span>
                        </td>

                        {/* PRIORITY */}
                        <td className="pg-admin-pricing-rules-cell" style={{ textAlign: 'center' }}>
                          <span className="pg-admin-pricing-rule-priority">{tariff.priority ?? (isGlobal ? 3 : 2)}</span>
                        </td>

                        {/* STATUS */}
                        <td className="pg-admin-pricing-rules-cell">
                          <span className="pg-admin-pricing-status pg-admin-pricing-status--active">
                            {tariff.status || 'Active'}
                          </span>
                        </td>

                        {/* ACTION: Edit Icon Button */}
                        <td className="pg-admin-pricing-rules-cell" style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="pg-admin-pricing-rule-action"
                            title={`Edit ${tariff.id}`}
                            aria-label={`Edit ${tariff.id}`}
                            onClick={() => handleOpenEditModal(tariff)}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Tariff Cards (< 768px) */}
            <div className="pg-admin-pricing-mobile-rules-list">
              {tariffs.map((tariff) => {
                const isGlobal = tariff.zoneCode === 'Global' || tariff.zoneCode === 'GLOBAL';
                const vType = (tariff.vehicleType || 'CAR').toUpperCase();

                return (
                  <div key={tariff.id} className="pg-admin-pricing-mobile-rule-card">
                    <div className="pg-admin-pricing-mobile-rule-header">
                      <div>
                        <span className="pg-admin-pricing-rule-id">{tariff.id}</span>
                        <div className="pg-admin-pricing-mobile-rule-title">
                          <strong>{vType}</strong> · <span className="pg-admin-pricing-zone-badge">{tariff.zoneCode}</span>
                        </div>
                      </div>
                      <span className="pg-admin-pricing-status pg-admin-pricing-status--active">
                        {tariff.status || 'Active'}
                      </span>
                    </div>

                    <div className="pg-admin-pricing-mobile-rule-rate-hero">
                      ₹{tariff.ratePerKWhINR ?? tariff.standardRateINR ?? 12}/kWh
                    </div>

                    <div className="pg-admin-pricing-mobile-rule-body">
                      <div className="pg-admin-pricing-mobile-rule-stat">
                        <span>Service Fee</span>
                        <strong>₹{tariff.serviceFeeINR ?? 10}</strong>
                      </div>
                      <div className="pg-admin-pricing-mobile-rule-stat">
                        <span>GST</span>
                        <strong>{tariff.taxGstPercent ?? 18}%</strong>
                      </div>
                      <div className="pg-admin-pricing-mobile-rule-stat">
                        <span>Min. Charge</span>
                        <strong>₹{tariff.minChargeINR ?? 20}</strong>
                      </div>
                      <div className="pg-admin-pricing-mobile-rule-stat">
                        <span>Priority</span>
                        <strong>{tariff.priority ?? (isGlobal ? 3 : 2)}</strong>
                      </div>
                      <div className="pg-admin-pricing-mobile-rule-stat" style={{ gridColumn: '1 / -1' }}>
                        <span>Effective Window</span>
                        <strong>{tariff.effectiveFrom || '2024-01-01'} → {tariff.effectiveTo || '2024-12-31'}</strong>
                      </div>
                    </div>

                    <div className="pg-admin-pricing-mobile-rule-actions">
                      <button
                        type="button"
                        className="pg-admin-pricing-mobile-edit-btn"
                        onClick={() => handleOpenEditModal(tariff)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                        </svg>
                        <span>Edit Tariff Rule</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* 6. MODAL 1: CHANGE ACTIVE TARIFF (Exact Match to Screenshot 3) */}
      {isEditModalOpen && (
        <div className="pg-admin-pricing-edit-overlay" role="dialog" aria-modal="true" onClick={handleCloseEditModal}>
          <div className="pg-admin-pricing-edit-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="pg-admin-pricing-edit-header">
              <h2 className="pg-admin-pricing-edit-title">Change Active Tariff</h2>
              <button
                type="button"
                className="pg-admin-pricing-edit-close"
                onClick={handleCloseEditModal}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Warning Message Box */}
            <div className="pg-admin-pricing-edit-warning">
              <span className="pg-admin-pricing-edit-warning-icon" aria-hidden="true">⚠</span>
              <div className="pg-admin-pricing-edit-warning-text">
                <strong>Changing this tariff will apply to future charging sessions only.</strong>
                <p>Existing completed sessions will retain their original tariff rates.</p>
              </div>
            </div>

            {/* Error Message if any */}
            {editError && (
              <div className="pg-admin-pricing-form-error">{editError}</div>
            )}

            {/* Edit Form (2-Columns on Desktop) */}
            <form className="pg-admin-pricing-edit-form" onSubmit={handleSaveEdit}>
              {/* Row 1: Rate & Service Fee */}
              <div className="pg-admin-pricing-edit-field">
                <label className="pg-admin-pricing-edit-label">Rate (₹/kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  className="pg-admin-pricing-edit-input"
                  value={editFormData.ratePerKWhINR}
                  onChange={(e) => setEditFormData({ ...editFormData, ratePerKWhINR: e.target.value })}
                  required
                />
              </div>

              <div className="pg-admin-pricing-edit-field">
                <label className="pg-admin-pricing-edit-label">Service Fee (₹)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  className="pg-admin-pricing-edit-input"
                  value={editFormData.serviceFeeINR}
                  onChange={(e) => setEditFormData({ ...editFormData, serviceFeeINR: e.target.value })}
                  required
                />
              </div>

              {/* Row 2: GST (%) & Min. Charge (₹) */}
              <div className="pg-admin-pricing-edit-field">
                <label className="pg-admin-pricing-edit-label">GST (%)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  className="pg-admin-pricing-edit-input"
                  value={editFormData.taxGstPercent}
                  onChange={(e) => setEditFormData({ ...editFormData, taxGstPercent: e.target.value })}
                  required
                />
              </div>

              <div className="pg-admin-pricing-edit-field">
                <label className="pg-admin-pricing-edit-label">Min. Charge (₹)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  className="pg-admin-pricing-edit-input"
                  value={editFormData.minChargeINR}
                  onChange={(e) => setEditFormData({ ...editFormData, minChargeINR: e.target.value })}
                  required
                />
              </div>

              {/* Row 3: Pricing Type (Full Width) */}
              <div className="pg-admin-pricing-edit-field pg-admin-pricing-edit-field--full">
                <label className="pg-admin-pricing-edit-label">Pricing Type</label>
                <input
                  type="text"
                  className="pg-admin-pricing-edit-input"
                  value={editFormData.pricingType}
                  onChange={(e) => setEditFormData({ ...editFormData, pricingType: e.target.value })}
                  required
                />
              </div>

              {/* Footer Buttons */}
              <div className="pg-admin-pricing-edit-footer">
                <button
                  type="button"
                  className="pg-admin-pricing-edit-cancel"
                  onClick={handleCloseEditModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="pg-admin-pricing-edit-save"
                  disabled={isSavingEdit}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  <span>{isSavingEdit ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL 2: CREATE NEW TARIFF */}
      {isCreateModalOpen && (
        <div className="pg-admin-pricing-create-overlay" role="dialog" aria-modal="true" onClick={handleCloseCreateModal}>
          <div className="pg-admin-pricing-create-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pg-admin-pricing-create-header">
              <h2 className="pg-admin-pricing-create-title">Create New Tariff</h2>
              <button
                type="button"
                className="pg-admin-pricing-create-close"
                onClick={handleCloseCreateModal}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {createError && (
              <div className="pg-admin-pricing-form-error">{createError}</div>
            )}

            <form className="pg-admin-pricing-create-form" onSubmit={handleSubmitCreate}>
              {/* Row 1: Vehicle Type & Zone Scope */}
              <div className="pg-admin-pricing-create-field">
                <label className="pg-admin-pricing-create-label">Vehicle Type</label>
                <select
                  className="pg-admin-pricing-create-select"
                  value={createFormData.vehicleType}
                  onChange={(e) => setCreateFormData({ ...createFormData, vehicleType: e.target.value as any })}
                  required
                >
                  <option value="CAR">CAR (Electric Passenger Car)</option>
                  <option value="BIKE">BIKE (2-Wheeler / 3-Wheeler)</option>
                  <option value="BUS">BUS (Commercial Bus / Fleet)</option>
                </select>
              </div>

              <div className="pg-admin-pricing-create-field">
                <label className="pg-admin-pricing-create-label">Zone Scope</label>
                <select
                  className="pg-admin-pricing-create-select"
                  value={createFormData.zoneCode}
                  onChange={(e) => handleZoneScopeChange(e.target.value)}
                  required
                >
                  <option value="Global">Global (All Zones Base Rate)</option>
                  {zones.map((z) => (
                    <option key={z.code} value={z.code}>
                      {z.code} · {z.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 2: Rate & Service Fee */}
              <div className="pg-admin-pricing-create-field">
                <label className="pg-admin-pricing-create-label">Rate (₹/kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  className="pg-admin-pricing-create-input"
                  placeholder="e.g. 12"
                  value={createFormData.ratePerKWhINR}
                  onChange={(e) => setCreateFormData({ ...createFormData, ratePerKWhINR: e.target.value })}
                  required
                />
              </div>

              <div className="pg-admin-pricing-create-field">
                <label className="pg-admin-pricing-create-label">Service Fee (₹)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  className="pg-admin-pricing-create-input"
                  placeholder="e.g. 10"
                  value={createFormData.serviceFeeINR}
                  onChange={(e) => setCreateFormData({ ...createFormData, serviceFeeINR: e.target.value })}
                  required
                />
              </div>

              {/* Row 3: GST (%) & Min. Charge (₹) */}
              <div className="pg-admin-pricing-create-field">
                <label className="pg-admin-pricing-create-label">GST (%)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  className="pg-admin-pricing-create-input"
                  value={createFormData.taxGstPercent}
                  onChange={(e) => setCreateFormData({ ...createFormData, taxGstPercent: e.target.value })}
                  required
                />
              </div>

              <div className="pg-admin-pricing-create-field">
                <label className="pg-admin-pricing-create-label">Minimum Charge (₹)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  className="pg-admin-pricing-create-input"
                  placeholder="e.g. 20"
                  value={createFormData.minChargeINR}
                  onChange={(e) => setCreateFormData({ ...createFormData, minChargeINR: e.target.value })}
                  required
                />
              </div>

              {/* Row 4: Effective Dates */}
              <div className="pg-admin-pricing-create-field">
                <label className="pg-admin-pricing-create-label">Effective From</label>
                <input
                  type="date"
                  className="pg-admin-pricing-create-input"
                  value={createFormData.effectiveFrom}
                  onChange={(e) => setCreateFormData({ ...createFormData, effectiveFrom: e.target.value })}
                  required
                />
              </div>

              <div className="pg-admin-pricing-create-field">
                <label className="pg-admin-pricing-create-label">Effective To</label>
                <input
                  type="date"
                  className="pg-admin-pricing-create-input"
                  value={createFormData.effectiveTo}
                  onChange={(e) => setCreateFormData({ ...createFormData, effectiveTo: e.target.value })}
                  required
                />
              </div>

              {/* Footer */}
              <div className="pg-admin-pricing-create-footer">
                <button
                  type="button"
                  className="pg-admin-pricing-create-cancel"
                  onClick={handleCloseCreateModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="pg-admin-pricing-create-submit"
                  disabled={isCreating}
                >
                  <span>{isCreating ? 'Creating...' : '+ Create Tariff'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPricing;
