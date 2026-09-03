import { Text, View } from 'react-native';

import type { CollectionEntry } from '@/constants';

import { CollectionCard } from '../CollectionCard';
import { styles } from './index.css';

type CollectionGridProps = {
  entries: ReadonlyArray<CollectionEntry>;
  unlockedIds: ReadonlySet<string>;
};

export function CollectionGrid({ entries, unlockedIds }: CollectionGridProps) {
  if (entries.length === 0) {
    return <Text style={styles.empty}>이 카테고리에는 아직 도감이 없어요.</Text>;
  }

  return (
    <View style={styles.grid}>
      {entries.map((entry) => (
        <CollectionCard key={entry.id} entry={entry} unlocked={unlockedIds.has(entry.id)} />
      ))}
    </View>
  );
}
