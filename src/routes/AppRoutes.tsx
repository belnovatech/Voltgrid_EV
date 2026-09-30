import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home/Home';
import { CustomerLogin } from '../pages/Auth/CustomerLogin/CustomerLogin';
import { VerifyOTP } from '../pages/Auth/VerifyOTP/VerifyOTP';
import { CompleteProfile } from '../pages/Auth/CompleteProfile/CompleteProfile';
import { Dashboard } from '../pages/Customer/Dashboard/Dashboard';
import { FindChargers } from '../pages/Customer/FindChargers/FindChargers';
import { Reservations } from '../pages/Customer/Reservations/Reservations';
import { MyVehicles } from '../pages/Customer/MyVehicles/MyVehicles';
import { ChargingHistory } from '../pages/Customer/ChargingHistory/ChargingHistory';
import { Wallet } from '../pages/Customer/Wallet/Wallet';
import { Notifications } from '../pages/Customer/Notifications/Notifications';
import { Support } from '../pages/Customer/Support/Support';
import { Profile } from '../pages/Customer/Profile/Profile';
import { Settings } from '../pages/Customer/Settings/Settings';
import { LiveCharging } from '../pages/Customer/Charging/LiveCharging';
import { AdminLayout } from '../admin/components/AdminLayout/AdminLayout';
import { AdminDashboard } from '../admin/pages/Dashboard/AdminDashboard';
import { AdminZones } from '../admin/pages/Zones/AdminZones';
import { AdminChargingPoints } from '../admin/pages/ChargingPoints/AdminChargingPoints';
import { AdminUsers } from '../admin/pages/Users/AdminUsers';
import { AdminVehicles } from '../admin/pages/Vehicles/AdminVehicles';
import { AdminReservations } from '../admin/pages/Reservations/AdminReservations';
import { AdminChargingSessions } from '../admin/pages/ChargingSessions/AdminChargingSessions';
import { AdminPricing } from '../admin/pages/Pricing/AdminPricing';
import { AdminWalletPayments } from '../admin/pages/WalletPayments/AdminWalletPayments';
import { AdminMaintenance } from '../admin/pages/Maintenance/AdminMaintenance';
import { AdminReports } from '../admin/pages/Reports/AdminReports';
import { AdminNotifications } from '../admin/pages/Notifications/AdminNotifications';
import { AdminRolesPermissions } from '../admin/pages/RolesPermissions/AdminRolesPermissions';
import { AdminAuditLogs } from '../admin/pages/AuditLogs/AdminAuditLogs';
import { AdminSettings } from '../admin/pages/Settings/AdminSettings';
import { ProtectedRoute } from '../components/ProtectedRoute/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<CustomerLogin />} />
      <Route path="/signin" element={<Navigate to="/login" replace />} />
      <Route path="/auth/customer-login" element={<CustomerLogin />} />
      <Route path="/auth/verify-otp" element={<VerifyOTP />} />
      <Route path="/verify-otp" element={<Navigate to="/auth/verify-otp" replace />} />
      <Route path="/auth/complete-profile" element={<CompleteProfile />} />

      {/* Authenticated Customer Routes */}
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard" element={<Navigate to="/customer/dashboard" replace />} />
      <Route path="/app" element={<Navigate to="/customer/dashboard" replace />} />

      <Route
        path="/customer/chargers"
        element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <FindChargers />
          </ProtectedRoute>
        }
      />
      <Route path="/customer/find-chargers" element={<Navigate to="/customer/chargers" replace />} />
      <Route path="/stations" element={<Navigate to="/customer/chargers" replace />} />

      <Route
        path="/customer/reservations"
        element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <Reservations />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/charging"
        element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <LiveCharging />
          </ProtectedRoute>
        }
      />
      <Route path="/customer/live-charging" element={<Navigate to="/customer/charging" replace />} />
      <Route path="/customer/charging-session" element={<Navigate to="/customer/charging" replace />} />
      <Route path="/charging" element={<Navigate to="/customer/charging" replace />} />

      <Route
        path="/customer/vehicles"
        element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <MyVehicles />
          </ProtectedRoute>
        }
      />
      <Route path="/customer/my-vehicles" element={<Navigate to="/customer/vehicles" replace />} />
      <Route path="/vehicles" element={<Navigate to="/customer/vehicles" replace />} />

      <Route
        path="/customer/history"
        element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <ChargingHistory />
          </ProtectedRoute>
        }
      />
      <Route path="/customer/charging-history" element={<Navigate to="/customer/history" replace />} />
      <Route path="/history" element={<Navigate to="/customer/history" replace />} />

      <Route
        path="/customer/wallet"
        element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <Wallet />
          </ProtectedRoute>
        }
      />
      <Route path="/wallet" element={<Navigate to="/customer/wallet" replace />} />

      <Route
        path="/customer/notifications"
        element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <Notifications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/support"
        element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <Support />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/settings"
        element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* ================================================================
          DEDICATED ADMIN MODULE HIERARCHY
          Protected to 'admin' role
          ================================================================ */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="zones" element={<AdminZones />} />
        <Route path="charging-points" element={<AdminChargingPoints />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="vehicles" element={<AdminVehicles />} />
        <Route path="reservations" element={<AdminReservations />} />
        <Route path="charging-sessions" element={<AdminChargingSessions />} />
        <Route path="pricing" element={<AdminPricing />} />
        <Route path="wallet-payments" element={<AdminWalletPayments />} />
        <Route path="maintenance" element={<AdminMaintenance />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="roles-permissions" element={<AdminRolesPermissions />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="/operations" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
