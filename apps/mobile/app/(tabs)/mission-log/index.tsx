import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Text, View } from 'react-native';
import { useInfiniteQuery, useMutation, useQueries, useQuery } from '@tanstack/react-query';

import {
  downloadMissionSetlogs,
  isApiError,
  missionHistoryQueryOptions,
  missionSetlogsQueryOptions,
  tripListInfiniteQueryOptions
} from '@travel-gacha/api';
import { ScreenLayout } from '@/components/ScreenLayout';
import { getDevMemberId } from '@/services/authSession';
import { toTravelListItem } from '@/utils';

import { MissionLogHeader } from './components/MissionLogHeader';
import { MissionLogCard } from './components/MissionLogCard';
import { styles } from './index.css';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export default function MissionLogScreen() {
  const memberId = getDevMemberId();
  const [selectedTripId, setSelectedTripId] = useState<string | undefined>(undefined);
  const [dayIndex, setDayIndex] = useState(0);

  const tripListQuery = useInfiniteQuery(tripListInfiniteQueryOptions({ size: 20, memberId }));
  const trips = useMemo(
    () => tripListQuery.data?.pages.flatMap((page) => page.trips).map(toTravelListItem) ?? [],
    [tripListQuery.data]
  );
  const activeTrips = useMemo(() => trips.filter((trip) => trip.status === 'active'), [trips]);
  const selectedTrip = selectedTripId
    ? activeTrips.find((trip) => trip.id === selectedTripId)
    : activeTrips[0];
  const tripId = selectedTrip?.id ?? '';

  const missionHistoryQuery = useQuery({
    ...missionHistoryQueryOptions({ tripId, memberId }),
    enabled: Boolean(tripId)
  });
  const days = missionHistoryQuery.data ?? [];
  const selectedDay = days[dayIndex];
  const dayDate = selectedTrip
    ? new Date(
        Date.parse(`${selectedTrip.period.startDate.replaceAll('.', '-')}T00:00:00Z`) +
          dayIndex * MS_PER_DAY
      )
    : undefined;
  const dateLabel = dayDate
    ? `${dayDate.getUTCFullYear()}.${String(dayDate.getUTCMonth() + 1).padStart(2, '0')}.${String(
        dayDate.getUTCDate()
      ).padStart(2, '0')}`
    : '';

  const missionIds = selectedDay?.missions.map((mission) => mission.tripMissionId) ?? [];
  const setlogQueries = useQueries({
    queries: missionIds.map((tripMissionId) => missionSetlogsQueryOptions(tripMissionId, memberId))
  });
  const setlogs = setlogQueries.flatMap((query) => query.data ?? []);
  const isSetlogsPending = setlogQueries.some((query) => query.isPending);

  const downloadMutation = useMutation({
    mutationFn: async () => {
      if (!memberId) throw new Error('회원 정보를 불러오는 중이에요.');
      const results = await Promise.all(
        missionIds.map((id) => downloadMissionSetlogs(id, memberId))
      );
      return results.flat();
    },
    onSuccess: async (allSetlogs) => {
      for (const setlog of allSetlogs) {
        // eslint-disable-next-line no-await-in-loop
        await Linking.openURL(setlog.fileUrl).catch(() => undefined);
      }
    },
    onError: (error) => {
      Alert.alert(
        '다운로드 실패',
        isApiError(error) ? error.message : '잠시 후 다시 시도해주세요.'
      );
    }
  });

  const handleSelectTrip = () => {
    if (activeTrips.length <= 1) return;
    Alert.alert(
      '여행 선택',
      undefined,
      activeTrips.map((trip) => ({
        text: trip.title,
        onPress: () => {
          setSelectedTripId(trip.id);
          setDayIndex(0);
        }
      }))
    );
  };

  return (
    <ScreenLayout title="미션로그" scrollable showBack={false}>
      <View style={styles.container}>
        {tripListQuery.isPending ? <ActivityIndicator style={styles.state} /> : null}
        {tripListQuery.isSuccess && !selectedTrip ? (
          <Text style={styles.emptyText}>진행중인 여행이 없어요.</Text>
        ) : null}
        {selectedTrip ? (
          <>
            <MissionLogHeader
              selectedTrip={selectedTrip}
              onSelectTrip={handleSelectTrip}
              canSelectTrip={activeTrips.length > 1}
              date={dateLabel}
              canGoPreviousDay={dayIndex > 0}
              canGoNextDay={dayIndex < days.length - 1}
              onPreviousDay={() => setDayIndex((index) => Math.max(0, index - 1))}
              onNextDay={() => setDayIndex((index) => Math.min(days.length - 1, index + 1))}
              onDownload={() => downloadMutation.mutate()}
              downloadDisabled={missionIds.length === 0 || downloadMutation.isPending}
            />
            {missionHistoryQuery.isPending || isSetlogsPending ? (
              <ActivityIndicator style={styles.state} />
            ) : null}
            {missionHistoryQuery.isSuccess && setlogs.length === 0 ? (
              <Text style={styles.emptyText}>아직 업로드된 미션로그가 없어요.</Text>
            ) : null}
            <View style={styles.list}>
              {setlogs.map((setlog) => (
                <MissionLogCard key={setlog.id} setlog={setlog} />
              ))}
            </View>
          </>
        ) : null}
      </View>
    </ScreenLayout>
  );
}
