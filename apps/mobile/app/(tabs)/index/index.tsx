import { Pressable, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';

import {
  MOCK_MEMBERS,
  MOCK_TODAY_PROGRESS,
  MOCK_TRIP,
  allMembersVerifiedAtom,
  clearMissionAtom,
  giveUpMissionAtom,
  memberVerificationsAtom,
  missionStageAtom,
  selectedMissionAtom,
  startMissionSelectionAtom
} from '@travel-gacha/store';
import { colors } from '@travel-gacha/ui';
import { Bigbutton } from '@/components/Bigbutton';
import { BookIcon, CardsIcon, DiaryIcon, MovieIcon } from '@/components/icons';
import { MemberStatusPill } from '@/components/MemberStatusPill';
import { MissionSelectCard } from '@/components/MissionSelectCard';
import { Modal } from '@/components/Modal';
import { ProgressCard } from '@/components/ProgressCard';
import { ScreenLayout } from '@/components/ScreenLayout';
import { TodayRecordGrid, type TodayRecordItem } from '@/components/TodayRecordGrid';
import { TripStatusBar } from '@/components/TripStatusBar';

import { styles } from './index.css';

export default function HomeScreen() {
  const router = useRouter();
  // RN Modal은 앱 전역에 뜨므로, 홈이 화면 맨 위일 때만 클리어 모달을 띄운다.
  // 가드 없이는 마지막 멤버 인증 직후 ⑪ 촬영 리스트 위에 모달이 떠버린다 (설계 결정 10).
  const pathname = usePathname();
  const stage = useAtomValue(missionStageAtom);
  const selectedMission = useAtomValue(selectedMissionAtom);
  const verifications = useAtomValue(memberVerificationsAtom);
  const allVerified = useAtomValue(allMembersVerifiedAtom);
  const startSelection = useSetAtom(startMissionSelectionAtom);
  const giveUp = useSetAtom(giveUpMissionAtom);
  const clearMission = useSetAtom(clearMissionAtom);

  const isPending = stage === 'pending';
  const isHomeFocused = pathname === '/';

  const handleStartMission = () => {
    startSelection();
    router.push('/mission-select');
  };

  const recordItems: TodayRecordItem[] = isPending
    ? [
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
        }
      ]
    : [
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

  return (
    <ScreenLayout title="홈" headerActions showTopbar={false} scrollable>
      <View style={styles.content}>
        <TripStatusBar
          tripName={MOCK_TRIP.name}
          day={MOCK_TRIP.day}
          showMore={!isPending}
          onPressMore={() => {}}
        />
        <ProgressCard
          completed={MOCK_TODAY_PROGRESS.completed}
          total={MOCK_TODAY_PROGRESS.total}
          statusLabel="미션 완료"
          members={MOCK_MEMBERS}
          segmented={isPending}
        />
        {isPending && selectedMission ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>오늘의 랜덤 미션</Text>
            <Text style={styles.sectionHint}>
              멤버 모두가 미션로그를 촬영해야 미션 완료가 가능해요!
            </Text>
            <View style={styles.pendingRow}>
              <MissionSelectCard
                imageUri={selectedMission.imageUri}
                placeName={selectedMission.placeName}
                description={selectedMission.description}
                address={selectedMission.address}
                reward={selectedMission.reward}
                status="inProgress"
              />
              <View style={styles.pillList}>
                {MOCK_MEMBERS.map((member) => {
                  const verified = verifications[member.id] === 'verified';
                  return (
                    <MemberStatusPill
                      key={member.id}
                      name={member.name}
                      statusLabel={verified ? '미션 인증' : '미션 미인증'}
                      variant={verified ? 'verified' : 'unverified'}
                    />
                  );
                })}
              </View>
            </View>
            <Bigbutton label="미션 완료" disabled={!allVerified} onPress={clearMission} />
            <Pressable onPress={giveUp}>
              <Text style={styles.giveUpText}>
                미션이 너무 어려워서 포기하고 싶다구요?! 미션 포기하기
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>오늘의 랜덤 미션</Text>
            <Text style={styles.sectionHint}>
              미션 시작하기 버튼을 눌러 오늘의 미션을 시작해보아요!
            </Text>
            <Bigbutton label="미션 시작하기" onPress={handleStartMission} />
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>오늘의 기록</Text>
          <Text style={styles.sectionHint}>여행의 순간을 남겨보세요!</Text>
          <TodayRecordGrid items={recordItems} />
        </View>
      </View>
      <Modal
        visible={isPending && allVerified && isHomeFocused}
        onClose={clearMission}
        title="미션을 클리어했어요!"
        onConfirm={clearMission}
        confirmText="미션 완료"
        closeOnBackdropPress={false}
      >
        <Text style={styles.modalBody}>
          축하합니다 🎉🎉{'\n'}아이템 획득 후, 새로운 미션에 도전해보아요!
        </Text>
      </Modal>
    </ScreenLayout>
  );
}
