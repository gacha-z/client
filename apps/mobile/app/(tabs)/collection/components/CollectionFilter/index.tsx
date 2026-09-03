import { Pressable, ScrollView, Text } from 'react-native';

import { COLLECTION_FILTERS, type CollectionFilterValue } from '@/constants';

import { styles } from './index.css';

type CollectionFilterProps = {
  value: CollectionFilterValue;
  onChange: (value: CollectionFilterValue) => void;
};

export function CollectionFilter({ value, onChange }: CollectionFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {COLLECTION_FILTERS.map((filter) => {
        const isSelected = filter.value === value;

        return (
          <Pressable
            key={filter.value}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(filter.value)}
            style={[styles.filter, isSelected && styles.filterSelected]}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>{filter.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
