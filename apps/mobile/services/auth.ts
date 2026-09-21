import { loginWithApple as requestAppleLogin, logout as requestLogout } from '@travel-gacha/api';

import {
  clearAuthSession,
  clearAuthToken,
  clearEmail,
  clearMemberId,
  clearRefreshToken,
  getMemberId,
  saveAuthSession,
  saveAuthToken,
  saveEmail,
  saveMemberId,
  saveRefreshToken
} from './authSession';

export type AppleLoginResult = {
  isFirstLogin: boolean;
};

/**
 * Apple은 최초 인증에만 이메일을 내려준다(`credential.email`). 받으면 저장해 이후 세션에서도
 * 실제 이메일을 표시할 수 있게 한다 — 두 번째 로그인부터는 undefined이므로 저장을 건너뛴다.
 */
export async function signInWithApple(
  identityToken: string,
  email?: string | null
): Promise<AppleLoginResult> {
  const result = await requestAppleLogin(identityToken);
  await saveMemberId(result.memberId);
  await saveAuthToken(result.accessToken);
  await saveRefreshToken(result.refreshToken);
  await saveAuthSession();
  if (email) await saveEmail(email);
  return { isFirstLogin: result.newMember };
}

export async function signOut(): Promise<void> {
  const memberId = await getMemberId();
  try {
    if (memberId) await requestLogout(memberId);
  } finally {
    await clearLocalSession();
  }
}

export async function clearLocalSession(): Promise<void> {
  await Promise.all([
    clearAuthSession(),
    clearAuthToken(),
    clearRefreshToken(),
    clearMemberId(),
    clearEmail()
  ]);
}
