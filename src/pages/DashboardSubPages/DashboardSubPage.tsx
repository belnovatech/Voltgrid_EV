import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardHeader } from '../Dashboard/components/DashboardHeader/DashboardHeader';
import { dashboardService } from '../../services/dashboardService';
import { vehicleService } from '../../services/vehicleService';
import { Vehicle } from '../../types/dashboard';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import './DashboardSubPage.css';

interface DashboardSubPageProps {
  title: string;
  subtitle: string;
  badge: string;
}

export const DashboardSubPage: React.FC<DashboardSubPageProps> = ({
  title,
  subtitle,
  badge,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(1250);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin', { replace: true });
      return;
    }

    const loadData = async () => {
      const [vList, selV, bal] = await Promise.all([
        vehicleService.getUserVehicles(),
        vehicleService.getSelectedVehicle(),
        dashboardService.getWalletBalance(),
      ]);
      setVehicles(vList);
      setCurrentVehicle(selV);
      setWalletBalance(bal);
    };

    loadData();
  }, [isAuthenticated, navigate]);

  const handleSelectVehicle = async (veh: Vehicle) => {
    const updated = await vehicleService.setSelectedVehicle(veh.id);
    setCurrentVehicle(updated);
  };

  if (!currentVehicle) return null;

  return (
    <div className="vg-dash-page">
      <DashboardHeader
        currentVehicle={currentVehicle}
        vehicles={vehicles}
        onSelectVehicle={handleSelectVehicle}
        walletBalance={walletBalance}
      />
      <main className="container vg-dash-subpage__container">
        <Card className="vg-dash-subpage__card" padding="lg">
          <div className="vg-dash-subpage__badge">
            <span>{badge}</span>
          </div>
          <h1 className="vg-dash-subpage__title">{title}</h1>
          <p className="vg-dash-subpage__subtitle">{subtitle}</p>
          <div className="vg-dash-subpage__actions">
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};
