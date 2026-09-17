import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const AUTH_SESSION_KEY = 'travel-gacha.auth-session';
const AUTH_TOKEN_KEY = 'travel-gacha.auth-token';
const REFRESH_TOKEN_KEY = 'travel-gacha.refresh-token';
const MEMBER_ID_KEY = 'travel-gacha.member-id';
const STORED_VALUE = 'true';
let cachedMemberId: number | undefined;

function getWebStorage() {
  if (typeof globalThis.localStorage === 'undefined') return null;
  return globalThis.localStorage;
}

/** 플랫폼별 보안 저장소 — authSession 외 모듈(예: deviceSession)에서도 재사용합니다. */
export async function getItem(key: string) {
  if (Platform.OS === 'web') {
    return getWebStorage()?.getItem(key) ?? null;
  }

  return SecureStore.getItemAsync(key);
}

export async function setItem(key: string, value: string) {
  if (Platform.OS === 'web') {
    getWebStorage()?.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

export async function deleteItem(key: string) {
  if (Platform.OS === 'web') {
    getWebStorage()?.removeItem(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

/** 앱 시작 시 저장된 로그인 세션을 복원합니다. */
export async function hasAuthSession() {
  return (await getItem(AUTH_SESSION_KEY)) === STORED_VALUE;
}

export function saveAuthSession() {
  return setItem(AUTH_SESSION_KEY, STORED_VALUE);
}

export function clearAuthSession() {
  return deleteItem(AUTH_SESSION_KEY);
}

/**
 * 저장된 실제 토큰(로그인/재발급으로 채워짐)을 우선 사용합니다.
 * 아직 로그인 전이라 저장된 토큰이 없을 때만 `EXPO_PUBLIC_DEV_JWT`로 대체합니다.
 */
export async function getAuthToken() {
  const storedToken = await getItem(AUTH_TOKEN_KEY);
  if (storedToken) return storedToken;
  return process.env.EXPO_PUBLIC_DEV_JWT ?? null;
}

export function saveAuthToken(token: string) {
  return setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  return deleteItem(AUTH_TOKEN_KEY);
}

export function getRefreshToken() {
  return getItem(REFRESH_TOKEN_KEY);
}

export function saveRefreshToken(token: string) {
  return setItem(REFRESH_TOKEN_KEY, token);
}

export function clearRefreshToken() {
  return deleteItem(REFRESH_TOKEN_KEY);
}

export async function getMemberId(): Promise<number | undefined> {
  if (cachedMemberId) return cachedMemberId;

  const storedMemberId = Number(await getItem(MEMBER_ID_KEY));
  if (Number.isInteger(storedMemberId) && storedMemberId > 0) {
    cachedMemberId = storedMemberId;
    return storedMemberId;
  }

  return getDevMemberId();
}

export async function saveMemberId(memberId: number): Promise<void> {
  cachedMemberId = memberId;
  await setItem(MEMBER_ID_KEY, String(memberId));
}

export async function clearMemberId(): Promise<void> {
  cachedMemberId = undefined;
  await deleteItem(MEMBER_ID_KEY);
}

/** 로그인 연동 전, 저장된 회원 ID 또는 .env 값을 동기적으로 조회합니다. */
export function getDevMemberId(): number | undefined {
  if (cachedMemberId) return cachedMemberId;
  const memberId = Number(process.env.EXPO_PUBLIC_DEV_MEMBER_ID);
  return Number.isInteger(memberId) && memberId > 0 ? memberId : undefined;
}
