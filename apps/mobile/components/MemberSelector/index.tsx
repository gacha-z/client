import { Pressable, Text, View } from 'react-native';

import { styles } from './index.css';

type MemberSelectorProps = {
  value: number | null;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export function MemberSelector({ value, onChange, min = 1, max = 10 }: MemberSelectorProps) {
  const memberCounts = Array.from(
    { length: Math.max(max - min + 1, 0) },
    (_, index) => min + index
  );

  return (
    <View style={styles.grid}>
      {memberCounts.map((count) => {
        const selected = count === value;

        return (
          <Pressable
            key={count}
            accessibilityLabel={`여행 인원 ${count}명`}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(count)}
            style={[styles.item, selected && styles.itemSelected]}
          >
            <Text style={[styles.text, selected && styles.textSelected]}>{count}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
