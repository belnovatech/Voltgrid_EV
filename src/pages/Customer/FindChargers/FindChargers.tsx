import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CustomerLayout } from '../../../components/customer/CustomerLayout/CustomerLayout';
import { stationService, EVStation } from '../../../services/stationService';
import { RealMap } from './components/RealMap/RealMap';
import { SearchBar } from './components/SearchBar/SearchBar';
import { FilterChips } from './components/FilterChips/FilterChips';
import { StationList } from './components/StationList/StationList';
import { StationDetailsDrawer } from './components/StationDetailsDrawer/StationDetailsDrawer';
import { AdvancedFiltersModal } from './components/AdvancedFiltersModal/AdvancedFiltersModal';
import { ReserveModal } from '../Dashboard/components/ReserveModal/ReserveModal';
import './FindChargers.css';

export const FindChargers: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('q') || searchParams.get('search') || 'Hyderabad';
  const initialStation = searchParams.get('station') || null;

  const [stations, setStations] = useState<EVStation[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [activeLocationName, setActiveLocationName] = useState<string>('Hyderabad');
  const [selectedVehicle, setSelectedVehicle] = useState<'All' | 'Car' | 'Bike' | 'Bus'>('Car');
  const [selectedStationId, setSelectedStationId] = useState<string | null>(initialStation);

  // Map coordinates state (Defaults to Hyderabad central hub)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 17.3850,
    lng: 78.4867,
  });
  const [mapZoom, setMapZoom] = useState<number>(12);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string>('');

  // Advanced Filters state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [minPowerKw, setMinPowerKw] = useState<number>(0);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [selectedConnector, setSelectedConnector] = useState<string>('All');

  // Modals state
  const [detailStation, setDetailStation] = useState<EVStation | null>(null);
  const [reserveStation, setReserveStation] = useState<EVStation | null>(null);

  // Load stations around active center coordinates & search text
  const fetchStations = async (
    center: { lat: number; lng: number },
    queryText: string,
    vehType: 'All' | 'Car' | 'Bike' | 'Bus',
    powerMin: number,
    onlyAvail: boolean,
    connector: string
  ) => {
    setIsLoading(true);
    try {
      let results = await stationService.getStations({
        centerLat: center.lat,
        centerLng: center.lng,
        search: queryText,
        vehicleType: vehType,
        minPowerKw: powerMin > 0 ? powerMin : undefined,
      });

      if (onlyAvail) {
        results = results.filter((s) => s.availableChargers > 0 && s.status !== 'full');
      }

      if (connector !== 'All') {
        results = results.filter((s) => s.connectorType.toLowerCase().includes(connector.toLowerCase()));
      }

      setStations(results);

      // Auto-select first station if current selection is outside new result set
      if (results.length > 0) {
        if (!selectedStationId || !results.some((s) => s.id === selectedStationId)) {
          setSelectedStationId(results[0].id);
        }
      } else {
        setSelectedStationId(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    // Perform initial geocode for initialSearch (Hyderabad)
    stationService.geocode(initialSearch).then((geo) => {
      if (geo) {
        setMapCenter({ lat: geo.lat, lng: geo.lng });
        setMapZoom(geo.zoom);
        setActiveLocationName(geo.name);
        fetchStations(
          { lat: geo.lat, lng: geo.lng },
          initialSearch,
          selectedVehicle,
          minPowerKw,
          onlyAvailable,
          selectedConnector
        );
      } else {
        fetchStations(
          mapCenter,
          initialSearch,
          selectedVehicle,
          minPowerKw,
          onlyAvailable,
          selectedConnector
        );
      }
    });
  }, []);

  // When filters change, re-fetch
  useEffect(() => {
    fetchStations(
      mapCenter,
      searchQuery,
      selectedVehicle,
      minPowerKw,
      onlyAvailable,
      selectedConnector
    );
  }, [selectedVehicle, minPowerKw, onlyAvailable, selectedConnector]);

  // Handle Search input submit / Enter
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setIsLoading(true);
    const geo = await stationService.geocode(query);

    if (geo) {
      setMapCenter({ lat: geo.lat, lng: geo.lng });
      setMapZoom(geo.zoom);
      setActiveLocationName(geo.name);
      await fetchStations(
        { lat: geo.lat, lng: geo.lng },
        query,
        selectedVehicle,
        minPowerKw,
        onlyAvailable,
        selectedConnector
      );
      setSearchParams({ q: query });
      showToast(`📍 Found location: ${geo.name}. Showing nearby charging stations.`);
    } else {
      // Fallback: text search on current center
      await fetchStations(
        mapCenter,
        query,
        selectedVehicle,
        minPowerKw,
        onlyAvailable,
        selectedConnector
      );
      showToast(`Searching for stations matching "${query}"...`);
    }
  };

  const handleSelectStation = (stationId: string) => {
    setSelectedStationId(stationId);
    const st = stations.find((s) => s.id === stationId);
    if (st) {
      setMapCenter({ lat: st.lat, lng: st.lng });
      setMapZoom(14);
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setMapCenter({ lat, lng });
          setMapZoom(14);
          setActiveLocationName('Your Current GPS Location');
          fetchStations(
            { lat, lng },
            '',
            selectedVehicle,
            minPowerKw,
            onlyAvailable,
            selectedConnector
          );
          showToast('📍 Map centered on your current GPS location.');
        },
        () => {
          // Fallback to Hyderabad
          const fallback = { lat: 17.3850, lng: 78.4867 };
          setMapCenter(fallback);
          setMapZoom(12);
          setActiveLocationName('Hyderabad');
          fetchStations(
            fallback,
            'Hyderabad',
            selectedVehicle,
            minPowerKw,
            onlyAvailable,
            selectedConnector
          );
          showToast('📍 Centered on Hyderabad.');
        }
      );
    } else {
      const fallback = { lat: 17.3850, lng: 78.4867 };
      setMapCenter(fallback);
      setMapZoom(12);
      setActiveLocationName('Hyderabad');
      fetchStations(
        fallback,
        'Hyderabad',
        selectedVehicle,
        minPowerKw,
        onlyAvailable,
        selectedConnector
      );
      showToast('📍 Centered on Hyderabad.');
    }
  };

  const handleDirections = (station: EVStation) => {
    showToast(`🗺️ Turn-by-turn navigation started to ${station.name} (${station.distanceKm} km away).`);
  };

  const handleNotifyMe = (station: EVStation) => {
    showToast(`✓ You will receive an SMS when a charging slot opens up at ${station.name}.`);
  };

  const handleReserveSuccess = () => {
    setReserveStation(null);
    showToast('✓ Slot reserved successfully! View your booking under Reservations.');
  };

  const handleClearFilters = () => {
    setSearchQuery('Hyderabad');
    setActiveLocationName('Hyderabad');
    setSelectedVehicle('Car');
    setMinPowerKw(0);
    setOnlyAvailable(false);
    setSelectedConnector('All');
    setMapCenter({ lat: 17.3850, lng: 78.4867 });
    setMapZoom(12);
    fetchStations({ lat: 17.3850, lng: 78.4867 }, 'Hyderabad', 'Car', 0, false, 'All');
    setSearchParams({});
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4500);
  };

  // Get active vehicle rate for CAR filter chip
  const carRate = stations.find((s) => s.vehicleTypes.includes('Car'))?.ratePerKWh || 12;

  return (
    <CustomerLayout>
      <div className="pg-find-page">
        {/* Toast Alert */}
        {toastMsg && (
          <div className="pg-find__toast" role="status">
            <span>{toastMsg}</span>
            <button
              type="button"
              className="pg-find__toast-close"
              onClick={() => setToastMsg('')}
            >
              ✕
            </button>
          </div>
        )}

        <div className="pg-find__layout">
          {/* LEFT: REAL INTERACTIVE LEAFLET MAP */}
          <div className="pg-find__map-col">
            <RealMap
              stations={stations}
              selectedStationId={selectedStationId}
              onSelectStation={handleSelectStation}
              centerCoords={mapCenter}
              zoomLevel={mapZoom}
              cityName={activeLocationName}
              onLocateMe={handleLocateMe}
            />
          </div>

          {/* RIGHT: SEARCH, FILTERS & STATION RESULTS PANEL */}
          <div className="pg-find__panel-col">
            <div className="pg-find__panel-card">
              {/* Top Search Field */}
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={handleSearchSubmit}
                placeholder="Search station, city or area (e.g. Hyderabad, Banjara Hills)..."
              />

              {/* Vehicle Filter Chips matching Screenshot */}
              <FilterChips
                selectedVehicle={selectedVehicle}
                onSelectVehicle={setSelectedVehicle}
                carRate={carRate}
                onOpenAdvancedFilters={() => setIsFilterModalOpen(true)}
              />

              {/* Station List with dynamic counter ("X stations found near <Location>") */}
              <StationList
                stations={stations}
                selectedStationId={selectedStationId}
                onSelectStation={handleSelectStation}
                onDetails={(st) => setDetailStation(st)}
                onReserve={(st) => setReserveStation(st)}
                onDirections={handleDirections}
                onNotifyMe={handleNotifyMe}
                onClearFilters={handleClearFilters}
                locationName={activeLocationName}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Station Details Drawer */}
        <StationDetailsDrawer
          station={detailStation}
          onClose={() => setDetailStation(null)}
          onReserve={(st) => {
            setDetailStation(null);
            setReserveStation(st);
          }}
          onDirections={handleDirections}
        />

        {/* Advanced Filters Modal */}
        <AdvancedFiltersModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          minPowerKw={minPowerKw}
          onMinPowerChange={setMinPowerKw}
          onlyAvailable={onlyAvailable}
          onOnlyAvailableChange={setOnlyAvailable}
          selectedConnector={selectedConnector}
          onConnectorChange={setSelectedConnector}
          onReset={() => {
            setMinPowerKw(0);
            setOnlyAvailable(false);
            setSelectedConnector('All');
          }}
        />

        {/* Reservation Modal */}
        <ReserveModal
          station={
            reserveStation
              ? {
                  id: reserveStation.id,
                  name: reserveStation.name,
                  city: reserveStation.city,
                  distanceKm: reserveStation.distanceKm,
                  availablePoints: reserveStation.availableChargers,
                  totalPoints: reserveStation.totalChargers,
                  powerKw: reserveStation.powerKw,
                  ratePerKWh: reserveStation.ratePerKWh,
                }
              : null
          }
          onClose={() => setReserveStation(null)}
          onSuccess={handleReserveSuccess}
        />
      </div>
    </CustomerLayout>
  );
};
