import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Zap, Navigation, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { stationService } from '../../services/stationService';
import { EVStation } from '../../types/station';
import { AppHeader } from '../../components/layout/AppHeader';
import { AppButton } from '../../components/common/AppButton';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import './ExploreStationsPage.css';

const CITIES = ['All', 'Vijayawada', 'Visakhapatnam', 'Tirupati', 'Guntur'];

export const ExploreStationsPage: React.FC = () => {
  const navigate = useNavigate();

  const [stations, setStations] = useState<EVStation[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedStationId, setExpandedStationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadStations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await stationService.searchStations({
        city: selectedCity,
        query: searchQuery,
      });
      setStations(data);
    } catch {
      setError('Unable to load charging stations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStations();
  }, [selectedCity, searchQuery]);

  const openNavigation = (st: EVStation) => {
    // Android Maps intent or web maps
    const url = `https://www.google.com/maps/search/?api=1&query=${st.lat},${st.lng}`;
    window.open(url, '_system');
  };

  const handleBook = (station: EVStation) => {
    navigate('/bookings', { state: { preselectStation: station } });
  };

  const handleStartChargeAtStation = (station: EVStation) => {
    const avail = station.chargers.find((c) => c.status === 'available') || station.chargers[0];
    navigate('/activity', {
      state: {
        preselectCharger: {
          chargerId: avail.id,
          stationId: station.id,
          stationName: station.name,
          location: station.address,
          connectorType: avail.connector,
          powerKw: avail.powerKw,
          ratePerKwh: avail.currentRateINR,
        },
      },
    });
  };

  return (
    <div className="explore-page">
      <AppHeader title="Explore Stations" />

      <main className="explore-content">
        {/* Search Bar */}
        <div className="search-bar-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search city, area, or hub..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* City Filter Chips */}
        <div className="filter-chips-row">
          {CITIES.map((city) => (
            <button
              key={city}
              className={`filter-chip ${selectedCity === city ? 'filter-chip--active' : ''}`}
              onClick={() => setSelectedCity(city)}
            >
              {city}
            </button>
          ))}
        </div>

        {isLoading ? (
          <LoadingState message="Discovering live Voltgrid stations..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadStations} />
        ) : stations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-muted)' }}>
            <MapPin size={36} style={{ marginBottom: '8px', opacity: 0.5 }} />
            <p>No stations found matching your search.</p>
          </div>
        ) : (
          stations.map((st) => {
            const isExpanded = expandedStationId === st.id;
            return (
              <div key={st.id} className="station-card">
                <div className="station-card-header">
                  <div>
                    <h2 className="station-title">{st.name}</h2>
                    <p className="station-address">
                      <MapPin size={14} color="var(--color-cyan)" />
                      <span>{st.address}</span>
                    </p>
                  </div>
                  <div className="station-distance-badge">{st.distanceKm} km</div>
                </div>

                <div className="station-specs-row">
                  <span className="spec-pill spec-pill--highlight">{st.powerKw} kW Fast DC</span>
                  <span className="spec-pill">{st.connectorType}</span>
                  <span className="spec-pill">₹{st.ratePerKWh}/kWh</span>
                  <span className="spec-pill">
                    {st.availableChargers}/{st.totalChargers} Available
                  </span>
                  <span className="spec-pill">{st.operatingHours}</span>
                </div>

                {/* Toggle Chargers details */}
                <button
                  type="button"
                  onClick={() => setExpandedStationId(isExpanded ? null : st.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: 'var(--color-cyan)',
                    background: 'none',
                    border: 'none',
                    padding: '4px 0',
                    cursor: 'pointer',
                  }}
                >
                  <span>{isExpanded ? 'Hide Chargers' : `View ${st.chargers.length} Charging Bays`}</span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isExpanded && (
                  <div className="station-chargers-drawer">
                    {st.chargers.map((ch) => (
                      <div key={ch.id} className="charger-point-item">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span className={`charger-status-dot charger-status-dot--${ch.status}`} />
                          <span style={{ fontWeight: 600 }}>{ch.name}</span>
                          <span style={{ color: 'var(--color-text-muted)', marginLeft: '6px' }}>
                            ({ch.connector} · {ch.powerKw}kW)
                          </span>
                        </div>
                        <span
                          style={{
                            textTransform: 'capitalize',
                            color:
                              ch.status === 'available'
                                ? 'var(--color-neon-green)'
                                : ch.status === 'charging'
                                ? 'var(--color-cyan)'
                                : 'var(--color-text-muted)',
                            fontWeight: 600,
                          }}
                        >
                          {ch.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="station-card-actions">
                  <AppButton
                    variant="outline"
                    size="sm"
                    icon={<Navigation size={16} />}
                    onClick={() => openNavigation(st)}
                  >
                    Directions
                  </AppButton>
                  <AppButton
                    variant="primary"
                    size="sm"
                    icon={<Calendar size={16} />}
                    onClick={() => handleBook(st)}
                  >
                    Book Slot
                  </AppButton>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};
