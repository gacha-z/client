import { atom } from 'jotai';

import { userProfileAtom } from './settings';

export type AuthStatus = 'signedOut' | 'signupRequired' | 'signedIn';

/** 인증 API 연동 전 앱의 인증 흐름을 제어하는 상태 */
export const authStatusAtom = atom<AuthStatus>('signedOut');

export const completeLoginAtom = atom(
  null,
  (_get, set, { isFirstLogin, email }: { isFirstLogin: boolean; email?: string | null }) => {
    set(authStatusAtom, isFirstLogin ? 'signupRequired' : 'signedIn');
    if (email) set(userProfileAtom, (current) => ({ ...current, email }));
  }
);

export const completeSignupAtom = atom(null, (_get, set) => {
  set(authStatusAtom, 'signedIn');
});

export const logoutAtom = atom(null, (_get, set) => {
  set(authStatusAtom, 'signedOut');
});

export const withdrawAccountAtom = atom(null, (_get, set) => {
  set(authStatusAtom, 'signedOut');
});
