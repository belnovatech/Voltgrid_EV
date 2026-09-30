import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerLayout } from '../../../components/customer/CustomerLayout/CustomerLayout';
import { customerService } from '../../../services/customerService';
import { CustomerDashboardData, CustomerVehicle } from '../../../types/customer';
import { DashboardHeader } from './components/DashboardHeader/DashboardHeader';
import { SearchHero } from './components/SearchHero/SearchHero';
import { StatsGrid } from './components/StatsGrid/StatsGrid';
import { VehicleSection } from './components/VehicleSection/VehicleSection';
import {
  NearbyStations,
  NearbyStationItem,
} from './components/NearbyStations/NearbyStations';
import { StationDetailsModal } from './components/StationDetailsModal/StationDetailsModal';
import { ReserveModal } from './components/ReserveModal/ReserveModal';
import { AddVehicleModal } from './components/AddVehicleModal/AddVehicleModal';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<CustomerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notificationMsg, setNotificationMsg] = useState<string>('');

  // Modals state
  const [selectedStationDetails, setSelectedStationDetails] =
    useState<NearbyStationItem | null>(null);
  const [selectedStationReserve, setSelectedStationReserve] =
    useState<NearbyStationItem | null>(null);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState<boolean>(false);

  useEffect(() => {
    customerService.getDashboardData().then((res) => {
      setData(res);
      setIsLoading(false);
    });
  }, []);

  const handleSearch = (query: string) => {
    if (query) {
      navigate(`/customer/chargers?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/customer/chargers');
    }
  };

  const handleVehicleAdded = (newVeh: CustomerVehicle) => {
    if (data) {
      setData({
        ...data,
        vehicles: [...data.vehicles, newVeh],
      });
    }
    showToast(`✓ Added ${newVeh.name} (${newVeh.licensePlate}) to your EV Garage.`);
  };

  const handleReserveSuccess = () => {
    setSelectedStationReserve(null);
    showToast('✓ Slot reserved successfully! View your booking under Reservations.');
  };

  const handleNotifyMe = (station: NearbyStationItem) => {
    showToast(`✓ You will receive an SMS when a slot opens at ${station.name}.`);
  };

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(''), 4500);
  };

  // Convert dashboard nearby stations to formatted items with status
  const nearbyStationItems: NearbyStationItem[] = (data?.nearbyStations || []).map(
    (st, index) => ({
      id: st.id,
      name: st.name,
      address:
        st.id === 'st-1'
          ? 'MG Road, Vijayawada'
          : st.id === 'st-2'
          ? 'Kalyana Mandapam Road, Vijayawada'
          : `${st.city}, Andhra Pradesh`,
      city: st.city,
      distanceKm: st.distanceKm,
      travelTimeMin: index === 0 ? 4 : index === 1 ? 8 : 12,
      availablePoints: st.availablePoints,
      totalPoints: st.totalPoints,
      powerKw: st.powerKw,
      ratePerKWh: st.ratePerKWh,
      isFull: st.availablePoints === 0,
      waitTimeMin: st.availablePoints === 0 ? 18 : 0,
    })
  );

  return (
    <CustomerLayout>
      <div className="pg-dash-page">
        {/* Toast Alert */}
        {notificationMsg && (
          <div className="pg-dash__toast" role="status">
            <span>{notificationMsg}</span>
            <button
              type="button"
              className="pg-dash__toast-close"
              onClick={() => setNotificationMsg('')}
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. Header with greeting and location */}
        <DashboardHeader
          profile={data?.profile || null}
          unreadCount={data?.unreadNotificationsCount ?? 2}
          isLoading={isLoading}
        />

        {/* 2. Main Dark Navy Search Hero */}
        <SearchHero onSearch={handleSearch} />

        {/* 3. 4 KPI Cards */}
        <StatsGrid data={data} isLoading={isLoading} />

        {/* 4. Lower Grid: My Vehicles + Nearby Stations */}
        <div className="pg-dash__lower-grid">
          <VehicleSection
            vehicles={data?.vehicles || []}
            onAddVehicleClick={() => setIsAddVehicleOpen(true)}
            isLoading={isLoading}
          />

          <NearbyStations
            stations={nearbyStationItems}
            onViewDetails={(st) => setSelectedStationDetails(st)}
            onReserve={(st) => setSelectedStationReserve(st)}
            onNotifyMe={handleNotifyMe}
            isLoading={isLoading}
          />
        </div>

        {/* Modals */}
        <StationDetailsModal
          station={selectedStationDetails}
          onClose={() => setSelectedStationDetails(null)}
          onReserve={(st) => {
            setSelectedStationDetails(null);
            setSelectedStationReserve(st);
          }}
        />

        <ReserveModal
          station={selectedStationReserve}
          onClose={() => setSelectedStationReserve(null)}
          onSuccess={handleReserveSuccess}
        />

        <AddVehicleModal
          isOpen={isAddVehicleOpen}
          onClose={() => setIsAddVehicleOpen(false)}
          onVehicleAdded={handleVehicleAdded}
        />
      </div>
    </CustomerLayout>
  );
};
