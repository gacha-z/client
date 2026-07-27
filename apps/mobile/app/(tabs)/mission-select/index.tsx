// apps/mobile/app/(tabs)/mission-select/index.tsx
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { usePathname } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';

import {
  MOCK_MEMBERS,
  MOCK_TODAY_PROGRESS,
  MOCK_TRIP,
  allMembersVerifiedAtom,
  clearMissionAtom,
  giveUpCountAtom,
  giveUpMissionAtom,
  memberVerificationsAtom,
  missionCandidatesAtom,
  missionStageAtom,
  retryCandidateAtom,
  selectMissionAtom,
  selectedMissionAtom,
  startMissionSelectionAtom
} from '@travel-gacha/store';
import { Bigbutton } from '@/components/Bigbutton';
import { MemberStatusPill } from '@/components/MemberStatusPill';
import { MissionSelectCard } from '@/components/MissionSelectCard';
import { Modal } from '@/components/Modal';
import { ProgressCard } from '@/components/ProgressCard';
import { ScreenLayout } from '@/components/ScreenLayout';
import { TodayRecordSection } from '@/components/TodayRecordSection';
import { TripStatusBar } from '@/components/TripStatusBar';

import { styles } from './index.css';

export default function MissionSelectScreen() {
  // RN Modal은 앱 전역에 뜨므로, 이 탭이 화면 맨 위일 때만 클리어 모달을 띄운다.
  // 가드 없이는 마지막 멤버 인증 직후 ⑪ 촬영 리스트 위에 모달이 떠버린다.
  const pathname = usePathname();
  const stage = useAtomValue(missionStageAtom);
  const candidates = useAtomValue(missionCandidatesAtom);
  const selectedMission = useAtomValue(selectedMissionAtom);
  const verifications = useAtomValue(memberVerificationsAtom);
  const allVerified = useAtomValue(allMembersVerifiedAtom);
  const giveUpCount = useAtomValue(giveUpCountAtom);
  const startSelection = useSetAtom(startMissionSelectionAtom);
  const retryCandidate = useSetAtom(retryCandidateAtom);
  const selectMission = useSetAtom(selectMissionAtom);
  const giveUp = useSetAtom(giveUpMissionAtom);
  const clearMission = useSetAtom(clearMissionAtom);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const isSelecting = stage === 'selecting';
  const isPending = stage === 'pending';
  const isTabFocused = pathname === '/mission-select';

  const handleStartMission = () => {
    setSelectedId(null);
    startSelection();
  };

  const handleConfirmSelection = () => {
    if (!candidates.some((candidate) => candidate.id === selectedId)) return;
    selectMission(selectedId as string);
    setSelectedId(null);
  };

  return (
    <ScreenLayout title="미션 선택" showTopbar={false} headerActions scrollable>
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
          segmented={isPending || giveUpCount > 0}
          givenUpCount={giveUpCount}
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
        ) : isSelecting ? (
          <View style={styles.section}>
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
              onPress={handleConfirmSelection}
            />
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
        <TodayRecordSection />
      </View>
      <Modal
        visible={isPending && allVerified && isTabFocused}
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
