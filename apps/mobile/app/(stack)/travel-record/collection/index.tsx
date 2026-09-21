import { useMemo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { isApiError, tripCollectionItemsQueryOptions } from '@travel-gacha/api';
import { CollectionGrid } from '@/components/Collection/CollectionGrid';
import { CollectionSummary } from '@/components/Collection/CollectionSummary';
import type { CollectionViewEntry } from '@/components/Collection/CollectionCard';
import { ScreenLayout } from '@/components/ScreenLayout';
import { getCachedMemberId } from '@/services/authSession';

import { styles } from './index.css';

export default function TripCollectionScreen() {
  const { tripId: tripIdParam } = useLocalSearchParams<{ tripId?: string }>();
  const tripId = tripIdParam ?? '';
  const memberId = getCachedMemberId();

  const itemsQuery = useQuery({
    ...tripCollectionItemsQueryOptions({ tripId, memberId }),
    enabled: Boolean(tripId) && Boolean(memberId)
  });

  const entries: CollectionViewEntry[] = useMemo(
    () =>
      (itemsQuery.data ?? []).map((item) => ({
        id: `item-${item.id}`,
        category: 'ITEM' as const,
        title: item.itemName,
        requirement: item.description,
        imageUrl: item.imageUrl
      })),
    [itemsQuery.data]
  );
  const unlockedIds = useMemo(
    () =>
      new Set(
        (itemsQuery.data ?? []).filter((item) => item.acquired).map((item) => `item-${item.id}`)
      ),
    [itemsQuery.data]
  );

  return (
    <ScreenLayout title="이번 여행의 도감" scrollable showBack fallbackRoute="/travel">
      <View style={styles.container}>
        {itemsQuery.isPending ? <ActivityIndicator style={styles.state} /> : null}
        {itemsQuery.isError ? (
          <View style={styles.state}>
            <Text style={styles.stateTitle}>도감 정보를 불러오지 못했어요.</Text>
            <Text style={styles.stateDescription}>
              {isApiError(itemsQuery.error)
                ? itemsQuery.error.message
                : '잠시 후 다시 시도해주세요.'}
            </Text>
          </View>
        ) : null}
        {itemsQuery.isSuccess ? (
          <>
            <CollectionSummary
              title="이번 여행 도감"
              unlockedCount={unlockedIds.size}
              totalCount={entries.length}
            />
            <CollectionGrid entries={entries} unlockedIds={unlockedIds} />
          </>
        ) : null}
      </View>
    </ScreenLayout>
  );
}
