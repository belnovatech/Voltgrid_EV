import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/LoginPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { ExploreStationsPage } from '../features/stations/ExploreStationsPage';
import { BookingsPage } from '../features/bookings/BookingsPage';
import { ActivityPage } from '../features/charging/ActivityPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { NotificationsPage } from '../features/notifications/NotificationsPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Driver Authentication */}
      <Route path="/login" element={<LoginPage />} />

      {/* Authenticated EV Driver App Pages */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <ExploreStationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <BookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/activity"
        element={
          <ProtectedRoute>
            <ActivityPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* Backward-compatibility aliases */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/dashboard" element={<Navigate to="/home" replace />} />
      <Route path="/customer/dashboard" element={<Navigate to="/home" replace />} />
      <Route path="/stations" element={<Navigate to="/explore" replace />} />
      <Route path="/customer/chargers" element={<Navigate to="/explore" replace />} />
      <Route path="/reservations" element={<Navigate to="/bookings" replace />} />
      <Route path="/customer/reservations" element={<Navigate to="/bookings" replace />} />
      <Route path="/charging" element={<Navigate to="/activity" replace />} />
      <Route path="/customer/charging" element={<Navigate to="/activity" replace />} />
      <Route path="/history" element={<Navigate to="/activity" replace />} />
      <Route path="/wallet" element={<Navigate to="/activity" replace />} />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};
