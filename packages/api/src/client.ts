import axios, {
  isAxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse
} from 'axios';

import { getApiBaseUrl } from './config';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;

const extractMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === 'object' && data !== null && 'message' in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === 'string') return message;
    }

    return error.message;
  }

  if (error instanceof Error) return error.message;
  return 'Unknown API error';
};

const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;

  if (isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    return new ApiError(extractMessage(error), status, error.response?.data, error.code);
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0);
  }

  return new ApiError('Unknown API error', 0);
};

export const createApiClient = (config?: AxiosRequestConfig): AxiosInstance => {
  const client = axios.create({
    baseURL: getApiBaseUrl(),
    headers: { 'Content-Type': 'application/json' },
    timeout: 15_000,
    ...config
  });

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: unknown) => Promise.reject(toApiError(error))
  );

  return client;
};

let apiClientInstance: AxiosInstance | undefined;

/** SSR/번들 초기화 시점 env 미설정 방지 — 첫 요청 시 생성 */
export const getApiClient = (): AxiosInstance => {
  if (!apiClientInstance) {
    apiClientInstance = createApiClient();
  }
  return apiClientInstance;
};

/** @deprecated getApiClient() 사용 권장 */
export const apiClient = {
  get: (...args: Parameters<AxiosInstance['get']>) => getApiClient().get(...args),
  post: (...args: Parameters<AxiosInstance['post']>) => getApiClient().post(...args),
  put: (...args: Parameters<AxiosInstance['put']>) => getApiClient().put(...args),
  patch: (...args: Parameters<AxiosInstance['patch']>) => getApiClient().patch(...args),
  delete: (...args: Parameters<AxiosInstance['delete']>) => getApiClient().delete(...args)
};
