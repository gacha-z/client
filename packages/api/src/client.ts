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
type RefreshTokenProvider = () => string | null | Promise<string | null>;
type RefreshedTokens = { accessToken: string; refreshToken: string };
type TokensRefreshedHandler = (tokens: RefreshedTokens) => void | Promise<void>;
type AuthExpiredHandler = () => void | Promise<void>;

let authTokenProvider: AuthTokenProvider = () => null;
let refreshTokenProvider: RefreshTokenProvider = () => null;
let onTokensRefreshed: TokensRefreshedHandler = () => {};
let onAuthExpired: AuthExpiredHandler = () => {};

/** 플랫폼별 토큰 저장소를 주입한다 — packages/api는 SecureStore 등 저장 방식을 알지 못한다 */
export const setAuthTokenProvider = (provider: AuthTokenProvider): void => {
  authTokenProvider = provider;
};

/** 만료된 액세스 토큰을 재발급할 때 사용할 refresh token을 제공한다 */
export const setRefreshTokenProvider = (provider: RefreshTokenProvider): void => {
  refreshTokenProvider = provider;
};

/** 재발급에 성공하면 새 토큰 쌍을 플랫폼 저장소에 반영할 수 있도록 호출된다 */
export const setOnTokensRefreshed = (handler: TokensRefreshedHandler): void => {
  onTokensRefreshed = handler;
};

/** refresh token마저 만료/무효라 재발급이 실패하면 호출된다 — 세션 정리는 호출 측 책임 */
export const setOnAuthExpired = (handler: AuthExpiredHandler): void => {
  onAuthExpired = handler;
};

const REFRESH_TOKEN_URL = '/api/v1/auth/refresh';

/** 동시에 여러 요청이 401을 받아도 재발급 호출은 한 번만 나가도록 한다 */
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = (client: AxiosInstance): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = await refreshTokenProvider();
      if (!refreshToken) return null;

      const tokens = await unwrap<RefreshedTokens>(
        client.post(REFRESH_TOKEN_URL, { refreshToken })
      );
      await onTokensRefreshed(tokens);
      return tokens.accessToken;
    })()
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
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
    async (error: unknown) => {
      if (!isAxiosError(error) || error.response?.status !== 401) {
        return Promise.reject(toApiError(error));
      }

      const originalRequest = error.config as
        | (AxiosRequestConfig & { _retry?: boolean })
        | undefined;
      const isRefreshRequest = originalRequest?.url === REFRESH_TOKEN_URL;

      if (!originalRequest || originalRequest._retry || isRefreshRequest) {
        if (isRefreshRequest) await onAuthExpired();
        return Promise.reject(toApiError(error));
      }
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken(client);
      if (!newAccessToken) {
        await onAuthExpired();
        return Promise.reject(toApiError(error));
      }

      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${newAccessToken}`
      };
      return client(originalRequest);
    }
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
