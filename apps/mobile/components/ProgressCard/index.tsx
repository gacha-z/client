import { Text, View } from 'react-native';

import type { TripMember } from '@travel-gacha/types';

import { styles } from './index.css';

type ProgressCardProps = {
  completed: number;
  total: number;
  statusLabel: string;
  members: TripMember[];
  /** true면 ⑨ 화면처럼 3분할 진행바로 표시 */
  segmented?: boolean;
};

/** 오늘의 진행도 카드 (①③⑦⑨ 공통) */
export function ProgressCard({
  completed,
  total,
  statusLabel,
  members,
  segmented
}: ProgressCardProps) {
  const ratio = total === 0 ? 0 : Math.min(completed / total, 1);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>오늘의 진행도</Text>
        <View style={styles.countRow}>
          <Text style={styles.count}>
            {completed} / {total}
          </Text>
          <Text style={styles.statusLabel}>{statusLabel}</Text>
        </View>
      </View>
      {segmented ? (
        <View style={styles.segmentedTrack}>
          {[0, 1, 2].map((index) => (
            <View key={index} style={[styles.segment, index / 3 < ratio && styles.segmentFilled]} />
          ))}
        </View>
      ) : (
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
        </View>
      )}
      <View style={styles.memberRow}>
        {members.map((member) => (
          <View key={member.id} style={styles.memberItem}>
            <View style={styles.avatar} />
            <Text style={styles.memberName}>{member.name}</Text>
            {member.isMissionPicker && (
              <View style={styles.pickerBadge}>
                <Text style={styles.pickerBadgeText}>선택</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
