import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Zap, Plus, X, Check, AlertCircle } from 'lucide-react';
import { customerService } from '../../services/customerService';
import { stationService } from '../../services/stationService';
import { CustomerReservation, CustomerVehicle } from '../../types/customer';
import { EVStation } from '../../types/station';
import { AppHeader } from '../../components/layout/AppHeader';
import { AppButton } from '../../components/common/AppButton';
import { LoadingState } from '../../components/common/LoadingState';
import './BookingsPage.css';

export const BookingsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState<CustomerReservation[]>([]);
  const [filter, setFilter] = useState<'upcoming' | 'all'>('upcoming');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Modal State
  const [stations, setStations] = useState<EVStation[]>([]);
  const [vehicles, setVehicles] = useState<CustomerVehicle[]>([]);
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('02:00 PM - 03:00 PM');
  const [date, setDate] = useState<string>('Today');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const loadReservations = async () => {
    setIsLoading(true);
    try {
      const data = await customerService.getReservations();
      setReservations(data);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();

    const fetchDropdowns = async () => {
      const [stList, vehList] = await Promise.all([
        stationService.getStations(),
        customerService.getVehicles(),
      ]);
      setStations(stList);
      setVehicles(vehList);

      // Check if station was passed from Explore page
      const passedStation = (location.state as { preselectStation?: EVStation })?.preselectStation;
      if (passedStation) {
        setSelectedStationId(passedStation.id);
        setIsModalOpen(true);
      } else if (stList.length > 0) {
        setSelectedStationId(stList[0].id);
      }

      if (vehList.length > 0) {
        const def = vehList.find((v) => v.isDefault) || vehList[0];
        setSelectedVehicleId(def.id);
      }
    };
    fetchDropdowns();
  }, [location.state]);

  const handleCancelReservation = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this charger reservation?')) {
      await customerService.cancelReservation(id);
      await loadReservations();
    }
  };

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    const station = stations.find((s) => s.id === selectedStationId);
    const vehicle = vehicles.find((v) => v.id === selectedVehicleId);

    if (!station) {
      setModalError('Please select a charging station.');
      return;
    }
    if (!vehicle) {
      setModalError('Please select your vehicle.');
      return;
    }

    setIsSubmitting(true);
    try {
      await customerService.createReservation({
        stationId: station.id,
        stationName: station.name,
        city: station.city,
        chargerId: station.chargers[0]?.id || 'CH-005',
        chargerType: `${station.powerKw} kW ${station.chargers[0]?.connector || 'CCS2'}`,
        powerKw: station.powerKw,
        vehicleName: vehicle.name,
        vehiclePlate: vehicle.licensePlate,
        vehicleType: vehicle.type,
        date,
        timeSlot,
        durationMinutes: 60,
        durationText: '1h',
        estimatedCostINR: station.ratePerKWh * 25,
        ratePerKWh: station.ratePerKWh,
      });

      setIsModalOpen(false);
      await loadReservations();
    } catch {
      setModalError('Unable to confirm reservation. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReservations = reservations.filter((r) => {
    if (filter === 'upcoming') return r.status === 'upcoming';
    return true;
  });

  return (
    <div className="bookings-page">
      <AppHeader title="Charger Bookings" />

      <main className="bookings-content">
        <div className="bookings-header-row">
          <div className="login-tabs" style={{ margin: 0, width: '220px' }}>
            <button
              className={`login-tab ${filter === 'upcoming' ? 'login-tab--active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`login-tab ${filter === 'all' ? 'login-tab--active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
          </div>

          <AppButton
            variant="primary"
            size="sm"
            icon={<Plus size={16} />}
            onClick={() => setIsModalOpen(true)}
          >
            New Slot
          </AppButton>
        </div>

        {isLoading ? (
          <LoadingState message="Loading your bookings..." />
        ) : filteredReservations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)' }}>
            <Calendar size={40} style={{ opacity: 0.4, marginBottom: '12px' }} />
            <h3 style={{ color: 'var(--color-text-white)', marginBottom: '4px' }}>
              No {filter} reservations
            </h3>
            <p style={{ fontSize: '13px' }}>
              Reserve a dedicated fast charger slot in advance to avoid waiting.
            </p>
            <AppButton
              variant="secondary"
              size="sm"
              style={{ marginTop: '16px' }}
              onClick={() => setIsModalOpen(true)}
            >
              Book a Charger Now
            </AppButton>
          </div>
        ) : (
          filteredReservations.map((res) => (
            <div key={res.id} className="booking-card">
              <span className={`booking-status-tag booking-status-tag--${res.status}`}>
                {res.status}
              </span>

              <h2 className="booking-station-name">{res.stationName}</h2>

              <div className="booking-meta-row">
                <div className="booking-meta-item">
                  <Calendar size={14} color="var(--color-cyan)" />
                  <span>{res.date}</span>
                </div>
                <div className="booking-meta-item">
                  <Clock size={14} color="var(--color-cyan)" />
                  <span>{res.timeSlot}</span>
                </div>
                <div className="booking-meta-item">
                  <Zap size={14} color="var(--color-neon-green)" />
                  <span>{res.chargerType}</span>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Vehicle: <strong style={{ color: 'var(--color-text-white)' }}>{res.vehicleName || 'EV'}</strong> (
                {res.vehiclePlate || 'N/A'})
              </div>

              {res.status === 'upcoming' && (
                <div className="booking-actions">
                  <AppButton
                    variant="primary"
                    size="sm"
                    fullWidth
                    icon={<Zap size={15} />}
                    onClick={() =>
                      navigate('/activity', {
                        state: {
                          preselectCharger: {
                            chargerId: res.chargerId || 'CH-005',
                            stationId: res.stationId || 'st-01',
                            stationName: res.stationName,
                            location: res.city,
                            connectorType: 'CCS2',
                            powerKw: res.powerKw || 120,
                            ratePerKwh: res.ratePerKWh || 12,
                          },
                          reservation: res,
                        },
                      })
                    }
                  >
                    Start Charging
                  </AppButton>
                  <AppButton
                    variant="danger"
                    size="sm"
                    onClick={() => handleCancelReservation(res.id)}
                  >
                    Cancel
                  </AppButton>
                </div>
              )}
            </div>
          ))
        )}
      </main>

      {/* New Booking Sheet Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title-row">
              <h3 className="modal-title">Book a Charging Slot</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <div className="login-error-banner">
                <AlertCircle size={16} />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateReservation} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Select Charging Station</label>
                <div className="form-input-wrapper">
                  <select
                    className="form-input"
                    value={selectedStationId}
                    onChange={(e) => setSelectedStationId(e.target.value)}
                    style={{ background: 'transparent', color: '#fff' }}
                  >
                    {stations.map((s) => (
                      <option key={s.id} value={s.id} style={{ background: '#071B32' }}>
                        {s.name} ({s.city}) — {s.powerKw}kW DC
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Select EV Vehicle</label>
                <div className="form-input-wrapper">
                  <select
                    className="form-input"
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    style={{ background: 'transparent', color: '#fff' }}
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id} style={{ background: '#071B32' }}>
                        {v.name} ({v.licensePlate})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <div className="form-input-wrapper">
                    <select
                      className="form-input"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      style={{ background: 'transparent', color: '#fff' }}
                    >
                      <option value="Today" style={{ background: '#071B32' }}>Today</option>
                      <option value="Tomorrow" style={{ background: '#071B32' }}>Tomorrow</option>
                      <option value="Day After" style={{ background: '#071B32' }}>Day After</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Time Window</label>
                  <div className="form-input-wrapper">
                    <select
                      className="form-input"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      style={{ background: 'transparent', color: '#fff' }}
                    >
                      <option value="10:00 AM - 11:00 AM" style={{ background: '#071B32' }}>10:00 - 11:00 AM</option>
                      <option value="02:00 PM - 03:00 PM" style={{ background: '#071B32' }}>02:00 - 03:00 PM</option>
                      <option value="04:00 PM - 05:00 PM" style={{ background: '#071B32' }}>04:00 - 05:00 PM</option>
                      <option value="07:00 PM - 08:00 PM" style={{ background: '#071B32' }}>07:00 - 08:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                No advance booking fee required. Charging fee will be deducted directly from your Voltgrid Wallet upon session completion.
              </div>

              <AppButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                icon={<Check size={18} />}
              >
                Confirm Slot Reservation
              </AppButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
