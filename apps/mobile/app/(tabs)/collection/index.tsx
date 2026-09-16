import { useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useQueries } from '@tanstack/react-query';

import { badgesQueryOptions, isApiError, itemsQueryOptions } from '@travel-gacha/api';
import { CollectionGrid } from '@/components/Collection/CollectionGrid';
import { CollectionSummary } from '@/components/Collection/CollectionSummary';
import type { CollectionViewEntry } from '@/components/Collection/CollectionCard';
import { ScreenLayout } from '@/components/ScreenLayout';
import { COLLECTION_FILTERS, type CollectionFilterValue } from '@/constants';
import { getDevMemberId } from '@/services/authSession';

import { CollectionFilter } from './components/CollectionFilter';
import { styles } from './index.css';

export default function CollectionScreen() {
  const [filter, setFilter] = useState<CollectionFilterValue>('ALL');
  const memberId = getDevMemberId();

  const [badgesQuery, itemsQuery] = useQueries({
    queries: [badgesQueryOptions(memberId), itemsQueryOptions(memberId)]
  });

  const entries: CollectionViewEntry[] = useMemo(() => {
    const badgeEntries: CollectionViewEntry[] = (badgesQuery.data ?? []).map((badge) => ({
      id: `badge-${badge.id}`,
      category: 'BADGE',
      title: badge.name,
      requirement: badge.description,
      progress: `${Math.min(badge.currentCount, badge.targetCount)}/${badge.targetCount}`
    }));
    const itemEntries: CollectionViewEntry[] = (itemsQuery.data ?? []).map((item) => ({
      id: `item-${item.id}`,
      category: 'ITEM',
      title: item.itemName,
      requirement: item.description,
      imageUrl: item.imageUrl
    }));
    return [...badgeEntries, ...itemEntries];
  }, [badgesQuery.data, itemsQuery.data]);

  const unlockedIds = useMemo(() => {
    const badgeIds = (badgesQuery.data ?? [])
      .filter((badge) => badge.achieved)
      .map((badge) => `badge-${badge.id}`);
    const itemIds = (itemsQuery.data ?? [])
      .filter((item) => item.acquired)
      .map((item) => `item-${item.id}`);
    return new Set([...badgeIds, ...itemIds]);
  }, [badgesQuery.data, itemsQuery.data]);

  const filteredEntries = useMemo(
    () => (filter === 'ALL' ? entries : entries.filter((entry) => entry.category === filter)),
    [entries, filter]
  );
  const summaryTitle = `${COLLECTION_FILTERS.find((item) => item.value === filter)?.label ?? '전체'} 도감`;
  const unlockedCount = filteredEntries.filter((entry) => unlockedIds.has(entry.id)).length;

  const isPending = badgesQuery.isPending || itemsQuery.isPending;
  const isError = badgesQuery.isError || itemsQuery.isError;
  const error = badgesQuery.error ?? itemsQuery.error;

  return (
    <ScreenLayout title="도감 목록" scrollable headerActions showBack={false}>
      <View style={styles.container}>
        <CollectionFilter value={filter} onChange={setFilter} />
        {isPending ? <ActivityIndicator style={styles.state} /> : null}
        {isError ? (
          <View style={styles.state}>
            <Text style={styles.stateTitle}>도감 정보를 불러오지 못했어요.</Text>
            <Text style={styles.stateDescription}>
              {isApiError(error) ? error.message : '잠시 후 다시 시도해주세요.'}
            </Text>
          </View>
        ) : null}
        {!isPending && !isError ? (
          <>
            <CollectionSummary
              title={summaryTitle}
              unlockedCount={unlockedCount}
              totalCount={filteredEntries.length}
            />
            <CollectionGrid entries={filteredEntries} unlockedIds={unlockedIds} />
          </>
        ) : null}
      </View>
    </ScreenLayout>
  );
}
