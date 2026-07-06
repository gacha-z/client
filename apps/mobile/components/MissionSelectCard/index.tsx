import { Image, Pressable, Text, View } from 'react-native';

import { colors } from '@travel-gacha/ui';
import { CategoryIcon, PlaceIcon, RedoIcon } from '@/components/icons';

import { styles } from './index.css';

type MissionSelectCardStatus = 'active' | 'default' | 'inProgress';

type MissionSelectCardProps = {
  imageUri: string;
  placeName: string;
  description: string;
  address: string;
  reward: string;
  status?: MissionSelectCardStatus;
  onRetry?: () => void;
};

/** 미션 선택 캐러셀/현황 카드 (③⑦ 캐러셀, ⑨ 수행중, ⑩⑬ 배경) */
export function MissionSelectCard({
  imageUri,
  placeName,
  description,
  address,
  reward,
  status = 'default',
  onRetry
}: MissionSelectCardProps) {
  const isInProgress = status === 'inProgress';

  return (
    <View
      style={[
        styles.container,
        status === 'active' ? styles.active : isInProgress ? styles.inProgress : styles.default
      ]}
    >
      <Image source={{ uri: imageUri }} style={styles.thumbnail} />
      <View style={styles.body}>
        <Text style={styles.placeName}>{placeName}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <View style={styles.row}>
          <PlaceIcon size={16} color="#979eb1" />
          <Text style={styles.address} numberOfLines={1}>
            {address}
          </Text>
        </View>
        <View style={styles.row}>
          <CategoryIcon size={16} color="#979eb1" />
          <View style={styles.rewardTag}>
            <Text style={styles.rewardText}>{reward}</Text>
          </View>
        </View>
      </View>
      <View style={styles.badge}>
        {isInProgress ? (
          <Text style={styles.badgeText}>수행중</Text>
        ) : (
          <Pressable style={styles.retryButton} onPress={onRetry} hitSlop={8}>
            <RedoIcon size={13.2} color={colors.grey400} />
            <Text style={styles.badgeText}>다시하기</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
