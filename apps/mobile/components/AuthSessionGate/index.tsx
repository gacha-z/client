import { useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSetAtom } from 'jotai';

import { authStatusAtom } from '@travel-gacha/store';
import { colors } from '@travel-gacha/ui';
import { hasAuthSession } from '@/services/authSession';

import { styles } from './index.css';

type AuthSessionGateProps = {
  children: ReactNode;
};

/** 저장된 세션 확인이 끝난 뒤 라우트를 렌더링해 로그인 화면 깜빡임을 방지합니다. */
export function AuthSessionGate({ children }: AuthSessionGateProps) {
  const setAuthStatus = useSetAtom(authStatusAtom);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        const signedIn = await hasAuthSession();
        if (mounted) setAuthStatus(signedIn ? 'signedIn' : 'signedOut');
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
  }, [setAuthStatus]);

  if (!restored) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.blue500} />
      </View>
    );
  }

  return children;
}
