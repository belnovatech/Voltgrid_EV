import React, { useEffect } from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { AppRoutes } from './routes';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import './App.css';

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Configure Android native status bar & hardware back button
  useEffect(() => {
    try {
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: '#071B32' });
    } catch {
      // Not on native device
    }

    const backListener = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (location.pathname === '/home' || location.pathname === '/login') {
        CapApp.exitApp();
      } else if (canGoBack) {
        navigate(-1);
      } else {
        navigate('/home');
      }
    });

    return () => {
      backListener.then((sub) => sub.remove()).catch(() => {});
    };
  }, [location.pathname, navigate]);

  // Show bottom nav on main user tabs when authenticated
  const showBottomNav =
    isAuthenticated &&
    ['/home', '/explore', '/bookings', '/activity', '/profile'].some((path) =>
      location.pathname.startsWith(path)
    );

  return (
    <div className="mobile-app-root">
      <div className="mobile-app-viewport">
        <AppRoutes />
      </div>
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
