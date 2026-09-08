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

/** 실제 OS 권한 API 연결 전 설정 화면 확인용 상태 */
export const permissionSettingsAtom = atom<PermissionSettings>(INITIAL_PERMISSION_SETTINGS);

export const resetSettingsAtom = atom(null, (_get, set) => {
  set(userProfileAtom, MOCK_USER_PROFILE);
  set(permissionSettingsAtom, INITIAL_PERMISSION_SETTINGS);
});
