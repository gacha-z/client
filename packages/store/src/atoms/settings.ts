import { atom } from 'jotai';

import { MOCK_USER_PROFILE, type MockUserProfile } from '../mocks/user';

export type PermissionSettings = {
  camera: boolean;
  location: boolean;
  pushNotification: boolean;
};

const INITIAL_PERMISSION_SETTINGS: PermissionSettings = {
  camera: true,
  location: true,
  pushNotification: true
};

export const userProfileAtom = atom<MockUserProfile>(MOCK_USER_PROFILE);

/** 실제 값은 마운트 시 OS 권한 API로 덮어쓴다 — 초기값은 조회 전 깜빡임 방지용 기본값일 뿐이다 */
export const permissionSettingsAtom = atom<PermissionSettings>(INITIAL_PERMISSION_SETTINGS);

export const resetSettingsAtom = atom(null, (_get, set) => {
  set(userProfileAtom, MOCK_USER_PROFILE);
  set(permissionSettingsAtom, INITIAL_PERMISSION_SETTINGS);
});
