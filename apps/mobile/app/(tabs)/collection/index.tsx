import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { ScreenLayout } from '@/components/ScreenLayout';
import {
  COLLECTION_ENTRIES,
  COLLECTION_FILTERS,
  PREVIEW_UNLOCKED_COLLECTION_IDS,
  type CollectionFilterValue
} from '@/constants';

import { CollectionFilter } from './components/CollectionFilter';
import { CollectionGrid } from './components/CollectionGrid';
import { CollectionSummary } from './components/CollectionSummary';
import { styles } from './index.css';

export default function CollectionScreen() {
  const [filter, setFilter] = useState<CollectionFilterValue>('ALL');
  const filteredEntries = useMemo(
    () =>
      filter === 'ALL'
        ? COLLECTION_ENTRIES
        : COLLECTION_ENTRIES.filter((entry) => entry.category === filter),
    [filter]
  );
  const summaryTitle = `${COLLECTION_FILTERS.find((item) => item.value === filter)?.label ?? '전체'} 도감`;
  const unlockedCount = filteredEntries.filter((entry) =>
    PREVIEW_UNLOCKED_COLLECTION_IDS.has(entry.id)
  ).length;

  return (
    <ScreenLayout title="도감 목록" scrollable headerActions showBack={false}>
      <View style={styles.container}>
        <CollectionFilter value={filter} onChange={setFilter} />
        <CollectionSummary
          title={summaryTitle}
          unlockedCount={unlockedCount}
          totalCount={filteredEntries.length}
        />
        <CollectionGrid entries={filteredEntries} unlockedIds={PREVIEW_UNLOCKED_COLLECTION_IDS} />
      </View>
    </ScreenLayout>
  );
}
