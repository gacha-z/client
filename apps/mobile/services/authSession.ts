import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const AUTH_SESSION_KEY = 'travel-gacha.auth-session';
const MOCK_ACCOUNT_KEY = 'travel-gacha.mock-account';
const AUTH_TOKEN_KEY = 'travel-gacha.auth-token';
const STORED_VALUE = 'true';

function getWebStorage() {
  if (typeof globalThis.localStorage === 'undefined') return null;
  return globalThis.localStorage;
}

async function getItem(key: string) {
  if (Platform.OS === 'web') {
    return getWebStorage()?.getItem(key) ?? null;
  }

  return SecureStore.getItemAsync(key);
}

async function setItem(key: string, value: string) {
  if (Platform.OS === 'web') {
    getWebStorage()?.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

async function deleteItem(key: string) {
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

/** API 연동 전, 회원가입을 마친 mock 계정인지 구분하기 위한 값입니다. */
export async function hasMockAccount() {
  return (await getItem(MOCK_ACCOUNT_KEY)) === STORED_VALUE;
}

export function saveMockAccount() {
  return setItem(MOCK_ACCOUNT_KEY, STORED_VALUE);
}

export function clearMockAccount() {
  return deleteItem(MOCK_ACCOUNT_KEY);
}

/**
 * 실제 로그인 연동 전까지, `EXPO_PUBLIC_DEV_JWT`가 설정되어 있으면 그 값을 우선 사용합니다.
 * 없으면 저장된 토큰(추후 실제 로그인 완료 시 saveAuthToken으로 채워짐)을 사용합니다.
 */
export async function getAuthToken() {
  const devToken = process.env.EXPO_PUBLIC_DEV_JWT;
  if (devToken) return devToken;
  return getItem(AUTH_TOKEN_KEY);
}

export function saveAuthToken(token: string) {
  return setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  return deleteItem(AUTH_TOKEN_KEY);
}
