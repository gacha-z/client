import { loginWithApple as requestAppleLogin, logout as requestLogout } from '@travel-gacha/api';

import {
  clearAuthSession,
  clearAuthToken,
  clearMemberId,
  clearRefreshToken,
  getMemberId,
  saveAuthSession,
  saveAuthToken,
  saveMemberId,
  saveRefreshToken
} from './authSession';

export type AppleLoginResult = {
  isFirstLogin: boolean;
};

export async function signInWithApple(identityToken: string): Promise<AppleLoginResult> {
  const result = await requestAppleLogin(identityToken);
  await saveMemberId(result.memberId);
  await saveAuthToken(result.accessToken);
  await saveRefreshToken(result.refreshToken);
  await saveAuthSession();
  return { isFirstLogin: result.newMember };
}

export async function signOut(): Promise<void> {
  const memberId = await getMemberId();
  try {
    if (memberId) await requestLogout(memberId);
  } finally {
    await Promise.all([clearAuthSession(), clearAuthToken(), clearRefreshToken(), clearMemberId()]);
  }
}

export async function clearSessionAfterWithdrawal(): Promise<void> {
  await Promise.all([clearAuthSession(), clearAuthToken(), clearRefreshToken(), clearMemberId()]);
}
