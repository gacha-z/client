import { useState } from 'react';
import { View } from 'react-native';

import type { RegionCandidate } from '@/types';

import { RegionCandidateCard } from '../RegionCandidateCard';
import { styles } from './index.css';

type RegionCandidateListProps = {
  items: RegionCandidate[];
  initialSelectedId?: string | null;
  onSelectionChange?: (selectedId: string | null) => void;
  onRetryItem?: (item: RegionCandidate) => void;
};

export function RegionCandidateList({
  items,
  initialSelectedId = null,
  onSelectionChange,
  onRetryItem
}: RegionCandidateListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);

  const handleSelect = (itemId: string) => {
    const nextSelectedId = selectedId === itemId ? null : itemId;

    setSelectedId(nextSelectedId);
    onSelectionChange?.(nextSelectedId);
  };

  return (
    <View style={styles.list}>
      {items.map((item) => (
        <RegionCandidateCard
          key={item.id}
          imageUrl={item.imageUrl}
          name={item.name}
          description={item.description}
          selected={item.id === selectedId}
          onPress={() => handleSelect(item.id)}
          onRetry={() => onRetryItem?.(item)}
        />
      ))}
    </View>
  );
}
