import React, { useEffect, useRef } from 'react';
import { EVStation } from '../../../../../services/stationService';
import { StationCard } from '../StationCard/StationCard';
import './StationList.css';

interface StationListProps {
  stations: EVStation[];
  selectedStationId: string | null;
  onSelectStation: (stationId: string) => void;
  onDetails: (station: EVStation) => void;
  onReserve: (station: EVStation) => void;
  onDirections: (station: EVStation) => void;
  onNotifyMe: (station: EVStation) => void;
  onClearFilters: () => void;
  locationName?: string;
  isLoading?: boolean;
}

export const StationList: React.FC<StationListProps> = ({
  stations,
  selectedStationId,
  onSelectStation,
  onDetails,
  onReserve,
  onDirections,
  onNotifyMe,
  onClearFilters,
  locationName,
  isLoading = false,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Auto-scroll to selected card when selectedStationId changes
  useEffect(() => {
    if (selectedStationId && cardRefs.current[selectedStationId]) {
      cardRefs.current[selectedStationId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedStationId]);

  return (
    <div className="pg-slist">
      {/* Dynamic Count Header matching Screenshot */}
      <div className="pg-slist__count-header">
        <span className="pg-slist__count-num">
          {stations.length} stations found near {locationName || 'you'}
        </span>
      </div>

      {isLoading ? (
        <div className="pg-slist__loading">
          <div className="pg-slist__spinner" />
          <span>Searching nearby charging stations...</span>
        </div>
      ) : stations.length === 0 ? (
        <div className="pg-slist__empty">
          <p className="pg-slist__empty-title">No charging stations found</p>
          <p className="pg-slist__empty-sub">
            Try searching another city or adjusting your vehicle/power filters.
          </p>
          <button
            type="button"
            className="pg-slist__reset-btn"
            onClick={onClearFilters}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="pg-slist__items" ref={listRef}>
          {stations.map((st) => (
            <div
              key={st.id}
              ref={(el) => (cardRefs.current[st.id] = el)}
            >
              <StationCard
                station={st}
                isSelected={st.id === selectedStationId}
                onSelect={onSelectStation}
                onDetails={onDetails}
                onReserve={onReserve}
                onDirections={onDirections}
                onNotifyMe={onNotifyMe}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
