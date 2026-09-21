import { atom } from 'jotai';

export type UserProfile = {
  nickname: string;
  email: string;
  age: number;
};

export type PermissionSettings = {
  camera: boolean;
  location: boolean;
  pushNotification: boolean;
};

const DEFAULT_USER_PROFILE: UserProfile = {
  nickname: '',
  email: '',
  age: 0
};

const INITIAL_PERMISSION_SETTINGS: PermissionSettings = {
  camera: true,
  location: true,
  pushNotification: true
};

/** 실제 값은 로그인/세션 복원 시 API·Apple 로그인 응답으로 채워진다 — 초기값은 조회 전 깜빡임 방지용 기본값일 뿐이다 */
export const userProfileAtom = atom<UserProfile>(DEFAULT_USER_PROFILE);

/** 실제 값은 마운트 시 OS 권한 API로 덮어쓴다 — 초기값은 조회 전 깜빡임 방지용 기본값일 뿐이다 */
export const permissionSettingsAtom = atom<PermissionSettings>(INITIAL_PERMISSION_SETTINGS);

export const resetSettingsAtom = atom(null, (_get, set) => {
  set(userProfileAtom, DEFAULT_USER_PROFILE);
  set(permissionSettingsAtom, INITIAL_PERMISSION_SETTINGS);
});
