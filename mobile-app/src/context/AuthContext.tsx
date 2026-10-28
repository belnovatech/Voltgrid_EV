import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types/auth';
import { authService } from '../services/authService';
import { API_CONFIG } from '../services/apiConfig';

interface AuthContextType extends AuthState {
  setPendingAuth: (countryCode: string, phoneNumber: string) => void;
  clearPendingAuth: () => void;
  loginUser: (user: User, token: string) => void;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pendingPhoneNumber, setPendingPhoneNumber] = useState<string | null>(() => {
    return sessionStorage.getItem('vg_pending_phone');
  });
  const [pendingCountryCode, setPendingCountryCode] = useState<string>(() => {
    return sessionStorage.getItem('vg_pending_cc') || API_CONFIG.DEFAULT_COUNTRY_CODE;
  });

  useEffect(() => {
    let mounted = true;
    const restore = async () => {
      try {
        const session = await authService.getStoredSession();
        if (mounted && session.token && session.user) {
          // Extra guard: only customer role allowed
          if (session.user.role === 'customer') {
            setToken(session.token);
            setUser(session.user);
          } else {
            await authService.logout();
          }
        }
      } catch {
        // Fallback
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    restore();
    return () => {
      mounted = false;
    };
  }, []);

  const setPendingAuth = (countryCode: string, phoneNumber: string) => {
    setPendingCountryCode(countryCode);
    setPendingPhoneNumber(phoneNumber);
    sessionStorage.setItem('vg_pending_cc', countryCode);
    sessionStorage.setItem('vg_pending_phone', phoneNumber);
  };

  const clearPendingAuth = () => {
    setPendingPhoneNumber(null);
    sessionStorage.removeItem('vg_pending_phone');
  };

  const loginUser = (newUser: User, newToken: string) => {
    // Strict customer validation
    if (newUser.role !== 'customer') {
      throw new Error('This application is restricted to EV Drivers only.');
    }
    setUser(newUser);
    setToken(newToken);
    clearPendingAuth();
  };

  const logoutUser = async () => {
    await authService.logout();
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
        isLoading,
        pendingPhoneNumber,
        pendingCountryCode,
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
