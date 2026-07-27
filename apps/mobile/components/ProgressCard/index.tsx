import { Image, Text, View } from 'react-native';

import type { MissionOutcome, TripMember } from '@travel-gacha/types';

import { styles } from './index.css';

type ProgressCardProps = {
  completed: number;
  total: number;
  statusLabel: string;
  members: TripMember[];
  /** true면 ⑨ 화면처럼 전체 미션 수만큼 분할된 진행바로 표시 */
  segmented?: boolean;
  /** 오늘 시도한 미션들의 결과를 시간순으로 기록 — 세그먼트를 순서대로 성공(파랑)/실패(빨강)로 채운다 */
  outcomes?: MissionOutcome[];
};

/** 오늘의 진행도 카드 (①③⑦⑨ 공통) */
export function ProgressCard({
  completed,
  total,
  statusLabel,
  members,
  segmented,
  outcomes = []
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
          {Array.from({ length: Math.max(total, 0) }).map((_, index) => {
            const outcome = outcomes[index];
            return (
              <View
                key={index}
                style={[
                  styles.segment,
                  outcome === 'success' && styles.segmentFilled,
                  outcome === 'failure' && styles.segmentGivenUp
                ]}
              />
            );
          })}
        </View>
      ) : (
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
        </View>
      )}
      <View style={styles.memberRow}>
        {members.map((member) => (
          <View key={member.id} style={styles.memberItem}>
            {member.avatarUri ? (
              <Image source={{ uri: member.avatarUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
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
