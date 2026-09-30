import React, { useState, useRef, useEffect, useMemo } from 'react';
import { EVStation } from '../../../../../services/stationService';
import './ChargerMap.css';

interface ChargerMapProps {
  stations: EVStation[];
  selectedStationId: string | null;
  onSelectStation: (stationId: string) => void;
  centerCoords?: { lat: number; lng: number };
  zoomLevel?: number;
  onLocateMe?: () => void;
}

export const ChargerMap: React.FC<ChargerMapProps> = ({
  stations,
  selectedStationId,
  onSelectStation,
  centerCoords = { lat: 16.5062, lng: 80.6480 },
  zoomLevel = 13,
  onLocateMe,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(zoomLevel);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    setZoom(zoomLevel);
  }, [zoomLevel]);

  // When centerCoords change, smoothly re-center panOffset
  useEffect(() => {
    setPanOffset({ x: 0, y: 0 });
  }, [centerCoords.lat, centerCoords.lng]);

  // Compute bounding box for projection
  const bounds = useMemo(() => {
    if (stations.length === 0) {
      return {
        minLat: centerCoords.lat - 0.2,
        maxLat: centerCoords.lat + 0.2,
        minLng: centerCoords.lng - 0.2,
        maxLng: centerCoords.lng + 0.2,
      };
    }
    const lats = stations.map((s) => s.lat);
    const lngs = stations.map((s) => s.lng);
    return {
      minLat: Math.min(...lats, centerCoords.lat - 0.15),
      maxLat: Math.max(...lats, centerCoords.lat + 0.15),
      minLng: Math.min(...lngs, centerCoords.lng - 0.15),
      maxLng: Math.max(...lngs, centerCoords.lng + 0.15),
    };
  }, [stations, centerCoords]);

  // Project lat/lng to percentage coordinates on map canvas
  const getMarkerPosition = (lat: number, lng: number) => {
    const latSpan = bounds.maxLat - bounds.minLat || 0.1;
    const lngSpan = bounds.maxLng - bounds.minLng || 0.1;

    // Invert lat for Y (higher lat is top)
    const normX = ((lng - bounds.minLng) / lngSpan) * 80 + 10;
    const normY = (1 - (lat - bounds.minLat) / latSpan) * 80 + 10;

    return { x: normX, y: normY };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom((z) => Math.min(z + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(z - 1, 8));
  };

  const handleLocateMe = () => {
    setPanOffset({ x: 0, y: 0 });
    setZoom(14);
    if (onLocateMe) {
      onLocateMe();
    }
  };

  return (
    <div
      className="pg-cmap"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      role="region"
      aria-label="Interactive EV Grid Map"
    >
      {/* Top Left Title Overlay matching Screenshot */}
      <div className="pg-cmap__region-tag" aria-hidden="true">
        <span>Andhra Pradesh · EV Grid</span>
      </div>

      {/* Map Controls Top-Right matching Screenshot */}
      <div className="pg-cmap__controls" role="toolbar" aria-label="Map controls">
        <button
          type="button"
          className="pg-cmap__ctrl-btn"
          onClick={handleZoomIn}
          title="Zoom in"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          className="pg-cmap__ctrl-btn"
          onClick={handleZoomOut}
          title="Zoom out"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          type="button"
          className="pg-cmap__ctrl-btn pg-cmap__ctrl-btn--locate"
          onClick={handleLocateMe}
          title="Locate me"
          aria-label="Locate me"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
        </button>
      </div>

      {/* Interactive Map Canvas */}
      <div
        className="pg-cmap__canvas"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${1 + (zoom - 12) * 0.12})`,
        }}
      >
        {/* Background Grid Lines matching Screenshot */}
        <div className="pg-cmap__grid-bg" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cmap-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.07)" strokeWidth="1" />
                <circle cx="40" cy="40" r="1.5" fill="rgba(56, 189, 248, 0.15)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="#060c18" />
            <rect width="100%" height="100%" fill="url(#cmap-grid)" />
          </svg>
        </div>

        {/* Station Markers */}
        <div className="pg-cmap__markers-layer">
          {stations.map((st) => {
            const isSelected = st.id === selectedStationId;
            const pos = getMarkerPosition(st.lat, st.lng);

            const badgeClass =
              st.status === 'available'
                ? 'pg-cmap__badge--available'
                : st.status === 'partial'
                ? 'pg-cmap__badge--partial'
                : 'pg-cmap__badge--full';

            const dotColor =
              st.status === 'available'
                ? '#9ae600'
                : st.status === 'partial'
                ? '#38bdf8'
                : '#ef4444';

            return (
              <div
                key={st.id}
                className={`pg-cmap__marker ${isSelected ? 'pg-cmap__marker--selected' : ''}`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStation(st.id);
                }}
                role="button"
                tabIndex={0}
                aria-label={`${st.name}, ${st.availableChargers}/${st.totalChargers} Available`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectStation(st.id);
                  }
                }}
              >
                {/* Station Availability Pill matching Screenshot */}
                <div className={`pg-cmap__badge ${badgeClass}`}>
                  <span>
                    {st.availableChargers}/{st.totalChargers}
                  </span>
                </div>

                {/* Point dot & ripple */}
                <div className="pg-cmap__pin-point" style={{ backgroundColor: dotColor }}>
                  {isSelected && <div className="pg-cmap__pulse-ring" style={{ borderColor: dotColor }} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map Legend Bottom-Left matching Screenshot */}
      <div className="pg-cmap__legend" role="note" aria-label="Map availability legend">
        <div className="pg-cmap__legend-item">
          <span className="pg-cmap__legend-dot pg-cmap__legend-dot--available" />
          <span>Available</span>
        </div>
        <div className="pg-cmap__legend-item">
          <span className="pg-cmap__legend-dot pg-cmap__legend-dot--partial" />
          <span>Partial</span>
        </div>
        <div className="pg-cmap__legend-item">
          <span className="pg-cmap__legend-dot pg-cmap__legend-dot--full" />
          <span>Full</span>
        </div>
      </div>
    </div>
  );
};
