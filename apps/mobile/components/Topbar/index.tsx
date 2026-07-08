import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';

import { BackIcon } from '@/components/icons';

import { styles } from './index.css';

type TopbarProps = {
  title: string;
  showBack?: boolean;
  onPressBack?: () => void;
  fallbackRoute?: Href;
  right?: ReactNode;
  onPressRight?: () => void;
};

/** 화면별 타이틀 + 액션 영역 */
export function Topbar({
  title,
  showBack,
  onPressBack,
  fallbackRoute,
  right,
  onPressRight
}: TopbarProps) {
  const router = useRouter();
  const canGoBack = showBack ?? router.canGoBack();
  const handleBack =
    onPressBack ??
    (() => {
      if (router.canGoBack()) {
        router.back();
        return;
      }

      if (fallbackRoute) {
        router.replace(fallbackRoute);
      }
    });

  return (
    <View style={styles.container}>
      {canGoBack && (
        <Pressable style={styles.back} onPress={handleBack} hitSlop={8}>
          <BackIcon />
        </Pressable>
      )}
      <View style={styles.titleWrapper} pointerEvents="none">
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
      {right && (
        <View style={styles.right}>
          {onPressRight ? <Pressable onPress={onPressRight}>{right}</Pressable> : right}
        </View>
      )}
    </View>
  );
}
