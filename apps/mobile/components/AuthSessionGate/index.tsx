import { useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getDefaultStore, useSetAtom } from 'jotai';

import {
  setAuthTokenProvider,
  setOnAuthExpired,
  setOnTokensRefreshed,
  setRefreshTokenProvider
} from '@travel-gacha/api';
import { authStatusAtom, logoutAtom, userProfileAtom } from '@travel-gacha/store';
import { colors } from '@travel-gacha/ui';
import { usePermissionSync } from '@/hooks/usePermissionSync';
import { clearLocalSession } from '@/services/auth';
import {
  getAuthToken,
  getEmail,
  getMemberId,
  getRefreshToken,
  hasAuthSession,
  saveAuthToken,
  saveRefreshToken
} from '@/services/authSession';
import { requestCameraPermission, requestLocationPermission } from '@/services/permissions';
import { requestPushNotificationRegistration } from '@/services/pushNotifications';

import { styles } from './index.css';

setAuthTokenProvider(getAuthToken);
setRefreshTokenProvider(getRefreshToken);
setOnTokensRefreshed(async ({ accessToken, refreshToken }) => {
  await saveAuthToken(accessToken);
  await saveRefreshToken(refreshToken);
});
setOnAuthExpired(async () => {
  await clearLocalSession();
  getDefaultStore().set(logoutAtom);
});

type AuthSessionGateProps = {
  children: ReactNode;
};

/** 저장된 세션 확인이 끝난 뒤 라우트를 렌더링해 로그인 화면 깜빡임을 방지합니다. */
export function AuthSessionGate({ children }: AuthSessionGateProps) {
  const setAuthStatus = useSetAtom(authStatusAtom);
  const setUserProfile = useSetAtom(userProfileAtom);
  const [restored, setRestored] = useState(false);

  usePermissionSync();

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        const [signedIn, memberId, email] = await Promise.all([
          hasAuthSession(),
          getMemberId(),
          getEmail()
        ]);
        if (mounted) setAuthStatus(signedIn ? 'signedIn' : 'signedOut');
        if (signedIn && email && mounted) {
          setUserProfile((current) => ({ ...current, email }));
        }
        if (signedIn && memberId) {
          // 이미 결정된 권한은 다이얼로그 없이 통과하므로 매 실행마다 호출해도 안전하다.
          void requestPushNotificationRegistration(memberId);
          void requestCameraPermission(memberId);
          void requestLocationPermission(memberId);
        }
      } catch {
        // 저장소를 읽지 못한 경우 안전하게 비로그인 상태로 시작합니다.
        if (mounted) setAuthStatus('signedOut');
      } finally {
        if (mounted) setRestored(true);
      }
    };

    void restoreSession();

    return () => {
      mounted = false;
    };
  }, [setAuthStatus, setUserProfile]);

  if (!restored) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.blue500} />
      </View>
    );
  }

  return children;
}
