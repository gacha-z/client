import { getApiClient, unwrap, type ApiEnvelope } from '../client';

type SocialLoginResponse = {
  memberId: number;
  accessToken: string;
  refreshToken: string;
  newMember: boolean;
};

export type AppleLoginResult = {
  memberId: number;
  accessToken: string;
  refreshToken: string;
  newMember: boolean;
};

export const loginWithApple = async (identityToken: string): Promise<AppleLoginResult> =>
  unwrap(
    getApiClient().post<ApiEnvelope<SocialLoginResponse>>('/api/v1/auth/login/apple', {
      identityToken
    })
  );

export const logout = async (memberId: number): Promise<void> => {
  await unwrap(
    getApiClient().post<ApiEnvelope<unknown>>('/api/v1/auth/logout', undefined, {
      params: { userId: memberId }
    })
  );
};

type JwtTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export const refreshTokens = async (refreshToken: string): Promise<JwtTokenResponse> =>
  unwrap(
    getApiClient().post<ApiEnvelope<JwtTokenResponse>>('/api/v1/auth/refresh', { refreshToken })
  );
