import { useState, useEffect, useMemo, useCallback } from 'react';
import { ChargingHistoryItem } from '../../../../types/customer';
import { customerService } from '../../../../services/customerService';
import { exportChargingHistoryToExcel, ExportFilterInfo } from '../utils/chargingHistoryExport';

export interface AdvancedFiltersState {
  startDate: string;
  endDate: string;
  stationName: string;
  vehicleName: string;
}

export const useChargingHistory = () => {
  const [allSessions, setAllSessions] = useState<ChargingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter states
  const [activeTab, setActiveTab] = useState<string>('All');
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFiltersState>({
    startDate: '',
    endDate: '',
    stationName: '',
    vehicleName: '',
  });

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await customerService.getChargingHistory();
      setAllSessions(data);
    } catch {
      setError('Unable to load charging history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Compute filtered sessions based on active tab and advanced filters
  const filteredSessions = useMemo(() => {
    return allSessions.filter((s) => {
      // Tab filter
      if (activeTab === 'Completed' && s.status !== 'completed') return false;
      if (activeTab === 'Active' && s.status !== 'active') return false;
      if (activeTab === 'CAR' && (s.vehicleType || 'Car').toLowerCase() !== 'car') return false;
      if (activeTab === 'BIKE' && (s.vehicleType || 'Car').toLowerCase() !== 'bike') return false;
      if (activeTab === 'BUS' && (s.vehicleType || 'Car').toLowerCase() !== 'bus') return false;

      // Advanced filters
      if (advancedFilters.startDate && s.date < advancedFilters.startDate) return false;
      if (advancedFilters.endDate && s.date > advancedFilters.endDate) return false;
      if (
        advancedFilters.stationName &&
        !s.stationName.toLowerCase().includes(advancedFilters.stationName.toLowerCase())
      ) {
        return false;
      }
      if (
        advancedFilters.vehicleName &&
        !s.vehicleName.toLowerCase().includes(advancedFilters.vehicleName.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [allSessions, activeTab, advancedFilters]);

  // Compute Summary Statistics from filtered sessions
  const summary = useMemo(() => {
    const totalSessions = filteredSessions.length;
    const totalEnergy = filteredSessions.reduce((acc, curr) => acc + (curr.energyConsumedKWh || 0), 0);
    const totalSpent = filteredSessions.reduce((acc, curr) => acc + (curr.totalCostINR || 0), 0);
    const validDurations = filteredSessions.filter((s) => s.durationMinutes > 0);
    const avgDuration =
      validDurations.length > 0
        ? Math.round(
            validDurations.reduce((acc, curr) => acc + curr.durationMinutes, 0) / validDurations.length
          )
        : 0;

    return {
      totalSessions,
      totalEnergy: Math.round(totalEnergy * 10) / 10,
      totalSpent: Math.round(totalSpent * 100) / 100,
      avgDuration,
    };
  }, [filteredSessions]);

  // Export to Excel
  const handleExport = useCallback(async () => {
    if (filteredSessions.length === 0) {
      showToast('No session records to export.');
      return;
    }

    setIsExporting(true);
    try {
      const filterInfo: ExportFilterInfo = {
        statusFilter: activeTab,
        startDate: advancedFilters.startDate,
        endDate: advancedFilters.endDate,
        stationName: advancedFilters.stationName,
      };

      const filename = exportChargingHistoryToExcel(filteredSessions, filterInfo);
      showToast(`Exported ${filteredSessions.length} sessions to ${filename}`);
    } catch {
      showToast('Failed to export Excel workbook. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [filteredSessions, activeTab, advancedFilters, showToast]);

  const handleResetFilters = useCallback(() => {
    setActiveTab('All');
    setAdvancedFilters({
      startDate: '',
      endDate: '',
      stationName: '',
      vehicleName: '',
    });
  }, []);

  return {
    sessions: filteredSessions,
    allSessionsCount: allSessions.length,
    isLoading,
    error,
    isExporting,
    toastMessage,
    activeTab,
    setActiveTab,
    advancedFilters,
    setAdvancedFilters,
    summary,
    exportToExcel: handleExport,
    resetFilters: handleResetFilters,
    refetch: fetchHistory,
  };
};
