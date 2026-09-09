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
    public readonly code?: string | number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;

/** 백엔드 공통 응답 포맷 — 성공/실패 모두 이 봉투에 담겨 온다 */
export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  error?: {
    code?: number;
    message: string;
  };
};

const extractMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === 'object' && data !== null) {
      const nestedError = (data as { error?: { message?: unknown } }).error;
      if (nestedError && typeof nestedError.message === 'string') return nestedError.message;

      const message = (data as { message?: unknown }).message;
      if (typeof message === 'string') return message;
    }

    return error.message;
  }

  if (error instanceof Error) return error.message;
  return 'Unknown API error';
};

const extractCode = (error: unknown): string | number | undefined => {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === 'object' && data !== null) {
      const nestedError = (data as { error?: { code?: unknown } }).error;
      if (typeof nestedError?.code === 'number') return nestedError.code;
    }
    return error.code;
  }
  return undefined;
};

const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;

  if (isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    return new ApiError(extractMessage(error), status, error.response?.data, extractCode(error));
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0);
  }

  return new ApiError('Unknown API error', 0);
};

/** 응답 봉투에서 `data`만 꺼낸다. `success:false`면 ApiError로 던진다. */
export const unwrap = async <T>(request: Promise<AxiosResponse<ApiEnvelope<T>>>): Promise<T> => {
  const { data: envelope } = await request;
  if (!envelope.success) {
    throw new ApiError(
      envelope.error?.message ?? 'API 요청이 실패했습니다.',
      0,
      envelope,
      envelope.error?.code
    );
  }
  return envelope.data;
};

type AuthTokenProvider = () => string | null | Promise<string | null>;

let authTokenProvider: AuthTokenProvider = () => null;

/** 플랫폼별 토큰 저장소를 주입한다 — packages/api는 SecureStore 등 저장 방식을 알지 못한다 */
export const setAuthTokenProvider = (provider: AuthTokenProvider): void => {
  authTokenProvider = provider;
};

export const createApiClient = (config?: AxiosRequestConfig): AxiosInstance => {
  const client = axios.create({
    baseURL: getApiBaseUrl(),
    headers: { 'Content-Type': 'application/json' },
    timeout: 15_000,
    ...config
  });

  client.interceptors.request.use(async (requestConfig) => {
    try {
      const token = await authTokenProvider();
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('[api] Failed to retrieve auth token:', error);
    }
    return requestConfig;
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
