export class AppApiError extends Error {
  public status: number;
  public userMessage: string;
  public details?: unknown;

  constructor(status: number, message: string, userMessage?: string, details?: unknown) {
    super(message);
    this.name = 'AppApiError';
    this.status = status;
    this.details = details;
    this.userMessage =
      userMessage ||
      'Unable to complete request. Please verify your internet connection and try again.';
  }
}

export function parseErrorMessage(error: unknown): string {
  if (error instanceof AppApiError) {
    return error.userMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred. Please try again.';
}
