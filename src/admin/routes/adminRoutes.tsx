import { lazy, Suspense } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { AdminLayout } from '../components/AdminLayout/AdminLayout';

// Lazy-load all Admin pages for maximum performance
const AdminDashboard = lazy(() => import('../pages/Dashboard/AdminDashboard'));
const AdminZones = lazy(() => import('../pages/Zones/AdminZones'));
const AdminChargingPoints = lazy(() => import('../pages/ChargingPoints/AdminChargingPoints'));
const AdminUsers = lazy(() => import('../pages/Users/AdminUsers'));
const AdminVehicles = lazy(() => import('../pages/Vehicles/AdminVehicles'));
const AdminReservations = lazy(() => import('../pages/Reservations/AdminReservations'));
const AdminChargingSessions = lazy(() => import('../pages/ChargingSessions/AdminChargingSessions'));
const AdminPricing = lazy(() => import('../pages/Pricing/AdminPricing'));
const AdminWalletPayments = lazy(() => import('../pages/WalletPayments/AdminWalletPayments'));
const AdminMaintenance = lazy(() => import('../pages/Maintenance/AdminMaintenance'));
const AdminReports = lazy(() => import('../pages/Reports/AdminReports'));
const AdminNotifications = lazy(() => import('../pages/Notifications/AdminNotifications'));
const AdminRolesPermissions = lazy(() => import('../pages/RolesPermissions/AdminRolesPermissions'));
const AdminAuditLogs = lazy(() => import('../pages/AuditLogs/AdminAuditLogs'));
const AdminSettings = lazy(() => import('../pages/Settings/AdminSettings'));

const LoadingFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
    <div className="pg-admin-spinner" style={{ width: '32px', height: '32px' }} />
  </div>
);

export const adminRouteConfig: RouteObject = {
  path: 'admin',
  element: <AdminLayout />,
  children: [
    {
      index: true,
      element: <Navigate to="dashboard" replace />,
    },
    {
      path: 'dashboard',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AdminDashboard />
        </Suspense>
      ),
    },
    {
      path: 'zones',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AdminZones />
        </Suspense>
      ),
    },
    {
      path: 'charging-points',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AdminChargingPoints />
        </Suspense>
      ),
    },
    {
      path: 'users',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AdminUsers />
        </Suspense>
      ),
    },
    {
      path: 'vehicles',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AdminVehicles />
        </Suspense>
      ),
    },
    {
      path: 'reservations',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AdminReservations />
        </Suspense>
      ),
    },
    {
      path: 'charging-sessions',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AdminChargingSessions />
        </Suspense>
      ),
    },
    {
      path: 'pricing',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AdminPricing />
        </Suspense>
      ),
    },
    {
      path: 'wallet-payments',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AdminWalletPayments />
        </Suspense>
      ),
    },
    {
      path: 'maintenance',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AdminMaintenance />
        </Suspense>
      ),
    },
    {
      path: 'reports',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AdminReports />
        </Suspense>
      ),
    },
    {
      path: 'notifications',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AdminNotifications />
        </Suspense>
      ),
    },
    {
      path: 'roles-permissions',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AdminRolesPermissions />
        </Suspense>
      ),
    },
    {
      path: 'audit-logs',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AdminAuditLogs />
        </Suspense>
      ),
    },
    {
      path: 'settings',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <AdminSettings />
        </Suspense>
      ),
    },
  ],
};
