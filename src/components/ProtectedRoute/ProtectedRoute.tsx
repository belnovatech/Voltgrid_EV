import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // If target is super-admin, redirect to super-admin login
    if (location.pathname.startsWith('/super-admin')) {
      return <Navigate to={`/super-admin/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }
    // Redirect unauthenticated user to login with return path
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check role authorization
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If a non-super-admin tries to access super-admin, redirect safely
    if (location.pathname.startsWith('/super-admin')) {
      if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
      }
      return <Navigate to="/dashboard" replace />;
    }

    // If a customer tries to access admin operations, redirect to customer dashboard
    if (user.role === 'customer') {
      return <Navigate to="/dashboard" replace />;
    }
    // If super_admin is accessing admin or customer, they are authorized
    if (user.role === 'super_admin') {
      return <>{children}</>;
    }
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
