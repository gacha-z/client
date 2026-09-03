import { atom } from 'jotai';

export type AuthStatus = 'signedOut' | 'signupRequired' | 'signedIn';

/** 인증 API 연동 전 앱의 인증 흐름을 제어하는 상태 */
export const authStatusAtom = atom<AuthStatus>('signedOut');

export const signupSuccessModalAtom = atom(false);

export const completeLoginAtom = atom(
  null,
  (_get, set, { isFirstLogin }: { isFirstLogin: boolean }) => {
    set(authStatusAtom, isFirstLogin ? 'signupRequired' : 'signedIn');
  }
);

export const completeSignupAtom = atom(null, (_get, set) => {
  set(authStatusAtom, 'signedIn');
  set(signupSuccessModalAtom, true);
});

export const dismissSignupSuccessModalAtom = atom(null, (_get, set) => {
  set(signupSuccessModalAtom, false);
});
