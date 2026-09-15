import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';

import { isApiError, tripListInfiniteQueryOptions } from '@travel-gacha/api';
import { Bigbutton } from '@/components/Bigbutton';
import { RandomIcon } from '@/components/icons';
import { ScreenLayout } from '@/components/ScreenLayout';
import { TravelCard } from '@/components/TravelCard';
import { TravelScheduleCalendar } from '@/components/TravelScheduleCalendar';
import { getDevMemberId } from '@/services/authSession';
import { toDateKey, toTravelListItem } from '@/utils';

import { styles } from './index.css';

export default function HomeScreen() {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const scheduledTripsQuery = useInfiniteQuery(
    tripListInfiniteQueryOptions({
      status: 'CREATED',
      dateFrom: toDateKey(new Date()),
      size: 50,
      memberId: getDevMemberId()
    })
  );
  const scheduledTrips =
    scheduledTripsQuery.data?.pages
      .flatMap((page) => page.trips)
      .map(toTravelListItem)
      .filter((trip) => trip.status === 'scheduled') ?? [];

  const handleRangeChange = (nextStartDate: Date | null, nextEndDate: Date | null) => {
    setStartDate(nextStartDate);
    setEndDate(nextEndDate);
  };

  const handleStartRandomTravel = () => {
    if (!startDate || !endDate) return;

    router.push({
      pathname: '/travel-create',
      params: {
        startDate: toDateKey(startDate),
        endDate: toDateKey(endDate)
      }
    });
  };

  return (
    <ScreenLayout title="홈" headerActions showTopbar={false} scrollable>
      <View style={styles.content}>
        <Text style={styles.heading}>나만의 여행 랜덤 코스를 만들어봐요!</Text>
        <TravelScheduleCalendar onRangeChange={handleRangeChange} />
        <Bigbutton
          label="랜덤 여행 시작하기"
          icon={<RandomIcon />}
          disabled={!startDate || !endDate}
          onPress={handleStartRandomTravel}
        />
        <Pressable
          accessibilityRole="button"
          style={styles.joinLink}
          onPress={() => router.push('/travel-join')}
        >
          <Text style={styles.joinLinkLabel}>초대 코드로 여행 참여하기</Text>
        </Pressable>
        <View style={styles.scheduledSection}>
          <Text style={styles.sectionTitle}>예정된 여행</Text>
          <View style={styles.tripList}>
            {scheduledTripsQuery.isPending && <ActivityIndicator style={styles.state} />}
            {scheduledTripsQuery.isError && (
              <View style={styles.state}>
                <Text style={styles.stateTitle}>예정된 여행을 불러오지 못했어요.</Text>
                <Text style={styles.stateDescription}>
                  {isApiError(scheduledTripsQuery.error)
                    ? scheduledTripsQuery.error.message
                    : '잠시 후 다시 시도해주세요.'}
                </Text>
                <Pressable style={styles.retryButton} onPress={() => scheduledTripsQuery.refetch()}>
                  <Text style={styles.retryLabel}>다시 시도</Text>
                </Pressable>
              </View>
            )}
            {scheduledTripsQuery.isSuccess && scheduledTrips.length === 0 && (
              <View style={styles.state}>
                <Text style={styles.stateDescription}>예정된 여행이 없어요.</Text>
              </View>
            )}
            {scheduledTrips.map((trip) => (
              <TravelCard key={trip.id} trip={trip} />
            ))}
          </View>
        </View>
      </View>
    </ScreenLayout>
  );
}
