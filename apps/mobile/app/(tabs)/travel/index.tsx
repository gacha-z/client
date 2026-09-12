import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';

import { isApiError, tripListInfiniteQueryOptions } from '@travel-gacha/api';
import { ScreenLayout } from '@/components/ScreenLayout';
import { TravelCard } from '@/components/TravelCard';
import { getDevMemberId } from '@/services/authSession';
import { toTravelListItem } from '@/utils';

import { styles } from './index.css';

export default function TravelListScreen() {
  const tripListQuery = useInfiniteQuery(
    tripListInfiniteQueryOptions({
      size: 10,
      memberId: getDevMemberId()
    })
  );
  const trips = tripListQuery.data?.pages.flatMap((page) => page.trips).map(toTravelListItem) ?? [];

  return (
    <ScreenLayout title="여행 목록" scrollable headerActions showBack={false}>
      <View style={styles.list}>
        {tripListQuery.isPending && <ActivityIndicator style={styles.state} />}
        {tripListQuery.isError && (
          <View style={styles.state}>
            <Text style={styles.stateTitle}>여행 목록을 불러오지 못했어요.</Text>
            <Text style={styles.stateDescription}>
              {isApiError(tripListQuery.error)
                ? tripListQuery.error.message
                : '잠시 후 다시 시도해주세요.'}
            </Text>
            <Pressable style={styles.retryButton} onPress={() => tripListQuery.refetch()}>
              <Text style={styles.retryLabel}>다시 시도</Text>
            </Pressable>
          </View>
        )}
        {tripListQuery.isSuccess && trips.length === 0 && (
          <View style={styles.state}>
            <Text style={styles.stateTitle}>아직 참여한 여행이 없어요.</Text>
          </View>
        )}
        {trips.map((trip) => (
          <TravelCard key={trip.id} trip={trip} />
        ))}
        {tripListQuery.hasNextPage && (
          <Pressable
            style={styles.moreButton}
            disabled={tripListQuery.isFetchingNextPage}
            onPress={() => tripListQuery.fetchNextPage()}
          >
            {tripListQuery.isFetchingNextPage ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.moreLabel}>여행 더 보기</Text>
            )}
          </Pressable>
        )}
      </View>
    </ScreenLayout>
  );
}
