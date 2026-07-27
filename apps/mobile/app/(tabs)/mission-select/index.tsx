import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';

import {
  MOCK_MEMBERS,
  MOCK_TODAY_PROGRESS,
  MOCK_TRIP,
  missionCandidatesAtom,
  retryCandidateAtom,
  selectMissionAtom
} from '@travel-gacha/store';
import { colors } from '@travel-gacha/ui';
import { Bigbutton } from '@/components/Bigbutton';
import { BookIcon, CardsIcon, DiaryIcon, MovieIcon } from '@/components/icons';
import { MissionSelectCard } from '@/components/MissionSelectCard';
import { ProgressCard } from '@/components/ProgressCard';
import { ScreenLayout } from '@/components/ScreenLayout';
import { TodayRecordGrid, type TodayRecordItem } from '@/components/TodayRecordGrid';
import { TripStatusBar } from '@/components/TripStatusBar';

import { styles } from './index.css';

const RECORD_ITEMS: TodayRecordItem[] = [
  {
    key: 'diary',
    icon: <DiaryIcon size={20} />,
    label: '여행 일기장',
    sublabel: '오늘의 추억을 기록해요.'
  },
  {
    key: 'mission-log',
    icon: <MovieIcon size={20} />,
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

export default function MissionSelectScreen() {
  const router = useRouter();
  const candidates = useAtomValue(missionCandidatesAtom);
  const retryCandidate = useSetAtom(retryCandidateAtom);
  const selectMission = useSetAtom(selectMissionAtom);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!selectedId) return;
    if (!candidates.some((candidate) => candidate.id === selectedId)) return;
    selectMission(selectedId);
    router.replace('/');
  };

  return (
    <ScreenLayout title="미션 선택" showTopbar={false} headerActions scrollable>
      <View style={styles.content}>
        <TripStatusBar tripName={MOCK_TRIP.name} day={MOCK_TRIP.day} />
        <ProgressCard
          completed={MOCK_TODAY_PROGRESS.completed}
          total={MOCK_TODAY_PROGRESS.total}
          statusLabel="미션 완료"
          members={MOCK_MEMBERS}
        />
        <Text style={styles.sectionTitle}>오늘의 랜덤 미션</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.carousel}>
            {candidates.map((candidate) => (
              <Pressable key={candidate.id} onPress={() => setSelectedId(candidate.id)}>
                <MissionSelectCard
                  imageUri={candidate.imageUri}
                  placeName={candidate.placeName}
                  description={candidate.description}
                  address={candidate.address}
                  reward={candidate.reward}
                  status={selectedId === candidate.id ? 'active' : 'default'}
                  canRetry={candidate.canRetry}
                  onRetry={() => {
                    retryCandidate(candidate.id);
                    if (selectedId === candidate.id) setSelectedId(null);
                  }}
                />
              </Pressable>
            ))}
          </View>
        </ScrollView>
        <Bigbutton
          label="미션 선택하기"
          disabled={!candidates.some((candidate) => candidate.id === selectedId)}
          onPress={handleConfirm}
        />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>오늘의 기록</Text>
          <Text style={styles.sectionHint}>여행의 순간을 남겨보세요!</Text>
          <TodayRecordGrid items={RECORD_ITEMS} />
        </View>
      </View>
    </ScreenLayout>
  );
}
