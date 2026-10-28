import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LucideIcon, Home, Compass, Calendar, Zap, User } from 'lucide-react';
import { chargingSessionService } from '../../services/chargingSessionService';
import './BottomNavigation.css';

interface NavTab {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
}

const TABS: NavTab[] = [
  { id: 'home', label: 'Home', path: '/home', icon: Home },
  { id: 'explore', label: 'Explore', path: '/explore', icon: Compass },
  { id: 'bookings', label: 'Bookings', path: '/bookings', icon: Calendar },
  { id: 'activity', label: 'Activity', path: '/activity', icon: Zap },
  { id: 'profile', label: 'Profile', path: '/profile', icon: User },
];

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCharging, setIsCharging] = useState<boolean>(() => chargingSessionService.hasActiveSession());

  useEffect(() => {
    const unsub = chargingSessionService.subscribe((session) => {
      setIsCharging(!!session && session.status === 'CHARGING');
    });
    return () => unsub();
  }, []);

  const currentPath = location.pathname;

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {TABS.map((tab) => {
          const isActive =
            currentPath === tab.path ||
            (tab.path === '/home' && (currentPath === '/' || currentPath === '/dashboard')) ||
            (tab.path === '/explore' && currentPath.startsWith('/station')) ||
            (tab.path === '/activity' && currentPath.startsWith('/charging'));

          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              className={`bottom-nav-item ${isActive ? 'bottom-nav-item--active' : ''}`}
              onClick={() => navigate(tab.path)}
              aria-label={tab.label}
            >
              {isActive && <div className="bottom-nav-active-pill" />}
              <div className="bottom-nav-icon-wrapper">
                <IconComponent size={22} />
                {tab.id === 'activity' && isCharging && <span className="charging-live-dot" />}
              </div>
              <span className="bottom-nav-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
