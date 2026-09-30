import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Vehicle } from '../../../../types/dashboard';
import { VehicleSelector } from '../VehicleSelector/VehicleSelector';
import { formatCurrencyINR } from '../../../../utils/dashboardHelpers';
import { useAuth } from '../../../../context/AuthContext';
import './DashboardHeader.css';

interface DashboardHeaderProps {
  currentVehicle: Vehicle;
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  walletBalance: number;
}

interface NavItem {
  id: string;
  label: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', path: '/dashboard' },
  { id: 'stations', label: 'Stations', path: '/stations' },
  { id: 'charging', label: 'Charging', path: '/charging' },
  { id: 'vehicles', label: 'Vehicles', path: '/vehicles' },
  { id: 'wallet', label: 'Wallet', path: '/wallet' },
  { id: 'history', label: 'History', path: '/history' },
];

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentVehicle,
  vehicles,
  onSelectVehicle,
  walletBalance,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    logoutUser();
    navigate('/signin');
  };

  const isNavActive = (path: string) => {
    if (path === '/dashboard' && (location.pathname === '/dashboard' || location.pathname === '/app')) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <header className="vg-dash-header">
      <div className="container vg-dash-header__container">
        {/* Left: Brand Logo */}
        <div className="vg-dash-header__left">
          <Link to="/dashboard" className="vg-dash-header__brand" aria-label="VoltGrid Dashboard Home">
            <div className="vg-dash-header__logo-icon" aria-hidden="true">
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
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="vg-dash-header__brand-name">VoltGrid</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="vg-dash-header__nav" aria-label="Dashboard Navigation">
            {NAV_ITEMS.map((item) => {
              const active = isNavActive(item.path);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`vg-dash-header__nav-item ${active ? 'vg-dash-header__nav-item--active' : ''}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions (Desktop) */}
        <div className="vg-dash-header__right">
          <VehicleSelector
            currentVehicle={currentVehicle}
            vehicles={vehicles}
            onSelectVehicle={onSelectVehicle}
          />

          <div className="vg-dash-header__wallet" title="Wallet Balance">
            <span className="vg-dash-header__wallet-amount">
              {formatCurrencyINR(walletBalance)}
            </span>
          </div>

          <button
            type="button"
            className="vg-dash-header__signout-btn"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          className="vg-dash-header__mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="vg-dash-header__mobile-menu" role="dialog" aria-label="Mobile Navigation">
          <div className="container vg-dash-header__mobile-container">
            <div className="vg-dash-header__mobile-top-bar">
              <VehicleSelector
                currentVehicle={currentVehicle}
                vehicles={vehicles}
                onSelectVehicle={(veh) => {
                  onSelectVehicle(veh);
                  setMobileMenuOpen(false);
                }}
              />
              <div className="vg-dash-header__wallet-badge">
                <span className="vg-dash-header__wallet-label">Wallet:</span>
                <span className="vg-dash-header__wallet-amount">
                  {formatCurrencyINR(walletBalance)}
                </span>
              </div>
            </div>

            <nav className="vg-dash-header__mobile-nav">
              {NAV_ITEMS.map((item) => {
                const active = isNavActive(item.path);
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`vg-dash-header__mobile-nav-item ${active ? 'vg-dash-header__mobile-nav-item--active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                    {active && (
                      <span className="vg-dash-header__active-dot" aria-hidden="true" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="vg-dash-header__mobile-footer">
              <button
                type="button"
                className="vg-dash-header__mobile-signout-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
