import { Pressable, Text, View } from 'react-native';

import { colors } from '@travel-gacha/ui';
import { CategoryIcon, RedoIcon } from '@/components/icons';

import { styles } from './index.css';

type MissionSelectCardStatus = 'active' | 'default' | 'inProgress';

type MissionSelectCardProps = {
  title: string;
  description: string;
  missionType: string;
  difficulty: number;
  status?: MissionSelectCardStatus;
  /** 전달하지 않으면 "다시하기" 뱃지를 표시하지 않는다 */
  onRetry?: () => void;
};

/** 미션 선택 캐러셀/현황 카드 (③⑦ 캐러셀, ⑨ 수행중, ⑩⑬ 배경) */
export function MissionSelectCard({
  title,
  description,
  missionType,
  difficulty,
  status = 'default',
  onRetry
}: MissionSelectCardProps) {
  const isInProgress = status === 'inProgress';
  const difficultyLabel = '★'.repeat(Math.min(Math.max(difficulty, 1), 5));

  return (
    <View
      style={[
        styles.container,
        status === 'active' ? styles.active : isInProgress ? styles.inProgress : styles.default
      ]}
    >
      <View style={styles.body}>
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>{missionType}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>
        <View style={styles.row}>
          <CategoryIcon size={16} color="#979eb1" />
          <Text style={styles.difficulty}>{difficultyLabel}</Text>
        </View>
      </View>
      {(isInProgress || onRetry) && (
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
      )}
    </View>
  );
}
