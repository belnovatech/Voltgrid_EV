import React, { useState } from 'react';
import { customerService } from '../../../../../services/customerService';
import { CustomerVehicle } from '../../../../../types/customer';
import './AddVehicleModal.css';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVehicleAdded: (vehicle: CustomerVehicle) => void;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
  onVehicleAdded,
}) => {
  const [name, setName] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [plate, setPlate] = useState<string>('');
  const [type, setType] = useState<'Car' | 'Bike' | 'Bus'>('Car');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !plate.trim()) {
      setError('Please provide vehicle name and registration number.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const newVeh = await customerService.addVehicle({
        name: name.trim(),
        model: model.trim() || 'Standard Edition',
        type,
        licensePlate: plate.trim().toUpperCase(),
        batteryPercentage: 100,
        isDefault: false,
        ratePerKWh: type === 'Bike' ? 8 : type === 'Car' ? 12 : 18,
      });

      onVehicleAdded(newVeh);
      setName('');
      setModel('');
      setPlate('');
      onClose();
    } catch {
      setError('Unable to add vehicle. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pg-avmodal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pg-avmodal" onClick={(e) => e.stopPropagation()}>
        <div className="pg-avmodal__header">
          <div>
            <span className="pg-avmodal__tag">GARAGE MANAGEMENT</span>
            <h2 className="pg-avmodal__title">Add New EV</h2>
          </div>
          <button
            type="button"
            className="pg-avmodal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pg-avmodal__form">
          {error && <div className="pg-avmodal__error">{error}</div>}

          <div className="pg-avmodal__field">
            <label>Vehicle Name / Manufacturer</label>
            <input
              type="text"
              placeholder="e.g. Tata Nexon EV, MG ZS EV"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="pg-avmodal__field">
            <label>Model / Variant / Capacity</label>
            <input
              type="text"
              placeholder="e.g. Max Edition · 40.5 kWh"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>

          <div className="pg-avmodal__field">
            <label>Registration Number</label>
            <input
              type="text"
              placeholder="e.g. AP 16 EV 9999"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              required
            />
          </div>

          <div className="pg-avmodal__field">
            <label>Vehicle Category (Determines Billing Rate)</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'Car' | 'Bike' | 'Bus')}
              className="pg-avmodal__select"
            >
              <option value="Car">Electric Four-Wheeler / Car (₹12/kWh)</option>
              <option value="Bike">Electric Two-Wheeler / Bike (₹8/kWh)</option>
              <option value="Bus">Electric Commercial Bus / Fleet (₹18/kWh)</option>
            </select>
          </div>

          <div className="pg-avmodal__footer">
            <button
              type="button"
              className="pg-avmodal__cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pg-avmodal__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Save EV to Garage'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
