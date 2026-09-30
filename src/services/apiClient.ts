import { ENV } from '../config/environment';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
}

export class ApiError extends Error {
  public status: number;
  public userMessage: string;

  constructor(status: number, message: string, userMessage?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.userMessage = userMessage || 'Something went wrong. Please check your connection and try again.';
  }
}

/**
 * Clean HTTP client abstraction layer
 */
export async function apiClient<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    timeoutMs = 10000,
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const url = `${ENV.API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    let data: unknown = null;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const parsedMessage = typeof data === 'object' && data !== null && 'message' in data 
        ? String((data as { message: unknown }).message)
        : 'The server returned an unexpected error.';

      let friendlyMessage = 'Unable to complete your request. Please try again.';
      if (response.status === 400 || response.status === 422) {
        friendlyMessage = parsedMessage || 'Invalid request details provided.';
      } else if (response.status === 401 || response.status === 403) {
        friendlyMessage = 'Authentication failed. Please check your credentials.';
      } else if (response.status === 404) {
        friendlyMessage = 'Requested service endpoint could not be found.';
      } else if (response.status >= 500) {
        friendlyMessage = 'Our servers are currently experiencing issues. Please try again in a few moments.';
      }

      throw new ApiError(response.status, parsedMessage, friendlyMessage);
    }

    return data as T;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(408, 'Request timed out', 'Request took too long to complete. Please try again.');
    }

    // Network error or fetch failure
    throw new ApiError(0, 'Network request failed', 'Unable to connect to VoltGrid services. Please check your network connection.');
  }
}
