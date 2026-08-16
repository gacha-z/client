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
  retryLoading?: boolean;
};

export function RegionCandidateCard({
  imageUrl,
  name,
  description,
  selected = false,
  onPress,
  onRetry,
  retryLoading = false
}: RegionCandidateCardProps) {
  return (
    <View style={[styles.container, selected ? styles.selected : styles.default]}>
      <Pressable
        accessibilityLabel={`${name} 지역 후보`}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        style={styles.selectionButton}
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
          </View>
        </View>
      </Pressable>
      {onRetry ? (
        <Pressable
          accessibilityLabel={`${name} 후보 다시 뽑기`}
          accessibilityRole="button"
          accessibilityState={{ busy: retryLoading, disabled: retryLoading }}
          disabled={retryLoading}
          style={[styles.retryButton, retryLoading && styles.retryButtonDisabled]}
          onPress={onRetry}
          hitSlop={8}
        >
          <RedoIcon />
        </Pressable>
      ) : null}
    </View>
  );
}
