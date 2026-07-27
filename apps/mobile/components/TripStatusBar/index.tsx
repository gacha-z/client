import { Pressable, Text, View } from 'react-native';

import { MoreIcon, PlaceRoundIcon } from '@/components/icons';

import { styles } from './index.css';

type TripStatusBarProps = {
  tripName: string;
  day: number;
  showMore?: boolean;
  onPressMore?: () => void;
};

/** 장소 아이콘 + 여행명 + DAY 뱃지 (+선택적 more 버튼) — ①②③⑦⑨ 공통 */
export function TripStatusBar({ tripName, day, showMore, onPressMore }: TripStatusBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <PlaceRoundIcon size={20} />
        <Text style={styles.tripName} numberOfLines={1}>
          {tripName}
        </Text>
        <View style={styles.dayBadge}>
          <Text style={styles.dayBadgeText}>DAY {day}</Text>
        </View>
      </View>
      {showMore && (
        <Pressable onPress={onPressMore} hitSlop={8}>
          <MoreIcon size={24} />
        </Pressable>
      )}
    </View>
  );
}
