import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import './AppDashboard.css';

export const AppDashboard: React.FC = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="vg-dashboard-page">
      <Header />
      <main className="container vg-dashboard__container">
        <Card className="vg-dashboard__card" padding="lg">
          <div className="vg-dashboard__badge">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Authenticated</span>
          </div>

          <h1 className="vg-dashboard__title">Welcome to VoltGrid</h1>
          <p className="vg-dashboard__user-info">
            Logged in with mobile: <strong>{user?.countryCode || '+91'} {user?.phoneNumber || '9876543210'}</strong>
          </p>

          <div className="vg-dashboard__actions">
            <Button variant="primary" onClick={() => navigate('/')}>
              Explore Charging Points
            </Button>
            <Button variant="secondary" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};
