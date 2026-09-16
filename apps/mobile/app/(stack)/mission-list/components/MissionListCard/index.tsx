import { Text, View } from 'react-native';

import type { MissionHistoryStatus } from '@travel-gacha/types';
import { Tag } from '@/components/Tag';
import { InfoRow } from '@/components/TravelPrimitives';

import { styles } from './index.css';

export type MissionListCardData = {
  id: string;
  title: string;
  difficulty: number;
  status: MissionHistoryStatus;
  time?: string;
};

const STATUS_LABEL: Record<MissionHistoryStatus, string> = {
  IN_PROGRESS: '진행중',
  COMPLETED: '미션 성공',
  FAILED: '미션 실패',
  NOT_PERFORMED: '미진행'
};

export function MissionListCard({ mission }: { mission: MissionListCardData }) {
  return (
    <View style={styles.card}>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          “{mission.title}”
        </Text>
        {mission.time ? (
          <InfoRow icon="clock">
            {mission.time} {STATUS_LABEL[mission.status]}
          </InfoRow>
        ) : (
          <Text style={styles.statusText}>{STATUS_LABEL[mission.status]}</Text>
        )}
        <Tag label={`난이도 ${mission.difficulty}`} />
      </View>
    </View>
  );
}
