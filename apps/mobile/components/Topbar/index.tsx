import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { BackIcon } from '@/components/icons';

import { styles } from './index.css';

type TopbarProps = {
  title: string;
  right?: ReactNode;
  onPressRight?: () => void;
};

/** 화면별 타이틀 + 액션 영역 */
export function Topbar({ title, right, onPressRight }: TopbarProps) {
  const router = useRouter();
  const canGoBack = router.canGoBack();

  return (
    <View style={styles.container}>
      {canGoBack && (
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={8}>
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
