import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EVStation } from '../../../../../services/stationService';
import './RealMap.css';

interface RealMapProps {
  stations: EVStation[];
  selectedStationId: string | null;
  onSelectStation: (stationId: string) => void;
  centerCoords: { lat: number; lng: number };
  zoomLevel: number;
  cityName?: string;
  onLocateMe?: () => void;
}

export const RealMap: React.FC<RealMapProps> = ({
  stations,
  selectedStationId,
  onSelectStation,
  centerCoords,
  zoomLevel,
  cityName = 'Hyderabad & AP',
  onLocateMe,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const markersMapRef = useRef<Record<string, L.Marker>>({});

  // 1. Initialize Real Leaflet Map with authentic OpenStreetMap tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerCoords.lat, centerCoords.lng],
        zoom: zoomLevel,
        zoomControl: false,
        attributionControl: false,
        preferCanvas: true,
      });

      // Standard OpenStreetMap / CartoDB tiles showing genuine streets, highways, and cities
      const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      
      const mainTiles = L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        crossOrigin: true,
      });

      mainTiles.addTo(map);

      // Attribution
      L.control
        .attribution({
          position: 'bottomright',
          prefix: false,
        })
        .addAttribution('© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors')
        .addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Invalidate size on mount after DOM layout completes
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 300);
    }

    // ResizeObserver to constantly guarantee tile rendering on any resize or flex layout change
    let resizeObserver: ResizeObserver | null = null;
    if (mapContainerRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. React to Center & Zoom changes smoothly (e.g. searching Hyderabad, Guntur, Vijayawada)
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([centerCoords.lat, centerCoords.lng], zoomLevel, {
        animate: true,
        duration: 1.0,
      });
      mapInstanceRef.current.invalidateSize();
    }
  }, [centerCoords.lat, centerCoords.lng, zoomLevel]);

  // 3. Render Custom Data-Driven Markers at exact GPS coordinates
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    markersMapRef.current = {};

    stations.forEach((st) => {
      const isSelected = st.id === selectedStationId;
      const isFull = st.availableChargers === 0 || st.status === 'full';
      const isPartial = st.status === 'partial' || (st.availableChargers > 0 && st.availableChargers < st.totalChargers);

      const statusClass = isFull ? 'pg-rmarker--full' : isPartial ? 'pg-rmarker--partial' : 'pg-rmarker--available';

      // Compact, professional pin with availability badge and lightning icon
      const customIcon = L.divIcon({
        className: 'pg-leaflet-custom-icon',
        html: `
          <div class="pg-rmarker ${statusClass} ${isSelected ? 'pg-rmarker--selected' : ''}">
            <div class="pg-rmarker__badge">
              <span>${st.availableChargers}/${st.totalChargers}</span>
            </div>
            <div class="pg-rmarker__pin">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
          </div>
        `,
        iconSize: [40, 46],
        iconAnchor: [20, 42],
        popupAnchor: [0, -42],
      });

      const marker = L.marker([st.lat, st.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectStation(st.id);
      });

      marker.bindTooltip(
        `<div class="pg-tip-content"><strong>${st.name}</strong><span>${st.address} • ⚡ ${st.powerKw} kW</span></div>`,
        {
          direction: 'top',
          offset: [0, -36],
          className: 'pg-map-tooltip',
        }
      );

      marker.addTo(markersLayer);
      markersMapRef.current[st.id] = marker;
    });

    // Fit bounds if we have multiple stations
    if (stations.length > 1) {
      const bounds = L.latLngBounds(stations.map((s) => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [stations, selectedStationId]);

  // 4. Focus on selected marker if changed
  useEffect(() => {
    if (selectedStationId && mapInstanceRef.current && markersMapRef.current[selectedStationId]) {
      const marker = markersMapRef.current[selectedStationId];
      const latLng = marker.getLatLng();
      mapInstanceRef.current.flyTo(latLng, Math.max(mapInstanceRef.current.getZoom(), 14), {
        animate: true,
        duration: 0.8,
      });
      marker.openTooltip();
    }
  }, [selectedStationId]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleLocateMe = () => {
    if (onLocateMe) {
      onLocateMe();
    }
  };

  return (
    <div className="pg-realmap-wrapper" role="region" aria-label="Real EV Charging Map">
      {/* Top Left City & Network Header Overlay */}
      <div className="pg-realmap__top-badge" aria-hidden="true">
        <div className="pg-realmap__live-dot" />
        <span>PowerGrid Network · {cityName}</span>
      </div>

      {/* Map Zoom & Location Controls */}
      <div className="pg-realmap__controls" role="toolbar" aria-label="Map controls">
        <button
          type="button"
          className="pg-realmap__ctrl-btn"
          onClick={handleZoomIn}
          title="Zoom In"
          aria-label="Zoom In"
        >
          +
        </button>
        <button
          type="button"
          className="pg-realmap__ctrl-btn"
          onClick={handleZoomOut}
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          −
        </button>
        <button
          type="button"
          className="pg-realmap__ctrl-btn pg-realmap__ctrl-btn--locate"
          onClick={handleLocateMe}
          title="Locate Current City"
          aria-label="Locate Current City"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
        </button>
      </div>

      {/* Real Leaflet DOM Container */}
      <div ref={mapContainerRef} className="pg-realmap__container" />

      {/* Map Availability Legend Bottom-Left */}
      <div className="pg-realmap__legend" role="note" aria-label="Map availability legend">
        <div className="pg-realmap__legend-item">
          <span className="pg-realmap__legend-dot pg-realmap__legend-dot--available" />
          <span>Available</span>
        </div>
        <div className="pg-realmap__legend-item">
          <span className="pg-realmap__legend-dot pg-realmap__legend-dot--partial" />
          <span>Partial</span>
        </div>
        <div className="pg-realmap__legend-item">
          <span className="pg-realmap__legend-dot pg-realmap__legend-dot--full" />
          <span>Full</span>
        </div>
      </div>
    </div>
  );
};
