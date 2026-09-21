import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { isApiError, missionHistoryQueryOptions } from '@travel-gacha/api';
import { ScreenLayout } from '@/components/ScreenLayout';
import { getCachedMemberId } from '@/services/authSession';

import { MissionListCard, type MissionListCardData } from './components/MissionListCard';
import { styles } from './index.css';

export default function MissionListScreen() {
  const { tripId: tripIdParam } = useLocalSearchParams<{ tripId?: string }>();
  const tripId = tripIdParam ?? '';
  const memberId = getCachedMemberId();

  const [dayIndex, setDayIndex] = useState(0);

  const missionHistoryQuery = useQuery({
    ...missionHistoryQueryOptions({ tripId, memberId }),
    enabled: Boolean(tripId)
  });
  const days = missionHistoryQuery.data ?? [];
  const selectedDay = days[dayIndex];

  const missions: MissionListCardData[] = (selectedDay?.missions ?? []).map((mission) => {
    const timeSource = mission.completedAt ?? mission.failedAt ?? mission.startedAt;
    return {
      id: mission.tripMissionId,
      title: mission.title,
      difficulty: mission.difficulty,
      status: mission.status,
      time: timeSource ? timeSource.slice(11, 16) : undefined
    };
  });

  return (
    <ScreenLayout title="미션 목록 보기" scrollable showBack fallbackRoute="/travel">
      <View style={styles.container}>
        {missionHistoryQuery.isPending ? <ActivityIndicator style={styles.state} /> : null}
        {missionHistoryQuery.isError ? (
          <View style={styles.state}>
            <Text style={styles.stateTitle}>미션 목록을 불러오지 못했어요.</Text>
            <Text style={styles.stateDescription}>
              {isApiError(missionHistoryQuery.error)
                ? missionHistoryQuery.error.message
                : '잠시 후 다시 시도해주세요.'}
            </Text>
          </View>
        ) : null}
        {missionHistoryQuery.isSuccess && days.length > 0 ? (
          <>
            <View style={styles.dateRow}>
              <Pressable onPress={() => setDayIndex((index) => Math.max(0, index - 1))} hitSlop={8}>
                <Text style={[styles.dateArrow, dayIndex === 0 && styles.dateArrowDisabled]}>
                  ‹
                </Text>
              </Pressable>
              <Text style={styles.dateText}>DAY {selectedDay?.dayNo ?? dayIndex + 1}</Text>
              <Pressable
                onPress={() => setDayIndex((index) => Math.min(days.length - 1, index + 1))}
                hitSlop={8}
              >
                <Text
                  style={[
                    styles.dateArrow,
                    dayIndex >= days.length - 1 && styles.dateArrowDisabled
                  ]}
                >
                  ›
                </Text>
              </Pressable>
            </View>
            {missions.length === 0 ? (
              <Text style={styles.emptyText}>이 날짜엔 진행된 미션이 없어요.</Text>
            ) : (
              <View style={styles.list}>
                {missions.map((mission) => (
                  <MissionListCard key={mission.id} mission={mission} />
                ))}
              </View>
            )}
          </>
        ) : null}
        {missionHistoryQuery.isSuccess && days.length === 0 ? (
          <Text style={styles.emptyText}>아직 진행된 미션이 없어요.</Text>
        ) : null}
      </View>
    </ScreenLayout>
  );
}
