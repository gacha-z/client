import { Alert, Linking, Pressable, Text, View } from 'react-native';
import { useMutation } from '@tanstack/react-query';

import { downloadSetlog, isApiError } from '@travel-gacha/api';
import type { MissionHistoryStatus } from '@travel-gacha/types';
import { Tag } from '@/components/Tag';
import { InfoRow } from '@/components/TravelPrimitives';
import { commonStyles } from '@/components/TravelPrimitives/index.css';
import { getCachedMemberId } from '@/services/authSession';
import type { MissionRecord } from '@/types';

import { styles } from './index.css';

type MissionCardProps = {
  mission: MissionRecord;
};

const STATUS_LABEL: Record<MissionHistoryStatus, string> = {
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  FAILED: '실패',
  NOT_PERFORMED: '미진행'
};

export function MissionCard({ mission }: MissionCardProps) {
  const memberId = getCachedMemberId();

  const downloadMutation = useMutation({
    mutationFn: downloadSetlog,
    onSuccess: (fileUrl) => {
      Linking.openURL(fileUrl).catch(() => {
        Alert.alert('다운로드 실패', '영상을 여는 데 실패했어요.');
      });
    },
    onError: (error) => {
      Alert.alert(
        '다운로드 실패',
        isApiError(error) ? error.message : '잠시 후 다시 시도해주세요.'
      );
    }
  });

  const handleDownload = (setlogId: string) => {
    if (!memberId) return;
    downloadMutation.mutate({ setlogId, memberId });
  };

  const completedTime = mission.completedAt?.slice(11, 16);

  return (
    <View style={[commonStyles.card, styles.missionCard]}>
      <View style={styles.headerRow}>
        <Tag label={STATUS_LABEL[mission.status]} />
        <Tag label={`난이도 ${mission.difficulty}`} />
      </View>
      <Text style={styles.missionTitle} numberOfLines={2}>
        {mission.title}
      </Text>
      {mission.description ? (
        <Text style={styles.missionDescription} numberOfLines={2}>
          {mission.description}
        </Text>
      ) : null}
      {completedTime ? <InfoRow icon="clock">{completedTime} 미션 완료</InfoRow> : null}

      {mission.setlogs.length > 0 ? (
        <View style={styles.setlogList}>
          {mission.setlogs.map((setlog) => (
            <View key={setlog.id} style={styles.setlogRow}>
              <Text style={styles.setlogMember} numberOfLines={1}>
                {setlog.memberNickname}
              </Text>
              <Pressable
                style={styles.downloadButton}
                disabled={downloadMutation.isPending}
                onPress={() => handleDownload(setlog.id)}
              >
                <Text style={styles.downloadLabel}>다운로드</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>아직 업로드된 미션로그가 없어요.</Text>
      )}
    </View>
  );
}
