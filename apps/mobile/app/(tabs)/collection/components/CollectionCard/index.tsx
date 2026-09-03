import { Text, View, type TextStyle, type ViewStyle } from 'react-native';

import { colors } from '@travel-gacha/ui';
import { CollectionIcon, CollectionItemPlaceholderIcon, LockIcon } from '@/components/icons';
import {
  COLLECTION_CATEGORY_LABELS,
  type CollectionCategory,
  type CollectionEntry
} from '@/constants';

import { styles } from './index.css';

type CollectionCardProps = {
  entry: CollectionEntry;
  unlocked: boolean;
};

const ICON_SIZE = 28;

const CATEGORY_TAG_STYLES: Record<CollectionCategory, { container: ViewStyle; label: TextStyle }> =
  {
    REGION_ITEM: {
      container: styles.regionItemTag,
      label: styles.regionItemLabel
    },
    TRAVEL_COUNT: {
      container: styles.travelCountTag,
      label: styles.travelCountLabel
    },
    REGION_EXPLORATION: {
      container: styles.regionExplorationTag,
      label: styles.regionExplorationLabel
    },
    REGION_ACHIEVEMENT: {
      container: styles.regionAchievementTag,
      label: styles.regionAchievementLabel
    },
    MISSION_DIARY: {
      container: styles.missionDiaryTag,
      label: styles.missionDiaryLabel
    },
    FOOD_CAFE: {
      container: styles.foodCafeTag,
      label: styles.foodCafeLabel
    }
  };

export function CollectionCard({ entry, unlocked }: CollectionCardProps) {
  const categoryTagStyle = CATEGORY_TAG_STYLES[entry.category];

  return (
    <View style={[styles.container, !unlocked && styles.containerLocked]}>
      <View style={styles.topRow}>
        <View
          style={[
            styles.categoryTag,
            categoryTagStyle.container,
            !unlocked && styles.categoryTagLocked
          ]}
        >
          <Text
            style={[
              styles.categoryLabel,
              categoryTagStyle.label,
              !unlocked && styles.categoryLabelLocked
            ]}
          >
            {COLLECTION_CATEGORY_LABELS[entry.category]}
          </Text>
        </View>
        {!unlocked && <LockIcon size={17} />}
      </View>

      <View style={styles.iconWrap}>
        {/* TODO: 도감별 전용 아이콘이 확정되면 entry.icon 값에 따라 다시 매핑합니다. */}
        {unlocked ? (
          <CollectionIcon size={ICON_SIZE} color={colors.black} />
        ) : (
          <CollectionItemPlaceholderIcon size={ICON_SIZE} />
        )}
      </View>

      <View style={styles.copy}>
        <Text numberOfLines={1} style={[styles.title, !unlocked && styles.textLocked]}>
          {entry.title}
        </Text>
        <Text numberOfLines={1} style={[styles.requirement, !unlocked && styles.textLocked]}>
          {entry.requirement}
        </Text>
      </View>
    </View>
  );
}
