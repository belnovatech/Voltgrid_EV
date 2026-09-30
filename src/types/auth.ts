export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  phoneNumber?: string;
  countryCode?: string;
  email?: string;
  name?: string;
  role: UserRole;
  createdAt: string;
}

export interface SendOtpRequest {
  countryCode: string;
  phoneNumber: string;
  role?: UserRole;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  expiresInSeconds?: number;
  demoOtpHint?: string;
}

export interface VerifyOtpRequest {
  countryCode: string;
  phoneNumber: string;
  otp: string;
  role?: UserRole;
}

export interface LoginCredentialsRequest {
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  pendingPhoneNumber: string | null;
  pendingCountryCode: string;
  pendingRole: UserRole;
}
