import React, { useState, useEffect } from 'react';
import { NetworkBackground } from './components/NetworkBackground/NetworkBackground';
import { PowerGridHero } from './components/PowerGridHero/PowerGridHero';
import { OperationsPanel } from './components/OperationsPanel/OperationsPanel';
import { operationsService } from '../../services/operationsService';
import { OperationsSummary } from '../../types/operations';
import './Home.css';

export const Home: React.FC = () => {
  const [summary, setSummary] = useState<OperationsSummary>({
    totalChargers: 80,
    totalZones: 8,
    totalCities: 5,
    availableChargers: 56,
    activeSessions: 14,
    todayRevenueINR: 12480,
    region: 'Andhra Pradesh',
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const data = await operationsService.getOperationsSummary();
        setSummary(data);
      } catch {
        // Safe fallback values already in initial state
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveData();
  }, []);

  return (
    <div className="pg-home-layout">
      {/* Subtle Infrastructure Network Graphic Background */}
      <NetworkBackground />

      {/* Main Container */}
      <div className="pg-home-container">
        {/* Left / Main Hero Section */}
        <PowerGridHero summary={summary} isLoading={isLoading} />

        {/* Right Operations Center Command Panel */}
        <OperationsPanel summary={summary} isLoading={isLoading} />
      </div>
    </div>
  );
};
