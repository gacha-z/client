import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { authStatusAtom, completeLoginAtom } from '@travel-gacha/store';
import { colors } from '@travel-gacha/ui';
import { AppleIcon, LogoIcon } from '@/components/icons';
import { mockAppleLogin } from '@/mocks/auth';

import { styles } from './index.css';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const authStatus = useAtomValue(authStatusAtom);
  const completeLogin = useSetAtom(completeLoginAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (authStatus === 'signupRequired') return <Redirect href="/signup" />;
  if (authStatus === 'signedIn') return <Redirect href="/" />;

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await mockAppleLogin();
      completeLogin(result);
    } catch {
      setErrorMessage('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const logoSize = Math.max(60, Math.min(88, height * 0.11));
  const actionsBottomPadding = Math.max(8, Math.min(48, height * 0.05));

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 24) }
      ]}
    >
      <View style={styles.brand}>
        <LogoIcon size={logoSize} color={colors.white} />
        <Text style={styles.brandName}>여행가챠</Text>
      </View>

      <View style={[styles.actions, { paddingBottom: actionsBottomPadding }]}>
        {errorMessage && (
          <Text accessibilityLiveRegion="polite" style={styles.errorMessage}>
            {errorMessage}
          </Text>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ busy: isLoading, disabled: isLoading }}
          disabled={isLoading}
          onPress={() => void handleLogin()}
          style={({ pressed }) => [
            styles.loginButton,
            styles.appleButton,
            pressed && styles.pressed
          ]}
        >
          <View style={styles.appleIcon}>
            {isLoading ? <ActivityIndicator color={colors.black} /> : <AppleIcon />}
          </View>
          <Text style={styles.appleLabel}>Apple로 로그인</Text>
        </Pressable>
      </View>
    </View>
  );
}
