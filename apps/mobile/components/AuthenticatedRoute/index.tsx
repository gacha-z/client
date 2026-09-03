import type { ReactNode } from 'react';
import { Redirect } from 'expo-router';
import { useAtomValue } from 'jotai';

import { authStatusAtom } from '@travel-gacha/store';

type AuthenticatedRouteProps = {
  children: ReactNode;
};

/** 로그인 사용자만 접근할 수 있는 라우트 그룹의 공통 가드 */
export function AuthenticatedRoute({ children }: AuthenticatedRouteProps) {
  const authStatus = useAtomValue(authStatusAtom);

  if (authStatus !== 'signedIn') {
    return <Redirect href={authStatus === 'signupRequired' ? '/signup' : '/login'} />;
  }

  return children;
}
