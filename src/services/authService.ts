import { ENV } from '../config/environment';
import {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  LoginCredentialsRequest,
  User,
} from '../types/auth';
import { apiClient, ApiError } from './apiClient';

/**
 * Authentication Service
 * Cleanly separates authentication operations from UI components.
 * Supports role-based customer and admin flows.
 */
class AuthService {
  private activeDemoOtps: Map<string, { otp: string; expiresAt: number }> = new Map();

  /**
   * Request an OTP for a given phone number
   */
  async sendOtp(params: SendOtpRequest): Promise<SendOtpResponse> {
    const { countryCode, phoneNumber, role = 'customer' } = params;

    if (ENV.IS_DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 450));

      const key = `${countryCode}${phoneNumber}_${role}`;
      const otpCode = ENV.DEMO_OTP;
      const expiresInSeconds = 300;

      this.activeDemoOtps.set(key, {
        otp: otpCode,
        expiresAt: Date.now() + expiresInSeconds * 1000,
      });

      return {
        success: true,
        message: `OTP sent successfully to ${countryCode} ${phoneNumber}.`,
        expiresInSeconds,
        demoOtpHint: otpCode,
      };
    }

    return apiClient<SendOtpResponse>('/auth/send-otp', {
      method: 'POST',
      body: { countryCode, phoneNumber, role },
    });
  }

  /**
   * Verify an OTP and retrieve user token + user role
   */
  async verifyOtp(params: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const { countryCode, phoneNumber, otp, role = 'customer' } = params;

    if (ENV.IS_DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const key = `${countryCode}${phoneNumber}_${role}`;
      const record = this.activeDemoOtps.get(key);
      const validCode = record ? record.otp : ENV.DEMO_OTP;

      if (record && Date.now() > record.expiresAt) {
        throw new ApiError(400, 'OTP Expired', 'The OTP has expired. Please request a new one.');
      }

      if (otp !== validCode) {
        throw new ApiError(400, 'Invalid OTP', 'The OTP entered is incorrect. Please try again.');
      }

      const mockUser: User = {
        id: `user_${Date.now()}`,
        countryCode,
        phoneNumber,
        name: role === 'admin' ? 'Operations Admin' : 'PowerGrid Driver',
        role,
        createdAt: new Date().toISOString(),
      };

      const token = `pg_tok_${Math.random().toString(36).substring(2)}_${Date.now()}`;

      sessionStorage.setItem('vg_auth_token', token);
      sessionStorage.setItem('vg_user_info', JSON.stringify(mockUser));

      return {
        success: true,
        message: 'Verified successfully.',
        token,
        user: mockUser,
      };
    }

    const result = await apiClient<VerifyOtpResponse>('/auth/verify-otp', {
      method: 'POST',
      body: { countryCode, phoneNumber, otp, role },
    });

    if (result.token) {
      sessionStorage.setItem('vg_auth_token', result.token);
    }
    if (result.user) {
      sessionStorage.setItem('vg_user_info', JSON.stringify(result.user));
    }

    return result;
  }

  /**
   * Direct password / credential authentication (primarily for Admin operations console)
   */
  async loginWithCredentials(params: LoginCredentialsRequest): Promise<VerifyOtpResponse> {
    const { email, password, role = 'admin' } = params;

    if (ENV.IS_DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (password && password.length < 4) {
        throw new ApiError(400, 'Invalid credentials', 'Please enter a valid password.');
      }

      const mockUser: User = {
        id: `admin_${Date.now()}`,
        email: email || 'ops.lead@powergrid.ev',
        name: 'AP Operations Lead',
        role,
        createdAt: new Date().toISOString(),
      };

      const token = `pg_admin_tok_${Math.random().toString(36).substring(2)}_${Date.now()}`;

      sessionStorage.setItem('vg_auth_token', token);
      sessionStorage.setItem('vg_user_info', JSON.stringify(mockUser));

      return {
        success: true,
        message: 'Admin authenticated successfully.',
        token,
        user: mockUser,
      };
    }

    const result = await apiClient<VerifyOtpResponse>('/auth/login', {
      method: 'POST',
      body: { email, password, role },
    });

    if (result.token) {
      sessionStorage.setItem('vg_auth_token', result.token);
    }
    if (result.user) {
      sessionStorage.setItem('vg_user_info', JSON.stringify(result.user));
    }

    return result;
  }

  /**
   * Check if an active session exists
   */
  getStoredSession(): { token: string | null; user: User | null } {
    try {
      const token = sessionStorage.getItem('vg_auth_token');
      const rawUser = sessionStorage.getItem('vg_user_info');
      const user = rawUser ? (JSON.parse(rawUser) as User) : null;
      return { token, user };
    } catch {
      return { token: null, user: null };
    }
  }

  /**
   * Log out and clear session
   */
  logout(): void {
    sessionStorage.removeItem('vg_auth_token');
    sessionStorage.removeItem('vg_user_info');
    sessionStorage.removeItem('vg_pending_phone');
    sessionStorage.removeItem('vg_pending_role');
  }
}

export const authService = new AuthService();
