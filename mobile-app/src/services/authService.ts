import { API_CONFIG } from './apiConfig';
import {
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  LoginCredentialsRequest,
  User,
} from '../types/auth';
import { apiClient, setStoredToken, clearStoredToken, getStoredToken } from './apiClient';
import { AppApiError } from './errorHandler';
import { Preferences } from '@capacitor/preferences';

const USER_INFO_KEY = 'vg_user_info';

class AuthService {
  private activeDemoOtps: Map<string, { otp: string; expiresAt: number }> = new Map();

  /**
   * Request an OTP for a given customer phone number
   */
  async sendOtp(params: SendOtpRequest): Promise<SendOtpResponse> {
    const { countryCode, phoneNumber } = params;

    if (!phoneNumber || phoneNumber.length < 10) {
      throw new AppApiError(400, 'Invalid Phone Number', 'Please enter a valid 10-digit mobile number.');
    }

    if (API_CONFIG.IS_DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 450));

      const key = `${countryCode}${phoneNumber}`;
      const otpCode = API_CONFIG.DEMO_OTP;
      const expiresInSeconds = 300;

      this.activeDemoOtps.set(key, {
        otp: otpCode,
        expiresAt: Date.now() + expiresInSeconds * 1000,
      });

      return {
        success: true,
        message: `Verification code sent to ${countryCode} ${phoneNumber}.`,
        expiresInSeconds,
        demoOtpHint: otpCode,
      };
    }

    return apiClient<SendOtpResponse>('/auth/send-otp', {
      method: 'POST',
      body: { countryCode, phoneNumber, role: 'customer' },
    });
  }

  /**
   * Verify an OTP and retrieve user token + user profile.
   * Strictly enforces 'customer' role.
   */
  async verifyOtp(params: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const { countryCode, phoneNumber, otp } = params;

    if (!otp || otp.length !== API_CONFIG.OTP_LENGTH) {
      throw new AppApiError(400, 'Invalid OTP', `Please enter a valid ${API_CONFIG.OTP_LENGTH}-digit code.`);
    }

    if (API_CONFIG.IS_DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const key = `${countryCode}${phoneNumber}`;
      const record = this.activeDemoOtps.get(key);
      const validCode = record ? record.otp : API_CONFIG.DEMO_OTP;

      if (record && Date.now() > record.expiresAt) {
        throw new AppApiError(400, 'OTP Expired', 'The OTP has expired. Please request a new one.');
      }

      if (otp !== validCode) {
        throw new AppApiError(400, 'Invalid OTP', 'The OTP entered is incorrect. Please try again.');
      }

      const mockUser: User = {
        id: `user_${Date.now()}`,
        countryCode,
        phoneNumber,
        name: 'Bala Krishna',
        email: 'bala.krishna@voltgrid.ev',
        role: 'customer',
        createdAt: new Date().toISOString(),
      };

      const token = `vg_mob_tok_${Math.random().toString(36).substring(2)}_${Date.now()}`;

      await this.persistSession(token, mockUser);

      return {
        success: true,
        message: 'Verified successfully.',
        token,
        user: mockUser,
      };
    }

    const result = await apiClient<VerifyOtpResponse>('/auth/verify-otp', {
      method: 'POST',
      body: { countryCode, phoneNumber, otp, role: 'customer' },
    });

    if (result.user && result.user.role !== 'customer') {
      throw new AppApiError(
        403,
        'Role Not Authorized',
        'This mobile app is for EV drivers only. Administrator access is not allowed on this app.'
      );
    }

    if (result.token && result.user) {
      await this.persistSession(result.token, result.user);
    }

    return result;
  }

  /**
   * Login with email and password (for customers registered with credentials)
   */
  async loginWithCredentials(params: LoginCredentialsRequest): Promise<VerifyOtpResponse> {
    const { email, password } = params;

    if (!email || !email.includes('@')) {
      throw new AppApiError(400, 'Invalid Email', 'Please provide a valid email address.');
    }
    if (!password || password.length < 4) {
      throw new AppApiError(400, 'Invalid Password', 'Please enter your password.');
    }

    if (API_CONFIG.IS_DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0].replace('.', ' '),
        phoneNumber: '8074407557',
        countryCode: '+91',
        role: 'customer',
        createdAt: new Date().toISOString(),
      };

      const token = `vg_mob_cred_${Math.random().toString(36).substring(2)}_${Date.now()}`;
      await this.persistSession(token, mockUser);

      return {
        success: true,
        message: 'Logged in successfully.',
        token,
        user: mockUser,
      };
    }

    const result = await apiClient<VerifyOtpResponse>('/auth/login', {
      method: 'POST',
      body: { email, password, role: 'customer' },
    });

    if (result.user && result.user.role !== 'customer') {
      throw new AppApiError(
        403,
        'Unauthorized Account',
        'This mobile app is for EV drivers only. Administrator accounts are restricted from the mobile app.'
      );
    }

    if (result.token && result.user) {
      await this.persistSession(result.token, result.user);
    }

    return result;
  }

  /**
   * Store token and user securely
   */
  private async persistSession(token: string, user: User): Promise<void> {
    await setStoredToken(token);
    try {
      await Preferences.set({ key: USER_INFO_KEY, value: JSON.stringify(user) });
    } catch {
      // Fallback
    }
    sessionStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
  }

  /**
   * Retrieve stored session
   */
  async getStoredSession(): Promise<{ token: string | null; user: User | null }> {
    try {
      let rawUser: string | null = null;
      try {
        const prefUser = await Preferences.get({ key: USER_INFO_KEY });
        rawUser = prefUser.value;
      } catch {
        // Fallback
      }

      if (!rawUser) {
        rawUser = sessionStorage.getItem(USER_INFO_KEY) || localStorage.getItem(USER_INFO_KEY);
      }

      const user = rawUser ? (JSON.parse(rawUser) as User) : null;
      const token = await getStoredToken();

      // Ensure no admin token leaks
      if (user && user.role !== 'customer') {
        await this.logout();
        return { token: null, user: null };
      }

      return { token, user };
    } catch {
      return { token: null, user: null };
    }
  }

  /**
   * Log out and wipe session
   */
  async logout(): Promise<void> {
    await clearStoredToken();
    try {
      await Preferences.remove({ key: USER_INFO_KEY });
    } catch {
      // Fallback
    }
    sessionStorage.removeItem(USER_INFO_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    sessionStorage.removeItem('vg_pending_phone');
    sessionStorage.removeItem('vg_pending_cc');
  }
}

export const authService = new AuthService();
