// apps/mobile/components/TodayRecordSection/index.tsx
import { Text, View } from 'react-native';

import { colors } from '@travel-gacha/ui';
import { BookIcon, CardsIcon, DiaryIcon, MovieIcon } from '@/components/icons';
import { TodayRecordGrid, type TodayRecordItem } from '@/components/TodayRecordGrid';

import { styles } from './index.css';

const RECORD_ITEMS: TodayRecordItem[] = [
  {
    key: 'diary',
    icon: <DiaryIcon size={20} color={colors.blue500} />,
    label: '여행 일기장',
    sublabel: '오늘의 추억을 기록해요.'
  },
  {
    key: 'mission-log',
    icon: <MovieIcon size={20} color={colors.blue500} />,
    label: '미션로그 보기',
    sublabel: '함께한 순간을 확인해요.'
  },
  {
    key: 'mission-list',
    icon: <CardsIcon size={20} color={colors.blue500} />,
    label: '미션 목록 보기',
    sublabel: '미션 목록을 확인해요.'
  },
  {
    key: 'collection',
    icon: <BookIcon size={20} />,
    label: '도감 목록',
    sublabel: '획득한 아이템을 확인해요.'
  }
];

/** "오늘의 기록" 섹션(제목+힌트+바로가기 그리드) — 미션 플로우 전 단계(idle/selecting/pending) 공통 */
export function TodayRecordSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>오늘의 기록</Text>
      <Text style={styles.sectionHint}>여행의 순간을 남겨보세요!</Text>
      <TodayRecordGrid items={RECORD_ITEMS} />
    </View>
  );
}
