import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NearbyStations.css';

export interface NearbyStationItem {
  id: string;
  name: string;
  address?: string;
  city: string;
  distanceKm: number;
  travelTimeMin?: number;
  availablePoints: number;
  totalPoints: number;
  powerKw: number;
  ratePerKWh: number;
  isFull?: boolean;
  waitTimeMin?: number;
  connectorType?: string;
}

interface NearbyStationsProps {
  stations: NearbyStationItem[];
  onViewDetails: (station: NearbyStationItem) => void;
  onReserve: (station: NearbyStationItem) => void;
  onNotifyMe: (station: NearbyStationItem) => void;
  isLoading?: boolean;
}

export const NearbyStations: React.FC<NearbyStationsProps> = ({
  stations,
  onViewDetails,
  onReserve,
  onNotifyMe,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  return (
    <section className="pg-nstn" aria-labelledby="nstn-heading">
      <div className="pg-nstn__head">
        <h3 id="nstn-heading" className="pg-nstn__title">Nearby Stations</h3>
        <button
          type="button"
          className="pg-nstn__view-map-btn"
          onClick={() => navigate('/customer/chargers')}
        >
          View Map ›
        </button>
      </div>

      {isLoading ? (
        <div className="pg-nstn__loading">Loading nearby charging stations...</div>
      ) : stations.length === 0 ? (
        <div className="pg-nstn__empty">
          <p>No charging stations found nearby.</p>
          <button
            type="button"
            className="pg-nstn__browse-btn"
            onClick={() => navigate('/customer/chargers')}
          >
            Browse All AP Stations
          </button>
        </div>
      ) : (
        <div className="pg-nstn__list">
          {stations.map((st) => {
            const isFull = st.isFull || st.availablePoints === 0;

            return (
              <div key={st.id} className="pg-nstn__card">
                <div className="pg-nstn__card-main">
                  <div className="pg-nstn__info">
                    <h4 className="pg-nstn__station-name">{st.name}</h4>
                    <p className="pg-nstn__address">
                      {st.address || `${st.city}, Andhra Pradesh`}
                    </p>

                    <div className="pg-nstn__meta-row">
                      <span className="pg-nstn__meta-pill">
                        {st.distanceKm} km
                      </span>
                      <span className="pg-nstn__meta-pill">
                        {st.travelTimeMin || Math.round(st.distanceKm * 3.5)} min
                      </span>
                      <span className="pg-nstn__meta-pill">
                        {st.powerKw} kW Fast
                      </span>
                      <span
                        className={`pg-nstn__avail-pill ${
                          isFull
                            ? 'pg-nstn__avail-pill--full'
                            : 'pg-nstn__avail-pill--free'
                        }`}
                      >
                        {isFull
                          ? `Full · ${st.waitTimeMin || 18}m wait`
                          : `${st.availablePoints}/${st.totalPoints} Free`}
                      </span>
                    </div>

                    <div className="pg-nstn__rate-line">
                      <strong>₹{st.ratePerKWh}/kWh</strong> · CAR
                    </div>
                  </div>
                </div>

                <div className="pg-nstn__actions">
                  <button
                    type="button"
                    className="pg-nstn__btn pg-nstn__btn--details"
                    onClick={() => onViewDetails(st)}
                  >
                    View Details
                  </button>

                  {isFull ? (
                    <button
                      type="button"
                      className="pg-nstn__btn pg-nstn__btn--notify"
                      onClick={() => onNotifyMe(st)}
                    >
                      Notify Me
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="pg-nstn__btn pg-nstn__btn--reserve"
                      onClick={() => onReserve(st)}
                    >
                      Reserve
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
