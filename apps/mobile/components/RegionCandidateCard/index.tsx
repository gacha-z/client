import { Image, Pressable, Text, View } from 'react-native';

import { RedoIcon } from '@/components/icons';

import { styles } from './index.css';

type RegionCandidateCardProps = {
  imageUrl: string;
  name: string;
  description: string;
  selected?: boolean;
  onPress?: () => void;
  onRetry?: () => void;
};

export function RegionCandidateCard({
  imageUrl,
  name,
  description,
  selected = false,
  onPress,
  onRetry
}: RegionCandidateCardProps) {
  return (
    <Pressable
      style={[styles.container, selected ? styles.selected : styles.default]}
      onPress={onPress}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.description} numberOfLines={3}>
            {description}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.hint}>탭해서 선택</Text>
          <Pressable
            style={styles.retryButton}
            onPress={(event) => {
              event.stopPropagation();
              onRetry?.();
            }}
            hitSlop={8}
          >
            <RedoIcon />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
