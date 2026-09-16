import { Image, Text, View, type TextStyle, type ViewStyle } from 'react-native';

import { colors } from '@travel-gacha/ui';
import { CollectionIcon, CollectionItemPlaceholderIcon, LockIcon } from '@/components/icons';
import { COLLECTION_CATEGORY_LABELS, type CollectionCategory } from '@/constants';

import { styles } from './index.css';

export type CollectionViewEntry = {
  id: string;
  category: CollectionCategory;
  title: string;
  requirement: string;
  imageUrl?: string;
  progress?: string;
};

type CollectionCardProps = {
  entry: CollectionViewEntry;
  unlocked: boolean;
};

const ICON_SIZE = 28;

const CATEGORY_TAG_STYLES: Record<CollectionCategory, { container: ViewStyle; label: TextStyle }> =
  {
    BADGE: { container: styles.badgeTag, label: styles.badgeLabel },
    ITEM: { container: styles.itemTag, label: styles.itemLabel }
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
        {unlocked && entry.category === 'ITEM' && entry.imageUrl ? (
          <Image source={{ uri: entry.imageUrl }} style={styles.itemImage} />
        ) : unlocked ? (
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
          {entry.progress ?? entry.requirement}
        </Text>
      </View>
    </View>
  );
}
