import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  SuperAdminArea,
  SuperAdminAdmin,
  SuperAdminCustomer,
  SuperAdminSettlement,
  SuperAdminDashboardMetrics,
  WorkflowFilters,
} from '../types/superAdmin';
import { superAdminDataService } from '../services/superAdminDataService';

interface SuperAdminContextType {
  filters: WorkflowFilters;
  areas: SuperAdminArea[];
  admins: SuperAdminAdmin[]; // filtered by active area
  allAdmins: SuperAdminAdmin[];
  metrics: SuperAdminDashboardMetrics | null;
  isLoading: boolean;
  error: string | null;
  selectedCustomerModal: SuperAdminCustomer | null;
  selectedSettlementModal: SuperAdminSettlement | null;

  // Actions
  setSelectedAreaId: (areaId: string) => void;
  setSelectedAdminId: (adminId: string) => void;
  setDatePreset: (preset: WorkflowFilters['datePreset']) => void;
  setDateRange: (start: string, end: string) => void;
  setSearchTerm: (term: string) => void;
  resetFilters: () => void;
  refreshData: () => Promise<void>;
  openCustomerModal: (customer: SuperAdminCustomer) => void;
  closeCustomerModal: () => void;
  openSettlementModal: (settlement: SuperAdminSettlement) => void;
  closeSettlementModal: () => void;
}

const DEFAULT_FILTERS: WorkflowFilters = {
  selectedAreaId: 'ALL',
  selectedAdminId: 'ALL',
  datePreset: '30D',
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  searchTerm: '',
};

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined);

export const SuperAdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<WorkflowFilters>(DEFAULT_FILTERS);
  const [areas, setAreas] = useState<SuperAdminArea[]>([]);
  const [allAdmins, setAllAdmins] = useState<SuperAdminAdmin[]>([]);
  const [metrics, setMetrics] = useState<SuperAdminDashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [selectedCustomerModal, setSelectedCustomerModal] = useState<SuperAdminCustomer | null>(null);
  const [selectedSettlementModal, setSelectedSettlementModal] = useState<SuperAdminSettlement | null>(null);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedAreas, fetchedAdmins, calculatedMetrics] = await Promise.all([
        superAdminDataService.fetchAreas(),
        superAdminDataService.fetchAdmins(),
        superAdminDataService.calculateDashboardMetrics(filters),
      ]);
      setAreas(fetchedAreas);
      setAllAdmins(fetchedAdmins);
      setMetrics(calculatedMetrics);
    } catch (err: any) {
      setError(err?.message || 'Failed to load Super Admin business metrics.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Derived admins filtered by selected Area
  const admins = filters.selectedAreaId === 'ALL'
    ? allAdmins
    : allAdmins.filter((adm) => adm.assignedAreaIds.includes(filters.selectedAreaId));

  const setSelectedAreaId = (areaId: string) => {
    setFilters((prev) => {
      // Check if current selected admin is compatible with the new area
      let nextAdminId = prev.selectedAdminId;
      if (areaId !== 'ALL' && nextAdminId !== 'ALL') {
        const adminObj = allAdmins.find((a) => a.id === nextAdminId);
        if (!adminObj || !adminObj.assignedAreaIds.includes(areaId)) {
          // Reset incompatible admin
          nextAdminId = 'ALL';
        }
      }
      return {
        ...prev,
        selectedAreaId: areaId,
        selectedAdminId: nextAdminId,
      };
    });
  };

  const setSelectedAdminId = (adminId: string) => {
    setFilters((prev) => {
      let nextAreaId = prev.selectedAreaId;
      // If admin selected but area is ALL, or admin belongs to another area, align area if single assigned
      if (adminId !== 'ALL') {
        const adminObj = allAdmins.find((a) => a.id === adminId);
        if (adminObj && nextAreaId !== 'ALL' && !adminObj.assignedAreaIds.includes(nextAreaId)) {
          nextAreaId = adminObj.assignedAreaIds[0] || 'ALL';
        }
      }
      return {
        ...prev,
        selectedAdminId: adminId,
        selectedAreaId: nextAreaId,
      };
    });
  };

  const setDatePreset = (preset: WorkflowFilters['datePreset']) => {
    const end = new Date();
    let days = 30;
    if (preset === '7D') days = 7;
    if (preset === '90D') days = 90;
    if (preset === 'YTD') {
      const startOfYear = new Date(end.getFullYear(), 0, 1);
      days = Math.floor((end.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    }
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    setFilters((prev) => ({
      ...prev,
      datePreset: preset,
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
    }));
  };

  const setDateRange = (start: string, end: string) => {
    setFilters((prev) => ({
      ...prev,
      datePreset: 'CUSTOM',
      startDate: start,
      endDate: end,
    }));
  };

  const setSearchTerm = (term: string) => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: term,
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const refreshData = async () => {
    await loadAll();
  };

  return (
    <SuperAdminContext.Provider
      value={{
        filters,
        areas,
        admins,
        allAdmins,
        metrics,
        isLoading,
        error,
        selectedCustomerModal,
        selectedSettlementModal,
        setSelectedAreaId,
        setSelectedAdminId,
        setDatePreset,
        setDateRange,
        setSearchTerm,
        resetFilters,
        refreshData,
        openCustomerModal: (c) => setSelectedCustomerModal(c),
        closeCustomerModal: () => setSelectedCustomerModal(null),
        openSettlementModal: (s) => setSelectedSettlementModal(s),
        closeSettlementModal: () => setSelectedSettlementModal(null),
      }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
};

export function useSuperAdmin(): SuperAdminContextType {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error('useSuperAdmin must be used within a SuperAdminProvider');
  }
  return context;
}
