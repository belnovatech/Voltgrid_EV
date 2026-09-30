import React, { useState } from 'react';
import { CustomerVehicle } from '../../../../../types/customer';
import '../AddVehicleModal/AddVehicleModal.css';

interface EditVehicleModalProps {
  vehicle: CustomerVehicle;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<CustomerVehicle>) => Promise<boolean>;
}

const MANUFACTURERS: Record<'Car' | 'Bike' | 'Bus', string[]> = {
  Car: ['Tata Motors', 'MG Motors', 'Hyundai', 'Mahindra', 'BYD', 'Kia', 'BMW', 'Other'],
  Bike: ['Ola Electric', 'Ather Energy', 'TVS', 'Bajaj Auto', 'Hero Electric', 'Revolt', 'Other'],
  Bus: ['Tata Motors', 'Olectra Greentech', 'JBM Auto', 'Ashok Leyland', 'Eicher', 'Other'],
};

export const EditVehicleModal: React.FC<EditVehicleModalProps> = ({
  vehicle,
  onClose,
  onUpdate,
}) => {
  const initialCategory: 'Car' | 'Bike' | 'Bus' = vehicle.type || 'Car';
  const [category, setCategory] = useState<'Car' | 'Bike' | 'Bus'>(initialCategory);
  const [manufacturer, setManufacturer] = useState<string>(
    vehicle.manufacturer || MANUFACTURERS[initialCategory][0]
  );
  const [model, setModel] = useState<string>(vehicle.model || '');
  const [nickname, setNickname] = useState<string>(vehicle.name || '');
  const [registration, setRegistration] = useState<string>(vehicle.licensePlate || '');
  const [battery, setBattery] = useState<string>(
    String(vehicle.batteryCapacityKWh || (vehicle.type === 'Bike' ? 4 : 40.5))
  );
  const [connector, setConnector] = useState<'CCS2' | 'Type 2' | 'GB/T' | 'CHAdeMO'>(
    vehicle.connector || 'CCS2'
  );
  const [isPrimary, setIsPrimary] = useState<boolean>(vehicle.isDefault);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleCategoryChange = (newCat: 'Car' | 'Bike' | 'Bus') => {
    setCategory(newCat);
    const mfgList = MANUFACTURERS[newCat];
    if (!mfgList.includes(manufacturer)) {
      setManufacturer(mfgList[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const cleanNick = nickname.trim();
    const cleanPlate = registration.trim().toUpperCase();
    const batteryNum = parseFloat(battery);

    if (!cleanPlate) {
      setValidationError('Registration number is required.');
      return;
    }
    if (isNaN(batteryNum) || batteryNum <= 0) {
      setValidationError('Battery capacity must be a positive number.');
      return;
    }

    setIsSubmitting(true);
    const rate = category === 'Bike' ? 8 : category === 'Bus' ? 18 : 12;

    const success = await onUpdate(vehicle.id, {
      name: cleanNick || `${manufacturer} ${model}`,
      manufacturer,
      model: model.trim() || 'Standard Edition',
      type: category,
      licensePlate: cleanPlate,
      batteryCapacityKWh: batteryNum,
      connector,
      isDefault: isPrimary,
      ratePerKWh: rate,
    });

    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="pg-veh-modal__overlay" onClick={onClose}>
      <div className="pg-veh-modal__card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="pg-veh-modal__header">
          <h2 className="pg-veh-modal__title">Edit Vehicle</h2>
          <button
            type="button"
            className="pg-veh-modal__close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pg-veh-modal__form">
          {/* Vehicle Category Selector */}
          <div className="pg-veh-modal__field-group">
            <label className="pg-veh-modal__label">Vehicle Category</label>
            <div className="pg-veh-modal__category-grid">
              <button
                type="button"
                className={`pg-veh-modal__cat-btn ${
                  category === 'Car' ? 'pg-veh-modal__cat-btn--active' : ''
                }`}
                onClick={() => handleCategoryChange('Car')}
              >
                <div className="pg-veh-modal__cat-icon pg-veh-modal__cat-icon--car">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.5l1.5-3h8l1.5 3H19a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M5 17a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2" />
                    <circle cx="7.5" cy="13.5" r="1.5" />
                    <circle cx="16.5" cy="13.5" r="1.5" />
                  </svg>
                </div>
                <span className="pg-veh-modal__cat-title">CAR</span>
                <span className="pg-veh-modal__cat-rate">₹12/kWh</span>
              </button>

              <button
                type="button"
                className={`pg-veh-modal__cat-btn ${
                  category === 'Bike' ? 'pg-veh-modal__cat-btn--active' : ''
                }`}
                onClick={() => handleCategoryChange('Bike')}
              >
                <div className="pg-veh-modal__cat-icon pg-veh-modal__cat-icon--bike">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="5.5" cy="17.5" r="3.5" />
                    <circle cx="18.5" cy="17.5" r="3.5" />
                    <path d="M15 6h-3l-3 7h10l-2-7z" />
                    <path d="M12 17v-4l-3-3" />
                  </svg>
                </div>
                <span className="pg-veh-modal__cat-title">BIKE</span>
                <span className="pg-veh-modal__cat-rate">₹8/kWh</span>
              </button>

              <button
                type="button"
                className={`pg-veh-modal__cat-btn ${
                  category === 'Bus' ? 'pg-veh-modal__cat-btn--active' : ''
                }`}
                onClick={() => handleCategoryChange('Bus')}
              >
                <div className="pg-veh-modal__cat-icon pg-veh-modal__cat-icon--bus">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="3" width="16" height="16" rx="2" />
                    <path d="M4 11h16" />
                    <circle cx="8" cy="15" r="1.5" />
                    <circle cx="16" cy="15" r="1.5" />
                  </svg>
                </div>
                <span className="pg-veh-modal__cat-title">BUS</span>
                <span className="pg-veh-modal__cat-rate">₹18/kWh</span>
              </button>
            </div>
          </div>

          {/* Form Rows */}
          <div className="pg-veh-modal__row">
            <div className="pg-veh-modal__col">
              <label className="pg-veh-modal__label">Manufacturer</label>
              <select
                className="pg-veh-modal__input"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
              >
                {MANUFACTURERS[category].map((mfg) => (
                  <option key={mfg} value={mfg}>
                    {mfg}
                  </option>
                ))}
              </select>
            </div>

            <div className="pg-veh-modal__col">
              <label className="pg-veh-modal__label">Model</label>
              <input
                type="text"
                className="pg-veh-modal__input"
                placeholder="e.g. Nexon EV Max"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pg-veh-modal__row">
            <div className="pg-veh-modal__col">
              <label className="pg-veh-modal__label">Nickname</label>
              <input
                type="text"
                className="pg-veh-modal__input"
                placeholder="e.g. My Nexon"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div className="pg-veh-modal__col">
              <label className="pg-veh-modal__label">Registration No.</label>
              <input
                type="text"
                className="pg-veh-modal__input"
                placeholder="e.g. AP-39-AB-1234"
                value={registration}
                onChange={(e) => setRegistration(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pg-veh-modal__row">
            <div className="pg-veh-modal__col">
              <label className="pg-veh-modal__label">Battery (kWh)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                className="pg-veh-modal__input"
                placeholder="e.g. 40.5"
                value={battery}
                onChange={(e) => setBattery(e.target.value)}
                required
              />
            </div>

            <div className="pg-veh-modal__col">
              <label className="pg-veh-modal__label">Connector</label>
              <select
                className="pg-veh-modal__input"
                value={connector}
                onChange={(e) =>
                  setConnector(e.target.value as 'CCS2' | 'Type 2' | 'GB/T' | 'CHAdeMO')
                }
              >
                <option value="CCS2">CCS2 (DC Fast / Hyper)</option>
                <option value="Type 2">Type 2 (AC Normal)</option>
                <option value="GB/T">GB/T</option>
                <option value="CHAdeMO">CHAdeMO</option>
              </select>
            </div>
          </div>

          {/* Primary Checkbox */}
          <label className="pg-veh-modal__checkbox-label">
            <input
              type="checkbox"
              className="pg-veh-modal__checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
            />
            <span>Set as primary vehicle</span>
          </label>

          {validationError && (
            <div className="pg-veh-modal__error">{validationError}</div>
          )}

          {/* Save Action */}
          <button
            type="submit"
            className="pg-veh-modal__submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
