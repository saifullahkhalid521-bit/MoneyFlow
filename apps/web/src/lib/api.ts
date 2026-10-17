import type { ApiResponse, ApiErrorResponse, HealthStatusDto } from '@moneyflow/shared';

export class ApiClientError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode: number, code: string, details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `/api/v1${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const errorData = json as ApiErrorResponse | null;
    throw new ApiClientError(
      errorData?.error?.message || `Request failed with status ${res.status}`,
      res.status,
      errorData?.error?.code || 'UNKNOWN_ERROR',
      errorData?.error?.details
    );
  }

  const successData = json as ApiResponse<T>;
  return successData.data;
}

export async function checkHealth(): Promise<HealthStatusDto> {
  return fetchApi<HealthStatusDto>('/health');
}
