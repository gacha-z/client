import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { styles } from './index.css';

export type TodayRecordItem = {
  key: string;
  icon: ReactNode;
  label: string;
  sublabel: string;
  onPress?: () => void;
};

type TodayRecordGridProps = {
  items: TodayRecordItem[];
};

/** "오늘의 기록" 바로가기 그리드 — 카드 목록은 호출부(TodayRecordSection)에서 결정 */
export function TodayRecordGrid({ items }: TodayRecordGridProps) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <Pressable key={item.key} style={styles.card} onPress={item.onPress}>
          <View style={styles.iconWrap}>{item.icon}</View>
          <View style={styles.textWrap}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.sublabel} numberOfLines={1}>
              {item.sublabel}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
