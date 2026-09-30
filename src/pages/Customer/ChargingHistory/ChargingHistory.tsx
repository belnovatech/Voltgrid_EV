import React, { useState } from 'react';
import { CustomerLayout } from '../../../components/customer/CustomerLayout/CustomerLayout';
import { useChargingHistory } from './hooks/useChargingHistory';
import { ChargingHistoryHeader } from './components/ChargingHistoryHeader/ChargingHistoryHeader';
import { ChargingHistorySummary } from './components/ChargingHistorySummary/ChargingHistorySummary';
import { ChargingHistoryFilters } from './components/ChargingHistoryFilters/ChargingHistoryFilters';
import { MoreFiltersModal } from './components/MoreFiltersModal/MoreFiltersModal';
import { ChargingSessionCard } from './components/ChargingSessionCard/ChargingSessionCard';
import { ChargingHistoryEmpty } from './components/ChargingHistoryEmpty/ChargingHistoryEmpty';
import { ChargingHistorySkeleton } from './components/ChargingHistorySkeleton/ChargingHistorySkeleton';
import './ChargingHistory.css';

export const ChargingHistory: React.FC = () => {
  const {
    sessions,
    allSessionsCount,
    isLoading,
    error,
    isExporting,
    toastMessage,
    activeTab,
    setActiveTab,
    advancedFilters,
    setAdvancedFilters,
    summary,
    exportToExcel,
    resetFilters,
    refetch,
  } = useChargingHistory();

  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState<boolean>(false);

  const hasActiveAdvancedFilters = Boolean(
    advancedFilters.startDate ||
      advancedFilters.endDate ||
      advancedFilters.stationName ||
      advancedFilters.vehicleName
  );

  const isFiltered = activeTab !== 'All' || hasActiveAdvancedFilters;

  return (
    <CustomerLayout>
      <div className="powergrid-charging-history-page">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="powergrid-charging-history__toast" role="alert">
            <span>⚡ {toastMessage}</span>
          </div>
        )}

        {/* Header matching Screenshot */}
        <ChargingHistoryHeader
          totalCount={summary.totalSessions}
          isExporting={isExporting}
          onExport={exportToExcel}
        />

        {/* 4 Summary Cards matching Screenshot */}
        <ChargingHistorySummary
          totalSessions={summary.totalSessions}
          totalEnergy={summary.totalEnergy}
          totalSpent={summary.totalSpent}
          avgDuration={summary.avgDuration}
        />

        {/* Tabs & More Filters */}
        <ChargingHistoryFilters
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenMoreFilters={() => setIsMoreFiltersOpen(true)}
          hasActiveAdvancedFilters={hasActiveAdvancedFilters}
        />

        {/* Sessions List */}
        <div className="powergrid-charging-history__list-container">
          {isLoading ? (
            <ChargingHistorySkeleton />
          ) : error ? (
            <div className="powergrid-charging-history__error">
              <p>{error}</p>
              <button
                type="button"
                className="powergrid-charging-history__retry-btn"
                onClick={refetch}
              >
                Retry
              </button>
            </div>
          ) : sessions.length === 0 ? (
            <ChargingHistoryEmpty
              isFiltered={isFiltered && allSessionsCount > 0}
              onResetFilters={resetFilters}
            />
          ) : (
            <div className="powergrid-charging-history__list">
              {sessions.map((sess) => (
                <ChargingSessionCard key={sess.id} session={sess} />
              ))}
            </div>
          )}
        </div>

        {/* Advanced Filters Modal */}
        {isMoreFiltersOpen && (
          <MoreFiltersModal
            filters={advancedFilters}
            onClose={() => setIsMoreFiltersOpen(false)}
            onApply={setAdvancedFilters}
            onReset={resetFilters}
          />
        )}
      </div>
    </CustomerLayout>
  );
};
