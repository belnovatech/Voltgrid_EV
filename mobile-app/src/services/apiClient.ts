import { API_CONFIG } from './apiConfig';
import { AppApiError } from './errorHandler';
import { Preferences } from '@capacitor/preferences';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
  retries?: number;
}

const AUTH_TOKEN_KEY = 'vg_auth_token';

export async function getStoredToken(): Promise<string | null> {
  try {
    const res = await Preferences.get({ key: AUTH_TOKEN_KEY });
    if (res.value) return res.value;
  } catch {
    // Fallback to localStorage/sessionStorage
  }
  return sessionStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY);
}

export async function setStoredToken(token: string): Promise<void> {
  try {
    await Preferences.set({ key: AUTH_TOKEN_KEY, value: token });
  } catch {
    // Fallback
  }
  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export async function clearStoredToken(): Promise<void> {
  try {
    await Preferences.remove({ key: AUTH_TOKEN_KEY });
  } catch {
    // Fallback
  }
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    timeoutMs = API_CONFIG.REQUEST_TIMEOUT_MS,
    retries = method === 'GET' ? API_CONFIG.MAX_RETRIES : 0,
  } = options;

  const url = `${API_CONFIG.BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  const token = await getStoredToken();

  let attempt = 0;
  while (attempt <= retries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timer);

      let data: unknown = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const parsedMessage =
          typeof data === 'object' && data !== null && 'message' in data
            ? String((data as { message: unknown }).message)
            : 'Server returned an error response.';

        let friendly = 'Unable to complete request. Please try again.';
        if (response.status === 400 || response.status === 422) {
          friendly = parsedMessage || 'Invalid information provided.';
        } else if (response.status === 401 || response.status === 403) {
          friendly = 'Your session has expired or is unauthorized. Please log in.';
        } else if (response.status === 404) {
          friendly = 'The requested resource was not found.';
        } else if (response.status >= 500) {
          friendly = 'Voltgrid servers are momentarily unavailable. Please retry shortly.';
        }

        throw new AppApiError(response.status, parsedMessage, friendly, data);
      }

      return data as T;
    } catch (err: unknown) {
      clearTimeout(timer);

      if (err instanceof AppApiError) {
        throw err;
      }

      if (err instanceof DOMException && err.name === 'AbortError') {
        if (attempt < retries) {
          attempt++;
          continue;
        }
        throw new AppApiError(408, 'Request timed out', 'Request took too long to complete. Please retry.');
      }

      if (attempt < retries) {
        attempt++;
        continue;
      }

      throw new AppApiError(
        0,
        'Network error',
        'Unable to connect to Voltgrid EV services. Please check your network connection.'
      );
    }
  }

  throw new AppApiError(0, 'Unknown failure', 'Failed after retries.');
}
