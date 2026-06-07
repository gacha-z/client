import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { styles } from './index.css';

type TopbarProps = {
  title: string;
  right?: ReactNode;
  onPressRight?: () => void;
};

/** 화면별 타이틀 + 액션 영역 */
export function Topbar({ title, right, onPressRight }: TopbarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {right ? onPressRight ? <Pressable onPress={onPressRight}>{right}</Pressable> : right : null}
    </View>
  );
}
