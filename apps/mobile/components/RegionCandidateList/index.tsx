import { View } from 'react-native';

import type { RegionCandidateSlot } from '@/types';

import { RegionCandidateCard } from '../RegionCandidateCard';
import { styles } from './index.css';

type RegionCandidateListProps = {
  items: RegionCandidateSlot[];
  selectedId: string | null;
  onSelectionChange: (selectedId: string | null) => void;
  onRetryItem?: (item: RegionCandidateSlot) => void;
  retryingId?: string | null;
};

export function RegionCandidateList({
  items,
  selectedId,
  onSelectionChange,
  onRetryItem,
  retryingId = null
}: RegionCandidateListProps) {
  const handleSelect = (itemId: string) => {
    const nextSelectedId = selectedId === itemId ? null : itemId;
    onSelectionChange(nextSelectedId);
  };

  return (
    <View style={styles.list}>
      {items.map((item) => {
        const retryAvailable = onRetryItem && !item.rerollUsed;

        return (
          <RegionCandidateCard
            key={item.id}
            imageUrl={item.region.imageUrl}
            name={item.region.name}
            description={item.region.description}
            selected={item.id === selectedId}
            onPress={() => handleSelect(item.id)}
            onRetry={retryAvailable ? () => onRetryItem(item) : undefined}
            retryLoading={item.id === retryingId}
          />
        );
      })}
    </View>
  );
}
