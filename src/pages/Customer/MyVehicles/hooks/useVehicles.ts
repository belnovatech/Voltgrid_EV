import { useState, useEffect, useCallback } from 'react';
import { CustomerVehicle } from '../../../../types/customer';
import { customerService } from '../../../../services/customerService';

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<CustomerVehicle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await customerService.getVehicles();
      setVehicles(data);
    } catch {
      setError('Unable to load your vehicles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleAddVehicle = useCallback(async (veh: Omit<CustomerVehicle, 'id'>) => {
    try {
      const newVeh = await customerService.addVehicle(veh);
      setVehicles((prev) => {
        if (newVeh.isDefault) {
          return [...prev.map((v) => ({ ...v, isDefault: false })), newVeh];
        }
        return [...prev, newVeh];
      });
      showToast('Vehicle added successfully.');
      return true;
    } catch {
      showToast('Failed to add vehicle. Please try again.');
      return false;
    }
  }, [showToast]);

  const handleUpdateVehicle = useCallback(async (id: string, updates: Partial<CustomerVehicle>) => {
    try {
      const updated = await customerService.updateVehicle(id, updates);
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.id === id) return updated;
          if (updates.isDefault) return { ...v, isDefault: false };
          return v;
        })
      );
      showToast('Vehicle updated successfully.');
      return true;
    } catch {
      showToast('Failed to update vehicle. Please try again.');
      return false;
    }
  }, [showToast]);

  const handleDeleteVehicle = useCallback(async (id: string) => {
    try {
      const success = await customerService.deleteVehicle(id);
      if (success) {
        // Re-fetch to get updated primary assignments
        const fresh = await customerService.getVehicles();
        setVehicles(fresh);
        showToast('Vehicle deleted successfully.');
        return true;
      }
      showToast('Unable to delete vehicle.');
      return false;
    } catch {
      showToast('Failed to delete vehicle.');
      return false;
    }
  }, [showToast]);

  const handleSetPrimary = useCallback(async (id: string) => {
    try {
      const success = await customerService.setPrimaryVehicle(id);
      if (success) {
        setVehicles((prev) =>
          prev.map((v) => ({
            ...v,
            isDefault: v.id === id,
          }))
        );
        showToast('Primary vehicle updated.');
        return true;
      }
      return false;
    } catch {
      showToast('Failed to set primary vehicle.');
      return false;
    }
  }, [showToast]);

  return {
    vehicles,
    isLoading,
    error,
    toastMessage,
    refetch: fetchVehicles,
    addVehicle: handleAddVehicle,
    updateVehicle: handleUpdateVehicle,
    deleteVehicle: handleDeleteVehicle,
    setPrimary: handleSetPrimary,
  };
};
