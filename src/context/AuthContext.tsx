import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, UserRole } from '../types/auth';
import { authService } from '../services/authService';
import { ENV } from '../config/environment';

interface AuthContextType extends AuthState {
  setPendingAuth: (countryCode: string, phoneNumber: string, role?: UserRole) => void;
  clearPendingAuth: () => void;
  loginUser: (user: User, token: string) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [pendingPhoneNumber, setPendingPhoneNumber] = useState<string | null>(() => {
    return sessionStorage.getItem('vg_pending_phone');
  });
  const [pendingCountryCode, setPendingCountryCode] = useState<string>(() => {
    return sessionStorage.getItem('vg_pending_cc') || ENV.COUNTRY_CODE;
  });
  const [pendingRole, setPendingRole] = useState<UserRole>(() => {
    return (sessionStorage.getItem('vg_pending_role') as UserRole) || 'customer';
  });

  useEffect(() => {
    const { token: storedToken, user: storedUser } = authService.getStoredSession();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
  }, []);

  const setPendingAuth = (countryCode: string, phoneNumber: string, role: UserRole = 'customer') => {
    setPendingCountryCode(countryCode);
    setPendingPhoneNumber(phoneNumber);
    setPendingRole(role);
    sessionStorage.setItem('vg_pending_cc', countryCode);
    sessionStorage.setItem('vg_pending_phone', phoneNumber);
    sessionStorage.setItem('vg_pending_role', role);
  };

  const clearPendingAuth = () => {
    setPendingPhoneNumber(null);
    sessionStorage.removeItem('vg_pending_phone');
    sessionStorage.removeItem('vg_pending_role');
  };

  const loginUser = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    clearPendingAuth();
  };

  const logoutUser = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    clearPendingAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        pendingPhoneNumber,
        pendingCountryCode,
        pendingRole,
        setPendingAuth,
        clearPendingAuth,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
