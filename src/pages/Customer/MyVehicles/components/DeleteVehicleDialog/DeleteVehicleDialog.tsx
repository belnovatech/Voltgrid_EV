import React, { useState } from 'react';
import { CustomerVehicle } from '../../../../../types/customer';
import './DeleteVehicleDialog.css';

interface DeleteVehicleDialogProps {
  vehicle: CustomerVehicle;
  onClose: () => void;
  onConfirmDelete: (id: string) => Promise<boolean>;
}

export const DeleteVehicleDialog: React.FC<DeleteVehicleDialogProps> = ({
  vehicle,
  onClose,
  onConfirmDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await onConfirmDelete(vehicle.id);
    setIsDeleting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="pg-del-veh__overlay" onClick={onClose}>
      <div className="pg-del-veh__card" onClick={(e) => e.stopPropagation()}>
        <div className="pg-del-veh__icon-wrap">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </div>

        <h3 className="pg-del-veh__title">Delete Vehicle?</h3>
        <p className="pg-del-veh__message">
          Are you sure you want to remove <strong>"{vehicle.name}"</strong> ({vehicle.licensePlate}) from your garage?
          This vehicle will no longer be available for future charging reservations.
        </p>

        <div className="pg-del-veh__actions">
          <button
            type="button"
            className="pg-del-veh__cancel-btn"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="pg-del-veh__confirm-btn"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Vehicle'}
          </button>
        </div>
      </div>
    </div>
  );
};
