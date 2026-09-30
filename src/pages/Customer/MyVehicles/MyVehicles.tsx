import React, { useState } from 'react';
import { CustomerLayout } from '../../../components/customer/CustomerLayout/CustomerLayout';
import { useVehicles } from './hooks/useVehicles';
import { VehicleRateBanner } from './components/VehicleRateBanner/VehicleRateBanner';
import { VehicleCard } from './components/VehicleCard/VehicleCard';
import { AddVehicleModal } from './components/AddVehicleModal/AddVehicleModal';
import { EditVehicleModal } from './components/EditVehicleModal/EditVehicleModal';
import { DeleteVehicleDialog } from './components/DeleteVehicleDialog/DeleteVehicleDialog';
import { CustomerVehicle } from '../../../types/customer';
import './MyVehicles.css';

export const MyVehicles: React.FC = () => {
  const {
    vehicles,
    isLoading,
    error,
    toastMessage,
    refetch,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    setPrimary,
  } = useVehicles();

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingVehicle, setEditingVehicle] = useState<CustomerVehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<CustomerVehicle | null>(null);

  return (
    <CustomerLayout>
      <div className="pg-vehicles-page">
        {/* Toast Feedback */}
        {toastMessage && (
          <div className="pg-vehicles__toast" role="alert">
            <span>⚡ {toastMessage}</span>
          </div>
        )}

        {/* Page Header matching Screenshot 1 */}
        <div className="pg-vehicles__header">
          <div className="pg-vehicles__header-left">
            <h1 className="pg-vehicles__title">My Vehicles</h1>
            <p className="pg-vehicles__subtitle">
              {vehicles.length} {vehicles.length === 1 ? 'registered vehicle' : 'registered vehicles'}
            </p>
          </div>

          <button
            type="button"
            className="pg-vehicles__add-btn"
            onClick={() => setIsAddModalOpen(true)}
            aria-label="Add new EV to garage"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Vehicle</span>
          </button>
        </div>

        {/* Sample Charging Rate Banner */}
        <VehicleRateBanner />

        {/* Vehicle List / States */}
        {isLoading ? (
          <div className="pg-vehicles__loading">
            <div className="pg-vehicles__spinner" />
            <p>Loading your vehicles...</p>
          </div>
        ) : error ? (
          <div className="pg-vehicles__error">
            <p>{error}</p>
            <button type="button" className="pg-vehicles__retry-btn" onClick={refetch}>
              Retry
            </button>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="pg-vehicles__empty">
            <div className="pg-vehicles__empty-icon">🚗</div>
            <h3>No vehicles added yet</h3>
            <p>Add your EV, bike, or bus to make reservations faster with automatic compatible rates.</p>
            <button
              type="button"
              className="pg-vehicles__empty-cta"
              onClick={() => setIsAddModalOpen(true)}
            >
              + Add Your First Vehicle
            </button>
          </div>
        ) : (
          <div className="pg-vehicles__grid">
            {vehicles.map((veh) => (
              <VehicleCard
                key={veh.id}
                vehicle={veh}
                onEdit={(v) => setEditingVehicle(v)}
                onDelete={(v) => setDeletingVehicle(v)}
                onSetPrimary={setPrimary}
              />
            ))}
          </div>
        )}

        {/* Add Vehicle Modal */}
        {isAddModalOpen && (
          <AddVehicleModal
            onClose={() => setIsAddModalOpen(false)}
            onAdd={addVehicle}
          />
        )}

        {/* Edit Vehicle Modal */}
        {editingVehicle && (
          <EditVehicleModal
            vehicle={editingVehicle}
            onClose={() => setEditingVehicle(null)}
            onUpdate={updateVehicle}
          />
        )}

        {/* Delete Vehicle Confirmation Dialog */}
        {deletingVehicle && (
          <DeleteVehicleDialog
            vehicle={deletingVehicle}
            onClose={() => setDeletingVehicle(null)}
            onConfirmDelete={deleteVehicle}
          />
        )}
      </div>
    </CustomerLayout>
  );
};
